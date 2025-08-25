import React from "react";
import { Alert } from "react-native";
import { Column } from "../ui/Box";
import { Button } from "../ui/Button";
import { observer } from "mobx-react-lite";
import { useSettingsStore } from "../../stores/StoreProvider";

interface SettingsActionsProps {
  onSettingsReloaded: () => void;
}

export const SettingsActions: React.FC<SettingsActionsProps> = observer(({
  onSettingsReloaded,
}) => {
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
              onSettingsReloaded();
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