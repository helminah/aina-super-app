import { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useBaby } from '@/contexts/BabyContext';
import { recipes } from '@/data/recipes';
import type { AiRecipeEntry } from '@/types/child';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, CalendarDays, ShoppingCart, Filter, X, Plus, Trash2, Clock, Flame, Apple, Sparkles, Share2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useGlassNotification } from '@/components/GlassNotification';
import { FoodGuide } from '@/components/nutrition/FoodGuide';
import { AIRecipeGenerator } from '@/components/nutrition/AIRecipeGenerator';
import { foodAgeGroups, type FoodAgeGroup } from '@/data/food-guide';
import { getLocalizedField } from '@/lib/i18n-data';

// Tranches d'âge pour les recettes (même structure que FoodGuide)
const RECIPE_AGE_GROUPS: FoodAgeGroup[] = [
  { label: { fr: '6-9 mois', en: '6-9 months', mg: '6-9 volana', wo: '6-9 weer' }, minMonths: 6,  maxMonths: 9,  emoji: '🥣', description: { fr: 'Premières purées', en: 'First purees', mg: 'Voalohany', wo: 'Njëkk' } },
  { label: { fr: '9-12 mois', en: '9-12 months', mg: '9-12 volana', wo: '9-12 weer' }, minMonths: 9,  maxMonths: 12, emoji: '🍽️', description: { fr: 'Textures et morceaux', en: 'Textures and chunks', mg: 'Endrika sy potikely', wo: 'Xeex ak xaajam' } },
  { label: { fr: '12-24 mois', en: '12-24 months', mg: '12-24 volana', wo: '12-24 weer' }, minMonths: 12, maxMonths: 25, emoji: '👨‍👩‍👧', description: { fr: 'Repas en famille', en: 'Family meals', mg: 'Sakafo fianakaviana', wo: 'Lekk njaboot' } },
];
import { useTranslation } from 'react-i18next';
import { tl } from '@/lib/i18n-data';

// Shape affichable commune entre recettes statiques et AI.
type DisplayRecipe = {
  id: number;
  title: string;
  emoji: string;
  time: number;
  kcal?: number;
  age: number;
  category?: string;
  iron?: boolean;
  protein?: boolean;
  isAi: boolean;
};

function ageFromRange(ageRange: string, fallback: number): number {
  const m = ageRange.match(/\d+/);
  return m ? Number(m[0]) : fallback;
}

function aiToDisplay(a: AiRecipeEntry): DisplayRecipe {
  return {
    id: a.id,
    title: a.title,
    emoji: a.emoji || '✨',
    time: a.prepMinutes,
    kcal: a.kcal,
    age: ageFromRange(a.ageRange, a.babyAgeMonths || 6),
    category: a.category,
    iron: false,
    protein: false,
    isAi: true,
  };
}

function staticToDisplay(r: typeof recipes[0]): DisplayRecipe {
  return {
    id: r.id,
    title: tl(r.title),
    emoji: r.emoji,
    time: r.time,
    kcal: r.kcal,
    age: r.age,
    category: r.category,
    iron: r.iron,
    protein: r.protein,
    isAi: false,
  };
}

type NutritionView = 'recipes' | 'foods' | 'favorites' | 'planner' | 'shopping';

const AGES = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const CATEGORY_IDS = [
  { id: 'petit-dejeuner', emoji: '🌅' },
  { id: 'dejeuner', emoji: '🍽️' },
  { id: 'gouter', emoji: '🍪' },
  { id: 'diner', emoji: '🌙' },
  { id: 'dessert', emoji: '🍨' },
] as const;
const DAY_IDS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const MEAL_IDS = ['petit_dejeuner', 'dejeuner', 'gouter', 'diner'] as const;

const AGE_COLORS: Record<number, string> = {
  6:  '#6B9E78', // sage green
  7:  '#7BA7BC', // slate blue
  8:  '#C4856A', // warm terracotta
  9:  '#9B7BB5', // dusty lavender
  10: '#5B98A8', // teal
  11: '#B07B9E', // dusty mauve
  12: '#7A9E7E', // muted sage
  13: '#C48A5A', // warm sienna
  14: '#6B8BB5', // periwinkle
  15: '#8BA860', // olive green
  16: '#A07BAF', // soft violet
  17: '#5B8E9E', // ocean blue
  18: '#B08860', // warm camel
};

