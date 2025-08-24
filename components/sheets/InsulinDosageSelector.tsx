import React from "react";
import { Box, Column, Row, Text, TouchableBox } from "../ui/Box";
import { Button } from "../ui/Button";

interface InsulinDosageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const InsulinDosageSelector: React.FC<InsulinDosageSelectorProps> = ({
  value,
  onValueChange,
}) => {
  const handleStepChange = (increment: number) => {
    const currentValue = parseFloat(value) || 0;
    const newValue = Math.max(0, currentValue + increment);
    // Round to 1 decimal place to handle floating point precision
    const roundedValue = Math.round(newValue * 10) / 10;
    onValueChange(roundedValue === 0 ? "" : roundedValue.toString());
  };

  const formatDisplayValue = (): string => {
    if (!value) return "0";
    const numValue = parseFloat(value);
    return isNaN(numValue) ? "0" : numValue.toString();
  };

  return (
    <Column gap="s">
      <Text variant="body">Insulin Dosage (units)</Text>
      <Row alignItems="center" gap="s">
        <Box flex={1}>
          <Button
            label="-0.5"
            onPress={() => handleStepChange(-0.5)}
            variant="outline"
            fullWidth
          />
        </Box>
        <TouchableBox
          flex={2}
          backgroundColor="backgroundSecondary"
          borderRadius="m"
          padding="m"
          alignItems="center"
          minHeight={60}
          justifyContent="center"
        >
          <Text variant="title" fontSize={32} lineHeight={40}>
            {formatDisplayValue()}
          </Text>
          <Text variant="caption" color="textLight">
            units
          </Text>
        </TouchableBox>
        <Box flex={1}>
          <Button
            label="+0.5"
            onPress={() => handleStepChange(0.5)}
            variant="outline"
            fullWidth
          />
        </Box>
      </Row>
    </Column>
  );
};
