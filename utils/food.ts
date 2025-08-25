export const FoodUtils = {
  getMealTypeByTime(time: Date): "breakfast" | "lunch" | "dinner" | "eveningSnack" {
    const hour = time.getHours();
    if (hour < 10) return "breakfast";
    if (hour < 15) return "lunch";
    if (hour < 20) return "dinner";
    return "eveningSnack";
  },

  calculateTotalCarbs(weight: number, carbsPer100g: number): number {
    return (weight / 100) * carbsPer100g;
  },
};