import { observer } from "mobx-react-lite";
import React from "react";
import { useGlucoseStore, useSettingsStore } from "../../stores/StoreProvider";
import { GlucoseConverter } from "../../utils/glucose";
import { Column, Text } from "../ui/Box";
import { Input } from "../ui/Input";

export const GlucoseValueInput: React.FC = observer(() => {
  const glucoseStore = useGlucoseStore();
  const settingsStore = useSettingsStore();

  const userUnit = settingsStore.glucoseUnit;
  const isValid = glucoseStore.isDraftValid;

  return (
    <Column gap="s">
      <Text variant="body">Blood Glucose ({userUnit})</Text>
      <Input
        value={glucoseStore.draftDisplayValue}
        onChangeText={glucoseStore.setDraftDisplayValue}
        keyboardType="numeric"
        placeholder={GlucoseConverter.getPlaceholder(userUnit, "reading")}
        variant="large"
      />
      {!isValid && glucoseStore.draftDisplayValue.trim() && (
        <Text variant="caption" color="error">
          Please enter a valid glucose value
        </Text>
      )}
    </Column>
  );
});

GlucoseValueInput.displayName = "GlucoseValueInput";
