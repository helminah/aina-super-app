import { callClaude, extractJson } from '../server/ai.js';

const SYSTEM = `Tu es un assistant qui prépare des listes de courses pour des mamans africaines et européennes avec des bébés.
Tu reçois une liste d'ingrédients bruts et tu dois :
1. SUPPRIMER : eau, eau de cuisson, eau chaude, eau froide, eau tiède, eau bouillante (non achetable)
2. CONVERTIR en quantités pratiques pour le marché :
   - "15 gouttes jus de citron" → "1 citron (environ)"
   - "320g patate douce" → "2 patates douces moyennes (environ)"
   - "200ml lait" → déjà exclu (lait non inclus)
   - "1 pincée sel" → "sel (1 pincée)"
3. CATÉGORISER par type : Légumes, Fruits, Céréales & féculents, Protéines, Épices & condiments, Autres
4. Ajouter "environ X [unité]" quand c'est utile (environ 2 carottes, environ 1 citron)
5. Répondre UNIQUEMENT en JSON valide selon ce schéma exact :
{
  "categories": [
    {
      "name": "Légumes",
      "emoji": "🥕",
      "items": [
        { "name": "Carotte", "qty": "environ 3 carottes", "emoji": "🥕" }
      ]
    }
  ]
}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { items, babyName, planDays } = req.body ?? {};
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items requis' });

    const itemsText = items.map(i => `${i.emoji} ${i.name}: ${i.qty}`).join('\n');
    const userMessage = `Liste de courses pour ${babyName ?? 'bébé'} (plan ${planDays ?? '?'} jours) :\n${itemsText}\n\nCatégorise, convertis et nettoie cette liste.`;

    const { text } = await callClaude({ system: SYSTEM, userMessage, maxTokens: 1500 });
    const data = extractJson(text);
    res.json(data);
  } catch (err) {
    console.error('[api/shopping-pdf]', err);
    res.status(500).json({ error: err?.message || 'erreur serveur' });
  }
}
