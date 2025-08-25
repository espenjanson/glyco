import { action, computed, makeAutoObservable, observable } from "mobx";
import { FoodEntry, GlucoseReading, InsulinShot } from "../types";
import { MedicalCalculator } from "../utils/medical";
import { FoodStore } from "./FoodStore";
import { GlucoseStore } from "./GlucoseStore";
import { InsulinStore } from "./InsulinStore";
import { SettingsStore } from "./SettingsStore";

export interface HistoryEntry {
  id: string;
  type: "glucose" | "insulin" | "food";
  timestamp: Date;
  data: GlucoseReading | InsulinShot | FoodEntry;
}

export interface HistoryStats {
  average: number;
  inRangePercentage: number;
  a1cEstimate: number;
  totalReadings: number;
  totalInsulinUnits: number;
  totalFoodEntries: number;
  averageCarbs: number;
}

export interface TrendData {
  direction: "rising" | "falling" | "stable";
  rate: number; // rate of change per hour
  confidence: "high" | "medium" | "low";
}

export class HistoryStore {
  @observable timeRange: number = 7; // days

  constructor(
    private glucoseStore: GlucoseStore,
    private insulinStore: InsulinStore,
    private foodStore: FoodStore,
    private settingsStore: SettingsStore
  ) {
    makeAutoObservable(this);
  }

  @action
  setTimeRange(days: number) {
    this.timeRange = days;
  }

  @computed
  get glucoseUnit() {
    return this.settingsStore.glucoseUnit;
  }

