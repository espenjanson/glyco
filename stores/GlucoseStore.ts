import { observable, action, computed } from "mobx";
import { GlucoseReading, GlucoseUnit } from "../types";
import { StorageService } from "../utils/storage";

export class GlucoseStore {
  @observable readings: GlucoseReading[] = [];
  @observable loading = false;
  @observable lastReading: GlucoseReading | null = null;

  constructor() {
    this.loadReadings();
  }

  @action
  loadReadings() {
    this.loading = true;
    try {
      const readings = StorageService.getGlucoseReadings();
      this.readings = readings;
      this.lastReading = readings.length > 0 ? readings[0] : null;
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
      this.readings = [reading, ...this.readings.filter(r => r.id !== reading.id)];
      this.lastReading = reading;
    } catch (error) {
      console.error("Failed to save glucose reading:", error);
      throw error;
    }
  }

  @action
  updateReading(id: string, updates: Partial<GlucoseReading>) {
    try {
      const reading = this.readings.find(r => r.id === id);
      if (!reading) throw new Error("Reading not found");
      
      const updatedReading = { ...reading, ...updates };
      StorageService.saveGlucoseReading(updatedReading);
      
      const index = this.readings.findIndex(r => r.id === id);
      if (index !== -1) {
        this.readings[index] = updatedReading;
      }
      if (this.lastReading?.id === id) {
        this.lastReading = updatedReading;
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
      this.readings = this.readings.filter(r => r.id !== id);
      if (this.lastReading?.id === id) {
        this.lastReading = this.readings.length > 0 ? this.readings[0] : null;
      }
    } catch (error) {
      console.error("Failed to delete glucose reading:", error);
      throw error;
    }
  }

  getReadingsByDateRange(startDate: Date, endDate: Date): GlucoseReading[] {
    return this.readings.filter(
      reading => 
        reading.timestamp >= startDate && 
        reading.timestamp <= endDate
    );
  }

  getAverageGlucose(days: number = 30): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const recentReadings = this.readings.filter(
      reading => reading.timestamp >= cutoff
    );
    
    if (recentReadings.length === 0) return 0;
    
    const sum = recentReadings.reduce((total, reading) => total + reading.value, 0);
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
}