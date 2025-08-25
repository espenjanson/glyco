import { MedicalSettings } from "../types";

export interface InsulinCalculation {
  mealInsulin: number;
  correctionInsulin: number;
  totalInsulin: number;
  reasoning: string;
}

export const MedicalCalculator = {
  /**
   * Calculate insulin dose based on carbs and current glucose
   */
  calculateInsulinDose(
    carbs: number,
    currentGlucose: number,
    mealTime: "breakfast" | "lunch" | "dinner" | "eveningSnack",
    medicalSettings: MedicalSettings
  ): InsulinCalculation {
    const { mealInsulin, correctionInsulin } = medicalSettings;

    // Calculate meal insulin (carbs / ratio)
    const carbRatio = mealInsulin.carbRatios[mealTime];
    const mealInsulinDose = carbs / carbRatio;

    // Calculate correction insulin
    const targetAverage =
      (correctionInsulin.targetGlucoseMin +
        correctionInsulin.targetGlucoseMax) /
      2;
    const glucoseExcess = Math.max(0, currentGlucose - targetAverage);
    const correctionInsulinDose =
      glucoseExcess / correctionInsulin.correctionFactor;

    const totalInsulin = mealInsulinDose + correctionInsulinDose;

    const reasoning = [
      `Meal insulin: ${carbs}g carbs ÷ 10 × ${carbRatio} = ${mealInsulinDose.toFixed(
        1
      )} units`,
      `Correction: (${currentGlucose} - ${targetAverage.toFixed(1)}) ÷ ${
        correctionInsulin.correctionFactor
      } = ${correctionInsulinDose.toFixed(1)} units`,
      `Total: ${mealInsulinDose.toFixed(1)} + ${correctionInsulinDose.toFixed(
        1
      )} = ${totalInsulin.toFixed(1)} units`,
    ].join("\n");

    return {
      mealInsulin: mealInsulinDose,
      correctionInsulin: correctionInsulinDose,
      totalInsulin,
      reasoning,
    };
  },

  /**
   * Get glucose target range for specific context
   */
  getTargetRange(
    context: "fasting" | "beforeMeals" | "afterMeals" | "bedtime",
    medicalSettings: MedicalSettings
  ) {
    return medicalSettings.glucoseTargets[context];
  },

  /**
   * Determine if glucose reading is in target range
   */
  isInTargetRange(
    glucose: number,
    context: "fasting" | "beforeMeals" | "afterMeals" | "bedtime",
    medicalSettings: MedicalSettings
  ): { inRange: boolean; status: "low" | "target" | "high" } {
    const target = this.getTargetRange(context, medicalSettings);

    if (glucose < target.min) {
      return { inRange: false, status: "low" };
    } else if (glucose > target.max) {
      return { inRange: false, status: "high" };
    } else {
      return { inRange: true, status: "target" };
    }
  },

  /**
   * Convert glucose units between mg/dL and mmol/L
   */
  convertGlucoseUnits(
    value: number,
    fromUnit: "mg/dL" | "mmol/L",
    toUnit: "mg/dL" | "mmol/L"
  ): number {
    if (fromUnit === toUnit) return value;

    if (fromUnit === "mg/dL" && toUnit === "mmol/L") {
      return value / 18.0182;
    } else if (fromUnit === "mmol/L" && toUnit === "mg/dL") {
      return value * 18.0182;
    }

    return value;
  },

  /**
   * Calculate BMI from height and weight
   */
  calculateBMI(heightCm: number, weightKg: number): number {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  },

  /**
   * Get BMI category
   */
  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  },

  /**
   * Validate medical settings for completeness and safety
   */
  validateMedicalSettings(settings: MedicalSettings): {
    isValid: boolean;
    warnings: string[];
    criticalWarnings: string[];
    warningsBySection: Record<string, string[]>;
  } {
    const warnings: string[] = [];
    const criticalWarnings: string[] = [];
    const warningsBySection: Record<string, string[]> = {
      "Patient Information": [],
      "Basal Insulin": [],
      "Meal Insulin": [],
      "Correction Insulin": [],
      "Glucose Targets": [],
    };

    // Check patient info - these are informational, not critical for calculations
    if (!settings.patientInfo.name.trim()) {
      const warning = "Patient name is required";
      warnings.push(warning);
      warningsBySection["Patient Information"].push(warning);
    }
    if (settings.patientInfo.height <= 0) {
      const warning = "Valid height is required";
      warnings.push(warning);
      warningsBySection["Patient Information"].push(warning);
    }
    if (settings.patientInfo.weight <= 0) {
      const warning = "Valid weight is required";
      warnings.push(warning);
      warningsBySection["Patient Information"].push(warning);
    }
    if (!settings.patientInfo.dateOfBirth) {
      const warning = "Date of birth is required";
      warnings.push(warning);
      warningsBySection["Patient Information"].push(warning);
    }

    // Check insulin settings - these are critical for calculations
    if (!settings.basalInsulin.medicationType) {
      const warning = "Basal insulin type must be specified";
      warnings.push(warning);
      warningsBySection["Basal Insulin"].push(warning);
    }
    if (settings.basalInsulin.unitsPerDose <= 0) {
      const warning = "Basal insulin dose must be greater than 0";
      criticalWarnings.push(warning);
      warningsBySection["Basal Insulin"].push(warning);
    }

    if (!settings.mealInsulin.medicationType) {
      const warning = "Meal insulin type must be specified";
      warnings.push(warning);
      warningsBySection["Meal Insulin"].push(warning);
    }

    // Check carb ratios - critical for insulin calculations
    const carbRatios = Object.values(settings.mealInsulin.carbRatios);
    if (carbRatios.some((ratio) => ratio <= 0)) {
      const warning = "All carbohydrate ratios must be greater than 0";
      criticalWarnings.push(warning);
      warningsBySection["Meal Insulin"].push(warning);
    }

    // Check correction settings - critical for insulin calculations
    if (settings.correctionInsulin.correctionFactor <= 0) {
      const warning = "Correction factor must be greater than 0";
      criticalWarnings.push(warning);
      warningsBySection["Correction Insulin"].push(warning);
    }
    if (
      settings.correctionInsulin.targetGlucoseMin >=
      settings.correctionInsulin.targetGlucoseMax
    ) {
      const warning = "Target glucose minimum must be less than maximum";
      criticalWarnings.push(warning);
      warningsBySection["Correction Insulin"].push(warning);
    }

    // Check glucose targets - critical for range analysis
    const targets = settings.glucoseTargets;
    Object.entries(targets).forEach(([key, target]) => {
      if (target.min >= target.max) {
        const warning = `${key} target minimum must be less than maximum`;
        criticalWarnings.push(warning);
        warningsBySection["Glucose Targets"].push(warning);
      }
      if (target.min <= 0 || target.max <= 0) {
        const warning = `${key} target values must be greater than 0`;
        criticalWarnings.push(warning);
        warningsBySection["Glucose Targets"].push(warning);
      }
    });

    return {
      isValid: warnings.length === 0 && criticalWarnings.length === 0,
      warnings,
      criticalWarnings,
      warningsBySection,
    };
  },

  /**
   * Calculate estimated HbA1c from average glucose
   */
  estimateHbA1c(averageGlucoseMmol: number): number {
    // Using IFCC formula: HbA1c (mmol/mol) = (average glucose mmol/L + 2.59) / 0.09148
    return (averageGlucoseMmol + 2.59) / 0.09148;
  },

  /**
   * Convert HbA1c between units
   */
  convertHbA1c(
    value: number,
    fromUnit: "mmol/mol" | "%",
    toUnit: "mmol/mol" | "%"
  ): number {
    if (fromUnit === toUnit) return value;

    if (fromUnit === "%" && toUnit === "mmol/mol") {
      return (value - 2.15) * 10.929;
    } else if (fromUnit === "mmol/mol" && toUnit === "%") {
      return value / 10.929 + 2.15;
    }

    return value;
  },
};

export default MedicalCalculator;
