import React from "react";
import { FoodItem } from "../../types";
import { Column, Text } from "../ui/Box";
import { FoodItemInput } from "./FoodItemInput";
import { FoodItemsList } from "./FoodItemsList";

interface FoodItemsStepProps {
  foods: FoodItem[];
  onAddFood: (food: FoodItem) => void;
  onRemoveFood: (id: string) => void;
}

export const FoodItemsStep: React.FC<FoodItemsStepProps> = ({
  foods,
  onAddFood,
  onRemoveFood,
}) => {
  return (
    <Column gap="l">
      <FoodItemInput onAddFood={onAddFood} />
      <FoodItemsList foods={foods} onRemoveFood={onRemoveFood} />
      {foods.length === 0 && (
        <Text variant="caption" color="textLight" textAlign="center">
          Add at least one food item to continue
        </Text>
      )}
    </Column>
  );
};