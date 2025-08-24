import { useCallback, useRef, useState } from 'react';
import { MedicalSettings, UserSettings } from '../types';
import { MedicalCalculator } from '../utils/medical';
import { StorageService } from '../utils/storage';

export const useSettings = () => {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [medicalSettings, setMedicalSettings] = useState<MedicalSettings | null>(null);
  const [sectionWarnings, setSectionWarnings] = useState<Record<string, string[]>>({});
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousUserSettingsRef = useRef<UserSettings | null>(null);
  const previousMedicalSettingsRef = useRef<MedicalSettings | null>(null);

  const loadSettings = useCallback(async () => {
    const userSettingsData = await StorageService.getUserSettings();
    const medicalSettingsData = await StorageService.getMedicalSettings();
    setUserSettings(userSettingsData);
    setMedicalSettings(medicalSettingsData);
    previousUserSettingsRef.current = userSettingsData;
    previousMedicalSettingsRef.current = medicalSettingsData;
    setSectionWarnings({});
  }, []);

  const autoSave = useCallback(async (settings: {
    user?: UserSettings;
    medical?: MedicalSettings;
  }) => {
    try {
      if (settings.user) {
        await StorageService.saveUserSettings(settings.user);
        previousUserSettingsRef.current = settings.user;
      }
      if (settings.medical) {
        await StorageService.saveMedicalSettings(settings.medical);
        previousMedicalSettingsRef.current = settings.medical;

        const validation = MedicalCalculator.validateMedicalSettings(settings.medical);
        setSectionWarnings(validation.warningsBySection);
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, []);

  const updateUserSetting = useCallback(<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    setUserSettings(currentSettings => {
      if (!currentSettings) return currentSettings;

      const oldValue = currentSettings[key];
      const newSettings = { ...currentSettings, [key]: value };

      StorageService.saveSettingsChange("App Settings", String(key), oldValue, value);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        autoSave({ user: newSettings });
      }, 1000);

      return newSettings;
    });
  }, [autoSave]);

  const updateMedicalSetting = useCallback((path: string[], value: any) => {
    setMedicalSettings(currentSettings => {
      if (!currentSettings) return currentSettings;

      let oldCurrent = currentSettings;
      for (let i = 0; i < path.length - 1; i++) {
        oldCurrent = oldCurrent[path[i] as keyof typeof oldCurrent] as any;
      }
      const oldValue = oldCurrent[path[path.length - 1] as keyof typeof oldCurrent];

      const newSettings = JSON.parse(JSON.stringify(currentSettings));
      let current = newSettings;

      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;

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

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        autoSave({ medical: newSettings });
      }, 1000);

      return newSettings;
    });
  }, [autoSave]);

  return {
    userSettings,
    medicalSettings,
    sectionWarnings,
    loadSettings,
    updateUserSetting,
    updateMedicalSetting,
  };
};