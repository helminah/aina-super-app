import type { ChildProfile, WeightEntry, VaccineRecord } from '@/types/child';
import type { RedFlagAnalysis } from '@/lib/anthropic';

interface ComposeArgs {
  profile: ChildProfile;
  ageMonths: number;
  symptoms: string;
  result: RedFlagAnalysis;
  weights?: WeightEntry[];
  vaccines?: VaccineRecord[];
  parentDisplay: string;
  locale: 'fr' | 'en' | 'mg' | 'wo';
}

const LEVEL_TAG: Record<RedFlagAnalysis['level'], string> = {
  green: '🟢',
  yellow: '🟡',
  red: '🔴',
};

const TEMPLATES: Record<'fr' | 'en' | 'mg' | 'wo', (d: {
  parent: string;
  babyName: string;
  ageMonths: number;
  weight: string;
  symptoms: string;
  level: string;
  message: string;
  vaccinesNote: string;
}) => string> = {
  fr: d => `Bonjour Docteur,

Je suis ${d.parent}${d.parent ? ', ' : ''}parent de ${d.babyName} (${d.ageMonths} mois${d.weight ? `, ${d.weight}` : ''}).

Symptômes observés :
${d.symptoms}

Triage AINA : ${d.level}
${d.message}

${d.vaccinesNote}
Pourriez-vous m'indiquer la marche à suivre ? Merci.

— Envoyé via AINA · ceci ne remplace pas votre avis médical.`,

  en: d => `Hello Doctor,

I'm ${d.parent}${d.parent ? ', ' : ''}parent of ${d.babyName} (${d.ageMonths} months${d.weight ? `, ${d.weight}` : ''}).

Observed symptoms:
${d.symptoms}

AINA triage: ${d.level}
${d.message}

${d.vaccinesNote}
Could you advise on what to do? Thank you.

— Sent via AINA · this does not replace your medical opinion.`,

  mg: d => `Manao ahoana Dokotera,

Izaho ${d.parent}${d.parent ? ', ' : ''}ray aman-drenin'i ${d.babyName} (${d.ageMonths} volana${d.weight ? `, ${d.weight}` : ''}).

Soritr'aretina hita :
${d.symptoms}

Triage AINA : ${d.level}
${d.message}

${d.vaccinesNote}
Mba afaka manoro ahy ny fomba hatao ve ianao ? Misaotra.

— Nalefa amin'ny alalan'ny AINA · tsy manolo ny hevitrareo ara-pitsaboana.`,

  wo: d => `Salaam Doktoor,

Maa ngi ${d.parent}${d.parent ? ', ' : ''}waajuru ${d.babyName} (${d.ageMonths} weer${d.weight ? `, ${d.weight}` : ''}).

Mandargay yi gis nañu :
${d.symptoms}

Triage AINA : ${d.level}
${d.message}

${d.vaccinesNote}
Mën nga ma won lan laa war a def ? Jërejëf.

— Yónni nañu ko ci AINA · du wuutu sa xelu doktoor.`,
};

const VACCINES_NOTE: Record<'fr' | 'en' | 'mg' | 'wo', (n: number) => string> = {
  fr: n => n > 0 ? `Vaccins enregistrés : ${n}.\n` : '',
  en: n => n > 0 ? `Recorded vaccines: ${n}.\n` : '',
  mg: n => n > 0 ? `Vakisiny voarakitra : ${n}.\n` : '',
  wo: n => n > 0 ? `Vaksin yi nu duggal : ${n}.\n` : '',
};

export function composePediatricianMessage(args: ComposeArgs): string {
  const { profile, ageMonths, symptoms, result, weights, vaccines, parentDisplay, locale } = args;
  const lang = (['fr', 'en', 'mg', 'wo'] as const).includes(locale) ? locale : 'fr';
  const lastWeight = weights?.length ? weights[weights.length - 1].weight : null;
  const weightStr = lastWeight ? `${lastWeight.toFixed(1)} kg` : '';
  const tag = `${LEVEL_TAG[result.level]} ${result.level.toUpperCase()}`;
  const vaccinesNote = VACCINES_NOTE[lang](vaccines?.length ?? 0);

  return TEMPLATES[lang]({
    parent: parentDisplay,
    babyName: profile.name,
    ageMonths,
    weight: weightStr,
    symptoms: symptoms.trim(),
    level: tag,
    message: result.message,
    vaccinesNote,
  });
}

export async function shareMessage(text: string, title: string): Promise<'shared' | 'whatsapp' | 'clipboard'> {
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await navigator.share({ title, text });
      return 'shared';
    } catch {
      // user dismissed or unsupported — fall through
    }
  }

  const encoded = encodeURIComponent(text);
  const waUrl = `https://wa.me/?text=${encoded}`;
  if (typeof window !== 'undefined') {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    return 'whatsapp';
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return 'clipboard';
  }
  return 'clipboard';
}
