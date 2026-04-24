export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: FoodCategory;
  minMonths: number;
  maxMonths: number;
  texture: string;
  tips: string;
  isAllergen?: boolean;
  allergenInfo?: string;
  localContext?: {
    africa?: string;
    france?: string;
  };
}

export type FoodCategory =
  | "vegetable"
  | "fruit"
  | "cereal"
  | "protein"
  | "dairy"
  | "allergen"
  | "fat"
  | "other";

const categoryLabels: Record<FoodCategory, { label: string; emoji: string }> = {
  vegetable: { label: "Légumes", emoji: "🥕" },
  fruit: { label: "Fruits", emoji: "🍎" },
  cereal: { label: "Céréales", emoji: "🌾" },
  protein: { label: "Protéines", emoji: "🍗" },
  dairy: { label: "Produits laitiers", emoji: "🥛" },
  allergen: { label: "Allergènes", emoji: "⚠️" },
  fat: { label: "Matières grasses", emoji: "🫒" },
  other: { label: "Autres", emoji: "🍯" },
};

export { categoryLabels };

export const foodGuide: FoodItem[] = [
  // === 4-6 months: First tastes ===
  // Vegetables
  {
    id: "carotte", name: "Carotte", emoji: "🥕", category: "vegetable",
    minMonths: 4, maxMonths: 24, texture: "Purée très lisse",
    tips: "Premier légume idéal : goût doux et sucré. Cuire à la vapeur et mixer finement.",
    localContext: { africa: "Disponible partout. Bien laver avant cuisson.", france: "Bio de préférence pour les premiers mois." },
  },
  {
    id: "courgette", name: "Courgette", emoji: "🥒", category: "vegetable",
    minMonths: 4, maxMonths: 24, texture: "Purée très lisse",
    tips: "Très digeste et douce. Peler et épépiner pour les débuts.",
    localContext: { france: "Légume d'été parfait pour commencer." },
  },
  {
    id: "patate-douce", name: "Patate douce", emoji: "🍠", category: "vegetable",
    minMonths: 4, maxMonths: 24, texture: "Purée lisse",
    tips: "Naturellement sucrée, très appréciée des bébés. Riche en vitamine A.",
    localContext: { africa: "Excellente source locale de vitamine A. Cuire à la vapeur ou bouillir.", france: "Disponible toute l'année en magasin." },
  },
  {
    id: "potiron", name: "Potiron / Courge", emoji: "🎃", category: "vegetable",
    minMonths: 4, maxMonths: 24, texture: "Purée lisse",
    tips: "Goût doux et texture fondante. Parfait pour les premières purées.",
    localContext: { africa: "Courge locale très nutritive et économique." },
  },
  {
    id: "haricots-verts", name: "Haricots verts", emoji: "🫘", category: "vegetable",
    minMonths: 4, maxMonths: 24, texture: "Purée très lisse (sans fils)",
    tips: "Bien mixer pour enlever les fils. Associer à la pomme de terre pour adoucir.",
  },
  {
    id: "epinard", name: "Épinards", emoji: "🥬", category: "vegetable",
    minMonths: 6, maxMonths: 24, texture: "Purée lisse, petites quantités",
    tips: "Riche en fer. Donner en petites quantités mélangé à d'autres légumes.",
    localContext: { africa: "Les feuilles de manioc ou moringa sont d'excellentes alternatives locales." },
  },
  {
    id: "igname", name: "Igname", emoji: "🥔", category: "vegetable",
    minMonths: 6, maxMonths: 24, texture: "Purée lisse",
    tips: "Bonne source d'énergie. Bien cuire et mixer.",
    localContext: { africa: "Aliment de base parfait pour la diversification." },
  },
  {
    id: "manioc", name: "Manioc", emoji: "🥔", category: "vegetable",
    minMonths: 6, maxMonths: 24, texture: "Purée lisse, bien cuit",
    tips: "Toujours bien cuire le manioc (jamais cru). Source d'énergie importante.",
    localContext: { africa: "Aliment de base. S'assurer qu'il est bien cuit pour éliminer les composés toxiques." },
  },

  // Fruits
  {
    id: "banane", name: "Banane", emoji: "🍌", category: "fruit",
    minMonths: 4, maxMonths: 24, texture: "Écrasée à la fourchette",
    tips: "Fruit parfait pour commencer : pas besoin de cuisson. Choisir bien mûre.",
    localContext: { africa: "Banane plantain cuite aussi possible dès 6 mois.", france: "Bio de préférence." },
  },
  {
    id: "pomme", name: "Pomme", emoji: "🍎", category: "fruit",
    minMonths: 4, maxMonths: 24, texture: "Compote lisse",
    tips: "Cuire en compote sans sucre ajouté. Tous les variétés conviennent.",
  },
  {
    id: "poire", name: "Poire", emoji: "🍐", category: "fruit",
    minMonths: 4, maxMonths: 24, texture: "Compote lisse",
    tips: "Très douce et digeste. Cuire légèrement et mixer.",
  },
  {
    id: "mangue", name: "Mangue", emoji: "🥭", category: "fruit",
    minMonths: 6, maxMonths: 24, texture: "Purée lisse ou écrasée",
    tips: "Riche en vitamine A et C. Choisir bien mûre pour une saveur douce.",
    localContext: { africa: "Fruit local excellent, en saison." },
  },
  {
    id: "papaye", name: "Papaye", emoji: "🍈", category: "fruit",
    minMonths: 6, maxMonths: 24, texture: "Purée lisse",
    tips: "Riche en vitamines. Bien mûre, elle fond en bouche.",
    localContext: { africa: "Facilement disponible et très nutritive." },
  },
  {
    id: "avocat", name: "Avocat", emoji: "🥑", category: "fruit",
    minMonths: 6, maxMonths: 24, texture: "Écrasé à la fourchette",
    tips: "Riche en bons gras essentiels au cerveau. Pas besoin de cuisson.",
    localContext: { africa: "Excellent aliment local, riche en énergie." },
  },

  // Cereals
  {
    id: "riz", name: "Riz / Crème de riz", emoji: "🍚", category: "cereal",
    minMonths: 4, maxMonths: 24, texture: "Bouillie très liquide puis épaisse",
    tips: "Commencer par de la crème de riz très liquide. Épaissir progressivement.",
    localContext: { africa: "Bouillie de riz : base de la diversification dans beaucoup de pays.", france: "Céréales infantiles enrichies en fer recommandées." },
  },
  {
    id: "mil", name: "Mil / Sorgho", emoji: "🌾", category: "cereal",
    minMonths: 6, maxMonths: 24, texture: "Bouillie",
    tips: "Céréale locale très nutritive. Préparer en bouillie enrichie.",
    localContext: { africa: "Base traditionnelle. Enrichir avec du lait maternel ou de l'arachide en poudre." },
  },
  {
    id: "mais", name: "Maïs", emoji: "🌽", category: "cereal",
    minMonths: 6, maxMonths: 24, texture: "Bouillie fine",
    tips: "Farine de maïs en bouillie. Bien cuire pour une meilleure digestibilité.",
    localContext: { africa: "Bouillie de maïs enrichie : ajouter arachide pilée, poisson séché en poudre." },
  },

  // Proteins
  {
    id: "poulet", name: "Poulet", emoji: "🍗", category: "protein",
    minMonths: 6, maxMonths: 24, texture: "Mixé très fin puis haché",
    tips: "Première viande idéale : douce et facile à digérer. 10g/jour au début (2 cuillères à café).",
  },
  {
    id: "poisson", name: "Poisson", emoji: "🐟", category: "protein",
    minMonths: 6, maxMonths: 24, texture: "Mixé, sans arêtes",
    tips: "Poissons blancs d'abord (colin, sole). Riche en oméga-3 pour le cerveau.",
    localContext: { africa: "Poisson séché en poudre : excellent ajout aux bouillies.", france: "Éviter les poissons prédateurs (thon, espadon) : mercure." },
  },
  {
    id: "oeuf", name: "Œuf", emoji: "🥚", category: "protein",
    minMonths: 6, maxMonths: 24, texture: "Bien cuit, écrasé",
    tips: "Introduire œuf dur entier (blanc + jaune). Excellente source de protéines et fer.",
    isAllergen: true,
    allergenInfo: "L'œuf est un allergène majeur. Introduire dès 6 mois en petite quantité (1/4 d'œuf dur). Observer pendant 48h.",
  },
  {
    id: "legumineuses", name: "Lentilles / Haricots", emoji: "🫘", category: "protein",
    minMonths: 8, maxMonths: 24, texture: "Purée très lisse",
    tips: "Excellente source de protéines végétales et de fer. Bien cuire et mixer finement.",
    localContext: { africa: "Niébé (haricots à œil noir) : protéine locale abordable.", france: "Lentilles corail : cuisson rapide et goût doux." },
  },

  // Dairy
  {
    id: "yaourt", name: "Yaourt nature", emoji: "🥛", category: "dairy",
    minMonths: 6, maxMonths: 24, texture: "Nature, non sucré",
    tips: "Yaourt nature entier uniquement. Pas de yaourts sucrés ou aromatisés.",
    localContext: { france: "Yaourts au lait entier, nature. Pas de petit-suisse avant 9 mois." },
  },
  {
    id: "fromage", name: "Fromage", emoji: "🧀", category: "dairy",
    minMonths: 8, maxMonths: 24, texture: "Fondu ou râpé",
    tips: "Commencer par des fromages doux (gruyère, emmental). Éviter les fromages au lait cru avant 5 ans.",
    isAllergen: true,
    allergenInfo: "Les protéines de lait de vache sont un allergène majeur. Le yaourt et fromage sont généralement mieux tolérés que le lait entier.",
  },

  // Allergens
  {
    id: "arachide", name: "Arachide", emoji: "🥜", category: "allergen",
    minMonths: 4, maxMonths: 24, texture: "Poudre fine ou beurre lisse dilué",
    tips: "JAMAIS d'arachide entière ou en morceaux (risque d'étouffement). Utiliser de la poudre fine mélangée à une purée.",
    isAllergen: true,
    allergenInfo: "Introduction précoce recommandée (dès 4-6 mois) pour RÉDUIRE le risque d'allergie. Commencer par 1/2 cuillère à café de poudre dans une purée. Observer 48h.",
    localContext: { africa: "Pâte d'arachide diluée dans la bouillie : pratique traditionnelle bénéfique !", france: "Beurre de cacahuète lisse, en petite quantité dans une compote." },
  },
  {
    id: "gluten", name: "Gluten (blé, semoule)", emoji: "🍞", category: "allergen",
    minMonths: 4, maxMonths: 24, texture: "Semoule fine, pain trempé",
    tips: "Introduire progressivement : semoule fine dans les purées, puis croûton de pain à sucer.",
    isAllergen: true,
    allergenInfo: "Pas besoin d'attendre. Introduction dès 4-6 mois en petites quantités pour réduire le risque de maladie cœliaque.",
    localContext: { africa: "Bouillie de blé ou semoule de couscous fine.", france: "Pain, pâtes, semoule : introduire progressivement." },
  },
  {
    id: "lait-vache", name: "Lait de vache", emoji: "🥛", category: "allergen",
    minMonths: 12, maxMonths: 24, texture: "Liquide, en gobelet",
    tips: "Pas de lait de vache comme boisson principale avant 12 mois. Avant 12 mois : lait maternel ou préparation infantile.",
    isAllergen: true,
    allergenInfo: "Le lait de vache entier peut être la boisson principale après 12 mois. En petite quantité dans les préparations dès 6 mois (béchamel, etc.).",
  },

  // Fats
  {
    id: "huile-olive", name: "Huile d'olive", emoji: "🫒", category: "fat",
    minMonths: 6, maxMonths: 24, texture: "1 cuillère à café dans les purées",
    tips: "Ajouter systématiquement une matière grasse dans les purées. L'huile d'olive est la plus adaptée.",
    localContext: { africa: "L'huile d'arachide ou de palme rouge (riche en vitamine A) sont aussi très bien.", france: "Alterner huile d'olive, colza (oméga-3), et beurre." },
  },
  {
    id: "beurre", name: "Beurre", emoji: "🧈", category: "fat",
    minMonths: 6, maxMonths: 24, texture: "Noisette de beurre dans les purées",
    tips: "Une noisette de beurre dans les légumes : goût et apport en vitamine A.",
  },

  // Others
  {
    id: "eau", name: "Eau", emoji: "💧", category: "other",
    minMonths: 6, maxMonths: 24, texture: "Au gobelet, petites gorgées",
    tips: "Proposer de l'eau plate entre les repas dès le début des solides. Pas de jus de fruits.",
    localContext: { africa: "Eau filtrée ou bouillie puis refroidie.", france: "Eau du robinet ou eau en bouteille peu minéralisée." },
  },
];

export interface FoodAgeGroup {
  label: string;
  minMonths: number;
  maxMonths: number;
  description: string;
  emoji: string;
}

export const foodAgeGroups: FoodAgeGroup[] = [
  { label: "4-6 mois", minMonths: 4, maxMonths: 6, description: "Premières découvertes gustatives", emoji: "🍼" },
  { label: "6-9 mois", minMonths: 6, maxMonths: 9, description: "Textures et nouveaux goûts", emoji: "🥣" },
  { label: "9-12 mois", minMonths: 9, maxMonths: 12, description: "Morceaux fondants et autonomie", emoji: "🍽️" },
  { label: "12-24 mois", minMonths: 12, maxMonths: 24, description: "Repas variés en famille", emoji: "👨‍👩‍👧" },
];

export function getFoodsForAge(ageMonths: number): FoodItem[] {
  return foodGuide.filter((f) => ageMonths >= f.minMonths);
}

export function getFoodsByCategory(foods: FoodItem[]): Record<FoodCategory, FoodItem[]> {
  const grouped = {} as Record<FoodCategory, FoodItem[]>;
  for (const food of foods) {
    if (!grouped[food.category]) grouped[food.category] = [];
    grouped[food.category].push(food);
  }
  return grouped;
}
