import { differenceInMonths, differenceInWeeks, differenceInDays, parseISO } from 'date-fns';
import i18n from 'i18next';

type Lang = 'fr' | 'en' | 'mg' | 'wo';

const AGE_LABELS: Record<Lang, { day: string; days: string; week: string; weeks: string; month: string; year: string; years: string; and: string }> = {
  fr: { day: 'jour', days: 'jours', week: 'semaine', weeks: 'semaines', month: 'mois', year: 'an', years: 'ans', and: 'et' },
  en: { day: 'day', days: 'days', week: 'week', weeks: 'weeks', month: 'month', year: 'year', years: 'years', and: 'and' },
  mg: { day: 'andro', days: 'andro', week: 'herinandro', weeks: 'herinandro', month: 'volana', year: 'taona', years: 'taona', and: 'sy' },
  wo: { day: 'fan', days: 'fan', week: 'ayubés', weeks: 'ayubés', month: 'weer', year: 'at', years: 'at', and: 'ak' },
};

export function getAgeText(birthDate: string): string {
  const lang = ((i18n.language ?? 'fr').slice(0, 2)) as Lang;
  const L = AGE_LABELS[lang] ?? AGE_LABELS.fr;
  const birth = parseISO(birthDate);
  const now = new Date();
  const months = differenceInMonths(now, birth);
  const weeks = differenceInWeeks(now, birth);
  const days = differenceInDays(now, birth);

  if (months >= 24) {
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0
      ? `${years} ${years > 1 ? L.years : L.year} ${L.and} ${rem} ${L.month}`
      : `${years} ${years > 1 ? L.years : L.year}`;
  }
  if (months >= 1) {
    const remWeeks = Math.floor((days - months * 30.44) / 7);
    return remWeeks > 0
      ? `${months} ${L.month}, ${remWeeks} ${remWeeks > 1 ? L.weeks : L.week}`
      : `${months} ${L.month}`;
  }
  if (weeks >= 1) {
    return `${weeks} ${weeks > 1 ? L.weeks : L.week}`;
  }
  return `${days} ${days > 1 ? L.days : L.day}`;
}

export function getAgeInMonths(birthDate: string): number {
  return differenceInMonths(new Date(), parseISO(birthDate));
}

export function getAgeInDays(birthDate: string): number {
  return differenceInDays(new Date(), parseISO(birthDate));
}
