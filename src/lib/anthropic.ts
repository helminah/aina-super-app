/**
 * Service frontend Anthropic (via proxy Express).
 *
 * Pourquoi un proxy : cf. server/index.js — la clé API reste côté serveur,
 * jamais dans le bundle client.
 *
 * URL backend configurable via VITE_API_URL (utile pour Vercel/Railway en prod).
 * En dev local, fallback sur http://localhost:3001.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────

export interface Recipe {
  title: string;
  ingredients: { name: string; qty: string; notes?: string }[];
  steps: string[];
  nutritionNotes: string;
  texture: string;
  ageRange: string;
  prepMinutes: number;
}

export interface WeeklyMealPlan {
  days: {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  }[];
}

export type RedFlagLevel = 'green' | 'yellow' | 'red';

export interface RedFlagAnalysis {
  level: RedFlagLevel;
  message: string;
  disclaimer: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatReply {
  reply: string;
}

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

class AnthropicApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'AnthropicApiError';
    this.status = status;
  }
}

async function postJson<TResp>(path: string, body: unknown): Promise<TResp> {
  let resp: Response;
  try {
    resp = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // Typiquement : serveur proxy pas démarré
    throw new AnthropicApiError(
      'Proxy Anthropic injoignable. Démarre le serveur avec `npm run server` (ou `npm run dev:full`).',
      0,
    );
  }

  if (!resp.ok) {
    let errorMsg = `Erreur HTTP ${resp.status}`;
    try {
      const j = await resp.json();
      if (j?.error) errorMsg = j.error;
    } catch { /* ignore body parse */ }
    throw new AnthropicApiError(errorMsg, resp.status);
  }

  return (await resp.json()) as TResp;
}

// ────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────

/**
 * Génère une recette adaptée à l'âge + ingrédients + pays.
 * Allergies optionnelles (à fournir pour les exclure strictement).
 */
export function generateRecipe(params: {
  babyAgeMonths: number;
  ingredients: string[];
  country: string;
  allergies?: string[];
}): Promise<Recipe> {
  return postJson<Recipe>('/api/nutrition', {
    action: 'recipe',
    babyAgeMonths: params.babyAgeMonths,
    country: params.country,
    ingredients: params.ingredients,
    allergies: params.allergies ?? [],
  });
}

/**
 * Génère un plan de repas sur 7 jours (4 repas/jour).
 * Les allergies sont strictement exclues.
 */
export function generateWeeklyMealPlan(params: {
  babyAgeMonths: number;
  allergies: string[];
  country: string;
}): Promise<WeeklyMealPlan> {
  return postJson<WeeklyMealPlan>('/api/nutrition', {
    action: 'weekly-plan',
    babyAgeMonths: params.babyAgeMonths,
    country: params.country,
    allergies: params.allergies,
  });
}

/**
 * Analyse des symptômes rapportés → niveau d'urgence + message + disclaimer.
 * Ne diagnostique JAMAIS. Le disclaimer est forcé côté serveur.
 */
export function analyzeRedFlags(params: {
  symptoms: string;
  babyAgeMonths: number;
}): Promise<RedFlagAnalysis> {
  return postJson<RedFlagAnalysis>('/api/redflag', {
    symptoms: params.symptoms,
    babyAgeMonths: params.babyAgeMonths,
  });
}

/**
 * Chatbot conversationnel "Dr Helminah IA".
 * Le client renvoie tout l'historique à chaque tour (limité côté UI).
 */
export function sendChatMessage(params: {
  messages: ChatMessage[];
  babyAgeMonths?: number;
  country?: string;
}): Promise<ChatReply> {
  return postJson<ChatReply>('/api/chat', {
    messages: params.messages,
    babyAgeMonths: params.babyAgeMonths,
    country: params.country,
  });
}

export { AnthropicApiError };
