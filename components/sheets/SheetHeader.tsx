import React from "react";
import { Row, Text } from "../ui/Box";
import { CancelButton } from "../ui/CancelButton";

interface SheetHeaderProps {
  emoji?: string;
  onClose: () => void;
  showCloseButton?: boolean;
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({
  emoji,
  onClose,
  showCloseButton = true,
}) => {
  return (
    <Row
      justifyContent="space-between"
      alignItems="center"
      padding="l"
      paddingBottom="s"
    >
      {/* Title with optional emoji */}
      <Row alignItems="center" gap="m" flex={1}>
        {emoji && (
          <Text fontSize={32} lineHeight={38}>
            {emoji}
          </Text>
        )}
      </Row>

      {/* Close button */}
      {showCloseButton && <CancelButton onCancel={onClose} />}
    </Row>
  );
};
