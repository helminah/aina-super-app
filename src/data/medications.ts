// Catalogue des présentations pharmaceutiques pédiatriques
// Afrique francophone + France

export type MedicationFormType = "syrup" | "suppository";

export interface SyrupForm {
  id: string;
  name: string;
  type: "syrup";
  mgPerMl: number;
  emoji: string;
}

export interface SuppositoryForm {
  id: string;
  name: string;
  type: "suppository";
  emoji: string;
  sizes: { mg: number; weightRange: string }[];
}

export type MedicationForm = SyrupForm | SuppositoryForm;

export const PARACETAMOL_FORMS: MedicationForm[] = [
  { id: "doliprane_24", name: "Doliprane sirop 2.4%", type: "syrup", mgPerMl: 24, emoji: "🧴" },
  { id: "efferalgan_30", name: "Efferalgan sirop 3%", type: "syrup", mgPerMl: 30, emoji: "🧴" },
  { id: "dafalgan_30", name: "Dafalgan sirop 3%", type: "syrup", mgPerMl: 30, emoji: "🧴" },
  {
    id: "suppo",
    name: "Suppositoire",
    type: "suppository",
    emoji: "💊",
    sizes: [
      { mg: 100, weightRange: "4–6 kg" },
      { mg: 150, weightRange: "6–10 kg" },
      { mg: 200, weightRange: "10–13 kg" },
      { mg: 300, weightRange: "13–20 kg" },
    ],
  },
];

export const IBUPROFEN_FORMS: MedicationForm[] = [
  { id: "advil_20", name: "Advil sirop", type: "syrup", mgPerMl: 20, emoji: "🧴" },
  { id: "nureflex_20", name: "Nureflex sirop", type: "syrup", mgPerMl: 20, emoji: "🧴" },
];

export const MEDICATION_FORMS: Record<string, MedicationForm[]> = {
  paracetamol: PARACETAMOL_FORMS,
  ibuprofen: IBUPROFEN_FORMS,
};

export const DOSE_PER_KG: Record<string, number> = {
  paracetamol: 15,
  ibuprofen: 10,
};

export const MAX_DAILY_DOSE_MG_PER_KG: Record<string, number> = {
  paracetamol: 60,
  ibuprofen: 30,
};

export const MIN_INTERVAL_HOURS: Record<string, number> = {
  paracetamol: 6,
  ibuprofen: 8,
};

/** Arrondi au 0.5 ml le plus proche (précision seringue doseuse) */
export function computeSyrupDose(doseMg: number, mgPerMl: number): number {
  const raw = doseMg / mgPerMl;
  return Math.round(raw * 2) / 2;
}

/** Trouve le suppositoire adapté (taille juste en dessous ou égale à la dose) */
export function findBestSuppository(
  doseMg: number,
  sizes: { mg: number; weightRange: string }[]
): { mg: number; weightRange: string } | null {
  const sorted = [...sizes].sort((a, b) => b.mg - a.mg);
  return sorted.find((s) => s.mg <= doseMg) ?? sorted[sorted.length - 1] ?? null;
}

/** Calcule la dose pratique pour une forme donnée */
export function getPracticalDose(
  doseMg: number,
  form: MedicationForm
): { label: string; detail: string } {
  if (form.type === "syrup") {
    const ml = computeSyrupDose(doseMg, form.mgPerMl);
    return {
      label: `${ml} ml`,
      detail: form.name,
    };
  }
  // suppository
  const best = findBestSuppository(doseMg, form.sizes);
  if (!best) return { label: "—", detail: "" };
  return {
    label: `1 suppo de ${best.mg} mg`,
    detail: best.weightRange,
  };
}

/** Trouve une forme par son ID dans le catalogue d'un médicament */
export function getFormById(medication: string, formId: string): MedicationForm | undefined {
  return MEDICATION_FORMS[medication]?.find((f) => f.id === formId);
}
