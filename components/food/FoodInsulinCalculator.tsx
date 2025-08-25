import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useSettingsStore } from "../../stores/StoreProvider";
import { GlucoseUnit } from "../../types";
import { DevSetup } from "../../utils/dev-setup";
import { FoodUtils } from "../../utils/food";
import { GlucoseConverter } from "../../utils/glucose";
import { MedicalCalculator } from "../../utils/medical";
import { Box, Column, Row, Text } from "../ui/Box";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface FoodInsulinCalculatorProps {
  totalCarbs: number;
  selectedTime: Date;
  glucoseUnit: GlucoseUnit;
  onCalculationComplete: (calculation: any, glucose: string) => void;
}

export const FoodInsulinCalculator: React.FC<FoodInsulinCalculatorProps> =
  observer(
    ({ totalCarbs, selectedTime, glucoseUnit, onCalculationComplete }) => {
      const [currentGlucose, setCurrentGlucose] = useState("");
      const [showResult, setShowResult] = useState(false);
      const [calculation, setCalculation] = useState<any>(null);
      const [medicalSettingsValid, setMedicalSettingsValid] = useState(false);
      const settingsStore = useSettingsStore();

      const checkMedicalSettings = () => {
        const medicalSettings = settingsStore.medicalSettings;
        if (!medicalSettings) {
          setMedicalSettingsValid(false);
          return;
        }

        const mealType = FoodUtils.getMealTypeByTime(selectedTime);
        const carbRatio = medicalSettings.mealInsulin.carbRatios[mealType];

        // Carb ratios are stored as-is (units per 10g), but correction values are in mmol/L
        const isValid =
          carbRatio > 0 &&
          medicalSettings.correctionInsulin.correctionFactor > 0 &&
          medicalSettings.correctionInsulin.targetGlucoseMin > 0 &&
          medicalSettings.correctionInsulin.targetGlucoseMax > 0 &&
          medicalSettings.correctionInsulin.targetGlucoseMin <
            medicalSettings.correctionInsulin.targetGlucoseMax;
        setMedicalSettingsValid(isValid);
      };

      const setupTestSettings = () => {
        DevSetup.setupBasicMedicalSettings();
        checkMedicalSettings();
        Alert.alert(
          "Success",
          "Basic medical settings have been configured for testing!"
        );
      };

      useEffect(() => {
        checkMedicalSettings();
      }, [checkMedicalSettings]);

      const calculateInsulin = () => {
        if (!currentGlucose) {
          Alert.alert(
            "Error",
            "Please enter current glucose to calculate insulin"
          );
          return;
        }

        const glucose = parseFloat(currentGlucose);
        if (isNaN(glucose) || glucose <= 0) {
          Alert.alert("Error", "Please enter a valid glucose value");
          return;
        }

        const medicalSettings = settingsStore.medicalSettings;
        if (!medicalSettings) {
          Alert.alert("Error", "Medical settings not available");
          return;
        }

        // Validate medical settings before calculation
        const mealType = FoodUtils.getMealTypeByTime(selectedTime);
        const carbRatio = medicalSettings.mealInsulin.carbRatios[mealType];

        if (carbRatio <= 0) {
          Alert.alert(
            "Medical Settings Required",
            `Please configure your carb ratio for ${mealType} in the Settings tab before calculating insulin doses.`
          );
          return;
        }

        if (medicalSettings.correctionInsulin.correctionFactor <= 0) {
          Alert.alert(
            "Medical Settings Required",
            "Please configure your correction factor in the Settings tab before calculating insulin doses."
          );
          return;
        }

        if (
          medicalSettings.correctionInsulin.targetGlucoseMin <= 0 ||
          medicalSettings.correctionInsulin.targetGlucoseMax <= 0 ||
          medicalSettings.correctionInsulin.targetGlucoseMin >=
            medicalSettings.correctionInsulin.targetGlucoseMax
        ) {
          Alert.alert(
            "Medical Settings Required",
            "Please configure your target glucose range in the Settings tab before calculating insulin doses."
          );
          return;
        }

        const glucoseInMmol = GlucoseConverter.inputToStorage(
          glucose,
          glucoseUnit
        );

        const calc = MedicalCalculator.calculateInsulinDose(
          totalCarbs,
          glucoseInMmol,
          mealType,
          medicalSettings
        );

        setCalculation(calc);
        setShowResult(true);
        onCalculationComplete(calc, currentGlucose);
      };

      return (
        <Column gap="s">
          <Text variant="title">Insulin Calculation (Optional)</Text>

          {!medicalSettingsValid && (
            <Box backgroundColor="warning" padding="m" borderRadius="m">
              <Column gap="s">
                <Text variant="body" color="text">
                  Medical Settings Required
                </Text>
                <Text variant="caption" color="textLight">
                  Configure your insulin settings in the Settings tab to enable
                  dose calculations.
                </Text>
                <Button
                  label="Setup Test Settings"
                  onPress={setupTestSettings}
                  variant="secondary"
                  size="small"
                  fullWidth
                />
              </Column>
            </Box>
          )}

          <Row gap="s" alignItems="flex-end">
            <Box flex={1}>
              <Text variant="caption">Current Glucose ({glucoseUnit})</Text>
              <Input
                value={currentGlucose}
                onChangeText={setCurrentGlucose}
                keyboardType="numeric"
                placeholder={GlucoseConverter.getPlaceholder(
                  glucoseUnit,
                  "reading"
                )}
                variant="default"
              />
            </Box>
            <Button
              label="Calculate"
              onPress={calculateInsulin}
              variant="secondary"
              size="small"
              disabled={totalCarbs === 0 || !medicalSettingsValid}
            />
          </Row>

          {showResult && calculation && (
            <Box backgroundColor="info" padding="m" borderRadius="m">
              <Column gap="xs">
                <Text variant="body">Recommended Insulin Dose</Text>
                <Text variant="caption">
                  Meal insulin: {calculation.mealInsulin.toFixed(1)} units
                </Text>
                <Text variant="caption">
                  Correction insulin: {calculation.correctionInsulin.toFixed(1)}{" "}
                  units
                </Text>
                <Text variant="subheader" color="primary">
                  Total: {calculation.totalInsulin.toFixed(1)} units
                </Text>
              </Column>
            </Box>
          )}
        </Column>
      );
    }
  );
