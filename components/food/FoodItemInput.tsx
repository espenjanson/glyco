import { observer } from "mobx-react-lite";
import React from "react";
import { Alert } from "react-native";
import { useFoodStore } from "../../stores/StoreProvider";
import { FoodItem, UserFood } from "../../types";
import { Box, Column, Row, Text } from "../ui/Box";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { UserFoodSuggestions } from "./UserFoodSuggestions";

interface FoodItemInputProps {
  onAddFood: (food: FoodItem) => void;
}

export const FoodItemInput: React.FC<FoodItemInputProps> = observer(
  ({ onAddFood }) => {
    const [currentFood, setCurrentFood] = React.useState({
      name: "",
      weight: "",
      carbsPer100g: "",
    });
    const [userFoodSuggestions, setUserFoodSuggestions] = React.useState<
      UserFood[]
    >([]);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const foodStore = useFoodStore();

    const searchUserFoods = (query: string) => {
      if (query.length < 2) {
        setUserFoodSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const suggestions = foodStore.searchUserFoods(query);
      setUserFoodSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    };

    const handleFoodNameChange = (text: string) => {
      setCurrentFood((prev) => ({ ...prev, name: text }));
      searchUserFoods(text);
    };

    const selectUserFood = (food: UserFood) => {
      setCurrentFood({
        name: food.name,
        weight: "",
        carbsPer100g: food.carbsPer100g.toString(),
      });
      setShowSuggestions(false);
    };

    const addFood = () => {
      const weight = parseFloat(currentFood.weight);
      const carbsPer100g = parseFloat(currentFood.carbsPer100g);

      if (
        !currentFood.name.trim() ||
        isNaN(weight) ||
        weight <= 0 ||
        isNaN(carbsPer100g) ||
        carbsPer100g < 0
      ) {
        Alert.alert("Error", "Please fill in all fields with valid values");
        return;
      }

      const totalCarbs = (weight / 100) * carbsPer100g;
      const newFood: FoodItem = {
        id: Date.now().toString(),
        name: currentFood.name.trim(),
        weight,
        carbsPer100g,
        totalCarbs,
      };

      onAddFood(newFood);

      // Save to user foods library
      const userFood: UserFood = {
        id: Date.now().toString(),
        name: currentFood.name.trim(),
        carbsPer100g,
        lastUsed: new Date(),
        useCount: 1,
      };
      foodStore.addOrUpdateUserFood(userFood);

      // Reset current food
      setCurrentFood({ name: "", weight: "", carbsPer100g: "" });
      setShowSuggestions(false);
    };

    return (
      <Column gap="s">
        <Text variant="title">Add Food Item</Text>

        <Column gap="xs">
          <Text variant="caption">Food Name</Text>
          <Input
            value={currentFood.name}
            onChangeText={handleFoodNameChange}
            placeholder="e.g., Apple, Rice, Bread"
            variant="default"
          />

          {showSuggestions && (
            <UserFoodSuggestions
              suggestions={userFoodSuggestions}
              onSelect={selectUserFood}
            />
          )}
        </Column>

        <Row gap="s">
          <Box flex={1}>
            <Text variant="caption">Weight (g)</Text>
            <Input
              value={currentFood.weight}
              onChangeText={(text) =>
                setCurrentFood((prev) => ({ ...prev, weight: text }))
              }
              keyboardType="numeric"
              placeholder="100"
              variant="default"
            />
          </Box>

          <Box flex={1}>
            <Text variant="caption">Carbs per 100g</Text>
            <Input
              value={currentFood.carbsPer100g}
              onChangeText={(text) =>
                setCurrentFood((prev) => ({ ...prev, carbsPer100g: text }))
              }
              keyboardType="numeric"
              placeholder="15"
              variant="default"
            />
          </Box>
        </Row>

        <Button
          label="Add Food"
          onPress={addFood}
          variant="secondary"
          size="small"
          fullWidth
        />
      </Column>
    );
  }
);
