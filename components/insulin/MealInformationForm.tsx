import React from "react";
import { Box, Card, Column, Text } from "../ui/Box";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Picker } from "../ui/Picker";

const MEAL_TIMES = [
  { label: "Breakfast", value: "breakfast" as const },
  { label: "Lunch", value: "lunch" as const },
  { label: "Dinner", value: "dinner" as const },
  { label: "Evening Snack", value: "eveningSnack" as const },
];

interface MealInformationFormProps {
  mealTime: "breakfast" | "lunch" | "dinner" | "eveningSnack";
  setMealTime: (value: "breakfast" | "lunch" | "dinner" | "eveningSnack") => void;
  carbs: string;
  setCarbs: (value: string) => void;
  currentGlucose: string;
  setCurrentGlucose: (value: string) => void;
  glucoseStatus: {
    status: "low" | "target" | "high";
    inRange: boolean;
  } | null;
  onCalculate: () => void;
}

export const MealInformationForm: React.FC<MealInformationFormProps> = ({
  mealTime,
  setMealTime,
  carbs,
  setCarbs,
  currentGlucose,
  setCurrentGlucose,
  glucoseStatus,
  onCalculate,
}) => {
  return (
    <Card variant="elevated">
      <Column gap="m">
        <Text variant="title">
          Meal Information
        </Text>

        <Column gap="m">
          <Column gap="s">
            <Text variant="body">
              Meal Time
            </Text>
            <Picker
              options={MEAL_TIMES}
              selectedValue={mealTime}
              onValueChange={(value) => setMealTime(value as any)}
              placeholder="Select meal time"
            />
          </Column>

          <Column gap="s">
            <Text variant="body">
              Carbohydrates (grams)
            </Text>
            <Input
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="numeric"
              placeholder="Enter carbs in grams"
            />
          </Column>

          <Column gap="s">
            <Text variant="body">
              Current Blood Glucose (mmol/L)
            </Text>
            <Input
              value={currentGlucose}
              onChangeText={setCurrentGlucose}
              keyboardType="numeric"
              placeholder="Enter current glucose"
            />
            {glucoseStatus && (
              <Box
                padding="s"
                backgroundColor="backgroundSecondary"
                borderRadius="s"
              >
                <Text
                  variant="caption"
                  color={
                    glucoseStatus.status === "low"
                      ? "error"
                      : glucoseStatus.status === "high"
                      ? "warning"
                      : "success"
                  }
                >
                  {glucoseStatus.status === "low"
                    ? "⚠️ Below target range"
                    : glucoseStatus.status === "high"
                    ? "⚠️ Above target range"
                    : "✓ In target range"}
                </Text>
              </Box>
            )}
          </Column>

          <Button
            label="Calculate Insulin Dose"
            onPress={onCalculate}
            variant="primary"
            fullWidth
            disabled={!carbs || !currentGlucose}
          />
        </Column>
      </Column>
    </Card>
  );
};