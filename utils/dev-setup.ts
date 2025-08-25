import { MedicalSettings } from "../types";
import { StorageService } from "./storage";

/**
 * Development utility to set up basic medical settings for testing
 * This should only be used during development
 */
export const DevSetup = {
  setupBasicMedicalSettings(): void {
    const basicSettings: MedicalSettings = {
      patientInfo: {
        name: "Test User",
        height: 175,
        weight: 70,
        dateOfBirth: "1990-01-01",
      },
      basalInsulin: {
        medicationType: "Lantus",
        unitsPerDose: 20,
        frequency: "once",
        timing: "22:00",
        timingMorning: "08:00",
        timingEvening: "22:00",
      },
      mealInsulin: {
        medicationType: "Humalog",
        carbRatios: {
          breakfast: 1.5, // 1 unit per 1g carbs * 1.5 = 1.5 units per 10g
          lunch: 1.2,
          dinner: 1.0,
          eveningSnack: 0.8,
        },
      },
      correctionInsulin: {
        correctionFactor: 2.0, // 1 unit lowers glucose by 2.0 mmol/L
        targetGlucoseMin: 4.0, // 4.0 mmol/L
        targetGlucoseMax: 7.0, // 7.0 mmol/L
      },
      glucoseTargets: {
        fasting: { min: 4.0, max: 6.0 },
        beforeMeals: { min: 4.0, max: 7.0 },
        afterMeals: { min: 5.0, max: 10.0 },
        bedtime: { min: 6.0, max: 8.0 },
      },
      administrationInstructions: {
        dosingInstructions: "Take with meals",
        specialNotes: "Rotate injection sites",
        timingGuidelines: "Inject 15-20 minutes before eating",
      },
    };

    StorageService.saveMedicalSettings(basicSettings);
    console.log("✅ Basic medical settings configured for testing");
  },
};
