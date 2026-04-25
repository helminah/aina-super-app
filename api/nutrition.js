import { callClaude, extractJson } from '../server/ai.js';
import { NUTRITION_SYSTEM } from '../server/prompts.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
    console.error('[api/nutrition]', err);
    res.status(500).json({ error: err?.message || 'erreur serveur' });
  }
}
