import { createTheme } from "@shopify/restyle";

// Define minimal color palette
const palette = {
  // Core colors
  black: "#161616",
  white: "#FFFFFF",
  lightGray: "#F3F3F5",
  gray: "#858585",

  // Transparent
  transparent: "transparent",
};

const theme = createTheme({
  colors: {
    ...palette,
    // Semantic mappings
    background: palette.white,
    backgroundSecondary: palette.white,
    text: palette.black,
    textSecondary: palette.gray,
    textLight: palette.gray,
    border: palette.gray,
    cardBackground: palette.white,
    primary: palette.black,
    secondary: palette.gray,
    accent: palette.black,
    shadow: palette.black,
    // Legacy colors (mapped to new palette)
    glucoseLow: palette.black,
    glucoseNormal: palette.black,
    glucoseHigh: palette.gray,
    glucoseCritical: palette.black,
    success: palette.black,
    warning: palette.gray,
    error: palette.black,
    info: palette.gray,
  },

  spacing: {
    xs: 4,
    s: 8,
    sm: 12,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  borderRadii: {
    none: 0,
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
    xxl: 24,
    round: 999,
  },

  breakpoints: {
    phone: 0,
    tablet: 768,
    desktop: 1024,
  },

  textVariants: {
    defaults: {
      fontFamily: "Circular-Book",
      fontSize: 16,
      lineHeight: 24,
      color: "text",
    },
    display: {
      fontFamily: "Circular-Bold",
      fontSize: 48,
      lineHeight: 56,
      color: "text",
    },
    header: {
      fontFamily: "Circular-Bold",
      fontSize: 34,
      lineHeight: 42.5,
      color: "text",
    },
    subheader: {
      fontFamily: "Circular-Medium",
      fontSize: 28,
      lineHeight: 36,
      color: "text",
    },
    title: {
      fontFamily: "Circular-Medium",
      fontSize: 20,
      lineHeight: 26,
      color: "text",
    },
    body: {
      fontFamily: "Circular-Book",
      fontSize: 16,
      lineHeight: 24,
      color: "text",
    },
    bodySmall: {
      fontFamily: "Circular-Book",
      fontSize: 14,
      lineHeight: 20,
      color: "textSecondary",
    },
    caption: {
      fontFamily: "Circular-Book",
      fontSize: 12,
      lineHeight: 16,
      color: "textLight",
    },
    button: {
      fontFamily: "Circular-Medium",
      fontSize: 16,
      lineHeight: 24,
      color: "white",
    },
    link: {
      fontFamily: "Circular-Book",
      fontSize: 16,
      lineHeight: 24,
      color: "primary",
      textDecorationLine: "underline",
    },
  },

  shadowVariants: {
    light: {
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    default: {
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    elevated: {
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    floating: {
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 10,
    },
  },

  cardVariants: {
    defaults: {
      backgroundColor: "cardBackground",
      padding: "m",
      marginVertical: "s",
      marginHorizontal: "m",
      borderRadius: "l",
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    elevated: {
      backgroundColor: "cardBackground",
      padding: "m",
      marginVertical: "s",
      marginHorizontal: "m",
      borderRadius: "l",
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    outlined: {
      backgroundColor: "cardBackground",
      padding: "m",
      marginVertical: "s",
      marginHorizontal: "m",
      borderRadius: "l",
      borderWidth: 1,
      borderColor: "border",
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
  },

  buttonVariants: {
    defaults: {
      borderRadius: "l",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      paddingHorizontal: "m",
      paddingVertical: "s",
      minHeight: 44,
    },
    primary: {
      backgroundColor: "primary",
    },
    secondary: {
      backgroundColor: "secondary",
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "primary",
    },
    ghost: {
      backgroundColor: "transparent",
    },
    danger: {
      backgroundColor: "error",
    },
    small: {
      paddingHorizontal: "s",
      paddingVertical: "xs",
      minHeight: 32,
    },
    large: {
      paddingHorizontal: "l",
      paddingVertical: "m",
      minHeight: 56,
    },
    rounded: {
      borderRadius: "round",
    },
    primaryLargeRounded: {
      backgroundColor: "primary",
      paddingHorizontal: "l",
      paddingVertical: "m",
      minHeight: 56,
      borderRadius: "round",
    },
  },

  tabBarVariants: {
    floating: {
      position: "absolute",
      bottom: 40,
      width: "auto",
      marginHorizontal: { phone: 32, tablet: 96 },
      borderRadius: "round",
      height: "auto",
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 10,
      alignItems: "center",
      paddingBottom: 0,
      paddingTop: 0,
    },
  },

  inputVariants: {
    defaults: {
      borderWidth: 1,
      borderColor: "border",
      borderRadius: "l",
      paddingHorizontal: "sm",
      paddingVertical: "sm",
      fontSize: 16,
      color: "text",
      backgroundColor: "background",
      minHeight: 44,
    },
    default: {
      borderWidth: 1,
      borderColor: "border",
      borderRadius: "l",
      paddingHorizontal: "sm",
      paddingVertical: "sm",
      fontSize: 16,
      color: "text",
      backgroundColor: "background",
      minHeight: 44,
    },
    large: {
      borderWidth: 1,
      borderColor: "border",
      borderRadius: "l",
      paddingHorizontal: "m",
      paddingVertical: "m",
      fontSize: 18,
      color: "text",
      backgroundColor: "background",
      minHeight: 56,
    },
    multiline: {
      borderWidth: 1,
      borderColor: "border",
      borderRadius: "m",
      paddingHorizontal: "sm",
      paddingVertical: "sm",
      fontSize: 16,
      color: "text",
      backgroundColor: "background",
      minHeight: 100,
    },
  },
});

export type Theme = typeof theme;

// Dark theme variant (inverted)
const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: palette.black,
    backgroundSecondary: palette.black,
    text: palette.white,
    textSecondary: palette.gray,
    textLight: palette.gray,
    border: palette.gray,
    cardBackground: palette.black,
    primary: palette.white,
    secondary: palette.gray,
    accent: palette.white,
    shadow: palette.white,
  },
};

export { darkTheme, theme };
export default theme;
