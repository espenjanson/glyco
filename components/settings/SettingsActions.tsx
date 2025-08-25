import { observer } from "mobx-react-lite";
import React from "react";
import { Alert } from "react-native";
import { useSettingsStore } from "../../stores/StoreProvider";
import { Column } from "../ui/Box";
import { Button } from "../ui/Button";

export const SettingsActions: React.FC = observer(() => {
  const settingsStore = useSettingsStore();

  const handleResetDefaults = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default values?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            try {
              settingsStore.resetToDefaults();
              Alert.alert("Success", "Settings have been reset to defaults");
            } catch {
              Alert.alert("Error", "Failed to reset settings");
            }
          },
        },
      ]
    );
  };

  return (
    <Column>
      <Button
        label="Reset to Defaults"
        onPress={handleResetDefaults}
        variant="outline"
        fullWidth
      />
    </Column>
  );
});
