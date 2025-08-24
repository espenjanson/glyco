import React from "react";
import { GlucoseUnit, UserSettings } from "../../types";
import { Box, Card, Column, Row, Text } from "../ui/Box";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Switch } from "../ui/Switch";
import { SectionHeader } from "./SectionHeader";

interface AppSettingsFormProps {
  settings: UserSettings;
  updateSetting: <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => void;
}

export const AppSettingsForm: React.FC<AppSettingsFormProps> = ({
  settings,
  updateSetting,
}) => {
  const handleGlucoseUnitChange = (newUnit: GlucoseUnit) => {
    if (newUnit === settings.glucoseUnit) return;

    // Update unit setting
    updateSetting("glucoseUnit", newUnit);
  };
  return (
    <Card variant="elevated" marginBottom="m">
      <SectionHeader title="App Settings" section="App Settings" />

      <Column gap="m">
        <Column gap="s">
          <Text variant="body">
            Glucose Units
          </Text>
          <Row gap="s">
            <Box flex={1}>
              <Button
                label="mmol/L"
                onPress={() => handleGlucoseUnitChange("mmol/L")}
                variant={
                  settings.glucoseUnit === "mmol/L" ? "primary" : "outline"
                }
                fullWidth
              />
            </Box>
            <Box flex={1}>
              <Button
                label="mg/dL"
                onPress={() => handleGlucoseUnitChange("mg/dL")}
                variant={
                  settings.glucoseUnit === "mg/dL" ? "primary" : "outline"
                }
                fullWidth
              />
            </Box>
          </Row>
        </Column>

        <Row
          justifyContent="space-between"
          alignItems="center"
        >
          <Text variant="body">Enable Reminders</Text>
          <Switch
            value={settings.remindersEnabled}
            onValueChange={(value) => updateSetting("remindersEnabled", value)}
          />
        </Row>

        {settings.remindersEnabled && (
          <Column gap="s">
            <Text variant="body">
              Reminder Times
            </Text>
            <Text variant="caption" color="textLight">
              Set times for glucose testing reminders
            </Text>
            <Column gap="s">
              {settings.reminderTimes.map((time, index) => (
                <Input
                  key={index}
                  value={time}
                  onChangeText={(newTime) => {
                    const newTimes = [...settings.reminderTimes];
                    newTimes[index] = newTime;
                    updateSetting("reminderTimes", newTimes);
                  }}
                  placeholder="HH:MM"
                />
              ))}
            </Column>
          </Column>
        )}
      </Column>
    </Card>
  );
};
