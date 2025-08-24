import React from 'react';
import { Box, Text, Card, Row, Column, TouchableBox } from '../ui/Box';
import { GlucoseReading } from '../../types';

interface RecentEntriesProps {
  readings: GlucoseReading[];
  onEditReading?: (reading: GlucoseReading) => void;
}

export const RecentEntries: React.FC<RecentEntriesProps> = ({ readings, onEditReading }) => {
  return (
    <Card variant="outlined">
      <Column gap="m">
        <Text variant="title">
          Recent Entries
        </Text>
        <Column gap="m">
          {readings.slice(0, 5).map((reading, index) => (
            <Column key={reading.id} gap="s">
              <TouchableBox
                onPress={() => onEditReading?.(reading)}
                backgroundColor="background"
                borderRadius="s"
                padding="xs"
                style={{ marginHorizontal: -4 }}
              >
                <Row justifyContent="space-between" alignItems="center">
                  <Column flex={1}>
                    <Text variant="body" color="text">
                      {reading.value} {reading.unit}
                    </Text>
                    <Text variant="caption" color="textLight">
                      {reading.timestamp.toLocaleString()}
                    </Text>
                    {reading.context && (
                      <Text variant="caption" color="textSecondary">
                        {reading.context.replace('-', ' ')}
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
              {index < 4 && index < readings.length - 1 && (
                <Box height={1} backgroundColor="border" />
              )}
            </Column>
          ))}
          {readings.length === 0 && (
            <Text variant="body" color="textSecondary" textAlign="center">
              No glucose readings yet
            </Text>
          )}
        </Column>
      </Column>
    </Card>
  );
};