export function NutritionPage() {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite, favorites, mealPlan, setMealSlot, clearMealPlan, shoppingChecked, toggleShoppingItem, clearShoppingChecked, aiRecipes, removeAiRecipe, profile } = useBaby();
  const ageMonths = profile ? Math.floor((Date.now() - new Date(profile.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)) : 12;
  const navigate = useNavigate();
  const [view, setView] = useState<NutritionView>('recipes');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAgeGroup, setFilterAgeGroup] = useState<FoodAgeGroup | null>(() => {
    const babyAge = profile ? Math.floor((Date.now() - new Date(profile.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)) : 0;
    // Trouve la tranche qui correspond à l'âge du bébé (>=6m seulement)
    return babyAge >= 6 ? (RECIPE_AGE_GROUPS.find(g => babyAge >= g.minMonths && babyAge < g.maxMonths) ?? RECIPE_AGE_GROUPS[RECIPE_AGE_GROUPS.length - 1]) : null;
  });
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<string | null>(null);
  const [expandedAiId, setExpandedAiId] = useState<number | null>(null);
  const [showRecipesAnyway, setShowRecipesAnyway] = useState(false);
  const [showAutoFillDialog, setShowAutoFillDialog] = useState(false);
  const [showAIRecipe, setShowAIRecipe] = useState(false);
  const seenTabs = useRef<Set<string>>(new Set(JSON.parse(localStorage.getItem('aina_seen_tabs') || '[]')));
  const { show: showGlass, node: glassNode } = useGlassNotification();
  const tabHints: Record<string, string> = {
    foods:     t('nutrition.hint_foods'),
    favorites: t('nutrition.hint_favorites'),
    planner:   t('nutrition.hint_planner'),
    shopping:  t('nutrition.hint_shopping'),
  };
  const [normalizedList, setNormalizedList] = useState<{name:string;qty:string;emoji:string}[]|null>(null);
  const [normalizingList, setNormalizingList] = useState(false);
  const [planDay, setPlanDay] = useState<typeof DAY_IDS[number]>(DAY_IDS[0]);

  // Merge AI + static recipes dans la grille (AI d'abord — plus frais).
  const allRecipes: DisplayRecipe[] = useMemo(() => {
    const aiDisplay = aiRecipes.map(aiToDisplay);
    const staticDisplay = recipes.map(staticToDisplay);
    return [...aiDisplay, ...staticDisplay];
  }, [aiRecipes]);

  // Lookup unifié pour planner et shopping.
  const findRecipeForMealPlan = (id: number): DisplayRecipe | null => {
    const ai = aiRecipes.find(a => a.id === id);
    if (ai) return aiToDisplay(ai);
    const s = recipes.find(r => r.id === id);
    if (s) return staticToDisplay(s);
    return null;
  };

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    let result = allRecipes;
    if (filterAgeGroup) result = result.filter(r => r.age >= filterAgeGroup.minMonths && r.age < filterAgeGroup.maxMonths);
    if (filterCategory) result = result.filter(r => r.category === filterCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => {
        if (r.title.toLowerCase().includes(q)) return true;
        if (!r.isAi) {
          const staticR = recipes.find(x => x.id === r.id);
          if (staticR?.ingredients.some(i => tl(i.name).toLowerCase().includes(q))) return true;
        } else {
          const aiR = aiRecipes.find(x => x.id === r.id);
          if (aiR?.ingredients.some(i => i.name.toLowerCase().includes(q))) return true;
        }
        return false;
      });
    }
    return result;
  }, [allRecipes, filterAgeGroup, filterCategory, searchQuery, aiRecipes]);

  const favoriteRecipes = useMemo(() => {
    const staticFavs = recipes.filter(r => favorites.includes(r.id)).map(staticToDisplay);
    const aiFavs = aiRecipes.filter(a => favorites.includes(a.id)).map(aiToDisplay);
    return [...aiFavs, ...staticFavs];
  }, [favorites, aiRecipes]);

  // Shopping list generation (statique + AI)
  // Ingrédients exclus de la liste de courses
  const EXCLUDED_WORDS = ['lait', 'milk', 'ronono', 'meew', 'infantile', 'maternel', 'allaitement', 'eau'];
  const isExcluded = (name: string) => {
    const n = name.toLowerCase().trim();
    return EXCLUDED_WORDS.some(w => n === w || n.startsWith(w + ' ') || n.includes(' ' + w));
  };
  // Normalise le nom avant insertion — regroupe les variantes
  const normalizeName = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('oeuf') || n.includes('œuf')) return '🥚 Œuf';
    return name;
  };

  const shoppingList = useMemo(() => {
    const ingredientMap = new Map<string, { qty: string; emoji: string; count: number; unit: string }>();

    const addIngredient = (rawName: string, qty: string, emoji: string) => {
      if (isExcluded(rawName)) return;
      const name = normalizeName(rawName);
      const existing = ingredientMap.get(name);
      // Extrait la valeur numérique et l'unité de la quantité (ex: "200 g" → 200, "g")
      const match = qty.match(/^([\d.,]+)\s*(.*)$/);
      const num = match ? parseFloat(match[1].replace(',', '.')) : null;
      const unit = match ? match[2].trim() : '';
      if (existing) {
        if (num !== null && existing.unit === unit) {
          // Additionne les quantités si même unité
          const prevMatch = existing.qty.match(/^([\d.,]+)/);
          const prevNum = prevMatch ? parseFloat(prevMatch[1].replace(',', '.')) : 0;
          existing.qty = `${Math.round((prevNum + num) * 10) / 10} ${unit}`.trim();
        } else {
          existing.count += 1;
          existing.qty = existing.count > 1 ? `${qty} x${existing.count}` : qty;
        }
      } else {
        ingredientMap.set(name, { qty, emoji, count: 1, unit });
      }
    };

    Object.values(mealPlan).forEach(recipeId => {
      if (recipeId === undefined) return;
      const staticR = recipes.find(r => r.id === recipeId);
      if (staticR) {
        staticR.ingredients.forEach(ing => addIngredient(tl(ing.name), ing.qty, ing.emoji));
        return;
      }
      const aiR = aiRecipes.find(r => r.id === recipeId);
      if (aiR) {
        aiR.ingredients.forEach(ing => addIngredient(ing.name, ing.qty, '✨'));
      }
    });

    return Array.from(ingredientMap.entries()).map(([name, data]) => ({
      name,
      qty: data.qty,
      emoji: data.emoji,
    }));
  }, [mealPlan, aiRecipes]);

  const RecipeCard = ({ recipe }: { recipe: DisplayRecipe }) => {
    const activate = () => {
      if (pickerSlot) { selectRecipeForSlot(recipe.id); return; }
      if (recipe.isAi) { setExpandedAiId(expandedAiId === recipe.id ? null : recipe.id); return; }
      navigate(`/recipe/${recipe.id}`);
    };
    return (
      <div className="relative bg-ivory-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer">
        <div
          role="button"
          tabIndex={0}
          onClick={activate}
          onKeyDown={e => e.key === 'Enter' && activate()}
          className="text-left w-full"
        >
          <div
            className="w-full aspect-[4/3] flex items-center justify-center text-5xl"
            style={{ background: `linear-gradient(135deg, ${AGE_COLORS[recipe.age] ?? '#888'}15, ${AGE_COLORS[recipe.age] ?? '#888'}08)` }}
          >
            {recipe.emoji}
          </div>
          <div className="p-3">
            <p className="font-heading font-bold text-sm text-bark-800 leading-tight line-clamp-2">{recipe.title}</p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-bark-500">
              <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{recipe.time}min</span>
              {typeof recipe.kcal === 'number' && (
                <span className="flex items-center gap-0.5"><Flame className="w-3 h-3" />{recipe.kcal}kcal</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white" style={{ backgroundColor: AGE_COLORS[recipe.age] ?? '#888' }}>{recipe.age}m</span>
              {recipe.iron && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-terra-50 text-terra-500 font-medium">{t('nutrition.badge_iron')}</span>}
              {recipe.protein && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-500 font-medium">{t('nutrition.badge_protein')}</span>}
              {recipe.isAi && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> {t('nutrition.badge_ai')}
                </span>
              )}
            </div>
          </div>
        </div>
        {!pickerSlot && (
          <button
            aria-label={isFavorite(recipe.id) ? t('nutrition.remove_favorite') : t('nutrition.add_favorite')}
            onClick={e => { e.stopPropagation(); toggleFavorite(recipe.id); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
          >
            <Heart className={`w-4 h-4 ${isFavorite(recipe.id) ? 'fill-red-400 text-red-400' : 'text-bark-400'}`} />
          </button>
        )}
      </div>
    );
  };

  const selectRecipeForSlot = (recipeId: number) => {
    if (pickerSlot) {
      setMealSlot(pickerSlot, recipeId);
      setPickerSlot(null);
    }
  };

  return (
    <div className="pb-24 safe-top min-h-full">
      {/* Hero corail/ambre — Nutrition (chaleur du repas) */}
      <div className="relative mesh-amber grain overflow-hidden pt-10 pb-14 px-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 hero-text"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/95 font-semibold">{t('nutrition.hero_kicker')}</p>
          <h1 className="font-display font-semibold text-white text-6xl leading-[0.95] mt-1.5">
            {t('nutrition.title')}
          </h1>
          <p className="text-white/95 text-sm mt-2.5 font-medium tracking-wide">{t('nutrition.hero_tagline')}</p>
        </motion.div>
      </div>

      <div className="px-5 -mt-6 relative z-10">
      {/* Sub-navigation glass */}
      <div className="flex gap-2 mb-5 p-1.5 glass-card rounded-2xl overflow-x-auto no-scrollbar">
        {([
          { id: 'recipes' as const, labelKey: 'nutrition.tabs.recipes', icon: Search },
          { id: 'foods' as const, labelKey: 'nutrition.tabs.foods', icon: Apple },
          { id: 'favorites' as const, labelKey: 'nutrition.tabs.favorites', icon: Heart },
          { id: 'planner' as const, labelKey: 'nutrition.tabs.planner', icon: CalendarDays },
          { id: 'shopping' as const, labelKey: 'nutrition.tabs.shopping', icon: ShoppingCart },
        ]).map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setView(tab.id); setPickerSlot(null);
                if (!seenTabs.current.has(tab.id) && tabHints[tab.id]) {
                  showGlass(tabHints[tab.id]);
                  seenTabs.current.add(tab.id);
                  localStorage.setItem('aina_seen_tabs', JSON.stringify([...seenTabs.current]));
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-1 justify-center ${
                view === tab.id ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'text-bark-500'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* FOODS VIEW */}
      {view === 'foods' && !pickerSlot && (
        ageMonths < 6 ? (
          <div className="rounded-2xl overflow-hidden elev-2">
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 px-5 pt-5 pb-5">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
                <span className="text-xl">🍼</span>
              </div>
              <p className="font-heading font-bold text-white text-base mb-1">{t('nutrition.age_guard_food_title')}</p>
              <p className="text-white/90 text-sm leading-relaxed">{t('nutrition.age_guard_food_body', { name: profile?.name, months: ageMonths, remaining: 6 - ageMonths })}</p>
            </div>
            <div className="bg-white p-4 space-y-1.5">
              {['age_guard_food_rule1','age_guard_food_rule2','age_guard_food_rule3'].map((k, i) => (
                <p key={k} className={`text-xs flex items-center gap-2 ${i === 2 ? 'text-forest-600 font-semibold' : 'text-bark-500'}`}>
                  <span>{i === 2 ? '✅' : '❌'}</span>{t(`nutrition.${k}`)}
                </p>
              ))}
              <p className="text-[10px] text-bark-400 mt-2 italic">Source : Organisation Mondiale de la Santé (OMS)</p>
            </div>
          </div>
        ) : <FoodGuide />
      )}

      {/* RECIPES VIEW */}
      {(view === 'recipes' || pickerSlot) && (
        <div>
          {/* Surcouche lait maternel < 6 mois */}
          {ageMonths < 6 && !pickerSlot && !showRecipesAnyway ? (
            <div className="rounded-2xl overflow-hidden elev-2 mb-4">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 px-5 pt-5 pb-5">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <span className="text-xl">🍼</span>
                </div>
                <p className="font-heading font-bold text-white text-base mb-1">{t('nutrition.age_guard_food_title')}</p>
                <p className="text-white/90 text-sm leading-relaxed">{t('nutrition.age_guard_food_body', { name: profile?.name, months: ageMonths, remaining: 6 - ageMonths })}</p>
              </div>
              <div className="bg-white p-4 flex flex-col items-center gap-3">
                <p className="text-[10px] text-bark-400 text-center italic">Source : OMS</p>
                <button onClick={() => setShowRecipesAnyway(true)}
                  className="w-full py-3 rounded-full bg-amber-500 text-white font-heading font-bold text-sm shadow-md shadow-amber-500/30">
                  {t('ai_recipe.milk_only_preview')}
                </button>
                <button onClick={() => setShowRecipesAnyway(true)} className="text-xs text-bark-400 underline">
                  {t('ai_recipe.milk_only_anyway')}
                </button>
              </div>
            </div>
          ) : ageMonths < 6 && !pickerSlot ? (
            <div className="mb-3 rounded-xl bg-sky-50 border border-sky-100 px-3 py-2 flex items-center gap-2">
              <span>🤱</span>
              <p className="text-[11px] text-sky-700 font-medium flex-1">{t('ai_recipe.milk_only_title')} — mode préparation</p>
              <button onClick={() => setShowRecipesAnyway(false)} className="text-[10px] text-sky-500 underline">Masquer</button>
            </div>
          ) : null}
          {/* Search — visible seulement si >= 6 mois OU showRecipesAnyway */}
          {(ageMonths >= 6 || showRecipesAnyway || pickerSlot) && <div>
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('nutrition.search_placeholder')}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-ivory-50 text-bark-800 focus:outline-none focus:ring-2 focus:ring-forest-300"
            />
          </div>

          {/* Tranches d'âge — même style que FoodGuide */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2 pb-1">
            <button
              onClick={() => setFilterAgeGroup(null)}
              className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${!filterAgeGroup ? 'bg-bark-800 text-white' : 'bg-ivory-100 text-bark-500'}`}
            >
              {t('nutrition.filter_all')}
            </button>
            {RECIPE_AGE_GROUPS.map(g => {
              const isBabyGroup = ageMonths >= g.minMonths && ageMonths < g.maxMonths;
              const isSelected = filterAgeGroup?.label.fr === g.label.fr;
              return (
                <button
                  key={g.label.fr}
                  onClick={() => setFilterAgeGroup(isSelected ? null : g)}
                  className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' :
                    isBabyGroup ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-400' :
                    'bg-ivory-100 text-bark-500'
                  }`}
                >
                  {g.emoji} {getLocalizedField(g.label)}{isBabyGroup ? ' ⭐' : ''}
                </button>
              );
            })}
          </div>

          {/* Category chips — toujours visibles */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3 pb-1">
            {CATEGORY_IDS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(filterCategory === cat.id ? null : cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${filterCategory === cat.id ? 'bg-amber-500 text-white shadow-sm' : 'bg-ivory-100 text-bark-500'}`}
              >
                {cat.emoji} {t(`nutrition.categories.${cat.id}`)}
              </button>
            ))}
          </div>

          {/* Recipe grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredRecipes.map(r => (
              <div key={r.id} className="relative col-span-1">
                <RecipeCard recipe={r} />
              </div>
            ))}
          </div>
          {/* Détail recette IA expandée */}
          {expandedAiId && (() => {
            const aiR = aiRecipes.find(a => a.id === expandedAiId);
            if (!aiR) return null;
            return (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-4 elev-2 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-heading font-bold text-bark-800">{aiR.title}</p>
                  <button onClick={() => setExpandedAiId(null)} className="w-6 h-6 rounded-full bg-ivory-100 flex items-center justify-center"><X className="w-3 h-3 text-bark-400" /></button>
                </div>
                <div className="flex gap-2 text-xs text-bark-500">
                  <span><Clock className="w-3 h-3 inline" /> {aiR.prepMinutes} min</span>
                  <span>{aiR.texture}</span>
                  <span>{aiR.ageRange}</span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-bark-500 uppercase tracking-wider mb-1">{t('ai_recipe.ingredients_title')}</p>
                  <ul className="space-y-0.5">
                    {aiR.ingredients.map((ing, i) => (
                      <li key={i} className="text-xs text-bark-700 flex gap-2"><span className="text-bark-400">·</span><span><b>{ing.qty}</b> {ing.name}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-bark-500 uppercase tracking-wider mb-1">{t('ai_recipe.preparation_title')}</p>
                  <ol className="space-y-1">
                    {aiR.steps.map((step, i) => (
                      <li key={i} className="text-xs text-bark-700 flex gap-2"><span className="font-bold text-amber-500">{i + 1}.</span>{step}</li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                  <p className="text-xs text-emerald-700 leading-relaxed">{aiR.nutritionNotes}</p>
                </div>
              </motion.div>
            );
          })()}
          {filteredRecipes.length === 0 && (
            <p className="text-center text-bark-500 py-10">{t('nutrition.no_recipes')}</p>
          )}

          {/* Bouton flottant IA Recette */}
          {!pickerSlot && ageMonths >= 6 && (
            <button
              onClick={() => setShowAIRecipe(true)}
              className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/30"
            >
              <Sparkles className="w-4 h-4" /> {t('ai_recipe.kicker')}
            </button>
          )}
          </div>}
        </div>
      )}

      {/* FAVORITES VIEW */}
      {view === 'favorites' && !pickerSlot && (
        <div className="space-y-6">
          {favoriteRecipes.length === 0 && aiRecipes.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-ivory-400 mx-auto mb-3" />
              <p className="text-bark-500 font-medium">{t('nutrition.no_favorites')}</p>
              <p className="text-sm text-bark-400 mt-1">{t('nutrition.no_favorites_hint')}</p>
            </div>
          ) : (
            <>
              {favoriteRecipes.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {favoriteRecipes.map(r => (
                    <div key={r.id} className="relative"><RecipeCard recipe={r} /></div>
                  ))}
                </div>
              )}

              {/* Toutes les recettes IA sauvegardées (même non-favorites) */}
              {aiRecipes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <p className="text-xs font-semibold text-bark-600 uppercase tracking-[0.15em]">{t('nutrition.all_ai_recipes')}</p>
                  </div>
                  <div className="space-y-3">
                    {aiRecipes.map(r => (
                      <div key={r.id} className="bg-ivory-50 rounded-2xl p-4 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0 text-xl">
                          {r.emoji || '✨'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-bold text-sm text-bark-800 leading-tight">{r.title}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-bark-500">
                            <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{r.prepMinutes}min</span>
                            <span>{r.texture}</span>
                            <span>{r.ageRange}</span>
                          </div>
                          <p className="text-xs text-bark-400 mt-1 line-clamp-2">{r.nutritionNotes}</p>
                        </div>
                        <button
                          aria-label={t('nutrition.delete_aria')}
                          onClick={() => removeAiRecipe(r.id)}
                          className="w-7 h-7 rounded-full bg-ivory-100 flex items-center justify-center flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-bark-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* PLANNER & SHOPPING : bloqué < 4 mois avec message explicatif */}
      {(view === 'planner' || view === 'shopping') && ageMonths < 4 && !pickerSlot && (
        <div className="rounded-2xl overflow-hidden elev-2">
          <div className="bg-gradient-to-br from-slate-500 to-slate-700 px-5 pt-5 pb-5">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <p className="font-heading font-bold text-white text-base mb-1">{t('nutrition.age_guard_planner_title')}</p>
            <p className="text-white/90 text-sm leading-relaxed">{t('nutrition.age_guard_planner_body', { name: profile?.name, months: ageMonths, remaining: 4 - ageMonths })}</p>
          </div>
          <div className="bg-white p-4 space-y-1.5">
            {['age_guard_food_rule1','age_guard_food_rule2','age_guard_food_rule3'].map((k, i) => (
              <p key={k} className={`text-xs flex items-center gap-2 ${i === 2 ? 'text-forest-600 font-semibold' : 'text-bark-500'}`}>
                <span>{i === 2 ? '✅' : '❌'}</span>{t(`nutrition.${k}`)}
              </p>
            ))}
            <p className="text-[10px] text-bark-400 mt-2 italic">Source : Organisation Mondiale de la Santé (OMS)</p>
          </div>
        </div>
      )}

      {/* PLANNER VIEW */}
      {view === 'planner' && !pickerSlot && ageMonths >= 4 && (
        <div>
          {/* Auto-fill — popup chaleureux */}
          <div className="mb-4 rounded-2xl bg-amber-50 border border-amber-100 p-4">
            <p className="text-sm font-heading font-bold text-bark-800 mb-1">{t('ai_recipe.autofill_title')}</p>
            <p className="text-xs text-bark-500 mb-3">{t('ai_recipe.autofill_body')}</p>
            <div className="flex gap-2">
              {[1, 3, 7].map(days => (
                <button
                  key={days}
                  onClick={() => {
                    const ageAppropriate = recipes.filter(r => r.age <= Math.max(ageMonths, 6));
                    const pool = ageAppropriate.length > 0 ? ageAppropriate : recipes;
                    const shuffled = [...pool].sort(() => Math.random() - 0.5);
                    let idx = 0;
                    DAY_IDS.slice(0, days).forEach(day => {
                      MEAL_IDS.forEach(mealId => {
                        setMealSlot(`${day}_${mealId}`, shuffled[idx % shuffled.length].id);
                        idx++;
                      });
                    });
                    setPlanDay(DAY_IDS[0]);
                    toast.success(`Menu ${days === 1 ? '1 jour' : `${days} jours`} généré !`, { description: 'Tu peux modifier chaque repas 😊' });
                  }}
                  className="flex-1 py-2 rounded-full bg-amber-500 text-white text-xs font-bold shadow-sm"
                >
                  {days === 1 ? '1 jour' : `${days} jours`}
                </button>
              ))}
            </div>
          </div>
          {/* Day selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
            {DAY_IDS.map(day => {
              const dayLabel = t(`journal.days.${day}`);
              return (
                <button key={day} onClick={() => setPlanDay(day)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${planDay === day ? 'bg-bark-800 text-white' : 'bg-ivory-50 text-bark-500'}`}>
                  {dayLabel.slice(0, 3)}
                </button>
              );
            })}
          </div>

          {/* Meal slots */}
          <div className="space-y-3">
            {MEAL_IDS.map(mealId => {
              const key = `${planDay}_${mealId}`;
              const recipeId = mealPlan[key];
              const recipe = recipeId !== undefined ? findRecipeForMealPlan(recipeId) : null;
              return (
                <div key={mealId} className="bg-ivory-50 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-bark-600 mb-2">{t(`nutrition.meals.${mealId}`)}</p>
                  {recipe ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{recipe.emoji}</span>
                      <div className="flex-1">
                        <p className="font-heading font-bold text-sm text-bark-800 flex items-center gap-1.5">
                          {recipe.title}
                          {recipe.isAi && <Sparkles className="w-3 h-3 text-amber-500" />}
                        </p>
                        <p className="text-xs text-bark-500">
                          {recipe.time}min{typeof recipe.kcal === 'number' ? ` · ${recipe.kcal}kcal` : ''}
                        </p>
                      </div>
                      <button onClick={() => setMealSlot(key, undefined)} className="w-8 h-8 rounded-full bg-ivory-100 flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-bark-400" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setPickerSlot(key); setView('recipes'); }}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-ivory-400 text-ivory-500 text-sm font-medium flex items-center justify-center gap-1">
                      <Plus className="w-4 h-4" /> {t('nutrition.choose_recipe')}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={() => { setView('shopping'); }} className="flex-1 py-3 rounded-full bg-forest-600 text-white font-bold flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" /> {t('nutrition.shopping_list')}
            </button>
            <button onClick={clearMealPlan} className="px-4 py-3 rounded-full bg-ivory-200 text-bark-500 font-medium text-sm">{t('nutrition.clear')}</button>
          </div>
        </div>
      )}

      {/* SHOPPING VIEW */}
      {view === 'shopping' && !pickerSlot && ageMonths >= 4 && (
        <div>
          {shoppingList.length > 0 && !normalizedList && (
            <button
              onClick={async () => {
                setNormalizingList(true);
                try {
                  const resp = await fetch('/api/normalize-shopping', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: shoppingList }),
                  });
                  const data = await resp.json();
                  if (data.items?.length) setNormalizedList(data.items);
                } catch { /* fallback silencieux */ }
                setNormalizingList(false);
              }}
              disabled={normalizingList}
              className="w-full mb-3 py-2.5 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {normalizingList ? '✨ AINA adapte ta liste...' : '✨ Adapter pour le marché avec AINA'}
            </button>
          )}
          {normalizedList && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-violet-600 font-semibold">✨ Liste adaptée par AINA</span>
              <button onClick={() => setNormalizedList(null)} className="text-[10px] text-bark-400 underline">Voir originale</button>
            </div>
          )}
          {shoppingList.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 text-ivory-400 mx-auto mb-3" />
              <p className="text-bark-500 font-medium">{t('nutrition.empty_shopping')}</p>
              <p className="text-sm text-bark-400 mt-1">{t('nutrition.empty_shopping_hint')}</p>
            </div>
          ) : (
            <>
              {(() => {
                const CATS = [
                  { label:'Légumes', emoji:'🥕', keys:['carotte','patate','courgette','courge','épinard','brocoli','chou','pois','oignon','ail','poireau','aubergine','poivron','tomate','concombre','salade','navet','betterave','igname','taro','gombo','manioc','feuille'] },
                  { label:'Fruits', emoji:'🍎', keys:['banane','mangue','pomme','poire','prune','pêche','abricot','orange','citron','lime','fraise','ananas','papaye','avocat','kiwi','figue','datte','pastèque','melon','raisin','goyave','fruit'] },
                  { label:'Céréales', emoji:'🌾', keys:['mil','fonio','riz','quinoa','semoule','farine','maïs','avoine','blé','pain','pâte','céréale','bouillie','polenta'] },
                  { label:'Protéines', emoji:'🍗', keys:['poulet','poisson','viande','œuf','lentille','pois chiche','thon','sardine','saumon','bœuf','agneau','dinde','crevette','soja','arachide','cajou','haricot'] },
                  { label:'Huiles', emoji:'🫒', keys:['huile','beurre','margarine','ghee','palme','sésame'] },
                  { label:'Épices', emoji:'🌿', keys:['sel','poivre','cumin','gingembre','cannelle','coriandre','curcuma','vanille','noix','herbe','épice','bouillon'] },
                ];
                const items = normalizedList ?? shoppingList;
                const used = new Set<string>();
                const groups: { label:string; emoji:string; items:typeof items }[] = [];
                for (const cat of CATS) {
                  const matched = items.filter(item => !used.has(item.name) && cat.keys.some(k => item.name.toLowerCase().includes(k)));
                  if (matched.length) { matched.forEach(i => used.add(i.name)); groups.push({ ...cat, items: matched }); }
                }
                const rest = items.filter(i => !used.has(i.name));
                if (rest.length) groups.push({ label:'Autres', emoji:'🛒', items: rest });
                return (
                  <div className="space-y-4">
                    {groups.map(group => (
                      <div key={group.label}>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-bark-500 mb-1.5 flex items-center gap-1.5">
                          <span>{group.emoji}</span>{group.label}
                        </p>
                        <div className="space-y-1.5">
                          {group.items.map(item => (
                            <button key={item.name} onClick={() => toggleShoppingItem(item.name)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${shoppingChecked.includes(item.name) ? 'bg-forest-50 opacity-60' : 'bg-ivory-50'}`}>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${shoppingChecked.includes(item.name) ? 'bg-forest-600 border-forest-600' : 'border-ivory-400'}`}>
                                {shoppingChecked.includes(item.name) && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                              </div>
                              <span className="text-lg">{item.emoji}</span>
                              <div className="flex-1 text-left">
                                <p className={`text-sm font-medium ${shoppingChecked.includes(item.name) ? 'line-through text-bark-400' : 'text-bark-800'}`}>{item.name}</p>
                                <p className="text-xs text-bark-500">{item.qty}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
              <div className="flex gap-2 mt-5">
                <button onClick={clearShoppingChecked} className="py-3 px-4 rounded-full bg-ivory-200 text-bark-500 font-medium text-sm flex-shrink-0">{t('nutrition.uncheck_all')}</button>
                <button
                  onClick={async () => {
                    const lines = (normalizedList ?? shoppingList).map(item => `${item.emoji} ${item.name} — ${item.qty}`).join('\n');
                    const text = `🛒 Ma liste de courses AINA\n${'─'.repeat(28)}\n\n${lines}\n\n🌿 Généré par AINA`;
                    if (navigator.share) { try { await navigator.share({ title: 'Ma liste de courses AINA', text }); } catch { /* annulé */ } }
                    else { await navigator.clipboard.writeText(text); toast.success('Liste copiée !'); }
                  }}
                  className="flex-1 py-3 rounded-full bg-forest-600 text-white font-bold text-sm flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" /> Partager
                </button>
                <button
                  onClick={() => {
                    const CATS: { label: string; emoji: string; keys: string[] }[] = [
                      { label: 'Légumes',          emoji: '🥕', keys: ['carotte','patate','courgette','courge','épinard','brocoli','chou','haricot vert','pois','oignon','ail','poireau','aubergine','poivron','tomate','concombre','salade','navet','betterave','fenouil','igname','taro','gombo','manioc','feuille'] },
                      { label: 'Fruits',           emoji: '🍎', keys: ['banane','mangue','pomme','poire','prune','pêche','abricot','orange','citron','lime','fraise','ananas','papaye','avocat','kiwi','figue','datte','pastèque','melon','raisin','goyave','fruit'] },
                      { label: 'Céréales & féculents', emoji: '🌾', keys: ['mil','fonio','riz','quinoa','semoule','farine','maïs','avoine','orge','blé','pain','pâte','macaroni','céréale','bouillie','polenta','galette'] },
                      { label: 'Protéines',        emoji: '🍗', keys: ['poulet','poisson','viande','œuf','lentille','pois chiche','thon','sardine','saumon','bœuf','agneau','dinde','crevette','haricot blanc','haricot rouge','soja','arachide','noix de cajou'] },
                      { label: 'Huiles & matières grasses', emoji: '🫒', keys: ['huile','beurre','margarine','ghee','palme','sésame'] },
                      { label: 'Épices & condiments', emoji: '🌿', keys: ['sel','poivre','cumin','gingembre','cannelle','coriandre','curcuma','vanille','noix','herbe','épice','bouillon','sucre','miel'] },
                    ];
                    const items = normalizedList ?? shoppingList;
                    const used = new Set<number>();
                    const sorted: { label: string; emoji: string; items: typeof items }[] = [];
                    for (const cat of CATS) {
                      const matched = items.filter((item, i) => {
                        if (used.has(i)) return false;
                        const n = item.name.toLowerCase();
                        return cat.keys.some(k => n.includes(k));
                      });
                      if (matched.length) {
                        matched.forEach(item => used.add(items.indexOf(item)));
                        sorted.push({ ...cat, items: matched });
                      }
                    }
                    const rest = items.filter((_, i) => !used.has(i));
                    if (rest.length) sorted.push({ label: 'Autres', emoji: '🛒', items: rest });

                    const lines = [`🛒 Courses — ${profile?.name ?? 'Bébé'}`, '─'.repeat(28), ''];
                    for (const cat of sorted) {
                      lines.push(`${cat.emoji} ${cat.label.toUpperCase()}`);
                      for (const item of cat.items) lines.push(`  • ${item.name} — ${item.qty}`);
                      lines.push('');
                    }
                    lines.push('🌿 AINA · aina-super-app.vercel.app');
                    const text = lines.join('\n');
                    if (navigator.share) { navigator.share({ title: 'Courses AINA', text }).catch(() => {}); }
                    else { navigator.clipboard.writeText(text); toast.success('Liste triée copiée !'); }
                  }}
                  className="flex-shrink-0 py-3 px-4 rounded-full bg-violet-500 text-white font-bold text-sm flex items-center justify-center gap-1.5"
                >
                  ✨ Trier
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Picker mode banner */}
      {pickerSlot && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-bark-800 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-3 z-40">
          <span className="text-sm">{t('nutrition.picker_prompt')}</span>
          <button onClick={() => setPickerSlot(null)} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><X className="w-3 h-3" /></button>
        </div>
      )}
      </div>
      {glassNode}

      {/* Sheet popup AIRecipeGenerator */}
      {createPortal(
        <AnimatePresence>
          {showAIRecipe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40 flex items-end justify-center"
              onClick={() => setShowAIRecipe(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                className="w-full max-w-[480px] max-h-[90dvh] overflow-y-auto rounded-t-3xl bg-ivory-100"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-end p-3 pb-0">
                  <button onClick={() => setShowAIRecipe(false)} className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                    <X className="w-4 h-4 text-bark-600" />
                  </button>
                </div>
                <div className="px-2 pb-8">
                  <AIRecipeGenerator />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
