import React from "react";
import { View } from "react-native";
import { Theme } from "../../theme";
import themeObj from "../../theme";

export const Spacer: React.FC<{ 
  size?: keyof Theme["spacing"];
  horizontal?: boolean;
}> = ({ size, horizontal = false }) => {
  const sizeValue = size ? themeObj.spacing[size] : 1;
  
  if (horizontal) {
    return <View style={{ width: sizeValue }} />;
  }
  return <View style={{ height: sizeValue }} />;
};