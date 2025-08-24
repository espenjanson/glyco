import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform } from "react-native";
import { Box, Column, Row, Text, TouchableBox } from "./Box";
import { Button } from "./Button";
import { Input } from "./Input";

interface DatePickerProps {
  value: string; // ISO date string or empty string
  onDateChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  placeholder = "Select date",
  label,
  minimumDate,
  maximumDate = new Date(), // Default to today as maximum
}) => {
  const [show, setShow] = useState(false);

  // Convert Date to YYYY-MM-DD string in local timezone
  const dateToLocalString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get the current date to display in picker, with sensible fallback
  const getCurrentPickerDate = (): Date => {
    if (value && value.trim()) {
      let parsedDate: Date;
      if (value.includes('T')) {
        // Already has time component
        parsedDate = new Date(value);
      } else {
        // Add time to avoid timezone issues
        parsedDate = new Date(value + "T00:00:00");
      }
      
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    // Default to a reasonable birth year for better UX when no date is set
    return new Date(1990, 0, 1);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString || !dateString.trim()) return "";
    
    // Handle date string more carefully to avoid timezone issues
    let date: Date;
    if (dateString.includes('T')) {
      // Already has time component
      date = new Date(dateString);
    } else {
      // Add time to avoid timezone issues
      date = new Date(dateString + "T00:00:00");
    }
    
    if (isNaN(date.getTime())) return "";

    // Format as YYYY-MM-DD
    return date.toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD format
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
      if (selectedDate) {
        // On Android, immediately save the date using local timezone
        onDateChange(dateToLocalString(selectedDate));
      }
    } else {
      // On iOS, track the current selection as user scrolls
      if (selectedDate) {
        setCurrentSelection(selectedDate);
      }
    }
  };

  const showDatePicker = () => {
    setShow(true);
  };

  // For iOS, we need to track the current selection in the picker
  const [currentSelection, setCurrentSelection] = useState<Date | null>(null);

  const saveDatePicker = () => {
    setShow(false);
    if (currentSelection) {
      onDateChange(dateToLocalString(currentSelection)); // YYYY-MM-DD in local timezone
    }
    setCurrentSelection(null);
  };

  const cancelDatePicker = () => {
    setShow(false);
    setCurrentSelection(null);
  };

  const displayValue = formatDate(value);

  return (
    <Column gap="s">
      {label && (
        <Text variant="body">
          {label}
        </Text>
      )}

      <TouchableBox onPress={showDatePicker}>
        <Input
          value={displayValue}
          placeholder={placeholder}
          editable={false}
          pointerEvents="none"
        />
      </TouchableBox>

      {show && (
        <Box>
          <DateTimePicker
            value={getCurrentPickerDate()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />

          {Platform.OS === "ios" && (
            <Row marginTop="s">
              <Box flex={1} marginRight="s">
                <Button
                  label="Cancel"
                  onPress={cancelDatePicker}
                  variant="outline"
                  fullWidth
                />
              </Box>
              <Box flex={1} marginLeft="s">
                <Button
                  label="Save Date"
                  onPress={saveDatePicker}
                  variant="primary"
                  fullWidth
                />
              </Box>
            </Row>
          )}
        </Box>
      )}
    </Column>
  );
};
