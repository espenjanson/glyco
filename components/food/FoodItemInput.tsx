import { observer } from "mobx-react-lite";
import React from "react";
import { Alert } from "react-native";
import { useFoodStore } from "../../stores/StoreProvider";
import { Box, Column, Row, Text } from "../ui/Box";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { FoodTimeStep } from "./FoodTimeStep";
import { UserFoodSuggestions } from "./UserFoodSuggestions";

interface FoodItemInputProps {}

export const FoodItemInput: React.FC<FoodItemInputProps> = observer(() => {
  const foodStore = useFoodStore();

  const handleAddFood = () => {
    try {
      foodStore.addFoodItemFromDraft();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to add food item"
      );
    }
  };

  return (
    <Column gap="s">
      <FoodTimeStep />
      <Text variant="title">Add Food Item</Text>

      <Column gap="xs">
        <Text variant="caption">Food Name</Text>
        <Input
          value={foodStore.draftFoodItem.name}
          onChangeText={(value) => foodStore.setDraftFoodItemName(value)}
          placeholder="e.g., Apple, Rice, Bread"
        />

        {foodStore.showSuggestions && (
          <UserFoodSuggestions
            suggestions={foodStore.userFoodSuggestions}
            onSelect={(suggestion) => {
              foodStore.selectUserFoodSuggestion(suggestion);
            }}
          />
        )}
      </Column>

      <Row gap="s">
        <Box flex={1}>
          <Text variant="caption">Weight (g)</Text>
          <Input
            value={foodStore.draftFoodItem.weight}
            onChangeText={(value) => foodStore.setDraftFoodItemWeight(value)}
            keyboardType="numeric"
            placeholder="100"
          />
        </Box>

        <Box flex={1}>
          <Text variant="caption">Carbs per 100g</Text>
          <Input
            value={foodStore.draftFoodItem.carbsPer100g}
            onChangeText={(value) =>
              foodStore.setDraftFoodItemCarbsPer100g(value)
            }
            keyboardType="numeric"
            placeholder="15"
          />
        </Box>
      </Row>

      <Button
        label="Add Food"
        onPress={handleAddFood}
        variant="secondary"
        size="small"
        fullWidth
        disabled={!foodStore.isDraftFoodItemValid}
      />
    </Column>
  );
});
