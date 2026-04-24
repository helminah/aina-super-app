/**
 * AINA — backend proxy Anthropic (Express).
 *
 * Pourquoi un proxy :
 *  - La clé ANTHROPIC_API_KEY ne doit JAMAIS arriver dans le bundle client
 *  - Contourne la restriction CORS du endpoint api.anthropic.com
 *  - Permet de mutualiser le prompt caching sur le system prompt
 *
 * 2 routes :
 *   POST /api/nutrition  { action: 'recipe' | 'weekly-plan', ... } → JSON structuré
 *   POST /api/redflag    { symptoms, babyAgeMonths } → { level, message, disclaimer }
 *
 * Modèle : claude-haiku-4-5 (rapide, adapté aux réponses courtes structurées).
 * Prompt caching : system prompt + contexte food-guide sont marqués
 *   cache_control: ephemeral → tarif divisé par ~10 sur les hits (5 min TTL).
 */

import dotenv from 'dotenv';
// Vite écrit dans .env.local, donc on le priorise (puis .env en fallback).
dotenv.config({ path: ['.env.local', '.env'] });
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { FOOD_GUIDE_CONTEXT } from './food-guide-context.js';

const PORT = Number(process.env.PORT) || 3001;
const MODEL = 'claude-haiku-4-5-20251001';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  // eslint-disable-next-line no-console
  console.error('✗ ANTHROPIC_API_KEY manquante dans .env.local (ou variables d\'env)');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey });

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
// System prompts (cachés — ne changent pas entre requêtes)
// ────────────────────────────────────────────────────────────────

const NUTRITION_SYSTEM = `Tu es une nutritionniste pédiatrique experte en alimentation africaine et européenne. Tu génères des recettes et plans de repas adaptés à l'âge exact du bébé, avec textures selon la dentition, valeurs nutritionnelles estimées, et conseils de préparation locale. Tu réponds en français.

Contraintes strictes :
- Aucun sel, sucre ajouté, ni miel avant 12 mois.
- Textures adaptées : purée lisse (4-6m), moulinée (6-9m), petits morceaux fondants (9-12m), morceaux taille bouchée (12-24m).
- Si des allergènes sont listés, les ÉVITER totalement.
- Privilégier les ingrédients locaux (africains pour Afrique subsaharienne, européens pour Europe).
- Réponse EXCLUSIVEMENT en JSON valide selon le schéma demandé, sans markdown, sans \`\`\`, sans texte avant/après.

${FOOD_GUIDE_CONTEXT}`;

const CHAT_SYSTEM = `Tu es AINA IA, une assistante virtuelle pour les parents francophones dans les questions quotidiennes de santé et nutrition de leur bébé (0-24 mois). Tu accompagnes, tu ne représentes personne — tu es juste un outil d'aide.

Ton ton : chaleureux, rassurant, pédagogique, précis. Tu tutoies le parent.

RÈGLES STRICTES :
- Tu ne diagnostiques JAMAIS.
- Si la question décrit des symptômes urgents (fièvre bébé <3 mois, convulsions, raideur nuque, éruption, refus total de boire >6h, somnolence anormale, lèvres bleues), oriente IMMÉDIATEMENT vers le SAMU (15 / 1515 / 117) et arrête d'expliquer — l'urgence d'abord.
- Pour toute question clinique sérieuse (dose médicament précise, symptôme persistant, doute), oriente vers un pédiatre.
- Réponses concises (2-5 phrases max sauf demande explicite).
- Pas de markdown lourd, pas de titres — texte simple naturel.
- Contexte : calendrier vaccinal PEV (Afrique) ou européen selon pays bébé. Aliments locaux valorisés.
- Termine une fois sur deux par une phrase rassurante ou un conseil pratique.

Disclaimer obligatoire à la FIN de chaque réponse (nouvelle ligne) :
"— AINA IA · Ceci ne remplace pas l'avis de ton pédiatre."

${FOOD_GUIDE_CONTEXT}`;

const REDFLAG_SYSTEM = `Tu es une pédiatre. Tu identifies uniquement les SIGNES D'ALERTE qui nécessitent une attention médicale.

RÈGLES ABSOLUES :
- Tu ne diagnostiques JAMAIS.
- Tu donnes 3 niveaux d'urgence :
  • green  (🟢) = SURVEILLER : pas urgent, observer à la maison, reconsulter si évolution
  • yellow (🟡) = CONSULTER_24H : voir un médecin dans les 24h
  • red    (🔴) = URGENCE_IMMEDIATE : appeler immédiatement le SAMU (15 / 1515 / 117 selon pays) ou aller aux urgences
- Tu termines TOUJOURS par le disclaimer médical.
- Ta réponse doit être EXCLUSIVEMENT un JSON valide selon le schéma demandé, sans markdown, sans \`\`\`, sans texte avant/après.

Disclaimer obligatoire à inclure : "⚕️ Ceci est une information générale, pas un diagnostic médical. En cas de doute, consultez votre pédiatre."

Signes urgence chez bébé : fièvre ≥38°C avant 3 mois, convulsions, raideur de la nuque, éruption rouge non-blanchissante, respiration difficile, lèvres bleues, pleurs inconsolables > 2h, refus total de boire > 6h, somnolence anormale, vomissements répétés avec fontanelle creuse (déshydratation).`;

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

