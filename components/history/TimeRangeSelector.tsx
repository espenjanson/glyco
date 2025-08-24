import React from 'react';
import { Box, Column, Text, Card, Row } from '../ui/Box';
import { Button } from '../ui/Button';

interface TimeRangeSelectorProps {
  timeRange: number;
  onTimeRangeChange: (range: number) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  return (
    <Card variant="outlined">
      <Column gap="m">
        <Text variant="title">
          Time Range
        </Text>
        <Row gap="xs">
          {[7, 14, 30, 90].map((days) => (
            <Box key={days} flex={1}>
              <Button
                label={`${days}d`}
                onPress={() => onTimeRangeChange(days)}
                variant={timeRange === days ? 'primary' : 'outline'}
                fullWidth
                size="small"
              />
            </Box>
          ))}
        </Row>
      </Column>
    </Card>
  );
};