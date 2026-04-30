/**
 * Shared route handlers used by both the Express dev server (server/index.js)
 * and the Vercel serverless wrappers (api/*.js). This is the single source of
 * truth for input validation, rate limiting, and AI call orchestration.
 */
import { z } from 'zod';
import { anthropic, MODEL_CHAT, MODEL_REDFLAG, MODEL_NUTRITION, MODEL_NORMALIZE, extractJson, callClaude } from './ai.js';
import { NUTRITION_SYSTEM, CHAT_SYSTEM, CHAT_COACH_SYSTEM, REDFLAG_SYSTEM } from './prompts.js';

const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const FORCED_DISCLAIMER = '⚕️ Ceci est une information générale, pas un diagnostic médical. En cas de doute, consultez votre pédiatre.';

function ensureApiKey(res) {
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(503).json({
      error: 'Configuration serveur incomplète : ANTHROPIC_API_KEY absente. Si tu es admin, vérifie les variables d\'environnement Vercel (Preview + Production).',
    });
    return false;
  }
  return true;
}

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.socket?.remoteAddress
    || 'unknown';
}

export function rateLimit({ windowMs, max }) {
  const buckets = new Map();
  return function check(req) {
    const ip = getClientIp(req);
    const now = Date.now();
    const entry = buckets.get(ip);
    if (!entry || entry.resetAt <= now) {
      buckets.set(ip, { count: 1, resetAt: now + windowMs });
      return { ok: true };
    }
    if (entry.count >= max) {
      return { ok: false };
    }
    entry.count += 1;
    return { ok: true };
  };
}

const chatLimiter = rateLimit({ windowMs: 60_000, max: 30 });
const nutritionLimiter = rateLimit({ windowMs: 60_000, max: 30 });
const normalizeShoppingLimiter = rateLimit({ windowMs: 60_000, max: 30 });
const redflagLimiter = rateLimit({ windowMs: 60_000, max: 10 });

function tooMany(res) {
  return res.status(429).json({ error: 'Trop de requêtes, réessaie dans une minute.' });
}

function firstZodMessage(err) {
  return err?.issues?.[0]?.message || err?.message || 'Requête invalide';
}

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1, 'Contenu message invalide'),
});

const ChatBodySchema = z.object({
  messages: z.array(ChatMessageSchema).min(1, 'messages requis (array non vide)').max(20, 'Historique trop long (max 20 messages)'),
  babyAgeMonths: z.number().min(0).max(60).optional().nullable(),
  country: z.string().optional().nullable(),
  imageBase64: z.string().optional().nullable(),
  imageMediaType: z.string().optional().nullable(),
  coachMode: z.boolean().optional().default(false),
});

const NutritionBodySchema = z.object({
  action: z.enum(['recipe', 'weekly-plan'], { message: 'action invalide (recipe | weekly-plan)' }),
  babyAgeMonths: z.number().min(0).max(36, 'babyAgeMonths invalide'),
  country: z.string().optional().nullable(),
  ingredients: z.array(z.string()).optional().default([]),
  allergies: z.array(z.string()).optional().default([]),
});

const RedflagBodySchema = z.object({
  symptoms: z.string().trim().min(3, 'symptoms requis (description textuelle)'),
  babyAgeMonths: z.number().min(0).max(60, 'babyAgeMonths invalide'),
  imageBase64: z.string().optional().nullable(),
  imageMediaType: z.string().optional().nullable(),
});

const NormalizeShoppingBodySchema = z.object({
  items: z.array(z.object({
    name: z.string(),
    qty: z.string(),
    emoji: z.string().optional().default(''),
  })).min(1, 'items requis'),
});

const RedflagOutputSchema = z.object({
  level: z.enum(['green', 'yellow', 'red']),
  message: z.string().min(1),
  disclaimer: z.string().min(1),
});

const RecipeOutputSchema = z.object({
  title: z.string().min(1),
  ingredients: z.array(z.any()).min(1),
  steps: z.array(z.any()).min(1),
}).passthrough();

