import { MMKV } from "react-native-mmkv";
import {
  CarbEntry,
  FoodEntry,
  GlucoseReading,
  InsulinShot,
  MedicalSettings,
  SettingsHistoryEntry,
  UserFood,
  UserSettings,
} from "../types";

// Initialize MMKV storage
const storage = new MMKV();

const KEYS = {
  GLUCOSE_READINGS: "glucose_readings",
  INSULIN_SHOTS: "insulin_shots",
  CARB_ENTRIES: "carb_entries",
  FOOD_ENTRIES: "food_entries",
  USER_FOODS: "user_foods",
  USER_SETTINGS: "user_settings",
  MEDICAL_SETTINGS: "medical_settings",
  SETTINGS_HISTORY: "settings_history",
};

const defaultSettings: UserSettings = {
  glucoseUnit: "mmol/L",
  targetRangeLow: 0,
  targetRangeHigh: 0,
  reminderTimes: ["08:00", "12:00", "18:00"],
  remindersEnabled: true,
};

const defaultMedicalSettings: MedicalSettings = {
  patientInfo: {
    name: "",
    height: 0,
    weight: 0,
    dateOfBirth: "",
  },
  basalInsulin: {
    medicationType: "",
    unitsPerDose: 0,
    frequency: "once",
    timing: "22:00",
    timingMorning: "08:00",
    timingEvening: "22:00",
  },
  mealInsulin: {
    medicationType: "",
    carbRatios: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      eveningSnack: 0,
    },
  },
  correctionInsulin: {
    correctionFactor: 0,
    targetGlucoseMin: 0,
    targetGlucoseMax: 0,
  },
  glucoseTargets: {
    fasting: { min: 0, max: 0 },
    beforeMeals: { min: 0, max: 0 },
    afterMeals: { min: 0, max: 0 },
    bedtime: { min: 0, max: 0 },
  },
  administrationInstructions: {
    dosingInstructions: "",
    specialNotes: "",
    timingGuidelines: "",
  },
};

