import React, { useState } from "react";
import { Alert } from "react-native";
import { Button } from "./Button";

interface DeleteButtonProps {
  onDelete: () => Promise<void> | void;
  label?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "large";
  fullWidth?: boolean;

  // Alert customization
  confirmTitle?: string;
  confirmMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  label = "Delete",
  variant = "danger",
  size,
  fullWidth = false,
  confirmTitle = "Delete Item",
  confirmMessage = "Are you sure you want to delete this item? This action cannot be undone.",
  successMessage = "Deleted successfully!",
  errorMessage = "Failed to delete item.",
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    Alert.alert(confirmTitle, confirmMessage, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: label,
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          try {
            await onDelete();
            Alert.alert("Success", successMessage);
          } catch {
            Alert.alert("Error", errorMessage);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <Button
      label={label}
      onPress={handleDelete}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={deleting}
    />
  );
};
