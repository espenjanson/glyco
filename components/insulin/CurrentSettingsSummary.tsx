import React from "react";
import { Box, Card, Column, Text } from "../ui/Box";
import { MedicalSettings } from "../../types";

interface CurrentSettingsSummaryProps {
  medicalSettings: MedicalSettings;
}

export const CurrentSettingsSummary: React.FC<CurrentSettingsSummaryProps> = ({
  medicalSettings,
}) => {
  return (
    <Card variant="outlined">
      <Column gap="m">
        <Text variant="title">
          Your Current Settings
        </Text>

        <Column gap="s">
          <Column gap="xs">
            <Text variant="caption" color="textSecondary">
              Carb Ratios (units per 10g):
            </Text>
            <Text variant="body">
              Breakfast:{" "}
              {medicalSettings.mealInsulin.carbRatios.breakfast}, Lunch:{" "}
              {medicalSettings.mealInsulin.carbRatios.lunch}, Dinner:{" "}
              {medicalSettings.mealInsulin.carbRatios.dinner}, Snack:{" "}
              {medicalSettings.mealInsulin.carbRatios.eveningSnack}
            </Text>
          </Column>

          <Column gap="xs">
            <Text variant="caption" color="textSecondary">
              Correction Factor:
            </Text>
            <Text variant="body">
              {medicalSettings.correctionInsulin.correctionFactor} mmol/L
              per unit
            </Text>
          </Column>

          <Column gap="xs">
            <Text variant="caption" color="textSecondary">
              Target Range:
            </Text>
            <Text variant="body">
              {medicalSettings.correctionInsulin.targetGlucoseMin} -{" "}
              {medicalSettings.correctionInsulin.targetGlucoseMax} mmol/L
            </Text>
          </Column>
        </Column>
      </Column>
    </Card>
  );
};