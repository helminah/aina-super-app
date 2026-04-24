import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, RefreshCw } from 'lucide-react';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeInMonths } from '@/lib/age-utils';
import { sendChatMessage, AnthropicApiError, type ChatMessage } from '@/lib/anthropic';

/**
 * AIChatAssistant — bouton flottant + sheet de conversation avec "AINA IA".
 * - Portail vers document.body pour échapper au max-w 480px du root
 * - Historique limité à 10 tours (anti-dérapage tokens)
 * - Disclaimer toujours visible
 * - Proposition de 3 prompts suggérés au 1er ouverture pour lancer la conversation
 */

const MAX_TURNS = 10;

const SUGGESTIONS = [
  'Comment introduire le lait de vache ?',
  'Mon bébé dort mal la nuit, des conseils ?',
  'Quand consulter pour une fièvre ?',
];

export function AIChatAssistant() {
  const { profile } = useBaby();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  if (!profile) return null;
  const ageMonths = getAgeInMonths(profile.birthDate);
  const canSend = input.trim().length >= 2 && !loading && messages.filter(m => m.role === 'user').length < MAX_TURNS;

  const send = async (content: string) => {
    if (!content.trim() || loading) return;
    setError(null);
    const userMsg: ChatMessage = { role: 'user', content: content.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const { reply } = await sendChatMessage({
        messages: next,
        babyAgeMonths: ageMonths,
        country: profile.country,
      });
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e instanceof AnthropicApiError ? e.message : 'Erreur inattendue');
    } finally {
      setLoading(false);
    }
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
          className="fixed bottom-44 right-5 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 text-white flex items-center justify-center shadow-[0_12px_28px_-8px_rgba(147,51,234,0.5)] print:hidden"
          aria-label="AINA IA"
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
              <div className="mesh-violet grain px-5 pt-5 pb-4 relative overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 hero-text flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
                    👩🏽‍⚕️
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-bold text-white">AINA IA</p>
                    <p className="text-[11px] text-white/85 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> en ligne · réponses indicatives
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
                    aria-label="Fermer"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 bg-ivory-100 space-y-3">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className="bg-white rounded-2xl rounded-tl-sm p-4 elev-1 max-w-[85%]">
                      <p className="text-sm text-bark-700 leading-relaxed">
                        Bonjour maman de <strong>{profile.name}</strong> 👋 Je suis AINA IA, l'assistante de l'app.
                        Pose-moi tes questions sur la santé, le sommeil, l'alimentation ou le développement de bébé.
                      </p>
                      <p className="text-[11px] text-bark-400 italic mt-2">
                        ⚕️ Je ne remplace pas ton pédiatre — en cas de doute, consulte.
                      </p>
                    </div>
                    <div className="pt-2">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-bark-400 font-semibold mb-2 px-1">
                        Quelques idées
                      </p>
                      <div className="space-y-2">
                        {SUGGESTIONS.map(s => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            className="w-full text-left px-4 py-2.5 rounded-2xl bg-white text-sm text-bark-700 elev-1 hover:bg-violet-50 transition-colors"
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
                      <span>AINA IA réfléchit…</span>
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
                    Limite de 10 questions atteinte — nouvelle conversation ou reviens plus tard.
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 bg-white border-t border-ivory-200">
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
                    placeholder="Pose ta question…"
                    rows={1}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-ivory-100 text-bark-800 placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-violet-300 text-sm resize-none max-h-24"
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={!canSend}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 text-white flex items-center justify-center disabled:opacity-40 transition-all active:scale-[0.92] flex-shrink-0"
                    aria-label="Envoyer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={reset}
                    className="text-[11px] text-bark-400 mt-2 hover:text-bark-600 transition-colors"
                  >
                    ↺ Nouvelle conversation
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
