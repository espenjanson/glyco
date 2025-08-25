import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { MEDICAL_HELP } from "../../constants/medical";
import { useSettingsStore } from "../../stores/StoreProvider";
import { GlucoseUnit, MedicalSettings } from "../../types";
import { GlucoseConverter } from "../../utils/glucose";
import { InputUtils } from "../../utils/input";
import { HelpTooltip } from "../medical/HelpTooltip";
import { Box, Column, Row, Text } from "../ui/Box";
import { Input } from "../ui/Input";
import { EditableSection } from "./EditableSection";

interface EditableCorrectionInsulinFormProps {
  settings: MedicalSettings;
  warnings?: string[];
  glucoseUnit: GlucoseUnit;
}

export const EditableCorrectionInsulinForm: React.FC<EditableCorrectionInsulinFormProps> =
  observer(({ settings, warnings = [], glucoseUnit }) => {
    const settingsStore = useSettingsStore();

    // Local form state
    const [formData, setFormData] = useState({
      correctionFactor: "",
      targetMin: "",
      targetMax: "",
    });

    // Initialize form data from settings
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

      setFormData({
        correctionFactor:
          correctionFactorDisplay === 0
            ? ""
            : correctionFactorDisplay.toString(),
        targetMin: targetMinDisplay === 0 ? "" : targetMinDisplay.toString(),
        targetMax: targetMaxDisplay === 0 ? "" : targetMaxDisplay.toString(),
      });
    }, [settings.correctionInsulin, glucoseUnit]);

    const handleCancel = () => {
      // Reset form data to original values
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

      setFormData({
        correctionFactor:
          correctionFactorDisplay === 0
            ? ""
            : correctionFactorDisplay.toString(),
        targetMin: targetMinDisplay === 0 ? "" : targetMinDisplay.toString(),
        targetMax: targetMaxDisplay === 0 ? "" : targetMaxDisplay.toString(),
      });
    };

    const validation = (): string[] | null => {
      const errors: string[] = [];

      const correctionFactorValue = InputUtils.parseNumber(
        formData.correctionFactor,
        true
      );
      const targetMinValue = InputUtils.parseNumber(formData.targetMin, true);
      const targetMaxValue = InputUtils.parseNumber(formData.targetMax, true);

      if (correctionFactorValue <= 0) {
        errors.push("Correction factor must be greater than 0");
      } else {
        // Convert to mmol/L for validation ranges
        const correctionFactorInMmol = GlucoseConverter.inputToStorage(
          correctionFactorValue,
          glucoseUnit
        );
        if (correctionFactorInMmol > 10) {
          // Very high correction factor
          errors.push("Correction factor seems unusually high");
        } else if (correctionFactorInMmol < 0.5) {
          // Very low correction factor
          errors.push("Correction factor seems unusually low");
        }
      }

      if (targetMinValue <= 0) {
        errors.push("Target minimum must be greater than 0");
      }

      if (targetMaxValue <= 0) {
        errors.push("Target maximum must be greater than 0");
      }

      if (targetMinValue >= targetMaxValue) {
        errors.push("Target minimum must be less than target maximum");
      }

      // Convert targets to mmol/L for reasonable range validation
      const targetMinInMmol = GlucoseConverter.inputToStorage(
        targetMinValue,
        glucoseUnit
      );
      const targetMaxInMmol = GlucoseConverter.inputToStorage(
        targetMaxValue,
        glucoseUnit
      );

      if (targetMinInMmol < 3.0) {
        // ~54 mg/dL
        errors.push("Target minimum seems dangerously low");
      }
      if (targetMaxInMmol > 15.0) {
        // ~270 mg/dL
        errors.push("Target maximum seems unusually high");
      }

      return errors.length > 0 ? errors : null;
    };

    const handleSave = () => {
      const correctionFactorValue = InputUtils.parseNumber(
        formData.correctionFactor,
        true
      );
      const targetMinValue = InputUtils.parseNumber(formData.targetMin, true);
      const targetMaxValue = InputUtils.parseNumber(formData.targetMax, true);

      // Convert display values to storage values (mmol/L)
      const correctionFactorStorage = GlucoseConverter.inputToStorage(
        correctionFactorValue,
        glucoseUnit
      );
      const targetMinStorage = GlucoseConverter.inputToStorage(
        targetMinValue,
        glucoseUnit
      );
      const targetMaxStorage = GlucoseConverter.inputToStorage(
        targetMaxValue,
        glucoseUnit
      );

      // Update all fields at once
      const updates = {
        correctionInsulin: {
          ...settings.correctionInsulin,
          correctionFactor: correctionFactorStorage,
          targetGlucoseMin: targetMinStorage,
          targetGlucoseMax: targetMaxStorage,
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
                Rapid-acting insulin for high blood glucose correction
              </Text>
            </Box>
            <HelpTooltip
              title="Correction Insulin"
              content={MEDICAL_HELP.correctionInsulin}
            />
          </Row>
        </Column>

        <Column gap="s">
          <Row alignItems="center">
            <Text variant="body">Correction Factor</Text>
            <HelpTooltip
              title="Correction Factor"
              content={MEDICAL_HELP.correctionFactor}
            />
          </Row>
          <Text variant="caption" color="textLight">
            How much 1 unit of insulin lowers blood glucose (
            {GlucoseConverter.getUnitLabel(glucoseUnit)})
          </Text>
          <Input
            value={formData.correctionFactor}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, correctionFactor: text }))
            }
            keyboardType="numeric"
            placeholder={GlucoseConverter.getPlaceholder(
              glucoseUnit,
              "correction"
            )}
            editable={isEditing}
            style={{ opacity: isEditing ? 1 : 0.6 }}
          />
        </Column>

        <Column gap="s">
          <Text variant="body">Target Blood Glucose Range</Text>
          <Text variant="caption" color="textLight">
            The target range for correction insulin calculations (
            {GlucoseConverter.getUnitLabel(glucoseUnit)})
          </Text>
          <Row gap="s">
            <Column flex={1} gap="s">
              <Text variant="caption">
                Min ({GlucoseConverter.getUnitLabel(glucoseUnit)})
              </Text>
              <Input
                value={formData.targetMin}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, targetMin: text }))
                }
                keyboardType="numeric"
                placeholder={GlucoseConverter.getPlaceholder(
                  glucoseUnit,
                  "target"
                )}
                editable={isEditing}
                style={{ opacity: isEditing ? 1 : 0.6 }}
              />
            </Column>
            <Column flex={1} gap="s">
              <Text variant="caption">
                Max ({GlucoseConverter.getUnitLabel(glucoseUnit)})
              </Text>
              <Input
                value={formData.targetMax}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, targetMax: text }))
                }
                keyboardType="numeric"
                placeholder={GlucoseConverter.getPlaceholder(
                  glucoseUnit,
                  "target"
                )}
                editable={isEditing}
                style={{ opacity: isEditing ? 1 : 0.6 }}
              />
            </Column>
          </Row>
        </Column>
      </Column>
    );

    return (
      <EditableSection
        title="Correction Insulin"
        onSave={handleSave}
        onCancel={handleCancel}
        validation={validation}
        warnings={warnings}
      >
        {renderContent}
      </EditableSection>
    );
  });

EditableCorrectionInsulinForm.displayName = "EditableCorrectionInsulinForm";
