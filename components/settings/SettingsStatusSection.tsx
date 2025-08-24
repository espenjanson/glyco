import React from "react";
import { Box, Text } from "../ui/Box";

interface SettingsStatusSectionProps {
  validationWarnings: string[];
}

export const SettingsStatusSection: React.FC<SettingsStatusSectionProps> = ({
  validationWarnings,
}) => {
  if (validationWarnings.length === 0) {
    return null;
  }

  return (
    <Box marginBottom="m">
      {validationWarnings.length > 0 && (
        <Box
          marginTop="s"
          padding="s"
          backgroundColor="backgroundSecondary"
          borderRadius="s"
        >
          <Text variant="caption" color="error" marginBottom="xs">
            Validation Warnings:
          </Text>
          {validationWarnings.map((warning, index) => (
            <Text key={index} variant="caption" color="error">
              • {warning}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
};