export async function handleNutrition(req, res) {
  if (!ensureApiKey(res)) return;
  if (!nutritionLimiter(req).ok) return tooMany(res);

  const parsed = NutritionBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: firstZodMessage(parsed.error) });
  }
  const { action, babyAgeMonths, country, ingredients, allergies } = parsed.data;

  try {
    let userMessage;
    if (action === 'recipe') {
      userMessage = `Bébé : ${babyAgeMonths} mois, ${country || 'contexte non précisé'}.
Allergies connues : ${allergies.length ? allergies.join(', ') : 'aucune'}.
Ingrédients disponibles : ${ingredients.length ? ingredients.join(', ') : 'libre choix selon l\'âge'}.

Génère UNE recette adaptée. Réponds UNIQUEMENT en JSON selon ce schéma exact :
{
  "title": "Nom évocateur (FR)",
  "emoji": "un seul emoji représentatif du plat (ex: 🍠, 🥣, 🍲, 🥕, 🍌)",
  "category": "petit-dejeuner | dejeuner | gouter | diner | dessert",
  "kcal": 85,
  "ingredients": [ { "name": "...", "qty": "...", "notes": "optionnel" } ],
  "steps": [ "étape 1", "étape 2", "..." ],
  "nutritionNotes": "ce que cette recette apporte (fer, vitamines, protéines...)",
  "texture": "purée lisse | moulinée | petits morceaux | ...",
  "ageRange": "${babyAgeMonths} mois+",
  "prepMinutes": 15
}`;
    } else {
      userMessage = `Bébé : ${babyAgeMonths} mois, ${country || 'contexte non précisé'}.
Allergies connues : ${allergies.length ? allergies.join(', ') : 'aucune'}.

Génère un plan de repas équilibré pour 7 jours (lundi à dimanche), avec 4 repas par jour.
Varie les apports nutritionnels (fer, calcium, vitamines, protéines).
Utilise des ingrédients adaptés à l'âge et privilégie le local (${country || 'variable'}).

Réponds UNIQUEMENT en JSON selon ce schéma exact :
{
  "days": [
    {
      "day": "Lundi",
      "breakfast": "courte description",
      "lunch": "courte description",
      "dinner": "courte description",
      "snack": "courte description"
    }
  ]
}`;
    }

    const { text, usage } = await callClaude({
      system: NUTRITION_SYSTEM,
      userMessage,
      maxTokens: action === 'weekly-plan' ? 2048 : 1200,
      model: MODEL_NUTRITION,
    });

    const data = extractJson(text);

    if (action === 'recipe') {
      const validated = RecipeOutputSchema.safeParse(data);
      if (!validated.success) {
        // eslint-disable-next-line no-console
        console.warn('[api/nutrition] recipe schema validation failed:', validated.error?.issues);
        return res.json({
          title: 'Recette indisponible',
          emoji: '🥣',
          category: 'dejeuner',
          kcal: 0,
          ingredients: [],
          steps: ['Désolé, la recette n\'a pas pu être générée. Réessaie dans un instant.'],
          nutritionNotes: '',
          texture: '',
          ageRange: `${babyAgeMonths} mois+`,
          prepMinutes: 0,
          _usage: usage,
        });
      }
    }

    res.json({ ...data, _usage: usage });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/nutrition]', err);
    res.status(500).json({ error: err?.message || 'erreur serveur' });
  }
}

export async function handleRedflag(req, res) {
  if (!ensureApiKey(res)) return;
  if (!redflagLimiter(req).ok) return tooMany(res);

  const parsed = RedflagBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: firstZodMessage(parsed.error) });
  }
  const { symptoms, babyAgeMonths, imageBase64, imageMediaType } = parsed.data;

  if (imageBase64 && imageMediaType && !ALLOWED_IMAGE_MIME.includes(imageMediaType)) {
    return res.status(400).json({ error: 'Type d\'image non supporté (jpeg, png ou webp uniquement)' });
  }

  try {
    const userMessage = `Bébé de ${babyAgeMonths} mois.
Symptômes/observations rapportés par le parent :
"""
${symptoms.trim()}
"""

Analyse et classe en green / yellow / red selon les règles.
Réponds UNIQUEMENT en JSON selon ce schéma exact :
{
  "level": "green" | "yellow" | "red",
  "message": "2-4 phrases qui expliquent quoi faire (jamais un diagnostic)",
  "disclaimer": "⚕️ Ceci est une information générale, pas un diagnostic médical. En cas de doute, consultez votre pédiatre."
}`;

    const { text, usage } = await callClaude({
      system: REDFLAG_SYSTEM,
      userMessage,
      maxTokens: 3000,
      thinking: true,
      imageBase64: imageBase64 ?? null,
      imageMediaType: imageMediaType ?? 'image/jpeg',
      model: MODEL_REDFLAG,
    });

    let data;
    try {
      data = extractJson(text);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[api/redflag] JSON parse failed:', e?.message);
      data = {};
    }

    if (!data.disclaimer || !String(data.disclaimer).includes('diagnostic')) {
      data.disclaimer = FORCED_DISCLAIMER;
    }
    if (!['green', 'yellow', 'red'].includes(data.level)) {
      data.level = 'yellow';
    }

    const validated = RedflagOutputSchema.safeParse(data);
    if (!validated.success) {
      // eslint-disable-next-line no-console
      console.warn('[api/redflag] output schema validation failed:', validated.error?.issues);
      return res.json({
        level: 'yellow',
        message: 'Consulte ton pédiatre dans les 24h par précaution.',
        disclaimer: FORCED_DISCLAIMER,
        _usage: usage,
      });
    }

    res.json({ ...validated.data, _usage: usage });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/redflag]', err);
    res.status(500).json({ error: err?.message || 'erreur serveur' });
  }
}

