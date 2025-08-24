import React, { useState, useEffect } from "react";
import { INSULIN_TYPES, MEDICAL_HELP } from "../../constants/medical";
import { MedicalSettings } from "../../types";
import { InputUtils } from "../../utils/input";
import { SectionHeader } from "../settings/SectionHeader";
import { ValidationWarnings } from "../settings/ValidationWarnings";
import { Box, Card, Column, Row, Text } from "../ui/Box";
import { Input } from "../ui/Input";
import { Picker } from "../ui/Picker";
import { HelpTooltip } from "./HelpTooltip";

interface MealInsulinFormProps {
  settings: MedicalSettings;
  updateSetting: (path: string[], value: any) => void;
  warnings?: string[];
}

export const MealInsulinForm: React.FC<MealInsulinFormProps> = ({
  settings,
  updateSetting,
  warnings = [],
}) => {
  // Local state for carb ratio inputs
  const [breakfastText, setBreakfastText] = useState("");
  const [lunchText, setLunchText] = useState("");
  const [dinnerText, setDinnerText] = useState("");
  const [eveningSnackText, setEveningSnackText] = useState("");

  // Initialize text values from settings
  useEffect(() => {
    setBreakfastText(InputUtils.formatNumberAllowEmpty(settings.mealInsulin.carbRatios.breakfast));
    setLunchText(InputUtils.formatNumberAllowEmpty(settings.mealInsulin.carbRatios.lunch));
    setDinnerText(InputUtils.formatNumberAllowEmpty(settings.mealInsulin.carbRatios.dinner));
    setEveningSnackText(InputUtils.formatNumberAllowEmpty(settings.mealInsulin.carbRatios.eveningSnack));
  }, [settings.mealInsulin.carbRatios]);
  return (
    <Card variant="outlined" marginBottom="m">
      <Column gap="m">
        <Row alignItems="center">
          <Box flex={1}>
            <SectionHeader title="Meal Insulin" section="Meal Insulin" />
          </Box>
          <HelpTooltip title="Meal Insulin" content={MEDICAL_HELP.mealInsulin} />
        </Row>
        <Text variant="caption" color="textLight">
          Rapid-acting insulin for meal coverage
        </Text>
      </Column>
      <ValidationWarnings warnings={warnings} />

      <Column gap="m">
        <Column gap="s">
          <Text variant="body">
            Medication Type
          </Text>
          <Picker
            options={INSULIN_TYPES}
            selectedValue={settings.mealInsulin.medicationType}
            onValueChange={(value) =>
              updateSetting(["mealInsulin", "medicationType"], value)
            }
            placeholder="Select meal insulin"
          />
        </Column>

        <Row alignItems="center">
          <Text variant="body" color="textSecondary">
            Carbohydrate Ratios (units per 10g carbs)
          </Text>
          <HelpTooltip
            title="Carbohydrate Ratios"
            content={MEDICAL_HELP.carbRatio}
          />
        </Row>

        <Row gap="s">
          <Column flex={1} gap="s">
            <Text variant="caption">
              Breakfast
            </Text>
            <Input
              value={breakfastText}
              onChangeText={setBreakfastText}
              onBlur={() => {
                const value = InputUtils.parseNumber(breakfastText, true);
                updateSetting(["mealInsulin", "carbRatios", "breakfast"], value);
                setBreakfastText(InputUtils.formatNumberAllowEmpty(value));
              }}
              keyboardType="numeric"
              placeholder="e.g. 1.0"
            />
          </Column>
          <Column flex={1} gap="s">
            <Text variant="caption">
              Lunch
            </Text>
            <Input
              value={lunchText}
              onChangeText={setLunchText}
              onBlur={() => {
                const value = InputUtils.parseNumber(lunchText, true);
                updateSetting(["mealInsulin", "carbRatios", "lunch"], value);
                setLunchText(InputUtils.formatNumberAllowEmpty(value));
              }}
              keyboardType="numeric"
              placeholder="e.g. 1.2"
            />
          </Column>
          <Column flex={1} gap="s">
            <Text variant="caption">
              Dinner
            </Text>
            <Input
              value={dinnerText}
              onChangeText={setDinnerText}
              onBlur={() => {
                const value = InputUtils.parseNumber(dinnerText, true);
                updateSetting(["mealInsulin", "carbRatios", "dinner"], value);
                setDinnerText(InputUtils.formatNumberAllowEmpty(value));
              }}
              keyboardType="numeric"
              placeholder="e.g. 1.5"
            />
          </Column>
        </Row>

        <Column gap="s">
          <Text variant="caption">
            Evening Snack
          </Text>
          <Input
            value={eveningSnackText}
            onChangeText={setEveningSnackText}
            onBlur={() => {
              const value = InputUtils.parseNumber(eveningSnackText, true);
              updateSetting(["mealInsulin", "carbRatios", "eveningSnack"], value);
              setEveningSnackText(InputUtils.formatNumberAllowEmpty(value));
            }}
            keyboardType="numeric"
            placeholder="e.g. 1.0"
          />
        </Column>
      </Column>
    </Card>
  );
};
