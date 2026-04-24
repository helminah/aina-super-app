import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ChildProfile, WeightEntry, HeightEntry, HeadCircEntry, VaccineRecord, DailyLogEntry, MilestoneRecord, MealPlan } from '@/types/child';
import { vaccines as allVaccines } from '@/data/vaccines';
import { safeGet, safeSet } from '@/lib/storage';
import { generateId } from '@/lib/utils';

interface BabyContextType {
  // Multi-baby management
  babies: ChildProfile[];
  activeBabyId: string | null;
  switchBaby: (id: string) => void;
  addBaby: (p: ChildProfile) => void;
  removeBaby: (id: string) => void;

  // Active baby profile
  profile: ChildProfile | null;
  setProfile: (p: ChildProfile) => void;
  updateProfile: (updates: Partial<ChildProfile>) => void;
  clearProfile: () => void;

  weightEntries: WeightEntry[];
  addWeight: (entry: WeightEntry) => void;
  removeWeight: (date: string) => void;
  heightEntries: HeightEntry[];
  addHeight: (entry: HeightEntry) => void;
  removeHeight: (date: string) => void;
  hcEntries: HeadCircEntry[];
  addHc: (entry: HeadCircEntry) => void;

  vaccineRecords: VaccineRecord[];
  toggleVaccine: (vaccineId: string) => void;
  isVaccineDone: (vaccineId: string) => boolean;

  dailyLogs: DailyLogEntry[];
  addLog: (log: Omit<DailyLogEntry, 'id' | 'createdAt'>) => void;
  removeLog: (id: string) => void;
  getLogsForDate: (date: string) => DailyLogEntry[];

  milestoneRecords: MilestoneRecord[];
  toggleMilestone: (milestoneId: string) => void;
  isMilestoneDone: (milestoneId: string) => boolean;

  mealPlan: MealPlan;
  setMealSlot: (key: string, recipeId: number | undefined) => void;
  clearMealPlan: () => void;

  favorites: number[];
  toggleFavorite: (recipeId: number) => void;
  isFavorite: (recipeId: number) => boolean;

  shoppingChecked: string[];
  toggleShoppingItem: (item: string) => void;
  clearShoppingChecked: () => void;

  checkVaccineReminders: () => { vaccineName: string; dueDate: Date; status: 'overdue' | 'soon' }[];
}

const BabyContext = createContext<BabyContextType | null>(null);

// Helper: per-baby storage keys
function bk(babyId: string, key: string) {
  return `aina-${babyId}-${key}`;
}

