import React from "react";
import { Box, Column, Row } from "../ui/Box";
import { Button } from "../ui/Button";

interface WizardLayoutProps {
  currentStep: number;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showNext?: boolean;
  showBack?: boolean;
  customFooter?: React.ReactNode;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  currentStep,
  children,
  onNext,
  onBack,
  nextLabel = "Next",
  nextDisabled = false,
  showNext = true,
  showBack = true,
  customFooter,
}) => {
  const renderFooter = () => {
    if (customFooter) {
      return customFooter;
    }

    return (
      <Row gap="m">
        {showBack && currentStep > 0 && (
          <Box flex={1}>
            <Button
              label="Back"
              onPress={onBack || (() => {})}
              variant="secondary"
              size="medium"
              fullWidth
            />
          </Box>
        )}
        {showNext && (
          <Box flex={1}>
            <Button
              label={nextLabel}
              onPress={onNext || (() => {})}
              variant="primary"
              size="medium"
              disabled={nextDisabled}
              fullWidth
            />
          </Box>
        )}
      </Row>
    );
  };

  return (
    <Column padding="l" gap="l">
      {children}

      {renderFooter()}
    </Column>
  );
};
