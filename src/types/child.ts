export type Country = 'senegal' | 'france' | 'madagascar';
export type Sex = 'boy' | 'girl';

export interface ChildProfile {
  id: string;
  name: string;
  birthDate: string;
  sex: Sex;
  birthWeight: number;
  birthHeight: number;
  country: Country;
  completedVaccines: string[];
  createdAt: string;
}

export interface WeightEntry { date: string; weight: number; }
export interface HeightEntry { date: string; height: number; }
export interface HeadCircEntry { date: string; circumference: number; }

export interface VaccineRecord { vaccineId: string; doneDate: string; }

export type LogType = 'feed' | 'sleep' | 'diaper' | 'mood';

export interface FeedDetails { feedType: 'breast' | 'bottle' | 'solid'; side?: 'left' | 'right' | 'both'; quantity?: number; description?: string; }
export interface SleepDetails { duration: number; quality?: 'good' | 'average' | 'poor'; }
export interface DiaperDetails { diaperType: 'pee' | 'poop' | 'mixed'; color?: string; }
export interface MoodDetails { emoji: string; }

export type LogDetails = FeedDetails | SleepDetails | DiaperDetails | MoodDetails;

export interface DailyLogEntry {
  id: string;
  date: string;
  type: LogType;
  time: string;
  details: LogDetails;
  createdAt: string;
}

export interface MilestoneRecord { milestoneId: string; achievedDate: string; }

export interface Recipe {
  id: number;
  title: string;
  age: number;
  time: number;
  kcal: number;
  emoji: string;
  category: string;
  texture: string;
  allergens: string[];
  iron: boolean;
  protein: boolean;
  ingredients: { name: string; qty: string; emoji: string }[];
  steps: { t: string; d: string; min: number }[];
  why: string;
  conseil: string;
  nutrition: {
    energie: string;
    proteines: string;
    lipides: string;
    glucides: string;
    vitA: string;
    fer: string;
  };
}

export interface MealPlan {
  [key: string]: number | undefined; // "Monday_dejeuner" -> recipeId
}
