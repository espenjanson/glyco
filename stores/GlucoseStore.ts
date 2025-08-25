import { action, computed, makeAutoObservable, observable } from "mobx";
import { GlucoseReading } from "../types";
import { GlucoseConverter } from "../utils/glucose";
import { StorageService } from "../utils/storage";
import { SettingsStore } from "./SettingsStore";

const defaultDraft: GlucoseReading = {
  id: "",
  value: 0,
  unit: "mmol/L",
  timestamp: new Date(),
  notes: undefined,
  tags: undefined,
  context: undefined,
};

export class GlucoseStore {
  @observable readings: GlucoseReading[] = [];
  @observable loading = false;

  // Draft state - exact GlucoseReading type
  @observable draft: GlucoseReading = defaultDraft;

  // UI-specific state
  @observable editingReading: GlucoseReading | null = null;
  @observable draftIsValid: boolean = true;

  constructor(private settingsStore: SettingsStore) {
    makeAutoObservable(this);
    this.loadReadings();
  }

  @computed
  get lastReading(): GlucoseReading | null {
    return this.readings.length > 0 ? this.readings[0] : null;
  }

  @computed
  get parsedLastReading(): string {
    // Get glucose value in user's preferred unit

    const lastGlucose = this.lastReading;
    if (!lastGlucose) return "--";

    const userGlucoseUnit = this.settingsStore.glucoseUnit;
    // Convert from stored mmol/L to user's preferred unit using GlucoseConverter
    const convertedValue = GlucoseConverter.storageToDisplay(
      lastGlucose.value,
      userGlucoseUnit
    );

    // Format using GlucoseConverter for consistency
    return GlucoseConverter.formatForDisplay(convertedValue, userGlucoseUnit);
  }
  @action
  setDraftIsValid(isValid: boolean) {
    this.draftIsValid = isValid;
  }

  @action
  loadReadings() {
    this.loading = true;
    try {
      const readings = StorageService.getGlucoseReadings();
      this.readings = readings;

      this.loading = false;
    } catch (error) {
      console.error("Failed to load glucose readings:", error);
      this.loading = false;
    }
  }

  @action
  addReading(reading: GlucoseReading) {
    try {
      StorageService.saveGlucoseReading(reading);
      this.readings = [
        reading,
        ...this.readings.filter((r) => r.id !== reading.id),
      ];
      this.resetDraft();
    } catch (error) {
      console.error("Failed to save glucose reading:", error);
      throw error;
    }
  }

  @action
  updateReading(id: string, updates: Partial<GlucoseReading>) {
    try {
      const reading = this.readings.find((r) => r.id === id);
      if (!reading) throw new Error("Reading not found");

      const updatedReading = { ...reading, ...updates };
      StorageService.saveGlucoseReading(updatedReading);

      const index = this.readings.findIndex((r) => r.id === id);
      if (index !== -1) {
        this.readings[index] = updatedReading;
      }
    } catch (error) {
      console.error("Failed to update glucose reading:", error);
      throw error;
    }
  }

  @action
  deleteReading(id: string) {
    try {
      StorageService.deleteGlucoseReading(id);
      this.readings = this.readings.filter((r) => r.id !== id);
    } catch (error) {
      console.error("Failed to delete glucose reading:", error);
      throw error;
    }
  }

  getReadingsByDateRange(startDate: Date, endDate: Date): GlucoseReading[] {
    return this.readings.filter(
      (reading) =>
        reading.timestamp >= startDate && reading.timestamp <= endDate
    );
  }

  getAverageGlucose(days: number = 30): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const recentReadings = this.readings.filter(
      (reading) => reading.timestamp >= cutoff
    );

    if (recentReadings.length === 0) return 0;

    const sum = recentReadings.reduce(
      (total, reading) => total + reading.value,
      0
    );
    return sum / recentReadings.length;
  }

  @computed
  get lastReadingAge(): number {
    if (!this.lastReading) return Infinity;
    return (Date.now() - this.lastReading.timestamp.getTime()) / (1000 * 60);
  }

  @computed
  get isLastReadingStale(): boolean {
    return this.lastReadingAge > 20;
  }

  // Draft reading management
  @action
  resetDraft() {
    this.draft = defaultDraft;
    this.editingReading = null;
  }

  @action
  setDraftValue(value: number) {
    this.draft.value = value;
  }

  @action
  setDraftNotes(notes: string) {
    this.draft.notes = notes;
  }

  @action
  setDraftSelectedTime(time: Date) {
    this.draft.timestamp = time;
  }

  @action
  startEditingReading(reading: GlucoseReading) {
    this.editingReading = reading;
    // Convert from storage (mmol/L) to user's preferred unit for editing
    const convertedValue = GlucoseConverter.storageToDisplay(
      reading.value,
      this.settingsStore.glucoseUnit
    );
    this.draft.value = convertedValue;
    this.draft.notes = reading.notes || "";
    this.draft.timestamp = new Date(reading.timestamp);
  }

  @action
  saveDraftReading() {
    if (this.draft.value <= 0) {
      throw new Error("Invalid glucose value");
    }

    // Convert from user's unit to storage unit (mmol/L)
    const valueInStorage = GlucoseConverter.inputToStorage(
      this.draft.value,
      this.settingsStore.glucoseUnit
    );

    const reading: GlucoseReading = {
      id: this.editingReading ? this.editingReading.id : Date.now().toString(),
      value: valueInStorage,
      unit: "mmol/L",
      timestamp: this.draft.timestamp,
      notes: this.draft.notes?.trim() || undefined,
    };

    if (this.editingReading) {
      this.updateReading(this.editingReading.id, reading);
    } else {
      this.addReading(reading);
    }

    this.resetDraft();
    return reading;
  }
}
