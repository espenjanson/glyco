import React from "react";
import { Box, Row } from "../ui/Box";
import { Button } from "../ui/Button";

interface SheetFooterButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const SheetFooterButtons: React.FC<SheetFooterButtonsProps> = ({
  onCancel,
  onSave,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  loading = false,
  disabled = false,
}) => {
  return (
    <Row gap="s" paddingHorizontal="l" paddingBottom="l">
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
          onPress={onSave}
          variant="primary"
          fullWidth
          loading={loading}
          disabled={disabled}
        />
      </Box>
    </Row>
  );
};