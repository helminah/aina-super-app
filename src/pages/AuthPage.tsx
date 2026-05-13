import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { AinaLogo } from '@/components/AinaLogo';
import { COUNTRIES, COUNTRY_BY_CODE } from '@/data/countries';

const DEFAULT_PHONE_COUNTRY = 'senegal';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('phone');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneCountry, setPhoneCountry] = useState(DEFAULT_PHONE_COUNTRY);
  const [phone, setPhone] = useState(COUNTRY_BY_CODE[DEFAULT_PHONE_COUNTRY].phoneCode);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signUp, sendPhoneOtp, verifyPhoneOtp, signInWithGoogle, isConfigured, continueAsGuest } = useAuth();
  const { t } = useTranslation();

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setGoogleLoading(false);
      toast.error(error.message);
    }
    // Pas de reset si succès : redirection OAuth en cours.
  };

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
      toast.success(t('auth.signup_success'));
    }
  };

  const normalizePhone = (value: string) => value.replace(/[^\d+]/g, '').replace(/^00/, '+');

  const handlePhoneCountryChange = (code: string) => {
    const nextPrefix = COUNTRY_BY_CODE[code]?.phoneCode ?? '';
    const previousPrefix = COUNTRY_BY_CODE[phoneCountry]?.phoneCode ?? '';
    setPhoneCountry(code);
    setOtpSent(false);
    setOtp('');
    setPhone(current => {
      const trimmed = current.trim();
      if (!trimmed || trimmed === previousPrefix || trimmed.startsWith(previousPrefix)) {
        return `${nextPrefix}${trimmed.slice(previousPrefix.length)}`;
      }
      return nextPrefix;
    });
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizePhone(phone);
    if (!normalized.startsWith('+') || normalized.length < 8) {
      toast.error(t('auth.phone_invalid'));
      return;
    }
    setLoading(true);
    const { error } = otpSent
      ? await verifyPhoneOtp(normalized, otp.trim())
      : await sendPhoneOtp(normalized);
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    if (!otpSent) {
      setPhone(normalized);
      setOtpSent(true);
      toast.success(t('auth.phone_code_sent'));
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
          <AinaLogo
            size={96}
            className="relative drop-shadow-xl"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="font-wordmark text-white text-7xl tracking-[0.01em] mt-5 leading-none"
        >
          {t('app.name')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-display-intimate text-white/90 text-lg mt-1"
        >
          {t('app.slogan')}
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
                {m === 'login' ? t('auth.login') : t('auth.signup')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                authMethod === 'phone' ? 'bg-forest-600 text-white shadow-sm' : 'bg-ivory-200 text-bark-500'
              }`}
            >
              {t('auth.phone_tab')}
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                authMethod === 'email' ? 'bg-forest-600 text-white shadow-sm' : 'bg-ivory-200 text-bark-500'
              }`}
            >
              {t('auth.email_tab')}
            </button>
          </div>

          {authMethod === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold block mb-2">
                  {t('auth.country_label')}
                </label>
                <select
                  value={phoneCountry}
                  onChange={e => handlePhoneCountryChange(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-ivory-200 text-bark-800 focus:outline-none focus:ring-2 focus:ring-forest-300 text-sm"
                >
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.label} ({country.phoneCode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400" />
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder={t('auth.phone_placeholder')}
                    value={phone}
                    onChange={e => {
                      setPhone(e.target.value);
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-ivory-200 text-bark-800 placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-forest-300 text-sm"
                  />
                </div>
              </div>
              {otpSent && (
                <div>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder={t('auth.otp_placeholder')}
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full pl-11 pr-4 py-4 rounded-2xl bg-ivory-200 text-bark-800 placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-forest-300 text-sm tracking-[0.35em]"
                    />
                  </div>
                </div>
              )}
              <p className="text-[11px] text-bark-500 leading-relaxed px-1">
                {t('auth.phone_hint')}
              </p>
              <button
                type="submit"
                disabled={loading || !phone || (otpSent && otp.length < 4)}
                className={`w-full py-4 rounded-full font-heading font-bold text-white flex items-center justify-center gap-2 transition-all ${
                  loading || !phone || (otpSent && otp.length < 4) ? 'opacity-50 cursor-not-allowed bg-forest-400' : 'btn-gradient active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>{otpSent ? t('auth.verify_code') : t('auth.send_code')} <Sparkles className="w-4 h-4" /></>
                )}
              </button>
              {otpSent && (
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                  }}
                  className="w-full text-xs text-bark-500 underline"
                >
                  {t('auth.change_phone')}
                </button>
              )}
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400" />
                  <input
                    type="email"
                    placeholder={t('auth.email')}
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
                    placeholder={t('auth.password')}
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
                  <>{mode === 'login' ? t('auth.login_cta') : t('auth.signup_cta')} <Sparkles className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}

          {isConfigured && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-ivory-300" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-bark-400 font-semibold">
                  {t('auth.or')}
                </span>
                <div className="flex-1 h-px bg-ivory-300" />
              </div>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading || loading}
                className="w-full py-3.5 rounded-full bg-white border border-ivory-300 text-bark-700 font-heading font-semibold text-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-60 hover:bg-ivory-50"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-bark-300 border-t-bark-700 rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {t('auth.continue_google')}
              </button>
            </>
          )}

          {/* Mode invité — toujours disponible, toutes données locales */}
          <div className="mt-5 pt-5 border-t border-ivory-300">
            <p className="text-[11px] text-bark-400 text-center mb-1 font-semibold tracking-wide uppercase">
              {t('auth.guest_title')}
            </p>
            <p className="text-[11px] text-bark-400 text-center mb-3 italic">
              {t('auth.guest_note')}
            </p>
            <button
              onClick={continueAsGuest}
              className="w-full py-3 rounded-full bg-ivory-200 text-bark-600 font-semibold text-sm hover:bg-ivory-300 transition-colors active:scale-[0.98]"
            >
              {t('auth.dev_bypass')}
            </button>
          </div>
        </motion.div>

        <p className="text-center text-xs text-bark-400 mt-6 px-4">
          {t('auth.terms')}
        </p>
      </div>
    </div>
  );
}
