// Informations éducatives pour chaque maladie ciblée par un vaccin.
// Clé = vaccine.id dans vaccines.ts. Utilisé par VaccineEducation.

import type { LocalizedField } from '@/lib/i18n-data';

export interface VaccineInfo {
  why: LocalizedField<string>;            // Pourquoi vacciner — phrase courte motivante
  disease: LocalizedField<string>;        // Description de la maladie
  risk: LocalizedField<string>;           // Gravité / complications possibles
  sideEffects?: LocalizedField<string>;   // Effets secondaires attendus après vaccin
  color?: string;                         // Accent couleur pour la fiche
}

/**
 * Remarque : une seule entrée par "famille" de vaccin — certaines doses (rappels)
 * partagent la même éducation. La lookup tombe sur la racine de l'ID.
 */
export const vaccineInfo: Record<string, VaccineInfo> = {
  bcg: {
    why: {
      fr: 'Protège bébé contre une maladie grave qui atteint surtout les poumons.',
      en: 'Protects your baby from a serious disease that mainly affects the lungs.',
      mg: 'Miaro ny zaza amin\'ny aretina mahery mihatra indrindra amin\'ny havokavoka.',
      wo: 'Dafay aar sa doom ci benn feebar bu metti bi jappe rayo yi.',
    },
    disease: {
      fr: 'La tuberculose est causée par un microbe qui attaque les poumons (et parfois d\'autres organes). Elle se transmet par la toux.',
      en: 'Tuberculosis is caused by a germ that attacks the lungs (and sometimes other organs). It spreads through coughing.',
      mg: 'Ny raboka dia vokatry ny mikraoba iray manafika ny havokavoka (sy ny taova hafa indraindray). Mifindra amin\'ny alalan\'ny kohaka izy.',
      wo: 'Yarantu moo ngi juddoo ci benn mikrob bu jappe rayo yi (ak yeneen jëmm yi ci yenn saay). Dafay jàll ci sëqët.',
    },
    risk: {
      fr: 'Chez le nourrisson, la tuberculose peut provoquer des formes graves (méningite, forme pulmonaire étendue).',
      en: 'In infants, tuberculosis can cause severe forms (meningitis, widespread lung disease).',
      mg: 'Amin\'ny zaza menavava, ny raboka dia mety hiteraka endrika mahery (menenjita, aretin\'ny havokavoka miitatra).',
      wo: 'Ci liir yi, yarantu dafay jur forma yu metti (menenjit, sibbiru ci rayo yi bu yaatu).',
    },
    sideEffects: {
      fr: 'Petite réaction locale qui peut laisser une cicatrice sur le bras, normale.',
      en: 'Small local reaction that may leave a scar on the arm, this is normal.',
      mg: 'Fihetsika madinika eo an-toerana izay mety hamela holatra eo amin\'ny sandry, ara-dalàna.',
      wo: 'Ab tànk bu tuuti ci bérab bi, man naa bàyyi kirmas ci loxo bi, dëgër-dëgër la.',
    },
    color: 'emerald',
  },
  hepb: {
    why: {
      fr: 'Empêche bébé d\'attraper un virus qui abîme le foie à long terme.',
      en: 'Prevents your baby from catching a virus that damages the liver over the long term.',
      mg: 'Manakana ny zaza tsy ho voan\'ny viriosy izay manimba ny aty raha lava ny fotoana.',
      wo: 'Dafay téye sa doom muy jël benn wirus bu yàq res bi ci diir bu gudd.',
    },
    disease: {
      fr: 'L\'hépatite B est un virus qui s\'installe dans le foie. Peut devenir chronique et causer cirrhose ou cancer.',
      en: 'Hepatitis B is a virus that settles in the liver. It can become chronic and cause cirrhosis or cancer.',
      mg: 'Ny hepatite B dia viriosy iray miorim-ponenana ao amin\'ny aty. Mety ho lasa maharitra ka miteraka sirôzy na homamiadana.',
      wo: 'Hépatit B mooy benn wirus bu toog ci res bi. Man naa nekk bu yàgg te jur sirroos walla kañseer.',
    },
    risk: {
      fr: 'Peut se transmettre de la mère au bébé à l\'accouchement ou dans l\'entourage familial.',
      en: 'Can pass from mother to baby at birth or within the family circle.',
      mg: 'Afaka mifindra avy amin\'ny reny mankany amin\'ny zaza amin\'ny fotoanan\'ny fiterahana na ao amin\'ny fianakaviana.',
      wo: 'Man naa jàll ci yaay ba doom ci bés bu mu juddoo walla ci njaboot gi.',
    },
    sideEffects: {
      fr: 'Rougeur au point d\'injection, fièvre légère possible.',
      en: 'Redness at the injection site, mild fever possible.',
      mg: 'Mena kely eo amin\'ny toerana nitsindronana, mety hisy tazo madinika.',
      wo: 'Xonq ci bérab bi ñu jàm, tàngoor wu woyof man naa am.',
    },
    color: 'amber',
  },
  polio: {
    why: {
      fr: 'Empêche une maladie qui peut paralyser à vie.',
      en: 'Prevents a disease that can cause lifelong paralysis.',
      mg: 'Manakana aretina iray izay mety hahatonga fahalemem-batana mandritra ny androm-piainana.',
      wo: 'Dafay téye benn feebar bu man naa tax nit mu jàpp ba dundu gi yépp.',
    },
    disease: {
      fr: 'La poliomyélite est un virus qui attaque le système nerveux et peut paralyser les jambes, les bras, ou la respiration.',
      en: 'Polio is a virus that attacks the nervous system and can paralyse the legs, arms, or breathing.',
      mg: 'Ny polio dia viriosy iray manafika ny rafi-pitaovana ary afaka mampalemy ny tongotra, ny sandry, na ny fiainana.',
      wo: 'Polio mooy benn wirus bu jappe sistem nerwë bi, te man naa jàpp tànki yi, loxo yi, walla noyyi gi.',
    },
    risk: {
      fr: 'Pas de traitement curatif — seule la vaccination prévient. Encore active dans certains pays.',
      en: 'No cure exists — only vaccination prevents it. Still active in some countries.',
      mg: 'Tsy misy fitsaboana mahasitrana — ny vaksiny ihany no fisorohana. Mbola misy any amin\'ny firenena sasany.',
      wo: 'Amul faj — waccin rekk mooy téye. Mungi fi ba tey ci yenn réew yi.',
    },
    sideEffects: {
      fr: 'Légère fièvre, peu d\'effets secondaires.',
      en: 'Mild fever, few side effects.',
      mg: 'Tazo madinika, vitsy ny fiantraikany.',
      wo: 'Tàngoor wu woyof, ay jafe-jafe yu néew.',
    },
    color: 'sky',
  },
  penta: {
    why: {
      fr: 'Un seul vaccin qui protège contre 5 maladies graves.',
      en: 'A single vaccine that protects against 5 serious diseases.',
      mg: 'Vaksiny tokana miaro amin\'ny aretina mahery 5.',
      wo: 'Benn waccin bu aar ci 5 feebar yu metti.',
    },
    disease: {
      fr: 'Diphtérie (étouffement), Tétanos (contractures), Coqueluche (toux sévère), Hépatite B, Haemophilus (méningite).',
      en: 'Diphtheria (choking), Tetanus (muscle spasms), Whooping cough (severe cough), Hepatitis B, Haemophilus (meningitis).',
      mg: 'Difterie (fahakenana), Tetanôsy (fifandrifiran\'ny hozatra), Tsatsoka (kohaka mahery), Hepatite B, Haemophilus (menenjita).',
      wo: 'Difteri (xawsu), Tetanoos (yaram bi dafay ñàkk dogal), Sëqët (sëqët bu metti), Hépatit B, Haemophilus (menenjit).',
    },
    risk: {
      fr: 'Ces maladies sont toutes potentiellement mortelles chez le nourrisson.',
      en: 'All these diseases can be fatal in infants.',
      mg: 'Ireo aretina ireo dia samy mety hahafaty ny zaza menavava.',
      wo: 'Feebar yii yépp man nañu faat liir bi.',
    },
    sideEffects: {
      fr: 'Fièvre (paracétamol autorisé), rougeur, bébé un peu grognon 24-48h.',
      en: 'Fever (paracetamol allowed), redness, baby a bit fussy for 24-48h.',
      mg: 'Tazo (azo ampiasaina paracetamol), mena, zaza somary mirehareha 24-48 ora.',
      wo: 'Tàngoor (paracetamol jiitu na), xonq, liir bi man naa am merr 24-48 waxtu.',
    },
    color: 'violet',
  },
  hexa: {
    why: {
      fr: 'Protège contre 6 maladies en une seule injection.',
      en: 'Protects against 6 diseases in a single injection.',
      mg: 'Miaro amin\'ny aretina 6 amin\'ny tsindrona tokana.',
      wo: 'Dafay aar ci 6 feebar ci benn jàmm rekk.',
    },
    disease: {
      fr: 'Diphtérie, Tétanos, Coqueluche, Polio, Hib (méningite), Hépatite B.',
      en: 'Diphtheria, Tetanus, Whooping cough, Polio, Hib (meningitis), Hepatitis B.',
      mg: 'Difterie, Tetanôsy, Tsatsoka, Polio, Hib (menenjita), Hepatite B.',
      wo: 'Difteri, Tetanoos, Sëqët, Polio, Hib (menenjit), Hépatit B.',
    },
    risk: {
      fr: 'Sans vaccin, ces maladies peuvent être graves voire mortelles.',
      en: 'Without vaccination, these diseases can be serious or even fatal.',
      mg: 'Raha tsy misy vaksiny, ireo aretina ireo dia mety ho henjana ary na dia hahafaty aza.',
      wo: 'Su amul waccin, feebar yii man nañu metti te faat it.',
    },
    sideEffects: {
      fr: 'Fièvre, rougeur locale, bébé grognon 24-48h. Paracétamol si fièvre.',
      en: 'Fever, local redness, baby fussy for 24-48h. Paracetamol if fever.',
      mg: 'Tazo, mena eo an-toerana, zaza mirehareha 24-48 ora. Paracetamol raha misy tazo.',
      wo: 'Tàngoor, xonq ci bérab bi, liir bi merr 24-48 waxtu. Paracetamol bu tàngoor am.',
    },
    color: 'violet',
  },
  pneumo: {
    why: {
      fr: 'Protège les poumons et le cerveau contre une bactérie dangereuse.',
      en: 'Protects the lungs and brain from a dangerous bacterium.',
      mg: 'Miaro ny havokavoka sy ny atidoha amin\'ny bakteria mampidi-doza.',
      wo: 'Dafay aar rayo yi ak xel mi ci benn bakteri bu metti.',
    },
    disease: {
      fr: 'Le pneumocoque cause otites, pneumonies et méningites chez le petit enfant.',
      en: 'Pneumococcus causes ear infections, pneumonia and meningitis in young children.',
      mg: 'Ny pneumocoque dia mahatonga aretin-tsofina, aretin-tsoroka ary menenjita amin\'ny ankizy madinika.',
      wo: 'Pnëmokok dafay jur sibbiru ci nopp yi, sibbiru ci diir bi ak menenjit ci xale yu ndaw yi.',
    },
    risk: {
      fr: 'Les méningites pneumococciques peuvent laisser des séquelles neurologiques.',
      en: 'Pneumococcal meningitis can leave long-term neurological damage.',
      mg: 'Ny menenjita pneumokôsika dia mety hamela voka-dratsy amin\'ny nerva.',
      wo: 'Menenjit yu pnëmokok yi man nañu bàyyi jafe-jafe ci nerwë yi.',
    },
    sideEffects: {
      fr: 'Fièvre possible, rougeur.',
      en: 'Possible fever, redness.',
      mg: 'Mety hisy tazo, mena.',
      wo: 'Man naa am tàngoor, xonq.',
    },
    color: 'sky',
  },
  rota: {
    why: {
      fr: 'Évite des diarrhées très sévères qui peuvent déshydrater bébé.',
      en: 'Prevents very severe diarrhoea that can dehydrate your baby.',
      mg: 'Misoroka ny fivalanana mafy izay mety hamaina ny zaza.',
      wo: 'Dafay téye biir-bu-daw bu metti bu man na ñàkk ndox ci sa doom.',
    },
    disease: {
      fr: 'Le rotavirus provoque des gastro-entérites aiguës chez les nourrissons.',
      en: 'Rotavirus causes severe gastroenteritis in infants.',
      mg: 'Ny rotavirus dia mahatonga gastro mahery amin\'ny zaza menavava.',
      wo: 'Rotawirus dafay jur biir-bu-daw bu metti ci liir yi.',
    },
    risk: {
      fr: 'Déshydratation rapide — principale cause d\'hospitalisation pour gastro avant 2 ans.',
      en: 'Rapid dehydration — the main reason infants under 2 are hospitalised for gastro.',
      mg: 'Tsy fahampian\'ny rano haingana — antony voalohany hidirana hopitaly noho ny gastro alohan\'ny 2 taona.',
      wo: 'Ñàkk ndox bu gaaw — li gën a tax xale yu yeesa 2 at nekk ci ëpital ngir biir-bu-daw.',
    },
    sideEffects: {
      fr: 'Vaccin oral, peu d\'effets secondaires, parfois selles un peu molles.',
      en: 'Oral vaccine, few side effects, sometimes slightly loose stools.',
      mg: 'Vaksiny amin\'ny vava, vitsy ny fiantraikany, indraindray tay somary malemy.',
      wo: 'Waccin bu gémmiñ, jafe-jafe yu néew, ci yenn saay biir bu néew tuuti.',
    },
    color: 'amber',
  },
  ror: {
    why: {
      fr: 'Triple protection contre 3 maladies très contagieuses.',
      en: 'Triple protection against 3 highly contagious diseases.',
      mg: 'Fiarovana telo sosona amin\'ny aretina mifindra be 3.',
      wo: 'Aar buñ jëfandikoo ngir 3 feebar yu gaawul jàll.',
    },
    disease: {
      fr: 'Rougeole (éruption + forte fièvre), Oreillons (glandes gonflées), Rubéole (dangereuse si grossesse).',
      en: 'Measles (rash + high fever), Mumps (swollen glands), Rubella (dangerous in pregnancy).',
      mg: 'Kitrotro (vay + tazo mafy), Samonetina (glandes mivonto), Rubeola (mampidi-doza raha mitoe-jaza).',
      wo: 'Xiibon (ay yerm + tàngoor bu metti), Ndongor (gland yu newwi), Ribeol (dañuy metti su jiggéen di ëmb).',
    },
    risk: {
      fr: 'La rougeole reste l\'une des maladies infantiles les plus meurtrières sans vaccin.',
      en: 'Measles remains one of the deadliest childhood diseases without vaccination.',
      mg: 'Ny kitrotro dia mbola anisan\'ny aretin-jaza mahafaty indrindra raha tsy misy vaksiny.',
      wo: 'Xiibon mooy ba tey benn ci feebar yi gën a faat xale yi su amul waccin.',
    },
    sideEffects: {
      fr: 'Fièvre et éruption légères 7-10 jours après la vaccination (réaction normale).',
      en: 'Mild fever and rash 7-10 days after vaccination (normal reaction).',
      mg: 'Tazo sy vay madinika 7-10 andro aorian\'ny vaksiny (fihetsika ara-dalàna).',
      wo: 'Tàngoor ak ay yerm yu woyof 7-10 fan ginnaaw waccin bi (dëgër-dëgër la).',
    },
    color: 'rose',
  },
  'fievre-jaune': {
    why: {
      fr: 'Protège contre une maladie transmise par le moustique, grave en Afrique.',
      en: 'Protects against a mosquito-borne disease that is serious in Africa.',
      mg: 'Miaro amin\'ny aretina entin\'ny moka, mahery any Afrika.',
      wo: 'Dafay aar ci benn feebar bu yoo yi jox, bu metti ci Afrig.',
    },
    disease: {
      fr: 'La fièvre jaune cause fièvre, jaunisse et peut toucher le foie et les reins.',
      en: 'Yellow fever causes fever, jaundice, and can affect the liver and kidneys.',
      mg: 'Ny tazo mavo dia miteraka tazo, famavoan\'ny hoditra ary mety hanimba ny aty sy ny voa.',
      wo: 'Tàngoor wu mboq wi dafay jur tàngoor, mboq-yaram ak man naa jàpp res bi ak yaram wu neex yi.',
    },
    risk: {
      fr: 'Maladie pouvant être mortelle. Endémique dans de nombreux pays africains.',
      en: 'The disease can be fatal. Endemic in many African countries.',
      mg: 'Aretina mety hahafaty. Endemika any amin\'ny firenena afrikanina maro.',
      wo: 'Feebar bi man naa faat. Dafay am ci réew yu bari yu Afrig.',
    },
    sideEffects: {
      fr: 'Légère fièvre 1-2 jours après, fatigue.',
      en: 'Mild fever 1-2 days after, tiredness.',
      mg: 'Tazo madinika 1-2 andro aorian\'izay, reraka.',
      wo: 'Tàngoor wu woyof 1-2 fan ginnaaw, sonn.',
    },
    color: 'amber',
  },
  'meningo-a': {
    why: {
      fr: 'Protège contre les méningites de la "ceinture méningitique" africaine.',
      en: 'Protects against meningitis in the African "meningitis belt".',
      mg: 'Miaro amin\'ny menenjita ao amin\'ny "fehikibo menenjita" afrikanina.',
      wo: 'Dafay aar ci menenjit yi ci "geñ bu menenjit" bu Afrig.',
    },
    disease: {
      fr: 'Le méningocoque A cause des méningites rapidement mortelles.',
      en: 'Meningococcus A causes rapidly fatal meningitis.',
      mg: 'Ny meningokoka A dia mahatonga menenjita mahafaty haingana.',
      wo: 'Meningokok A dafay jur menenjit yuy faat gaaw.',
    },
    risk: {
      fr: 'Épidémies saisonnières au Sahel, les enfants sont les plus touchés.',
      en: 'Seasonal outbreaks in the Sahel; children are the most affected.',
      mg: 'Areti-mifindra arakaraka ny vanim-potoana any Sahel, ny ankizy no voakasika indrindra.',
      wo: 'Ay epidemi yuy sottiku ci Sahel, xale yi ñoo ci gën a sax.',
    },
    sideEffects: {
      fr: 'Rougeur, petite fièvre.',
      en: 'Redness, mild fever.',
      mg: 'Mena, tazo kely.',
      wo: 'Xonq, tàngoor wu tuuti.',
    },
    color: 'sky',
  },
  'meningo-c': {
    why: {
      fr: 'Protège contre le méningocoque C (méningite / septicémie).',
      en: 'Protects against meningococcus C (meningitis / blood infection).',
      mg: 'Miaro amin\'ny meningokoka C (menenjita / aretin-drà).',
      wo: 'Dafay aar ci meningokok C (menenjit / sibbiru ci deret).',
    },
    disease: {
      fr: 'Infection à méningocoque C : méningite ou infection généralisée du sang.',
      en: 'Meningococcal C infection: meningitis or a widespread blood infection.',
      mg: 'Aretina noho ny meningokoka C: menenjita na aretin-drà miitatra.',
      wo: 'Jàngoroo ci meningokok C: menenjit walla sibbiru ci deret bu yaatu.',
    },
    risk: {
      fr: 'Peut tuer en quelques heures. Le vaccin est très efficace.',
      en: 'Can kill within hours. The vaccine is highly effective.',
      mg: 'Afaka mamono ao anatin\'ny ora vitsivitsy. Tena mahomby ny vaksiny.',
      wo: 'Man naa faat ci ay waxtu yu néew. Waccin bi dafa am solo lool.',
    },
    sideEffects: {
      fr: 'Rougeur locale, peu d\'effets.',
      en: 'Local redness, few effects.',
      mg: 'Mena eo an-toerana, vitsy ny fiantraikany.',
      wo: 'Xonq ci bérab bi, jafe-jafe yu néew.',
    },
    color: 'sky',
  },
  vita: {
    why: {
      fr: 'Renforce immunité et prévient problèmes de vue.',
      en: 'Strengthens immunity and prevents vision problems.',
      mg: 'Manamafy ny hery fiarovana ary misoroka ny olan\'ny maso.',
      wo: 'Dafay dëgëral ak téye ci jafe-jafe yu bët bi.',
    },
    disease: {
      fr: 'La carence en vitamine A cause cécité nocturne et baisse de l\'immunité.',
      en: 'Vitamin A deficiency causes night blindness and weakens immunity.',
      mg: 'Ny tsy fahampian\'ny Vitamine A dia miteraka fahajamban\'ny alina sy fihenan\'ny hery fiarovana.',
      wo: 'Ñàkk Vitamin A dafay jur gumba ci guddi ak wàññi kàttanu aar yaram bi.',
    },
    risk: {
      fr: 'Fréquente dans certaines régions avec alimentation peu variée.',
      en: 'Common in some regions with limited dietary variety.',
      mg: 'Matetika any amin\'ny faritra sasany izay tsy ahitana sakafo maro karazana.',
      wo: 'Dafay am bu bari ci yenn diiwaan yu ñu rafet mbaa ñu bari lekk.',
    },
    sideEffects: {
      fr: 'Aucun à dose standard. Goutte orale.',
      en: 'None at standard dose. Oral drops.',
      mg: 'Tsy misy amin\'ny dôsy mahazatra. Rano atao amin\'ny vava.',
      wo: 'Dara su nekkee yokk bu yomb. Ay toq ci gémmiñ.',
    },
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
