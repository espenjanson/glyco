import React from "react";
import { Column } from "../ui/Box";
import { DeleteButton } from "../ui/DeleteButton";
import { SaveButton } from "../ui/SaveButton";

interface FormFooterButtonsProps {
  onSave: () => Promise<void> | void;
  saveLabel?: string;
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

export const FormFooterButtons: React.FC<FormFooterButtonsProps> = ({
  onSave,
  saveLabel = "Save",
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
  return (
    <Column gap="m" paddingBottom="l">
      {/* Delete Button (if applicable) */}
      {showDelete && onDelete && (
        <DeleteButton
          onDelete={onDelete}
          label={deleteLabel}
          confirmTitle={deleteConfirmTitle}
          confirmMessage={deleteConfirmMessage}
          successMessage={deleteSuccessMessage}
          errorMessage={deleteErrorMessage}
          fullWidth
        />
      )}

      {/* Save Button */}
      <SaveButton
        onSave={onSave}
        label={saveLabel}
        disabled={disabled}
        successMessage={successMessage}
        errorMessage={errorMessage}
        variant="primaryLargeRounded"
        fullWidth
      />
    </Column>
  );
};
