import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = typeof rawUrl === 'string' && /^https?:\/\//i.test(rawUrl);
const isValidKey = typeof rawKey === 'string' && rawKey.length > 10 && !rawKey.startsWith('your_');

export const isSupabaseConfigured = isValidUrl && isValidKey;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    '[AINA] Supabase non configuré : renseigne VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY dans .env.local. L\'app tourne en mode local (pas d\'auth cloud).',
  );
}

// Client factice (URL valide) quand l'env n'est pas configuré : évite le crash
// du validateur supabase-js au boot. Aucun appel ne doit être fait dessus —
// `isSupabaseConfigured` garde chaque usage dans AuthContext.
const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'placeholder-anon-key';

export const supabase: SupabaseClient = createClient(
  isValidUrl ? rawUrl : FALLBACK_URL,
  isValidKey ? rawKey : FALLBACK_KEY,
);
