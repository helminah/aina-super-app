/**
 * AINA — backend proxy Anthropic (Express, dev local).
 * En production, les mêmes routes sont servies par api/*.js (Vercel serverless).
 *
 * Modèle : claude-opus-4-7 (hackathon Anthropic Opus 4.7).
 * Prompt caching : cache_control: ephemeral → ~90% de réduction sur les hits.
 * Streaming SSE sur /api/chat — tokens arrivant token par token.
 * Extended thinking sur /api/redflag — raisonnement clinique approfondi.
 */

import dotenv from 'dotenv';
dotenv.config({ path: ['.env.local', '.env'] });
import express from 'express';
import cors from 'cors';
import { anthropic, MODEL, extractJson, callClaude } from './ai.js';
import { NUTRITION_SYSTEM, CHAT_SYSTEM, REDFLAG_SYSTEM } from './prompts.js';

const PORT = Number(process.env.PORT) || 3001;

if (!process.env.ANTHROPIC_API_KEY) {
  // eslint-disable-next-line no-console
  console.error('✗ ANTHROPIC_API_KEY manquante dans .env.local (ou variables d\'env)');
  process.exit(1);
}

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ],
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: false,
}));
app.use(express.json({ limit: '100kb' }));

// ────────────────────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, model: MODEL });
});

/**
 * POST /api/nutrition
 * body: { action, babyAgeMonths, country, ingredients?, allergies? }
 */
app.post('/api/nutrition', async (req, res) => {
  try {
    const { action, babyAgeMonths, country, ingredients = [], allergies = [] } = req.body ?? {};

    if (typeof babyAgeMonths !== 'number' || babyAgeMonths < 0 || babyAgeMonths > 36) {
      return res.status(400).json({ error: 'babyAgeMonths invalide' });
    }

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
    } else if (action === 'weekly-plan') {
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
    } else {
      return res.status(400).json({ error: 'action invalide (recipe | weekly-plan)' });
    }

    const { text, usage } = await callClaude({
      system: NUTRITION_SYSTEM,
      userMessage,
      maxTokens: action === 'weekly-plan' ? 2048 : 1200,
    });

    const data = extractJson(text);
    res.json({ ...data, _usage: usage });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/nutrition]', err);
    res.status(500).json({ error: err?.message || 'erreur serveur' });
  }
});

/**
 * POST /api/redflag
 * body: { symptoms, babyAgeMonths }
 * Utilise l'extended thinking d'Opus 4.7 pour un raisonnement clinique approfondi.
 */
app.post('/api/redflag', async (req, res) => {
  try {
    const { symptoms, babyAgeMonths, imageBase64, imageMediaType } = req.body ?? {};

    if (typeof symptoms !== 'string' || symptoms.trim().length < 3) {
      return res.status(400).json({ error: 'symptoms requis (description textuelle)' });
    }
    if (typeof babyAgeMonths !== 'number' || babyAgeMonths < 0 || babyAgeMonths > 60) {
      return res.status(400).json({ error: 'babyAgeMonths invalide' });
    }

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
    });

    const data = extractJson(text);

    const forcedDisclaimer = '⚕️ Ceci est une information générale, pas un diagnostic médical. En cas de doute, consultez votre pédiatre.';
    if (!data.disclaimer || !data.disclaimer.includes('diagnostic')) {
      data.disclaimer = forcedDisclaimer;
    }
    if (!['green', 'yellow', 'red'].includes(data.level)) {
      data.level = 'yellow';
    }

    res.json({ ...data, _usage: usage });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/redflag]', err);
    res.status(500).json({ error: err?.message || 'erreur serveur' });
  }
});

/**
 * POST /api/chat — SSE streaming.
 * body: { messages, babyAgeMonths?, country? }
 * Le client lit les événements SSE { token } et reconstruit le message en temps réel.
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, babyAgeMonths, country, imageBase64, imageMediaType } = req.body ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages requis (array non vide)' });
    }
    if (messages.length > 20) {
      return res.status(400).json({ error: 'Historique trop long (max 20 messages)' });
    }
    for (const m of messages) {
      if (!m?.role || !['user', 'assistant'].includes(m.role)) {
        return res.status(400).json({ error: 'Rôle message invalide' });
      }
      if (typeof m.content !== 'string' || m.content.trim().length === 0) {
        return res.status(400).json({ error: 'Contenu message invalide' });
      }
    }

    const contextualizedMessages = [...messages];
    if (babyAgeMonths != null && contextualizedMessages.length === 1) {
      contextualizedMessages[0] = {
        ...contextualizedMessages[0],
        content: `[Contexte bébé : ${babyAgeMonths} mois${country ? `, ${country}` : ''}]\n\n${contextualizedMessages[0].content}`,
      };
    }

    // Si une image est jointe, on la place dans le dernier message utilisateur.
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
    res.flushHeaders();

    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 800,
      system: [{ type: 'text', text: CHAT_SYSTEM, cache_control: { type: 'ephemeral' } }],
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
});

/**
 * POST /api/normalize-shopping
 * body: { items: [{name, qty, emoji}] }
 * Normalise la liste pour le marché : supprime eau/liquides non achetables,
 * convertit en équivalents pratiques (320g → "2 patates moyennes").
 */
app.post('/api/normalize-shopping', async (req, res) => {
  try {
    const { items } = req.body ?? {};
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items requis' });

    const itemsText = items.map(i => `${i.emoji} ${i.name}: ${i.qty}`).join('\n');
    const userMessage = `Voici une liste de courses automatique générée pour des recettes bébé :
${itemsText}

Normalise cette liste pour qu'une maman puisse l'utiliser au marché africain. Règles strictes :
- SUPPRIME : eau, eau de cuisson, eau chaude, eau froide, eau tiède (non achetable)
- CONVERTIS en équivalents pratiques : "320g patate douce" → "2 patates douces moyennes", "15 gouttes citron" → "½ citron", "200ml lait" → déjà exclu
- Si quantité déjà claire (ex: "3 carottes"), garde-la
- Garde le même emoji
- Réponds UNIQUEMENT en JSON valide : [{"name":"...","qty":"...","emoji":"..."}]`;

    const { text } = await callClaude({ system: 'Tu es un assistant de cuisine pour mamans africaines. Tu normalises les listes de courses en équivalents pratiques pour le marché local. Réponds toujours en JSON valide uniquement.', userMessage, maxTokens: 600 });
    const data = extractJson(text);
    res.json({ items: Array.isArray(data) ? data : [] });
  } catch (err) {
    console.error('[api/normalize-shopping]', err);
    res.status(500).json({ error: err?.message || 'erreur serveur' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`✓ AINA proxy Anthropic prêt sur http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`  Model : ${MODEL} · streaming chat · extended thinking redflag`);
  // eslint-disable-next-line no-console
  console.log(`  Routes : POST /api/nutrition · POST /api/redflag · POST /api/chat · GET /api/health`);
});
