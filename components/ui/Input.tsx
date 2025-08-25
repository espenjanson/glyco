import {
  backgroundColor,
  BackgroundColorProps,
  border,
  BorderProps,
  color,
  ColorProps,
  createRestyleComponent,
  layout,
  LayoutProps,
  opacity,
  OpacityProps,
  spacing,
  SpacingProps,
  typography,
  TypographyProps,
  useTheme,
} from "@shopify/restyle";
import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from "react-native";
import { Theme } from "../../theme";

// Restyle props for Input
type RestyleProps = SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  LayoutProps<Theme> &
  OpacityProps<Theme> &
  TypographyProps<Theme>;

// All restyle functions for Input
const restyleFunctions = [
  spacing,
  backgroundColor,
  border,
  color,
  layout,
  opacity,
  typography,
];

// Base input props combining restyle props and React Native TextInput props
type BaseInputProps = RestyleProps & Omit<RNTextInputProps, "style">;

// Create the base restyle component
const RestyleTextInput = createRestyleComponent<BaseInputProps, Theme>(
  restyleFunctions,
  RNTextInput
);

// Base Input component with common functionality
const BaseInput: React.FC<
  BaseInputProps & {
    defaultStyles: Partial<BaseInputProps>;
  }
> = ({ defaultStyles, placeholderTextColor, ...props }) => {
  const theme = useTheme<Theme>();

  // Use theme color for placeholder if not provided
  const defaultPlaceholderColor =
    placeholderTextColor || theme.colors.textLight;

  return (
    <RestyleTextInput
      {...defaultStyles}
      {...props}
      placeholderTextColor={defaultPlaceholderColor}
    />
  );
};

// Standard text input (44px height)
export const TextInput: React.FC<BaseInputProps> = (props) => {
  const defaultStyles: Partial<BaseInputProps> = {
    borderWidth: 1,
    borderColor: "border",
    borderRadius: "l",
    paddingHorizontal: "sm",
    paddingVertical: "sm",
    fontSize: 16,
    color: "text",
    backgroundColor: "background",
    minHeight: 44,
  };

  return <BaseInput defaultStyles={defaultStyles} {...props} />;
};

// Large text input (56px height)
export const LargeTextInput: React.FC<BaseInputProps> = (props) => {
  const defaultStyles: Partial<BaseInputProps> = {
    fontSize: 40,
    fontWeight: "bold",
    color: "text",
    backgroundColor: "background",
  };

  return <BaseInput defaultStyles={defaultStyles} {...props} />;
};

// Multiline text input (100px height)
export const MultilineTextInput: React.FC<BaseInputProps> = (props) => {
  const defaultStyles: Partial<BaseInputProps> = {
    fontSize: 20,
    color: "textLight",
    minHeight: 140,
    multiline: true,
  };

  return <BaseInput defaultStyles={defaultStyles} {...props} />;
};

// Export the default TextInput as Input for backwards compatibility
export const Input = TextInput;
