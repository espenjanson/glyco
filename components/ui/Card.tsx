import {
  backgroundColor,
  BackgroundColorProps,
  border,
  BorderProps,
  createRestyleComponent,
  createVariant,
  layout,
  LayoutProps,
  shadow,
  ShadowProps,
  spacing,
  SpacingProps,
  VariantProps,
} from "@shopify/restyle";
import React from "react";
import { View } from "react-native";
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

type CardProps = RestyleProps &
  VariantProps<Theme, "cardVariants"> & {
    children?: React.ReactNode;
  };

const CardBase = createRestyleComponent<CardProps, Theme>(
  [
    ...restyleFunctions,
    createVariant({ themeKey: "cardVariants" }),
  ],
  View
);

export const Card: React.FC<CardProps> = ({ 
  children, 
  ...props 
}) => {
  return (
    <CardBase {...props}>
      {children}
    </CardBase>
  );
};