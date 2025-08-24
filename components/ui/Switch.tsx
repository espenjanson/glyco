import React from "react";
import { Switch as RNSwitch } from "react-native";

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const Switch: React.FC<SwitchProps> = ({ value, onValueChange }) => {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#858585", true: "#161616" }}
      thumbColor="#ffffff"
    />
  );
};