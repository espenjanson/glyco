import { action, computed, makeAutoObservable, observable } from "mobx";
import { MedicalSettings, SettingsHistoryEntry, UserSettings } from "../types";
import { MedicalCalculator } from "../utils/medical";
import { StorageService } from "../utils/storage";

export class SettingsStore {
  @observable userSettings: UserSettings | null = null;
  @observable medicalSettings: MedicalSettings | null = null;
  @observable settingsHistory: SettingsHistoryEntry[] = [];
  @observable loading = false;
  @observable sectionWarnings: Record<string, string[]> = {};
  private saveTimeoutRef: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadSettings();
  }

  @action
  loadSettings() {
    this.loading = true;
    try {
      const userSettings = StorageService.getUserSettings();
      const medicalSettings = StorageService.getMedicalSettings();
      const settingsHistory = StorageService.getSettingsHistory();

      this.userSettings = userSettings;
      this.medicalSettings = medicalSettings;
      this.settingsHistory = settingsHistory;
      this.loading = false;
    } catch (error) {
      console.error("Failed to load settings:", error);
      this.loading = false;
    }
  }

  @action
  updateUserSettings(updates: Partial<UserSettings>) {
    try {
      const newSettings = { ...this.userSettings, ...updates } as UserSettings;
      StorageService.saveUserSettings(newSettings);
      this.userSettings = newSettings;
    } catch (error) {
      console.error("Failed to update user settings:", error);
      throw error;
    }
  }

  @action
  updateMedicalSettings(updates: Partial<MedicalSettings>) {
    try {
      const newSettings = {
        ...this.medicalSettings,
        ...updates,
      } as MedicalSettings;
      StorageService.saveMedicalSettings(newSettings);
      this.medicalSettings = newSettings;

      // Update validation warnings
      const validation = MedicalCalculator.validateMedicalSettings(newSettings);
      this.sectionWarnings = validation.warningsBySection;
    } catch (error) {
      console.error("Failed to update medical settings:", error);
      throw error;
    }
  }

  @action
  addSettingsHistoryEntry(entry: SettingsHistoryEntry) {
    try {
      StorageService.saveSettingsHistoryEntry(entry);
      this.settingsHistory = [entry, ...this.settingsHistory];
    } catch (error) {
      console.error("Failed to save settings history entry:", error);
      throw error;
    }
  }

  @action
  updateUserSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    if (!this.userSettings) return;

    const oldValue = this.userSettings[key];
    const newSettings = { ...this.userSettings, [key]: value };

    // Save history entry
    StorageService.saveSettingsChange(
      "App Settings",
      String(key),
      oldValue,
      value
    );

    // Debounced save
    if (this.saveTimeoutRef) {
      clearTimeout(this.saveTimeoutRef);
    }
    this.saveTimeoutRef = setTimeout(() => {
      this.autoSave({ user: newSettings });
    }, 1000);

    this.userSettings = newSettings;
  };

  @action
  updateMedicalSetting = (path: string[], value: any) => {
    if (!this.medicalSettings) return;

    // Get old value for history
    let oldCurrent = this.medicalSettings;
    for (let i = 0; i < path.length - 1; i++) {
      oldCurrent = oldCurrent[path[i] as keyof typeof oldCurrent] as any;
    }
    const oldValue =
      oldCurrent[path[path.length - 1] as keyof typeof oldCurrent];

    // Create new settings with updated value
    const newSettings = JSON.parse(JSON.stringify(this.medicalSettings));
    let current = newSettings;

    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;

    // Save history entry
    const sectionMap: Record<string, string> = {
      patientInfo: "Patient Information",
      basalInsulin: "Basal Insulin",
      mealInsulin: "Meal Insulin",
      correctionInsulin: "Correction Insulin",
      glucoseTargets: "Glucose Targets",
      administrationInstructions: "Administration Instructions",
    };
    const section = sectionMap[path[0]] || path[0];
    const field = path.join(".");

    StorageService.saveSettingsChange(section, field, oldValue, value);

    // Debounced save
    if (this.saveTimeoutRef) {
      clearTimeout(this.saveTimeoutRef);
    }
    this.saveTimeoutRef = setTimeout(() => {
      this.autoSave({ medical: newSettings });
    }, 1000);

    this.medicalSettings = newSettings;
  };

  @action
  private autoSave = (settings: {
    user?: UserSettings;
    medical?: MedicalSettings;
  }) => {
    try {
      if (settings.user) {
        StorageService.saveUserSettings(settings.user);
      }
      if (settings.medical) {
        StorageService.saveMedicalSettings(settings.medical);

        // Update validation warnings
        const validation = MedicalCalculator.validateMedicalSettings(
          settings.medical
        );
        this.sectionWarnings = validation.warningsBySection;
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };

  @action
  resetToDefaults = () => {
    try {
      StorageService.clearMedicalSettings();
      StorageService.clearUserSettings();
      this.loadSettings(); // Reload from storage
    } catch (error) {
      console.error("Failed to reset settings:", error);
      throw error;
    }
  };

  @action
  removeSettingsHistoryEntry = (entryId: string) => {
    try {
      StorageService.removeSettingsHistoryEntry(entryId);
      this.settingsHistory = this.settingsHistory.filter(
        (entry) => entry.id !== entryId
      );
    } catch (error) {
      console.error("Failed to remove settings history entry:", error);
      throw error;
    }
  };

  @action
  getSettingsHistory = () => {
    try {
      this.settingsHistory = StorageService.getSettingsHistory();
      return this.settingsHistory;
    } catch (error) {
      console.error("Failed to get settings history:", error);
      return [];
    }
  };

  // Computed getters
  @computed
  get glucoseUnit() {
    return this.userSettings?.glucoseUnit || "mg/dL";
  }

  @computed
  get targetRangeLow() {
    return this.userSettings?.targetRangeLow || 70;
  }

  @computed
  get targetRangeHigh() {
    return this.userSettings?.targetRangeHigh || 180;
  }

  @computed
  get remindersEnabled() {
    return this.userSettings?.remindersEnabled || false;
  }

  @computed
  get reminderTimes() {
    return this.userSettings?.reminderTimes || [];
  }

  // Medical settings computed getters
  @computed
  get isMedicalSettingsConfigured() {
    if (!this.medicalSettings) return false;

    const { correctionInsulin, mealInsulin } = this.medicalSettings;

    // Check if essential fields are properly configured
    return (
      correctionInsulin.correctionFactor > 0 &&
      correctionInsulin.targetGlucoseMin > 0 &&
      correctionInsulin.targetGlucoseMax > 0 &&
      correctionInsulin.targetGlucoseMin < correctionInsulin.targetGlucoseMax &&
      Object.values(mealInsulin.carbRatios).every((ratio) => ratio > 0)
    );
  }

  @computed
  get carbRatios() {
    return (
      this.medicalSettings?.mealInsulin.carbRatios || {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        eveningSnack: 0,
      }
    );
  }

  @computed
  get correctionFactor() {
    return this.medicalSettings?.correctionInsulin.correctionFactor || 0;
  }

  @computed
  get targetGlucoseRange() {
    if (!this.medicalSettings) return { min: 0, max: 0 };
    return {
      min: this.medicalSettings.correctionInsulin.targetGlucoseMin,
      max: this.medicalSettings.correctionInsulin.targetGlucoseMax,
    };
  }

  @computed
  get glucoseTargets() {
    return (
      this.medicalSettings?.glucoseTargets || {
        fasting: { min: 0, max: 0 },
        beforeMeals: { min: 0, max: 0 },
        afterMeals: { min: 0, max: 0 },
        bedtime: { min: 0, max: 0 },
      }
    );
  }
}
