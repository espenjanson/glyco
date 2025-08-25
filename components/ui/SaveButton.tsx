import React, { useState } from "react";
import { Alert, ViewStyle } from "react-native";
import { Button } from "./Button";

interface SaveButtonProps {
  onSave: () => Promise<void> | void;
  label?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "primaryLargeRounded";
  size?: "small" | "large";
  borderRadiusVariant?: "rounded";
  fullWidth?: boolean;
  style?: ViewStyle;

  // Alert customization
  successMessage?: string;
  errorMessage?: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onSave,
  label = "Save",
  disabled = false,
  variant = "primary",
  size,
  borderRadiusVariant,
  fullWidth = false,
  style,
  successMessage = "Saved successfully!",
  errorMessage = "Failed to save.",
}) => {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (disabled) return;

    setSaving(true);
    try {
      await onSave();
      Alert.alert("Success", successMessage);
    } catch {
      Alert.alert("Error", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button
      label={label}
      onPress={handleSave}
      variant={variant}
      size={size}
      borderRadiusVariant={borderRadiusVariant}
      fullWidth={fullWidth}
      loading={saving}
      disabled={disabled}
      style={style}
    />
  );
};
