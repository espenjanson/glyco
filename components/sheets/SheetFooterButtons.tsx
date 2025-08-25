import React, { useState } from "react";
import { Alert } from "react-native";
import { Box, Column, Row } from "../ui/Box";
import { Button } from "../ui/Button";

interface SheetFooterButtonsProps {
  onCancel: () => void;
  onSave: () => Promise<void> | void;
  saveLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;

  // Delete functionality (optional)
  onDelete?: () => Promise<void> | void;
  deleteLabel?: string;
  showDelete?: boolean;

  // Alert customization
  successMessage?: string;
  errorMessage?: string;
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: string;
  deleteSuccessMessage?: string;
  deleteErrorMessage?: string;
}

export const SheetFooterButtons: React.FC<SheetFooterButtonsProps> = ({
  onCancel,
  onSave,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  disabled = false,

  // Delete props
  onDelete,
  deleteLabel = "Delete",
  showDelete = false,

  // Alert props
  successMessage = "Saved successfully!",
  errorMessage = "Failed to save.",
  deleteConfirmTitle = "Delete Item",
  deleteConfirmMessage = "Are you sure you want to delete this item? This action cannot be undone.",
  deleteSuccessMessage = "Deleted successfully!",
  deleteErrorMessage = "Failed to delete item.",
}) => {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = () => {
    if (!onDelete) return;

    Alert.alert(deleteConfirmTitle, deleteConfirmMessage, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: deleteLabel,
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          try {
            await onDelete();
            Alert.alert("Success", deleteSuccessMessage);
          } catch {
            Alert.alert("Error", deleteErrorMessage);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <Column gap="m">
      {/* Delete Button (if applicable) */}
      {showDelete && onDelete && (
        <Button
          label={deleteLabel}
          onPress={handleDelete}
          variant="danger"
          loading={deleting}
          fullWidth
        />
      )}

      {/* Cancel/Save Buttons */}
      <Row gap="s">
        <Box flex={1}>
          <Button
            label={cancelLabel}
            onPress={onCancel}
            variant="outline"
            fullWidth
          />
        </Box>
        <Box flex={1}>
          <Button
            label={saveLabel}
            onPress={handleSave}
            variant="primary"
            fullWidth
            loading={saving}
            disabled={disabled}
          />
        </Box>
      </Row>
    </Column>
  );
};
