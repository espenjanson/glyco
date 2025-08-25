import React from "react";
import { QuickAction } from "../../types/enums";
import { Box, Row, Text } from "../ui/Box";
import { QuickActionButton } from "./QuickActionButton";

interface QuickActionsSectionProps {
  onActionPress: (action: QuickAction) => void;
}

const QUICK_ACTIONS: QuickAction[] = [
  QuickAction.GLUCOSE,
  QuickAction.FOOD,
  QuickAction.INSULIN,
  QuickAction.EXERCISE,
];

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onActionPress,
}) => {
  return (
    <Box marginHorizontal="m" marginVertical="m">
      <Text variant="title" marginBottom="m" textAlign="center">
        Quick Actions
      </Text>
      <Row justifyContent="space-around" alignItems="center">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionButton
            key={action}
            type={action}
            onPress={onActionPress}
          />
        ))}
      </Row>
    </Box>
  );
};
