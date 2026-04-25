import { COUNTRIES_BY_SCHEDULE } from './countries';
import type { LocalizedField } from '@/lib/i18n-data';

export interface Vaccine {
  id: string;
  name: LocalizedField<string>;
  ageMonths: number;
  ageLabel: LocalizedField<string>;
  diseases: LocalizedField<string>;
  country: string[]; // codes pays — aplatis depuis les groupes de calendrier
}

// Aliases pour garder le fichier lisible. Chaque ligne de vaccin liste
// les schedules qui s'appliquent, puis on aplatit en codes pays.
const PEV = COUNTRIES_BY_SCHEDULE['pev-base'];
const EUR = COUNTRIES_BY_SCHEDULE['european'];
const MAG = COUNTRIES_BY_SCHEDULE['maghreb'];

// ───────── Helpers pour les libellés d'âge (réutilisés) ─────────
const AGE_BIRTH: LocalizedField<string> = {
  fr: 'Naissance',
  en: 'Birth',
  mg: 'Fahaterahana',
  wo: 'Judd',
};
const ageMonths = (n: number): LocalizedField<string> => ({
  fr: `${n} mois`,
  en: `${n} month${n > 1 ? 's' : ''}`,
  mg: `volana ${n}`,
  wo: `${n} weer`,
});
const AGE_16_18: LocalizedField<string> = {
  fr: '16-18 mois',
  en: '16-18 months',
  mg: 'volana 16-18',
  wo: '16-18 weer',
};

// ───────── Libellés de maladies réutilisables ─────────
const D_TUBERCULOSE: LocalizedField<string> = {
  fr: 'Tuberculose', en: 'Tuberculosis', mg: 'Raboka', wo: 'Yarantu',
};
const D_HEPB: LocalizedField<string> = {
  fr: 'Hépatite B', en: 'Hepatitis B', mg: 'Hepatite B', wo: 'Hépatit B',
};
const D_POLIO: LocalizedField<string> = {
  fr: 'Poliomyélite', en: 'Poliomyelitis', mg: 'Polio', wo: 'Polio',
};
const D_PENTA: LocalizedField<string> = {
  fr: 'Diphtérie, Tétanos, Coqueluche, Hépatite B, Haemophilus',
  en: 'Diphtheria, Tetanus, Whooping cough, Hepatitis B, Haemophilus',
  mg: 'Difterie, Tetanôsy, Tsatsoka, Hepatite B, Haemophilus',
  wo: 'Difteri, Tetanoos, Sëqët, Hépatit B, Haemophilus',
};
const D_HEXA: LocalizedField<string> = {
  fr: 'Diphtérie, Tétanos, Coqueluche, Polio, Hib, Hépatite B',
  en: 'Diphtheria, Tetanus, Whooping cough, Polio, Hib, Hepatitis B',
  mg: 'Difterie, Tetanôsy, Tsatsoka, Polio, Hib, Hepatite B',
  wo: 'Difteri, Tetanoos, Sëqët, Polio, Hib, Hépatit B',
};
const D_PNEUMO: LocalizedField<string> = {
  fr: 'Pneumonie, Méningite',
  en: 'Pneumonia, Meningitis',
  mg: 'Aretin-tsoroka, Menenjita',
  wo: 'Sibbiru ci diir, Menenjit',
};
const D_ROTA: LocalizedField<string> = {
  fr: 'Gastro-entérite à Rotavirus',
  en: 'Rotavirus gastroenteritis',
  mg: 'Gastro noho ny rotavirus',
  wo: 'Biir-bu-daw bu rotawirus',
};
const D_MENINGO_C: LocalizedField<string> = {
  fr: 'Méningite C', en: 'Meningitis C', mg: 'Menenjita C', wo: 'Menenjit C',
};
const D_MENINGO_A: LocalizedField<string> = {
  fr: 'Méningite A', en: 'Meningitis A', mg: 'Menenjita A', wo: 'Menenjit A',
};
const D_VITA: LocalizedField<string> = {
  fr: 'Carence en Vitamine A',
  en: 'Vitamin A deficiency',
  mg: 'Tsy fahampian\'ny Vitamine A',
  wo: 'Ñàkk Vitamin A',
};
const D_ROR: LocalizedField<string> = {
  fr: 'Rougeole, Oreillons, Rubéole',
  en: 'Measles, Mumps, Rubella',
  mg: 'Kitrotro, Samonetina, Rubeola',
  wo: 'Xiibon, Ndongor, Ribeol',
};
const D_FJ: LocalizedField<string> = {
  fr: 'Fièvre Jaune', en: 'Yellow Fever', mg: 'Tazo mavo', wo: 'Tàngoor wu mboq',
};