  @computed
  get cutoffDate(): Date {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - this.timeRange);
    return cutoff;
  }

  @computed
  get filteredGlucoseReadings(): GlucoseReading[] {
    return this.glucoseStore.readings
      .filter((reading) => reading.timestamp >= this.cutoffDate)
      .slice(0, 100); // Limit for performance
  }

  @computed
  get filteredInsulinShots(): InsulinShot[] {
    return this.insulinStore.shots
      .filter((shot) => shot.timestamp >= this.cutoffDate)
      .slice(0, 100);
  }

  @computed
  get filteredFoodEntries(): FoodEntry[] {
    return this.foodStore.entries
      .filter((entry) => entry.timestamp >= this.cutoffDate)
      .slice(0, 100);
  }

  @computed
  get combinedHistoryEntries(): HistoryEntry[] {
    const entries: HistoryEntry[] = [];

    // Add glucose readings
    this.filteredGlucoseReadings.forEach((reading) => {
      entries.push({
        id: `glucose-${reading.id}`,
        type: "glucose",
        timestamp: reading.timestamp,
        data: reading,
      });
    });

    // Add insulin shots
    this.filteredInsulinShots.forEach((shot) => {
      entries.push({
        id: `insulin-${shot.id}`,
        type: "insulin",
        timestamp: shot.timestamp,
        data: shot,
      });
    });

    // Add food entries
    this.filteredFoodEntries.forEach((entry) => {
      entries.push({
        id: `food-${entry.id}`,
        type: "food",
        timestamp: entry.timestamp,
        data: entry,
      });
    });

    // Sort by timestamp (most recent first)
    return entries.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  @computed
  get historyStats(): HistoryStats | null {
    const glucoseReadings = this.filteredGlucoseReadings;
    const insulinShots = this.filteredInsulinShots;
    const foodEntries = this.filteredFoodEntries;

    if (glucoseReadings.length === 0) {
      return null;
    }

    // Glucose statistics
    const sum = glucoseReadings.reduce((acc, r) => acc + r.value, 0);
    const average = sum / glucoseReadings.length;

    const settings = this.settingsStore.userSettings;
    const inRange = settings
      ? glucoseReadings.filter((r) => {
          return (
            r.value >= settings.targetRangeLow &&
            r.value <= settings.targetRangeHigh
          );
        }).length
      : 0;

    const inRangePercentage = Math.round(
      (inRange / glucoseReadings.length) * 100
    );
    const a1cEstimate = MedicalCalculator.estimateHbA1c(average);

    // Insulin statistics
    const totalInsulinUnits = insulinShots.reduce(
      (sum, shot) => sum + shot.units,
      0
    );

    // Food statistics
    const totalCarbs = foodEntries.reduce(
      (sum, entry) => sum + entry.totalCarbs,
      0
    );
    const averageCarbs =
      foodEntries.length > 0 ? totalCarbs / foodEntries.length : 0;

    return {
      average: Math.round(average * 10) / 10, // Round to 1 decimal
      inRangePercentage,
      a1cEstimate,
      totalReadings: glucoseReadings.length,
      totalInsulinUnits: Math.round(totalInsulinUnits * 10) / 10,
      totalFoodEntries: foodEntries.length,
      averageCarbs: Math.round(averageCarbs * 10) / 10,
    };
  }

  @computed
  get glucoseTrend(): TrendData | null {
    const readings = this.filteredGlucoseReadings.slice(0, 10); // Use last 10 readings

    if (readings.length < 3) {
      return null;
    }

    // Sort by timestamp (oldest first for trend calculation)
    const sortedReadings = readings
      .slice()
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Calculate linear regression
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    const n = sortedReadings.length;

    sortedReadings.forEach((reading, index) => {
      const x = index; // Use index as x-coordinate
      const y = reading.value;

      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    // Calculate time difference between first and last reading in hours
    const timeDiffHours =
      (sortedReadings[sortedReadings.length - 1].timestamp.getTime() -
        sortedReadings[0].timestamp.getTime()) /
      (1000 * 60 * 60);

    // Convert slope to rate per hour
    const ratePerHour =
      timeDiffHours > 0 ? (slope / timeDiffHours) * (n - 1) : 0;

    // Determine direction and confidence
    let direction: "rising" | "falling" | "stable";
    let confidence: "high" | "medium" | "low";

    const absRate = Math.abs(ratePerHour);

    if (absRate < 0.5) {
      direction = "stable";
    } else if (ratePerHour > 0) {
      direction = "rising";
    } else {
      direction = "falling";
    }

    // Confidence based on consistency and sample size
    if (n >= 8 && absRate > 1.0) {
      confidence = "high";
    } else if (n >= 5 && absRate > 0.5) {
      confidence = "medium";
    } else {
      confidence = "low";
    }

    return {
      direction,
      rate: Math.round(ratePerHour * 10) / 10,
      confidence,
    };
  }

  @computed
  get dailyAverages(): { date: string; average: number }[] {
    const readings = this.filteredGlucoseReadings;
    const dailyGroups: { [key: string]: number[] } = {};

    readings.forEach((reading) => {
      const dateKey = reading.timestamp.toISOString().split("T")[0];
      if (!dailyGroups[dateKey]) {
        dailyGroups[dateKey] = [];
      }
      dailyGroups[dateKey].push(reading.value);
    });

    return Object.entries(dailyGroups)
      .map(([date, values]) => ({
        date,
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  @computed
  get weeklyPatterns(): { dayOfWeek: number; average: number }[] {
    const readings = this.filteredGlucoseReadings;
    const weeklyGroups: { [key: number]: number[] } = {};

    // Initialize all days of week
    for (let i = 0; i < 7; i++) {
      weeklyGroups[i] = [];
    }

    readings.forEach((reading) => {
      const dayOfWeek = reading.timestamp.getDay(); // 0 = Sunday, 6 = Saturday
      weeklyGroups[dayOfWeek].push(reading.value);
    });

    return Object.entries(weeklyGroups)
      .map(([day, values]) => ({
        dayOfWeek: parseInt(day),
        average:
          values.length > 0
            ? values.reduce((sum, val) => sum + val, 0) / values.length
            : 0,
      }))
      .filter((item) => item.average > 0); // Only include days with data
  }

  getReadingsForDateRange(startDate: Date, endDate: Date): GlucoseReading[] {
    return this.glucoseStore.readings.filter(
      (reading) =>
        reading.timestamp >= startDate && reading.timestamp <= endDate
    );
  }

  getInsulinForDateRange(startDate: Date, endDate: Date): InsulinShot[] {
    return this.insulinStore.shots.filter(
      (shot) => shot.timestamp >= startDate && shot.timestamp <= endDate
    );
  }

  getFoodEntriesForDateRange(startDate: Date, endDate: Date): FoodEntry[] {
    return this.foodStore.entries.filter(
      (entry) => entry.timestamp >= startDate && entry.timestamp <= endDate
    );
  }

  @computed
  get chartData(): { timestamp: number; value: number }[] {
    return this.filteredGlucoseReadings
      .map((reading) => ({
        timestamp: reading.timestamp.getTime(),
        value: reading.value,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }
}
