import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useGlucoseStore, useSettingsStore } from "../../stores/StoreProvider";
import { FoodItem, GlucoseUnit } from "../../types";
import { FoodUtils } from "../../utils/food";
import { GlucoseConverter } from "../../utils/glucose";
import { MedicalCalculator } from "../../utils/medical";
import { Box, Column, Row, Text } from "../ui/Box";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface FoodReviewStepProps {
  selectedTime: Date;
  foods: FoodItem[];
  totalCarbs: number;
  notes: string;
  glucoseUnit: GlucoseUnit;
  onNotesChange: (notes: string) => void;
  onInsulinCalculation: (calc: any, glucose: string) => void;
  onAddGlucoseReading?: () => void;
}

export const FoodReviewStep: React.FC<FoodReviewStepProps> = observer(
  ({
    selectedTime,
    foods,
    totalCarbs,
    notes,
    glucoseUnit,
    onNotesChange,
    onInsulinCalculation,
    onAddGlucoseReading,
  }) => {
    const glucoseStore = useGlucoseStore();
    const settingsStore = useSettingsStore();

    const [insulinCalculation, setInsulinCalculation] = useState<any>(null);

    const lastGlucose = glucoseStore.lastReading;
    const glucoseAge = glucoseStore.lastReadingAge;
    const medicalSettingsValid = settingsStore.isMedicalSettingsConfigured;

    const calculateInsulin = () => {
      if (
        !lastGlucose ||
        !medicalSettingsValid ||
        !settingsStore.medicalSettings
      )
        return;

      const mealType = FoodUtils.getMealTypeByTime(selectedTime);
      const glucoseInMmol = lastGlucose.value; // Already in mmol/L

      const calc = MedicalCalculator.calculateInsulinDose(
        totalCarbs,
        glucoseInMmol,
        mealType,
        settingsStore.medicalSettings
      );

      setInsulinCalculation(calc);
      onInsulinCalculation(calc, lastGlucose.value.toString());
    };

    useEffect(() => {
      if (lastGlucose && medicalSettingsValid && totalCarbs > 0) {
        calculateInsulin();
      }
    }, [lastGlucose, medicalSettingsValid, totalCarbs]);

    const formatGlucoseValue = (value: number) => {
      const displayValue = GlucoseConverter.storageToDisplay(
        value,
        glucoseUnit
      );
      return GlucoseConverter.formatForDisplay(displayValue, glucoseUnit);
    };

    const isGlucoseStale = glucoseStore.isLastReadingStale;

    return (
      <Column gap="l">
        {/* Meal Summary */}
        <Box backgroundColor="backgroundSecondary" padding="m" borderRadius="m">
          <Column gap="s">
            <Text variant="title">Meal Summary</Text>
            <Row justifyContent="space-between">
              <Text variant="caption" color="textLight">
                Time:
              </Text>
              <Text variant="caption" color="text">
                {selectedTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Row>
            <Row justifyContent="space-between">
              <Text variant="caption" color="textLight">
                Meal type:
              </Text>
              <Text variant="caption" color="text">
                {FoodUtils.getMealTypeByTime(selectedTime)}
              </Text>
            </Row>
            <Row justifyContent="space-between">
              <Text variant="caption" color="textLight">
                Total carbs:
              </Text>
              <Text variant="caption" color="text" fontWeight="bold">
                {totalCarbs.toFixed(1)}g
              </Text>
            </Row>
            <Box marginTop="xs">
              <Text variant="caption" color="textLight">
                Foods:
              </Text>
              {foods.map((food, index) => (
                <Text
                  key={food.id}
                  variant="caption"
                  color="text"
                  marginLeft="s"
                >
                  • {food.name} ({food.weight}g)
                </Text>
              ))}
            </Box>
          </Column>
        </Box>

        {/* Glucose Status */}
        <Box>
          {lastGlucose ? (
            <Column gap="s">
              <Row justifyContent="space-between" alignItems="center">
                <Text variant="body">Current Glucose</Text>
                <Text variant="body" color={isGlucoseStale ? "error" : "text"}>
                  {formatGlucoseValue(lastGlucose.value)} {glucoseUnit}
                </Text>
              </Row>
              <Row justifyContent="space-between" alignItems="center">
                <Text variant="caption" color="textLight">
                  Last reading:
                </Text>
                <Text
                  variant="caption"
                  color={isGlucoseStale ? "error" : "textLight"}
                >
                  {glucoseAge < 60
                    ? `${glucoseAge} min ago`
                    : `${Math.floor(glucoseAge / 60)}h ${glucoseAge % 60}m ago`}
                </Text>
              </Row>
              {isGlucoseStale && (
                <Box backgroundColor="warning" padding="m" borderRadius="m">
                  <Column gap="s">
                    <Text variant="body" color="text">
                      Glucose Reading is Stale
                    </Text>
                    <Text variant="caption" color="textLight">
                      Your last glucose reading is over 20 minutes old. For
                      accurate insulin calculation, consider taking a new
                      reading.
                    </Text>
                    {onAddGlucoseReading && (
                      <Button
                        label="Take New Reading"
                        onPress={onAddGlucoseReading}
                        variant="secondary"
                        size="small"
                        fullWidth
                      />
                    )}
                  </Column>
                </Box>
              )}
            </Column>
          ) : (
            <Box backgroundColor="error" padding="m" borderRadius="m">
              <Column gap="s">
                <Text variant="body" color="white">
                  No Glucose Reading Available
                </Text>
                <Text variant="caption" color="white">
                  A glucose reading is required for insulin calculation.
                </Text>
                {onAddGlucoseReading && (
                  <Button
                    label="Add Glucose Reading"
                    onPress={onAddGlucoseReading}
                    variant="secondary"
                    size="small"
                    fullWidth
                  />
                )}
              </Column>
            </Box>
          )}
        </Box>

        {/* Insulin Calculation */}
        {medicalSettingsValid && lastGlucose && insulinCalculation ? (
          <Box backgroundColor="primary" padding="m" borderRadius="m">
            <Column gap="s">
              <Text variant="title" color="white">
                Recommended Insulin Dose
              </Text>

              {/* Breakdown */}
              <Row justifyContent="space-between">
                <Text variant="caption" color="white">
                  Meal insulin:
                </Text>
                <Text variant="caption" color="white">
                  {insulinCalculation.mealInsulin.toFixed(1)} units
                </Text>
              </Row>
              <Row justifyContent="space-between">
                <Text variant="caption" color="white">
                  Correction insulin:
                </Text>
                <Text variant="caption" color="white">
                  {insulinCalculation.correctionInsulin.toFixed(1)} units
                </Text>
              </Row>

              <Box height={1} backgroundColor="white" opacity={0.3} />

              <Row justifyContent="space-between">
                <Text variant="subheader" color="white">
                  Total:
                </Text>
                <Text variant="subheader" color="white" fontWeight="bold">
                  {insulinCalculation.totalInsulin.toFixed(1)} units
                </Text>
              </Row>

              {isGlucoseStale && (
                <Text variant="caption" color="white" opacity={0.8}>
                  ⚠️ Based on {glucoseAge}min old glucose reading
                </Text>
              )}
            </Column>
          </Box>
        ) : !medicalSettingsValid ? (
          <Box backgroundColor="warning" padding="m" borderRadius="m">
            <Column gap="s">
              <Text variant="body" color="text">
                Medical Settings Required
              </Text>
              <Text variant="caption" color="textLight">
                Configure your insulin settings in the Settings tab to calculate
                doses.
              </Text>
            </Column>
          </Box>
        ) : null}

        {/* Notes */}
        <Column gap="s">
          <Text variant="body">Notes (Optional)</Text>
          <Input
            value={notes}
            onChangeText={onNotesChange}
            placeholder="Add context about the meal"
            variant="multiline"
          />
        </Column>
      </Column>
    );
  }
);
