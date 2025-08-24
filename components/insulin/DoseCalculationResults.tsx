import React from "react";
import { Box, Card, Column, Text } from "../ui/Box";
import { Button } from "../ui/Button";
import { InsulinCalculation } from "../../utils/medical";

interface DoseCalculationResultsProps {
  calculation: InsulinCalculation;
  onSave: () => void;
  saving: boolean;
}

export const DoseCalculationResults: React.FC<DoseCalculationResultsProps> = ({
  calculation,
  onSave,
  saving,
}) => {
  return (
    <Card variant="outlined">
      <Column gap="m">
        <Text variant="title">
          Recommended Dose
        </Text>

        <Box
          padding="m"
          backgroundColor="backgroundSecondary"
          borderRadius="s"
        >
          <Column gap="s">
            <Text variant="header" color="primary">
              {Math.round(calculation.totalInsulin * 2) / 2} units
            </Text>
            <Text variant="caption" color="textSecondary">
              Total insulin dose (rounded to nearest 0.5 units)
            </Text>
          </Column>
        </Box>

        <Column gap="s">
          <Text variant="body">
            Breakdown:
          </Text>
          <Column gap="xs">
            <Text variant="caption" color="textSecondary">
              • Meal insulin: {calculation.mealInsulin.toFixed(1)} units
            </Text>
            <Text variant="caption" color="textSecondary">
              • Correction insulin:{" "}
              {calculation.correctionInsulin.toFixed(1)} units
            </Text>
          </Column>
        </Column>

        <Box
          padding="m"
          backgroundColor="backgroundSecondary"
          borderRadius="s"
        >
          <Column gap="xs">
            <Text variant="caption" color="textSecondary">
              Calculation Details:
            </Text>
            <Text variant="caption" color="textLight">
              {calculation.reasoning}
            </Text>
          </Column>
        </Box>

        <Button
          label="Save Insulin Shot"
          onPress={onSave}
          variant="primary"
          fullWidth
          loading={saving}
        />
      </Column>
    </Card>
  );
};