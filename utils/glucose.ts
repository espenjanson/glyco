import { GlucoseUnit } from "../types";

export const GlucoseConverter = {
  /**
   * Convert glucose value between units
   */
  convert(
    value: number,
    fromUnit: GlucoseUnit,
    toUnit: GlucoseUnit
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
   * Convert user input to storage format (always mmol/L)
   * @param inputValue - The value the user entered
   * @param currentDisplayUnit - The unit the user is currently viewing/inputting in
   * @returns value in mmol/L for storage
   */
  inputToStorage(inputValue: number, currentDisplayUnit: GlucoseUnit): number {
    return this.convert(inputValue, currentDisplayUnit, "mmol/L");
  },

  /**
   * Convert storage value to display format
   * @param storageValue - The value from storage (always in mmol/L)
   * @param targetDisplayUnit - The unit to display to the user
   * @returns value in the target display unit
   */
  storageToDisplay(storageValue: number, targetDisplayUnit: GlucoseUnit): number {
    return this.convert(storageValue, "mmol/L", targetDisplayUnit);
  },

  /**
   * Format glucose value for display with appropriate decimal places
   */
  formatForDisplay(value: number, unit: GlucoseUnit): string {
    // Handle zero or invalid values
    if (value === 0 || value === null || value === undefined || isNaN(value)) {
      return "";
    }
    
    if (unit === "mmol/L") {
      return value.toFixed(1);
    } else {
      return Math.round(value).toString();
    }
  },

  /**
   * Get appropriate placeholder text for input fields
   */
  getPlaceholder(unit: GlucoseUnit, context: "target" | "correction" | "reading" = "target"): string {
    if (unit === "mmol/L") {
      switch (context) {
        case "target": return "e.g. 5.0-8.0";
        case "correction": return "e.g. 2.0-3.0";
        case "reading": return "e.g. 6.5";
        default: return "e.g. 7.0";
      }
    } else {
      switch (context) {
        case "target": return "e.g. 90-144";
        case "correction": return "e.g. 36-54";
        case "reading": return "e.g. 117";
        default: return "e.g. 126";
      }
    }
  },

  /**
   * Get unit label for display
   */
  getUnitLabel(unit: GlucoseUnit): string {
    return unit;
  }
};