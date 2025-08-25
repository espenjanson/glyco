import { observer } from "mobx-react-lite";
import React from "react";
import { useGlucoseStore } from "../../stores/StoreProvider";
import { Column, Text } from "../ui/Box";
import { Input } from "../ui/Input";

interface NotesInputProps {
  placeholder?: string;
}

export const NotesInput: React.FC<NotesInputProps> = observer(
  ({ placeholder = "Add context (before meal, after exercise, etc.)" }) => {
    const glucoseStore = useGlucoseStore();

    return (
      <Column gap="s">
        <Text variant="body">Notes (Optional)</Text>
        <Input
          value={glucoseStore.draftNotes}
          onChangeText={glucoseStore.setDraftNotes}
          placeholder={placeholder}
          variant="multiline"
        />
      </Column>
    );
  }
);

NotesInput.displayName = "NotesInput";
