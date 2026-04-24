import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Heart, Sparkles, X, Info, BookOpen } from 'lucide-react';
import { getVaccineInfo } from '@/data/vaccine-info';
import type { Vaccine } from '@/data/vaccines';

/**
 * VaccineEducation — composant double :
 * 1. HOW : carte générique "comment marche un vaccin" en haut du tab Vaccins
 * 2. DETAIL : sheet modal qui ouvre quand on tape "en savoir plus" sur un vaccin
 */

export function VaccineEducationCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.button
      onClick={() => setExpanded(v => !v)}
      className="w-full text-left rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50 p-5 transition-all"
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-700 font-semibold">Comprendre</p>
          <p className="font-heading font-bold text-bark-800 mt-0.5">La vaccination, comment ça marche ?</p>
          <p className="text-xs text-bark-500 mt-1">{expanded ? 'Toucher pour replier' : 'Toucher pour en savoir plus'}</p>
        </div>
        <BookOpen className={`w-4 h-4 text-emerald-600 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-bark-700">
              <p>
                Le corps de votre bébé a une <strong>armée de défense naturelle</strong> : son système immunitaire.
                Mais cette armée a besoin <strong>d'apprendre à reconnaître les ennemis</strong>.
              </p>

              <div className="flex items-start gap-3 rounded-xl bg-white/70 p-3">
                <Heart className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <p>
                  Le vaccin montre au corps une <strong>version inoffensive</strong> du microbe. Le jour où le vrai
                  microbe arrive, les défenses sont déjà prêtes.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white/70 p-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p>
                  Vacciner bébé, c'est aussi <strong>protéger les autres</strong> : personnes fragiles, futures grandes
                  sœurs et grands frères, femmes enceintes, seniors.
                </p>
              </div>

              <p className="text-xs text-bark-500 italic">
                Les effets secondaires (fièvre légère, rougeur) sont temporaires et bénins. Toujours rares par rapport
                aux maladies évitées.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

interface DetailProps {
  vaccine: Vaccine | null;
  onClose: () => void;
}

export function VaccineDetailSheet({ vaccine, onClose }: DetailProps) {
  return (
    <AnimatePresence>
      {vaccine && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-[480px] bg-white rounded-t-3xl max-h-[85dvh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <VaccineDetailContent vaccine={vaccine} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function VaccineDetailContent({ vaccine, onClose }: { vaccine: Vaccine; onClose: () => void }) {
  const info = getVaccineInfo(vaccine.id);

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 pr-3">
          <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-600 font-semibold">{vaccine.ageLabel}</p>
          <h2 className="font-heading text-xl font-bold text-bark-800 mt-0.5">{vaccine.name}</h2>
          <p className="text-xs text-bark-500 mt-1">Contre : {vaccine.diseases}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-ivory-200 flex items-center justify-center flex-shrink-0"
        >
          <X className="w-4 h-4 text-bark-600" />
        </button>
      </div>

      {info ? (
        <div className="space-y-3">
          <InfoBlock title="Pourquoi le faire ?" body={info.why} tone="primary" icon={<Heart className="w-4 h-4" />} />
          <InfoBlock title="La maladie en question" body={info.disease} tone="neutral" icon={<Info className="w-4 h-4" />} />
          <InfoBlock title="Pourquoi c'est grave" body={info.risk} tone="warn" icon={<Shield className="w-4 h-4" />} />
          {info.sideEffects && (
            <InfoBlock
              title="Effets secondaires attendus"
              body={info.sideEffects}
              tone="neutral"
              icon={<Sparkles className="w-4 h-4" />}
            />
          )}
        </div>
      ) : (
        <div className="bg-ivory-100 rounded-2xl p-4 text-sm text-bark-500">
          <p>Informations détaillées non disponibles pour ce vaccin. N'hésitez pas à en parler à votre pédiatre.</p>
        </div>
      )}

      <div className="mt-5 pt-5 border-t border-ivory-300 text-xs text-bark-400 italic text-center">
        Ces informations sont indicatives. Votre pédiatre reste la référence pour toute question personnalisée.
      </div>
    </div>
  );
}

function InfoBlock({
  title,
  body,
  tone,
  icon,
}: {
  title: string;
  body: string;
  tone: 'primary' | 'neutral' | 'warn';
  icon: React.ReactNode;
}) {
  const cls: Record<typeof tone, string> = {
    primary: 'bg-emerald-50 border-emerald-100 text-emerald-900',
    neutral: 'bg-ivory-100 border-ivory-300 text-bark-700',
    warn:    'bg-amber-50 border-amber-100 text-amber-900',
  };
  return (
    <div className={`rounded-2xl border p-4 ${cls[tone]}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span>{icon}</span>
        <p className="text-[11px] uppercase tracking-[0.15em] font-semibold">{title}</p>
      </div>
      <p className="text-sm leading-relaxed">{body}</p>
    </div>
  );
}
