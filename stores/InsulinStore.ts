import { observable, action, computed } from "mobx";
import { InsulinShot } from "../types";
import { StorageService } from "../utils/storage";

export class InsulinStore {
  @observable shots: InsulinShot[] = [];
  @observable loading = false;
  @observable lastShot: InsulinShot | null = null;

  constructor() {
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
      this.shots = [shot, ...this.shots.filter(s => s.id !== shot.id)];
      this.lastShot = shot;
    } catch (error) {
      console.error("Failed to save insulin shot:", error);
      throw error;
    }
  }

  @action
  updateShot(id: string, updates: Partial<InsulinShot>) {
    try {
      const shot = this.shots.find(s => s.id === id);
      if (!shot) throw new Error("Shot not found");
      
      const updatedShot = { ...shot, ...updates };
      StorageService.saveInsulinShot(updatedShot);
      
      const index = this.shots.findIndex(s => s.id === id);
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
      this.shots = this.shots.filter(s => s.id !== id);
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
      shot => 
        shot.timestamp >= startDate && 
        shot.timestamp <= endDate
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
    return this.shots.filter(shot => shot.type === type);
  }
}