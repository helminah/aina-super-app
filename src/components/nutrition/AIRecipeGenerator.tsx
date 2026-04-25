import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, Flame, ChefHat, CalendarRange, RefreshCw, AlertCircle, BookmarkPlus, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBaby } from '@/contexts/BabyContext';
import { getAgeInMonths } from '@/lib/age-utils';
import { toast } from 'sonner';
import {
  generateRecipe,
  generateWeeklyMealPlan,
  AnthropicApiError,
  type Recipe,
  type WeeklyMealPlan,
} from '@/lib/anthropic';

type ViewMode = 'recipe' | 'plan' | null;

/**
 * AIRecipeGenerator — génération de recette ou de plan semaine par Claude.
 * - Récupère âge + pays automatiquement depuis BabyContext
 * - Loading state avec animation
 * - Affichage structuré avec le design system AINA (glassmorphism + amber/orange)
 */
export function AIRecipeGenerator() {
  const { profile, addAiRecipe } = useBaby();
  const { t } = useTranslation();

  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState<ViewMode>(null);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [plan, setPlan] = useState<WeeklyMealPlan | null>(null);
  const [savedRecipeId, setSavedRecipeId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  if (!profile) return null;
  const ageMonths = getAgeInMonths(profile.birthDate);

  // Avant 6 mois → lait maternel exclusif (OMS)
  if (ageMonths < 6 && !showPreview) {
    return (
      <div className="mt-6 rounded-2xl overflow-hidden elev-2">
        <div className="bg-gradient-to-br from-sky-400 to-blue-500 grain px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🤱</span>
            <p className="font-heading font-bold text-white text-base">{t('ai_recipe.milk_only_title')}</p>
          </div>
          <p className="text-white/90 text-sm leading-relaxed">{t('ai_recipe.milk_only_body')}</p>
        </div>
        <div className="bg-white p-4 text-center space-y-3">
          <p className="text-xs text-bark-500">
            {t('ai_recipe.milk_only_months', { name: profile.name, months: ageMonths, remaining: 6 - ageMonths })}
          </p>
          <button
            onClick={() => setShowPreview(true)}
            className="w-full py-3 rounded-full bg-amber-500 text-white font-heading font-bold text-sm shadow-md shadow-amber-500/30"
          >
            👀 {t('ai_recipe.milk_only_preview')}
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="text-xs text-bark-400 underline"
          >
            {t('ai_recipe.milk_only_anyway')}
          </button>
        </div>
      </div>
    );
  }

  const parseIngredients = (raw: string): string[] =>
    raw.split(/[,\n;]/).map(s => s.trim()).filter(Boolean);

  const handleSaveRecipe = () => {
    if (!recipe || !profile) return;
    const ageMonthsNow = getAgeInMonths(profile.birthDate);
    addAiRecipe({
      babyAgeMonths: ageMonthsNow,
      country: profile.country,
      title: recipe.title,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      nutritionNotes: recipe.nutritionNotes,
      texture: recipe.texture,
      ageRange: recipe.ageRange,
      prepMinutes: recipe.prepMinutes,
      emoji: recipe.emoji,
      category: recipe.category,
      kcal: recipe.kcal,
    });
    // Find the newly added entry (the one just pushed to aiRecipes)
    // We mark it as saved via a timestamp approximation
    setSavedRecipeId(Date.now());
    toast.success(t('ai_recipe.recipe_saved'), { description: t('ai_recipe.recipe_saved_desc') });
  };

  const handleRecipe = async () => {
    setError(null);
    setRecipe(null);
    setPlan(null);
    setSavedRecipeId(null);
    setLoading('recipe');
    try {
      const r = await generateRecipe({
        babyAgeMonths: ageMonths,
        ingredients: parseIngredients(ingredients),
        country: profile.country,
      });
      setRecipe(r);
    } catch (e) {
      setError(e instanceof AnthropicApiError ? e.message : t('ai_recipe.unexpected_error'));
    } finally {
      setLoading(null);
    }
  };

  const handlePlan = async () => {
    setError(null);
    setRecipe(null);
    setPlan(null);
    setSavedRecipeId(null);
    setLoading('plan');
    try {
      const p = await generateWeeklyMealPlan({
        babyAgeMonths: ageMonths,
        allergies: [],
        country: profile.country,
      });
      setPlan(p);
    } catch (e) {
      setError(e instanceof AnthropicApiError ? e.message : t('ai_recipe.unexpected_error'));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mt-6 rounded-2xl overflow-hidden elev-2 relative">
      {/* Bandeau "mode préparation" si bébé < 6 mois */}
      {ageMonths < 6 && (
        <div className="bg-sky-50 border-b border-sky-100 px-4 py-2 flex items-center justify-between">
          <p className="text-xs text-sky-700 font-medium">🤱 {t('ai_recipe.preview_mode_banner')}</p>
          <button onClick={() => setShowPreview(false)} className="text-[10px] text-sky-500 underline">{t('ai_recipe.preview_mode_back')}</button>
        </div>
      )}
      {/* Header aurora amber */}
      <div className="relative mesh-amber grain overflow-hidden px-5 pt-5 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 hero-text"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/90 font-semibold">
              {t('ai_recipe.kicker')}
            </p>
          </div>
          <p className="font-heading font-bold text-white text-lg mt-1">
            {t('ai_recipe.header_title', { name: profile.name })}
          </p>
          <p className="text-white/85 text-xs mt-0.5">
            {t('ai_recipe.header_subtitle', { months: ageMonths, country: profile.country })}
          </p>
        </motion.div>
      </div>

      {/* Body */}
      <div className="bg-white p-5 space-y-3">
        <div>
          <label className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold block mb-2">
            {t('ai_recipe.ingredients_label')}
          </label>
          <textarea
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            placeholder={t('ai_recipe.ingredients_placeholder')}
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-ivory-100 text-bark-800 placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm resize-none"
          />
          <p className="text-[10px] text-bark-400 mt-1">{t('ai_recipe.ingredients_hint')}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRecipe}
            disabled={loading !== null}
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-heading font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98] shadow-md shadow-amber-500/30"
          >
            {loading === 'recipe' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> {t('ai_recipe.generating')}
              </>
            ) : (
              <>
                <ChefHat className="w-4 h-4" /> {t('ai_recipe.recipe_btn')}
              </>
            )}
          </button>
          <button
            onClick={handlePlan}
            disabled={loading !== null}
            className="flex-1 py-3 rounded-full bg-white border border-amber-200 text-amber-700 font-heading font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {loading === 'plan' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> {t('ai_recipe.planning')}
              </>
            ) : (
              <>
                <CalendarRange className="w-4 h-4" /> {t('ai_recipe.plan_btn')}
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </motion.div>
        )}

        {/* Loading skeleton */}
        <AnimatePresence>
          {loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2 pt-1"
            >
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="h-3 bg-gradient-to-r from-ivory-200 via-amber-100 to-ivory-200 rounded"
                  style={{
                    width: `${100 - i * 12}%`,
                    backgroundSize: '200% 100%',
                    animation: `gradient-shift 1.6s ease-in-out infinite`,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recipe */}
        <AnimatePresence mode="wait">
          {recipe && !loading && (
            <motion.div
              key="recipe"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pt-3 space-y-4"
            >
              <div>
                <h3 className="font-heading font-bold text-bark-800 text-base">{recipe.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-bark-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.prepMinutes} min</span>
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {recipe.ageRange}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">{recipe.texture}</span>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold mb-2">{t('ai_recipe.ingredients_title')}</p>
                <ul className="space-y-1">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-bark-700">
                      <span className="w-1 h-1 rounded-full bg-amber-500" />
                      <span className="font-semibold">{ing.qty}</span>
                      <span>{ing.name}</span>
                      {ing.notes && <span className="text-xs text-bark-400">· {ing.notes}</span>}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold mb-2">{t('ai_recipe.preparation_title')}</p>
                <ol className="space-y-2">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-bark-700">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-100 p-3">
                <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-700 font-semibold">{t('ai_recipe.nutrition_title')}</p>
                <p className="text-sm text-bark-700 mt-1 leading-relaxed">{recipe.nutritionNotes}</p>
              </div>

              <button
                onClick={handleSaveRecipe}
                disabled={!!savedRecipeId}
                className="w-full py-3 rounded-full border border-amber-300 text-amber-700 font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {savedRecipeId ? (
                  <><Check className="w-4 h-4 text-emerald-500" /> {t('ai_recipe.saved')}</>
                ) : (
                  <><BookmarkPlus className="w-4 h-4" /> {t('ai_recipe.save_recipe')}</>
                )}
              </button>
            </motion.div>
          )}

          {plan && !loading && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pt-3 space-y-2"
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-bark-500 font-semibold mb-2">
                {t('ai_recipe.plan_title')}
              </p>
              {plan.days.map((d, i) => (
                <motion.div
                  key={d.day}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl bg-ivory-100 p-3"
                >
                  <p className="font-heading font-bold text-bark-800 text-sm">{d.day}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-bark-600">
                    <div><span className="text-amber-600 font-semibold">{t('ai_recipe.breakfast')}</span><br />{d.breakfast}</div>
                    <div><span className="text-amber-600 font-semibold">{t('ai_recipe.lunch')}</span><br />{d.lunch}</div>
                    <div><span className="text-amber-600 font-semibold">{t('ai_recipe.snack')}</span><br />{d.snack}</div>
                    <div><span className="text-amber-600 font-semibold">{t('ai_recipe.dinner')}</span><br />{d.dinner}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Silence le linter pour t (i18n prêt pour futures trads) */}
        <span className="hidden">{t('app.name')}</span>
      </div>
    </div>
  );
}