export const StorageService = {
  getGlucoseReadings(): GlucoseReading[] {
    try {
      const data = storage.getString(KEYS.GLUCOSE_READINGS);
      return data
        ? JSON.parse(data).map((r: any) => ({
            ...r,
            timestamp: new Date(r.timestamp),
          }))
        : [];
    } catch {
      return [];
    }
  },

  saveGlucoseReading(reading: GlucoseReading): void {
    const readings = this.getGlucoseReadings();
    const existingIndex = readings.findIndex(r => r.id === reading.id);
    if (existingIndex >= 0) {
      readings[existingIndex] = reading;
    } else {
      readings.unshift(reading);
    }
    storage.set(KEYS.GLUCOSE_READINGS, JSON.stringify(readings));
  },

  updateGlucoseReading(updatedReading: GlucoseReading): void {
    const readings = this.getGlucoseReadings();
    const index = readings.findIndex(r => r.id === updatedReading.id);
    if (index !== -1) {
      readings[index] = updatedReading;
      storage.set(KEYS.GLUCOSE_READINGS, JSON.stringify(readings));
    }
  },

  deleteGlucoseReading(id: string): void {
    const readings = this.getGlucoseReadings();
    const filtered = readings.filter(r => r.id !== id);
    storage.set(KEYS.GLUCOSE_READINGS, JSON.stringify(filtered));
  },

  getInsulinShots(): InsulinShot[] {
    try {
      const data = storage.getString(KEYS.INSULIN_SHOTS);
      return data
        ? JSON.parse(data).map((s: any) => ({
            ...s,
            timestamp: new Date(s.timestamp),
          }))
        : [];
    } catch {
      return [];
    }
  },

  saveInsulinShot(shot: InsulinShot): void {
    const shots = this.getInsulinShots();
    const existingIndex = shots.findIndex(s => s.id === shot.id);
    if (existingIndex >= 0) {
      shots[existingIndex] = shot;
    } else {
      shots.unshift(shot);
    }
    storage.set(KEYS.INSULIN_SHOTS, JSON.stringify(shots));
  },

  deleteInsulinShot(id: string): void {
    const shots = this.getInsulinShots();
    const filtered = shots.filter(s => s.id !== id);
    storage.set(KEYS.INSULIN_SHOTS, JSON.stringify(filtered));
  },

  getCarbEntries(): CarbEntry[] {
    try {
      const data = storage.getString(KEYS.CARB_ENTRIES);
      return data
        ? JSON.parse(data).map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp),
          }))
        : [];
    } catch {
      return [];
    }
  },

  saveCarbEntry(entry: CarbEntry): void {
    const entries = this.getCarbEntries();
    entries.unshift(entry);
    storage.set(KEYS.CARB_ENTRIES, JSON.stringify(entries));
  },

  getUserSettings(): UserSettings {
    try {
      const data = storage.getString(KEYS.USER_SETTINGS);
      return data
        ? { ...defaultSettings, ...JSON.parse(data) }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  saveUserSettings(settings: UserSettings): void {
    storage.set(KEYS.USER_SETTINGS, JSON.stringify(settings));
  },

  getMedicalSettings(): MedicalSettings {
    try {
      const data = storage.getString(KEYS.MEDICAL_SETTINGS);
      return data
        ? { ...defaultMedicalSettings, ...JSON.parse(data) }
        : defaultMedicalSettings;
    } catch {
      return defaultMedicalSettings;
    }
  },

  saveMedicalSettings(settings: MedicalSettings): void {
    storage.set(KEYS.MEDICAL_SETTINGS, JSON.stringify(settings));
  },

  clearUserSettings(): void {
    storage.delete(KEYS.USER_SETTINGS);
  },

  clearMedicalSettings(): void {
    storage.delete(KEYS.MEDICAL_SETTINGS);
  },

  getSettingsHistory(): SettingsHistoryEntry[] {
    try {
      const data = storage.getString(KEYS.SETTINGS_HISTORY);
      return data
        ? JSON.parse(data).map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          }))
        : [];
    } catch {
      return [];
    }
  },

  saveSettingsChange(section: string, field: string, oldValue: any, newValue: any): void {
    const history = this.getSettingsHistory();
    const entry: SettingsHistoryEntry = {
      id: Date.now().toString(),
      section,
      field,
      oldValue,
      newValue,
      timestamp: new Date(),
    };
    history.unshift(entry);
    
    // Keep only last 100 changes per section
    const sectionHistory = history.filter(h => h.section === section);
    const otherHistory = history.filter(h => h.section !== section);
    const trimmedSectionHistory = sectionHistory.slice(0, 100);
    
    storage.set(KEYS.SETTINGS_HISTORY, JSON.stringify([...trimmedSectionHistory, ...otherHistory]));
  },

  removeSettingsHistoryEntry(id: string): void {
    const history = this.getSettingsHistory();
    const filtered = history.filter(entry => entry.id !== id);
    storage.set(KEYS.SETTINGS_HISTORY, JSON.stringify(filtered));
  },

  clearSettingsHistory(): void {
    storage.delete(KEYS.SETTINGS_HISTORY);
  },

  getFoodEntries(): FoodEntry[] {
    try {
      const data = storage.getString(KEYS.FOOD_ENTRIES);
      return data
        ? JSON.parse(data).map((f: any) => ({
            ...f,
            timestamp: new Date(f.timestamp),
            foods: f.foods || [],
          }))
        : [];
    } catch {
      return [];
    }
  },

  saveFoodEntry(entry: FoodEntry): void {
    const entries = this.getFoodEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.unshift(entry);
    }
    storage.set(KEYS.FOOD_ENTRIES, JSON.stringify(entries));
  },

  deleteFoodEntry(id: string): void {
    const entries = this.getFoodEntries();
    const filtered = entries.filter(e => e.id !== id);
    storage.set(KEYS.FOOD_ENTRIES, JSON.stringify(filtered));
  },

  getUserFoods(): UserFood[] {
    try {
      const data = storage.getString(KEYS.USER_FOODS);
      return data
        ? JSON.parse(data).map((f: any) => ({
            ...f,
            lastUsed: new Date(f.lastUsed),
          }))
        : [];
    } catch {
      return [];
    }
  },

  saveUserFood(food: UserFood): void {
    const foods = this.getUserFoods();
    const existingIndex = foods.findIndex(f => f.name.toLowerCase() === food.name.toLowerCase());
    
    if (existingIndex >= 0) {
      // Update existing food
      foods[existingIndex] = {
        ...foods[existingIndex],
        carbsPer100g: food.carbsPer100g,
        lastUsed: food.lastUsed,
        useCount: foods[existingIndex].useCount + 1,
      };
    } else {
      // Add new food
      foods.unshift(food);
    }
    
    // Sort by use count and last used
    foods.sort((a, b) => {
      if (b.useCount !== a.useCount) {
        return b.useCount - a.useCount;
      }
      return b.lastUsed.getTime() - a.lastUsed.getTime();
    });
    
    // Keep only top 100 foods
    const trimmedFoods = foods.slice(0, 100);
    storage.set(KEYS.USER_FOODS, JSON.stringify(trimmedFoods));
  },

  searchUserFoods(query: string): UserFood[] {
    const foods = this.getUserFoods();
    const searchTerm = query.toLowerCase();
    return foods.filter(f => f.name.toLowerCase().includes(searchTerm));
  },

  deleteUserFood(id: string): void {
    const foods = this.getUserFoods();
    const filtered = foods.filter(f => f.id !== id);
    storage.set(KEYS.USER_FOODS, JSON.stringify(filtered));
  },

  saveSettingsHistoryEntry(entry: SettingsHistoryEntry): void {
    const history = this.getSettingsHistory();
    history.unshift(entry);
    
    // Keep only last 200 entries
    const trimmed = history.slice(0, 200);
    storage.set(KEYS.SETTINGS_HISTORY, JSON.stringify(trimmed));
  },
};