// Maghreb suit globalement le schéma PEV pour la petite enfance
// avec quelques valences européennes (Hexavalent notamment).

export const vaccines: Vaccine[] = [
  // NAISSANCE
  {
    id: 'bcg',
    name: { fr: 'BCG', en: 'BCG', mg: 'BCG', wo: 'BCG' },
    ageMonths: 0,
    ageLabel: AGE_BIRTH,
    diseases: D_TUBERCULOSE,
    country: [...PEV, ...EUR, ...MAG],
  },
  {
    id: 'hepb-0',
    name: {
      fr: 'Hépatite B (dose naissance)',
      en: 'Hepatitis B (birth dose)',
      mg: 'Hepatite B (dôsy fahaterahana)',
      wo: 'Hépatit B (yokk judd)',
    },
    ageMonths: 0,
    ageLabel: AGE_BIRTH,
    diseases: D_HEPB,
    country: [...PEV, ...MAG],
  },
  {
    id: 'polio-0',
    name: {
      fr: 'VPO (dose naissance)',
      en: 'OPV (birth dose)',
      mg: 'VPO (dôsy fahaterahana)',
      wo: 'VPO (yokk judd)',
    },
    ageMonths: 0,
    ageLabel: AGE_BIRTH,
    diseases: D_POLIO,
    country: [...PEV, ...MAG],
  },

  // 2 MOIS
  {
    id: 'penta-1',
    name: {
      fr: 'Pentavalent 1 (DTC-HepB-Hib)',
      en: 'Pentavalent 1 (DTP-HepB-Hib)',
      mg: 'Pentavalent 1 (DTC-HepB-Hib)',
      wo: 'Pantawalaŋ 1 (DTC-HepB-Hib)',
    },
    ageMonths: 2,
    ageLabel: ageMonths(2),
    diseases: D_PENTA,
    country: [...PEV],
  },
  {
    id: 'hexa-1',
    name: {
      fr: 'Hexavalent 1',
      en: 'Hexavalent 1',
      mg: 'Hexavalent 1',
      wo: 'Eksawalaŋ 1',
    },
    ageMonths: 2,
    ageLabel: ageMonths(2),
    diseases: D_HEXA,
    country: [...EUR, ...MAG],
  },
  {
    id: 'pneumo-1',
    name: {
      fr: 'Pneumocoque 1 (PCV13)',
      en: 'Pneumococcal 1 (PCV13)',
      mg: 'Pneumocoque 1 (PCV13)',
      wo: 'Pnëmokok 1 (PCV13)',
    },
    ageMonths: 2,
    ageLabel: ageMonths(2),
    diseases: D_PNEUMO,
    country: [...PEV, ...EUR, ...MAG],
  },
  {
    id: 'rota-1',
    name: {
      fr: 'Rotavirus 1',
      en: 'Rotavirus 1',
      mg: 'Rotavirus 1',
      wo: 'Rotawirus 1',
    },
    ageMonths: 2,
    ageLabel: ageMonths(2),
    diseases: D_ROTA,
    country: [...PEV, ...EUR, ...MAG],
  },
  {
    id: 'polio-1',
    name: { fr: 'VPO 1', en: 'OPV 1', mg: 'VPO 1', wo: 'VPO 1' },
    ageMonths: 2,
    ageLabel: ageMonths(2),
    diseases: D_POLIO,
    country: [...PEV],
  },

  // 3 MOIS
  {
    id: 'rota-2',
    name: {
      fr: 'Rotavirus 2',
      en: 'Rotavirus 2',
      mg: 'Rotavirus 2',
      wo: 'Rotawirus 2',
    },
    ageMonths: 3,
    ageLabel: ageMonths(3),
    diseases: D_ROTA,
    country: [...PEV],
  },
  {
    id: 'meningo-c1',
    name: {
      fr: 'Méningocoque C 1',
      en: 'Meningococcal C 1',
      mg: 'Meningokoka C 1',
      wo: 'Meningokok C 1',
    },
    ageMonths: 3,
    ageLabel: ageMonths(3),
    diseases: D_MENINGO_C,
    country: [...EUR],
  },

  // 4 MOIS
  {
    id: 'penta-2',
    name: {
      fr: 'Pentavalent 2',
      en: 'Pentavalent 2',
      mg: 'Pentavalent 2',
      wo: 'Pantawalaŋ 2',
    },
    ageMonths: 4,
    ageLabel: ageMonths(4),
    diseases: D_PENTA,
    country: [...PEV],
  },
  {
    id: 'hexa-2',
    name: {
      fr: 'Hexavalent 2',
      en: 'Hexavalent 2',
      mg: 'Hexavalent 2',
      wo: 'Eksawalaŋ 2',
    },
    ageMonths: 4,
    ageLabel: ageMonths(4),
    diseases: D_HEXA,
    country: [...EUR, ...MAG],
  },
  {
    id: 'pneumo-2',
    name: {
      fr: 'Pneumocoque 2',
      en: 'Pneumococcal 2',
      mg: 'Pneumocoque 2',
      wo: 'Pnëmokok 2',
    },
    ageMonths: 4,
    ageLabel: ageMonths(4),
    diseases: D_PNEUMO,
    country: [...EUR, ...MAG],
  },
  {
    id: 'rota-2-fr',
    name: {
      fr: 'Rotavirus 2',
      en: 'Rotavirus 2',
      mg: 'Rotavirus 2',
      wo: 'Rotawirus 2',
    },
    ageMonths: 4,
    ageLabel: ageMonths(4),
    diseases: D_ROTA,
    country: [...EUR],
  },
  {
    id: 'polio-2',
    name: { fr: 'VPO 2', en: 'OPV 2', mg: 'VPO 2', wo: 'VPO 2' },
    ageMonths: 4,
    ageLabel: ageMonths(4),
    diseases: D_POLIO,
    country: [...PEV],
  },

  // 6 MOIS
  {
    id: 'penta-3',
    name: {
      fr: 'Pentavalent 3',
      en: 'Pentavalent 3',
      mg: 'Pentavalent 3',
      wo: 'Pantawalaŋ 3',
    },
    ageMonths: 6,
    ageLabel: ageMonths(6),
    diseases: D_PENTA,
    country: [...PEV],
  },
  {
    id: 'polio-3',
    name: { fr: 'VPO 3', en: 'OPV 3', mg: 'VPO 3', wo: 'VPO 3' },
    ageMonths: 6,
    ageLabel: ageMonths(6),
    diseases: D_POLIO,
    country: [...PEV],
  },
  {
    id: 'vita-1',
    name: {
      fr: 'Vitamine A (1re dose)',
      en: 'Vitamin A (1st dose)',
      mg: 'Vitamine A (dôsy voalohany)',
      wo: 'Vitamin A (yokk bu jëkk)',
    },
    ageMonths: 6,
    ageLabel: ageMonths(6),
    diseases: D_VITA,
    country: [...PEV],
  },

  // 9 MOIS
  {
    id: 'ror-1',
    name: {
      fr: 'ROR 1 (Rougeole-Oreillons-Rubéole)',
      en: 'MMR 1 (Measles-Mumps-Rubella)',
      mg: 'ROR 1 (Kitrotro-Samonetina-Rubeola)',
      wo: 'ROR 1 (Xiibon-Ndongor-Ribeol)',
    },
    ageMonths: 9,
    ageLabel: ageMonths(9),
    diseases: D_ROR,
    country: [...PEV],
  },
  {
    id: 'fievre-jaune',
    name: {
      fr: 'Fièvre Jaune',
      en: 'Yellow Fever',
      mg: 'Tazo mavo',
      wo: 'Tàngoor wu mboq',
    },
    ageMonths: 9,
    ageLabel: ageMonths(9),
    diseases: D_FJ,
    // Fièvre jaune : Afrique subsaharienne + certains pays d'Amérique tropicale (Haïti non recommandé)
    country: [...PEV.filter(c => c !== 'haiti' && c !== 'maurice' && c !== 'seychelles' && c !== 'comores')],
  },
  {
    id: 'meningo-a',
    name: {
      fr: 'Méningocoque A',
      en: 'Meningococcal A',
      mg: 'Meningokoka A',
      wo: 'Meningokok A',
    },
    ageMonths: 9,
    ageLabel: ageMonths(9),
    diseases: D_MENINGO_A,
    // Ceinture méningitique du Sahel
    country: ['senegal','mali','burkina-faso','niger','benin','togo','cote-ivoire','tchad','rca','cameroun','guinee','mauritanie'],
  },

  // 11 MOIS
  {
    id: 'hexa-3',
    name: {
      fr: 'Hexavalent 3 (rappel)',
      en: 'Hexavalent 3 (booster)',
      mg: 'Hexavalent 3 (famerenana)',
      wo: 'Eksawalaŋ 3 (delloo)',
    },
    ageMonths: 11,
    ageLabel: ageMonths(11),
    diseases: D_HEXA,
    country: [...EUR],
  },
  {
    id: 'pneumo-3',
    name: {
      fr: 'Pneumocoque 3 (rappel)',
      en: 'Pneumococcal 3 (booster)',
      mg: 'Pneumocoque 3 (famerenana)',
      wo: 'Pnëmokok 3 (delloo)',
    },
    ageMonths: 11,
    ageLabel: ageMonths(11),
    diseases: D_PNEUMO,
    country: [...EUR],
  },

  // 12 MOIS
  {
    id: 'ror-1-fr',
    name: { fr: 'ROR 1', en: 'MMR 1', mg: 'ROR 1', wo: 'ROR 1' },
    ageMonths: 12,
    ageLabel: ageMonths(12),
    diseases: D_ROR,
    country: [...EUR, ...MAG],
  },
  {
    id: 'meningo-c2',
    name: {
      fr: 'Méningocoque C (rappel)',
      en: 'Meningococcal C (booster)',
      mg: 'Meningokoka C (famerenana)',
      wo: 'Meningokok C (delloo)',
    },
    ageMonths: 12,
    ageLabel: ageMonths(12),
    diseases: D_MENINGO_C,
    country: [...EUR],
  },
  {
    id: 'pneumo-rappel',
    name: {
      fr: 'Pneumocoque (rappel)',
      en: 'Pneumococcal (booster)',
      mg: 'Pneumocoque (famerenana)',
      wo: 'Pnëmokok (delloo)',
    },
    ageMonths: 12,
    ageLabel: ageMonths(12),
    diseases: D_PNEUMO,
    country: [...PEV],
  },
  {
    id: 'vita-2',
    name: {
      fr: 'Vitamine A (2e dose)',
      en: 'Vitamin A (2nd dose)',
      mg: 'Vitamine A (dôsy faharoa)',
      wo: 'Vitamin A (ñaareelu yokk)',
    },
    ageMonths: 12,
    ageLabel: ageMonths(12),
    diseases: D_VITA,
    country: [...PEV],
  },

  // 16-18 MOIS
  {
    id: 'ror-2-fr',
    name: { fr: 'ROR 2', en: 'MMR 2', mg: 'ROR 2', wo: 'ROR 2' },
    ageMonths: 16,
    ageLabel: AGE_16_18,
    diseases: D_ROR,
    country: [...EUR, ...MAG],
  },
  {
    id: 'ror-2',
    name: { fr: 'ROR 2', en: 'MMR 2', mg: 'ROR 2', wo: 'ROR 2' },
    ageMonths: 18,
    ageLabel: ageMonths(18),
    diseases: D_ROR,
    country: [...PEV],
  },
];
