/**
 * Client Anthropic partagé entre Express (dev) et Vercel (prod).
 * Importé par server/index.js et api/*.js.
 */
import dotenv from 'dotenv';
dotenv.config({ path: ['.env.local', '.env'] });
import Anthropic from '@anthropic-ai/sdk';

export const MODEL = 'claude-opus-4-7';

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export function extractJson(text) {
  const trimmed = (text ?? '').trim();
  try { return JSON.parse(trimmed); } catch { /* try next */ }
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch { /* fall through */ } }
  throw new Error('Réponse Claude non parseable en JSON : ' + trimmed.slice(0, 200));
}

/**
 * Appel Claude standard (non-streaming) avec prompt caching.
 * `thinking: true` active l'extended thinking d'Opus 4.7.
 * `imageBase64` + `imageMediaType` activent la vision multimodale d'Opus 4.7.
 */
export async function callClaude({
  system,
  userMessage,
  maxTokens = 2048,
  thinking = false,
  imageBase64 = null,
  imageMediaType = 'image/jpeg',
}) {
  const userContent = imageBase64
    ? [
        { type: 'image', source: { type: 'base64', media_type: imageMediaType, data: imageBase64 } },
        { type: 'text', text: userMessage },
      ]
    : userMessage;

  const params = {
    model: MODEL,
    max_tokens: maxTokens,
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userContent }],
  };
  if (thinking) {
    params.thinking = { type: 'enabled', budget_tokens: Math.min(maxTokens - 500, 2000) };
  }
  const resp = await anthropic.messages.create(params);
  const textBlock = resp.content.find(b => b.type === 'text');
  if (!textBlock) throw new Error('Réponse Claude sans bloc texte');
  return { text: textBlock.text, usage: resp.usage };
}
