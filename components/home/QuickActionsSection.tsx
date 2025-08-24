import React from "react";
import { Box, Row, Text } from "../ui/Box";
import { QuickActionButton, QuickActionType } from "./QuickActionButton";

interface QuickActionsSectionProps {
  onActionPress: (action: QuickActionType) => void;
}

const QUICK_ACTIONS: QuickActionType[] = [
  "glucose",
  "food",
  "insulin",
  "exercise",
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
