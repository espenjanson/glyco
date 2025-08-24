import React, { useState, useEffect } from "react";
import { MEDICAL_HELP } from "../../constants/medical";
import { GlucoseUnit, MedicalSettings } from "../../types";
import { GlucoseConverter } from "../../utils/glucose";
import { InputUtils } from "../../utils/input";
import { SectionHeader } from "../settings/SectionHeader";
import { ValidationWarnings } from "../settings/ValidationWarnings";
import { Box, Card, Column, Row, Text } from "../ui/Box";
import { Input } from "../ui/Input";
import { HelpTooltip } from "./HelpTooltip";

interface CorrectionInsulinFormProps {
  settings: MedicalSettings;
  updateSetting: (path: string[], value: any) => void;
  warnings?: string[];
  glucoseUnit: GlucoseUnit;
}

export const CorrectionInsulinForm: React.FC<CorrectionInsulinFormProps> = ({
  settings,
  updateSetting,
  warnings = [],
  glucoseUnit,
}) => {
  // Local state for text inputs to handle partial decimal entries
  const [correctionFactorText, setCorrectionFactorText] = useState("");
  const [targetMinText, setTargetMinText] = useState("");
  const [targetMaxText, setTargetMaxText] = useState("");

  // Initialize text values from settings when component mounts or settings change
  useEffect(() => {
    const correctionFactorDisplay = GlucoseConverter.storageToDisplay(
      settings.correctionInsulin.correctionFactor,
      glucoseUnit
    );
    const targetMinDisplay = GlucoseConverter.storageToDisplay(
      settings.correctionInsulin.targetGlucoseMin,
      glucoseUnit
    );
    const targetMaxDisplay = GlucoseConverter.storageToDisplay(
      settings.correctionInsulin.targetGlucoseMax,
      glucoseUnit
    );

    setCorrectionFactorText(
      correctionFactorDisplay === 0 ? "" : correctionFactorDisplay.toString()
    );
    setTargetMinText(
      targetMinDisplay === 0 ? "" : targetMinDisplay.toString()
    );
    setTargetMaxText(
      targetMaxDisplay === 0 ? "" : targetMaxDisplay.toString()
    );
  }, [settings.correctionInsulin, glucoseUnit]);
  return (
    <Card variant="outlined" marginBottom="m">
      <Column gap="m">
        <Row alignItems="center">
          <Box flex={1}>
            <SectionHeader
              title="Correction Insulin"
              section="Correction Insulin"
            />
          </Box>
          <HelpTooltip
            title="Correction Insulin"
            content={MEDICAL_HELP.correctionInsulin}
          />
        </Row>
        <Text variant="caption" color="textLight">
          Rapid-acting insulin for high blood glucose correction
        </Text>
      </Column>
      <ValidationWarnings warnings={warnings} />

      <Column gap="m">
        <Column gap="s">
          <Row alignItems="center">
            <Text variant="body">Correction Factor</Text>
            <HelpTooltip
              title="Correction Factor"
              content={MEDICAL_HELP.correctionFactor}
            />
          </Row>
          <Text variant="caption" color="textLight">
            How much 1 unit of insulin lowers blood glucose ({GlucoseConverter.getUnitLabel(glucoseUnit)})
          </Text>
          <Input
            value={correctionFactorText}
            onChangeText={setCorrectionFactorText}
            onBlur={() => {
              const displayValue = InputUtils.parseNumber(correctionFactorText, true);
              const storageValue = GlucoseConverter.inputToStorage(displayValue, glucoseUnit);
              updateSetting(["correctionInsulin", "correctionFactor"], storageValue);
              
              // Update local state to formatted value after blur
              const formattedDisplay = GlucoseConverter.storageToDisplay(storageValue, glucoseUnit);
              setCorrectionFactorText(formattedDisplay === 0 ? "" : formattedDisplay.toString());
            }}
            keyboardType="numeric"
            placeholder={GlucoseConverter.getPlaceholder(glucoseUnit, "correction")}
          />
        </Column>

        <Column gap="s">
          <Text variant="body">
            Target Blood Glucose Range
          </Text>
          <Text variant="caption" color="textLight">
            The target range for correction insulin calculations ({GlucoseConverter.getUnitLabel(glucoseUnit)})
          </Text>
          <Row gap="s">
            <Column flex={1} gap="s">
              <Text variant="caption">
                Min ({GlucoseConverter.getUnitLabel(glucoseUnit)})
              </Text>
              <Input
                value={targetMinText}
                onChangeText={setTargetMinText}
                onBlur={() => {
                  const displayValue = InputUtils.parseNumber(targetMinText, true);
                  const storageValue = GlucoseConverter.inputToStorage(displayValue, glucoseUnit);
                  updateSetting(["correctionInsulin", "targetGlucoseMin"], storageValue);
                  
                  // Update local state to formatted value after blur
                  const formattedDisplay = GlucoseConverter.storageToDisplay(storageValue, glucoseUnit);
                  setTargetMinText(formattedDisplay === 0 ? "" : formattedDisplay.toString());
                }}
                keyboardType="numeric"
                placeholder={GlucoseConverter.getPlaceholder(glucoseUnit, "target")}
              />
            </Column>
            <Column flex={1} gap="s">
              <Text variant="caption">
                Max ({GlucoseConverter.getUnitLabel(glucoseUnit)})
              </Text>
              <Input
                value={targetMaxText}
                onChangeText={setTargetMaxText}
                onBlur={() => {
                  const displayValue = InputUtils.parseNumber(targetMaxText, true);
                  const storageValue = GlucoseConverter.inputToStorage(displayValue, glucoseUnit);
                  updateSetting(["correctionInsulin", "targetGlucoseMax"], storageValue);
                  
                  // Update local state to formatted value after blur
                  const formattedDisplay = GlucoseConverter.storageToDisplay(storageValue, glucoseUnit);
                  setTargetMaxText(formattedDisplay === 0 ? "" : formattedDisplay.toString());
                }}
                keyboardType="numeric"
                placeholder={GlucoseConverter.getPlaceholder(glucoseUnit, "target")}
              />
            </Column>
          </Row>
        </Column>
      </Column>
    </Card>
  );
};
