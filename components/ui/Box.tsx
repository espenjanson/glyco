import {
  backgroundColor,
  BackgroundColorProps,
  border,
  BorderProps,
  createBox,
  createRestyleComponent,
  createText,
  layout,
  LayoutProps,
  shadow,
  ShadowProps,
  spacing,
  SpacingProps,
} from "@shopify/restyle";
import React from "react";
import { SafeAreaView, ScrollView, ScrollViewProps, View } from "react-native";
import { Theme } from "../../theme";

// Base restyle props type for consistency
type RestyleProps = SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ShadowProps<Theme> &
  LayoutProps<Theme>;

// All restyle functions for consistent application
const restyleFunctions = [spacing, backgroundColor, border, shadow, layout];

// Basic Box component with all layout properties
export const Box = createBox<Theme>();

// Text component with typography variants
export const Text = createText<Theme>();

// ROW COMPONENT - Direct restyle component without wrapper
type RowProps = RestyleProps & {
  children?: React.ReactNode;
};

const RowBase = createRestyleComponent<RowProps, Theme>(restyleFunctions, View);

export const Row: React.FC<RowProps> = ({ children, ...props }) => {
  return (
    <RowBase flexDirection="row" alignItems="center" {...props}>
      {children}
    </RowBase>
  );
};

// COLUMN COMPONENT - Direct restyle component without wrapper
type ColumnProps = RestyleProps & {
  children?: React.ReactNode;
};

const ColumnBase = createRestyleComponent<ColumnProps, Theme>(
  restyleFunctions,
  View
);

export const Column: React.FC<ColumnProps> = ({ children, ...props }) => {
  return (
    <ColumnBase flexDirection="column" {...props}>
      {children}
    </ColumnBase>
  );
};

// CENTER COMPONENT - Direct restyle component without wrapper
type CenterProps = RestyleProps & {
  children?: React.ReactNode;
};

const CenterBase = createRestyleComponent<CenterProps, Theme>(
  restyleFunctions,
  View
);

export const Center: React.FC<CenterProps> = ({ children, ...props }) => {
  return (
    <CenterBase flex={1} justifyContent="center" alignItems="center" {...props}>
      {children}
    </CenterBase>
  );
};

// CONTAINER COMPONENT - Direct restyle component
type ContainerProps = RestyleProps & {
  children?: React.ReactNode;
};

const ContainerBase = createRestyleComponent<ContainerProps, Theme>(
  restyleFunctions,
  View
);

export const Container: React.FC<ContainerProps> = ({ children, ...props }) => {
  return (
    <ContainerBase
      flex={1}
      paddingBottom="xxl"
      backgroundColor="background"
      {...props}
    >
      {children}
    </ContainerBase>
  );
};

// SAFE CONTAINER COMPONENT - Direct restyle component
type SafeContainerProps = RestyleProps & {
  children?: React.ReactNode;
};

const SafeContainerBase = createRestyleComponent<SafeContainerProps, Theme>(
  restyleFunctions,
  View
);

export const SafeContainer: React.FC<SafeContainerProps> = ({
  children,
  ...props
}) => {
  return (
    <SafeContainerBase flex={1} backgroundColor="background" {...props}>
      {children}
    </SafeContainerBase>
  );
};

// SCROLL BOX COMPONENT - Properly composed without inner wrapper
type ScrollBoxProps = RestyleProps &
  Omit<ScrollViewProps, "children"> & {
    children?: React.ReactNode;
  };

const ScrollBoxBase = createRestyleComponent<ScrollBoxProps, Theme>(
  restyleFunctions,
  ScrollView
);

export const ScrollBox = React.forwardRef<ScrollView, ScrollBoxProps>(
  (
    {
      children,
      showsVerticalScrollIndicator = true,
      showsHorizontalScrollIndicator = true,
      ...props
    },
    ref
  ) => {
    return (
      <ScrollBoxBase
        ref={ref}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        {...props}
      >
        {children}
      </ScrollBoxBase>
    );
  }
);

ScrollBox.displayName = "ScrollBox";

// SAFE BOX COMPONENT - Clean implementation with SafeAreaView as base
type SafeBoxProps = RestyleProps & {
  children?: React.ReactNode;
  backgroundColor?: keyof Theme["colors"];
};

const SafeBoxBase = createRestyleComponent<SafeBoxProps, Theme>(
  restyleFunctions,
  SafeAreaView
);

export const SafeBox = React.forwardRef<SafeAreaView, SafeBoxProps>(
  ({ children, backgroundColor = "background", ...props }, ref) => {
    return (
      <SafeBoxBase
        ref={ref}
        flex={1}
        backgroundColor={backgroundColor}
        {...props}
      >
        {children}
      </SafeBoxBase>
    );
  }
);

SafeBox.displayName = "SafeBox";

// Re-export extracted components for backward compatibility
export { Card } from "./Card";
export { Spacer } from "./Spacer";
export { TouchableBox } from "./TouchableBox";
