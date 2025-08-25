import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useGlucoseStore, useSettingsStore } from "../../stores/StoreProvider";
import { GlucoseConverter } from "../../utils/glucose";
import { InputUtils } from "../../utils/input";
import { Column, Text } from "../ui/Box";
import { LargeTextInput } from "../ui/Input";

export const GlucoseValueInput: React.FC = observer(() => {
  const glucoseStore = useGlucoseStore();
  const settingsStore = useSettingsStore();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(
      glucoseStore.draft.value === 0 ? "" : glucoseStore.draft.value.toString()
    );
  }, [glucoseStore.draft.value]);

  const userUnit = settingsStore.glucoseUnit;

  return (
    <Column gap="s">
      <Text variant="caption">Blood Glucose ({userUnit})</Text>
      <LargeTextInput
        value={value}
        onChangeText={(value) => {
          glucoseStore.setDraftIsValid(true);
          setValue(value);
        }}
        onBlur={() => {
          if (InputUtils.parseNumber(value, true) > 0) {
            const numericValue = InputUtils.parseNumber(value, true);
            glucoseStore.setDraftValue(isNaN(numericValue) ? 0 : numericValue);
          } else {
            glucoseStore.setDraftIsValid(false);
          }
        }}
        keyboardType="numeric"
        placeholder={GlucoseConverter.getPlaceholder(userUnit, "reading")}
      />
      {!glucoseStore.draftIsValid && (
        <Text variant="caption" color="error">
          Please enter a valid glucose value
        </Text>
      )}
    </Column>
  );
});
