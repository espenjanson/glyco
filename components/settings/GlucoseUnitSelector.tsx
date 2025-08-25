import { observer } from "mobx-react-lite";
import React from "react";
import { useSettingsStore } from "../../stores/StoreProvider";
import { GlucoseUnit } from "../../types";
import { Box, Column, Row, Text } from "../ui/Box";
import { Button } from "../ui/Button";

export const GlucoseUnitSelector: React.FC = observer(() => {
  const settingsStore = useSettingsStore();
  const currentUnit = settingsStore.glucoseUnit;

  const handleGlucoseUnitChange = (newUnit: GlucoseUnit) => {
    if (newUnit === currentUnit) return;

    // Update the glucose unit in settings
    settingsStore.updateUserSetting("glucoseUnit", newUnit);
  };

  return (
    <Column gap="s">
      <Text variant="body">Glucose Units</Text>
      <Row gap="s">
        <Box flex={1}>
          <Button
            label="mmol/L"
            onPress={() => handleGlucoseUnitChange("mmol/L")}
            variant={currentUnit === "mmol/L" ? "primary" : "outline"}
            fullWidth
          />
        </Box>
        <Box flex={1}>
          <Button
            label="mg/dL"
            onPress={() => handleGlucoseUnitChange("mg/dL")}
            variant={currentUnit === "mg/dL" ? "primary" : "outline"}
            fullWidth
          />
        </Box>
      </Row>
    </Column>
  );
});
