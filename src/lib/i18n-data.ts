import i18n from '@/i18n';

export type SupportedDataLang = 'fr' | 'en' | 'mg' | 'wo';

export interface LocalizedField<T = string> {
  fr: T;
  en?: T;
  mg?: T;
  wo?: T;
}

/**
 * Récupère la valeur localisée d'un champ multilingue.
 * Fallback : si la langue courante n'est pas disponible, on retourne la valeur française.
 */
export function getLocalizedField<T>(field: LocalizedField<T> | T): T {
  // Rétro-compatibilité : si le champ est une string simple (ancien format), on la retourne tel quel.
  if (field == null || typeof field !== 'object') {
    return field as T;
  }
  const obj = field as LocalizedField<T>;
  if (!('fr' in obj)) {
    return field as T;
  }
  const raw = i18n.language ?? 'fr';
  const lang = raw.slice(0, 2) as SupportedDataLang;
  return (obj[lang] ?? obj.fr) as T;
}

/**
 * Raccourci utile quand on veut juste lire directement (sans hook).
 * Les composants React peuvent aussi l'utiliser puisque i18n.language
 * est mis à jour via useTranslation().
 */
export const tl = getLocalizedField;

/**
 * Traduit un ageRange FR ("0-2 mois", "3-4 mois"…) vers la langue courante.
 * Utilisé pour les milestones dont le `ageRange` est une clé FR codée en dur.
 * Pour les plages non listées dans i18n, on remplace simplement "mois" par l'équivalent.
 */
export function translateAgeRange(ageRangeFr: string): string {
  const match = ageRangeFr.match(/^(\d+)-(\d+)\s*mois/);
  if (!match) return ageRangeFr;
  const key = `health.development.age_range_${match[1]}_${match[2]}`;
  const translated = i18n.t(key, { defaultValue: '' });
  if (translated) return translated;
  // Generic fallback : replace the month suffix with the current language's equivalent.
  const monthSuffix = i18n.t('recipe_detail.months_suffix', { defaultValue: 'mois' });
  return ageRangeFr.replace(/mois/g, monthSuffix);
}
