import { MODEL } from '../server/ai.js';

export default function handler(_req, res) {
  res.json({ ok: true, model: MODEL });
}
