import { TrueSheet } from "@lodev09/react-native-true-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Alert, ScrollView } from "react-native";
import { TimePickerModal } from "../common/TimePickerModal";
import { useFormState } from "../../hooks/useFormState";
import { useTimePicker } from "../../hooks/useTimePicker";
import { InsulinShot } from "../../types";
import { StorageService } from "../../utils/storage";
import { Column, ScrollBox, Text } from "../ui/Box";
import { Input } from "../ui/Input";
import { InjectionSiteSelector } from "./InjectionSiteSelector";
import { InsulinDosageSelector } from "./InsulinDosageSelector";
import { InsulinTypeSelector } from "./InsulinTypeSelector";
import { SheetFooterButtons } from "./SheetFooterButtons";
import { TimePickerSection } from "./TimePickerSection";

interface InsulinInputSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSave?: (shot: InsulinShot) => void;
}

interface InsulinFormData {
  units: string;
  type: "rapid" | "long-acting" | "intermediate";
  site: string;
  notes: string;
}

const INITIAL_INSULIN_FORM_STATE: InsulinFormData = { 
  units: "", 
  type: "rapid", 
  site: "", 
  notes: "" 
};

const INSULIN_VALIDATION_RULES = {
  units: (value: string) => {
    const numUnits = parseFloat(value);
    if (isNaN(numUnits) || numUnits <= 0) {
      return "Please enter a valid number of units";
    }
    return null;
  },
  type: () => null,
  site: () => null,
  notes: () => null,
};

const INITIAL_INSULIN_TIME = new Date();

export const InsulinInputSheet: React.FC<InsulinInputSheetProps> = React.memo(({
  isVisible,
  onClose,
  onSave,
}) => {
  const sheetRef = useRef<TrueSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Custom hooks
  const {
    selectedTime,
    setSelectedTime,
    showTimePicker,
    setShowTimePicker,
    handleTimeChange,
    handleTimePickerChange,
  } = useTimePicker(INITIAL_INSULIN_TIME);

  const {
    formData,
    errors,
    saving,
    setSaving,
    updateField,
    validateForm,
    resetForm: resetFormData,
  } = useFormState<InsulinFormData>(
    INITIAL_INSULIN_FORM_STATE,
    INSULIN_VALIDATION_RULES
  );

  const resetForm = useCallback(() => {
    resetFormData();
    setSelectedTime(new Date());
  }, [resetFormData, setSelectedTime]);

  useEffect(() => {
    if (isVisible) {
      resetForm();
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [isVisible, resetForm]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const numUnits = parseFloat(formData.units);
      const shot: InsulinShot = {
        id: Date.now().toString(),
        type: formData.type,
        units: numUnits,
        timestamp: selectedTime,
        notes: formData.notes.trim() || undefined,
        injectionSite: formData.site || undefined,
      };

      await StorageService.saveInsulinShot(shot);
      onSave?.(shot);

      Alert.alert("Success", "Insulin shot logged successfully!");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to save insulin shot.");
    } finally {
      setSaving(false);
    }
  }, [validateForm, setSaving, formData, selectedTime, onSave, onClose]);

  return (
    <TrueSheet
      ref={sheetRef}
      // @ts-ignore
      scrollRef={scrollViewRef}
      sizes={["auto"]}
      cornerRadius={24}
      onDismiss={onClose}
    >
      <ScrollBox ref={scrollViewRef} nestedScrollEnabled>
        <Column padding="l" gap="l">
          {/* Header */}
          <Text variant="title" textAlign="center">
            Log Insulin Shot
          </Text>

          {/* Insulin Type Selection - Compact Row */}
          <Column gap="s">
            <Text variant="body">Insulin Type</Text>
            <InsulinTypeSelector 
              selectedType={formData.type} 
              onTypeChange={(value) => updateField('type', value)} 
            />
          </Column>

          {/* Time Picker */}
          <TimePickerSection
            selectedTime={selectedTime}
            onTimeChange={handleTimeChange}
            onShowTimePicker={() => setShowTimePicker(true)}
          />

          {/* Time Picker Modal */}
          <TimePickerModal
            visible={showTimePicker}
            value={selectedTime}
            onChange={handleTimePickerChange}
            onClose={() => setShowTimePicker(false)}
          />

          {/* Insulin Dosage with Step Controls */}
          <InsulinDosageSelector 
            value={formData.units} 
            onValueChange={(value) => updateField('units', value)} 
          />
          {errors.units && (
            <Text variant="caption" color="error">
              {errors.units}
            </Text>
          )}

          {/* Injection Site Selection */}
          <InjectionSiteSelector 
            selectedSite={formData.site} 
            onSiteChange={(value) => updateField('site', value)} 
          />

          {/* Notes */}
          <Column gap="s">
            <Text variant="body">Notes (Optional)</Text>
            <Input
              value={formData.notes}
              onChangeText={(value) => updateField('notes', value)}
              placeholder="Add context (meal time, correction dose, etc.)"
              variant="multiline"
            />
          </Column>

          {/* Footer Buttons */}
          <SheetFooterButtons
            onCancel={onClose}
            onSave={handleSave}
            saveLabel="Save Insulin Shot"
            loading={saving}
            disabled={!formData.units.trim()}
          />
        </Column>
      </ScrollBox>
    </TrueSheet>
  );
});

InsulinInputSheet.displayName = 'InsulinInputSheet';
