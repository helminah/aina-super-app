import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { App, type URLOpenListenerEvent } from '@capacitor/app';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const isNative = Capacitor.isNativePlatform();
const NATIVE_REDIRECT = 'com.aina.superapp://login-callback';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  sendPhoneOtp: (phone: string) => Promise<{ error: Error | null }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const GUEST_USER_ID = 'guest-user';
const GUEST_FLAG = 'aina-guest-mode';

const AuthContext = createContext<AuthContextType | null>(null);

const NOT_CONFIGURED_ERROR = new Error(
  'Supabase n\'est pas configuré. Renseigne .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).',
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mode invité (fonctionne toujours, même avec Supabase configuré).
    // Aucune donnée cloud, tout reste en localStorage.
    if (localStorage.getItem(GUEST_FLAG) === '1') {
      setUser({
        id: GUEST_USER_ID,
        email: 'invité@aina.local',
        app_metadata: {},
        user_metadata: { guest: true },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
      })
      .catch(() => { /* réseau/credentials invalides — on laisse l'AuthPage */ })
      .finally(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Native : intercepte le retour OAuth (com.aina.superapp://login-callback?code=…)
    // et échange le code contre une session avant de fermer l'in-app browser.
    let removeUrlListener: (() => void) | undefined;
    if (isNative) {
      const handle = App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
        try {
          const url = new URL(event.url);
          const code = url.searchParams.get('code');
          if (!code) return;
          await supabase.auth.exchangeCodeForSession(code);
        } finally {
          try { await Browser.close(); } catch { /* deja fermé */ }
        }
      });
      removeUrlListener = () => { handle.then(h => h.remove()); };
    }

    return () => {
      subscription.unsubscribe();
      removeUrlListener?.();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_ERROR };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_ERROR };
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const sendPhoneOtp = async (phone: string) => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_ERROR };
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { shouldCreateUser: true },
    });
    return { error };
  };

  const verifyPhoneOtp = async (phone: string, token: string) => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_ERROR };
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED_ERROR };

    if (isNative) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: NATIVE_REDIRECT, skipBrowserRedirect: true },
      });
      if (error) return { error };
      if (data?.url) await Browser.open({ url: data.url, windowName: '_self' });
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    return { error };
  };

  const isGuest = user?.id === GUEST_USER_ID;

  const signOut = async () => {
    if (isGuest) {
      localStorage.removeItem(GUEST_FLAG);
      setUser(null);
      setSession(null);
      return;
    }
    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
  };

  // Mode invité universel — donne accès à l'app sans compte.
  // Toutes les données restent locales (aucun push Supabase).
  const continueAsGuest = () => {
    localStorage.setItem(GUEST_FLAG, '1');
    setUser({
      id: GUEST_USER_ID,
      email: 'invité@aina.local',
      app_metadata: {},
      user_metadata: { guest: true },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, isConfigured: isSupabaseConfigured, isGuest, signIn, signUp, sendPhoneOtp, verifyPhoneOtp, signInWithGoogle, signOut, continueAsGuest }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
