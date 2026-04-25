import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBaby } from '@/contexts/BabyContext';
import { safeSet } from '@/lib/storage';
import { pushBabies, pullBabies, pushBabyStore, pullAllBabyStores } from '@/lib/supabase-sync';

/**
 * Pont silencieux entre AuthContext et BabyContext pour la sync Supabase.
 * - Au login : pull depuis Supabase si localStorage est vide, puis reinitialize.
 * - À chaque changement : push vers Supabase en arrière-plan (debounce 1s).
 * - Ne bloque jamais l'UI : localStorage reste la source de vérité locale.
 */
export function SupabaseSyncBridge() {
  const { user, isGuest } = useAuth();
  const {
    babies, activeBabyId,
    weightEntries, heightEntries, hcEntries,
    vaccineRecords, dailyLogs, milestoneRecords,
    teethRecords, doseRecords, appointments,
    mealPlan, favorites, shoppingChecked, aiRecipes,
    reinitialize,
  } = useBaby();

  const initialPullDone = useRef(false);

  // Pull Supabase → localStorage au premier login (nouveau device / browser vide)
  useEffect(() => {
    if (!user || isGuest || initialPullDone.current) return;
    initialPullDone.current = true;

    (async () => {
      const result = await pullBabies(user.id);
      if (!result || result.babies.length === 0) return;
      if (babies.length > 0) return; // localStorage déjà rempli → on garde les données locales

      safeSet('aina-babies', result.babies);
      safeSet('aina-active-baby', result.activeBabyId);

      const firstBabyId = result.activeBabyId ?? result.babies[0]?.id;
      if (firstBabyId) {
        const stores = await pullAllBabyStores(user.id, firstBabyId);
        Object.entries(stores).forEach(([key, val]) => {
          safeSet(`aina-${firstBabyId}-${key}`, val);
        });
      }

      reinitialize();
    })();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Push babies list (debounced 1s)
  useEffect(() => {
    if (!user || isGuest || babies.length === 0) return;
    const t = setTimeout(() => pushBabies(user.id, babies, activeBabyId), 1000);
    return () => clearTimeout(t);
  }, [user?.id, babies, activeBabyId]);

  // Push tous les stores du bébé actif (debounced 1s)
  useEffect(() => {
    if (!user || isGuest || !activeBabyId) return;
    const t = setTimeout(() => {
      const id = activeBabyId;
      pushBabyStore(user.id, id, 'weights', weightEntries);
      pushBabyStore(user.id, id, 'heights', heightEntries);
      pushBabyStore(user.id, id, 'hc', hcEntries);
      pushBabyStore(user.id, id, 'vaccines', vaccineRecords);
      pushBabyStore(user.id, id, 'logs', dailyLogs);
      pushBabyStore(user.id, id, 'milestones', milestoneRecords);
      pushBabyStore(user.id, id, 'teeth', teethRecords);
      pushBabyStore(user.id, id, 'doses', doseRecords);
      pushBabyStore(user.id, id, 'appointments', appointments);
      pushBabyStore(user.id, id, 'mealplan', mealPlan);
      pushBabyStore(user.id, id, 'favorites', favorites);
      pushBabyStore(user.id, id, 'shopping-checked', shoppingChecked);
      pushBabyStore(user.id, id, 'ai-recipes', aiRecipes);
    }, 1000);
    return () => clearTimeout(t);
  }, [
    user?.id, activeBabyId,
    weightEntries, heightEntries, hcEntries, vaccineRecords, dailyLogs,
    milestoneRecords, teethRecords, doseRecords, appointments,
    mealPlan, favorites, shoppingChecked, aiRecipes,
  ]);

  return null;
}
