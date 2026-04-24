import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { babyTeeth, teethTips, type ToothInfo } from '@/data/teeth';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeInMonths } from '@/lib/age-utils';
import { Sparkles } from 'lucide-react';

/**
 * TeethChart v2 — vrais pictogrammes SVG par type de dent, frise chronologique
 * par tranches d'âge, couleurs différenciées.
 *
 * Types :
 *   - incisives (i) : fines, tranchantes — coin pointu
 *   - canines  (c)  : pointues longues — arrondi haut
 *   - molaires (m)  : larges plates — 4 bosses
 */

type ToothType = 'incisor' | 'canine' | 'molar';

function getType(tooth: ToothInfo): ToothType {
  if (tooth.id.includes('-i')) return 'incisor';
  if (tooth.id.startsWith('u-c') || tooth.id.startsWith('l-c')) return 'canine';
  return 'molar';
}

const typeColor: Record<ToothType, { stroke: string; fill: string; dim: string }> = {
  incisor: { stroke: '#10b981', fill: '#fff',         dim: '#f1f5f0' },
  canine:  { stroke: '#0ea5e9', fill: '#fff',         dim: '#e6f4f8' },
  molar:   { stroke: '#9333ea', fill: '#fff',         dim: '#f0eaf6' },
};

const typeLabel: Record<ToothType, string> = {
  incisor: 'Incisive',
  canine:  'Canine',
  molar:   'Molaire',
};

