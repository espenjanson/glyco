import React from "react";
import { Alert } from "react-native";
import { Column } from "../ui/Box";
import { Button } from "../ui/Button";
import { StorageService } from "../../utils/storage";

interface SettingsActionsProps {
  onSettingsReloaded: () => void;
}

export const SettingsActions: React.FC<SettingsActionsProps> = ({
  onSettingsReloaded,
}) => {
  const handleResetDefaults = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default values?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await StorageService.clearMedicalSettings();
              await StorageService.clearUserSettings();
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
};