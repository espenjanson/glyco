import React from "react";
import { TimePickerModal } from "../common/TimePickerModal";
import { FoodUtils } from "../../utils/food";
import { Box, Column, Text } from "../ui/Box";
import { TimePickerSection } from "../sheets/TimePickerSection";

interface FoodTimeStepProps {
  selectedTime: Date;
  showTimePicker: boolean;
  onTimeChange: (increment: number) => void;
  onShowTimePicker: () => void;
  onTimePickerChange: (date: Date) => void;
  onCloseTimePicker: () => void;
}

export const FoodTimeStep: React.FC<FoodTimeStepProps> = ({
  selectedTime,
  showTimePicker,
  onTimeChange,
  onShowTimePicker,
  onTimePickerChange,
  onCloseTimePicker,
}) => {
  return (
    <Column gap="l">
      <TimePickerSection
        selectedTime={selectedTime}
        onTimeChange={onTimeChange}
        onShowTimePicker={onShowTimePicker}
      />
      
      <TimePickerModal
        visible={showTimePicker}
        value={selectedTime}
        onChange={onTimePickerChange}
        onClose={onCloseTimePicker}
      />

      <Box>
        <Text variant="caption" color="textLight" textAlign="center">
          Meal type: {FoodUtils.getMealTypeByTime(selectedTime)}
        </Text>
      </Box>
    </Column>
  );
};