import React from "react";
import { Box, Column, Row, Text } from "../ui/Box";
import { Button } from "../ui/Button";

interface WizardLayoutProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  onCancel?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showNext?: boolean;
  showBack?: boolean;
  showCancel?: boolean;
  customFooter?: React.ReactNode;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  title,
  currentStep,
  totalSteps,
  stepTitle,
  children,
  onNext,
  onBack,
  onCancel,
  nextLabel = "Next",
  nextDisabled = false,
  showNext = true,
  showBack = true,
  showCancel = false,
  customFooter,
}) => {
  const renderStepIndicator = () => (
    <Row justifyContent="center" gap="s" paddingBottom="m">
      {Array.from({ length: totalSteps }, (_, index) => (
        <Box 
          key={index}
          width={8} 
          height={8} 
          borderRadius="xl" 
          backgroundColor={index < currentStep ? "primary" : "border"}
        />
      ))}
    </Row>
  );

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
        {showCancel && currentStep === 0 && (
          <Box flex={1}>
            <Button
              label="Cancel"
              onPress={onCancel || (() => {})}
              variant="ghost"
              size="medium"
              fullWidth
            />
          </Box>
        )}
      </Row>
    );
  };

  return (
    <Column padding="l" gap="l">
      <Column gap="s">
        <Text variant="title" textAlign="center">
          {title}
        </Text>
        <Text variant="body" textAlign="center" color="textLight">
          {stepTitle}
        </Text>
        {renderStepIndicator()}
      </Column>

      {children}

      {renderFooter()}
    </Column>
  );
};