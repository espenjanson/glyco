import React from "react";
import { Text, TouchableBox } from "../ui/Box";

export type QuickActionType = "glucose" | "food" | "insulin" | "exercise";

interface QuickActionButtonProps {
  type: QuickActionType;
  onPress: (type: QuickActionType) => void;
}

const ACTION_CONFIG: Record<QuickActionType, { emoji: string; label: string }> =
  {
    glucose: { emoji: "🩸", label: "Blood" },
    food: { emoji: "🍽️", label: "Food" },
    insulin: { emoji: "💉", label: "Insulin" },
    exercise: { emoji: "🏃", label: "Exercise" },
  };

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  type,
  onPress,
}) => {
  const config = ACTION_CONFIG[type];

  return (
    <TouchableBox
      onPress={() => onPress(type)}
      width={60}
      height={60}
      backgroundColor="white"
      borderRadius="round"
      justifyContent="center"
      alignItems="center"
      shadowColor="black"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      elevation={4}
    >
      <Text style={{ fontSize: 28, lineHeight: 32 }}>{config.emoji}</Text>
    </TouchableBox>
  );
};
