import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Snowflake, Thermometer, Droplets, CircleAlert, BookOpen, X } from 'lucide-react';

/**
 * ConservationGuide — toggle card qui ouvre un panel détaillé sur
 * la conservation (frigo/congélateur) + hygiène (biberons, lavage).
 * Basé sur recommandations AFSSA / ANSES / OMS.
 */
export function ConservationGuide() {
  const [open, setOpen] = useState<'storage' | 'hygiene' | null>(null);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen('storage')}
        className="w-full glass-card-sky rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.99]"
      >
        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
          <Snowflake className="w-5 h-5 text-sky-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[0.15em] text-sky-700 font-semibold">Guide</p>
          <p className="font-heading font-bold text-bark-800 mt-0.5">Conservation des aliments</p>
          <p className="text-xs text-bark-500 mt-0.5">Frigo · congélateur · restes · durées</p>
        </div>
        <BookOpen className="w-4 h-4 text-sky-600 flex-shrink-0" />
      </button>

      <button
        onClick={() => setOpen('hygiene')}
        className="w-full glass-card-green rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.99]"
      >
        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
          <Droplets className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-700 font-semibold">Guide</p>
          <p className="font-heading font-bold text-bark-800 mt-0.5">Hygiène & préparation</p>
          <p className="text-xs text-bark-500 mt-0.5">Biberons · ustensiles · lavage</p>
        </div>
        <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[480px] bg-white rounded-t-3xl max-h-[85dvh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {open === 'storage' ? <StorageContent onClose={() => setOpen(null)} /> : <HygieneContent onClose={() => setOpen(null)} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StorageContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Snowflake className="w-6 h-6 text-sky-600" />
          <h2 className="font-heading text-xl font-bold text-bark-800">Conservation</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-ivory-200 flex items-center justify-center">
          <X className="w-4 h-4 text-bark-600" />
        </button>
      </div>

      <div className="space-y-3">
        <Row emoji="🥣" title="Purée maison" detail="Contenant hermétique fermé juste après cuisson"
             storage={[['Frigo (0-4°C)', '48h max'], ['Congélateur (-18°C)', '1 mois'], ['Température ambiante', 'Jamais']]} />
        <Row emoji="🍼" title="Biberon lait maternel" detail="Refroidir rapidement après tire-lait"
             storage={[['Frigo', '48h'], ['Congélateur', '4-6 mois'], ['Décongelé (au frigo)', '24h'], ['Température ambiante', '4h max']]} />
        <Row emoji="🍼" title="Biberon lait infantile" detail="Préparer au dernier moment, jeter le reste"
             storage={[['Température ambiante', '1h max'], ['Frigo (non entamé)', '24h'], ['Réchauffé non consommé', 'Jeter']]} />
        <Row emoji="🍎" title="Compote maison" detail="Dans un bocal stérilisé"
             storage={[['Frigo', '3 jours'], ['Congélateur', '3 mois']]} />
        <Row emoji="🥩" title="Viande/poisson cuit" detail="Mixer puis refroidir rapidement"
             storage={[['Frigo', '24h'], ['Congélateur', '1 mois']]} />
        <Row emoji="🥚" title="Œuf cuit dur" detail="Obligatoirement cuit en entier pour bébé"
             storage={[['Frigo', '2 jours'], ['Congélateur', 'Non recommandé']]} />
      </div>

      <div className="mt-5 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
        <CircleAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-bark-700 leading-relaxed">
          <p className="font-semibold text-amber-800 mb-1">Règles d'or</p>
          <ul className="space-y-1">
            <li>• Ne <strong>jamais</strong> recongeler un aliment décongelé.</li>
            <li>• Réchauffer une seule fois, à cœur (70°C minimum pour viandes/poissons).</li>
            <li>• Jeter tout reste entamé par bébé (salive) après 1h.</li>
            <li>• Étiqueter les petits pots avec la date de préparation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function HygieneContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Droplets className="w-6 h-6 text-emerald-600" />
          <h2 className="font-heading text-xl font-bold text-bark-800">Hygiène & préparation</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-ivory-200 flex items-center justify-center">
          <X className="w-4 h-4 text-bark-600" />
        </button>
      </div>

      <Section title="Avant de cuisiner" items={[
        'Lave-toi les mains avec du savon pendant 20 secondes',
        'Nettoie plan de travail + ustensiles à l\'eau chaude savonneuse',
        'Lave fruits et légumes à l\'eau claire (brosse si peau épaisse)',
        'Attention aux ustensiles en bois — privilégier inox/plastique',
      ]} />

      <Section title="Stérilisation biberons (0-4 mois)" items={[
        'Démonter complètement le biberon (tétine, anneau, capuchon)',
        'Laver chaque pièce à l\'eau chaude savonneuse + rincer',
        'Stériliser à l\'eau bouillante 10 min OU stérilisateur vapeur',
        'Laisser sécher à l\'air libre sur un torchon propre',
        'Après 4 mois : lave-vaisselle à 65°C suffit',
      ]} />

      <Section title="Préparer un biberon de lait infantile" items={[
        'Eau faiblement minéralisée (mention "convient aux bébés")',
        'Respecter la dose : 1 mesurette rase pour 30 ml d\'eau',
        'Verser eau puis poudre, jamais l\'inverse',
        'Agiter doucement (ne pas secouer fort : moussage)',
        'Tester la température sur le poignet (tiède, jamais chaud)',
      ]} />

      <Section title="Cuisson adaptée bébé" items={[
        'Cuisson à la vapeur : garde les vitamines (préféré)',
        'Éviter frit/grillé/braisé avant 2 ans',
        'Pas de sel, pas de sucre, pas de miel avant 12 mois',
        'Pas d\'épices fortes (piment, poivre) avant 2 ans',
      ]} />

      <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex gap-3 mt-4">
        <Thermometer className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-bark-700 leading-relaxed">
          <strong className="text-sky-700">Température idéale</strong> : le repas de bébé doit être tiède (37°C environ).
          Jamais chaud, jamais froid avant 12 mois.
        </p>
      </div>
    </div>
  );
}

function Row({ emoji, title, detail, storage }: { emoji: string; title: string; detail: string; storage: string[][] }) {
  return (
    <div className="bg-ivory-100 rounded-2xl p-4">
      <div className="flex items-start gap-3 mb-2">
        <span className="text-2xl">{emoji}</span>
        <div className="flex-1">
          <p className="font-heading font-bold text-sm text-bark-800">{title}</p>
          <p className="text-[11px] text-bark-500">{detail}</p>
        </div>
      </div>
      <div className="pl-9 space-y-1">
        {storage.map(([loc, dur]) => (
          <div key={loc} className="flex justify-between text-xs">
            <span className="text-bark-500">{loc}</span>
            <span className="font-mono text-bark-700 font-semibold">{dur}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-700 font-semibold mb-2">{title}</p>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-bark-700 leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
