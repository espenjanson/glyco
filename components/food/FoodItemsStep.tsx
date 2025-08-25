import { observer } from "mobx-react-lite";
import React from "react";
import { useFoodStore } from "../../stores/StoreProvider";
import { Column, Text } from "../ui/Box";
import { FoodItemInput } from "./FoodItemInput";
import { FoodItemsList } from "./FoodItemsList";

export const FoodItemsStep: React.FC = observer(() => {
  const foodStore = useFoodStore();
  return (
    <Column gap="l">
      <FoodItemInput onAddFood={foodStore.addDraftFood} />
      <FoodItemsList
        foods={foodStore.draftFoods}
        onRemoveFood={foodStore.removeDraftFood}
      />
      {foodStore.draftFoods.length === 0 && (
        <Text variant="caption" color="textLight" textAlign="center">
          Add at least one food item to continue
        </Text>
      )}
    </Column>
  );
});

FoodItemsStep.displayName = "FoodItemsStep";
