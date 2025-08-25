import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useSettingsStore } from "../../stores/StoreProvider";
import { MedicalSettings } from "../../types";
import { InputUtils } from "../../utils/input";
import { MedicalCalculator } from "../../utils/medical";
import { Box, Column, Row, Text } from "../ui/Box";
import { CustomDatePicker } from "../ui/CustomDatePicker";
import { Input } from "../ui/Input";
import { EditableSection } from "./EditableSection";

interface EditablePatientInformationFormProps {
  settings: MedicalSettings;
  warnings?: string[];
}

export const EditablePatientInformationForm: React.FC<EditablePatientInformationFormProps> =
  observer(({ settings, warnings = [] }) => {
    const settingsStore = useSettingsStore();

    // Local form state
    const [formData, setFormData] = useState({
      name: "",
      height: "",
      weight: "",
      dateOfBirth: null as Date | null,
    });

    // Initialize form data from settings
    useEffect(() => {
      setFormData({
        name: settings.patientInfo.name,
        height: InputUtils.formatNumberAllowEmpty(settings.patientInfo.height),
        weight: InputUtils.formatNumberAllowEmpty(settings.patientInfo.weight),
        dateOfBirth: settings.patientInfo.dateOfBirth
          ? new Date(settings.patientInfo.dateOfBirth)
          : null,
      });
    }, [settings.patientInfo]);

    const handleCancel = () => {
      // Reset form data to original values
      setFormData({
        name: settings.patientInfo.name,
        height: InputUtils.formatNumberAllowEmpty(settings.patientInfo.height),
        weight: InputUtils.formatNumberAllowEmpty(settings.patientInfo.weight),
        dateOfBirth: settings.patientInfo.dateOfBirth
          ? new Date(settings.patientInfo.dateOfBirth)
          : null,
      });
    };

    const validation = (): string[] | null => {
      const errors: string[] = [];

      if (!formData.name.trim()) {
        errors.push("Name is required");
      }

      const height = InputUtils.parseNumber(formData.height, false);
      const weight = InputUtils.parseNumber(formData.weight, false);

      if (height <= 0) {
        errors.push("Height must be greater than 0");
      } else if (height < 100 || height > 250) {
        errors.push("Height must be between 100 and 250 cm");
      }

      if (weight <= 0) {
        errors.push("Weight must be greater than 0");
      } else if (weight < 20 || weight > 500) {
        errors.push("Weight must be between 20 and 500 kg");
      }

      if (!formData.dateOfBirth) {
        errors.push("Date of birth is required");
      } else {
        const today = new Date();
        const age = today.getFullYear() - formData.dateOfBirth.getFullYear();
        if (age < 0 || age > 120) {
          errors.push("Please enter a valid date of birth");
        }
      }

      return errors.length > 0 ? errors : null;
    };

    const handleSave = () => {
      const height = InputUtils.parseNumber(formData.height, false);
      const weight = InputUtils.parseNumber(formData.weight, false);

      // Update all fields at once
      const updates = {
        patientInfo: {
          ...settings.patientInfo,
          name: formData.name.trim(),
          height,
          weight,
          dateOfBirth: formData.dateOfBirth
            ? formData.dateOfBirth.toISOString().slice(0, 23)
            : "",
        },
      };

      settingsStore.updateMedicalSettings(updates);
    };

    const renderContent = (isEditing: boolean) => (
      <Column gap="m">
        <Column gap="s">
          <Text variant="body">Full Name</Text>
          <Input
            value={formData.name}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
            placeholder="Enter patient name"
            editable={isEditing}
            style={{ opacity: isEditing ? 1 : 0.6 }}
          />
        </Column>

        <Row gap="s">
          <Column flex={1} gap="s">
            <Text variant="body">Height (cm)</Text>
            <Input
              value={formData.height}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, height: text }))
              }
              keyboardType="numeric"
              placeholder="e.g. 170"
              editable={isEditing}
              style={{ opacity: isEditing ? 1 : 0.6 }}
            />
          </Column>
          <Column flex={1} gap="s">
            <Text variant="body">Weight (kg)</Text>
            <Input
              value={formData.weight}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, weight: text }))
              }
              keyboardType="numeric"
              placeholder="e.g. 70"
              editable={isEditing}
              style={{ opacity: isEditing ? 1 : 0.6 }}
            />
          </Column>
        </Row>

        <CustomDatePicker
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={(date) =>
            setFormData((prev) => ({ ...prev, dateOfBirth: date }))
          }
          placeholder="Select date of birth"
          minimumDate={new Date(1900, 0, 1)}
          maximumDate={new Date()}
          disabled={!isEditing}
        />

        {/* BMI Calculation */}
        {(() => {
          const height = InputUtils.parseNumber(formData.height, false);
          const weight = InputUtils.parseNumber(formData.weight, false);

          if (height > 0 && weight > 0) {
            return (
              <Box
                padding="m"
                backgroundColor="backgroundSecondary"
                borderRadius="s"
              >
                <Column gap="xs">
                  <Text variant="caption" color="textSecondary">
                    Body Mass Index (BMI)
                  </Text>
                  <Text variant="body" color="text">
                    {MedicalCalculator.calculateBMI(height, weight).toFixed(1)}
                  </Text>
                </Column>
              </Box>
            );
          }
          return null;
        })()}
      </Column>
    );

    return (
      <EditableSection
        title="Patient Information"
        onSave={handleSave}
        onCancel={handleCancel}
        validation={validation}
        warnings={warnings}
      >
        {renderContent}
      </EditableSection>
    );
  });

EditablePatientInformationForm.displayName = "EditablePatientInformationForm";
