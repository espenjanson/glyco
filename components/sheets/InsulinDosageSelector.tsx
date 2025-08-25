import React from "react";
import { Box, Column, Row, Text } from "../ui/Box";
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
    onValueChange(newValue === 0 ? "" : newValue.toString());
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
        <Box
          flex={2}
          backgroundColor="backgroundSecondary"
          borderRadius="m"
          padding="m"
          alignItems="center"
          minHeight={60}
          justifyContent="center"
        >
          <Text variant="title" fontSize={32} lineHeight={40}>
            {value || "0"}
          </Text>
          <Text variant="caption" color="textLight">
            units
          </Text>
        </Box>
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
