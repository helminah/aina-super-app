import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, RefreshCw, Camera, Sparkles, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeInMonths } from '@/lib/age-utils';
import { streamChatMessage, type ChatMessage } from '@/lib/anthropic';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * AIChatAssistant — bouton flottant + sheet de conversation avec "AINA IA".
 * - Portail vers document.body pour échapper au max-w 480px du root
 * - Historique limité à 10 tours (anti-dérapage tokens)
 * - Disclaimer toujours visible
 * - Proposition de 3 prompts suggérés au 1er ouverture pour lancer la conversation
 */

const MAX_TURNS = 10;

export function AIChatAssistant() {
  const { t } = useTranslation();
  const { profile } = useBaby();
  const [open, setOpen] = useState(false);

  const [coachMode, setCoachMode] = useState(false);
  const suggestions = useMemo(() => coachMode
    ? [
        t('chat.coach_suggestion_crying'),
        t('chat.coach_suggestion_no_eat'),
        t('chat.coach_suggestion_no_sleep'),
      ]
    : [
        t('chat.suggestion_cow_milk'),
        t('chat.suggestion_sleep'),
        t('chat.suggestion_fever'),
      ],
  [t, coachMode]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMediaType, setImageMediaType] = useState<string>('image/jpeg');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  if (!profile) return null;
  const ageMonths = getAgeInMonths(profile.birthDate);
  const canSend = (input.trim().length >= 2 || !!imageBase64) && !loading && messages.filter(m => m.role === 'user').length < MAX_TURNS;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Format non supporté');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error('Image trop lourde (max 5 Mo)');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      const [header, b64] = dataUrl.split(',');
      const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
      setImageBase64(b64);
      setImageMediaType(mime);
    };
    reader.readAsDataURL(file);
  };

  const send = async (content: string) => {
    if (!content.trim() || loading) return;
    setError(null);
    const userMsg: ChatMessage = { role: 'user', content: content.trim() };
    const next = [...messages, userMsg];
    // Ajoute immédiatement un message assistant vide — rempli token par token.
    setMessages([...next, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    const pendingImage = imageBase64;
    const pendingMime = imageMediaType;
    setImageBase64(null);
    setImagePreview(null);

    await streamChatMessage(
      { messages: next, babyAgeMonths: ageMonths, country: profile.country, imageBase64: pendingImage ?? undefined, imageMediaType: pendingMime, coachMode },
      (token) => {
        setMessages(prev => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === 'assistant') {
            copy[copy.length - 1] = { ...last, content: last.content + token };
          }
          return copy;
        });
      },
      () => { setLoading(false); },
      (errMsg) => {
        setError(errMsg);
        setMessages(prev => prev.slice(0, -1)); // retire le placeholder vide
        setLoading(false);
      },
    );
  };

  const reset = () => {
    setMessages([]);
    setInput('');
    setError(null);
  };

  return createPortal(
    <>
      {/* Bouton flottant (à côté du SOS) */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 22 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-24 left-5 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 text-white flex items-center justify-center shadow-[0_12px_28px_-8px_rgba(147,51,234,0.5)] print:hidden"
          aria-label={t('chat.aina_ai')}
        >
          <MessageCircle className="w-6 h-6" strokeWidth={2} />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
        </motion.button>
      )}

      {/* Sheet conversation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 flex items-end justify-center print:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="w-full max-w-[480px] h-[85dvh] bg-white rounded-t-3xl flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`grain px-5 pt-5 pb-4 relative overflow-hidden ${coachMode ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-violet-500' : 'mesh-violet'}`}>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 hero-text flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-violet-200 flex-shrink-0">
                    <img src="/aina-ia.jpg" alt="AINA IA" className="w-full h-full object-cover object-top scale-110" />
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-bold text-white flex items-center gap-1.5">
                      {coachMode ? t('chat.aina_coach') : t('chat.aina_ai')}
                      {coachMode && <GraduationCap className="w-4 h-4" />}
                    </p>
                    <p className="text-[11px] text-white/85 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {coachMode ? t('chat.coach_subtitle') : t('chat.online_status')}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
                    aria-label={t('common.close')}
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </motion.div>

                {/* Segmented toggle Chat | Coach — toujours visible côte à côte */}
                <div
                  role="tablist"
                  aria-label={t('chat.mode_selector')}
                  className="relative z-10 mt-3 flex p-1 rounded-full bg-white/15 backdrop-blur"
                >
                  <button
                    role="tab"
                    aria-selected={!coachMode}
                    onClick={() => {
                      if (!coachMode) return;
                      setCoachMode(false);
                      setMessages([]);
                      setError(null);
                    }}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                      !coachMode
                        ? 'bg-white text-violet-700 shadow-sm'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {t('chat.mode_chat')}
                  </button>
                  <button
                    role="tab"
                    aria-selected={coachMode}
                    onClick={() => {
                      if (coachMode) return;
                      setCoachMode(true);
                      setMessages([]);
                      setError(null);
                    }}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                      coachMode
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    {t('chat.mode_coach')}
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 bg-ivory-100 space-y-3">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className={`rounded-2xl rounded-tl-sm p-4 elev-1 max-w-[85%] ${coachMode ? 'bg-emerald-50 border border-emerald-200' : 'bg-white'}`}>
                      <p className="text-sm text-bark-700 leading-relaxed">
                        {coachMode
                          ? t('chat.coach_welcome', { name: profile.name })
                          : t('chat.welcome', { name: profile.name, role: t(`onboarding.parent_role_hello_${profile.parentRole ?? 'maman'}`) })
                        }
                      </p>
                      <p className="text-[11px] text-bark-400 italic mt-2">
                        {coachMode ? t('chat.coach_welcome_disclaimer') : t('chat.welcome_disclaimer')}
                      </p>
                    </div>
                    <div className="pt-2">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-bark-400 font-semibold mb-2 px-1">
                        {t('chat.ideas')}
                      </p>
                      <div className="space-y-2">
                        {suggestions.map(s => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            className={`w-full text-left px-4 py-2.5 rounded-2xl bg-white text-sm text-bark-700 elev-1 transition-colors ${coachMode ? 'hover:bg-emerald-50' : 'hover:bg-violet-50'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        m.role === 'user'
                          ? 'bg-gradient-to-br from-violet-500 to-rose-500 text-white rounded-tr-sm'
                          : 'bg-white text-bark-700 elev-1 rounded-tl-sm'
                      }`}
                    >
                      {m.content}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white text-bark-500 elev-1 rounded-2xl rounded-tl-sm px-4 py-3 text-sm flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t('chat.thinking')}</span>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3 text-sm leading-relaxed">
                    {error}
                  </div>
                )}

                {messages.filter(m => m.role === 'user').length >= MAX_TURNS && (
                  <div className="bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl p-3 text-xs leading-relaxed text-center">
                    {t('chat.limit_reached')}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 bg-white border-t border-ivory-200">
                {imagePreview && (
                  <div className="relative inline-block mb-2">
                    <img src={imagePreview} alt="photo" className="h-14 w-14 rounded-xl object-cover border border-violet-200" />
                    <button
                      onClick={() => { setImageBase64(null); setImagePreview(null); }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-violet-500 text-white flex items-center justify-center"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
                <div className="flex gap-2 items-end">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (canSend) send(input);
                      }
                    }}
                    placeholder={t('chat.input_placeholder')}
                    rows={1}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-ivory-100 text-bark-800 placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-violet-300 text-sm resize-none max-h-24"
                  />
                  <label className="w-10 h-10 rounded-full bg-ivory-200 flex items-center justify-center cursor-pointer flex-shrink-0 hover:bg-violet-100 transition-colors" aria-label="Joindre une photo">
                    <Camera className="w-4 h-4 text-bark-500" />
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageSelect} />
                  </label>
                  <button
                    onClick={() => send(input)}
                    disabled={!canSend}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 text-white flex items-center justify-center disabled:opacity-40 transition-all active:scale-[0.92] flex-shrink-0"
                    aria-label={t('chat.send')}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={reset}
                    className="text-[11px] text-bark-400 mt-2 hover:text-bark-600 transition-colors"
                  >
                    {t('chat.new_conversation')}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}
