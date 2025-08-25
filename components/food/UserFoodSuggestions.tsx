import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { UserFood } from "../../types";
import { Box, Text } from "../ui/Box";

interface UserFoodSuggestionsProps {
  suggestions: UserFood[];
  onSelect: (food: UserFood) => void;
}

export const UserFoodSuggestions: React.FC<UserFoodSuggestionsProps> = ({
  suggestions,
  onSelect,
}) => {
  return (
    <Box 
      backgroundColor="backgroundSecondary" 
      borderRadius="m" 
      padding="s"
      maxHeight={150}
    >
      <ScrollView>
        {suggestions.map(food => (
          <TouchableOpacity 
            key={food.id} 
            onPress={() => onSelect(food)}
          >
            <Box padding="s" borderBottomWidth={1} borderColor="border">
              <Text variant="body">{food.name}</Text>
              <Text variant="caption" color="textLight">
                {food.carbsPer100g}g carbs per 100g
              </Text>
            </Box>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Box>
  );
};