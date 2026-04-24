import { COUNTRIES_BY_SCHEDULE } from './countries';

export interface Vaccine {
  id: string;
  name: string;
  ageMonths: number;
  ageLabel: string;
  diseases: string;
  country: string[]; // codes pays — aplatis depuis les groupes de calendrier
}

// Aliases pour garder le fichier lisible. Chaque ligne de vaccin liste
// les schedules qui s'appliquent, puis on aplatit en codes pays.
const PEV = COUNTRIES_BY_SCHEDULE['pev-base'];
const EUR = COUNTRIES_BY_SCHEDULE['european'];
const MAG = COUNTRIES_BY_SCHEDULE['maghreb'];

// Maghreb suit globalement le schéma PEV pour la petite enfance
// avec quelques valences européennes (Hexavalent notamment).

export const vaccines: Vaccine[] = [
  // NAISSANCE
  { id: 'bcg',       name: 'BCG',                         ageMonths: 0, ageLabel: 'Naissance', diseases: 'Tuberculose',
    country: [...PEV, ...EUR, ...MAG] },
  { id: 'hepb-0',    name: 'Hépatite B (dose naissance)', ageMonths: 0, ageLabel: 'Naissance', diseases: 'Hépatite B',
    country: [...PEV, ...MAG] },
  { id: 'polio-0',   name: 'VPO (dose naissance)',        ageMonths: 0, ageLabel: 'Naissance', diseases: 'Poliomyélite',
    country: [...PEV, ...MAG] },

  // 2 MOIS
  { id: 'penta-1',   name: 'Pentavalent 1 (DTC-HepB-Hib)', ageMonths: 2, ageLabel: '2 mois',
    diseases: 'Diphtérie, Tétanos, Coqueluche, Hépatite B, Haemophilus',
    country: [...PEV] },
  { id: 'hexa-1',    name: 'Hexavalent 1', ageMonths: 2, ageLabel: '2 mois',
    diseases: 'Diphtérie, Tétanos, Coqueluche, Polio, Hib, Hépatite B',
    country: [...EUR, ...MAG] },
  { id: 'pneumo-1',  name: 'Pneumocoque 1 (PCV13)', ageMonths: 2, ageLabel: '2 mois',
    diseases: 'Pneumonie, Méningite',
    country: [...PEV, ...EUR, ...MAG] },
  { id: 'rota-1',    name: 'Rotavirus 1', ageMonths: 2, ageLabel: '2 mois',
    diseases: 'Gastro-entérite à Rotavirus',
    country: [...PEV, ...EUR, ...MAG] },
  { id: 'polio-1',   name: 'VPO 1', ageMonths: 2, ageLabel: '2 mois',
    diseases: 'Poliomyélite',
    country: [...PEV] },

  // 3 MOIS
  { id: 'rota-2',      name: 'Rotavirus 2', ageMonths: 3, ageLabel: '3 mois',
    diseases: 'Gastro-entérite à Rotavirus', country: [...PEV] },
  { id: 'meningo-c1',  name: 'Méningocoque C 1', ageMonths: 3, ageLabel: '3 mois',
    diseases: 'Méningite C', country: [...EUR] },

  // 4 MOIS
  { id: 'penta-2',    name: 'Pentavalent 2', ageMonths: 4, ageLabel: '4 mois',
    diseases: 'Diphtérie, Tétanos, Coqueluche, Hépatite B, Haemophilus',
    country: [...PEV] },
  { id: 'hexa-2',     name: 'Hexavalent 2', ageMonths: 4, ageLabel: '4 mois',
    diseases: 'Diphtérie, Tétanos, Coqueluche, Polio, Hib, Hépatite B',
    country: [...EUR, ...MAG] },
  { id: 'pneumo-2',   name: 'Pneumocoque 2', ageMonths: 4, ageLabel: '4 mois',
    diseases: 'Pneumonie, Méningite', country: [...EUR, ...MAG] },
  { id: 'rota-2-fr',  name: 'Rotavirus 2', ageMonths: 4, ageLabel: '4 mois',
    diseases: 'Gastro-entérite à Rotavirus', country: [...EUR] },
  { id: 'polio-2',    name: 'VPO 2', ageMonths: 4, ageLabel: '4 mois',
    diseases: 'Poliomyélite', country: [...PEV] },

  // 6 MOIS
  { id: 'penta-3',  name: 'Pentavalent 3', ageMonths: 6, ageLabel: '6 mois',
    diseases: 'Diphtérie, Tétanos, Coqueluche, Hépatite B, Haemophilus',
    country: [...PEV] },
  { id: 'polio-3',  name: 'VPO 3', ageMonths: 6, ageLabel: '6 mois',
    diseases: 'Poliomyélite', country: [...PEV] },
  { id: 'vita-1',   name: 'Vitamine A (1re dose)', ageMonths: 6, ageLabel: '6 mois',
    diseases: 'Carence en Vitamine A', country: [...PEV] },

  // 9 MOIS
  { id: 'ror-1',         name: 'ROR 1 (Rougeole-Oreillons-Rubéole)', ageMonths: 9, ageLabel: '9 mois',
    diseases: 'Rougeole, Oreillons, Rubéole', country: [...PEV] },
  { id: 'fievre-jaune',  name: 'Fièvre Jaune', ageMonths: 9, ageLabel: '9 mois',
    diseases: 'Fièvre Jaune',
    // Fièvre jaune : Afrique subsaharienne + certains pays d'Amérique tropicale (Haïti non recommandé)
    country: [...PEV.filter(c => c !== 'haiti' && c !== 'maurice' && c !== 'seychelles' && c !== 'comores')] },
  { id: 'meningo-a',     name: 'Méningocoque A', ageMonths: 9, ageLabel: '9 mois',
    diseases: 'Méningite A',
    // Ceinture méningitique du Sahel
    country: ['senegal','mali','burkina-faso','niger','benin','togo','cote-ivoire','tchad','rca','cameroun','guinee','mauritanie'] },

  // 11 MOIS
  { id: 'hexa-3',    name: 'Hexavalent 3 (rappel)', ageMonths: 11, ageLabel: '11 mois',
    diseases: 'Diphtérie, Tétanos, Coqueluche, Polio, Hib, Hépatite B',
    country: [...EUR] },
  { id: 'pneumo-3',  name: 'Pneumocoque 3 (rappel)', ageMonths: 11, ageLabel: '11 mois',
    diseases: 'Pneumonie, Méningite', country: [...EUR] },

  // 12 MOIS
  { id: 'ror-1-fr',        name: 'ROR 1', ageMonths: 12, ageLabel: '12 mois',
    diseases: 'Rougeole, Oreillons, Rubéole', country: [...EUR, ...MAG] },
  { id: 'meningo-c2',      name: 'Méningocoque C (rappel)', ageMonths: 12, ageLabel: '12 mois',
    diseases: 'Méningite C', country: [...EUR] },
  { id: 'pneumo-rappel',   name: 'Pneumocoque (rappel)', ageMonths: 12, ageLabel: '12 mois',
    diseases: 'Pneumonie, Méningite', country: [...PEV] },
  { id: 'vita-2',          name: 'Vitamine A (2e dose)', ageMonths: 12, ageLabel: '12 mois',
    diseases: 'Carence en Vitamine A', country: [...PEV] },

  // 16-18 MOIS
  { id: 'ror-2-fr',  name: 'ROR 2', ageMonths: 16, ageLabel: '16-18 mois',
    diseases: 'Rougeole, Oreillons, Rubéole', country: [...EUR, ...MAG] },
  { id: 'ror-2',     name: 'ROR 2', ageMonths: 18, ageLabel: '18 mois',
    diseases: 'Rougeole, Oreillons, Rubéole', country: [...PEV] },
];
