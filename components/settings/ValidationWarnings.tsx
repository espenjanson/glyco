import React from "react";
import { Box, Column, Text } from "../ui/Box";

interface ValidationWarningsProps {
  warnings: string[];
}

export const ValidationWarnings: React.FC<ValidationWarningsProps> = ({
  warnings,
}) => {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <Box
      padding="s"
      backgroundColor="backgroundSecondary"
      borderRadius="s"
      borderColor="error"
      borderWidth={1}
    >
      <Column gap="xs">
        <Text variant="caption" color="error">
          {warnings.length === 1 ? "Validation Warning:" : "Validation Warnings:"}
        </Text>
        {warnings.map((warning, index) => (
          <Text key={index} variant="caption" color="error">
            • {warning}
          </Text>
        ))}
      </Column>
    </Box>
  );
};