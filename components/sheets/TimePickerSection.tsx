import React from "react";
import { Box, Column, Row, Text, TouchableBox } from "../ui/Box";
import { Button } from "../ui/Button";

interface TimePickerSectionProps {
  selectedTime: Date;
  onTimeChange: (increment: number) => void;
  onShowTimePicker: () => void;
}

export const TimePickerSection: React.FC<TimePickerSectionProps> = ({
  selectedTime,
  onTimeChange,
  onShowTimePicker,
}) => {
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <Column gap="s">
      <Text variant="body">Time</Text>
      <Row alignItems="center" gap="s">
        <Box flex={1}>
          <Button
            label="-5m"
            onPress={() => onTimeChange(-5)}
            variant="outline"
            fullWidth
          />
        </Box>
        <TouchableBox
          flex={2}
          onPress={onShowTimePicker}
          backgroundColor="backgroundSecondary"
          borderRadius="m"
          padding="m"
          alignItems="center"
        >
          <Text variant="title">{formatTime(selectedTime)}</Text>
          <Text variant="caption" color="textLight">
            {selectedTime.toLocaleDateString()}
          </Text>
        </TouchableBox>
        <Box flex={1}>
          <Button
            label="+5m"
            onPress={() => onTimeChange(5)}
            variant="outline"
            fullWidth
          />
        </Box>
      </Row>
    </Column>
  );
};