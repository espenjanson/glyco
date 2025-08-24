import React, { useState, useEffect } from "react";
import { INSULIN_TYPES, MEDICAL_HELP } from "../../constants/medical";
import { MedicalSettings } from "../../types";
import { InputUtils } from "../../utils/input";
import { SectionHeader } from "../settings/SectionHeader";
import { ValidationWarnings } from "../settings/ValidationWarnings";
import { Box, Card, Column, Row, Text } from "../ui/Box";
import { Input } from "../ui/Input";
import { Picker } from "../ui/Picker";
import { Switch } from "../ui/Switch";
import { TimePicker } from "../ui/TimePicker";
import { HelpTooltip } from "./HelpTooltip";

interface BasalInsulinFormProps {
  settings: MedicalSettings;
  updateSetting: (path: string[], value: any) => void;
  warnings?: string[];
}

export const BasalInsulinForm: React.FC<BasalInsulinFormProps> = ({
  settings,
  updateSetting,
  warnings = [],
}) => {
  // Local state for units per dose input
  const [unitsPerDoseText, setUnitsPerDoseText] = useState("");

  // Initialize text value from settings
  useEffect(() => {
    setUnitsPerDoseText(InputUtils.formatNumberAllowEmpty(settings.basalInsulin.unitsPerDose));
  }, [settings.basalInsulin.unitsPerDose]);
  return (
    <Card variant="outlined" marginBottom="m">
      <Row alignItems="center" marginBottom="m">
        <Box flex={1}>
          <SectionHeader title="Basal Insulin" section="Basal Insulin" />
        </Box>
        <HelpTooltip
          title="Basal Insulin"
          content={MEDICAL_HELP.basalInsulin}
        />
      </Row>
      <Text variant="caption" color="textLight" marginBottom="m">
        Long-acting insulin for background glucose control
      </Text>
      <ValidationWarnings warnings={warnings} />

      <Column gap="m">
        <Column gap="s">
          <Text variant="body">
            Medication Type
          </Text>
          <Picker
            options={INSULIN_TYPES}
            selectedValue={settings.basalInsulin.medicationType}
            onValueChange={(value) =>
              updateSetting(["basalInsulin", "medicationType"], value)
            }
            placeholder="Select basal insulin"
          />
        </Column>

        <Column gap="s">
          <Text variant="body">
            Units per Dose
          </Text>
          <Input
            value={unitsPerDoseText}
            onChangeText={setUnitsPerDoseText}
            onBlur={() => {
              const value = InputUtils.parseNumber(unitsPerDoseText, true);
              updateSetting(["basalInsulin", "unitsPerDose"], value);
              setUnitsPerDoseText(InputUtils.formatNumberAllowEmpty(value));
            }}
            keyboardType="numeric"
            placeholder="e.g. 20"
          />
        </Column>

        <Column gap="xs">
          <Row justifyContent="space-between" alignItems="center">
            <Text variant="body">Twice Daily Administration</Text>
            <Switch
              value={settings.basalInsulin.frequency === "twice"}
              onValueChange={(value) =>
                updateSetting(["basalInsulin", "frequency"], value ? "twice" : "once")
              }
            />
          </Row>
          <Text variant="caption" color="textLight">
            Enable if you take basal insulin twice per day
          </Text>
        </Column>

        {settings.basalInsulin.frequency === "once" ? (
          <TimePicker
            label="Administration Time"
            value={settings.basalInsulin.timing}
            onTimeChange={(time) =>
              updateSetting(["basalInsulin", "timing"], time)
            }
            placeholder="22:00"
          />
        ) : (
          <Row gap="s">
            <Box flex={1}>
              <TimePicker
                label="Morning Dose Time"
                value={settings.basalInsulin.timingMorning || "08:00"}
                onTimeChange={(time) =>
                  updateSetting(["basalInsulin", "timingMorning"], time)
                }
                placeholder="08:00"
              />
            </Box>
            <Box flex={1}>
              <TimePicker
                label="Evening Dose Time"
                value={settings.basalInsulin.timingEvening || "22:00"}
                onTimeChange={(time) =>
                  updateSetting(["basalInsulin", "timingEvening"], time)
                }
                placeholder="22:00"
              />
            </Box>
          </Row>
        )}
      </Column>
    </Card>
  );
};
