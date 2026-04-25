import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  if (childData.length === 0) {
    return (
      <div className="rounded-2xl border border-ivory-300 bg-ivory-50 p-4">
        <p className="text-sm text-bark-500">
          {t('health.growth.no_data')}
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
  const metricLower = t(`growth_interpretation.metric_${metric}`);

  const pBandLabel: Record<typeof pBand, string> = {
    p3:  t('growth_interpretation.percentile_3'),
    p15: t('growth_interpretation.percentile_15'),
    p50: t('growth_interpretation.percentile_50'),
    p85: t('growth_interpretation.percentile_85'),
    p97: t('growth_interpretation.percentile_97'),
  };

  const zoneContent: Record<GrowthZone, { emoji: string; title: string; tone: 'ok' | 'watch' | 'alert'; message: string }> = {
    normal: {
      emoji: '🌱', title: t('growth_interpretation.normal_title'), tone: 'ok',
      message: t('growth_interpretation.normal_message', { name: childName, metric: metricLower }),
    },
    watch: {
      emoji: '🟡', title: t('growth_interpretation.watch_title'), tone: 'watch',
      message: t('growth_interpretation.watch_message', { name: childName }),
    },
    'alert-low': {
      emoji: '🟠', title: t('growth_interpretation.alert_title'), tone: 'alert',
      message: t('growth_interpretation.alert_low_message', { metric: metricLower }),
    },
    'alert-high': {
      emoji: '🟠', title: t('growth_interpretation.alert_title'), tone: 'alert',
      message: t('growth_interpretation.alert_high_message', { metric: metricLower }),
    },
    'curve-break': {
      emoji: '🚨', title: t('growth_interpretation.curve_break_title'), tone: 'alert',
      message: t('growth_interpretation.curve_break_message', { name: childName }),
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
