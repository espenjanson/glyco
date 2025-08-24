import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";

export default function TabLayout() {
  const theme = useTheme<Theme>();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarStyle: {
          position: "absolute",
          bottom: 40,
          width: "auto",
          marginHorizontal: 96,
          borderRadius: theme.borderRadii.round,
          height: "auto",
          shadowColor: theme.colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 10,
          alignItems: "center",
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarItemStyle: {
          flex: 0,
          marginHorizontal: theme.spacing.s,
          paddingVertical: theme.spacing.m,
          marginBottom: 0,
        },
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontFamily: "Circular-Book",
          fontSize: 11,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "analytics" : "analytics-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
