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
      <Text variant="title">Added Foods</Text>
      
      {foods.map(food => (
        <Box 
          key={food.id} 
          backgroundColor="backgroundSecondary" 
          padding="m" 
          borderRadius="m"
        >
          <Row justifyContent="space-between" alignItems="center">
            <Column flex={1}>
              <Text variant="body">{food.name}</Text>
              <Text variant="caption" color="textLight">
                {food.weight}g • {food.totalCarbs.toFixed(1)}g carbs
              </Text>
            </Column>
            <TouchableOpacity onPress={() => onRemoveFood(food.id)}>
              <Text color="error">Remove</Text>
            </TouchableOpacity>
          </Row>
        </Box>
      ))}
      
      <Box backgroundColor="primary" padding="m" borderRadius="m">
        <Text variant="body" color="white" textAlign="center">
          Total Carbs: {totalCarbs.toFixed(1)}g
        </Text>
      </Box>
    </Column>
  );
};