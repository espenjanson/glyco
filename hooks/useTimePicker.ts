import { useState } from 'react';
import { Platform } from 'react-native';

export const useTimePicker = (initialTime?: Date) => {
  const [selectedTime, setSelectedTime] = useState(initialTime || new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (increment: number) => {
    const newTime = new Date(selectedTime);
    newTime.setMinutes(newTime.getMinutes() + increment);
    setSelectedTime(newTime);
  };

  const handleTimePickerChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  return {
    selectedTime,
    setSelectedTime,
    showTimePicker,
    setShowTimePicker,
    handleTimeChange,
    handleTimePickerChange,
  };
};