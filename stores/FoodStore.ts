import { action, computed, makeAutoObservable, observable } from "mobx";
import { FoodEntry, FoodItem, UserFood } from "../types";
import { FoodUtils } from "../utils/food";
import { GlucoseConverter } from "../utils/glucose";
import { InputUtils } from "../utils/input";
import { StorageService } from "../utils/storage";

export class FoodStore {
  @observable entries: FoodEntry[] = [];
  @observable userFoods: UserFood[] = [];
  @observable loading = false;
  @observable lastEntry: FoodEntry | null = null;

  // Draft state - exact FoodEntry type
  @observable draft: FoodEntry = {
    id: "",
    foods: [],
    totalCarbs: 0,
    mealType: undefined,
    timestamp: new Date(),
    notes: undefined,
    insulinCalculation: undefined,
  };

  // UI-specific state for food item input
  @observable draftFoodItem = {
    name: "",
    weight: "",
    carbsPer100g: "",
  };
  @observable userFoodSuggestions: UserFood[] = [];
  @observable showSuggestions = false;
  @observable currentGlucose = "";

  constructor() {
    makeAutoObservable(this);
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
          id: food.name.toLowerCase().replace(/\s+/g, "-"),
          name: food.name,
          carbsPer100g: food.carbsPer100g,
          lastUsed: new Date(),
          useCount: 1,
        });
      }

      this.entries = [entry, ...this.entries.filter((e) => e.id !== entry.id)];
      this.lastEntry = entry;
    } catch (error) {
      console.error("Failed to save food entry:", error);
      throw error;
    }
  }

  @action
  updateEntry(id: string, updates: Partial<FoodEntry>) {
    try {
      const entry = this.entries.find((e) => e.id === id);
      if (!entry) throw new Error("Entry not found");

      const updatedEntry = { ...entry, ...updates };
      StorageService.saveFoodEntry(updatedEntry);

      const index = this.entries.findIndex((e) => e.id === id);
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
      this.entries = this.entries.filter((e) => e.id !== id);
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
      const existingFood = this.userFoods.find((f) => f.id === userFood.id);

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
      this.userFoods = this.userFoods.filter((f) => f.id !== id);
    } catch (error) {
      console.error("Failed to delete user food:", error);
      throw error;
    }
  }

  searchUserFoods(query: string): UserFood[] {
    if (!query.trim()) return this.userFoods;

    const lowerQuery = query.toLowerCase();
    return this.userFoods
      .filter((food) => food.name.toLowerCase().includes(lowerQuery))
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
      (entry) => entry.timestamp >= startDate && entry.timestamp <= endDate
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

  // Draft entry management
  @action
  resetDraft() {
    this.draft.id = "";
    this.draft.foods = [];
    this.draft.totalCarbs = 0;
    this.draft.mealType = undefined;
    this.draft.timestamp = new Date();
    this.draft.notes = undefined;
    this.draft.insulinCalculation = undefined;
    this.currentGlucose = "";
    this.resetDraftFoodItem();
  }

  // Draft food item management
  @action
  resetDraftFoodItem() {
    this.draftFoodItem = {
      name: "",
      weight: "",
      carbsPer100g: "",
    };
    this.userFoodSuggestions = [];
    this.showSuggestions = false;
  }

  @action
  setDraftFoodItemName = (name: string) => {
    this.draftFoodItem.name = name;
    this.searchUserFoodsForSuggestions(name);
  };

  @action
  setDraftFoodItemWeight = (weight: string) => {
    this.draftFoodItem.weight = weight;
  };

  @action
  setDraftFoodItemCarbsPer100g = (carbsPer100g: string) => {
    this.draftFoodItem.carbsPer100g = carbsPer100g;
  };

  @action
  searchUserFoodsForSuggestions(query: string) {
    if (query.length < 2) {
      this.userFoodSuggestions = [];
      this.showSuggestions = false;
      return;
    }

    const suggestions = this.searchUserFoods(query);
    this.userFoodSuggestions = suggestions;
    this.showSuggestions = suggestions.length > 0;
  }

  @action
  selectUserFoodSuggestion(food: UserFood) {
    this.draftFoodItem = {
      name: food.name,
      weight: "",
      carbsPer100g: food.carbsPer100g.toString(),
    };
    this.showSuggestions = false;
  }

  @action
  addFoodItemFromDraft = (): FoodItem | null => {
    const weight = InputUtils.parseNumber(this.draftFoodItem.weight, true);
    const carbsPer100g = InputUtils.parseNumber(
      this.draftFoodItem.carbsPer100g,
      true
    );

    if (
      !this.draftFoodItem.name.trim() ||
      isNaN(weight) ||
      weight <= 0 ||
      isNaN(carbsPer100g) ||
      carbsPer100g < 0
    ) {
      throw new Error("Please fill in all fields with valid values");
    }

    const totalCarbs = (weight / 100) * carbsPer100g;
    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: this.draftFoodItem.name.trim(),
      weight,
      carbsPer100g,
      totalCarbs,
    };

    // Add to draft foods list
    this.addDraftFood(newFood);

    // Save to user foods library
    const userFood: UserFood = {
      id: Date.now().toString(),
      name: this.draftFoodItem.name.trim(),
      carbsPer100g,
      lastUsed: new Date(),
      useCount: 1,
    };
    this.addOrUpdateUserFood(userFood);

    // Reset the draft food item
    this.resetDraftFoodItem();

    return newFood;
  };

  @computed
  get isDraftFoodItemValid(): boolean {
    const weight = InputUtils.parseNumber(this.draftFoodItem.weight, true);
    const carbsPer100g = InputUtils.parseNumber(
      this.draftFoodItem.carbsPer100g,
      true
    );

    return (
      this.draftFoodItem.name.trim().length > 0 &&
      !isNaN(weight) &&
      weight > 0 &&
      !isNaN(carbsPer100g) &&
      carbsPer100g >= 0
    );
  }

  @action
  setDraftTime(time: Date) {
    this.draft.timestamp = time;
  }

  @action
  addDraftFood(food: FoodItem) {
    this.draft.foods = [...(this.draft.foods || []), food];
  }

  @action
  removeDraftFood(id: string) {
    this.draft.foods = (this.draft.foods || []).filter((f) => f.id !== id);
  }

  @action
  setDraftNotes(notes: string) {
    this.draft.notes = notes;
  }

  @action
  setDraftInsulinCalculation(calculation: any, glucose: string) {
    this.draft.insulinCalculation = calculation;
    this.currentGlucose = glucose;
  }

  @computed
  get draftTotalCarbs(): number {
    return (this.draft.foods || []).reduce(
      (sum, food) => sum + food.totalCarbs,
      0
    );
  }

  @computed
  get draftMealType(): "breakfast" | "lunch" | "dinner" | "eveningSnack" {
    return FoodUtils.getMealTypeByTime(this.draft.timestamp);
  }

  @action
  saveDraftEntry(userGlucoseUnit: "mmol/L" | "mg/dL") {
    const entry: FoodEntry = {
      id: Date.now().toString(),
      foods: [...(this.draft.foods || [])],
      totalCarbs: this.draftTotalCarbs,
      mealType: this.draftMealType,
      timestamp: this.draft.timestamp,
      notes: this.draft.notes?.trim() || undefined,
    };

    if (this.draft.insulinCalculation && this.currentGlucose) {
      const glucose = InputUtils.parseNumber(this.currentGlucose, true);
      const glucoseInMmol = GlucoseConverter.inputToStorage(
        glucose,
        userGlucoseUnit
      );
      entry.insulinCalculation = {
        ...this.draft.insulinCalculation,
        currentGlucose: glucoseInMmol,
      };
    }

    this.addEntry(entry);
    this.resetDraft();
    return entry;
  }
}
