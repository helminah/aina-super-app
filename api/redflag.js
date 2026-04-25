import { callClaude, extractJson } from '../server/ai.js';
import { REDFLAG_SYSTEM } from '../server/prompts.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
    console.error('[api/redflag]', err);
    res.status(500).json({ error: err?.message || 'erreur serveur' });
  }
}
