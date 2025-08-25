import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { INSULIN_TYPES, MEDICAL_HELP } from "../../constants/medical";
import { useSettingsStore } from "../../stores/StoreProvider";
import { InputUtils } from "../../utils/input";
import { HelpTooltip } from "../medical/HelpTooltip";
import { Box, Column, Row, Text } from "../ui/Box";
import { CustomTimePicker } from "../ui/CustomDatePicker";
import { Input } from "../ui/Input";
import { Picker } from "../ui/Picker";
import { Switch } from "../ui/Switch";
import { EditableSection } from "./EditableSection";

export const EditableBasalInsulinForm: React.FC = observer(() => {
  const settingsStore = useSettingsStore();
  const settings = settingsStore.medicalSettings;
  const warnings = settingsStore.sectionWarnings["Basal Insulin"] || [];

  if (!settings) return null;

  // Local form state
  const [formData, setFormData] = useState({
    medicationType: "",
    unitsPerDose: "",
    frequency: "once" as "once" | "twice",
    timing: null as Date | null,
    timingMorning: null as Date | null,
    timingEvening: null as Date | null,
  });

  // Convert HH:MM string to Date object for picker
  const timeStringToDate = (timeString: string): Date | null => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Convert Date object to HH:MM string for storage
  const dateToTimeString = (date: Date | null): string => {
    if (!date) return "";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Initialize form data from settings
  useEffect(() => {
    setFormData({
      medicationType: settings.basalInsulin.medicationType,
      unitsPerDose: InputUtils.formatNumberAllowEmpty(
        settings.basalInsulin.unitsPerDose
      ),
      frequency: settings.basalInsulin.frequency,
      timing: timeStringToDate(settings.basalInsulin.timing),
      timingMorning: timeStringToDate(
        settings.basalInsulin.timingMorning || "08:00"
      ),
      timingEvening: timeStringToDate(
        settings.basalInsulin.timingEvening || "22:00"
      ),
    });
  }, [settings.basalInsulin]);

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      medicationType: settings.basalInsulin.medicationType,
      unitsPerDose: InputUtils.formatNumberAllowEmpty(
        settings.basalInsulin.unitsPerDose
      ),
      frequency: settings.basalInsulin.frequency,
      timing: timeStringToDate(settings.basalInsulin.timing),
      timingMorning: timeStringToDate(
        settings.basalInsulin.timingMorning || "08:00"
      ),
      timingEvening: timeStringToDate(
        settings.basalInsulin.timingEvening || "22:00"
      ),
    });
  };

  const validation = (): string[] | null => {
    const errors: string[] = [];

    if (!formData.medicationType) {
      errors.push("Medication type is required");
    }

    const unitsPerDose = InputUtils.parseNumber(formData.unitsPerDose, true);
    if (unitsPerDose <= 0) {
      errors.push("Units per dose must be greater than 0");
    } else if (unitsPerDose > 100) {
      errors.push("Units per dose seems unusually high (>100)");
    }

    if (formData.frequency === "once") {
      if (!formData.timing) {
        errors.push("Administration time is required");
      }
    } else {
      if (!formData.timingMorning) {
        errors.push("Morning dose time is required");
      }
      if (!formData.timingEvening) {
        errors.push("Evening dose time is required");
      }
    }

    return errors.length > 0 ? errors : null;
  };

  const handleSave = () => {
    const unitsPerDose = InputUtils.parseNumber(formData.unitsPerDose, true);

    // Update all fields at once
    const updates = {
      basalInsulin: {
        ...settings.basalInsulin,
        medicationType: formData.medicationType,
        unitsPerDose,
        frequency: formData.frequency,
        timing: dateToTimeString(formData.timing),
        timingMorning: dateToTimeString(formData.timingMorning),
        timingEvening: dateToTimeString(formData.timingEvening),
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
              Long-acting insulin for background glucose control
            </Text>
          </Box>
          <HelpTooltip
            title="Basal Insulin"
            content={MEDICAL_HELP.basalInsulin}
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
            placeholder="Select basal insulin"
          />
        </Box>
      </Column>

      <Column gap="s">
        <Text variant="body">Units per Dose</Text>
        <Input
          value={formData.unitsPerDose}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, unitsPerDose: text }))
          }
          keyboardType="numeric"
          placeholder="e.g. 20"
          editable={isEditing}
          style={{ opacity: isEditing ? 1 : 0.6 }}
        />
      </Column>

      <Column gap="xs">
        <Row justifyContent="space-between" alignItems="center">
          <Text variant="body">Twice Daily Administration</Text>
          <Box
            opacity={isEditing ? 1 : 0.6}
            pointerEvents={isEditing ? "auto" : "none"}
          >
            <Switch
              value={formData.frequency === "twice"}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  frequency: value ? "twice" : "once",
                }))
              }
            />
          </Box>
        </Row>
        <Text variant="caption" color="textLight">
          Enable if you take basal insulin twice per day
        </Text>
      </Column>

      {formData.frequency === "once" ? (
        <CustomTimePicker
          label="Administration Time"
          value={formData.timing}
          onChange={(time) =>
            setFormData((prev) => ({ ...prev, timing: time }))
          }
          placeholder="22:00"
          disabled={!isEditing}
        />
      ) : (
        <Row gap="s">
          <Box flex={1}>
            <CustomTimePicker
              label="Morning Dose Time"
              value={formData.timingMorning}
              onChange={(time) =>
                setFormData((prev) => ({ ...prev, timingMorning: time }))
              }
              placeholder="08:00"
              disabled={!isEditing}
            />
          </Box>
          <Box flex={1}>
            <CustomTimePicker
              label="Evening Dose Time"
              value={formData.timingEvening}
              onChange={(time) =>
                setFormData((prev) => ({ ...prev, timingEvening: time }))
              }
              placeholder="22:00"
              disabled={!isEditing}
            />
          </Box>
        </Row>
      )}
    </Column>
  );

  return (
    <EditableSection
      title="Basal Insulin"
      onSave={handleSave}
      onCancel={handleCancel}
      validation={validation}
      warnings={warnings}
    >
      {renderContent}
    </EditableSection>
  );
});

EditableBasalInsulinForm.displayName = "EditableBasalInsulinForm";
