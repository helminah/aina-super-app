import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, isConfigured, devBypass } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const { error } = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else if (mode === 'signup') {
      toast.success('Compte créé ! Vérifiez votre email 📧');
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-ivory-100">
      {/* Hero mesh gradient */}
      <div className="relative brand-mesh animate-gradient grain overflow-hidden px-6 pt-16 pb-20 flex flex-col items-center text-white safe-top">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-[28%] bg-white/30 blur-2xl scale-110" />
          <img
            src="/aina-logo.png"
            alt="AINA"
            className="relative w-24 h-24 drop-shadow-xl"
            style={{ borderRadius: '28%' }}
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="font-display text-white text-6xl tracking-[0.15em] mt-5 font-medium"
        >
          AINA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-display-intimate text-white/90 text-lg mt-1"
        >
          Souffle de vie
        </motion.p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-ivory-50 rounded-3xl p-6 elev-3 relative z-10"
        >
          {/* Mode toggle */}
          <div className="flex bg-ivory-200 rounded-2xl p-1 mb-6">
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === m ? 'bg-white text-forest-600 shadow-sm' : 'text-bark-500'
                }`}
              >
                {m === 'login' ? 'Connexion' : 'Créer un compte'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-ivory-200 text-bark-800 placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-forest-300 text-sm"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-4 rounded-2xl bg-ivory-200 text-bark-800 placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-forest-300 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-bark-400" /> : <Eye className="w-4 h-4 text-bark-400" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !email || !password}
              className={`w-full py-4 rounded-full font-heading font-bold text-white flex items-center justify-center gap-2 transition-all ${
                loading || !email || !password ? 'opacity-50 cursor-not-allowed bg-forest-400' : 'btn-gradient active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'} <Sparkles className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {!isConfigured && import.meta.env.DEV && (
            <div className="mt-5 pt-5 border-t border-ivory-300">
              <p className="text-[11px] text-bark-400 text-center mb-2">
                Mode dev — Supabase non configuré
              </p>
              <button
                onClick={devBypass}
                className="w-full py-3 rounded-full bg-ivory-200 text-bark-600 font-semibold text-sm hover:bg-ivory-300 transition-colors"
              >
                Continuer en démo locale
              </button>
            </div>
          )}
        </motion.div>

        <p className="text-center text-xs text-bark-400 mt-6 px-4">
          En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </p>
      </div>
    </div>
  );
}
