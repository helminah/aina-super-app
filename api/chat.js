import { anthropic, MODEL } from '../server/ai.js';
import { CHAT_SYSTEM } from '../server/prompts.js';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, babyAgeMonths, country } = req.body ?? {};
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
    console.error('[api/chat]', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err?.message || 'erreur serveur' });
    } else {
      res.write(`data: ${JSON.stringify({ error: err?.message || 'erreur serveur' })}\n\n`);
      res.end();
    }
  }
}