export async function handleChat(req, res) {
  if (!ensureApiKey(res)) return;
  if (!chatLimiter(req).ok) return tooMany(res);

  const parsed = ChatBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: firstZodMessage(parsed.error) });
  }
  const { messages, babyAgeMonths, country, imageBase64, imageMediaType, coachMode } = parsed.data;

  if (imageBase64 && imageMediaType && !ALLOWED_IMAGE_MIME.includes(imageMediaType)) {
    return res.status(400).json({ error: 'Type d\'image non supporté (jpeg, png ou webp uniquement)' });
  }
  if (imageBase64 && imageBase64.length > 7_000_000) {
    return res.status(400).json({ error: 'Image trop volumineuse (max ~5MB binaire / ~7MB base64).' });
  }
  const systemPrompt = coachMode ? CHAT_COACH_SYSTEM : CHAT_SYSTEM;

  try {
    const contextualizedMessages = [...messages];
    if (babyAgeMonths != null && contextualizedMessages.length === 1) {
      contextualizedMessages[0] = {
        ...contextualizedMessages[0],
        content: `[Contexte bébé : ${babyAgeMonths} mois${country ? `, ${country}` : ''}]\n\n${contextualizedMessages[0].content}`,
      };
    }

    if (imageBase64) {
      const lastIdx = contextualizedMessages.length - 1;
      const last = contextualizedMessages[lastIdx];
      if (last.role === 'user') {
        contextualizedMessages[lastIdx] = {
          ...last,
          content: [
            { type: 'image', source: { type: 'base64', media_type: imageMediaType ?? 'image/jpeg', data: imageBase64 } },
            { type: 'text', text: typeof last.content === 'string' ? last.content : '' },
          ],
        };
      }
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (typeof res.flushHeaders === 'function') res.flushHeaders();

    const stream = anthropic.messages.stream({
      model: MODEL_CHAT,
      max_tokens: 1500,
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral', ttl: '1h' } }],
      messages: contextualizedMessages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ token: event.delta.text })}\n\n`);
      }
    }

    const final = await stream.finalMessage();
    res.write(`data: ${JSON.stringify({ done: true, _usage: final.usage })}\n\n`);
    res.end();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/chat]', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err?.message || 'erreur serveur' });
    } else {
      res.write(`data: ${JSON.stringify({ error: err?.message || 'erreur serveur' })}\n\n`);
      res.end();
    }
  }
}

export async function handleNormalizeShopping(req, res) {
  if (!ensureApiKey(res)) return;
  if (!normalizeShoppingLimiter(req).ok) return tooMany(res);

  const parsed = NormalizeShoppingBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: firstZodMessage(parsed.error) });
  }
  const { items } = parsed.data;

  try {
    const itemsText = items.map(i => `${i.emoji} ${i.name}: ${i.qty}`).join('\n');
    const userMessage = `Voici une liste de courses automatique générée pour des recettes bébé :
${itemsText}

Normalise cette liste pour qu'une maman puisse l'utiliser au marché africain. Règles strictes :
- SUPPRIME : eau, eau de cuisson, eau chaude, eau froide, eau tiède (non achetable)
- CONVERTIS en équivalents pratiques : "320g patate douce" → "2 patates douces moyennes", "15 gouttes citron" → "½ citron", "200ml lait" → déjà exclu
- Si quantité déjà claire (ex: "3 carottes"), garde-la
- Garde le même emoji
- Réponds UNIQUEMENT en JSON valide : [{"name":"...","qty":"...","emoji":"..."}]`;

    const { text } = await callClaude({
      system: 'Tu es un assistant de cuisine pour mamans africaines. Tu normalises les listes de courses en équivalents pratiques pour le marché local. Réponds toujours en JSON valide uniquement.',
      userMessage,
      maxTokens: 600,
      model: MODEL_NORMALIZE,
    });
    const data = extractJson(text);
    res.json({ items: Array.isArray(data) ? data : [] });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/normalize-shopping]', err);
    res.status(500).json({ error: err?.message || 'erreur serveur' });
  }
}
