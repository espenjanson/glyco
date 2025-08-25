import { observer } from "mobx-react-lite";
import React from "react";
import { useHistoryStore } from "../../stores/StoreProvider";
import { Box, Card, Column, Row, Text } from "../ui/Box";

export const StatsCard: React.FC = observer(() => {
  const historyStore = useHistoryStore();
  const stats = historyStore.historyStats;
  const timeRange = historyStore.timeRange;
  const glucoseUnit = historyStore.glucoseUnit;

  if (!stats) return null;
  return (
    <Card variant="elevated">
      <Column gap="m">
        <Text variant="title">Stats ({timeRange} days)</Text>
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
});