export function BabyProvider({ children }: { children: ReactNode }) {
  // Global state: list of babies and active baby ID
  const [babies, setBabies] = useState<ChildProfile[]>(() => {
    // Migration: if old single-profile exists, convert it
    const oldProfile = safeGet<ChildProfile | null>('aina-profile', null);
    const existing = safeGet<ChildProfile[]>('aina-babies', []);
    if (existing.length > 0) return existing;
    if (oldProfile) {
      // Migrate old data to new per-baby keys
      const id = oldProfile.id;
      const keys = ['weights', 'heights', 'hc', 'vaccines', 'logs', 'milestones', 'mealplan', 'favorites', 'shopping-checked'];
      keys.forEach(k => {
        const oldVal = safeGet(`aina-${k}`, null);
        if (oldVal !== null) {
          safeSet(bk(id, k), oldVal);
          localStorage.removeItem(`aina-${k}`);
        }
      });
      localStorage.removeItem('aina-profile');
      return [oldProfile];
    }
    return [];
  });

  const [activeBabyId, setActiveBabyId] = useState<string | null>(() => {
    const saved = safeGet<string | null>('aina-active-baby', null);
    if (saved) return saved;
    const oldProfile = safeGet<ChildProfile | null>('aina-profile', null);
    const existing = safeGet<ChildProfile[]>('aina-babies', []);
    if (existing.length > 0) return existing[0].id;
    if (oldProfile) return oldProfile.id;
    return null;
  });

  // Derive active profile
  const profile = babies.find(b => b.id === activeBabyId) || null;
  const bid = activeBabyId || '__none__';

  // Per-baby data
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => safeGet(bk(bid, 'weights'), []));
  const [heightEntries, setHeightEntries] = useState<HeightEntry[]>(() => safeGet(bk(bid, 'heights'), []));
  const [hcEntries, setHcEntries] = useState<HeadCircEntry[]>(() => safeGet(bk(bid, 'hc'), []));
  const [vaccineRecords, setVaccineRecords] = useState<VaccineRecord[]>(() => safeGet(bk(bid, 'vaccines'), []));
  const [dailyLogs, setDailyLogs] = useState<DailyLogEntry[]>(() => safeGet(bk(bid, 'logs'), []));
  const [milestoneRecords, setMilestoneRecords] = useState<MilestoneRecord[]>(() => safeGet(bk(bid, 'milestones'), []));
  const [mealPlan, setMealPlan] = useState<MealPlan>(() => safeGet(bk(bid, 'mealplan'), {}));
  const [favorites, setFavorites] = useState<number[]>(() => safeGet(bk(bid, 'favorites'), []));
  const [shoppingChecked, setShoppingChecked] = useState<string[]>(() => safeGet(bk(bid, 'shopping-checked'), []));

  // Persist global state
  useEffect(() => { safeSet('aina-babies', babies); }, [babies]);
  useEffect(() => { safeSet('aina-active-baby', activeBabyId); }, [activeBabyId]);

  // Persist per-baby data
  useEffect(() => { if (activeBabyId) safeSet(bk(activeBabyId, 'weights'), weightEntries); }, [weightEntries, activeBabyId]);
  useEffect(() => { if (activeBabyId) safeSet(bk(activeBabyId, 'heights'), heightEntries); }, [heightEntries, activeBabyId]);
  useEffect(() => { if (activeBabyId) safeSet(bk(activeBabyId, 'hc'), hcEntries); }, [hcEntries, activeBabyId]);
  useEffect(() => { if (activeBabyId) safeSet(bk(activeBabyId, 'vaccines'), vaccineRecords); }, [vaccineRecords, activeBabyId]);
  useEffect(() => { if (activeBabyId) safeSet(bk(activeBabyId, 'logs'), dailyLogs); }, [dailyLogs, activeBabyId]);
  useEffect(() => { if (activeBabyId) safeSet(bk(activeBabyId, 'milestones'), milestoneRecords); }, [milestoneRecords, activeBabyId]);
  useEffect(() => { if (activeBabyId) safeSet(bk(activeBabyId, 'mealplan'), mealPlan); }, [mealPlan, activeBabyId]);
  useEffect(() => { if (activeBabyId) safeSet(bk(activeBabyId, 'favorites'), favorites); }, [favorites, activeBabyId]);
  useEffect(() => { if (activeBabyId) safeSet(bk(activeBabyId, 'shopping-checked'), shoppingChecked); }, [shoppingChecked, activeBabyId]);

  // Load baby data when switching
  const loadBabyData = useCallback((id: string) => {
    setWeightEntries(safeGet(bk(id, 'weights'), []));
    setHeightEntries(safeGet(bk(id, 'heights'), []));
    setHcEntries(safeGet(bk(id, 'hc'), []));
    setVaccineRecords(safeGet(bk(id, 'vaccines'), []));
    setDailyLogs(safeGet(bk(id, 'logs'), []));
    setMilestoneRecords(safeGet(bk(id, 'milestones'), []));
    setMealPlan(safeGet(bk(id, 'mealplan'), {}));
    setFavorites(safeGet(bk(id, 'favorites'), []));
    setShoppingChecked(safeGet(bk(id, 'shopping-checked'), []));
  }, []);

  const switchBaby = (id: string) => {
    if (id === activeBabyId) return;
    setActiveBabyId(id);
    loadBabyData(id);
  };

  const addBaby = (p: ChildProfile) => {
    setBabies(prev => {
      // Prevent duplicates
      if (prev.some(b => b.id === p.id)) return prev;
      return [...prev, p];
    });
    setActiveBabyId(p.id);
    loadBabyData(p.id);
  };

  const removeBaby = (id: string) => {
    // Clean up per-baby storage
    const keys = ['weights', 'heights', 'hc', 'vaccines', 'logs', 'milestones', 'mealplan', 'favorites', 'shopping-checked'];
    keys.forEach(k => localStorage.removeItem(bk(id, k)));

    setBabies(prev => {
      const next = prev.filter(b => b.id !== id);
      if (activeBabyId === id) {
        const newActive = next.length > 0 ? next[0].id : null;
        setActiveBabyId(newActive);
        if (newActive) loadBabyData(newActive);
      }
      return next;
    });
  };

  // Legacy: setProfile used during onboarding to create first baby
  const setProfile = (p: ChildProfile) => {
    const exists = babies.find(b => b.id === p.id);
    if (exists) {
      setBabies(prev => prev.map(b => b.id === p.id ? p : b));
    } else {
      addBaby(p);
    }
  };

  const updateProfile = (updates: Partial<ChildProfile>) => {
    if (!activeBabyId) return;
    setBabies(prev => prev.map(b => b.id === activeBabyId ? { ...b, ...updates } : b));
  };

  const clearProfile = () => {
    if (!activeBabyId) return;
    removeBaby(activeBabyId);
  };

  const addWeight = (entry: WeightEntry) => setWeightEntries(prev => [...prev, entry].sort((a, b) => a.date.localeCompare(b.date)));
  const removeWeight = (date: string) => setWeightEntries(prev => prev.filter(e => e.date !== date));
  const addHeight = (entry: HeightEntry) => setHeightEntries(prev => [...prev, entry].sort((a, b) => a.date.localeCompare(b.date)));
  const removeHeight = (date: string) => setHeightEntries(prev => prev.filter(e => e.date !== date));
  const addHc = (entry: HeadCircEntry) => setHcEntries(prev => [...prev, entry].sort((a, b) => a.date.localeCompare(b.date)));

  const toggleVaccine = (vaccineId: string) => {
    setVaccineRecords(prev => {
      const exists = prev.find(v => v.vaccineId === vaccineId);
      if (exists) return prev.filter(v => v.vaccineId !== vaccineId);
      return [...prev, { vaccineId, doneDate: new Date().toISOString().split('T')[0] }];
    });
  };
  const isVaccineDone = (vaccineId: string) => vaccineRecords.some(v => v.vaccineId === vaccineId);

  const addLog = (log: Omit<DailyLogEntry, 'id' | 'createdAt'>) => {
    const entry: DailyLogEntry = { ...log, id: generateId(), createdAt: new Date().toISOString() };
    setDailyLogs(prev => [entry, ...prev]);
  };
  const removeLog = (id: string) => setDailyLogs(prev => prev.filter(l => l.id !== id));
  const getLogsForDate = (date: string) => dailyLogs.filter(l => l.date === date).sort((a, b) => b.time.localeCompare(a.time));

  const toggleMilestone = (milestoneId: string) => {
    setMilestoneRecords(prev => {
      const exists = prev.find(m => m.milestoneId === milestoneId);
      if (exists) return prev.filter(m => m.milestoneId !== milestoneId);
      return [...prev, { milestoneId, achievedDate: new Date().toISOString().split('T')[0] }];
    });
  };
  const isMilestoneDone = (milestoneId: string) => milestoneRecords.some(m => m.milestoneId === milestoneId);

  const setMealSlot = (key: string, recipeId: number | undefined) => {
    setMealPlan(prev => {
      const next = { ...prev };
      if (recipeId === undefined) { delete next[key]; } else { next[key] = recipeId; }
      return next;
    });
  };
  const clearMealPlan = () => setMealPlan({});

  const toggleFavorite = (recipeId: number) => {
    setFavorites(prev => prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]);
  };
  const isFavorite = (recipeId: number) => favorites.includes(recipeId);

  const toggleShoppingItem = (item: string) => {
    setShoppingChecked(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };
  const clearShoppingChecked = () => setShoppingChecked([]);

  const checkVaccineReminders = (): { vaccineName: string; dueDate: Date; status: 'overdue' | 'soon' }[] => {
    if (!profile) return [];
    const countryVaccines = allVaccines.filter(v => v.country.includes(profile.country));
    const birthDate = new Date(profile.birthDate);
    const now = new Date();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    return countryVaccines
      .filter(v => !isVaccineDone(v.id))
      .map(v => {
        const dueDate = new Date(birthDate);
        dueDate.setMonth(dueDate.getMonth() + v.ageMonths);
        const diff = dueDate.getTime() - now.getTime();
        if (diff < 0) return { vaccineName: v.name, dueDate, status: 'overdue' as const };
        if (diff <= sevenDaysMs) return { vaccineName: v.name, dueDate, status: 'soon' as const };
        return null;
      })
      .filter((r): r is { vaccineName: string; dueDate: Date; status: 'overdue' | 'soon' } => r !== null);
  };

  return (
    <BabyContext.Provider value={{
      babies, activeBabyId, switchBaby, addBaby, removeBaby,
      profile, setProfile, updateProfile, clearProfile,
      weightEntries, addWeight, removeWeight,
      heightEntries, addHeight, removeHeight,
      hcEntries, addHc,
      vaccineRecords, toggleVaccine, isVaccineDone,
      dailyLogs, addLog, removeLog, getLogsForDate,
      milestoneRecords, toggleMilestone, isMilestoneDone,
      mealPlan, setMealSlot, clearMealPlan,
      favorites, toggleFavorite, isFavorite,
      shoppingChecked, toggleShoppingItem, clearShoppingChecked,
      checkVaccineReminders,
    }}>
      {children}
    </BabyContext.Provider>
  );
}

export function useBaby() {
  const ctx = useContext(BabyContext);
  if (!ctx) throw new Error('useBaby must be used within BabyProvider');
  return ctx;
}
