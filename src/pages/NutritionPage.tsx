import { useState, useMemo } from 'react';
import { useBaby } from '@/contexts/BabyContext';
import { recipes } from '@/data/recipes';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, CalendarDays, ShoppingCart, Filter, X, ChevronRight, Plus, Trash2, Share2, Clock, Flame } from 'lucide-react';

type NutritionView = 'recipes' | 'favorites' | 'planner' | 'shopping';

const AGES = [6, 7, 8, 9, 10, 11, 12];
const CATEGORIES = [
  { id: 'dejeuner', label: 'Déjeuner', emoji: '🍽️' },
  { id: 'gouter', label: 'Goûter', emoji: '🍪' },
  { id: 'dessert', label: 'Dessert', emoji: '🍨' },
];
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const MEALS = [
  { id: 'petit_dejeuner', label: 'Petit-déj' },
  { id: 'dejeuner', label: 'Déjeuner' },
  { id: 'gouter', label: 'Goûter' },
  { id: 'diner', label: 'Dîner' },
];

const AGE_COLORS: Record<number, string> = {
  6: '#3c6931', 7: '#42A5F5', 8: '#FF9800', 9: '#E91E63',
  10: '#9C27B0', 11: '#00897B', 12: '#D32F2F',
};

export function NutritionPage() {
  const { isFavorite, toggleFavorite, favorites, mealPlan, setMealSlot, clearMealPlan, shoppingChecked, toggleShoppingItem, clearShoppingChecked } = useBaby();
  const navigate = useNavigate();
  const [view, setView] = useState<NutritionView>('recipes');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAge, setFilterAge] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<string | null>(null);
  const [planDay, setPlanDay] = useState(DAYS[0]);

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    let result = recipes;
    if (filterAge) result = result.filter(r => r.age === filterAge);
    if (filterCategory) result = result.filter(r => r.category === filterCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => r.title.toLowerCase().includes(q) || r.ingredients.some(i => i.name.toLowerCase().includes(q)));
    }
    return result;
  }, [filterAge, filterCategory, searchQuery]);

  const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));

  // Shopping list generation
  const shoppingList = useMemo(() => {
    const ingredientMap = new Map<string, { qty: string; emoji: string; count: number }>();
    Object.values(mealPlan).forEach(recipeId => {
      if (recipeId === undefined) return;
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return;
      recipe.ingredients.forEach(ing => {
        const existing = ingredientMap.get(ing.name);
        if (existing) {
          existing.count += 1;
        } else {
          ingredientMap.set(ing.name, { qty: ing.qty, emoji: ing.emoji, count: 1 });
        }
      });
    });
    return Array.from(ingredientMap.entries()).map(([name, data]) => ({
      name,
      qty: data.count > 1 ? `${data.qty} x${data.count}` : data.qty,
      emoji: data.emoji,
    }));
  }, [mealPlan]);

  const RecipeCard = ({ recipe }: { recipe: typeof recipes[0] }) => (
    <button
      onClick={() => pickerSlot ? selectRecipeForSlot(recipe.id) : navigate(`/recipe/${recipe.id}`)}
      className="bg-ivory-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98] text-left w-full"
    >
      <div
        className="w-full aspect-[4/3] flex items-center justify-center text-5xl"
        style={{ background: `linear-gradient(135deg, ${AGE_COLORS[recipe.age]}15, ${AGE_COLORS[recipe.age]}08)` }}
      >
        {recipe.emoji}
      </div>
      <div className="p-3">
        <p className="font-heading font-bold text-sm text-bark-800 leading-tight line-clamp-2">{recipe.title}</p>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-bark-500">
          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{recipe.time}min</span>
          <span className="flex items-center gap-0.5"><Flame className="w-3 h-3" />{recipe.kcal}kcal</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white" style={{ backgroundColor: AGE_COLORS[recipe.age] }}>{recipe.age}m</span>
          {recipe.iron && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-terra-50 text-terra-500 font-medium">Fer</span>}
          {recipe.protein && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-500 font-medium">Protéines</span>}
        </div>
      </div>
      {!pickerSlot && (
        <button
          onClick={e => { e.stopPropagation(); toggleFavorite(recipe.id); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
        >
          <Heart className={`w-4 h-4 ${isFavorite(recipe.id) ? 'fill-red-400 text-red-400' : 'text-bark-400'}`} />
        </button>
      )}
    </button>
  );

  const selectRecipeForSlot = (recipeId: number) => {
    if (pickerSlot) {
      setMealSlot(pickerSlot, recipeId);
      setPickerSlot(null);
    }
  };

  return (
    <div className="px-5 pt-6 pb-6 safe-top">
      <h1 className="font-heading text-2xl font-bold text-bark-800 mb-4">Nutrition</h1>

      {/* Sub-navigation */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
        {([
          { id: 'recipes' as const, label: 'Recettes', icon: Search },
          { id: 'favorites' as const, label: 'Favoris', icon: Heart },
          { id: 'planner' as const, label: 'Planifier', icon: CalendarDays },
          { id: 'shopping' as const, label: 'Courses', icon: ShoppingCart },
        ]).map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setView(tab.id); setPickerSlot(null); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                view === tab.id ? 'bg-forest-600 text-white shadow-md shadow-forest-600/25' : 'bg-ivory-50 text-bark-500'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* RECIPES VIEW */}
      {(view === 'recipes' || pickerSlot) && (
        <div>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher une recette..."
              className="w-full pl-10 pr-12 py-3 rounded-full bg-ivory-50 text-bark-800 focus:outline-none focus:ring-2 focus:ring-forest-300"
            />
            <button onClick={() => setShowFilters(!showFilters)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center">
              <Filter className="w-4 h-4 text-forest-500" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-4 bg-ivory-50 rounded-2xl p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-bark-600 mb-2">Âge</p>
                <div className="flex gap-2 flex-wrap">
                  {AGES.map(age => (
                    <button key={age} onClick={() => setFilterAge(filterAge === age ? null : age)}
                      className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${filterAge === age ? 'text-white shadow-md' : 'bg-ivory-100 text-bark-500'}`}
                      style={filterAge === age ? { backgroundColor: AGE_COLORS[age] } : {}}>
                      {age}m
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-bark-600 mb-2">Type de repas</p>
                <div className="flex gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setFilterCategory(filterCategory === cat.id ? null : cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterCategory === cat.id ? 'bg-forest-600 text-white' : 'bg-ivory-100 text-bark-500'}`}>
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recipe grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredRecipes.map(r => (
              <div key={r.id} className="relative">
                <RecipeCard recipe={r} />
              </div>
            ))}
          </div>
          {filteredRecipes.length === 0 && (
            <p className="text-center text-bark-500 py-10">Aucune recette trouvée</p>
          )}
        </div>
      )}

      {/* FAVORITES VIEW */}
      {view === 'favorites' && !pickerSlot && (
        <div>
          {favoriteRecipes.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-ivory-400 mx-auto mb-3" />
              <p className="text-bark-500 font-medium">Aucun favori pour le moment</p>
              <p className="text-sm text-bark-400 mt-1">Appuyez sur le coeur pour sauvegarder vos recettes préférées.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {favoriteRecipes.map(r => (
                <div key={r.id} className="relative"><RecipeCard recipe={r} /></div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PLANNER VIEW */}
      {view === 'planner' && !pickerSlot && (
        <div>
          {/* Day selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
            {DAYS.map(day => (
              <button key={day} onClick={() => setPlanDay(day)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${planDay === day ? 'bg-bark-800 text-white' : 'bg-ivory-50 text-bark-500'}`}>
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Meal slots */}
          <div className="space-y-3">
            {MEALS.map(meal => {
              const key = `${planDay}_${meal.id}`;
              const recipeId = mealPlan[key];
              const recipe = recipeId !== undefined ? recipes.find(r => r.id === recipeId) : null;
              return (
                <div key={meal.id} className="bg-ivory-50 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-bark-600 mb-2">{meal.label}</p>
                  {recipe ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{recipe.emoji}</span>
                      <div className="flex-1">
                        <p className="font-heading font-bold text-sm text-bark-800">{recipe.title}</p>
                        <p className="text-xs text-bark-500">{recipe.time}min &middot; {recipe.kcal}kcal</p>
                      </div>
                      <button onClick={() => setMealSlot(key, undefined)} className="w-8 h-8 rounded-full bg-ivory-100 flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-bark-400" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setPickerSlot(key); setView('recipes'); }}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-ivory-400 text-ivory-500 text-sm font-medium flex items-center justify-center gap-1">
                      <Plus className="w-4 h-4" /> Choisir une recette
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={() => { setView('shopping'); }} className="flex-1 py-3 rounded-full bg-forest-600 text-white font-bold flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Liste de courses
            </button>
            <button onClick={clearMealPlan} className="px-4 py-3 rounded-full bg-ivory-200 text-bark-500 font-medium text-sm">Effacer</button>
          </div>
        </div>
      )}

      {/* SHOPPING VIEW */}
      {view === 'shopping' && !pickerSlot && (
        <div>
          {shoppingList.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 text-ivory-400 mx-auto mb-3" />
              <p className="text-bark-500 font-medium">Liste vide</p>
              <p className="text-sm text-bark-400 mt-1">Planifiez vos repas pour générer la liste de courses.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {shoppingList.map(item => (
                  <button
                    key={item.name}
                    onClick={() => toggleShoppingItem(item.name)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${shoppingChecked.includes(item.name) ? 'bg-forest-50 opacity-60' : 'bg-ivory-50'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${shoppingChecked.includes(item.name) ? 'bg-forest-600 border-forest-600' : 'border-ivory-400'}`}>
                      {shoppingChecked.includes(item.name) && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-medium ${shoppingChecked.includes(item.name) ? 'line-through text-bark-400' : 'text-bark-800'}`}>{item.name}</p>
                      <p className="text-xs text-bark-500">{item.qty}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={clearShoppingChecked} className="flex-1 py-3 rounded-full bg-ivory-200 text-bark-500 font-medium text-sm">Tout décocher</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Picker mode banner */}
      {pickerSlot && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-bark-800 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-3 z-40">
          <span className="text-sm">Choisissez une recette</span>
          <button onClick={() => setPickerSlot(null)} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><X className="w-3 h-3" /></button>
        </div>
      )}
    </div>
  );
}
