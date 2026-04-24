import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  devBypass: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const NOT_CONFIGURED_ERROR = new Error(
  'Supabase n\'est pas configuré. Renseigne .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).',
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Dev sans Supabase → user local persistant pour prévisualiser l'app.
      if (import.meta.env.DEV) {
        const devFlag = localStorage.getItem('aina-dev-bypass');
        if (devFlag === '1') {
          setUser({
            id: 'dev-local-user',
            email: 'dev@aina.local',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as unknown as User);
        }
      }
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

    return () => subscription.unsubscribe();
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

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
  };

  // Dev-only : débloquer la navigation sans Supabase pour prévisualiser l'app.
  // N'a d'effet qu'en dev et quand Supabase n'est pas configuré.
  const devBypass = () => {
    if (import.meta.env.PROD || isSupabaseConfigured) return;
    localStorage.setItem('aina-dev-bypass', '1');
    const fakeUser = {
      id: 'dev-local-user',
      email: 'dev@aina.local',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;
    setUser(fakeUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, isConfigured: isSupabaseConfigured, signIn, signUp, signOut, devBypass }}
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
