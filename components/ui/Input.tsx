import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from "react-native";

type InputProps = RNTextInputProps & {
  variant?: "default" | "large" | "multiline";
};

export const Input: React.FC<InputProps> = ({
  variant = "default",
  style,
  ...props
}) => {
  const getInputStyle = () => {
    const baseStyle = {
      borderWidth: 1,
      borderColor: "#858585",
      borderRadius: variant === "multiline" ? 8 : 12,
      padding: variant === "large" ? 16 : 12,
      fontSize: variant === "large" ? 18 : 16,
      fontFamily: "Circular-Book",
      color: "#161616",
      backgroundColor: "#FFFFFF",
      minHeight: variant === "large" ? 56 : variant === "multiline" ? 100 : 44,
    };

    return Array.isArray(style) ? [baseStyle, ...style] : [baseStyle, style];
  };

  return (
    <RNTextInput
      style={getInputStyle()}
      placeholderTextColor="#858585"
      multiline={variant === "multiline"}
      {...props}
    />
  );
};