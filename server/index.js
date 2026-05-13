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
import { MODEL } from './ai.js';
import {
  handleNutrition,
  handleRedflag,
  handleChat,
  handleNormalizeShopping,
} from './handlers.js';

const PORT = Number(process.env.PORT) || 3001;

if (!process.env.ANTHROPIC_API_KEY) {
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
app.use(express.json({ limit: '10mb' })); // raised to support base64 image uploads (~5MB) used by chat/redflag vision

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, model: MODEL });
});

app.post('/api/nutrition', handleNutrition);
app.post('/api/redflag', handleRedflag);
app.post('/api/chat', handleChat);
app.post('/api/normalize-shopping', handleNormalizeShopping);

app.listen(PORT, () => {
  console.log(`✓ AINA proxy Anthropic prêt sur http://localhost:${PORT}`);
  console.log(`  Model : ${MODEL} · streaming chat · extended thinking redflag`);
  console.log(`  Routes : POST /api/nutrition · POST /api/redflag · POST /api/chat · GET /api/health`);
});
