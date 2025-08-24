import React, { useState } from 'react';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Box, Column, Text, Row, TouchableBox } from './Box';
import { Input } from './Input';
import { Button } from './Button';

interface TimePickerProps {
  value: string; // Time string in HH:MM format
  onTimeChange: (time: string) => void;
  placeholder?: string;
  label?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onTimeChange,
  placeholder = "Select time",
  label
}) => {
  const [show, setShow] = useState(false);
  const [tempTime, setTempTime] = useState(() => {
    if (value && value.match(/^\d{1,2}:\d{2}$/)) {
      const [hours, minutes] = value.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }
    // Default to 22:00 for basal insulin
    const defaultTime = new Date();
    defaultTime.setHours(22, 0, 0, 0);
    return defaultTime;
  });

  const formatTime = (dateObj: Date): string => {
    return dateObj.toTimeString().slice(0, 5); // HH:MM format
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (selectedTime) {
        setTempTime(selectedTime);
        // On Android, immediately save the time
        onTimeChange(formatTime(selectedTime));
      }
    } else {
      // On iOS, just update the temp time
      if (selectedTime) {
        setTempTime(selectedTime);
      }
    }
  };

  const showTimePicker = () => {
    setShow(true);
  };

  const saveTimePicker = () => {
    setShow(false);
    onTimeChange(formatTime(tempTime));
  };

  const cancelTimePicker = () => {
    setShow(false);
    // Reset temp time to current value
    if (value && value.match(/^\d{1,2}:\d{2}$/)) {
      const [hours, minutes] = value.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      setTempTime(date);
    }
  };

  const displayValue = value || '';

  return (
    <Column gap="s">
      {label && (
        <Text variant="body">
          {label}
        </Text>
      )}
      
      <TouchableBox onPress={showTimePicker}>
        <Input
          value={displayValue}
          placeholder={placeholder}
          editable={false}
          pointerEvents="none"
        />
      </TouchableBox>

      {show && (
        <Column gap="s">
          <DateTimePicker
            value={tempTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
            is24Hour={true}
          />
          
          {Platform.OS === 'ios' && (
            <Row gap="s">
              <Box flex={1}>
                <Button
                  label="Cancel"
                  onPress={cancelTimePicker}
                  variant="outline"
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Button
                  label="Save Time"
                  onPress={saveTimePicker}
                  variant="primary"
                  fullWidth
                />
              </Box>
            </Row>
          )}
        </Column>
      )}
    </Column>
  );
};