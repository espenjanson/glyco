import { observer } from "mobx-react-lite";
import React from "react";
import { useGlucoseStore } from "../../stores/StoreProvider";
import { Column, Text } from "../ui/Box";
import { Input } from "../ui/Input";

interface NotesInputProps {
  placeholder?: string;
}

export const NotesInput: React.FC<NotesInputProps> = observer(
  ({ placeholder = "Add some context..." }) => {
    const glucoseStore = useGlucoseStore();

    return (
      <Column gap="s">
        <Text variant="caption">Notes (Optional)</Text>
        <Input
          value={glucoseStore.draft.notes || ""}
          onChangeText={(value) => glucoseStore.setDraftNotes(value)}
          placeholder={placeholder}
        />
      </Column>
    );
  }
);

NotesInput.displayName = "NotesInput";
