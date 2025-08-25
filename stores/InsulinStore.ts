import { action, computed, makeAutoObservable, observable } from "mobx";
import { InsulinShot } from "../types";
import { StorageService } from "../utils/storage";

export class InsulinStore {
  @observable shots: InsulinShot[] = [];
  @observable loading = false;
  @observable lastShot: InsulinShot | null = null;

  // Draft state - exact InsulinShot type
  @observable draft: InsulinShot = {
    id: "",
    type: "rapid",
    units: 0,
    timestamp: new Date(),
    notes: undefined,
    injectionSite: undefined,
  };

  // UI-specific state - no intermediate display conversion needed

  constructor() {
    makeAutoObservable(this);
    this.loadShots();
  }

  @action
  loadShots() {
    this.loading = true;
    try {
      const shots = StorageService.getInsulinShots();
      this.shots = shots;
      this.lastShot = shots.length > 0 ? shots[0] : null;
      this.loading = false;
    } catch (error) {
      console.error("Failed to load insulin shots:", error);
      this.loading = false;
    }
  }

  @action
  addShot(shot: InsulinShot) {
    try {
      StorageService.saveInsulinShot(shot);
      this.shots = [shot, ...this.shots.filter((s) => s.id !== shot.id)];
      this.lastShot = shot;
    } catch (error) {
      console.error("Failed to save insulin shot:", error);
      throw error;
    }
  }

  @action
  updateShot(id: string, updates: Partial<InsulinShot>) {
    try {
      const shot = this.shots.find((s) => s.id === id);
      if (!shot) throw new Error("Shot not found");

      const updatedShot = { ...shot, ...updates };
      StorageService.saveInsulinShot(updatedShot);

      const index = this.shots.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.shots[index] = updatedShot;
      }
      if (this.lastShot?.id === id) {
        this.lastShot = updatedShot;
      }
    } catch (error) {
      console.error("Failed to update insulin shot:", error);
      throw error;
    }
  }

  @action
  deleteShot(id: string) {
    try {
      StorageService.deleteInsulinShot(id);
      this.shots = this.shots.filter((s) => s.id !== id);
      if (this.lastShot?.id === id) {
        this.lastShot = this.shots.length > 0 ? this.shots[0] : null;
      }
    } catch (error) {
      console.error("Failed to delete insulin shot:", error);
      throw error;
    }
  }

  getShotsByDateRange(startDate: Date, endDate: Date): InsulinShot[] {
    return this.shots.filter(
      (shot) => shot.timestamp >= startDate && shot.timestamp <= endDate
    );
  }

  @computed
  get totalUnitsToday(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayShots = this.getShotsByDateRange(today, tomorrow);
    return todayShots.reduce((total, shot) => total + shot.units, 0);
  }

  @computed
  get shotsCountToday(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayShots = this.getShotsByDateRange(today, tomorrow);
    return todayShots.length;
  }

  getShotsByType(type: InsulinShot["type"]): InsulinShot[] {
    return this.shots.filter((shot) => shot.type === type);
  }

  // Draft shot management
  @action
  resetDraft() {
    this.draft.units = 0;
    this.draft.type = "rapid";
    this.draft.injectionSite = undefined;
    this.draft.notes = undefined;
    this.draft.timestamp = new Date();
  }

  @action
  setDraftUnits(units: number) {
    this.draft.units = units;
  }

  @action
  setDraftType(type: "rapid" | "long-acting" | "intermediate") {
    this.draft.type = type;
  }

  @action
  setDraftSite(site: string) {
    this.draft.injectionSite = site;
  }

  @action
  setDraftNotes(notes: string) {
    this.draft.notes = notes;
  }

  @action
  setDraftSelectedTime(time: Date) {
    this.draft.timestamp = time;
  }

  @computed
  get isDraftValid(): boolean {
    return this.draft.units > 0;
  }

  @action
  saveDraftShot() {
    if (this.draft.units <= 0) {
      throw new Error("Invalid units value");
    }

    const shot: InsulinShot = {
      id: Date.now().toString(),
      units: this.draft.units,
      type: this.draft.type,
      injectionSite: this.draft.injectionSite?.trim() || undefined,
      notes: this.draft.notes?.trim() || undefined,
      timestamp: this.draft.timestamp,
    };

    this.addShot(shot);
    this.resetDraft();
    return shot;
  }
}
