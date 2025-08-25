import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { useFormState } from "../../hooks/useFormState";
import { useTimePicker } from "../../hooks/useTimePicker";
import { useGlucoseStore, useSettingsStore } from "../../stores/StoreProvider";
import { GlucoseReading } from "../../types";
import { GlucoseConverter } from "../../utils/glucose";
import { InputUtils } from "../../utils/input";
import { TimePickerModal } from "../common/TimePickerModal";
import { Column, ScrollBox, Text } from "../ui/Box";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { SheetFooterButtons } from "./SheetFooterButtons";
import { TimePickerSection } from "./TimePickerSection";

interface GlucoseInputSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSave?: (reading: GlucoseReading) => void;
  editingReading?: GlucoseReading | null;
}

interface GlucoseFormData {
  displayValue: string;
  notes: string;
}

const INITIAL_FORM_STATE: GlucoseFormData = { displayValue: "", notes: "" };

const VALIDATION_RULES = {
  displayValue: (value: string) => {
    const numericValue = InputUtils.parseNumber(value, true);
    if (isNaN(numericValue) || numericValue <= 0) {
      return "Please enter a valid glucose value";
    }
    return null;
  },
  notes: () => null, // Notes are always valid
};

const INITIAL_TIME = new Date();

export const GlucoseInputSheet: React.FC<GlucoseInputSheetProps> = observer(
  ({ isVisible, onClose, onSave, editingReading }) => {
    const sheetRef = useRef<TrueSheet>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const glucoseStore = useGlucoseStore();
    const settingsStore = useSettingsStore();

    const [deleting, setDeleting] = useState(false);

    const userUnit = settingsStore.glucoseUnit;

    // Custom hooks
    const {
      selectedTime,
      setSelectedTime,
      showTimePicker,
      setShowTimePicker,
      handleTimeChange,
      handleTimePickerChange,
    } = useTimePicker(INITIAL_TIME);

    const {
      formData,
      errors,
      saving,
      setSaving,
      updateField,
      validateForm,
      resetForm: resetFormData,
    } = useFormState<GlucoseFormData>(INITIAL_FORM_STATE, VALIDATION_RULES);

    const resetForm = () => {
      resetFormData();
      setSelectedTime(new Date());
    };

    const populateFormForEditing = () => {
      if (!editingReading) return;

      const displayValue = GlucoseConverter.storageToDisplay(
        editingReading.value,
        userUnit
      );

      updateField("displayValue", displayValue.toString());
      updateField("notes", editingReading.notes || "");
      setSelectedTime(new Date(editingReading.timestamp));
    };

    useEffect(() => {
      if (isVisible) {
        if (editingReading) {
          populateFormForEditing();
        } else {
          resetForm();
        }
        sheetRef.current?.present();
      } else {
        sheetRef.current?.dismiss();
      }
    }, [isVisible]);

    const handleSave = () => {
      if (!validateForm()) {
        return;
      }

      setSaving(true);
      try {
        const numericValue = InputUtils.parseNumber(
          formData.displayValue,
          true
        );
        const valueInMmol = GlucoseConverter.inputToStorage(
          numericValue,
          userUnit
        );

        const reading: GlucoseReading = {
          id: editingReading ? editingReading.id : Date.now().toString(),
          value: valueInMmol,
          unit: "mmol/L",
          timestamp: selectedTime,
          notes: formData.notes.trim() || undefined,
        };

        if (editingReading) {
          glucoseStore.updateReading(editingReading.id, reading);
        } else {
          glucoseStore.addReading(reading);
        }

        onSave?.(reading);

        Alert.alert(
          "Success",
          editingReading
            ? "Glucose reading updated successfully!"
            : "Glucose reading saved successfully!"
        );
        onClose();
      } catch {
        Alert.alert("Error", "Failed to save glucose reading.");
      } finally {
        setSaving(false);
      }
    };

    const handleDelete = () => {
      if (!editingReading) return;

      Alert.alert(
        "Delete Reading",
        "Are you sure you want to delete this glucose reading? This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              setDeleting(true);
              try {
                glucoseStore.deleteReading(editingReading.id);
                Alert.alert("Success", "Glucose reading deleted successfully!");
                onClose();
              } catch {
                Alert.alert("Error", "Failed to delete glucose reading.");
              } finally {
                setDeleting(false);
              }
            },
          },
        ]
      );
    };

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
              {editingReading ? "Edit Glucose Reading" : "Log Glucose Reading"}
            </Text>

            {/* Glucose Value Input */}
            <Column gap="s">
              <Text variant="body">Blood Glucose ({userUnit})</Text>
              <Input
                value={formData.displayValue}
                onChangeText={(value) => updateField("displayValue", value)}
                keyboardType="numeric"
                placeholder={GlucoseConverter.getPlaceholder(
                  userUnit,
                  "reading"
                )}
                variant="large"
              />
              {errors.displayValue && (
                <Text variant="caption" color="error">
                  {errors.displayValue}
                </Text>
              )}
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

            {/* Notes */}
            <Column gap="s">
              <Text variant="body">Notes (Optional)</Text>
              <Input
                value={formData.notes}
                onChangeText={(value) => updateField("notes", value)}
                placeholder="Add context (before meal, after exercise, etc.)"
                variant="multiline"
              />
            </Column>

            {/* Footer Buttons */}
            {editingReading ? (
              <Column gap="m">
                <Button
                  label="Delete Reading"
                  onPress={handleDelete}
                  variant="danger"
                  loading={deleting}
                  fullWidth
                />
                <SheetFooterButtons
                  onCancel={onClose}
                  onSave={handleSave}
                  saveLabel="Update Reading"
                  loading={saving}
                  disabled={!formData.displayValue.trim()}
                />
              </Column>
            ) : (
              <SheetFooterButtons
                onCancel={onClose}
                onSave={handleSave}
                saveLabel="Save Reading"
                loading={saving}
                disabled={!formData.displayValue.trim()}
              />
            )}
          </Column>
        </ScrollBox>
      </TrueSheet>
    );
  }
);

GlucoseInputSheet.displayName = "GlucoseInputSheet";
