import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { babyTeeth, teethTips, type ToothInfo } from '@/data/teeth';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeInMonths } from '@/lib/age-utils';
import { Sparkles } from 'lucide-react';

/**
 * TeethChart — schéma visuel des 20 dents de lait avec ordre d'apparition.
 * Tap sur une dent pour la marquer comme sortie.
 */
export function TeethChart() {
  const { profile, teethRecords, toggleTooth, isToothErupted } = useBaby();

  const ageMonths = profile ? getAgeInMonths(profile.birthDate) : 0;
  const eruptedCount = teethRecords.length;

  const upper = useMemo(() => babyTeeth.filter(t => t.position === 'upper').sort((a, b) => a.order - b.order), []);
  const lower = useMemo(() => babyTeeth.filter(t => t.position === 'lower').sort((a, b) => a.order - b.order), []);

  // Prochaines dents attendues (parmi celles non érupues, la plus précoce en âge)
  const nextExpected = useMemo(() => {
    return babyTeeth
      .filter(t => !isToothErupted(t.id))
      .map(t => {
        const [min] = t.eruptionRange.split('-').map(s => parseInt(s));
        return { tooth: t, startMonth: min };
      })
      .sort((a, b) => a.startMonth - b.startMonth)
      .slice(0, 3);
  }, [teethRecords]);

  return (
    <div className="space-y-5">
      {/* Header avec compteur */}
      <div className="glass-card-green rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-700 font-semibold">Dents sorties</p>
            <p className="font-display font-semibold text-4xl text-emerald-800 mt-0.5">{eruptedCount}<span className="text-xl text-emerald-600">/20</span></p>
          </div>
          <div className="text-4xl">🦷</div>
        </div>
        <div className="mt-3 h-2 bg-white/60 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(eruptedCount / 20) * 100}%` }} />
        </div>
      </div>

      {/* Schéma des mâchoires */}
      <div className="bg-white rounded-2xl p-5 elev-2">
        <p className="text-[11px] text-bark-500 uppercase tracking-[0.15em] font-semibold text-center mb-4">
          Tapez une dent pour la marquer comme sortie
        </p>

        {/* Mâchoire supérieure */}
        <div className="mb-6">
          <p className="text-xs text-bark-400 font-medium text-center mb-2">Mâchoire supérieure</p>
          <div className="flex justify-center gap-1">
            {upper.map(t => <Tooth key={t.id} tooth={t} erupted={isToothErupted(t.id)} onToggle={() => toggleTooth(t.id)} />)}
          </div>
        </div>

        {/* Mâchoire inférieure */}
        <div>
          <p className="text-xs text-bark-400 font-medium text-center mb-2">Mâchoire inférieure</p>
          <div className="flex justify-center gap-1">
            {lower.map(t => <Tooth key={t.id} tooth={t} erupted={isToothErupted(t.id)} onToggle={() => toggleTooth(t.id)} />)}
          </div>
        </div>
      </div>

      {/* Prochaines attendues */}
      {nextExpected.length > 0 && (
        <div className="bg-white rounded-2xl p-5 elev-2">
          <p className="text-[11px] text-bark-500 uppercase tracking-[0.15em] font-semibold mb-3">Prochaines attendues</p>
          <div className="space-y-2">
            {nextExpected.map(({ tooth, startMonth }) => {
              const isSoon = ageMonths >= startMonth;
              return (
                <div key={tooth.id} className="flex items-center gap-3 py-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSoon ? 'bg-amber-100 text-amber-600' : 'bg-ivory-200 text-bark-400'}`}>
                    <span className="text-sm">🦷</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-bark-800 truncate">{tooth.name}</p>
                    <p className="text-xs text-bark-400">{tooth.eruptionRange}</p>
                  </div>
                  {isSoon && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">attendue</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-br from-amber-50 to-terra-50 border border-amber-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <p className="text-[11px] text-amber-700 uppercase tracking-[0.15em] font-semibold">Soulager la poussée dentaire</p>
        </div>
        <div className="space-y-2">
          {teethTips.map((tip, i) => (
            <p key={i} className="text-sm text-bark-700 leading-relaxed">{tip}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function Tooth({ tooth, erupted, onToggle }: { tooth: ToothInfo; erupted: boolean; onToggle: () => void }) {
  const [min] = tooth.eruptionRange.split('-').map(s => parseInt(s));
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onToggle}
      aria-label={tooth.name}
      title={`${tooth.name} · ${tooth.eruptionRange}`}
      className={`relative w-7 h-8 rounded-t-xl rounded-b-md transition-all ${
        erupted
          ? 'bg-white border-2 border-emerald-500 shadow-md shadow-emerald-500/20'
          : 'bg-ivory-200 border border-ivory-400'
      }`}
    >
      {erupted && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-600">
          ✓
        </span>
      )}
      {!erupted && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-bark-300 font-medium">
          {min}m
        </span>
      )}
    </motion.button>
  );
}
