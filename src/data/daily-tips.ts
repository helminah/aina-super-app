import type { LocalizedField } from '@/lib/i18n-data';

export interface DailyTip {
  id: number;
  category: 'nutrition' | 'sleep' | 'development' | 'health' | 'wellbeing';
  categoryEmoji: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  title: LocalizedField;
  content: LocalizedField;
}

export const dailyTips: DailyTip[] = [
  {
    id: 1, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 0, ageMaxMonths: 3,
    title: {
      fr: "L'allaitement exclusif",
      en: 'Exclusive breastfeeding',
      mg: 'Ny fampinonoana hatrany',
      wo: 'Nampal ndox-meen rekk',
    },
    content: {
      fr: "Jusqu'à 6 mois, le lait maternel (ou le lait infantile) couvre 100% des besoins de bébé. Pas besoin d'eau ni de complément.",
      en: 'Until 6 months, breast milk (or infant formula) covers 100% of baby\'s needs. No need for water or supplements.',
      mg: "Mandra-pahafeno 6 volana, ny ronono reny (na ronono zaza) dia mahaleo tena amin'ny filan'ny zaza. Tsy mila rano na fameno.",
      wo: 'Ba 6 weer, meen (walla meen biberon) mooy faj sukkandiku bëbe bépp. Ndox walla yeneen du soxla.',
    },
  },
  {
    id: 2, category: 'sleep', categoryEmoji: '🌙', ageMinMonths: 0, ageMaxMonths: 3,
    title: {
      fr: 'Le sommeil du nouveau-né',
      en: 'Newborn sleep',
      mg: 'Ny torimason\'ny zaza vao teraka',
      wo: 'Nelawu liir bu juddu',
    },
    content: {
      fr: "Un nouveau-né dort 16 à 18h par jour. Couchez-le toujours sur le dos, dans un lit sans oreiller ni couverture épaisse.",
      en: 'A newborn sleeps 16 to 18 hours a day. Always place them on their back, in a crib with no pillow or thick blanket.',
      mg: "Matory 16 ka hatramin'ny 18 ora isan'andro ny zaza vao teraka. Ampandrio miantsilany foana izy, ao amin'ny fandriana tsy misy ondana na bodofotsy matevina.",
      wo: 'Liir bu juddu dafay nelaw 16 ba 18 waxtu ci bés bu nekk. Tëdal ko ci ay ginaaw, ci lal bu amul gaal walla mbubb bu rëy.',
    },
  },
  {
    id: 3, category: 'development', categoryEmoji: '🧒', ageMinMonths: 0, ageMaxMonths: 3,
    title: {
      fr: 'Le peau à peau',
      en: 'Skin-to-skin contact',
      mg: 'Hoditra amin\'ny hoditra',
      wo: 'Der ci der',
    },
    content: {
      fr: "Le contact peau à peau régule la température, favorise l'allaitement et renforce le lien parent-enfant. N'hésitez pas !",
      en: "Skin-to-skin contact regulates temperature, supports breastfeeding, and strengthens the parent-child bond. Don't hesitate!",
      mg: "Ny fifampikasohan'ny hoditra amin'ny hoditra dia mandamina ny hafanana, manampy amin'ny fampinonoana ary manamafy ny fifandraisan'ny ray aman-dreny amin'ny zaza. Aza misalasala!",
      wo: "Der ci der dayko tangal yaram bi, sàmm nampal ndox-meen ak dëgëral mbokk bi ci diggante waajur ak doom. Bul jàq!",
    },
  },
  {
    id: 4, category: 'health', categoryEmoji: '💊', ageMinMonths: 0, ageMaxMonths: 6,
    title: {
      fr: 'La vitamine D',
      en: 'Vitamin D',
      mg: 'Vitamina D',
      wo: 'Vitamin D',
    },
    content: {
      fr: "En complément de l'alimentation, la vitamine D est recommandée dès la naissance pour prévenir le rachitisme.",
      en: 'In addition to food, vitamin D is recommended from birth to prevent rickets.',
      mg: "Ho fameno ny sakafo, atoro ny hampidirana vitamina D hatramin'ny fahaterahana mba hisorohana ny rachitisme.",
      wo: 'Ak lekk yi, vitamin D dañu ko digal ba lu juddu ngir moytu feebar yu bone ci yax.',
    },
  },
  {
    id: 5, category: 'wellbeing', categoryEmoji: '💛', ageMinMonths: 0, ageMaxMonths: 24,
    title: {
      fr: 'Prenez soin de vous',
      en: 'Take care of yourself',
      mg: 'Karakarao ny tenanao',
      wo: 'Topptoo sa bopp',
    },
    content: {
      fr: "Être parent est un marathon, pas un sprint. N'oubliez pas de prendre du temps pour vous. Votre bien-être compte aussi.",
      en: "Being a parent is a marathon, not a sprint. Don't forget to make time for yourself. Your well-being matters too.",
      mg: "Ny maha ray aman-dreny dia hazakazaka lavitra, fa tsy hazakazaka fohy. Aza adino ny manokana fotoana ho an'ny tenanao. Ny fahasalaman'ny sainao ihany koa dia zava-dehibe.",
      wo: 'Nekk waajur mooy daw yu gudd, du daw yu gaaw. Bul fàtte jël waxtu ci sa bopp. Sa wér-gu-yaram it am na solo.',
    },
  },
  {
    id: 6, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 4, ageMaxMonths: 6,
    title: {
      fr: 'Bientôt la diversification',
      en: 'Ready to introduce solids soon',
      mg: 'Efa akaiky ny fanombohana sakafo hafa',
      wo: 'Bëg na jëkk lekk yu yees',
    },
    content: {
      fr: "Entre 4 et 6 mois, bébé montre des signes qu'il est prêt : il tient sa tête, s'intéresse à votre assiette, ne repousse plus la cuillère.",
      en: 'Between 4 and 6 months, baby shows signs of readiness: holds their head steady, shows interest in your plate, no longer pushes the spoon away.',
      mg: "Eo anelanelan'ny 4 sy 6 volana, maneho famantarana ny zaza fa efa vonona izy: mahatazona ny lohany, liana amin'ny vilianao, tsy manosika ny sotro intsony.",
      wo: 'Diggante 4 ak 6 weer, liir dafay wone firnde ni mu pare na: mu teg bopp am, mu bëgg sa ndap, te du daq kuddu bi.',
    },
  },
  {
    id: 7, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 6, ageMaxMonths: 8,
    title: {
      fr: 'Premiers aliments',
      en: 'First foods',
      mg: 'Ireo sakafo voalohany',
      wo: 'Lekk yu njëkk',
    },
    content: {
      fr: 'Commencez par les légumes (1 par jour, 3 jours de suite) puis les fruits. Texture lisse et homogène, sans sel ni sucre ajouté.',
      en: 'Start with vegetables (one per day, three days in a row), then fruits. Smooth, homogeneous texture, with no added salt or sugar.',
      mg: "Atombohy amin'ny legioma (iray isan'andro, telo andro misesy) dia ny voankazo. Malama sy mitovy ny endriny, tsy asiana sira na siramamy.",
      wo: 'Tàmbali ak jaxatu (benn ci bés bu nekk, ñetti bés yu topp) te jox meñ yi. Na nooy te yekk, bul teg xorom walla suukar.',
    },
  },
  {
    id: 8, category: 'sleep', categoryEmoji: '🌙', ageMinMonths: 4, ageMaxMonths: 8,
    title: {
      fr: 'Rituel du coucher',
      en: 'Bedtime routine',
      mg: 'Fombafomba alohan\'ny fatoriana',
      wo: 'Aada bu tëdd',
    },
    content: {
      fr: 'Instaurez une routine douce : bain, massage, histoire, chanson. La régularité rassure et prépare au sommeil.',
      en: 'Set up a gentle routine: bath, massage, story, song. Consistency reassures and prepares for sleep.',
      mg: "Mametraha fomba malefaka: fandroana, fikosoham-batana, tantara, hira. Ny fahazarana mampiadana sy manomana ho amin'ny torimaso.",
      wo: 'Defal aada bu nooy: sànggu, tàggu, léeb, woy. Aada bi dafay dalal xel te waajal nelaw.',
    },
  },
  {
    id: 9, category: 'development', categoryEmoji: '🧒', ageMinMonths: 4, ageMaxMonths: 6,
    title: {
      fr: 'Le temps sur le ventre',
      en: 'Tummy time',
      mg: "Fotoana mandry amin'ny kibo",
      wo: 'Jamono ci bir',
    },
    content: {
      fr: "Quelques minutes sur le ventre chaque jour renforcent les muscles du cou et du dos. Restez toujours à côté de bébé.",
      en: 'A few minutes on the tummy each day strengthens neck and back muscles. Always stay beside baby.',
      mg: "Minitra vitsivitsy mandry amin'ny kibo isan'andro dia manamafy ny hozatry ny tendany sy ny lamosina. Mijanòna foana eo akaikin'ny zaza.",
      wo: 'Ay simili ci bir ci bés bu nekk dëgëralal fit yi ci baat ak ginaaw. Toogal ba fa liir nekk.',
    },
  },
  {
    id: 10, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 6, ageMaxMonths: 12,
    title: {
      fr: "L'importance du fer",
      en: 'The importance of iron',
      mg: "Ny maha-zava-dehibe ny vy",
      wo: 'Solo bu weñ bi',
    },
    content: {
      fr: "Dès 6 mois, les réserves en fer baissent. Introduisez viande, poisson et légumineuses régulièrement.",
      en: 'From 6 months, iron stores drop. Introduce meat, fish and legumes regularly.',
      mg: "Manomboka amin'ny 6 volana, mihena ny tahiry vy. Ampidiro tsy tapaka ny hena, trondro sy voamaina.",
      wo: 'Ba 6 weer, weñ wi dafay wàññiku. Dugalal yàpp, jën ak ñebbe ci lekk yi bés bu nekk.',
    },
  },
  {
    id: 11, category: 'health', categoryEmoji: '💊', ageMinMonths: 0, ageMaxMonths: 24,
    title: {
      fr: 'Calendrier vaccinal',
      en: 'Vaccination schedule',
      mg: 'Fandaharam-potoana vaksiny',
      wo: 'Jadwal bu waccin',
    },
    content: {
      fr: "Respectez le calendrier vaccinal de votre pays. Les vaccins protègent votre bébé de maladies graves et potentiellement mortelles.",
      en: "Follow your country's vaccination schedule. Vaccines protect your baby from serious and potentially fatal diseases.",
      mg: "Hajao ny fandaharam-potoana vaksiny ao amin'ny firenenao. Ny vaksiny dia miaro ny zazanao amin'ireo aretina mahery vaika mety hahafaty.",
      wo: 'Topp jadwal bu waccin ci sa réew. Waccin yi dañuy aar sa liir ci feebar yu bari yu mëna rey.',
    },
  },
  {
    id: 12, category: 'development', categoryEmoji: '🧒', ageMinMonths: 7, ageMaxMonths: 12,
    title: {
      fr: 'Les premiers mots',
      en: 'First words',
      mg: 'Ireo teny voalohany',
      wo: 'Baat yi njëkk',
    },
    content: {
      fr: "Parlez souvent à bébé, nommez les objets, lisez des histoires. Le langage se construit bien avant les premiers mots !",
      en: 'Talk often to baby, name objects, read stories. Language builds long before the first words!',
      mg: "Miresaha matetika amin'ny zaza, tononoy ny anaran'ny zavatra, vakio ireo tantara. Miorina hatramin'ny ela ny fiteny alohan'ny teny voalohany!",
      wo: 'Wax ak liir bi, tudd ko turu yëf yi, jàng ko ay léeb. Làkk bi dafay tàmbali di sax bu yàgg balaa baat yi njëkk!',
    },
  },
  {
    id: 13, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 8, ageMaxMonths: 12,
    title: {
      fr: 'Textures évolutives',
      en: 'Progressive textures',
      mg: 'Endrika mivoatra',
      wo: 'Xeex yu yokku',
    },
    content: {
      fr: "Passez progressivement des purées lisses aux textures moulinées puis écrasées. Bébé apprend à mâcher même sans dents !",
      en: 'Gradually move from smooth purees to minced and then mashed textures. Baby learns to chew even without teeth!',
      mg: "Miovà tsikelikely avy amin'ny purée malama mankany amin'ireo torotoroina ary avy eo potehina. Mianatra mitsakotsako na tsy manana nify aza ny zaza!",
      wo: 'Jëfandikool puree yu nooy, teg xeex yu jaxas ak yu jëkku. Liir bi dafay jàng mànj doonte amul bëñ!',
    },
  },
  {
    id: 14, category: 'wellbeing', categoryEmoji: '💛', ageMinMonths: 0, ageMaxMonths: 24,
    title: {
      fr: 'Le portage',
      en: 'Babywearing',
      mg: 'Fitondrana zaza',
      wo: 'Gaañu liir',
    },
    content: {
      fr: "Porter bébé en écharpe ou porte-bébé libère vos mains tout en assurant proximité et réconfort.",
      en: 'Carrying baby in a sling or carrier frees your hands while keeping them close and comforted.',
      mg: "Ny fitondrana ny zaza amin'ny lamba na fitondrana zaza dia manafaka ny tananao sady miantoka ny fifanakaikezana sy ny fampiononana.",
      wo: "Gaañu liir ak lamba walla carrier dafay may la yoxoy, te liir bi nekk ci yaw ak xel mu dal.",
    },
  },
  {
    id: 15, category: 'health', categoryEmoji: '💊', ageMinMonths: 0, ageMaxMonths: 24,
    title: {
      fr: 'Température de bébé',
      en: "Baby's temperature",
      mg: 'Hafanan\'ny zaza',
      wo: 'Tàngayu liir',
    },
    content: {
      fr: "La température normale est 36.5-37.5°C. Au-dessus de 38°C, c'est de la fièvre. Consultez si bébé a moins de 3 mois.",
      en: 'Normal temperature is 36.5-37.5°C. Above 38°C is a fever. See a doctor if baby is under 3 months old.',
      mg: "Ny hafanana ara-dalàna dia eo anelanelan'ny 36.5 sy 37.5°C. Raha mihoatra ny 38°C, dia tazo izany. Midira any amin'ny dokotera raha latsaky ny 3 volana ny zaza.",
      wo: 'Tàngay bu normal mooy 36.5-37.5°C. Bu weesuwee 38°C, tàngay bu metti la. Demal doctoor su liir amul 3 weer.',
    },
  },
  {
    id: 16, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 6, ageMaxMonths: 12,
    title: {
      fr: 'Huile dans les purées',
      en: 'Oil in purees',
      mg: "Menaka ao anatin'ny purée",
      wo: 'Diwlin ci puree yi',
    },
    content: {
      fr: "Ajoutez 1 cuillère à café d'huile (colza, olive) dans chaque purée. Les lipides sont essentiels au développement du cerveau.",
      en: 'Add 1 teaspoon of oil (rapeseed, olive) to each puree. Fats are essential for brain development.',
      mg: "Ampio 1 sotrokely menaka (colza, oliva) isaky ny purée. Tena ilaina amin'ny fivoaran'ny atidoha ny menaka.",
      wo: "Yokkal 1 kuddu tuuti diwlin (colza, oliiv) ci puree bu nekk. Diwlin yi am na solo ngir yokkute bu xel mi.",
    },
  },
  {
    id: 17, category: 'sleep', categoryEmoji: '🌙', ageMinMonths: 6, ageMaxMonths: 12,
    title: {
      fr: 'Régressions de sommeil',
      en: 'Sleep regressions',
      mg: 'Fiatoan\'ny torimaso',
      wo: 'Dellu-ginaaw ci nelaw',
    },
    content: {
      fr: "Vers 8-10 mois, bébé peut se réveiller plus souvent. C'est lié à l'angoisse de séparation. Rassurez-le, ça passera.",
      en: 'Around 8-10 months, baby may wake more often. This is linked to separation anxiety. Reassure them, it will pass.',
      mg: "Manodidina ny 8-10 volana, mety hifoha matetika kokoa ny zaza. Mifandray amin'ny tahotry ny fisarahana izany. Ampitoniano izy, handalo izany.",
      wo: 'Ci 8-10 weer, liir bi mën na yëngu bu bari. Dafa jëm ci ragal bu tàggoo. Dalal ko xel, dina jàll.',
    },
  },
  {
    id: 18, category: 'development', categoryEmoji: '🧒', ageMinMonths: 10, ageMaxMonths: 18,
    title: {
      fr: 'Les premiers pas',
      en: 'First steps',
      mg: 'Ireo dingana voalohany',
      wo: 'Tànk yi njëkk',
    },
    content: {
      fr: "Chaque enfant marche à son rythme (10-18 mois). Pieds nus à la maison pour un bon développement. Pas de trotteur !",
      en: 'Every child walks at their own pace (10-18 months). Barefoot at home for healthy development. No baby walker!',
      mg: "Samy manana ny haingam-pandehany ny zaza tsirairay (10-18 volana). Tongotra tsy misy kiraro ao an-trano ho an'ny fivoarana tsara. Aza mampiasa trotteur!",
      wo: 'Xale bu nekk day dox ak sa tempo (10-18 weer). Tànk yu der ci kër ngir yokkute bu baax. Bul jëfandikoo trotteur!',
    },
  },
  {
    id: 19, category: 'nutrition', categoryEmoji: '🥕', ageMinMonths: 12, ageMaxMonths: 24,
    title: {
      fr: 'Manger comme les grands',
      en: 'Eating like the grown-ups',
      mg: 'Mihinana toy ny lehibe',
      wo: 'Lekk ni mag ñi',
    },
    content: {
      fr: "Dès 12 mois, bébé peut manger de tout (sauf miel cru avant 1 an). Adaptez la taille des morceaux, pas les goûts !",
      en: 'From 12 months, baby can eat almost everything (except raw honey before 1 year). Adjust the size of the pieces, not the flavors!',
      mg: "Manomboka amin'ny 12 volana, afaka mihinana ny zavatra rehetra ny zaza (afa-tsy tantely manta alohan'ny 1 taona). Amboary ny halehiben'ny sombiny, fa aza ny tsiro!",
      wo: 'Ba 12 weer, liir mën na lekk lu nekk (moo xam ne lem bu ñàkk tóog lu làqq benn at). Soppi ba tuuti ci lu xóot, waaye sopp-sàppi du yaatal!',
    },
  },
  {
    id: 20, category: 'health', categoryEmoji: '💊', ageMinMonths: 0, ageMaxMonths: 24,
    title: {
      fr: "L'hydratation",
      en: 'Hydration',
      mg: 'Famenoana rano',
      wo: 'Naanu ndox',
    },
    content: {
      fr: "Dès la diversification, proposez de l'eau à chaque repas. Évitez jus de fruits et sodas. L'eau est la seule boisson indispensable.",
      en: 'From the start of solids, offer water at every meal. Avoid fruit juices and sodas. Water is the only essential drink.',
      mg: "Manomboka amin'ny fanombohana sakafo hafa, omeo rano isaky ny sakafo. Halaviro ny ronon'ny voankazo sy soda. Ny rano no hany zava-pisotro tena ilaina.",
      wo: 'Bu ngay tàmbali lekk yu yees, jox ndox ci lekk bu nekk. Bàyyil jus meñ ak soda. Ndox mi doŋŋ moo soxal.',
    },
  },
];

export function getTipOfTheDay(ageMonths: number): DailyTip {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const applicable = dailyTips.filter(t => ageMonths >= t.ageMinMonths && ageMonths <= t.ageMaxMonths);
  if (applicable.length === 0) return dailyTips[0];
  return applicable[dayOfYear % applicable.length];
}
