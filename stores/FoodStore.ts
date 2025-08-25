import { observable, action, computed } from "mobx";
import { FoodEntry, UserFood, FoodItem } from "../types";
import { StorageService } from "../utils/storage";

export class FoodStore {
  @observable entries: FoodEntry[] = [];
  @observable userFoods: UserFood[] = [];
  @observable loading = false;
  @observable lastEntry: FoodEntry | null = null;

  constructor() {
    this.loadData();
  }

  @action
  loadData() {
    this.loading = true;
    try {
      const entries = StorageService.getFoodEntries();
      const userFoods = StorageService.getUserFoods();
      
      this.entries = entries;
      this.userFoods = userFoods;
      this.lastEntry = entries.length > 0 ? entries[0] : null;
      this.loading = false;
    } catch (error) {
      console.error("Failed to load food data:", error);
      this.loading = false;
    }
  }

  @action
  addEntry(entry: FoodEntry) {
    try {
      StorageService.saveFoodEntry(entry);
      
      // Update user foods with new foods from this entry
      for (const food of entry.foods) {
        this.addOrUpdateUserFood({
          id: food.name.toLowerCase().replace(/\s+/g, '-'),
          name: food.name,
          carbsPer100g: food.carbsPer100g,
          lastUsed: new Date(),
          useCount: 1
        });
      }
      
      this.entries = [entry, ...this.entries.filter(e => e.id !== entry.id)];
      this.lastEntry = entry;
    } catch (error) {
      console.error("Failed to save food entry:", error);
      throw error;
    }
  }

  @action
  updateEntry(id: string, updates: Partial<FoodEntry>) {
    try {
      const entry = this.entries.find(e => e.id === id);
      if (!entry) throw new Error("Entry not found");
      
      const updatedEntry = { ...entry, ...updates };
      StorageService.saveFoodEntry(updatedEntry);
      
      const index = this.entries.findIndex(e => e.id === id);
      if (index !== -1) {
        this.entries[index] = updatedEntry;
      }
      if (this.lastEntry?.id === id) {
        this.lastEntry = updatedEntry;
      }
    } catch (error) {
      console.error("Failed to update food entry:", error);
      throw error;
    }
  }

  @action
  deleteEntry(id: string) {
    try {
      StorageService.deleteFoodEntry(id);
      this.entries = this.entries.filter(e => e.id !== id);
      if (this.lastEntry?.id === id) {
        this.lastEntry = this.entries.length > 0 ? this.entries[0] : null;
      }
    } catch (error) {
      console.error("Failed to delete food entry:", error);
      throw error;
    }
  }

  @action
  addOrUpdateUserFood(userFood: UserFood) {
    try {
      const existingFood = this.userFoods.find(f => f.id === userFood.id);
      
      if (existingFood) {
        existingFood.lastUsed = new Date();
        existingFood.useCount += 1;
        existingFood.carbsPer100g = userFood.carbsPer100g; // Update carb info
        StorageService.saveUserFood(existingFood);
      } else {
        StorageService.saveUserFood(userFood);
        this.userFoods = [userFood, ...this.userFoods];
      }
    } catch (error) {
      console.error("Failed to save user food:", error);
      throw error;
    }
  }

  @action
  deleteUserFood(id: string) {
    try {
      StorageService.deleteUserFood(id);
      this.userFoods = this.userFoods.filter(f => f.id !== id);
    } catch (error) {
      console.error("Failed to delete user food:", error);
      throw error;
    }
  }

  searchUserFoods(query: string): UserFood[] {
    if (!query.trim()) return this.userFoods;
    
    const lowerQuery = query.toLowerCase();
    return this.userFoods
      .filter(food => food.name.toLowerCase().includes(lowerQuery))
      .sort((a, b) => {
        // Sort by usage count (descending) then by last used (descending)
        if (a.useCount !== b.useCount) {
          return b.useCount - a.useCount;
        }
        return b.lastUsed.getTime() - a.lastUsed.getTime();
      });
  }

  getEntriesByDateRange(startDate: Date, endDate: Date): FoodEntry[] {
    return this.entries.filter(
      entry => 
        entry.timestamp >= startDate && 
        entry.timestamp <= endDate
    );
  }

  @computed
  get totalCarbsToday(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayEntries = this.getEntriesByDateRange(today, tomorrow);
    return todayEntries.reduce((total, entry) => total + entry.totalCarbs, 0);
  }

  @computed
  get entriesCountToday(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayEntries = this.getEntriesByDateRange(today, tomorrow);
    return todayEntries.length;
  }
}