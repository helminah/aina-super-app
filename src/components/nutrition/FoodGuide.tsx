import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, AlertCircle, X, Info } from 'lucide-react';
import { foodGuide, foodAgeGroups, categoryLabels, type FoodItem, type FoodCategory } from '@/data/food-guide';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeInMonths } from '@/lib/age-utils';
import { COUNTRY_BY_CODE } from '@/data/countries';
import { ConservationGuide } from './ConservationGuide';
import { AIRecipeGenerator } from './AIRecipeGenerator';

/**
 * FoodGuide — onglet "Aliments" : introduction par âge, conservation, allergènes.
 * Complément des recettes : ici c'est le QUOI (quel aliment, quand, comment),
 * les recettes restent le COMMENT (préparation concrète).
 */
export function FoodGuide() {
  const { profile } = useBaby();
  const ageMonths = profile ? getAgeInMonths(profile.birthDate) : 6;

  // Groupe par défaut = celui qui correspond à l'âge du bébé
  const currentGroup = useMemo(
    () => foodAgeGroups.find(g => ageMonths >= g.minMonths && ageMonths < g.maxMonths) ?? foodAgeGroups[0],
    [ageMonths],
  );
  const [selected, setSelected] = useState(currentGroup);
  const [detail, setDetail] = useState<FoodItem | null>(null);

  // Tous les aliments introductibles à cet âge ; on marque en plus ceux qui sont
  // "nouveaux" pour la tranche sélectionnée.
  const foods = useMemo(
    () => foodGuide.filter(f => f.minMonths <= selected.maxMonths),
    [selected],
  );
  const isNew = (minMonths: number) => minMonths >= selected.minMonths && minMonths < selected.maxMonths;

  const byCategory = useMemo(() => {
    const map = new Map<FoodCategory, FoodItem[]>();
    for (const f of foods) {
      const arr = map.get(f.category) || [];
      arr.push(f);
      map.set(f.category, arr);
    }
    return map;
  }, [foods]);

  // Pays détermine le contexte local affiché
  const isAfrica = profile && COUNTRY_BY_CODE[profile.country]?.region?.startsWith('afrique');

  return (
    <div className="space-y-5">
      {/* Guides (conservation + hygiène) en tête */}
      <ConservationGuide />

      {/* Age group picker */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {foodAgeGroups.map(g => {
          const isActive = g.label === selected.label;
          return (
            <button
              key={g.label}
              onClick={() => setSelected(g)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                isActive ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'bg-ivory-100 text-bark-500'
              }`}
            >
              {g.emoji} {g.label}
            </button>
          );
        })}
      </div>

      {/* Group description */}
      <div className="glass-card-amber rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{selected.emoji}</div>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.15em] text-amber-700 font-semibold">{selected.label}</p>
            <p className="font-heading font-bold text-bark-800 mt-0.5">{selected.description}</p>
            <p className="text-xs text-bark-500 mt-1">{foods.length} aliments introduits dans cette tranche</p>
          </div>
        </div>
      </div>

      {/* Foods grouped by category */}
      {[...byCategory.entries()].map(([cat, list]) => (
        <div key={cat}>
          <p className="text-[11px] uppercase tracking-[0.15em] text-bark-400 font-semibold mb-2 px-1">
            {categoryLabels[cat].emoji} {categoryLabels[cat].label} · {list.length}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {list.map(f => (
              <button
                key={f.id}
                onClick={() => setDetail(f)}
                className="bg-white rounded-2xl p-3.5 elev-1 flex items-start gap-3 text-left transition-all active:scale-[0.98]"
              >
                <span className="text-3xl flex-shrink-0">{f.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-bark-800 truncate">{f.name}</p>
                  <p className="text-[11px] text-bark-400 mt-0.5">dès {f.minMonths} mois</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {isNew(f.minMonths) && (
                      <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                        nouveau
                      </span>
                    )}
                    {f.isAllergen && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-red-600 font-medium">
                        <AlertCircle className="w-3 h-3" /> allergène
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Detail sheet */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
            onClick={() => setDetail(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[480px] bg-white rounded-t-3xl max-h-[85dvh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{detail.emoji}</span>
                    <div>
                      <h2 className="font-heading text-xl font-bold text-bark-800">{detail.name}</h2>
                      <p className="text-xs text-amber-600 font-semibold mt-0.5">dès {detail.minMonths} mois</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDetail(null)}
                    className="w-8 h-8 rounded-full bg-ivory-200 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-bark-600" />
                  </button>
                </div>

                {/* Texture */}
                <div className="bg-ivory-100 rounded-2xl p-4 mb-3">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold">Texture</p>
                  <p className="text-sm text-bark-700 mt-1">{detail.texture}</p>
                </div>

                {/* Tips */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-3">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-amber-700 font-semibold">Conseil</p>
                  <p className="text-sm text-bark-700 mt-1 leading-relaxed">{detail.tips}</p>
                </div>

                {/* Local context */}
                {detail.localContext && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-3">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-700 font-semibold">
                      Contexte local
                    </p>
                    <p className="text-sm text-bark-700 mt-1 leading-relaxed">
                      {isAfrica && detail.localContext.africa
                        ? detail.localContext.africa
                        : detail.localContext.france ?? detail.localContext.africa}
                    </p>
                  </div>
                )}

                {/* Allergen warning */}
                {detail.isAllergen && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">Allergène</p>
                      {detail.allergenInfo && (
                        <p className="text-xs text-red-600 mt-1 leading-relaxed">{detail.allergenInfo}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Note générale conservation */}
                <div className="mt-5 pt-5 border-t border-ivory-300 flex gap-3">
                  <Info className="w-4 h-4 text-bark-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-bark-500 leading-relaxed">
                    Conservez les purées maison 48h max au frigo (contenant hermétique) ou 1 mois au congélateur.
                    Réchauffez uniquement la portion à consommer, jamais deux fois.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assistant IA en bas de l'onglet Aliments */}
      <AIRecipeGenerator />
    </div>
  );
}

/**
 * Icône pour le tab — exposée pour que NutritionPage puisse l'utiliser sans réimporter lucide.
 */
export { Apple as FoodGuideIcon };
