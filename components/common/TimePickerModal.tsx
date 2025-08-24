import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Platform } from "react-native";
import { Box, Column, Row } from "../ui/Box";
import { Button } from "../ui/Button";

interface TimePickerModalProps {
  visible: boolean;
  value: Date;
  onChange: (event: any, selectedDate?: Date) => void;
  onClose: () => void;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  value,
  onChange,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <Column gap="s">
      <DateTimePicker
        value={value}
        mode="datetime"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={onChange}
      />
      {Platform.OS === "ios" && (
        <Row gap="s">
          <Box flex={1}>
            <Button
              label="Cancel"
              onPress={onClose}
              variant="outline"
              fullWidth
            />
          </Box>
          <Box flex={1}>
            <Button
              label="Done"
              onPress={onClose}
              variant="primary"
              fullWidth
            />
          </Box>
        </Row>
      )}
    </Column>
  );
};