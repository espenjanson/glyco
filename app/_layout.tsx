import { Stack } from "expo-router";
import { ThemeProvider } from "@shopify/restyle";
import { theme } from "../theme";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Circular-Black": require("../assets/fonts/CircularStd-Black.otf"),
    "Circular-BlackItalic": require("../assets/fonts/CircularStd-BlackItalic.otf"),
    "Circular-Bold": require("../assets/fonts/CircularStd-Bold.otf"),
    "Circular-BoldItalic": require("../assets/fonts/CircularStd-BoldItalic.otf"),
    "Circular-Book": require("../assets/fonts/CircularStd-Book.otf"),
    "Circular-BookItalic": require("../assets/fonts/CircularStd-BookItalic.otf"),
    "Circular-Medium": require("../assets/fonts/CircularStd-Medium.otf"),
    "Circular-MediumItalic": require("../assets/fonts/CircularStd-MediumItalic.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