export function TeethChart() {
  const { profile, teethRecords, toggleTooth, isToothErupted } = useBaby();

  const ageMonths = profile ? getAgeInMonths(profile.birthDate) : 0;
  const eruptedCount = teethRecords.length;

  const upper = useMemo(() => babyTeeth.filter(t => t.position === 'upper').sort((a, b) => a.order - b.order), []);
  const lower = useMemo(() => babyTeeth.filter(t => t.position === 'lower').sort((a, b) => a.order - b.order), []);

  // Timeline groupée par tranches d'éruption
  const timeline = useMemo(() => {
    const groups = new Map<string, ToothInfo[]>();
    for (const t of babyTeeth) {
      const key = t.eruptionRange;
      const arr = groups.get(key) || [];
      arr.push(t);
      groups.set(key, arr);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => {
      const aMin = parseInt(a.split('-')[0]);
      const bMin = parseInt(b.split('-')[0]);
      return aMin - bMin;
    });
  }, []);

  return (
    <div className="space-y-5">
      {/* Header avec compteur */}
      <div className="glass-card-green rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-700 font-semibold">Dents sorties</p>
            <p className="font-display font-semibold text-4xl text-emerald-800 mt-0.5">
              {eruptedCount}<span className="text-xl text-emerald-600">/20</span>
            </p>
            {eruptedCount > 0 && profile && (
              <p className="text-xs text-emerald-700 mt-1">{profile.name} grandit bien 🌱</p>
            )}
          </div>
          <div className="text-5xl">🦷</div>
        </div>
        <div className="mt-3 h-2 bg-white/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${(eruptedCount / 20) * 100}%` }}
          />
        </div>
      </div>

      {/* Légende couleurs */}
      <div className="flex gap-3 px-1">
        {(['incisor', 'canine', 'molar'] as ToothType[]).map(t => (
          <div key={t} className="flex items-center gap-1.5 text-xs text-bark-500">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: typeColor[t].stroke }} />
            {typeLabel[t]}
          </div>
        ))}
      </div>

      {/* Schéma des mâchoires */}
      <div className="bg-white rounded-2xl p-5 elev-2">
        <p className="text-[11px] text-bark-500 uppercase tracking-[0.15em] font-semibold text-center mb-4">
          Tapez une dent pour la marquer comme sortie
        </p>

        {/* Supérieure — arc avec espace central */}
        <JawRow teeth={upper} position="upper" erupted={isToothErupted} onToggle={toggleTooth} />

        <div className="my-4 border-t border-ivory-200" />

        {/* Inférieure */}
        <JawRow teeth={lower} position="lower" erupted={isToothErupted} onToggle={toggleTooth} />
      </div>

      {/* Chronologie */}
      <div className="bg-white rounded-2xl p-5 elev-2">
        <p className="text-[11px] text-bark-500 uppercase tracking-[0.15em] font-semibold mb-3">Chronologie</p>
        <div className="space-y-3">
          {timeline.map(([range, teeth]) => {
            const min = parseInt(range.split('-')[0]);
            const max = parseInt(range.split('-')[1]);
            const reached = ageMonths >= min;
            const passed = ageMonths > max;
            const doneCount = teeth.filter(t => isToothErupted(t.id)).length;
            return (
              <div
                key={range}
                className={`relative pl-4 border-l-2 ${reached ? 'border-emerald-400' : 'border-ivory-300'}`}
              >
                <span
                  className={`absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2 ${
                    reached ? 'bg-emerald-500 border-white' : 'bg-white border-ivory-400'
                  }`}
                />
                <div className="flex items-baseline justify-between">
                  <p className={`text-sm font-semibold ${reached ? 'text-bark-800' : 'text-bark-400'}`}>{range}</p>
                  <p className={`text-[11px] ${passed && doneCount === teeth.length ? 'text-emerald-600' : 'text-bark-400'}`}>
                    {doneCount}/{teeth.length}
                  </p>
                </div>
                <p className="text-xs text-bark-500 mt-0.5">
                  {teeth.length} {teeth.length === 1 ? 'dent' : 'dents'} · {teeth.map(t => typeLabel[getType(t)]).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <p className="text-[11px] text-amber-700 uppercase tracking-[0.15em] font-semibold">Soulager la poussée</p>
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

// ────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────

function JawRow({
  teeth,
  position,
  erupted,
  onToggle,
}: {
  teeth: ToothInfo[];
  position: 'upper' | 'lower';
  erupted: (id: string) => boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-xs text-bark-400 font-medium text-center mb-3">
        Mâchoire {position === 'upper' ? 'supérieure' : 'inférieure'}
      </p>
      <div className="flex justify-center items-end gap-[3px]">
        {teeth.map(t => (
          <ToothButton
            key={t.id}
            tooth={t}
            position={position}
            erupted={erupted(t.id)}
            onToggle={() => onToggle(t.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ToothButton({
  tooth,
  position,
  erupted,
  onToggle,
}: {
  tooth: ToothInfo;
  position: 'upper' | 'lower';
  erupted: boolean;
  onToggle: () => void;
}) {
  const type = getType(tooth);
  const [min] = tooth.eruptionRange.split('-').map(s => parseInt(s));

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onToggle}
      aria-label={tooth.name}
      title={`${tooth.name} · ${tooth.eruptionRange}`}
      className="relative group"
    >
      <ToothSVG type={type} position={position} erupted={erupted} />
      {!erupted && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-bark-300 font-medium">
          {min}m
        </span>
      )}
    </motion.button>
  );
}

function ToothSVG({
  type,
  position,
  erupted,
}: {
  type: ToothType;
  position: 'upper' | 'lower';
  erupted: boolean;
}) {
  const c = typeColor[type];
  const stroke = erupted ? c.stroke : '#cbc6ca';
  const fill = erupted ? c.fill : c.dim;
  const flipY = position === 'lower' ? 'scale(1,-1) translate(0,-32)' : '';

  const paths: Record<ToothType, string> = {
    // Incisor : base large, pointe plate en haut
    incisor: 'M 6 10 Q 6 4 14 4 Q 22 4 22 10 L 22 24 Q 22 30 14 30 Q 6 30 6 24 Z',
    // Canine : pointe haute nette
    canine: 'M 14 2 L 22 10 L 22 24 Q 22 30 14 30 Q 6 30 6 24 L 6 10 Z',
    // Molar : 2 cuspides (bosses)
    molar: 'M 4 8 Q 7 4 10 8 Q 14 4 18 8 Q 21 4 24 8 L 24 24 Q 24 30 14 30 Q 4 30 4 24 Z',
  };

  return (
    <svg
      width="28"
      height="32"
      viewBox="0 0 28 32"
      className="transition-all"
    >
      <g transform={flipY}>
        <path
          d={paths[type]}
          fill={fill}
          stroke={stroke}
          strokeWidth={erupted ? 2 : 1.5}
        />
        {erupted && (
          <circle cx="14" cy="18" r="2.5" fill={c.stroke} opacity="0.35" />
        )}
      </g>
    </svg>
  );
}
