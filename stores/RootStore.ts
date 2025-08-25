import { action, computed, observable } from "mobx";
import { DashboardStats } from "../types";
import { FoodStore } from "./FoodStore";
import { GlucoseStore } from "./GlucoseStore";
import { HistoryStore } from "./HistoryStore";
import { InsulinStore } from "./InsulinStore";
import { SettingsStore } from "./SettingsStore";

export class RootStore {
  @observable glucoseStore: GlucoseStore;
  @observable insulinStore: InsulinStore;
  @observable foodStore: FoodStore;
  @observable settingsStore: SettingsStore;
  @observable historyStore: HistoryStore;

  constructor() {
    this.insulinStore = new InsulinStore();
    this.foodStore = new FoodStore();
    this.settingsStore = new SettingsStore();
    this.glucoseStore = new GlucoseStore(this.settingsStore);
    this.historyStore = new HistoryStore(
      this.glucoseStore,
      this.insulinStore,
      this.foodStore,
      this.settingsStore
    );
  }

  // Computed dashboard stats that combine data from multiple stores
  @computed
  get dashboardStats(): DashboardStats {
    const averageGlucose = this.glucoseStore.getAverageGlucose(30);
    const totalInsulinToday = this.insulinStore.totalUnitsToday;
    const shotsToday = this.insulinStore.shotsCountToday;
    const lastReading = this.glucoseStore.lastReading;
    const lastInsulin = this.insulinStore.lastShot;

    // Calculate in-range percentage for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReadings = this.glucoseStore.getReadingsByDateRange(
      thirtyDaysAgo,
      new Date()
    );

    let inRangeCount = 0;
    if (recentReadings.length > 0) {
      const targetLow = this.settingsStore.targetRangeLow;
      const targetHigh = this.settingsStore.targetRangeHigh;

      inRangeCount = recentReadings.filter((reading) => {
        // Convert to display units for comparison
        const value = reading.value;
        return value >= targetLow && value <= targetHigh;
      }).length;
    }

    const inRangePercentage =
      recentReadings.length > 0
        ? (inRangeCount / recentReadings.length) * 100
        : 0;

    return {
      averageGlucose,
      totalInsulinToday,
      shotsToday,
      inRangePercentage,
      lastReading: lastReading || undefined,
      lastInsulin: lastInsulin || undefined,
    };
  }

  // Cross-store operations
  @action
  refreshAllData() {
    this.glucoseStore.loadReadings();
    this.insulinStore.loadShots();
    this.foodStore.loadData();
    this.settingsStore.loadSettings();
  }

  // Helper method to get all data for export or backup
  getAllData() {
    return {
      glucose: this.glucoseStore.readings,
      insulin: this.insulinStore.shots,
      food: {
        entries: this.foodStore.entries,
        userFoods: this.foodStore.userFoods,
      },
      settings: {
        user: this.settingsStore.userSettings,
        medical: this.settingsStore.medicalSettings,
        history: this.settingsStore.settingsHistory,
      },
    };
  }
}

// Create a singleton instance
export const rootStore = new RootStore();