/** Extrait le JSON de la réponse Claude, tolérant aux variations. */
function extractJson(text) {
  const trimmed = (text ?? '').trim();
  try { return JSON.parse(trimmed); } catch { /* try next */ }
  // Parfois Claude enveloppe en ```json ... ```
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch { /* fall through */ }
  }
  throw new Error('Réponse Claude non parseable en JSON : ' + trimmed.slice(0, 200));
}

/** Appel Claude avec prompt caching sur le system prompt. */
async function callClaude({ system, userMessage, maxTokens = 2048, temperature = 0.7 }) {
  const resp = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    temperature,
    // Caching du system prompt (stable → permet cache hit sur les appels suivants).
    system: [
      { type: 'text', text: system, cache_control: { type: 'ephemeral' } },
    ],
    messages: [
      { role: 'user', content: userMessage },
    ],
  });

  const textBlock = resp.content.find(b => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Réponse Claude sans bloc texte');
  }
  return { text: textBlock.text, usage: resp.usage };
}

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
      temperature: 0.8,
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
 */
app.post('/api/redflag', async (req, res) => {
  try {
    const { symptoms, babyAgeMonths } = req.body ?? {};

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
      maxTokens: 600,
      temperature: 0.2, // faible pour la cohérence médicale
    });

    const data = extractJson(text);

    // Sécurité : on force toujours le disclaimer côté serveur (même si le modèle l'omet).
    const forcedDisclaimer = '⚕️ Ceci est une information générale, pas un diagnostic médical. En cas de doute, consultez votre pédiatre.';
    if (!data.disclaimer || !data.disclaimer.includes('diagnostic')) {
      data.disclaimer = forcedDisclaimer;
    }
    // Validation niveau
    if (!['green', 'yellow', 'red'].includes(data.level)) {
      data.level = 'yellow'; // fallback prudent
    }

    res.json({ ...data, _usage: usage });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/redflag]', err);
    res.status(500).json({ error: err?.message || 'erreur serveur' });
  }
});

/**
 * POST /api/chat
 * body: { messages: [{role: 'user'|'assistant', content: string}, ...], babyAgeMonths?, country? }
 * Conversation — le client envoie tout l'historique à chaque tour (limité ~10 tours côté UI).
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, babyAgeMonths, country } = req.body ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages requis (array non vide)' });
    }
    // Limite défensive de 20 tours max (10 user + 10 assistant)
    if (messages.length > 20) {
      return res.status(400).json({ error: 'Historique trop long (max 20 messages)' });
    }

    // Valide la shape
    for (const m of messages) {
      if (!m?.role || !['user', 'assistant'].includes(m.role)) {
        return res.status(400).json({ error: 'Rôle message invalide' });
      }
      if (typeof m.content !== 'string' || m.content.trim().length === 0) {
        return res.status(400).json({ error: 'Contenu message invalide' });
      }
    }

    // On préfixe un bref contexte bébé au premier message user si fourni
    const contextualizedMessages = [...messages];
    if (babyAgeMonths != null && contextualizedMessages.length === 1) {
      contextualizedMessages[0] = {
        ...contextualizedMessages[0],
        content: `[Contexte bébé : ${babyAgeMonths} mois${country ? `, ${country}` : ''}]\n\n${contextualizedMessages[0].content}`,
      };
    }

    const resp = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 800,
      temperature: 0.6,
      system: [
        { type: 'text', text: CHAT_SYSTEM, cache_control: { type: 'ephemeral' } },
      ],
      messages: contextualizedMessages,
    });

    const textBlock = resp.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('Réponse Claude sans bloc texte');
    }
    res.json({ reply: textBlock.text, _usage: resp.usage });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/chat]', err);
    res.status(500).json({ error: err?.message || 'erreur serveur' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`✓ AINA proxy Anthropic prêt sur http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`  Model : ${MODEL}`);
  // eslint-disable-next-line no-console
  console.log(`  Routes : POST /api/nutrition · POST /api/redflag · POST /api/chat · GET /api/health`);
});
