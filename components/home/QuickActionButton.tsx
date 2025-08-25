import React from "react";
import { QuickAction } from "../../types/enums";
import { Text, TouchableBox } from "../ui/Box";

interface QuickActionButtonProps {
  type: QuickAction;
  onPress: (type: QuickAction) => void;
}

const ACTION_CONFIG: Record<QuickAction, { emoji: string; label: string }> = {
  [QuickAction.GLUCOSE]: { emoji: "🩸", label: "Blood" },
  [QuickAction.FOOD]: { emoji: "🍽️", label: "Food" },
  [QuickAction.INSULIN]: { emoji: "💉", label: "Insulin" },
  [QuickAction.EXERCISE]: { emoji: "🏃", label: "Exercise" },
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
      shadowColor="shadow"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      elevation={4}
    >
      <Text style={{ fontSize: 28, lineHeight: 32 }}>{config.emoji}</Text>
    </TouchableBox>
  );
};
