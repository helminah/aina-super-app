/**
 * Service frontend Anthropic (via proxy Express).
 *
 * Pourquoi un proxy : cf. server/index.js — la clé API reste côté serveur,
 * jamais dans le bundle client.
 *
 * URL backend configurable via VITE_API_URL (utile pour Vercel/Railway en prod).
 * En dev local, fallback sur http://localhost:3001.
 */

// En prod (Vercel), les routes /api/* sont same-origin — pas besoin de VITE_API_URL.
// En dev local, le proxy Vite (/api → localhost:3001) prend le relais.
const API_URL = import.meta.env.VITE_API_URL ?? '';

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
  emoji?: string;
  category?: string;
  kcal?: number;
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
  imageBase64?: string;
  imageMediaType?: string;
}): Promise<RedFlagAnalysis> {
  return postJson<RedFlagAnalysis>('/api/redflag', {
    symptoms: params.symptoms,
    babyAgeMonths: params.babyAgeMonths,
    imageBase64: params.imageBase64,
    imageMediaType: params.imageMediaType,
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

/**
 * Streaming SSE du chatbot — tokens arrivant en temps réel.
 * Le serveur envoie des événements `data: {"token":"..."}` puis `data: {"done":true}`.
 */
export async function streamChatMessage(
  params: { messages: ChatMessage[]; babyAgeMonths?: number; country?: string; imageBase64?: string; imageMediaType?: string; coachMode?: boolean },
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
): Promise<void> {
  let resp: Response;
  try {
    resp = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  } catch {
    onError('Proxy Anthropic injoignable. Démarre le serveur avec `npm run dev:full`.');
    return;
  }

  if (!resp.ok) {
    let errorMsg = `Erreur HTTP ${resp.status}`;
    try { const j = await resp.json(); if (j?.error) errorMsg = j.error; } catch { /* ignore */ }
    onError(errorMsg);
    return;
  }

  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const INACTIVITY_MS = 30_000;
  let aborted = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const clearInactivityTimer = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  const resetInactivityTimer = () => {
    clearInactivityTimer();
    timeoutId = setTimeout(() => {
      aborted = true;
      try { reader.cancel(); } catch { /* ignore */ }
      onError('Connexion perdue. Réessaie.');
    }, INACTIVITY_MS);
  };
  resetInactivityTimer();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (aborted) return;
      if (done) break;
      resetInactivityTimer();
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';
      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith('data: ')) continue;
        try {
          const data = JSON.parse(line.slice(6));
          if (typeof data.error === 'string' && data.error.length > 0) {
            clearInactivityTimer();
            onError(data.error);
            return;
          }
          if (typeof data.token === 'string' && data.token.length > 0) {
            onToken(data.token);
          }
          if (data.done === true) {
            clearInactivityTimer();
            onDone();
            return;
          }
        } catch { /* ignore malformed SSE */ }
      }
    }
  } catch {
    if (aborted) return;
  }
  clearInactivityTimer();
  if (!aborted) onDone();
}

export { AnthropicApiError };
