import React from "react";
import { TouchableOpacity } from "react-native";
import { FoodItem } from "../../types";
import { Box, Column, Row, Text } from "../ui/Box";

interface FoodItemsListProps {
  foods: FoodItem[];
  onRemoveFood: (id: string) => void;
}

export const FoodItemsList: React.FC<FoodItemsListProps> = ({
  foods,
  onRemoveFood,
}) => {
  const totalCarbs = foods.reduce((sum, food) => sum + food.totalCarbs, 0);

  if (foods.length === 0) return null;

  return (
    <Column gap="s">
      <Text variant="caption">Added Foods</Text>
      <Box gap="m">
        {foods.map((food) => (
          <Box
            key={food.id}
            backgroundColor="backgroundSecondary"
            borderBottomWidth={1}
            borderBottomColor="border"
            paddingBottom="m"
          >
            <Row justifyContent="space-between" alignItems="center">
              <Column flex={1}>
                <Text variant="body">{food.name}</Text>
                <Text variant="caption" color="textLight">
                  {food.weight}g • {food.totalCarbs.toFixed(1)}g carbs
                </Text>
              </Column>
              <TouchableOpacity onPress={() => onRemoveFood(food.id)}>
                <Text variant={"bodySmall"} color="error">
                  Remove
                </Text>
              </TouchableOpacity>
            </Row>
          </Box>
        ))}

        <Box>
          <Text variant="body" color="black" textAlign="right">
            Total Carbs: {totalCarbs.toFixed(1)}g
          </Text>
        </Box>
      </Box>
    </Column>
  );
};
