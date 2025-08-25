import React from "react";
import { GlucoseReading } from "../../types";
import { formatDateTime } from "../../utils/datetime";
import { Box, Column, Row, Text, TouchableBox } from "../ui/Box";

interface ReadingEntryProps {
  reading: GlucoseReading;
  onEdit?: (reading: GlucoseReading) => void;
  showDivider?: boolean;
}

const formatContext = (context: string): string => {
  return context.replace(/-/g, " ");
};

export const ReadingEntry: React.FC<ReadingEntryProps> = ({
  reading,
  onEdit,
  showDivider = false,
}) => {
  return (
    <>
      <TouchableBox
        onPress={() => onEdit?.(reading)}
        backgroundColor="background"
        borderRadius="s"
        padding="xs"
      >
        <Row justifyContent="space-between" alignItems="center">
          <Column flex={1}>
            <Text variant="body" color="text">
              {reading.value} {reading.unit}
            </Text>
            <Text variant="caption" color="textLight">
              {formatDateTime(reading.timestamp)}
            </Text>
            {reading.context && (
              <Text variant="caption" color="textSecondary">
                {formatContext(reading.context)}
              </Text>
            )}
            {reading.notes && (
              <Text variant="caption" color="textSecondary">
                {reading.notes}
              </Text>
            )}
          </Column>
        </Row>
      </TouchableBox>
      {showDivider && <Box height={1} backgroundColor="border" />}
    </>
  );
};
