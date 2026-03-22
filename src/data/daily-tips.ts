export interface DailyTip {
  id: number;
  category: 'nutrition' | 'sleep' | 'development' | 'health' | 'wellbeing';
  categoryEmoji: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  title: string;
  content: string;
}

export const dailyTips: DailyTip[] = [
  { id: 1, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 0, ageMaxMonths: 3, title: 'L\'allaitement exclusif', content: 'Jusqu\'à 6 mois, le lait maternel (ou le lait infantile) couvre 100% des besoins de bébé. Pas besoin d\'eau ni de complément.' },
  { id: 2, category: 'sleep', categoryEmoji: '🌙', ageMinMonths: 0, ageMaxMonths: 3, title: 'Le sommeil du nouveau-né', content: 'Un nouveau-né dort 16 à 18h par jour. Couchez-le toujours sur le dos, dans un lit sans oreiller ni couverture épaisse.' },
  { id: 3, category: 'development', categoryEmoji: '🧒', ageMinMonths: 0, ageMaxMonths: 3, title: 'Le peau à peau', content: 'Le contact peau à peau régule la température, favorise l\'allaitement et renforce le lien parent-enfant. N\'hésitez pas !' },
  { id: 4, category: 'health', categoryEmoji: '💊', ageMinMonths: 0, ageMaxMonths: 6, title: 'La vitamine D', content: 'En complément de l\'alimentation, la vitamine D est recommandée dès la naissance pour prévenir le rachitisme.' },
  { id: 5, category: 'wellbeing', categoryEmoji: '💛', ageMinMonths: 0, ageMaxMonths: 24, title: 'Prenez soin de vous', content: 'Être parent est un marathon, pas un sprint. N\'oubliez pas de prendre du temps pour vous. Votre bien-être compte aussi.' },
  { id: 6, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 4, ageMaxMonths: 6, title: 'Bientôt la diversification', content: 'Entre 4 et 6 mois, bébé montre des signes qu\'il est prêt : il tient sa tête, s\'intéresse à votre assiette, ne repousse plus la cuillère.' },
  { id: 7, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 6, ageMaxMonths: 8, title: 'Premiers aliments', content: 'Commencez par les légumes (1 par jour, 3 jours de suite) puis les fruits. Texture lisse et homogène, sans sel ni sucre ajouté.' },
  { id: 8, category: 'sleep', categoryEmoji: '🌙', ageMinMonths: 4, ageMaxMonths: 8, title: 'Rituel du coucher', content: 'Instaurez une routine douce : bain, massage, histoire, chanson. La régularité rassure et prépare au sommeil.' },
  { id: 9, category: 'development', categoryEmoji: '🧒', ageMinMonths: 4, ageMaxMonths: 6, title: 'Le temps sur le ventre', content: 'Quelques minutes sur le ventre chaque jour renforcent les muscles du cou et du dos. Restez toujours à côté de bébé.' },
  { id: 10, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 6, ageMaxMonths: 12, title: 'L\'importance du fer', content: 'Dès 6 mois, les réserves en fer baissent. Introduisez viande, poisson et légumineuses régulièrement.' },
  { id: 11, category: 'health', categoryEmoji: '💊', ageMinMonths: 0, ageMaxMonths: 24, title: 'Calendrier vaccinal', content: 'Respectez le calendrier vaccinal de votre pays. Les vaccins protègent votre bébé de maladies graves et potentiellement mortelles.' },
  { id: 12, category: 'development', categoryEmoji: '🧒', ageMinMonths: 7, ageMaxMonths: 12, title: 'Les premiers mots', content: 'Parlez souvent à bébé, nommez les objets, lisez des histoires. Le langage se construit bien avant les premiers mots !' },
  { id: 13, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 8, ageMaxMonths: 12, title: 'Textures évolutives', content: 'Passez progressivement des purées lisses aux textures moulinées puis écrasées. Bébé apprend à mâcher même sans dents !' },
  { id: 14, category: 'wellbeing', categoryEmoji: '💛', ageMinMonths: 0, ageMaxMonths: 24, title: 'Le portage', content: 'Porter bébé en écharpe ou porte-bébé libère vos mains tout en assurant proximité et réconfort.' },
  { id: 15, category: 'health', categoryEmoji: '💊', ageMinMonths: 0, ageMaxMonths: 24, title: 'Température de bébé', content: 'La température normale est 36.5-37.5°C. Au-dessus de 38°C, c\'est de la fièvre. Consultez si bébé a moins de 3 mois.' },
  { id: 16, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 6, ageMaxMonths: 12, title: 'Huile dans les purées', content: 'Ajoutez 1 cuillère à café d\'huile (colza, olive) dans chaque purée. Les lipides sont essentiels au développement du cerveau.' },
  { id: 17, category: 'sleep', categoryEmoji: '🌙', ageMinMonths: 6, ageMaxMonths: 12, title: 'Régressions de sommeil', content: 'Vers 8-10 mois, bébé peut se réveiller plus souvent. C\'est lié à l\'angoisse de séparation. Rassurez-le, ça passera.' },
  { id: 18, category: 'development', categoryEmoji: '🧒', ageMinMonths: 10, ageMaxMonths: 18, title: 'Les premiers pas', content: 'Chaque enfant marche à son rythme (10-18 mois). Pieds nus à la maison pour un bon développement. Pas de trotteur !' },
  { id: 19, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 12, ageMaxMonths: 24, title: 'Manger comme les grands', content: 'Dès 12 mois, bébé peut manger de tout (sauf miel cru avant 1 an). Adaptez la taille des morceaux, pas les goûts !' },
  { id: 20, category: 'health', categoryEmoji: '💊', ageMinMonths: 0, ageMaxMonths: 24, title: 'L\'hydratation', content: 'Dès la diversification, proposez de l\'eau à chaque repas. Évitez jus de fruits et sodas. L\'eau est la seule boisson indispensable.' },
];

export function getTipOfTheDay(ageMonths: number): DailyTip {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const applicable = dailyTips.filter(t => ageMonths >= t.ageMinMonths && ageMonths <= t.ageMaxMonths);
  if (applicable.length === 0) return dailyTips[0];
  return applicable[dayOfYear % applicable.length];
}
