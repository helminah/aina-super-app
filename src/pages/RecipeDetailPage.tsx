import { useParams, useNavigate } from 'react-router-dom';
import { recipes } from '@/data/recipes';
import { useBaby } from '@/contexts/BabyContext';
import { ArrowLeft, Heart, Clock, Flame, AlertTriangle, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { tl } from '@/lib/i18n-data';

/** Affiche un badge FR si le champ n'est pas traduit dans la langue courante */
function LocalizedText({ value, className }: { value: string | { fr: string; en?: string; mg?: string; wo?: string }; className?: string }) {
  const { i18n } = useTranslation();
  const isPlainString = typeof value === 'string';
  const hasTranslation = !isPlainString && Boolean((value as Record<string, string>)[i18n.language.slice(0, 2)]);
  const text = String(tl(value as Parameters<typeof tl>[0]) ?? '');
  return (
    <span className={className}>
      {text}
      {(isPlainString || !hasTranslation) && i18n.language !== 'fr' && (
        <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-ivory-200 text-bark-400 font-semibold align-middle">FR</span>
      )}
    </span>
  );
}

const AGE_COLORS: Record<number, string> = {
  6: '#3c6931', 7: '#42A5F5', 8: '#FF9800', 9: '#E91E63',
  10: '#9C27B0', 11: '#00897B', 12: '#D32F2F',
};

export function RecipeDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useBaby();

  const recipe = recipes.find(r => r.id === Number(id));
  if (!recipe) return <div className="p-6">{t('recipe_detail.not_found')}</div>;

  const color = AGE_COLORS[recipe.age] || '#3c6931';

  return (
    <div className="min-h-[100dvh] bg-ivory-100 safe-top safe-bottom">
      {/* Hero */}
      <div className="relative h-56 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}20, ${color}08)` }}>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-10 h-10 rounded-full glass flex items-center justify-center z-10">
          <ArrowLeft className="w-5 h-5 text-bark-800" />
        </button>
        <button onClick={() => toggleFavorite(recipe.id)} className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center z-10">
          <Heart className={`w-5 h-5 ${isFavorite(recipe.id) ? 'fill-red-400 text-red-400' : 'text-bark-500'}`} />
        </button>
        <span className="text-7xl">{recipe.emoji}</span>
      </div>

      {/* Content */}
      <div className="px-5 -mt-6 relative z-10">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-ivory-50 rounded-2xl p-5 shadow-sm">
          <h1 className="font-heading text-xl font-bold text-bark-800">{tl(recipe.title)}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-full text-white font-semibold" style={{ backgroundColor: color }}>{recipe.age} {t('recipe_detail.months_suffix')}</span>
            <span className="flex items-center gap-1 text-xs text-bark-500"><Clock className="w-3 h-3" />{recipe.time} min</span>
            <span className="flex items-center gap-1 text-xs text-bark-500"><Flame className="w-3 h-3" />{recipe.kcal} kcal</span>
            <span className="text-xs text-bark-500">{recipe.texture}</span>
          </div>
          {recipe.allergens.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <AlertTriangle className="w-3.5 h-3.5 text-terra-400" />
              <span className="text-xs text-terra-500 font-medium">{t('recipe_detail.allergens_label', { list: recipe.allergens.join(', ') })}</span>
            </div>
          )}
        </motion.div>

        {/* Ingredients */}
        <div className="mt-5">
          <h2 className="font-heading font-bold text-bark-800 mb-3">{t('recipe_detail.ingredients_title')}</h2>
          <div className="bg-ivory-50 rounded-2xl p-4 space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ivory-100 flex items-center justify-center text-lg">{ing.emoji}</div>
                <span className="flex-1 text-sm text-bark-800 font-medium">{tl(ing.name)}</span>
                <span className="text-sm text-bark-500">{ing.qty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="mt-5">
          <h2 className="font-heading font-bold text-bark-800 mb-3">{t('recipe_detail.preparation_title')}</h2>
          <div className="space-y-4">
            {recipe.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ backgroundColor: color }}>{i + 1}</div>
                  {i < recipe.steps.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: `${color}30` }} />}
                </div>
                <div className="pb-4">
                  <p className="font-heading font-bold text-sm text-bark-800">{tl(step.t)}</p>
                  <LocalizedText value={step.d} className="text-sm text-bark-500 mt-0.5" />
                  <span className="text-xs text-bark-400 mt-1 inline-block">{step.min} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why */}
        <div className="mt-5 bg-forest-50 rounded-2xl p-4">
          <h3 className="font-heading font-bold text-forest-700 text-sm mb-1">{t('recipe_detail.why_title')}</h3>
          <LocalizedText value={recipe.why} className="text-sm text-forest-600 leading-relaxed" />
        </div>

        {/* Doctor advice */}
        <div className="mt-4 bg-terra-50 rounded-2xl p-4 mb-8">
          <h3 className="font-heading font-bold text-terra-600 text-sm mb-1 flex items-center gap-1.5"><ChefHat className="w-4 h-4" /> {t('recipe_detail.doctor_advice_title')}</h3>
          <LocalizedText value={recipe.conseil} className="text-sm text-terra-500 leading-relaxed" />
        </div>

        {/* Nutrition table */}
        <div className="mb-8">
          <h2 className="font-heading font-bold text-bark-800 mb-3">{t('recipe_detail.nutrition_title')}</h2>
          <div className="bg-ivory-50 rounded-2xl p-4 grid grid-cols-2 gap-3">
            {Object.entries(recipe.nutrition).map(([key, val]) => (
              <div key={key} className="text-center">
                <p className="text-xs text-bark-500">{t(`recipe_detail.nutrition_labels.${key}`)}</p>
                <p className="font-heading font-bold text-bark-800 text-sm">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
