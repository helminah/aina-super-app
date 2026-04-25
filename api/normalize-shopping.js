import { callClaude, extractJson } from '../server/ai.js';

const SYSTEM = 'Tu es un assistant de cuisine pour mamans africaines. Tu normalises les listes de courses en équivalents pratiques pour le marché local. Réponds toujours en JSON valide uniquement.';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { items } = req.body ?? {};
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items requis' });

    const itemsText = items.map(i => `${i.emoji} ${i.name}: ${i.qty}`).join('\n');
    const userMessage = `Liste de courses pour recettes bébé :
${itemsText}

Normalise pour le marché. Règles :
- SUPPRIME : eau, eau de cuisson, eau chaude, eau froide, eau tiède
- CONVERTIS : "320g patate douce" → "2 patates douces moyennes", "15 gouttes citron" → "½ citron"
- Garde les quantités déjà claires
- Même emoji
- JSON uniquement : [{"name":"...","qty":"...","emoji":"..."}]`;

    const { text } = await callClaude({ system: SYSTEM, userMessage, maxTokens: 600 });
    const data = extractJson(text);
    res.json({ items: Array.isArray(data) ? data : [] });
  } catch (err) {
    console.error('[api/normalize-shopping]', err);
    res.status(500).json({ error: err?.message || 'erreur serveur' });
  }
}
