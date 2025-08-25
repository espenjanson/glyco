import { observer } from "mobx-react-lite";
import React from "react";
import { useFoodStore } from "../../stores/StoreProvider";
import { FoodUtils } from "../../utils/food";
import { Box, Column, Text } from "../ui/Box";
import { CustomDatePicker } from "../ui/CustomDatePicker";

export const FoodTimeStep: React.FC = observer(() => {
  const foodStore = useFoodStore();
  return (
    <Column gap="l">
      <CustomDatePicker
        label="Date & Time"
        value={foodStore.draftSelectedTime}
        onChange={foodStore.setDraftTime}
        mode="datetime"
        maximumDate={new Date()}
      />

      <Box>
        <Text variant="caption" color="textLight" textAlign="center">
          Meal type: {FoodUtils.getMealTypeByTime(foodStore.draftSelectedTime)}
        </Text>
      </Box>
    </Column>
  );
});

FoodTimeStep.displayName = "FoodTimeStep";
