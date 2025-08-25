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
   * Only allows complete numbers: "6", "6.3", "6,123" but rejects incomplete formats like "6." or "6,"
   * @param text - The input text
   * @param allowDecimals - Whether to parse as float (true) or int (false)
   * @returns The parsed number, or 0 for invalid/empty input
   */
  parseNumber(text: string, allowDecimals: boolean = false): number {
    if (!text || text.trim() === "") {
      return 0;
    }

    const trimmedText = text.trim();

    // Validate format: only digits and at most one decimal separator (comma or dot)
    const commaCount = (trimmedText.match(/,/g) || []).length;
    const dotCount = (trimmedText.match(/\./g) || []).length;

    // Only allow one decimal separator total (either comma OR dot, not both)
    if (commaCount + dotCount > 1) {
      return 0; // Invalid format like "6,,3" or "6.3.4" or "6,3.4"
    }

    // Check if format is valid: digits + optional single separator + required digits after separator
    const validPattern = allowDecimals
      ? /^\d+([,.]\d+)?$/ // Allows: "6", "6,3", "6,123" but NOT "6." or "6,"
      : /^\d+$/; // Only whole numbers

    if (!validPattern.test(trimmedText)) {
      return 0; // Invalid format
    }

    // Handle decimal separators
    if (allowDecimals) {
      // Replace comma with dot for consistent parsing
      const normalizedText = trimmedText.replace(",", ".");
      const parsed = parseFloat(normalizedText);
      return isNaN(parsed) ? 0 : parsed;
    } else {
      const parsed = parseInt(trimmedText);
      return isNaN(parsed) ? 0 : parsed;
    }
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
    return (
      normalized === "." ||
      (normalized.endsWith(".") &&
        normalized.length > 1 &&
        !isNaN(parseFloat(normalized.slice(0, -1))))
    );
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
  },
};
