import React from 'react';
import { Box, Column, Text, Card, Row } from '../ui/Box';

interface StatsData {
  average: number;
  inRangePercentage: number;
  a1cEstimate: number;
  totalReadings: number;
}

interface StatsCardProps {
  stats: StatsData;
  timeRange: number;
  glucoseUnit?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats, timeRange, glucoseUnit }) => {
  return (
    <Card variant="elevated">
      <Column gap="m">
        <Text variant="title">
          Stats ({timeRange} days)
        </Text>
        <Row justifyContent="space-between" gap="s">
          <Box flex={1}>
          <Text variant="caption" color="textLight" textAlign="center">
            Average
          </Text>
          <Text variant="subheader" color="text" textAlign="center">
            {stats.average}
          </Text>
          <Text variant="caption" color="textLight" textAlign="center">
            {glucoseUnit}
          </Text>
        </Box>
          <Box width={1} backgroundColor="border" />
          <Box flex={1}>
            <Text variant="caption" color="textLight" textAlign="center">
              In Range
            </Text>
            <Text variant="subheader" color="text" textAlign="center">
              {stats.inRangePercentage}%
            </Text>
            <Text variant="caption" color="textLight" textAlign="center">
              {stats.totalReadings} readings
            </Text>
          </Box>
          <Box width={1} backgroundColor="border" />
          <Box flex={1}>
          <Text variant="caption" color="textLight" textAlign="center">
            Est. A1C
          </Text>
          <Text variant="subheader" color="text" textAlign="center">
            {stats.a1cEstimate}%
          </Text>
          <Text variant="caption" color="textLight" textAlign="center">
            estimate
          </Text>
          </Box>
        </Row>
      </Column>
    </Card>
  );
};