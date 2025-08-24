/**
 * Utility functions for handling controlled inputs
 */

export const InputUtils = {
  /**
   * Format a number for display in an input field
   * @param value - The numeric value to display
   * @returns String representation, or empty string for 0
   */
  formatNumber(value: number): string {
    if (value === 0 || value === null || value === undefined) {
      return "";
    }
    return value.toString();
  },

  /**
   * Parse user input text to a number, allowing for empty strings
   * Handles both comma and dot as decimal separators for international support
   * Preserves partial decimal states (like "1." or "1,") by returning the current valid number
   * @param text - The input text
   * @param allowDecimals - Whether to parse as float (true) or int (false)
   * @returns The parsed number, or 0 for invalid/empty input
   */
  parseNumber(text: string, allowDecimals: boolean = false): number {
    if (!text || text.trim() === "") {
      return 0;
    }
    
    // Handle both comma and dot as decimal separators
    // Replace comma with dot for consistent parsing
    const normalizedText = text.replace(",", ".");
    
    // Handle partial decimal states like "1." or just "."
    if (normalizedText === ".") {
      return 0;
    }
    if (normalizedText.endsWith(".") && normalizedText.length > 1) {
      // For "1.", parse as "1" to preserve the partial state
      const withoutTrailingDot = normalizedText.slice(0, -1);
      const parsed = allowDecimals ? parseFloat(withoutTrailingDot) : parseInt(withoutTrailingDot);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    const parsed = allowDecimals ? parseFloat(normalizedText) : parseInt(normalizedText);
    return isNaN(parsed) ? 0 : parsed;
  },

  /**
   * Format a number for display, showing empty string for zero values
   * This is useful for form fields where 0 should appear as empty
   */
  formatNumberAllowEmpty(value: number): string {
    if (value === 0) {
      return "";
    }
    return value.toString();
  },

  /**
   * Check if a text input represents a valid partial decimal entry
   * This allows inputs like "1.", "1,", "." to be preserved without immediate parsing
   * @param text - The input text to check
   * @returns True if the text should be preserved as-is for user experience
   */
  isPartialDecimalEntry(text: string): boolean {
    if (!text) return false;
    
    // Normalize comma to dot for consistent checking
    const normalized = text.replace(",", ".");
    
    // Allow partial entries like "1.", "12.", or just "."
    return normalized === "." || (normalized.endsWith(".") && normalized.length > 1 && !isNaN(parseFloat(normalized.slice(0, -1))));
  },

  /**
   * Determine if we should preserve the raw text input or format from the stored number
   * This helps maintain user-friendly input behavior for partial decimal entries
   * @param currentText - The current text in the input
   * @param storedValue - The stored numeric value
   * @returns The text that should be displayed in the input
   */
  preservePartialInput(currentText: string, storedValue: number): string {
    if (InputUtils.isPartialDecimalEntry(currentText)) {
      return currentText;
    }
    return InputUtils.formatNumberAllowEmpty(storedValue);
  }
};