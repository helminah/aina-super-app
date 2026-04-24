import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Stethoscope, Phone, RefreshCw, Send, ShieldAlert } from 'lucide-react';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeInMonths } from '@/lib/age-utils';
import { analyzeRedFlags, AnthropicApiError, type RedFlagAnalysis, type RedFlagLevel } from '@/lib/anthropic';

/**
 * AIRedFlagChecker — le parent décrit ce qu'il observe, l'IA classe
 * en 3 niveaux (🟢🟡🔴) et donne un message + disclaimer.
 *
 * UX semi-chat : textarea libre, résultat coloré, possibilité de préciser
 * (« Autre détail ») pour affiner l'analyse sans refaire tout.
 */
export function AIRedFlagChecker() {
  const { profile } = useBaby();
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<RedFlagAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [additional, setAdditional] = useState('');

  if (!profile) return null;
  const ageMonths = getAgeInMonths(profile.birthDate);

  const handleAnalyze = async (text: string) => {
    if (text.trim().length < 3) return;
    setError(null);
    setLoading(true);
    try {
      const r = await analyzeRedFlags({ symptoms: text, babyAgeMonths: ageMonths });
      setResult(r);
      setAdditional('');
    } catch (e) {
      setError(e instanceof AnthropicApiError ? e.message : 'Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSymptoms('');
    setAdditional('');
    setError(null);
  };

  const handleAddDetail = () => {
    // Fusionne l'observation initiale + nouveau détail → relance l'analyse
    const combined = `${symptoms}\n\nPrécision supplémentaire : ${additional.trim()}`;
    setSymptoms(combined);
    void handleAnalyze(combined);
  };

  const isUrgent = result?.level === 'red';

  return (
    <div className="mt-6 rounded-2xl overflow-hidden elev-2">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 grain overflow-hidden px-5 pt-5 pb-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 hero-text"
        >
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-white" />
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/90 font-semibold">
              Quand consulter ?
            </p>
          </div>
          <p className="font-heading font-bold text-white text-lg mt-1">
            Signes d'alerte chez {profile.name}
          </p>
          <p className="text-white/85 text-xs mt-0.5">
            Décrivez ce que vous observez, pas de diagnostic — juste un guide d'orientation.
          </p>
        </motion.div>
      </div>

      {/* Body */}
      <div className="bg-white p-5 space-y-4">
        {!result && (
          <>
            <div>
              <label className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold block mb-2">
                Ce que vous observez
              </label>
              <textarea
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="Ex. Fièvre à 38,5 depuis ce matin, bébé refuse le biberon, pleurs inhabituels…"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-ivory-100 text-bark-800 placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm resize-none"
              />
              <p className="text-[10px] text-bark-400 mt-1">
                Plus c'est précis (durée, température, comportement), mieux l'IA oriente.
              </p>
            </div>

            <button
              onClick={() => handleAnalyze(symptoms)}
              disabled={loading || symptoms.trim().length < 3}
              className="w-full py-3 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-heading font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98] shadow-md shadow-red-500/30"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyse…
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" /> Analyser
                </>
              )}
            </button>
          </>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <ResultCard level={result.level} message={result.message} />

              {isUrgent && (
                <a
                  href="tel:15"
                  className="w-full py-3 rounded-full bg-red-500 text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-red-500/40"
                >
                  <Phone className="w-4 h-4" /> Appeler le SAMU (15 / 1515 / 117)
                </a>
              )}

              {/* Follow-up — ajouter un détail sans repartir de zéro */}
              <div className="rounded-xl bg-ivory-100 p-3">
                <label className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold block mb-2">
                  Ajouter un détail ?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={additional}
                    onChange={e => setAdditional(e.target.value)}
                    placeholder="Ex. depuis 2 jours, vomissements…"
                    className="flex-1 px-3 py-2.5 rounded-xl bg-white text-bark-800 placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm"
                  />
                  <button
                    onClick={handleAddDetail}
                    disabled={loading || additional.trim().length < 3}
                    className="px-4 rounded-xl bg-red-500 text-white disabled:opacity-40 transition-all active:scale-[0.98]"
                    aria-label="Envoyer le détail"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-full bg-ivory-200 text-bark-600 font-semibold text-xs hover:bg-ivory-300 transition-colors"
              >
                Nouvelle analyse
              </button>

              {/* Disclaimer médical */}
              <div className="mt-4 pt-4 border-t border-ivory-300">
                <p className="text-[11px] text-bark-500 italic text-center leading-relaxed">
                  ⚕️ Cette information ne remplace pas l'avis de votre pédiatre.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResultCard({ level, message }: { level: RedFlagLevel; message: string }) {
  const config: Record<RedFlagLevel, {
    bg: string;
    border: string;
    text: string;
    emoji: string;
    label: string;
  }> = {
    green:  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', emoji: '🟢', label: 'À surveiller' },
    yellow: { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-800',   emoji: '🟡', label: 'Consulter dans 24h' },
    red:    { bg: 'bg-red-50',     border: 'border-red-300',     text: 'text-red-800',     emoji: '🔴', label: 'Urgence immédiate' },
  };
  const c = config[level];

  return (
    <div className={`${c.bg} ${c.border} border-2 rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{c.emoji}</span>
        <p className={`font-heading font-bold ${c.text}`}>{c.label}</p>
      </div>
      <p className={`text-sm ${c.text} leading-relaxed`}>{message}</p>
    </div>
  );
}
