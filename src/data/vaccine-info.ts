// Informations éducatives pour chaque maladie ciblée par un vaccin.
// Clé = vaccine.id dans vaccines.ts. Utilisé par VaccineEducation.

export interface VaccineInfo {
  why: string;            // Pourquoi vacciner — phrase courte motivante
  disease: string;        // Description de la maladie
  risk: string;           // Gravité / complications possibles
  sideEffects?: string;   // Effets secondaires attendus après vaccin
  color?: string;         // Accent couleur pour la fiche
}

/**
 * Remarque : une seule entrée par "famille" de vaccin — certaines doses (rappels)
 * partagent la même éducation. La lookup tombe sur la racine de l'ID.
 */
export const vaccineInfo: Record<string, VaccineInfo> = {
  bcg: {
    why: 'Protège bébé contre une maladie grave qui atteint surtout les poumons.',
    disease: 'La tuberculose est causée par un microbe qui attaque les poumons (et parfois d\'autres organes). Elle se transmet par la toux.',
    risk: 'Chez le nourrisson, la tuberculose peut provoquer des formes graves (méningite, forme pulmonaire étendue).',
    sideEffects: 'Petite réaction locale qui peut laisser une cicatrice sur le bras, normale.',
    color: 'emerald',
  },
  hepb: {
    why: 'Empêche bébé d\'attraper un virus qui abîme le foie à long terme.',
    disease: 'L\'hépatite B est un virus qui s\'installe dans le foie. Peut devenir chronique et causer cirrhose ou cancer.',
    risk: 'Peut se transmettre de la mère au bébé à l\'accouchement ou dans l\'entourage familial.',
    sideEffects: 'Rougeur au point d\'injection, fièvre légère possible.',
    color: 'amber',
  },
  polio: {
    why: 'Empêche une maladie qui peut paralyser à vie.',
    disease: 'La poliomyélite est un virus qui attaque le système nerveux et peut paralyser les jambes, les bras, ou la respiration.',
    risk: 'Pas de traitement curatif — seule la vaccination prévient. Encore active dans certains pays.',
    sideEffects: 'Légère fièvre, peu d\'effets secondaires.',
    color: 'sky',
  },
  penta: {
    why: 'Un seul vaccin qui protège contre 5 maladies graves.',
    disease: 'Diphtérie (étouffement), Tétanos (contractures), Coqueluche (toux sévère), Hépatite B, Haemophilus (méningite).',
    risk: 'Ces maladies sont toutes potentiellement mortelles chez le nourrisson.',
    sideEffects: 'Fièvre (paracétamol autorisé), rougeur, bébé un peu grognon 24-48h.',
    color: 'violet',
  },
  hexa: {
    why: 'Protège contre 6 maladies en une seule injection.',
    disease: 'Diphtérie, Tétanos, Coqueluche, Polio, Hib (méningite), Hépatite B.',
    risk: 'Sans vaccin, ces maladies peuvent être graves voire mortelles.',
    sideEffects: 'Fièvre, rougeur locale, bébé grognon 24-48h. Paracétamol si fièvre.',
    color: 'violet',
  },
  pneumo: {
    why: 'Protège les poumons et le cerveau contre une bactérie dangereuse.',
    disease: 'Le pneumocoque cause otites, pneumonies et méningites chez le petit enfant.',
    risk: 'Les méningites pneumococciques peuvent laisser des séquelles neurologiques.',
    sideEffects: 'Fièvre possible, rougeur.',
    color: 'sky',
  },
  rota: {
    why: 'Évite des diarrhées très sévères qui peuvent déshydrater bébé.',
    disease: 'Le rotavirus provoque des gastro-entérites aiguës chez les nourrissons.',
    risk: 'Déshydratation rapide — principale cause d\'hospitalisation pour gastro avant 2 ans.',
    sideEffects: 'Vaccin oral, peu d\'effets secondaires, parfois selles un peu molles.',
    color: 'amber',
  },
  ror: {
    why: 'Triple protection contre 3 maladies très contagieuses.',
    disease: 'Rougeole (éruption + forte fièvre), Oreillons (glandes gonflées), Rubéole (dangereuse si grossesse).',
    risk: 'La rougeole reste l\'une des maladies infantiles les plus meurtrières sans vaccin.',
    sideEffects: 'Fièvre et éruption légères 7-10 jours après la vaccination (réaction normale).',
    color: 'rose',
  },
  'fievre-jaune': {
    why: 'Protège contre une maladie transmise par le moustique, grave en Afrique.',
    disease: 'La fièvre jaune cause fièvre, jaunisse et peut toucher le foie et les reins.',
    risk: 'Maladie pouvant être mortelle. Endémique dans de nombreux pays africains.',
    sideEffects: 'Légère fièvre 1-2 jours après, fatigue.',
    color: 'amber',
  },
  'meningo-a': {
    why: 'Protège contre les méningites de la "ceinture méningitique" africaine.',
    disease: 'Le méningocoque A cause des méningites rapidement mortelles.',
    risk: 'Épidémies saisonnières au Sahel, les enfants sont les plus touchés.',
    sideEffects: 'Rougeur, petite fièvre.',
    color: 'sky',
  },
  'meningo-c': {
    why: 'Protège contre le méningocoque C (méningite / septicémie).',
    disease: 'Infection à méningocoque C : méningite ou infection généralisée du sang.',
    risk: 'Peut tuer en quelques heures. Le vaccin est très efficace.',
    sideEffects: 'Rougeur locale, peu d\'effets.',
    color: 'sky',
  },
  vita: {
    why: 'Renforce immunité et prévient problèmes de vue.',
    disease: 'La carence en vitamine A cause cécité nocturne et baisse de l\'immunité.',
    risk: 'Fréquente dans certaines régions avec alimentation peu variée.',
    sideEffects: 'Aucun à dose standard. Goutte orale.',
    color: 'amber',
  },
};

/** Trouve l'entrée éducative pour un vaccine.id (en coupant le suffixe -1, -2-fr, etc.). */
export function getVaccineInfo(vaccineId: string): VaccineInfo | null {
  // Tenter l'id exact
  if (vaccineInfo[vaccineId]) return vaccineInfo[vaccineId];
  // Sinon chercher une racine
  const root = vaccineId.replace(/-\d+$/, '').replace(/-\d+-fr$/, '').replace(/-rappel$/, '').replace(/-fr$/, '');
  if (vaccineInfo[root]) return vaccineInfo[root];
  // Fallbacks par préfixe
  for (const key of Object.keys(vaccineInfo)) {
    if (vaccineId.startsWith(key)) return vaccineInfo[key];
  }
  return null;
}
