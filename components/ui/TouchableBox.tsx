import {
  backgroundColor,
  BackgroundColorProps,
  border,
  BorderProps,
  createRestyleComponent,
  layout,
  LayoutProps,
  shadow,
  ShadowProps,
  spacing,
  SpacingProps,
} from "@shopify/restyle";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { Theme } from "../../theme";

// Base restyle props type for consistency
type RestyleProps = SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ShadowProps<Theme> &
  LayoutProps<Theme>;

// All restyle functions for consistent application
const restyleFunctions = [
  spacing,
  backgroundColor,
  border,
  shadow,
  layout,
];

type TouchableBoxProps = RestyleProps & 
  TouchableOpacityProps & {
    children?: React.ReactNode;
  };

const TouchableBoxBase = createRestyleComponent<TouchableBoxProps, Theme>(
  restyleFunctions,
  TouchableOpacity
);

export const TouchableBox = React.forwardRef<View, TouchableBoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <TouchableBoxBase ref={ref} {...props}>
        {children}
      </TouchableBoxBase>
    );
  }
);

TouchableBox.displayName = 'TouchableBox';