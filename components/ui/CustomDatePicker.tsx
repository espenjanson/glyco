import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Modal, Platform } from "react-native";
import { Box, Column, Row, Text, TouchableBox } from "./Box";
import { Button } from "./Button";

type PickerMode = "date" | "time" | "datetime";

interface CustomDatePickerProps {
  label: string;
  value: Date | null; // Always a Date object or null
  onChange: (value: Date) => void; // Always passes a Date object
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  error?: string;
  mode?: PickerMode;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder,
  minimumDate,
  maximumDate,
  disabled = false,
  error,
  mode = "date",
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false); // For datetime mode on iOS
  const [tempValue, setTempValue] = useState<Date | null>(null); // Temporary value while picking

  // Get appropriate placeholder based on mode
  const getPlaceholder = (): string => {
    if (placeholder) return placeholder;
    switch (mode) {
      case "date":
        return "Select date";
      case "time":
        return "Select time";
      case "datetime":
        return "Select date and time";
      default:
        return "Select";
    }
  };

  // Get Date value for picker - use temp value when picking, otherwise use actual value
  const getDateValue = (): Date => {
    return tempValue || value || new Date();
  };

  // Format value for display only
  const getDisplayValue = (): string => {
    if (!value) return "";

    switch (mode) {
      case "date":
        return value.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

      case "time":
        return value.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

      case "datetime":
        return value.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

      default:
        return value.toString();
    }
  };

  // Get the icon based on mode
  const getIcon = (): string => {
    switch (mode) {
      case "date":
        return "📅";
      case "time":
        return "🕐";
      case "datetime":
        return "📅";
      default:
        return "📅";
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (mode === "datetime") {
        // For datetime mode, we need to preserve the existing date or time
        const currentValue = tempValue || value || new Date();
        let newDate: Date;

        if (showTimePicker) {
          // Time picker: preserve date, update time
          newDate = new Date(currentValue);
          newDate.setHours(selectedDate.getHours());
          newDate.setMinutes(selectedDate.getMinutes());
          newDate.setSeconds(selectedDate.getSeconds());
        } else {
          // Date picker: preserve time, update date
          newDate = new Date(selectedDate);
          newDate.setHours(currentValue.getHours());
          newDate.setMinutes(currentValue.getMinutes());
          newDate.setSeconds(currentValue.getSeconds());
        }

        setTempValue(newDate);
      } else {
        // For single date or time mode, store in temp value
        setTempValue(selectedDate);
      }
    }

    // On Android, auto-close for non-datetime modes only
    if (Platform.OS === "android" && mode !== "datetime") {
      setShowPicker(false);
      // For Android non-datetime, apply immediately
      if (selectedDate) {
        onChange(selectedDate);
      }
    }
  };

  const openPicker = () => {
    if (!disabled) {
      setTempValue(value || new Date());
      setShowPicker(true);
      setShowTimePicker(false);
    }
  };

  const closePicker = () => {
    setShowPicker(false);
    setShowTimePicker(false);
    setTempValue(null);
  };

  // Determine the picker mode for native component
  const getPickerMode = () => {
    if (mode === "datetime") {
      // iOS doesn't support datetime mode directly, we handle it with two pickers
      if (Platform.OS === "ios") {
        return showTimePicker ? "time" : "date";
      }
      return "datetime";
    }
    return mode;
  };

  return (
    <Column gap="s">
      {/* Label */}
      <Text variant="body">{label}</Text>

      {/* Custom Display Component */}
      <Box
        opacity={disabled ? 0.6 : 1}
        pointerEvents={disabled ? "none" : "auto"}
      >
        {mode === "datetime" ? (
          // Split datetime into date and time sections
          <Row gap="s">
            <Box flex={1}>
              <TouchableBox
                onPress={() => {
                  if (!disabled) {
                    setTempValue(value || new Date());
                    setShowPicker(true);
                    setShowTimePicker(false);
                  }
                }}
                padding="m"
                backgroundColor="cardBackground"
                borderWidth={1}
                borderColor={error ? "error" : "border"}
                borderRadius="l"
              >
                <Row justifyContent="space-between" alignItems="center">
                  <Text variant="body" color={value ? "text" : "textSecondary"}>
                    {value ? value.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) : "Select date"}
                  </Text>
                  <Text variant="body" color="textSecondary">
                    📅
                  </Text>
                </Row>
              </TouchableBox>
            </Box>
            <Box flex={1}>
              <TouchableBox
                onPress={() => {
                  if (!disabled) {
                    setTempValue(value || new Date());
                    setShowPicker(true);
                    setShowTimePicker(true);
                  }
                }}
                padding="m"
                backgroundColor="cardBackground"
                borderWidth={1}
                borderColor={error ? "error" : "border"}
                borderRadius="l"
              >
                <Row justifyContent="space-between" alignItems="center">
                  <Text variant="body" color={value ? "text" : "textSecondary"}>
                    {value ? value.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }) : "Select time"}
                  </Text>
                  <Text variant="body" color="textSecondary">
                    🕐
                  </Text>
                </Row>
              </TouchableBox>
            </Box>
          </Row>
        ) : (
          // Single picker for date or time only
          <TouchableBox
            onPress={openPicker}
            padding="m"
            backgroundColor="cardBackground"
            borderWidth={1}
            borderColor={error ? "error" : "border"}
            borderRadius="l"
          >
            <Row justifyContent="space-between" alignItems="center">
              <Text variant="body" color={value ? "text" : "textSecondary"}>
                {value ? getDisplayValue() : getPlaceholder()}
              </Text>

              <Text variant="body" color="textSecondary">
                {getIcon()}
              </Text>
            </Row>
          </TouchableBox>
        )}
      </Box>

      {/* Error Message */}
      {error && (
        <Text variant="caption" color="error">
          {error}
        </Text>
      )}

      {/* Native Picker Modal */}
      {showPicker && (
        <>
          {Platform.OS === "ios" ? (
            // iOS Custom Modal
            <Modal
              transparent={true}
              animationType="slide"
              visible={showPicker}
              onRequestClose={closePicker}
            >
              <Box flex={1} justifyContent="flex-end">
                <Box
                  backgroundColor="cardBackground"
                  borderTopLeftRadius="xxl"
                  borderTopRightRadius="xxl"
                  padding="xl"
                  paddingBottom="xxl"
                  shadowColor="shadow"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.15}
                  shadowRadius={8}
                  elevation={10}
                >
                  <Column gap="m">
                    <Row justifyContent="space-between" alignItems="center">
                      <Text variant="title">
                        {mode === "datetime" 
                          ? (showTimePicker ? "Select Time" : "Select Date")
                          : `Select ${label}`}
                      </Text>
                    </Row>

                    <DateTimePicker
                      value={getDateValue()}
                      mode={getPickerMode()}
                      display="spinner"
                      onChange={handleDateChange}
                      minimumDate={mode !== "time" ? minimumDate : undefined}
                      maximumDate={mode !== "time" ? maximumDate : undefined}
                      style={{ height: 200 }}
                    />

                    <Row gap="m">
                      <Box flex={1}>
                        <Button
                          label="Cancel"
                          onPress={closePicker}
                          variant="outline"
                          fullWidth
                        />
                      </Box>
                      <Box flex={1}>
                        <Button
                          label="Done"
                          onPress={() => {
                            if (tempValue) {
                              onChange(tempValue);
                            }
                            closePicker();
                          }}
                          variant="primary"
                          fullWidth
                        />
                      </Box>
                    </Row>
                  </Column>
                </Box>
              </Box>
            </Modal>
          ) : (
            // Android Native Modal
            <DateTimePicker
              value={getDateValue()}
              mode={getPickerMode()}
              display="default"
              onChange={handleDateChange}
              minimumDate={mode !== "time" ? minimumDate : undefined}
              maximumDate={mode !== "time" ? maximumDate : undefined}
            />
          )}
        </>
      )}
    </Column>
  );
};

// Convenience exports for specific modes
export const CustomTimePicker: React.FC<Omit<CustomDatePickerProps, "mode">> = (
  props
) => <CustomDatePicker {...props} mode="time" />;

export const CustomDateTimePicker: React.FC<
  Omit<CustomDatePickerProps, "mode">
> = (props) => <CustomDatePicker {...props} mode="datetime" />;
