import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ChildProfile, WeightEntry, HeightEntry, HeadCircEntry, VaccineRecord, DailyLogEntry, MilestoneRecord, MealPlan } from '@/types/child';
import { safeGet, safeSet } from '@/lib/storage';
import { generateId } from '@/lib/utils';

interface BabyContextType {
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
}

const BabyContext = createContext<BabyContextType | null>(null);

export function BabyProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<ChildProfile | null>(() => safeGet('aina-profile', null));
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => safeGet('aina-weights', []));
  const [heightEntries, setHeightEntries] = useState<HeightEntry[]>(() => safeGet('aina-heights', []));
  const [hcEntries, setHcEntries] = useState<HeadCircEntry[]>(() => safeGet('aina-hc', []));
  const [vaccineRecords, setVaccineRecords] = useState<VaccineRecord[]>(() => safeGet('aina-vaccines', []));
  const [dailyLogs, setDailyLogs] = useState<DailyLogEntry[]>(() => safeGet('aina-logs', []));
  const [milestoneRecords, setMilestoneRecords] = useState<MilestoneRecord[]>(() => safeGet('aina-milestones', []));
  const [mealPlan, setMealPlan] = useState<MealPlan>(() => safeGet('aina-mealplan', {}));
  const [favorites, setFavorites] = useState<number[]>(() => safeGet('aina-favorites', []));
  const [shoppingChecked, setShoppingChecked] = useState<string[]>(() => safeGet('aina-shopping-checked', []));

  // Persist everything on change
  useEffect(() => { safeSet('aina-profile', profile); }, [profile]);
  useEffect(() => { safeSet('aina-weights', weightEntries); }, [weightEntries]);
  useEffect(() => { safeSet('aina-heights', heightEntries); }, [heightEntries]);
  useEffect(() => { safeSet('aina-hc', hcEntries); }, [hcEntries]);
  useEffect(() => { safeSet('aina-vaccines', vaccineRecords); }, [vaccineRecords]);
  useEffect(() => { safeSet('aina-logs', dailyLogs); }, [dailyLogs]);
  useEffect(() => { safeSet('aina-milestones', milestoneRecords); }, [milestoneRecords]);
  useEffect(() => { safeSet('aina-mealplan', mealPlan); }, [mealPlan]);
  useEffect(() => { safeSet('aina-favorites', favorites); }, [favorites]);
  useEffect(() => { safeSet('aina-shopping-checked', shoppingChecked); }, [shoppingChecked]);

  const setProfile = (p: ChildProfile) => setProfileState(p);
  const updateProfile = (updates: Partial<ChildProfile>) => {
    setProfileState(prev => prev ? { ...prev, ...updates } : null);
  };
  const clearProfile = () => {
    setProfileState(null);
    localStorage.clear();
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

  return (
    <BabyContext.Provider value={{
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
