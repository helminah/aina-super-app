import type { LocalizedField } from '@/lib/i18n-data';

export interface FoodItem {
  id: string;
  name: LocalizedField;
  emoji: string;
  category: FoodCategory;
  minMonths: number;
  maxMonths: number;
  texture: LocalizedField;
  tips: LocalizedField;
  isAllergen?: boolean;
  allergenInfo?: LocalizedField;
  localContext?: {
    africa?: LocalizedField;
    france?: LocalizedField;
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

const categoryLabels: Record<FoodCategory, { label: LocalizedField; emoji: string }> = {
  vegetable: {
    label: { fr: 'Légumes', en: 'Vegetables', mg: 'Legioma', wo: 'Jaxatu' },
    emoji: '🥕',
  },
  fruit: {
    label: { fr: 'Fruits', en: 'Fruits', mg: 'Voankazo', wo: 'Meñ' },
    emoji: '🍎',
  },
  cereal: {
    label: { fr: 'Céréales', en: 'Cereals', mg: 'Voamadinika', wo: 'Dugub' },
    emoji: '🌾',
  },
  protein: {
    label: { fr: 'Protéines', en: 'Proteins', mg: 'Proteinina', wo: 'Protein' },
    emoji: '🍗',
  },
  dairy: {
    label: { fr: 'Produits laitiers', en: 'Dairy', mg: 'Vokatra avy amin\'ny ronono', wo: 'Soow ak meen' },
    emoji: '🥛',
  },
  allergen: {
    label: { fr: 'Allergènes', en: 'Allergens', mg: 'Manaitra fanafody', wo: 'Feebar-tayre' },
    emoji: '⚠️',
  },
  fat: {
    label: { fr: 'Matières grasses', en: 'Fats', mg: 'Menaka', wo: 'Diwlin' },
    emoji: '🫒',
  },
  other: {
    label: { fr: 'Autres', en: 'Others', mg: 'Hafa', wo: 'Yeneen' },
    emoji: '🍯',
  },
};

export { categoryLabels };

export const foodGuide: FoodItem[] = [
  // === 4-6 months: First tastes ===
  // Vegetables
  {
    id: 'carotte',
    name: { fr: 'Carotte', en: 'Carrot', mg: 'Karaoty', wo: 'Karoot' },
    emoji: '🥕', category: 'vegetable', minMonths: 4, maxMonths: 24,
    texture: { fr: 'Purée très lisse', en: 'Very smooth puree', mg: 'Purée malama tanteraka', wo: 'Puree bu nooy lool' },
    tips: {
      fr: "Premier légume idéal : goût doux et sucré. Cuire à la vapeur et mixer finement.",
      en: 'Ideal first vegetable: mild and sweet taste. Steam-cook and blend finely.',
      mg: "Legioma voalohany tsara indrindra : mamy sy mora tsiroina. Andrahoy amin'ny setroka ary totoy tsara.",
      wo: 'Jaxatu bu njëkk bu gën: ñam bu neex te safa. Togg ko ci ngelaw te tannal ko bu baax.',
    },
    localContext: {
      africa: {
        fr: 'Disponible partout. Bien laver avant cuisson.',
        en: 'Available everywhere. Wash thoroughly before cooking.',
        mg: 'Misy eny rehetra eny. Sasao tsara alohan\'ny handrahoana.',
        wo: 'Nekk fu nekk. Raxasal ko bu baax balaa ngay togg.',
      },
      france: {
        fr: 'Bio de préférence pour les premiers mois.',
        en: 'Organic preferred for the first months.',
        mg: 'Tsara kokoa raha biolojika amin\'ireo volana voalohany.',
        wo: 'Bio moo gën ci weer yu njëkk yi.',
      },
    },
  },
  {
    id: 'courgette',
    name: { fr: 'Courgette', en: 'Zucchini', mg: 'Zucchini', wo: 'Kurset' },
    emoji: '🥒', category: 'vegetable', minMonths: 4, maxMonths: 24,
    texture: { fr: 'Purée très lisse', en: 'Very smooth puree', mg: 'Purée malama tanteraka', wo: 'Puree bu nooy lool' },
    tips: {
      fr: 'Très digeste et douce. Peler et épépiner pour les débuts.',
      en: 'Very easy to digest and mild. Peel and deseed at the start.',
      mg: 'Mora levona sy malefaka. Endaho sy esory ny voany amin\'ny voalohany.',
      wo: 'Dafay jur bu baax te safa. Fëttal te génne doomam ci tàmbalee.',
    },
    localContext: {
      france: {
        fr: "Légume d'été parfait pour commencer.",
        en: 'A perfect summer vegetable to start with.',
        mg: 'Legioma fahavaratra tsara tanteraka hanombohana.',
        wo: 'Jaxatu bu saison ete gën a baax ngir tàmbali.',
      },
    },
  },
  {
    id: 'patate-douce',
    name: { fr: 'Patate douce', en: 'Sweet potato', mg: 'Vomanga mamy', wo: 'Patat mi neex' },
    emoji: '🍠', category: 'vegetable', minMonths: 4, maxMonths: 24,
    texture: { fr: 'Purée lisse', en: 'Smooth puree', mg: 'Purée malama', wo: 'Puree bu nooy' },
    tips: {
      fr: 'Naturellement sucrée, très appréciée des bébés. Riche en vitamine A.',
      en: 'Naturally sweet, loved by babies. Rich in vitamin A.',
      mg: 'Mamy voajanahary, tian\'ny zaza. Manankarena vitamina A.',
      wo: 'Safa ci boppam, liir ñi dañu ko bëgg. Bari na vitamin A.',
    },
    localContext: {
      africa: {
        fr: 'Excellente source locale de vitamine A. Cuire à la vapeur ou bouillir.',
        en: 'Excellent local source of vitamin A. Steam or boil.',
        mg: 'Loharano tsara indrindra avy eny an-toerana ho an\'ny vitamina A. Andrahoy amin\'ny setroka na amin\'ny rano.',
        wo: 'Lu bari vitamin A ci nu nekk. Toggal ko ci ngelaw walla ci ndox.',
      },
      france: {
        fr: "Disponible toute l'année en magasin.",
        en: 'Available in stores all year round.',
        mg: 'Mivarotra mandritra ny taona iray manontolo.',
        wo: 'Nekk na ci butig yi at mépp.',
      },
    },
  },
  {
    id: 'potiron',
    name: { fr: 'Potiron / Courge', en: 'Pumpkin / Squash', mg: 'Voatavo', wo: 'Kiyaan' },
    emoji: '🎃', category: 'vegetable', minMonths: 4, maxMonths: 24,
    texture: { fr: 'Purée lisse', en: 'Smooth puree', mg: 'Purée malama', wo: 'Puree bu nooy' },
    tips: {
      fr: 'Goût doux et texture fondante. Parfait pour les premières purées.',
      en: 'Mild flavor and melt-in-the-mouth texture. Perfect for first purees.',
      mg: 'Tsiro malefaka sy mora mitsonika. Tsara tanteraka ho an\'ireo purée voalohany.',
      wo: 'Ñam bu neex te mu sedd ci gémmiñ. Baax na ngir purée yi njëkk.',
    },
    localContext: {
      africa: {
        fr: 'Courge locale très nutritive et économique.',
        en: 'Nutritious, affordable local squash.',
        mg: 'Voatavo eny an-toerana, misy otrikaina betsaka sady tsy lafo.',
        wo: 'Kiyaan bu nekk fi, bari solo te yomb.',
      },
    },
  },
  {
    id: 'haricots-verts',
    name: { fr: 'Haricots verts', en: 'Green beans', mg: 'Tsaramaso maintso', wo: 'Ñebbe bu wert' },
    emoji: '🫘', category: 'vegetable', minMonths: 4, maxMonths: 24,
    texture: {
      fr: 'Purée très lisse (sans fils)',
      en: 'Very smooth puree (no strings)',
      mg: 'Purée malama tanteraka (tsy misy taretra)',
      wo: 'Puree bu nooy lool (amul ay wiir)',
    },
    tips: {
      fr: 'Bien mixer pour enlever les fils. Associer à la pomme de terre pour adoucir.',
      en: 'Blend well to remove strings. Pair with potato to mellow the taste.',
      mg: 'Totoy tsara mba hanalana ny taretra. Akambano amin\'ny ovy mba ho malefaka.',
      wo: 'Tann ko bu baax ngir génne wiir yi. Boole ko ak pompiteer ngir mu neex.',
    },
  },
  {
    id: 'epinard',
    name: { fr: 'Épinards', en: 'Spinach', mg: 'Anamamy', wo: 'Mbuum' },
    emoji: '🥬', category: 'vegetable', minMonths: 6, maxMonths: 24,
    texture: {
      fr: 'Purée lisse, petites quantités',
      en: 'Smooth puree, small amounts',
      mg: 'Purée malama, kely kely',
      wo: 'Puree bu nooy, ci lu tuuti',
    },
    tips: {
      fr: "Riche en fer. Donner en petites quantités mélangé à d'autres légumes.",
      en: 'Rich in iron. Serve in small amounts mixed with other vegetables.',
      mg: 'Manankarena vy. Omeo kely kely akambana amin\'ny legioma hafa.',
      wo: 'Bari na weñ. Jox ko ci lu tuuti boole ko ak yeneen jaxatu.',
    },
    localContext: {
      africa: {
        fr: "Les feuilles de manioc ou moringa sont d'excellentes alternatives locales.",
        en: 'Cassava leaves or moringa are excellent local alternatives.',
        mg: 'Ny ravimbomanga na anamalaho dia safidy tsara eo an-toerana.',
        wo: 'Xob ñambi walla nebedaay ay nekkini yu baax fi.',
      },
    },
  },
  {
    id: 'igname',
    name: { fr: 'Igname', en: 'Yam', mg: 'Oviala', wo: 'Ñambi' },
    emoji: '🥔', category: 'vegetable', minMonths: 6, maxMonths: 24,
    texture: { fr: 'Purée lisse', en: 'Smooth puree', mg: 'Purée malama', wo: 'Puree bu nooy' },
    tips: {
      fr: 'Bonne source d\'énergie. Bien cuire et mixer.',
      en: 'Good source of energy. Cook thoroughly and blend.',
      mg: "Loharano tsaran'ny angovo. Andrahoy tsara ary totoy.",
      wo: 'Lu baax ngir doole. Toggal ko bu baax te tann ko.',
    },
    localContext: {
      africa: {
        fr: 'Aliment de base parfait pour la diversification.',
        en: 'Perfect staple food for food introduction.',
        mg: 'Sakafo fototra tsara ho an\'ny fanombohana sakafo hafa.',
        wo: 'Lekk bu njëkk bu gën ngir tàmbali lekk yu yees.',
      },
    },
  },
  {
    id: 'manioc',
    name: { fr: 'Manioc', en: 'Cassava', mg: 'Mangahazo', wo: 'Ñambi bu ndaw' },
    emoji: '🥔', category: 'vegetable', minMonths: 6, maxMonths: 24,
    texture: {
      fr: 'Purée lisse, bien cuit',
      en: 'Smooth puree, well-cooked',
      mg: 'Purée malama, masaka tsara',
      wo: 'Puree bu nooy, ñor bu baax',
    },
    tips: {
      fr: 'Toujours bien cuire le manioc (jamais cru). Source d\'énergie importante.',
      en: 'Always cook cassava thoroughly (never raw). Important source of energy.',
      mg: "Andrahoy tsara hatrany ny mangahazo (aza manta mihitsy). Loharanon'ny angovo lehibe.",
      wo: 'Dinga togg ñambi bu ndaw bu baax (bul ko lekk manta). Lu am solo lool ngir doole.',
    },
    localContext: {
      africa: {
        fr: "Aliment de base. S'assurer qu'il est bien cuit pour éliminer les composés toxiques.",
        en: 'Staple food. Make sure it is well cooked to eliminate toxic compounds.',
        mg: "Sakafo fototra. Ataovy azo antoka fa masaka tsara izy mba hanafoanana ireo singa misy poizina.",
        wo: 'Lekk bu njëkk. Wóoral ne ñor na bu baax ngir tas toxin yi.',
      },
    },
  },

  // Fruits
  {
    id: 'banane',
    name: { fr: 'Banane', en: 'Banana', mg: 'Akondro', wo: 'Banaana' },
    emoji: '🍌', category: 'fruit', minMonths: 4, maxMonths: 24,
    texture: {
      fr: 'Écrasée à la fourchette',
      en: 'Mashed with a fork',
      mg: "Torotoroina amin'ny forsety",
      wo: 'Jëkku ak furset',
    },
    tips: {
      fr: 'Fruit parfait pour commencer : pas besoin de cuisson. Choisir bien mûre.',
      en: 'Perfect fruit to start with: no cooking needed. Pick a ripe one.',
      mg: 'Voankazo tsara hanombohana : tsy mila handrahoana. Fidio ny masaka tsara.',
      wo: 'Meñ bu baax ngir tàmbali: soxlawul togg. Tannal ko bu ñor bu baax.',
    },
    localContext: {
      africa: {
        fr: 'Banane plantain cuite aussi possible dès 6 mois.',
        en: 'Cooked plantain also works from 6 months.',
        mg: 'Akondro masaka azo omena koa manomboka amin\'ny 6 volana.',
        wo: 'Banaana plantain bu togg it mën naa ko jox ba 6 weer.',
      },
      france: {
        fr: 'Bio de préférence.',
        en: 'Organic preferred.',
        mg: 'Tsara kokoa raha biolojika.',
        wo: 'Bio moo gën.',
      },
    },
  },
  {
    id: 'pomme',
    name: { fr: 'Pomme', en: 'Apple', mg: 'Paoma', wo: 'Pom' },
    emoji: '🍎', category: 'fruit', minMonths: 4, maxMonths: 24,
    texture: {
      fr: 'Compote lisse',
      en: 'Smooth stewed fruit',
      mg: 'Komopaoty malama',
      wo: 'Conpot bu nooy',
    },
    tips: {
      fr: 'Cuire en compote sans sucre ajouté. Tous les variétés conviennent.',
      en: 'Cook as stewed fruit with no added sugar. All varieties work.',
      mg: 'Andrahoy ho komopaoty tsy misy siramamy. Mety ny karazany rehetra.',
      wo: 'Togg ko ci conpot te bul teg suukar. Xeet yépp mën nañu.',
    },
  },
  {
    id: 'poire',
    name: { fr: 'Poire', en: 'Pear', mg: 'Poara', wo: 'Poor' },
    emoji: '🍐', category: 'fruit', minMonths: 4, maxMonths: 24,
    texture: {
      fr: 'Compote lisse',
      en: 'Smooth stewed fruit',
      mg: 'Komopaoty malama',
      wo: 'Conpot bu nooy',
    },
    tips: {
      fr: 'Très douce et digeste. Cuire légèrement et mixer.',
      en: 'Very mild and easy to digest. Cook briefly and blend.',
      mg: 'Malefaka sy mora levona. Andrahoy kely ary totoy.',
      wo: 'Dafa neex te yomb jur. Toggal ko tuuti te tann ko.',
    },
  },
  {
    id: 'mangue',
    name: { fr: 'Mangue', en: 'Mango', mg: 'Manga', wo: 'Mango' },
    emoji: '🥭', category: 'fruit', minMonths: 6, maxMonths: 24,
    texture: {
      fr: 'Purée lisse ou écrasée',
      en: 'Smooth puree or mashed',
      mg: 'Purée malama na torotoroina',
      wo: 'Puree bu nooy walla bu jëkku',
    },
    tips: {
      fr: 'Riche en vitamine A et C. Choisir bien mûre pour une saveur douce.',
      en: 'Rich in vitamins A and C. Choose a ripe one for a mild flavor.',
      mg: 'Manankarena vitamina A sy C. Fidio ny masaka mba ho mamy.',
      wo: 'Bari na vitamin A ak C. Tannal mu ñor ngir mu neex.',
    },
    localContext: {
      africa: {
        fr: 'Fruit local excellent, en saison.',
        en: 'Excellent local fruit when in season.',
        mg: 'Voankazo tsara avy eny an-toerana, mandritra ny vanim-potoanany.',
        wo: 'Meñ bu nekk fi bu baax lool, ci saison bi.',
      },
    },
  },
  {
    id: 'papaye',
    name: { fr: 'Papaye', en: 'Papaya', mg: 'Papay', wo: 'Papay' },
    emoji: '🍈', category: 'fruit', minMonths: 6, maxMonths: 24,
    texture: { fr: 'Purée lisse', en: 'Smooth puree', mg: 'Purée malama', wo: 'Puree bu nooy' },
    tips: {
      fr: 'Riche en vitamines. Bien mûre, elle fond en bouche.',
      en: 'Rich in vitamins. When ripe, it melts in the mouth.',
      mg: 'Manankarena vitamina. Mitsonika am-bava raha masaka tsara.',
      wo: 'Bari na vitamin. Bu ñor, dafay sedd ci gémmiñ.',
    },
    localContext: {
      africa: {
        fr: 'Facilement disponible et très nutritive.',
        en: 'Easily available and very nutritious.',
        mg: 'Mora hita ary misy otrikaina betsaka.',
        wo: 'Yomb na am te bari na solo.',
      },
    },
  },
  {
    id: 'avocat',
    name: { fr: 'Avocat', en: 'Avocado', mg: 'Avoka', wo: 'Awokaa' },
    emoji: '🥑', category: 'fruit', minMonths: 6, maxMonths: 24,
    texture: {
      fr: 'Écrasé à la fourchette',
      en: 'Mashed with a fork',
      mg: "Torotoroina amin'ny forsety",
      wo: 'Jëkku ak furset',
    },
    tips: {
      fr: 'Riche en bons gras essentiels au cerveau. Pas besoin de cuisson.',
      en: 'Rich in healthy fats essential for the brain. No cooking needed.',
      mg: "Manankarena menaka tsara ilaina ho an'ny atidoha. Tsy mila handrahoana.",
      wo: 'Bari na diwlin bu baax ngir xel mi. Soxlawul togg.',
    },
    localContext: {
      africa: {
        fr: 'Excellent aliment local, riche en énergie.',
        en: 'Excellent local food, rich in energy.',
        mg: 'Sakafo tsara eny an-toerana, manankarena angovo.',
        wo: 'Lekk bu nekk fi bu baax, bari na doole.',
      },
    },
  },

  // Cereals
  {
    id: 'riz',
    name: { fr: 'Riz / Crème de riz', en: 'Rice / Rice cream', mg: 'Vary / Lafarinina vary', wo: 'Ceeb / Farin ceeb' },
    emoji: '🍚', category: 'cereal', minMonths: 4, maxMonths: 24,
    texture: {
      fr: 'Bouillie très liquide puis épaisse',
      en: 'Very thin then thickened porridge',
      mg: 'Vary sosoa mandrano dia matevina',
      wo: 'Sow bu ndox lool ba ci bu jomb',
    },
    tips: {
      fr: 'Commencer par de la crème de riz très liquide. Épaissir progressivement.',
      en: 'Start with very liquid rice cream. Thicken gradually.',
      mg: "Atombohy amin'ny lafarinina vary be rano. Avia matevina tsikelikely.",
      wo: 'Tàmbalil ak farin ceeb bu ndox lool. Jombal ko ndànk-ndànk.',
    },
    localContext: {
      africa: {
        fr: 'Bouillie de riz : base de la diversification dans beaucoup de pays.',
        en: 'Rice porridge: the basis of food introduction in many countries.',
        mg: "Vary sosoa : fototry ny fanombohana sakafo any amin'ny firenena maro.",
        wo: 'Sow ceeb: baatu lekk yu yees ci réew yu bari.',
      },
      france: {
        fr: 'Céréales infantiles enrichies en fer recommandées.',
        en: 'Iron-fortified infant cereals recommended.',
        mg: "Atoro ny voamadinika zaza ampiana vy.",
        wo: 'Dugub yu liir yu ñu teg weñ dañu ko digal.',
      },
    },
  },
  {
    id: 'mil',
    name: { fr: 'Mil / Sorgho', en: 'Millet / Sorghum', mg: 'Ampemba / Sorgo', wo: 'Dugub / Suna' },
    emoji: '🌾', category: 'cereal', minMonths: 6, maxMonths: 24,
    texture: { fr: 'Bouillie', en: 'Porridge', mg: 'Sosoa', wo: 'Sow' },
    tips: {
      fr: 'Céréale locale très nutritive. Préparer en bouillie enrichie.',
      en: 'Highly nutritious local cereal. Prepare as enriched porridge.',
      mg: 'Voamadinika avy eny an-toerana misy otrikaina betsaka. Ataovy sosoa fenoina.',
      wo: 'Dugub bu nekk fi bu am solo lool. Togg ko ci sow bu ñu bari solo.',
    },
    localContext: {
      africa: {
        fr: "Base traditionnelle. Enrichir avec du lait maternel ou de l'arachide en poudre.",
        en: 'Traditional staple. Enrich with breast milk or peanut powder.',
        mg: "Fototra nentim-paharazana. Fenoy amin'ny ronono reny na voanjo vovonina.",
        wo: "Lekk bu cosaan bu njëkk. Suuxalal ko ak meenu ndey walla gerte bu ñu lakk.",
      },
    },
  },
  {
    id: 'mais',
    name: { fr: 'Maïs', en: 'Corn', mg: 'Katsaka', wo: 'Mboq' },
    emoji: '🌽', category: 'cereal', minMonths: 6, maxMonths: 24,
    texture: {
      fr: 'Bouillie fine',
      en: 'Fine porridge',
      mg: 'Sosoa madinika',
      wo: 'Sow bu tuuti',
    },
    tips: {
      fr: 'Farine de maïs en bouillie. Bien cuire pour une meilleure digestibilité.',
      en: 'Cornmeal porridge. Cook well for better digestibility.',
      mg: "Lafarinin-katsaka ataovy sosoa. Andrahoy tsara mba ho mora levona.",
      wo: 'Farinu mboq ci sow. Togg ko bu baax ngir mu yomb jur.',
    },
    localContext: {
      africa: {
        fr: 'Bouillie de maïs enrichie : ajouter arachide pilée, poisson séché en poudre.',
        en: 'Enriched corn porridge: add pounded peanuts or dried fish powder.',
        mg: "Sosoam-katsaka fenoina : ampio voanjo totoina, trondro nohamaina vovonina.",
        wo: "Sowu mboq bu suuxalu: yokk gerte yu ñu bóor, walla jën bu ñu wow bu ñu lakk.",
      },
    },
  },

  // Proteins
  {
    id: 'poulet',
    name: { fr: 'Poulet', en: 'Chicken', mg: 'Akoho', wo: 'Ganaar' },
    emoji: '🍗', category: 'protein', minMonths: 6, maxMonths: 24,
    texture: {
      fr: 'Mixé très fin puis haché',
      en: 'Very finely blended then chopped',
      mg: 'Totoina tsara dia voatetika',
      wo: 'Tann bu baax ba ci dagg',
    },
    tips: {
      fr: 'Première viande idéale : douce et facile à digérer. 10g/jour au début (2 cuillères à café).',
      en: 'Ideal first meat: mild and easy to digest. 10g/day at first (2 teaspoons).',
      mg: "Hena voalohany tsara indrindra : malefaka sy mora levona. 10g isan'andro eo am-piandohana (sotrokely 2).",
      wo: 'Yàpp bu njëkk bu gën: dafa safa te yomb jur. 10g ci bés bu nekk ci tàmbali (2 kuddu yu tuuti).',
    },
  },
  {
    id: 'poisson',
    name: { fr: 'Poisson', en: 'Fish', mg: 'Trondro', wo: 'Jën' },
    emoji: '🐟', category: 'protein', minMonths: 6, maxMonths: 24,
    texture: {
      fr: 'Mixé, sans arêtes',
      en: 'Blended, boneless',
      mg: 'Totoina, tsy misy taolana',
      wo: 'Tann, te amul yax',
    },
    tips: {
      fr: "Poissons blancs d'abord (colin, sole). Riche en oméga-3 pour le cerveau.",
      en: 'Start with white fish (hake, sole). Rich in omega-3 for the brain.',
      mg: "Aloha dia trondro fotsy (colin, sole). Manankarena oméga-3 ho an'ny atidoha.",
      wo: 'Njëkk jën yu weex (colin, sol). Bari na omega-3 ngir xel mi.',
    },
    localContext: {
      africa: {
        fr: 'Poisson séché en poudre : excellent ajout aux bouillies.',
        en: 'Dried fish powder: excellent addition to porridges.',
        mg: "Trondro maina vovonina : fameno tsara ho an'ny sosoa.",
        wo: 'Jën bu wow bu ñu lakk: yokkute yu baax ci sow yi.',
      },
      france: {
        fr: 'Éviter les poissons prédateurs (thon, espadon) : mercure.',
        en: 'Avoid predatory fish (tuna, swordfish): mercury.',
        mg: "Halaviro ny trondro mpihaza (thon, espadon) : misy mercure.",
        wo: 'Bàyyil jën yu mpihaza (thon, espadon): mercure.',
      },
    },
  },
  {
    id: 'oeuf',
    name: { fr: 'Œuf', en: 'Egg', mg: 'Atody', wo: 'Nen' },
    emoji: '🥚', category: 'protein', minMonths: 6, maxMonths: 24,
    texture: {
      fr: 'Bien cuit, écrasé',
      en: 'Well-cooked, mashed',
      mg: 'Masaka tsara, torotoroina',
      wo: 'Ñor bu baax, jëkku',
    },
    tips: {
      fr: 'Introduire œuf dur entier (blanc + jaune). Excellente source de protéines et fer.',
      en: 'Introduce whole hard-boiled egg (white + yolk). Excellent source of protein and iron.',
      mg: "Ampidiro manontolo ny atody mahamay (fotsy + mavo). Loharano tsaran'ny proteinina sy vy.",
      wo: 'Jëkk di jox nen bu ñor bu baax (bu weex ak bu mboq). Bari na protein ak weñ.',
    },
    isAllergen: true,
    allergenInfo: {
      fr: "L'œuf est un allergène majeur. Introduire dès 6 mois en petite quantité (1/4 d'œuf dur). Observer pendant 48h.",
      en: 'Egg is a major allergen. Introduce from 6 months in a small amount (1/4 hard-boiled egg). Watch for 48h.',
      mg: "Ny atody dia allergène lehibe. Ampidiro manomboka 6 volana amin'ny kely kely (1/4 atody mahamay). Zahao mandritra ny 48 ora.",
      wo: 'Nen dafa mën a dajale feebar-tayre. Jëkk ko di jox ba 6 weer ci lu tuuti (1/4 nen bu ñor). Xool ko 48 waxtu.',
    },
  },
  {
    id: 'legumineuses',
    name: { fr: 'Lentilles / Haricots', en: 'Lentils / Beans', mg: 'Voantsoroka / Tsaramaso', wo: 'Lantiy / Ñebbe' },
    emoji: '🫘', category: 'protein', minMonths: 8, maxMonths: 24,
    texture: { fr: 'Purée très lisse', en: 'Very smooth puree', mg: 'Purée malama tanteraka', wo: 'Puree bu nooy lool' },
    tips: {
      fr: 'Excellente source de protéines végétales et de fer. Bien cuire et mixer finement.',
      en: 'Excellent source of plant protein and iron. Cook well and blend finely.',
      mg: "Loharano tsaran'ny proteinina avy amin'ny zavamaniry sy ny vy. Andrahoy tsara ary totoy madinika.",
      wo: 'Bari na protein bu garab ak weñ. Toggal ko bu baax te tann ko bu baax.',
    },
    localContext: {
      africa: {
        fr: "Niébé (haricots à œil noir) : protéine locale abordable.",
        en: 'Niébé (black-eyed peas): affordable local protein.',
        mg: "Niébé (tsaramaso maso maintso) : proteinina eny an-toerana mora vidy.",
        wo: 'Ñebbe: protein bu nekk fi te yomb jënd.',
      },
      france: {
        fr: "Lentilles corail : cuisson rapide et goût doux.",
        en: 'Red lentils: quick to cook and mild flavor.',
        mg: "Voantsoroka mena : haingana ny fandrahoana, malefaka ny tsirony.",
        wo: 'Lantiy yu xonq: gaaw ñor te safa.',
      },
    },
  },

  // Dairy
  {
    id: 'yaourt',
    name: { fr: 'Yaourt nature', en: 'Plain yogurt', mg: 'Yoghourt tsotra', wo: 'Soow bu sell' },
    emoji: '🥛', category: 'dairy', minMonths: 6, maxMonths: 24,
    texture: {
      fr: 'Nature, non sucré',
      en: 'Plain, unsweetened',
      mg: 'Tsotra, tsy misy siramamy',
      wo: 'Sell, amul suukar',
    },
    tips: {
      fr: 'Yaourt nature entier uniquement. Pas de yaourts sucrés ou aromatisés.',
      en: 'Plain whole yogurt only. No sweetened or flavored yogurts.',
      mg: 'Yoghourt tsotra feno ihany. Aza mampiasa yoghourt misy siramamy na tsiro.',
      wo: 'Sow bu sell rekk. Bul jox soow yu suukar walla yu ñu teg ñam.',
    },
    localContext: {
      france: {
        fr: 'Yaourts au lait entier, nature. Pas de petit-suisse avant 9 mois.',
        en: 'Whole milk plain yogurts. No petit-suisse before 9 months.',
        mg: "Yoghourt amin'ny ronono feno, tsotra. Aza mampiasa petit-suisse alohan'ny 9 volana.",
        wo: 'Soow bu meenam baax, bu sell. Bul jox petit-suisse balaa 9 weer.',
      },
    },
  },
  {
    id: 'fromage',
    name: { fr: 'Fromage', en: 'Cheese', mg: 'Fromazy', wo: 'Formaas' },
    emoji: '🧀', category: 'dairy', minMonths: 8, maxMonths: 24,
    texture: {
      fr: 'Fondu ou râpé',
      en: 'Melted or grated',
      mg: 'Mitsonika na voakiky',
      wo: 'Bu seddi walla bu ñu gasaw',
    },
    tips: {
      fr: 'Commencer par des fromages doux (gruyère, emmental). Éviter les fromages au lait cru avant 5 ans.',
      en: 'Start with mild cheeses (gruyère, emmental). Avoid raw-milk cheeses before age 5.',
      mg: "Atombohy amin'ny fromazy malefaka (gruyère, emmental). Halaviro ny fromazy avy amin'ny ronono manta alohan'ny 5 taona.",
      wo: "Tàmbalil ak formaas yu safa (gruyère, emmental). Bàyyil formaas yu meen bu ñu togg bàyyiwul balaa 5 at.",
    },
    isAllergen: true,
    allergenInfo: {
      fr: 'Les protéines de lait de vache sont un allergène majeur. Le yaourt et fromage sont généralement mieux tolérés que le lait entier.',
      en: "Cow's milk proteins are a major allergen. Yogurt and cheese are usually better tolerated than whole milk.",
      mg: "Ny proteininan'ny ronono omby dia allergène lehibe. Ny yoghourt sy fromazy matetika mora iaretana kokoa noho ny ronono feno.",
      wo: 'Proteinu soow bu nag ay feebar-tayre bu rëy la. Soow ak formaas gën na a yomb ku ngi lekk ay meen bu matuwul.',
    },
  },

  // Allergens
  {
    id: 'arachide',
    name: { fr: 'Arachide', en: 'Peanut', mg: 'Voanjo', wo: 'Gerte' },
    emoji: '🥜', category: 'allergen', minMonths: 4, maxMonths: 24,
    texture: {
      fr: 'Poudre fine ou beurre lisse dilué',
      en: 'Fine powder or thin smooth butter',
      mg: 'Vovoka madinika na dibera malama ampitoetrina',
      wo: 'Poodar bu tuuti walla bëër bu nooy bu ñu séddale',
    },
    tips: {
      fr: "JAMAIS d'arachide entière ou en morceaux (risque d'étouffement). Utiliser de la poudre fine mélangée à une purée.",
      en: 'NEVER whole peanuts or pieces (choking hazard). Use fine powder mixed into a puree.',
      mg: "AZA omena mihitsy ny voanjo manontolo na tapatapaka (mety hahatototra). Ampiasao vovoka madinika akambana amin'ny purée.",
      wo: 'BUL jox gerte yu mat walla yu ñu xaaj (mën nañu noo). Jëfandikool poodar bu tuuti ak puree.',
    },
    isAllergen: true,
    allergenInfo: {
      fr: "Introduction précoce recommandée (dès 4-6 mois) pour RÉDUIRE le risque d'allergie. Commencer par 1/2 cuillère à café de poudre dans une purée. Observer 48h.",
      en: 'Early introduction recommended (from 4-6 months) to REDUCE allergy risk. Start with 1/2 teaspoon of powder in a puree. Watch for 48h.',
      mg: "Atoro ny hampidirana aloha (manomboka amin'ny 4-6 volana) mba HAMPIHENANA ny risika allergie. Atombohy amin'ny sotrokely 1/2 vovoka ao anatin'ny purée. Zahao 48 ora.",
      wo: 'Jëkk di ko jox (ba 4-6 weer) dafay WÀÑÑI feebar-tayre bi. Tàmbali ak 1/2 kuddu bu tuuti ci puree. Xool ko 48 waxtu.',
    },
    localContext: {
      africa: {
        fr: "Pâte d'arachide diluée dans la bouillie : pratique traditionnelle bénéfique !",
        en: 'Peanut paste diluted in porridge: beneficial traditional practice!',
        mg: "Kotofon-Voanjo ampitoetrina ao anaty sosoa : fomba nentim-paharazana mahasoa !",
        wo: 'Gerte bu ñu lakk ci sow: aada bu cosaan bu baax!',
      },
      france: {
        fr: 'Beurre de cacahuète lisse, en petite quantité dans une compote.',
        en: 'Smooth peanut butter in small amounts in stewed fruit.',
        mg: "Dibera voanjo malama, kely kely ao anatin'ny komopaoty.",
        wo: 'Bëër gerte bu nooy, ci lu tuuti ci conpot.',
      },
    },
  },
  {
    id: 'gluten',
    name: {
      fr: 'Gluten (blé, semoule)',
      en: 'Gluten (wheat, semolina)',
      mg: 'Gluten (varimbazaha, semoule)',
      wo: 'Gluten (blé, semul)',
    },
    emoji: '🍞', category: 'allergen', minMonths: 4, maxMonths: 24,
    texture: {
      fr: 'Semoule fine, pain trempé',
      en: 'Fine semolina, soaked bread',
      mg: 'Semoule madinika, mofo lena',
      wo: 'Semul bu tuuti, mburu bu ñu cumbat',
    },
    tips: {
      fr: 'Introduire progressivement : semoule fine dans les purées, puis croûton de pain à sucer.',
      en: 'Introduce gradually: fine semolina in purees, then a bread crust to gum on.',
      mg: "Ampidiro tsikelikely : semoule madinika ao anatin'ny purée, dia potikely mofo tsentsefina.",
      wo: 'Jëkk ko ndànk-ndànk: semul bu tuuti ci puree, ba ci tuuti mburu bu ñu nooñ.',
    },
    isAllergen: true,
    allergenInfo: {
      fr: 'Pas besoin d\'attendre. Introduction dès 4-6 mois en petites quantités pour réduire le risque de maladie cœliaque.',
      en: 'No need to wait. Introduce from 4-6 months in small amounts to reduce the risk of celiac disease.',
      mg: "Tsy mila miandry. Ampidiro manomboka amin'ny 4-6 volana amin'ny kely kely mba hampihena ny risika aretina cœliaque.",
      wo: 'Soxlawul xaar. Jëkk ko ba 4-6 weer ci lu tuuti ngir wàññi feebaru celiaque.',
    },
    localContext: {
      africa: {
        fr: 'Bouillie de blé ou semoule de couscous fine.',
        en: 'Wheat porridge or fine couscous semolina.',
        mg: "Sosoa varimbazaha na semoule couscous madinika.",
        wo: 'Sowu ble walla semul kuskus bu tuuti.',
      },
      france: {
        fr: 'Pain, pâtes, semoule : introduire progressivement.',
        en: 'Bread, pasta, semolina: introduce gradually.',
        mg: 'Mofo, paty, semoule : ampidiro tsikelikely.',
        wo: 'Mburu, makarooni, semul: jëkk ko ndànk-ndànk.',
      },
    },
  },
  {
    id: 'lait-vache',
    name: {
      fr: 'Lait de vache',
      en: "Cow's milk",
      mg: 'Ronono omby',
      wo: 'Meenu nag',
    },
    emoji: '🥛', category: 'allergen', minMonths: 12, maxMonths: 24,
    texture: {
      fr: 'Liquide, en gobelet',
      en: 'Liquid, in a cup',
      mg: 'Rano, amin\'ny kaopy',
      wo: 'Ndox, ci goblet',
    },
    tips: {
      fr: "Pas de lait de vache comme boisson principale avant 12 mois. Avant 12 mois : lait maternel ou préparation infantile.",
      en: "No cow's milk as the main drink before 12 months. Before 12 months: breast milk or infant formula.",
      mg: "Aza atao zava-pisotro fototra ny ronono omby alohan'ny 12 volana. Alohan'ny 12 volana : ronono reny na ronono zaza.",
      wo: 'Bul jox meenu nag ni naanu bu rëy balaa 12 weer. Balaa 12 weer: meenu ndey walla meen biberon.',
    },
    isAllergen: true,
    allergenInfo: {
      fr: 'Le lait de vache entier peut être la boisson principale après 12 mois. En petite quantité dans les préparations dès 6 mois (béchamel, etc.).',
      en: 'Whole cow\'s milk can be the main drink after 12 months. In small amounts in recipes from 6 months (béchamel, etc.).',
      mg: "Ny ronono omby feno azo atao zava-pisotro fototra aorian'ny 12 volana. Kely kely ao anatin'ny fikarakarana sakafo manomboka amin'ny 6 volana (béchamel, sns).",
      wo: 'Meenu nag bu mat mën na nekk naanu bu rëy bi ba noppi 12 weer. Ci lu tuuti ci lekk yi ba 6 weer (béchamel, ak yu nekk).',
    },
  },

  // Fats
  {
    id: 'huile-olive',
    name: { fr: "Huile d'olive", en: 'Olive oil', mg: 'Menaka oliva', wo: 'Diwlin oliiv' },
    emoji: '🫒', category: 'fat', minMonths: 6, maxMonths: 24,
    texture: {
      fr: '1 cuillère à café dans les purées',
      en: '1 teaspoon in purees',
      mg: '1 sotrokely ao anatin\'ny purée',
      wo: '1 kuddu bu tuuti ci puree yi',
    },
    tips: {
      fr: "Ajouter systématiquement une matière grasse dans les purées. L'huile d'olive est la plus adaptée.",
      en: 'Always add a fat to purees. Olive oil is the most suitable.',
      mg: "Ampio menaka foana ao anatin'ny purée. Ny menaka oliva no mety indrindra.",
      wo: 'Yokk diwlin saa yu ngay def puree. Diwlin oliiv moo gën a baax.',
    },
    localContext: {
      africa: {
        fr: "L'huile d'arachide ou de palme rouge (riche en vitamine A) sont aussi très bien.",
        en: 'Peanut oil or red palm oil (rich in vitamin A) also work well.',
        mg: "Ny menaka voanjo na menaka palmie mena (manankarena vitamina A) koa dia tena tsara.",
        wo: 'Diwlin gerte walla diwlin palme bu xonq (bari vitamin A) ay yu baax it.',
      },
      france: {
        fr: "Alterner huile d'olive, colza (oméga-3), et beurre.",
        en: 'Alternate olive oil, rapeseed (omega-3), and butter.',
        mg: 'Ovaovay ny menaka oliva, colza (oméga-3) ary dibera.',
        wo: 'Sippal diwlin oliiv, colza (omega-3), ak bëër.',
      },
    },
  },
  {
    id: 'beurre',
    name: { fr: 'Beurre', en: 'Butter', mg: 'Dibera', wo: 'Bëër' },
    emoji: '🧈', category: 'fat', minMonths: 6, maxMonths: 24,
    texture: {
      fr: 'Noisette de beurre dans les purées',
      en: 'A knob of butter in purees',
      mg: 'Sombindibera ao anatin\'ny purée',
      wo: 'Ci tuuti bëër ci puree yi',
    },
    tips: {
      fr: 'Une noisette de beurre dans les légumes : goût et apport en vitamine A.',
      en: 'A knob of butter in vegetables: flavor and vitamin A intake.',
      mg: "Sombindibera ao anatin'ny legioma : tsiro sady vitamina A.",
      wo: 'Ci tuuti bëër ci jaxatu yi: safaay ak vitamin A.',
    },
  },

  // Others
  {
    id: 'eau',
    name: { fr: 'Eau', en: 'Water', mg: 'Rano', wo: 'Ndox' },
    emoji: '💧', category: 'other', minMonths: 6, maxMonths: 24,
    texture: {
      fr: 'Au gobelet, petites gorgées',
      en: 'From a cup, small sips',
      mg: 'Amin\'ny kaopy, sombintsombiny kely',
      wo: 'Ci goblet, ci tuuti-tuuti',
    },
    tips: {
      fr: "Proposer de l'eau plate entre les repas dès le début des solides. Pas de jus de fruits.",
      en: 'Offer still water between meals from the start of solids. No fruit juices.',
      mg: "Omeo rano tsotra eo anelanelan'ny sakafo manomboka amin'ny fanombohana ny sakafo matevina. Aza omena ronon'ny voankazo.",
      wo: 'Jox ndox mu sell ci diggante lekk yi bu ngay tàmbali lekk yu ñor. Bul jox jus meñ.',
    },
    localContext: {
      africa: {
        fr: 'Eau filtrée ou bouillie puis refroidie.',
        en: 'Filtered water or boiled then cooled.',
        mg: 'Rano filtraina na masaka avy eo tonga nangatsiaka.',
        wo: 'Ndox mu ñu sell walla mu baxx ba noppi sedd.',
      },
      france: {
        fr: 'Eau du robinet ou eau en bouteille peu minéralisée.',
        en: 'Tap water or low-mineral bottled water.',
        mg: 'Rano paompy na rano amin\'ny tavoahangy misy minerals vitsy.',
        wo: 'Ndoxu robine walla ndox ci buteey bu amul bari mineral.',
      },
    },
  },
];

export interface FoodAgeGroup {
  label: LocalizedField;
  minMonths: number;
  maxMonths: number;
  description: LocalizedField;
  emoji: string;
}

export const foodAgeGroups: FoodAgeGroup[] = [
  {
    label: { fr: '4-6 mois', en: '4-6 months', mg: '4-6 volana', wo: '4-6 weer' },
    minMonths: 4, maxMonths: 6,
    description: {
      fr: 'Premières découvertes gustatives',
      en: 'First taste discoveries',
      mg: 'Fahitana tsiro voalohany',
      wo: 'Njëkk ngir saytu ñam',
    },
    emoji: '🍼',
  },
  {
    label: { fr: '6-9 mois', en: '6-9 months', mg: '6-9 volana', wo: '6-9 weer' },
    minMonths: 6, maxMonths: 9,
    description: {
      fr: 'Textures et nouveaux goûts',
      en: 'Textures and new tastes',
      mg: 'Endrika sy tsiro vaovao',
      wo: 'Xeex ak ñam yu yees',
    },
    emoji: '🥣',
  },
  {
    label: { fr: '9-12 mois', en: '9-12 months', mg: '9-12 volana', wo: '9-12 weer' },
    minMonths: 9, maxMonths: 12,
    description: {
      fr: 'Morceaux fondants et autonomie',
      en: 'Soft pieces and autonomy',
      mg: 'Potikely malefaka sy fahaleovantena',
      wo: 'Ay xaajam yu nooy ak bopp-bopp',
    },
    emoji: '🍽️',
  },
  {
    label: { fr: '12-24 mois', en: '12-24 months', mg: '12-24 volana', wo: '12-24 weer' },
    minMonths: 12, maxMonths: 24,
    description: {
      fr: 'Repas variés en famille',
      en: 'Varied meals with the family',
      mg: "Sakafo isan-karazany miaraka amin'ny fianakaviana",
      wo: 'Ay lekk yu wuuteel ak njaboot gi',
    },
    emoji: '👨‍👩‍👧',
  },
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
