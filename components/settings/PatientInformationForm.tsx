import React, { useState, useEffect } from "react";
import { Box, Card, Column, Row, Text } from "../ui/Box";
import { DatePicker } from "../ui/DatePicker";
import { Input } from "../ui/Input";
import { MedicalSettings } from "../../types";
import { MedicalCalculator } from "../../utils/medical";
import { InputUtils } from "../../utils/input";
import { SectionHeader } from "./SectionHeader";
import { ValidationWarnings } from "./ValidationWarnings";

interface PatientInformationFormProps {
  settings: MedicalSettings;
  updateSetting: (path: string[], value: any) => void;
  warnings?: string[];
}

export const PatientInformationForm: React.FC<PatientInformationFormProps> = ({
  settings,
  updateSetting,
  warnings = [],
}) => {
  // Local state for numeric inputs
  const [heightText, setHeightText] = useState("");
  const [weightText, setWeightText] = useState("");

  // Initialize text values from settings
  useEffect(() => {
    setHeightText(InputUtils.formatNumberAllowEmpty(settings.patientInfo.height));
    setWeightText(InputUtils.formatNumberAllowEmpty(settings.patientInfo.weight));
  }, [settings.patientInfo.height, settings.patientInfo.weight]);
  return (
    <Card variant="elevated" marginBottom="m">
      <SectionHeader title="Patient Information" section="Patient Information" />
      <ValidationWarnings warnings={warnings} />

      <Column gap="m">
        <Column gap="s">
          <Text variant="body">
            Full Name
          </Text>
          <Input
            value={settings.patientInfo.name}
            onChangeText={(text) =>
              updateSetting(["patientInfo", "name"], text)
            }
            placeholder="Enter patient name"
          />
        </Column>

        <Row gap="s">
          <Column flex={1} gap="s">
            <Text variant="body">
              Height (cm)
            </Text>
            <Input
              value={heightText}
              onChangeText={setHeightText}
              onBlur={() => {
                const value = InputUtils.parseNumber(heightText, false);
                updateSetting(["patientInfo", "height"], value);
                setHeightText(InputUtils.formatNumberAllowEmpty(value));
              }}
              keyboardType="numeric"
              placeholder="e.g. 170"
            />
          </Column>
          <Column flex={1} gap="s">
            <Text variant="body">
              Weight (kg)
            </Text>
            <Input
              value={weightText}
              onChangeText={setWeightText}
              onBlur={() => {
                const value = InputUtils.parseNumber(weightText, false);
                updateSetting(["patientInfo", "weight"], value);
                setWeightText(InputUtils.formatNumberAllowEmpty(value));
              }}
              keyboardType="numeric"
              placeholder="e.g. 70"
            />
          </Column>
        </Row>

        <DatePicker
          label="Date of Birth"
          value={settings.patientInfo.dateOfBirth}
          onDateChange={(date) =>
            updateSetting(["patientInfo", "dateOfBirth"], date)
          }
          placeholder="Select date of birth"
          minimumDate={new Date(1900, 0, 1)}
          maximumDate={new Date()}
        />

        {settings.patientInfo.height > 0 &&
          settings.patientInfo.weight > 0 && (
            <Box
              padding="m"
              backgroundColor="backgroundSecondary"
              borderRadius="s"
            >
              <Column gap="xs">
                <Text
                  variant="caption"
                  color="textSecondary"
                >
                  Body Mass Index (BMI)
                </Text>
                <Text variant="body" color="text">
                  {MedicalCalculator.calculateBMI(
                    settings.patientInfo.height,
                    settings.patientInfo.weight
                  ).toFixed(1)}
                </Text>
              </Column>
            </Box>
          )}
      </Column>
    </Card>
  );
};