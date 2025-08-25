import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useGlucoseStore } from "../../stores/StoreProvider";
import { GlucoseReading } from "../../types";
import { SheetFooterButtons } from "../sheets/SheetFooterButtons";
import { Column } from "../ui/Box";
import { DateTimeInput } from "./DateTimeInput";
import { GlucoseValueInput } from "./GlucoseValueInput";
import { NotesInput } from "./NotesInput";

interface GlucoseFormProps {
  editingReading?: GlucoseReading | null;

  closeSheet: () => void;
}

export const GlucoseForm: React.FC<GlucoseFormProps> = observer(
  ({ editingReading, closeSheet }) => {
    const glucoseStore = useGlucoseStore();

    useEffect(() => {
      if (editingReading) {
        glucoseStore.startEditingReading(editingReading);
      } else {
        glucoseStore.resetDraft();
      }
    }, [editingReading]);

    const handleSave = async () => {
      glucoseStore.saveDraftReading();
      closeSheet();
    };

    const handleDelete = async () => {
      if (!editingReading) return;
      glucoseStore.deleteReading(editingReading.id);
      closeSheet();
    };

    return (
      <Column gap="l">
        {/* Form Fields */}
        <GlucoseValueInput />
        <DateTimeInput />
        <NotesInput />

        {/* Footer Buttons */}
        <SheetFooterButtons
          onCancel={closeSheet}
          onSave={handleSave}
          saveLabel={editingReading ? "Update Reading" : "Save Reading"}
          disabled={!glucoseStore.isDraftValid}
          // Delete functionality for editing
          onDelete={editingReading ? handleDelete : undefined}
          showDelete={!!editingReading}
          deleteLabel="Delete Reading"
          // Custom alert messages
          successMessage={
            editingReading
              ? "Glucose reading updated successfully!"
              : "Glucose reading saved successfully!"
          }
          errorMessage="Failed to save glucose reading."
          deleteConfirmTitle="Delete Reading"
          deleteConfirmMessage="Are you sure you want to delete this glucose reading? This action cannot be undone."
          deleteSuccessMessage="Glucose reading deleted successfully!"
          deleteErrorMessage="Failed to delete glucose reading."
        />
      </Column>
    );
  }
);

GlucoseForm.displayName = "GlucoseForm";
