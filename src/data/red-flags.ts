export interface RedFlag {
  ageMonths: number;
  ageLabel: string;
  signs: string[];
}

export const redFlags: RedFlag[] = [
  {
    ageMonths: 4,
    ageLabel: "4 mois",
    signs: [
      "Ne tient pas sa tête",
      "Ne suit pas des yeux un objet en mouvement",
      "Ne sourit pas en réponse",
      "Ne réagit pas aux bruits forts",
    ],
  },
  {
    ageMonths: 9,
    ageLabel: "9 mois",
    signs: [
      "Ne tient pas assis même avec soutien",
      "Ne babille pas (pas de mamama, papapa)",
      "Ne réagit pas aux sons ou à son prénom",
      "Ne porte pas les objets à sa bouche",
    ],
  },
  {
    ageMonths: 12,
    ageLabel: "12 mois",
    signs: [
      "Ne se met pas debout avec appui",
      "Aucun mot, même imprécis",
      "Ne pointe pas du doigt",
      "Ne regarde pas dans la direction qu'on lui montre",
    ],
  },
  {
    ageMonths: 18,
    ageLabel: "18 mois",
    signs: [
      "Ne marche pas",
      "Dit moins de 5 mots",
      "Ne comprend pas les consignes simples (donne, viens)",
      "Perte d'acquis déjà obtenus",
    ],
  },
  {
    ageMonths: 24,
    ageLabel: "24 mois",
    signs: [
      "Ne fait pas de phrases de 2 mots",
      "Ne joue pas à faire semblant",
      "Ne montre pas d'intérêt pour les autres enfants",
      "Comportements répétitifs inhabituels",
    ],
  },
];

/**
 * Get the most relevant red flags for the child's age.
 * Returns the red flag for the nearest age milestone ≤ child's age.
 */
export function getRedFlagsForAge(ageInMonths: number): RedFlag | null {
  const applicable = redFlags.filter((rf) => ageInMonths >= rf.ageMonths);
  return applicable.length > 0 ? applicable[applicable.length - 1] : null;
}
