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
  phoneCode: string;
  schedule: VaccineSchedule;
  region: 'afrique-ouest' | 'afrique-centrale' | 'afrique-est' | 'ocean-indien' | 'maghreb' | 'europe' | 'amerique';
}

export const COUNTRIES: CountryMeta[] = [
  // Afrique de l'Ouest
  { code: 'senegal',       label: 'Sénégal',        flag: '🇸🇳', phoneCode: '+221', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'cote-ivoire',   label: 'Côte d\'Ivoire', flag: '🇨🇮', phoneCode: '+225', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'mali',          label: 'Mali',           flag: '🇲🇱', phoneCode: '+223', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'burkina-faso',  label: 'Burkina Faso',   flag: '🇧🇫', phoneCode: '+226', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'niger',         label: 'Niger',          flag: '🇳🇪', phoneCode: '+227', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'benin',         label: 'Bénin',          flag: '🇧🇯', phoneCode: '+229', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'togo',          label: 'Togo',           flag: '🇹🇬', phoneCode: '+228', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'guinee',        label: 'Guinée',         flag: '🇬🇳', phoneCode: '+224', schedule: 'pev-base', region: 'afrique-ouest' },
  { code: 'mauritanie',    label: 'Mauritanie',     flag: '🇲🇷', phoneCode: '+222', schedule: 'pev-base', region: 'afrique-ouest' },

  // Afrique Centrale
  { code: 'cameroun',      label: 'Cameroun',       flag: '🇨🇲', phoneCode: '+237', schedule: 'pev-base', region: 'afrique-centrale' },
  { code: 'gabon',         label: 'Gabon',          flag: '🇬🇦', phoneCode: '+241', schedule: 'pev-base', region: 'afrique-centrale' },
  { code: 'congo',         label: 'Congo',          flag: '🇨🇬', phoneCode: '+242', schedule: 'pev-base', region: 'afrique-centrale' },
  { code: 'rdc',           label: 'RD Congo',       flag: '🇨🇩', phoneCode: '+243', schedule: 'pev-base', region: 'afrique-centrale' },
  { code: 'tchad',         label: 'Tchad',          flag: '🇹🇩', phoneCode: '+235', schedule: 'pev-base', region: 'afrique-centrale' },
  { code: 'rca',           label: 'Centrafrique',   flag: '🇨🇫', phoneCode: '+236', schedule: 'pev-base', region: 'afrique-centrale' },

  // Afrique de l'Est
  { code: 'rwanda',        label: 'Rwanda',         flag: '🇷🇼', phoneCode: '+250', schedule: 'pev-base', region: 'afrique-est' },
  { code: 'burundi',       label: 'Burundi',        flag: '🇧🇮', phoneCode: '+257', schedule: 'pev-base', region: 'afrique-est' },
  { code: 'djibouti',      label: 'Djibouti',       flag: '🇩🇯', phoneCode: '+253', schedule: 'pev-base', region: 'afrique-est' },

  // Océan Indien
  { code: 'madagascar',    label: 'Madagascar',     flag: '🇲🇬', phoneCode: '+261', schedule: 'pev-base', region: 'ocean-indien' },
  { code: 'comores',       label: 'Comores',        flag: '🇰🇲', phoneCode: '+269', schedule: 'pev-base', region: 'ocean-indien' },
  { code: 'maurice',       label: 'Maurice',        flag: '🇲🇺', phoneCode: '+230', schedule: 'pev-base', region: 'ocean-indien' },
  { code: 'seychelles',    label: 'Seychelles',     flag: '🇸🇨', phoneCode: '+248', schedule: 'pev-base', region: 'ocean-indien' },

  // Maghreb
  { code: 'maroc',         label: 'Maroc',          flag: '🇲🇦', phoneCode: '+212', schedule: 'maghreb',  region: 'maghreb' },
  { code: 'algerie',       label: 'Algérie',        flag: '🇩🇿', phoneCode: '+213', schedule: 'maghreb',  region: 'maghreb' },
  { code: 'tunisie',       label: 'Tunisie',        flag: '🇹🇳', phoneCode: '+216', schedule: 'maghreb',  region: 'maghreb' },

  // Europe
  { code: 'france',        label: 'France',         flag: '🇫🇷', phoneCode: '+33',  schedule: 'european', region: 'europe' },
  { code: 'belgique',      label: 'Belgique',       flag: '🇧🇪', phoneCode: '+32',  schedule: 'european', region: 'europe' },
  { code: 'suisse',        label: 'Suisse',         flag: '🇨🇭', phoneCode: '+41',  schedule: 'european', region: 'europe' },
  { code: 'luxembourg',    label: 'Luxembourg',     flag: '🇱🇺', phoneCode: '+352', schedule: 'european', region: 'europe' },

  // Amérique
  { code: 'canada',        label: 'Canada',         flag: '🇨🇦', phoneCode: '+1',   schedule: 'european', region: 'amerique' },
  { code: 'united-states', label: 'United States',  flag: '🇺🇸', phoneCode: '+1',   schedule: 'cdc-usa',  region: 'amerique' },
  { code: 'haiti',         label: 'Haïti',          flag: '🇭🇹', phoneCode: '+509', schedule: 'pev-base', region: 'amerique' },
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
