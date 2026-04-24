import { motion } from 'framer-motion';
import {
  getPercentileData,
  getGrowthZone,
  detectCurveBreak,
  findNearestPercentile,
  metricInfo,
  type GrowthMetric,
  type GrowthZone,
} from '@/data/oms-growth';
import type { Sex } from '@/types/child';

interface Props {
  metric: GrowthMetric;
  sex: Sex;
  childName: string;
  childData: { month: number; value: number }[];
}

/**
 * GrowthInterpretation — message rassurant automatique basé sur la dernière mesure
 * vs courbes OMS. Vise à informer sans alarmer inutilement.
 */
export function GrowthInterpretation({ metric, sex, childName, childData }: Props) {
  if (childData.length === 0) {
    return (
      <div className="rounded-2xl border border-ivory-300 bg-ivory-50 p-4">
        <p className="text-sm text-bark-500">
          Aucune mesure enregistrée pour le moment. Ajoutez un relevé pour voir l'interprétation.
        </p>
      </div>
    );
  }

  const percentiles = getPercentileData(metric, sex);
  const latest = childData[childData.length - 1];
  const nearestPoint = percentiles.reduce((prev, curr) =>
    Math.abs(curr.month - latest.month) < Math.abs(prev.month - latest.month) ? curr : prev,
  );

  const hasCurveBreak = detectCurveBreak(childData, percentiles);
  const zone: GrowthZone = hasCurveBreak ? 'curve-break' : getGrowthZone(latest.value, nearestPoint);
  const pBand = findNearestPercentile(latest.value, nearestPoint);
  const info = metricInfo[metric];

  const pBandLabel: Record<typeof pBand, string> = {
    p3:  '~3ème percentile',
    p15: '~15ème percentile',
    p50: 'médiane',
    p85: '~85ème percentile',
    p97: '~97ème percentile',
  };

  const zoneContent: Record<GrowthZone, { emoji: string; title: string; tone: 'ok' | 'watch' | 'alert'; message: string }> = {
    normal: {
      emoji: '🌱', title: 'Croissance harmonieuse', tone: 'ok',
      message: `Le ${info.lower} de ${childName} suit une belle courbe dans la moyenne des enfants de son âge. Continuez ainsi !`,
    },
    watch: {
      emoji: '🟡', title: 'À surveiller', tone: 'watch',
      message: `${childName} est un peu au-dessus ou en dessous de la moyenne, mais reste dans les limites normales. On garde l'œil ouvert au prochain rendez-vous.`,
    },
    'alert-low': {
      emoji: '🟠', title: 'Échange avec le pédiatre conseillé', tone: 'alert',
      message: `Le ${info.lower} est sous le 3ème percentile. Rien d'alarmant en soi, mais un avis du pédiatre permettra d'évaluer la courbe globale.`,
    },
    'alert-high': {
      emoji: '🟠', title: 'Échange avec le pédiatre conseillé', tone: 'alert',
      message: `Le ${info.lower} est au-dessus du 97ème percentile. Un point avec votre pédiatre aidera à contextualiser.`,
    },
    'curve-break': {
      emoji: '🚨', title: 'Changement important détecté', tone: 'alert',
      message: `La courbe de ${childName} a franchi plusieurs bandes entre deux relevés. Il est prudent d'en parler rapidement au pédiatre.`,
    },
  };

  const c = zoneContent[zone];

  const toneClasses: Record<typeof c.tone, string> = {
    ok:    'bg-white border-emerald-300 elev-1',
    watch: 'bg-white border-amber-300 elev-1',
    alert: 'bg-white border-red-300 elev-1',
  };
  const toneText: Record<typeof c.tone, string> = {
    ok:    'text-emerald-700',
    watch: 'text-amber-700',
    alert: 'text-red-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border-2 p-4 ${toneClasses[c.tone]}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0" aria-hidden>{c.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <p className={`font-heading font-bold text-sm ${toneText[c.tone]}`}>{c.title}</p>
            <span className={`text-[11px] font-mono ${toneText[c.tone]} opacity-70`}>
              {latest.value}{info.unit} · {pBandLabel[pBand]}
            </span>
          </div>
          <p className="text-sm mt-1 leading-relaxed text-bark-700">{c.message}</p>
        </div>
      </div>
    </motion.div>
  );
}
