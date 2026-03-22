import { differenceInMonths, differenceInWeeks, differenceInDays, parseISO } from 'date-fns';

export function getAgeText(birthDate: string): string {
  const birth = parseISO(birthDate);
  const now = new Date();
  const months = differenceInMonths(now, birth);
  const weeks = differenceInWeeks(now, birth);
  const days = differenceInDays(now, birth);

  if (months >= 24) {
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? `${years} an${years > 1 ? 's' : ''} et ${rem} mois` : `${years} an${years > 1 ? 's' : ''}`;
  }
  if (months >= 1) {
    const remWeeks = Math.floor((days - months * 30.44) / 7);
    return remWeeks > 0 ? `${months} mois, ${remWeeks} semaine${remWeeks > 1 ? 's' : ''}` : `${months} mois`;
  }
  if (weeks >= 1) {
    return `${weeks} semaine${weeks > 1 ? 's' : ''}`;
  }
  return `${days} jour${days > 1 ? 's' : ''}`;
}

export function getAgeInMonths(birthDate: string): number {
  return differenceInMonths(new Date(), parseISO(birthDate));
}

export function getAgeInDays(birthDate: string): number {
  return differenceInDays(new Date(), parseISO(birthDate));
}
