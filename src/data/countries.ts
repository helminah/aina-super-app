// Pays supportés par AINA, regroupés par calendrier vaccinal.
// "schedule" détermine quel set de vaccins s'applique (voir vaccines.ts).
// - pev-base  : PEV/EPI OMS (Afrique subsaharienne francophone + Haïti/Maurice…)
// - european  : calendrier Hexavalent type Europe de l'Ouest + Québec
// - maghreb   : Maroc / Algérie / Tunisie (mix PEV + européen)

export type VaccineSchedule = 'pev-base' | 'european' | 'maghreb' | 'cdc-usa';

export interface CountryMeta {
  code: string;
  label: string;
  flag: string;
  schedule: VaccineSchedule;
  region: 'afrique-ouest' | 'afrique-centrale' | 'afrique-est' | 'ocean-indien' | 'maghreb' | 'europe' | 'amerique';
}

export const COUNTRIES: CountryMeta[] = [
  // Afrique de l'Ouest
  { code: 'senegal',       label: 'Sénégal',        flag: '🇸🇳', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'cote-ivoire',   label: 'Côte d\'Ivoire', flag: '🇨🇮', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'mali',          label: 'Mali',           flag: '🇲🇱', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'burkina-faso',  label: 'Burkina Faso',   flag: '🇧🇫', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'niger',         label: 'Niger',          flag: '🇳🇪', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'benin',         label: 'Bénin',          flag: '🇧🇯', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'togo',          label: 'Togo',           flag: '🇹🇬', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'guinee',        label: 'Guinée',         flag: '🇬🇳', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'mauritanie',    label: 'Mauritanie',     flag: '🇲🇷', schedule: 'pev-base', region: 'afrique-ouest' },

  // Afrique Centrale
  { code: 'cameroun',      label: 'Cameroun',       flag: '🇨🇲', schedule: 'pev-base', region: 'afrique-centrale' },
  { code: 'gabon',         label: 'Gabon',          flag: '🇬🇦', schedule: 'pev-base', region: 'afrique-centrale' },
  { code: 'congo',         label: 'Congo',          flag: '🇨🇬', schedule: 'pev-base', region: 'afrique-centrale' },
  { code: 'rdc',           label: 'RD Congo',       flag: '🇨🇩', schedule: 'pev-base', region: 'afrique-centrale' },
  { code: 'tchad',         label: 'Tchad',          flag: '🇹🇩', schedule: 'pev-base', region: 'afrique-centrale' },
  { code: 'rca',           label: 'Centrafrique',   flag: '🇨🇫', schedule: 'pev-base', region: 'afrique-centrale' },

  // Afrique de l'Est
  { code: 'rwanda',        label: 'Rwanda',         flag: '🇷🇼', schedule: 'pev-base', region: 'afrique-est' },
  { code: 'burundi',       label: 'Burundi',        flag: '🇧🇮', schedule: 'pev-base', region: 'afrique-est' },
  { code: 'djibouti',      label: 'Djibouti',       flag: '🇩🇯', schedule: 'pev-base', region: 'afrique-est' },

  // Océan Indien
  { code: 'madagascar',    label: 'Madagascar',     flag: '🇲🇬', schedule: 'pev-base', region: 'ocean-indien' },
  { code: 'comores',       label: 'Comores',        flag: '🇰🇲', schedule: 'pev-base', region: 'ocean-indien' },
  { code: 'maurice',       label: 'Maurice',        flag: '🇲🇺', schedule: 'pev-base', region: 'ocean-indien' },
  { code: 'seychelles',    label: 'Seychelles',     flag: '🇸🇨', schedule: 'pev-base', region: 'ocean-indien' },

  // Maghreb
  { code: 'maroc',         label: 'Maroc',          flag: '🇲🇦', schedule: 'maghreb',  region: 'maghreb' },
  { code: 'algerie',       label: 'Algérie',        flag: '🇩🇿', schedule: 'maghreb',  region: 'maghreb' },
  { code: 'tunisie',       label: 'Tunisie',        flag: '🇹🇳', schedule: 'maghreb',  region: 'maghreb' },

  // Europe
  { code: 'france',        label: 'France',         flag: '🇫🇷', schedule: 'european', region: 'europe' },
  { code: 'belgique',      label: 'Belgique',       flag: '🇧🇪', schedule: 'european', region: 'europe' },
  { code: 'suisse',        label: 'Suisse',         flag: '🇨🇭', schedule: 'european', region: 'europe' },
  { code: 'luxembourg',    label: 'Luxembourg',     flag: '🇱🇺', schedule: 'european', region: 'europe' },

  // Amérique
  { code: 'canada',        label: 'Canada',         flag: '🇨🇦', schedule: 'european', region: 'amerique' },
  { code: 'united-states', label: 'United States',  flag: '🇺🇸', schedule: 'cdc-usa',  region: 'amerique' },
  { code: 'haiti',         label: 'Haïti',          flag: '🇭🇹', schedule: 'pev-base', region: 'amerique' },
];

export const REGION_LABELS: Record<CountryMeta['region'], string> = {
  'afrique-ouest':    'Afrique de l\'Ouest',
  'afrique-centrale': 'Afrique Centrale',
  'afrique-est':      'Afrique de l\'Est',
  'ocean-indien':     'Océan Indien',
  'maghreb':          'Maghreb',
  'europe':           'Europe',
  'amerique':         'Amérique',
};

export const REGION_ORDER: CountryMeta['region'][] = [
  'afrique-ouest',
  'afrique-centrale',
  'afrique-est',
  'ocean-indien',
  'maghreb',
  'europe',
  'amerique',
];

export const COUNTRY_BY_CODE: Record<string, CountryMeta> = Object.fromEntries(
  COUNTRIES.map(c => [c.code, c]),
);

export function getSchedule(code: string): VaccineSchedule {
  return COUNTRY_BY_CODE[code]?.schedule ?? 'pev-base';
}

export const COUNTRIES_BY_SCHEDULE = {
  'pev-base': COUNTRIES.filter(c => c.schedule === 'pev-base').map(c => c.code),
  'european': COUNTRIES.filter(c => c.schedule === 'european').map(c => c.code),
  'maghreb':  COUNTRIES.filter(c => c.schedule === 'maghreb').map(c => c.code),
  'cdc-usa':  COUNTRIES.filter(c => c.schedule === 'cdc-usa').map(c => c.code),
} as const;
