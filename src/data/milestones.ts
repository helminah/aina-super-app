export interface Milestone {
  id: string;
  ageRange: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  domain: 'motor' | 'fine' | 'language' | 'social';
  domainLabel: string;
  domainEmoji: string;
  description: string;
}

export const milestones: Milestone[] = [
  // 0-2 mois
  { id: 'm-0-1', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Soulève brièvement la tête sur le ventre' },
  { id: 'm-0-2', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Mouvements symétriques des bras et jambes' },
  { id: 'm-0-3', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2, domain: 'fine', domainLabel: 'Motricité fine', domainEmoji: '✋', description: 'Réflexe de préhension (agrippe un doigt)' },
  { id: 'm-0-4', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Réagit aux sons forts' },
  { id: 'm-0-5', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Premiers gazouillis (areuh)' },
  { id: 'm-0-6', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Premier sourire social' },
  { id: 'm-0-7', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Fixe un visage du regard' },
  { id: 'm-0-8', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Se calme en étant pris dans les bras' },

  // 3-4 mois
  { id: 'm-3-1', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Tient sa tête droite en position assise' },
  { id: 'm-3-2', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Se retourne du ventre au dos' },
  { id: 'm-3-3', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4, domain: 'fine', domainLabel: 'Motricité fine', domainEmoji: '✋', description: 'Attrape volontairement un objet' },
  { id: 'm-3-4', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4, domain: 'fine', domainLabel: 'Motricité fine', domainEmoji: '✋', description: 'Porte les objets à la bouche' },
  { id: 'm-3-5', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Rit aux éclats' },
  { id: 'm-3-6', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Vocalise de manière variée' },
  { id: 'm-3-7', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Suit un objet des yeux sur 180°' },
  { id: 'm-3-8', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Reconnaît ses parents' },

  // 5-6 mois
  { id: 'm-5-1', ageRange: '5-6 mois', ageMinMonths: 5, ageMaxMonths: 6, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Tient assis avec appui' },
  { id: 'm-5-2', ageRange: '5-6 mois', ageMinMonths: 5, ageMaxMonths: 6, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Se retourne dans les deux sens' },
  { id: 'm-5-3', ageRange: '5-6 mois', ageMinMonths: 5, ageMaxMonths: 6, domain: 'fine', domainLabel: 'Motricité fine', domainEmoji: '✋', description: 'Transfère un objet d\'une main à l\'autre' },
  { id: 'm-5-4', ageRange: '5-6 mois', ageMinMonths: 5, ageMaxMonths: 6, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Babillage (ba-ba, da-da)' },
  { id: 'm-5-5', ageRange: '5-6 mois', ageMinMonths: 5, ageMaxMonths: 6, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Angoisse de séparation commence' },
  { id: 'm-5-6', ageRange: '5-6 mois', ageMinMonths: 5, ageMaxMonths: 6, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Tend les bras pour être porté' },

  // 7-9 mois
  { id: 'm-7-1', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Tient assis sans appui' },
  { id: 'm-7-2', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Rampe ou se déplace à 4 pattes' },
  { id: 'm-7-3', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9, domain: 'fine', domainLabel: 'Motricité fine', domainEmoji: '✋', description: 'Pince pouce-index (pince fine)' },
  { id: 'm-7-4', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Comprend "non"' },
  { id: 'm-7-5', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Dit "mama" ou "papa" (non spécifique)' },
  { id: 'm-7-6', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Joue à coucou / cache-cache' },
  { id: 'm-7-7', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Cherche un objet caché' },

  // 10-12 mois
  { id: 'm-10-1', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Se met debout avec appui' },
  { id: 'm-10-2', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Fait ses premiers pas (avec aide)' },
  { id: 'm-10-3', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12, domain: 'fine', domainLabel: 'Motricité fine', domainEmoji: '✋', description: 'Pointe du doigt' },
  { id: 'm-10-4', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12, domain: 'fine', domainLabel: 'Motricité fine', domainEmoji: '✋', description: 'Empile 2 cubes' },
  { id: 'm-10-5', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Dit 2-3 mots avec sens (mama, papa, dada)' },
  { id: 'm-10-6', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Comprend des consignes simples' },
  { id: 'm-10-7', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Fait "au revoir" de la main' },
  { id: 'm-10-8', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Imite les gestes de l\'adulte' },

  // 13-18 mois
  { id: 'm-13-1', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Marche seul' },
  { id: 'm-13-2', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Monte les escaliers à 4 pattes' },
  { id: 'm-13-3', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18, domain: 'fine', domainLabel: 'Motricité fine', domainEmoji: '✋', description: 'Gribouille avec un crayon' },
  { id: 'm-13-4', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18, domain: 'fine', domainLabel: 'Motricité fine', domainEmoji: '✋', description: 'Empile 3-4 cubes' },
  { id: 'm-13-5', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Dit 5-10 mots' },
  { id: 'm-13-6', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Montre les parties du corps' },
  { id: 'm-13-7', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Jeu symbolique simple (donne à manger à la poupée)' },
  { id: 'm-13-8', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Comprend et exécute des consignes' },

  // 19-24 mois
  { id: 'm-19-1', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Court' },
  { id: 'm-19-2', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24, domain: 'motor', domainLabel: 'Motricité globale', domainEmoji: '🏃', description: 'Tape dans un ballon' },
  { id: 'm-19-3', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24, domain: 'fine', domainLabel: 'Motricité fine', domainEmoji: '✋', description: 'Empile 6+ cubes' },
  { id: 'm-19-4', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24, domain: 'fine', domainLabel: 'Motricité fine', domainEmoji: '✋', description: 'Tourne les pages d\'un livre' },
  { id: 'm-19-5', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Associe 2 mots (phrase simple)' },
  { id: 'm-19-6', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24, domain: 'language', domainLabel: 'Langage', domainEmoji: '🗣️', description: 'Vocabulaire de 50+ mots' },
  { id: 'm-19-7', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Début du jeu parallèle avec d\'autres enfants' },
  { id: 'm-19-8', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24, domain: 'social', domainLabel: 'Social & Cognitif', domainEmoji: '🧠', description: 'Exprime ses émotions (colère, joie, frustration)' },
];
