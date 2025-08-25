import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { INSULIN_TYPES, MEDICAL_HELP } from "../../constants/medical";
import { useSettingsStore } from "../../stores/StoreProvider";
import { InputUtils } from "../../utils/input";
import { HelpTooltip } from "../medical/HelpTooltip";
import { Box, Column, Row, Text } from "../ui/Box";
import { Input } from "../ui/Input";
import { Picker } from "../ui/Picker";
import { EditableSection } from "./EditableSection";

export const EditableMealInsulinForm: React.FC = observer(() => {
  const settingsStore = useSettingsStore();
  const settings = settingsStore.medicalSettings;
  const warnings = settingsStore.sectionWarnings["Meal Insulin"] || [];

  if (!settings) return null;

  // Local form state
  const [formData, setFormData] = useState({
    medicationType: "",
    breakfastRatio: "",
    lunchRatio: "",
    dinnerRatio: "",
    eveningSnackRatio: "",
  });

  // Initialize form data from settings
  useEffect(() => {
    setFormData({
      medicationType: settings.mealInsulin.medicationType,
      breakfastRatio: InputUtils.formatNumberAllowEmpty(
        settings.mealInsulin.carbRatios.breakfast
      ),
      lunchRatio: InputUtils.formatNumberAllowEmpty(
        settings.mealInsulin.carbRatios.lunch
      ),
      dinnerRatio: InputUtils.formatNumberAllowEmpty(
        settings.mealInsulin.carbRatios.dinner
      ),
      eveningSnackRatio: InputUtils.formatNumberAllowEmpty(
        settings.mealInsulin.carbRatios.eveningSnack
      ),
    });
  }, [settings.mealInsulin]);

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      medicationType: settings.mealInsulin.medicationType,
      breakfastRatio: InputUtils.formatNumberAllowEmpty(
        settings.mealInsulin.carbRatios.breakfast
      ),
      lunchRatio: InputUtils.formatNumberAllowEmpty(
        settings.mealInsulin.carbRatios.lunch
      ),
      dinnerRatio: InputUtils.formatNumberAllowEmpty(
        settings.mealInsulin.carbRatios.dinner
      ),
      eveningSnackRatio: InputUtils.formatNumberAllowEmpty(
        settings.mealInsulin.carbRatios.eveningSnack
      ),
    });
  };

  const validation = (): string[] | null => {
    const errors: string[] = [];

    if (!formData.medicationType) {
      errors.push("Medication type is required");
    }

    const breakfastRatio = InputUtils.parseNumber(
      formData.breakfastRatio,
      true
    );
    const lunchRatio = InputUtils.parseNumber(formData.lunchRatio, true);
    const dinnerRatio = InputUtils.parseNumber(formData.dinnerRatio, true);
    const eveningSnackRatio = InputUtils.parseNumber(
      formData.eveningSnackRatio,
      true
    );

    if (breakfastRatio <= 0) {
      errors.push("Breakfast carb ratio must be greater than 0");
    } else if (breakfastRatio > 10) {
      errors.push("Breakfast carb ratio seems unusually high (>10)");
    }

    if (lunchRatio <= 0) {
      errors.push("Lunch carb ratio must be greater than 0");
    } else if (lunchRatio > 10) {
      errors.push("Lunch carb ratio seems unusually high (>10)");
    }

    if (dinnerRatio <= 0) {
      errors.push("Dinner carb ratio must be greater than 0");
    } else if (dinnerRatio > 10) {
      errors.push("Dinner carb ratio seems unusually high (>10)");
    }

    if (eveningSnackRatio <= 0) {
      errors.push("Evening snack carb ratio must be greater than 0");
    } else if (eveningSnackRatio > 10) {
      errors.push("Evening snack carb ratio seems unusually high (>10)");
    }

    return errors.length > 0 ? errors : null;
  };

  const handleSave = () => {
    const breakfastRatio = InputUtils.parseNumber(
      formData.breakfastRatio,
      true
    );
    const lunchRatio = InputUtils.parseNumber(formData.lunchRatio, true);
    const dinnerRatio = InputUtils.parseNumber(formData.dinnerRatio, true);
    const eveningSnackRatio = InputUtils.parseNumber(
      formData.eveningSnackRatio,
      true
    );

    // Update all fields at once
    const updates = {
      mealInsulin: {
        ...settings.mealInsulin,
        medicationType: formData.medicationType,
        carbRatios: {
          breakfast: breakfastRatio,
          lunch: lunchRatio,
          dinner: dinnerRatio,
          eveningSnack: eveningSnackRatio,
        },
      },
    };

    settingsStore.updateMedicalSettings(updates);
  };

  const renderContent = (isEditing: boolean) => (
    <Column gap="m">
      <Column gap="m">
        <Row alignItems="center">
          <Box flex={1}>
            <Text variant="caption" color="textLight">
              Rapid-acting insulin for meal coverage
            </Text>
          </Box>
          <HelpTooltip
            title="Meal Insulin"
            content={MEDICAL_HELP.mealInsulin}
          />
        </Row>
      </Column>

      <Column gap="s">
        <Text variant="body">Medication Type</Text>
        <Box
          opacity={isEditing ? 1 : 0.6}
          pointerEvents={isEditing ? "auto" : "none"}
        >
          <Picker
            options={INSULIN_TYPES}
            selectedValue={formData.medicationType}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, medicationType: value }))
            }
            placeholder="Select meal insulin"
          />
        </Box>
      </Column>

      <Row alignItems="center">
        <Text variant="body" color="textSecondary">
          Carbohydrate Ratios (units per 1g carbs)
        </Text>
        <HelpTooltip
          title="Carbohydrate Ratios"
          content={MEDICAL_HELP.carbRatio}
        />
      </Row>

      <Row gap="s">
        <Column flex={1} gap="s">
          <Text variant="caption">Breakfast</Text>
          <Input
            value={formData.breakfastRatio}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, breakfastRatio: text }))
            }
            keyboardType="numeric"
            placeholder="e.g. 1.0"
            editable={isEditing}
            opacity={isEditing ? 1 : 0.6}
          />
        </Column>
        <Column flex={1} gap="s">
          <Text variant="caption">Lunch</Text>
          <Input
            value={formData.lunchRatio}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, lunchRatio: text }))
            }
            keyboardType="numeric"
            placeholder="e.g. 1.2"
            editable={isEditing}
            opacity={isEditing ? 1 : 0.6}
          />
        </Column>
        <Column flex={1} gap="s">
          <Text variant="caption">Dinner</Text>
          <Input
            value={formData.dinnerRatio}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, dinnerRatio: text }))
            }
            keyboardType="numeric"
            placeholder="e.g. 1.5"
            editable={isEditing}
            opacity={isEditing ? 1 : 0.6}
          />
        </Column>
      </Row>

      <Column gap="s">
        <Text variant="caption">Evening Snack</Text>
        <Input
          value={formData.eveningSnackRatio}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, eveningSnackRatio: text }))
          }
          keyboardType="numeric"
          placeholder="e.g. 1.0"
          editable={isEditing}
          opacity={isEditing ? 1 : 0.6}
        />
      </Column>
    </Column>
  );

  return (
    <EditableSection
      title="Meal Insulin"
      onSave={handleSave}
      onCancel={handleCancel}
      validation={validation}
      warnings={warnings}
    >
      {renderContent}
    </EditableSection>
  );
});

EditableMealInsulinForm.displayName = "EditableMealInsulinForm";
