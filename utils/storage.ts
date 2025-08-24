import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CarbEntry,
  GlucoseReading,
  InsulinShot,
  MedicalSettings,
  SettingsHistoryEntry,
  UserSettings,
} from "../types";

const KEYS = {
  GLUCOSE_READINGS: "glucose_readings",
  INSULIN_SHOTS: "insulin_shots",
  CARB_ENTRIES: "carb_entries",
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
  async getGlucoseReadings(): Promise<GlucoseReading[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.GLUCOSE_READINGS);
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

  async saveGlucoseReading(reading: GlucoseReading): Promise<void> {
    const readings = await this.getGlucoseReadings();
    readings.unshift(reading);
    await AsyncStorage.setItem(KEYS.GLUCOSE_READINGS, JSON.stringify(readings));
  },
  async updateGlucoseReading(updatedReading: GlucoseReading): Promise<void> {
    const readings = await this.getGlucoseReadings();
    const index = readings.findIndex(r => r.id === updatedReading.id);
    if (index !== -1) {
      readings[index] = updatedReading;
      await AsyncStorage.setItem(KEYS.GLUCOSE_READINGS, JSON.stringify(readings));
    }
  },
  async deleteGlucoseReading(id: string): Promise<void> {
    const readings = await this.getGlucoseReadings();
    const filtered = readings.filter(r => r.id !== id);
    await AsyncStorage.setItem(KEYS.GLUCOSE_READINGS, JSON.stringify(filtered));
  },

  async getInsulinShots(): Promise<InsulinShot[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.INSULIN_SHOTS);
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

  async saveInsulinShot(shot: InsulinShot): Promise<void> {
    const shots = await this.getInsulinShots();
    shots.unshift(shot);
    await AsyncStorage.setItem(KEYS.INSULIN_SHOTS, JSON.stringify(shots));
  },

  async getCarbEntries(): Promise<CarbEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CARB_ENTRIES);
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

  async saveCarbEntry(entry: CarbEntry): Promise<void> {
    const entries = await this.getCarbEntries();
    entries.unshift(entry);
    await AsyncStorage.setItem(KEYS.CARB_ENTRIES, JSON.stringify(entries));
  },

  async getUserSettings(): Promise<UserSettings> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_SETTINGS);
      return data
        ? { ...defaultSettings, ...JSON.parse(data) }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  async saveUserSettings(settings: UserSettings): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER_SETTINGS, JSON.stringify(settings));
  },

  async getMedicalSettings(): Promise<MedicalSettings> {
    try {
      const data = await AsyncStorage.getItem(KEYS.MEDICAL_SETTINGS);
      return data
        ? { ...defaultMedicalSettings, ...JSON.parse(data) }
        : defaultMedicalSettings;
    } catch {
      return defaultMedicalSettings;
    }
  },

  async saveMedicalSettings(settings: MedicalSettings): Promise<void> {
    await AsyncStorage.setItem(KEYS.MEDICAL_SETTINGS, JSON.stringify(settings));
  },

  async clearUserSettings(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.USER_SETTINGS);
  },

  async clearMedicalSettings(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.MEDICAL_SETTINGS);
  },

  async getSettingsHistory(): Promise<SettingsHistoryEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS_HISTORY);
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

  async saveSettingsChange(section: string, field: string, oldValue: any, newValue: any): Promise<void> {
    const history = await this.getSettingsHistory();
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
    
    await AsyncStorage.setItem(KEYS.SETTINGS_HISTORY, JSON.stringify([...trimmedSectionHistory, ...otherHistory]));
  },

  async removeSettingsHistoryEntry(id: string): Promise<void> {
    const history = await this.getSettingsHistory();
    const filtered = history.filter(entry => entry.id !== id);
    await AsyncStorage.setItem(KEYS.SETTINGS_HISTORY, JSON.stringify(filtered));
  },

  async clearSettingsHistory(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.SETTINGS_HISTORY);
  },
};
