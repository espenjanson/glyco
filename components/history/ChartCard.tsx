import React from 'react';
import { Dimensions } from 'react-native';
import { Box, Column, Text, Card } from '../ui/Box';
import { LineChart } from '../charts/LineChart';
import { GlucoseReading } from '../../types';

const screenWidth = Dimensions.get('window').width;

interface ChartCardProps {
  readings: GlucoseReading[];
}

export const ChartCard: React.FC<ChartCardProps> = ({ readings }) => {
  return (
    <Card variant="outlined">
      <Column gap="m">
        <Text variant="title">
          Glucose Trend
        </Text>
        {readings.length >= 2 ? (
          <LineChart
            data={readings}
            width={screenWidth - 64}
            height={200}
          />
        ) : (
          <Box padding="xl" alignItems="center">
            <Column gap="s" alignItems="center">
              <Text variant="body" color="textSecondary" textAlign="center">
                Not enough data to show chart
              </Text>
              <Text variant="caption" color="textLight" textAlign="center">
                Log at least 2 glucose readings
              </Text>
            </Column>
          </Box>
        )}
      </Column>
    </Card>
  );
};