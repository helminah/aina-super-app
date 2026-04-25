import type { LocalizedField } from '@/lib/i18n-data';

export interface Milestone {
  id: string;
  ageRange: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  domain: 'motor' | 'fine' | 'language' | 'social';
  domainLabel: LocalizedField;
  domainEmoji: string;
  description: LocalizedField;
}

// Labels de domaines réutilisés — factorisés pour alléger la liste.
const DOMAIN_LABELS: Record<Milestone['domain'], LocalizedField> = {
  motor: {
    fr: 'Motricité globale',
    en: 'Gross motor',
    mg: 'Fihetsiketsehana ankapobeny',
    wo: 'Yëngu-yëngu bu rëy',
  },
  fine: {
    fr: 'Motricité fine',
    en: 'Fine motor',
    mg: 'Fihetsiketsehana madinika',
    wo: 'Yëngu-yëngu bu tuuti',
  },
  language: {
    fr: 'Langage',
    en: 'Language',
    mg: 'Fiteny',
    wo: 'Làkk',
  },
  social: {
    fr: 'Social & Cognitif',
    en: 'Social & Cognitive',
    mg: 'Sosialy & Fahaizana',
    wo: 'Jokkoo ak xel',
  },
};

export const milestones: Milestone[] = [
  // 0-2 mois
  {
    id: 'm-0-1', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Soulève brièvement la tête sur le ventre',
      en: 'Briefly lifts head while on tummy',
      mg: 'Manainga vetivety ny lohany rehefa mandry tapany',
      wo: 'Yékkati ndànk bopp su nekke ci bir',
    },
  },
  {
    id: 'm-0-2', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Mouvements symétriques des bras et jambes',
      en: 'Symmetrical movements of arms and legs',
      mg: "Fihetsehana mitovy an'ny sandry sy ny tongotra",
      wo: 'Yëngu yu yemoo ci loxo yi ak tànk yi',
    },
  },
  {
    id: 'm-0-3', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2,
    domain: 'fine', domainLabel: DOMAIN_LABELS.fine, domainEmoji: '✋',
    description: {
      fr: 'Réflexe de préhension (agrippe un doigt)',
      en: 'Grasp reflex (holds a finger)',
      mg: 'Fihetsehan\'ny fihazonana (mihazona rantsantanana)',
      wo: 'Jàppu bopp (mu jàpp baaraamu loxo)',
    },
  },
  {
    id: 'm-0-4', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Réagit aux sons forts',
      en: 'Reacts to loud sounds',
      mg: 'Mihetsika amin\'ny feo mafy',
      wo: 'Jox bu coow lu metti',
    },
  },
  {
    id: 'm-0-5', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Premiers gazouillis (areuh)',
      en: 'First coos (aah-ooh)',
      mg: 'Feo mafana voalohany (arèh)',
      wo: 'Coow yu njëkk (aaah)',
    },
  },
  {
    id: 'm-0-6', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Premier sourire social',
      en: 'First social smile',
      mg: 'Tsiky sosialy voalohany',
      wo: 'Muuñ bu njëkk ci jokkoo',
    },
  },
  {
    id: 'm-0-7', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Fixe un visage du regard',
      en: 'Fixes gaze on a face',
      mg: 'Mijery maso ny tarehy',
      wo: 'Xool kanamu nit',
    },
  },
  {
    id: 'm-0-8', ageRange: '0-2 mois', ageMinMonths: 0, ageMaxMonths: 2,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Se calme en étant pris dans les bras',
      en: 'Calms down when held',
      mg: 'Mitony rehefa karakaraina eny an-tsandry',
      wo: 'Dal xel su ko jàpp ci loxo',
    },
  },

  // 3-4 mois
  {
    id: 'm-3-1', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Tient sa tête droite en position assise',
      en: 'Holds head up when seated',
      mg: 'Mahatazona ny lohany mahitsy rehefa mipetraka',
      wo: 'Teg bopp bu jub suñu toog',
    },
  },
  {
    id: 'm-3-2', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Se retourne du ventre au dos',
      en: 'Rolls from tummy to back',
      mg: 'Mivadika avy amin\'ny kibo mankany amin\'ny lamosina',
      wo: 'Coow-coow ci bir jëm ci ginaaw',
    },
  },
  {
    id: 'm-3-3', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4,
    domain: 'fine', domainLabel: DOMAIN_LABELS.fine, domainEmoji: '✋',
    description: {
      fr: 'Attrape volontairement un objet',
      en: 'Deliberately grasps an object',
      mg: 'Mandray zavatra an-tsitrapo',
      wo: 'Jàpp yëf ak coobare',
    },
  },
  {
    id: 'm-3-4', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4,
    domain: 'fine', domainLabel: DOMAIN_LABELS.fine, domainEmoji: '✋',
    description: {
      fr: 'Porte les objets à la bouche',
      en: 'Brings objects to mouth',
      mg: 'Mitondra ny zavatra ao am-bava',
      wo: 'Yóbbu yëf ci gémmiñ',
    },
  },
  {
    id: 'm-3-5', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Rit aux éclats',
      en: 'Laughs out loud',
      mg: 'Mihomehy mafy',
      wo: 'Réy-réy ak coow',
    },
  },
  {
    id: 'm-3-6', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Vocalise de manière variée',
      en: 'Vocalizes in a variety of ways',
      mg: 'Mamoaka feo isan-karazany',
      wo: 'Génne baat yu bari',
    },
  },
  {
    id: 'm-3-7', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Suit un objet des yeux sur 180°',
      en: 'Follows an object with eyes across 180°',
      mg: 'Manaraka zavatra amin\'ny maso manodidina ny 180°',
      wo: 'Topp yëf ak bët ba 180°',
    },
  },
  {
    id: 'm-3-8', ageRange: '3-4 mois', ageMinMonths: 3, ageMaxMonths: 4,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Reconnaît ses parents',
      en: 'Recognizes parents',
      mg: "Mahalala ny ray aman-dreniny",
      wo: 'Xàmmee waajur yi',
    },
  },

  // 5-6 mois
  {
    id: 'm-5-1', ageRange: '5-6 mois', ageMinMonths: 5, ageMaxMonths: 6,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Tient assis avec appui',
      en: 'Sits with support',
      mg: 'Mipetraka misy fanohanana',
      wo: 'Toog ak ndimbal',
    },
  },
  {
    id: 'm-5-2', ageRange: '5-6 mois', ageMinMonths: 5, ageMaxMonths: 6,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Se retourne dans les deux sens',
      en: 'Rolls in both directions',
      mg: 'Mivadika amin\'ny lafiny roa',
      wo: 'Woññi ci ñaari wet',
    },
  },
  {
    id: 'm-5-3', ageRange: '5-6 mois', ageMinMonths: 5, ageMaxMonths: 6,
    domain: 'fine', domainLabel: DOMAIN_LABELS.fine, domainEmoji: '✋',
    description: {
      fr: "Transfère un objet d'une main à l'autre",
      en: 'Transfers an object from one hand to the other',
      mg: 'Mamindra zavatra avy amin\'ny tanana iray mankamin\'ny iray hafa',
      wo: "Jox yëf ci loxo bu beneen",
    },
  },
  {
    id: 'm-5-4', ageRange: '5-6 mois', ageMinMonths: 5, ageMaxMonths: 6,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Babillage (ba-ba, da-da)',
      en: 'Babbles (ba-ba, da-da)',
      mg: 'Fibabibaby (ba-ba, da-da)',
      wo: 'Jolli (ba-ba, da-da)',
    },
  },
  {
    id: 'm-5-5', ageRange: '5-6 mois', ageMinMonths: 5, ageMaxMonths: 6,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Angoisse de séparation commence',
      en: 'Separation anxiety begins',
      mg: "Manomboka ny tahotry ny fisarahana",
      wo: 'Ragal bu tàggoo tàmbali na',
    },
  },
  {
    id: 'm-5-6', ageRange: '5-6 mois', ageMinMonths: 5, ageMaxMonths: 6,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Tend les bras pour être porté',
      en: 'Reaches out to be picked up',
      mg: 'Manitatra ny sandriny mba ho entina',
      wo: 'Roof loxo yi ngir ñu jàpp ko',
    },
  },

  // 7-9 mois
  {
    id: 'm-7-1', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Tient assis sans appui',
      en: 'Sits without support',
      mg: 'Mipetraka tsy misy fanohanana',
      wo: 'Toog te amul ndimbal',
    },
  },
  {
    id: 'm-7-2', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Rampe ou se déplace à 4 pattes',
      en: 'Crawls or moves on all fours',
      mg: 'Mikisakisaka na mandady amin\'ny tongotra efatra',
      wo: 'Dox ci bir walla ci ñeenti tànk',
    },
  },
  {
    id: 'm-7-3', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9,
    domain: 'fine', domainLabel: DOMAIN_LABELS.fine, domainEmoji: '✋',
    description: {
      fr: 'Pince pouce-index (pince fine)',
      en: 'Pincer grasp (thumb and index finger)',
      mg: "Fihazonana manginina (ankiben-tanana sy mpanondro)",
      wo: 'Jàpp ak baaraamu yu tuuti (ku mag ak ku toppu)',
    },
  },
  {
    id: 'm-7-4', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Comprend "non"',
      en: 'Understands "no"',
      mg: 'Mahazo ny hoe "tsia"',
      wo: 'Xam na "déedéet"',
    },
  },
  {
    id: 'm-7-5', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Dit "mama" ou "papa" (non spécifique)',
      en: 'Says "mama" or "papa" (non-specific)',
      mg: 'Milaza hoe "neny" na "dada" (tsy voafaritra)',
      wo: 'Wax "mama" walla "papa" (du tànn)',
    },
  },
  {
    id: 'm-7-6', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Joue à coucou / cache-cache',
      en: 'Plays peek-a-boo',
      mg: 'Milalao afenina',
      wo: 'Fo koou-koou',
    },
  },
  {
    id: 'm-7-7', ageRange: '7-9 mois', ageMinMonths: 7, ageMaxMonths: 9,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Cherche un objet caché',
      en: 'Looks for a hidden object',
      mg: 'Mitady zavatra miafina',
      wo: 'Wut yëf bu ñu làq',
    },
  },

  // 10-12 mois
  {
    id: 'm-10-1', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Se met debout avec appui',
      en: 'Pulls to stand with support',
      mg: 'Mitsangana misy fanohanana',
      wo: 'Taxaw ak ndimbal',
    },
  },
  {
    id: 'm-10-2', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Fait ses premiers pas (avec aide)',
      en: 'Takes first steps (with help)',
      mg: 'Manao ny diany voalohany (misy fanampiana)',
      wo: 'Jëkk di dox (ak ndimbal)',
    },
  },
  {
    id: 'm-10-3', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12,
    domain: 'fine', domainLabel: DOMAIN_LABELS.fine, domainEmoji: '✋',
    description: {
      fr: 'Pointe du doigt',
      en: 'Points with finger',
      mg: 'Manondro amin\'ny rantsan-tanana',
      wo: 'Joxoñ ak baaraam',
    },
  },
  {
    id: 'm-10-4', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12,
    domain: 'fine', domainLabel: DOMAIN_LABELS.fine, domainEmoji: '✋',
    description: {
      fr: 'Empile 2 cubes',
      en: 'Stacks 2 blocks',
      mg: 'Manangana kibo 2',
      wo: 'Tas 2 kube',
    },
  },
  {
    id: 'm-10-5', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Dit 2-3 mots avec sens (mama, papa, dada)',
      en: 'Says 2-3 meaningful words (mama, papa, dada)',
      mg: 'Miteny teny 2-3 misy hevitra (neny, dada, baba)',
      wo: 'Wax 2-3 baat yu am tekki (mama, papa, dada)',
    },
  },
  {
    id: 'm-10-6', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Comprend des consignes simples',
      en: 'Understands simple instructions',
      mg: 'Mahazo baiko tsotra',
      wo: 'Xam ay ndigal yu yomb',
    },
  },
  {
    id: 'm-10-7', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Fait "au revoir" de la main',
      en: 'Waves goodbye',
      mg: 'Manofahofa tanana hoe "veloma"',
      wo: 'Wëgal loxo wax "ba beneen"',
    },
  },
  {
    id: 'm-10-8', ageRange: '10-12 mois', ageMinMonths: 10, ageMaxMonths: 12,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: "Imite les gestes de l'adulte",
      en: "Imitates adults' gestures",
      mg: 'Manahaka ny fihetsiky ny olon-dehibe',
      wo: 'Ropplu yëngu-yëngu bu mag ñi',
    },
  },

  // 13-18 mois
  {
    id: 'm-13-1', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Marche seul',
      en: 'Walks alone',
      mg: 'Mandeha irery',
      wo: 'Dox moom rekk',
    },
  },
  {
    id: 'm-13-2', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Monte les escaliers à 4 pattes',
      en: 'Climbs stairs on all fours',
      mg: 'Miakatra amin\'ny tohatra amin\'ny tongotra efatra',
      wo: 'Yéeg escalier ci ñeenti tànk',
    },
  },
  {
    id: 'm-13-3', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18,
    domain: 'fine', domainLabel: DOMAIN_LABELS.fine, domainEmoji: '✋',
    description: {
      fr: 'Gribouille avec un crayon',
      en: 'Scribbles with a crayon',
      mg: "Mandoko amin'ny penisily",
      wo: 'Bind-bind ak kërayoŋ',
    },
  },
  {
    id: 'm-13-4', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18,
    domain: 'fine', domainLabel: DOMAIN_LABELS.fine, domainEmoji: '✋',
    description: {
      fr: 'Empile 3-4 cubes',
      en: 'Stacks 3-4 blocks',
      mg: 'Manangana kibo 3-4',
      wo: 'Tas 3-4 kube',
    },
  },
  {
    id: 'm-13-5', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Dit 5-10 mots',
      en: 'Says 5-10 words',
      mg: 'Miteny teny 5-10',
      wo: 'Wax 5-10 baat',
    },
  },
  {
    id: 'm-13-6', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Montre les parties du corps',
      en: 'Points to body parts',
      mg: 'Manondro ny ampahany amin\'ny vatana',
      wo: 'Joxoñ ci cér yu yaram wi',
    },
  },
  {
    id: 'm-13-7', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Jeu symbolique simple (donne à manger à la poupée)',
      en: 'Simple pretend play (feeds a doll)',
      mg: 'Lalao an\'ohatra tsotra (mampihinana saribakoly)',
      wo: 'Fo jëmm yu yomb (leer xàddi lekk)',
    },
  },
  {
    id: 'm-13-8', ageRange: '13-18 mois', ageMinMonths: 13, ageMaxMonths: 18,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Comprend et exécute des consignes',
      en: 'Understands and follows instructions',
      mg: 'Mahazo sy manatanteraka baiko',
      wo: 'Xam te def ay ndigal',
    },
  },

  // 19-24 mois
  {
    id: 'm-19-1', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Court',
      en: 'Runs',
      mg: 'Mihazakazaka',
      wo: 'Daw',
    },
  },
  {
    id: 'm-19-2', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24,
    domain: 'motor', domainLabel: DOMAIN_LABELS.motor, domainEmoji: '🏃',
    description: {
      fr: 'Tape dans un ballon',
      en: 'Kicks a ball',
      mg: 'Mandaka baolina',
      wo: 'Dóor bóu',
    },
  },
  {
    id: 'm-19-3', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24,
    domain: 'fine', domainLabel: DOMAIN_LABELS.fine, domainEmoji: '✋',
    description: {
      fr: 'Empile 6+ cubes',
      en: 'Stacks 6+ blocks',
      mg: 'Manangana kibo 6+',
      wo: 'Tas 6 kube walla lu ëpp',
    },
  },
  {
    id: 'm-19-4', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24,
    domain: 'fine', domainLabel: DOMAIN_LABELS.fine, domainEmoji: '✋',
    description: {
      fr: "Tourne les pages d'un livre",
      en: 'Turns pages of a book',
      mg: "Manodina ny pejin'ny boky",
      wo: 'Wañaxal xët yu téere',
    },
  },
  {
    id: 'm-19-5', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Associe 2 mots (phrase simple)',
      en: 'Combines 2 words (simple phrase)',
      mg: 'Manambatra teny 2 (fehezanteny tsotra)',
      wo: 'Boole 2 baat (kàddu yu yomb)',
    },
  },
  {
    id: 'm-19-6', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24,
    domain: 'language', domainLabel: DOMAIN_LABELS.language, domainEmoji: '🗣️',
    description: {
      fr: 'Vocabulaire de 50+ mots',
      en: 'Vocabulary of 50+ words',
      mg: 'Rakibolana misy teny 50+',
      wo: 'Am 50 baat walla lu ëpp',
    },
  },
  {
    id: 'm-19-7', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: "Début du jeu parallèle avec d'autres enfants",
      en: 'Starts parallel play with other children',
      mg: 'Fiandohan\'ny lalao mitovy amin\'ny ankizy hafa',
      wo: 'Tàmbali fo ci wetu yeneen xale yi',
    },
  },
  {
    id: 'm-19-8', ageRange: '19-24 mois', ageMinMonths: 19, ageMaxMonths: 24,
    domain: 'social', domainLabel: DOMAIN_LABELS.social, domainEmoji: '🧠',
    description: {
      fr: 'Exprime ses émotions (colère, joie, frustration)',
      en: 'Expresses emotions (anger, joy, frustration)',
      mg: "Maneho ny fihetseham-pony (hatezerana, hafaliana, fahasorenana)",
      wo: 'Wone ay yëgu-yëgu (mer, bég, naqari xel)',
    },
  },
];
