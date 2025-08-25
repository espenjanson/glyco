export type GlucoseUnit = "mg/dL" | "mmol/L";

export interface GlucoseReading {
  id: string;
  value: number;
  unit: GlucoseUnit;
  timestamp: Date;
  notes?: string;
  tags?: string[];
  context?:
    | "fasting"
    | "before-meal"
    | "after-meal"
    | "bedtime"
    | "exercise"
    | "sick";
}

export interface InsulinShot {
  id: string;
  type: "rapid" | "long-acting" | "intermediate";
  units: number;
  timestamp: Date;
  notes?: string;
  injectionSite?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  weight: number; // in grams
  carbsPer100g: number; // carbs per 100 grams
  totalCarbs: number; // calculated: (weight / 100) * carbsPer100g
}

export interface UserFood {
  id: string;
  name: string;
  carbsPer100g: number;
  lastUsed: Date;
  useCount: number;
}

export interface FoodEntry {
  id: string;
  foods: FoodItem[];
  totalCarbs: number;
  mealType?: "breakfast" | "lunch" | "dinner" | "eveningSnack";
  timestamp: Date;
  notes?: string;
  insulinCalculation?: {
    mealInsulin: number;
    correctionInsulin: number;
    totalInsulin: number;
    currentGlucose?: number;
  };
}

export interface CarbEntry {
  id: string;
  carbs: number;
  food: string;
  timestamp: Date;
  notes?: string;
}

export interface PatientInfo {
  name: string;
  height: number; // cm
  weight: number; // kg
  dateOfBirth: string; // ISO date string
}

export interface BasalInsulin {
  medicationType: string;
  unitsPerDose: number;
  frequency: "once" | "twice"; // once or twice daily
  timing: string; // HH:MM format for once daily
  timingMorning?: string; // HH:MM format for twice daily morning dose
  timingEvening?: string; // HH:MM format for twice daily evening dose
}

export interface MealInsulin {
  medicationType: string;
  carbRatios: {
    breakfast: number; // units per carb amount
    lunch: number;
    dinner: number;
    eveningSnack: number;
  };
}

export interface CorrectionInsulin {
  correctionFactor: number; // how much 1 unit lowers glucose
  targetGlucoseMin: number;
  targetGlucoseMax: number;
}

export interface GlucoseTargets {
  fasting: { min: number; max: number };
  beforeMeals: { min: number; max: number };
  afterMeals: { min: number; max: number };
  bedtime: { min: number; max: number };
}

export interface AdministrationInstructions {
  dosingInstructions: string;
  specialNotes: string;
  timingGuidelines: string;
}

export interface MedicalSettings {
  patientInfo: PatientInfo;
  basalInsulin: BasalInsulin;
  mealInsulin: MealInsulin;
  correctionInsulin: CorrectionInsulin;
  glucoseTargets: GlucoseTargets;
  administrationInstructions: AdministrationInstructions;
}

export interface UserSettings {
  glucoseUnit: GlucoseUnit;
  targetRangeLow: number;
  targetRangeHigh: number;
  reminderTimes: string[];
  remindersEnabled: boolean;
  medicalSettings?: MedicalSettings;
}

export interface DashboardStats {
  averageGlucose: number;
  totalInsulinToday: number;
  shotsToday: number;
  inRangePercentage: number;
  lastReading?: GlucoseReading;
  lastInsulin?: InsulinShot;
}

export interface SettingsHistoryEntry {
  id: string;
  section: string;
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
}
