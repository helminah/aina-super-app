export interface ToothInfo {
  id: string;
  name: string;
  position: "upper" | "lower";
  side: "left" | "right" | "center-left" | "center-right";
  eruptionRange: string; // e.g., "6-10 mois"
  order: number; // display order within the jaw
}

export const babyTeeth: ToothInfo[] = [
  // Upper jaw — left to right
  { id: "u-m2-r", name: "2ème molaire sup. droite", position: "upper", side: "right", eruptionRange: "23-33 mois", order: 1 },
  { id: "u-c-r", name: "Canine sup. droite", position: "upper", side: "right", eruptionRange: "16-23 mois", order: 2 },
  { id: "u-m1-r", name: "1ère molaire sup. droite", position: "upper", side: "right", eruptionRange: "13-19 mois", order: 3 },
  { id: "u-il-r", name: "Incisive latérale sup. droite", position: "upper", side: "right", eruptionRange: "9-13 mois", order: 4 },
  { id: "u-ic-r", name: "Incisive centrale sup. droite", position: "upper", side: "center-right", eruptionRange: "8-12 mois", order: 5 },
  { id: "u-ic-l", name: "Incisive centrale sup. gauche", position: "upper", side: "center-left", eruptionRange: "8-12 mois", order: 6 },
  { id: "u-il-l", name: "Incisive latérale sup. gauche", position: "upper", side: "left", eruptionRange: "9-13 mois", order: 7 },
  { id: "u-m1-l", name: "1ère molaire sup. gauche", position: "upper", side: "left", eruptionRange: "13-19 mois", order: 8 },
  { id: "u-c-l", name: "Canine sup. gauche", position: "upper", side: "left", eruptionRange: "16-23 mois", order: 9 },
  { id: "u-m2-l", name: "2ème molaire sup. gauche", position: "upper", side: "left", eruptionRange: "23-33 mois", order: 10 },

  // Lower jaw — left to right
  { id: "l-m2-l", name: "2ème molaire inf. gauche", position: "lower", side: "left", eruptionRange: "23-33 mois", order: 1 },
  { id: "l-c-l", name: "Canine inf. gauche", position: "lower", side: "left", eruptionRange: "16-23 mois", order: 2 },
  { id: "l-m1-l", name: "1ère molaire inf. gauche", position: "lower", side: "left", eruptionRange: "13-19 mois", order: 3 },
  { id: "l-il-l", name: "Incisive latérale inf. gauche", position: "lower", side: "left", eruptionRange: "10-16 mois", order: 4 },
  { id: "l-ic-l", name: "Incisive centrale inf. gauche", position: "lower", side: "center-left", eruptionRange: "6-10 mois", order: 5 },
  { id: "l-ic-r", name: "Incisive centrale inf. droite", position: "lower", side: "center-right", eruptionRange: "6-10 mois", order: 6 },
  { id: "l-il-r", name: "Incisive latérale inf. droite", position: "lower", side: "right", eruptionRange: "10-16 mois", order: 7 },
  { id: "l-m1-r", name: "1ère molaire inf. droite", position: "lower", side: "right", eruptionRange: "13-19 mois", order: 8 },
  { id: "l-c-r", name: "Canine inf. droite", position: "lower", side: "right", eruptionRange: "16-23 mois", order: 9 },
  { id: "l-m2-r", name: "2ème molaire inf. droite", position: "lower", side: "right", eruptionRange: "23-33 mois", order: 10 },
];

export const teethTips = [
  "🧊 Un anneau de dentition froid soulage les gencives douloureuses",
  "👆 Massez doucement les gencives avec un doigt propre",
  "💊 Paracétamol si fièvre légère liée à la poussée dentaire",
  "🍌 Proposez des aliments froids (compote froide, banane fraîche)",
  "🚫 Évitez les gels anesthésiants — non recommandés avant 2 ans",
];
