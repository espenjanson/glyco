import { observer } from "mobx-react-lite";
import React from "react";
import { Dimensions } from "react-native";
import { useHistoryStore } from "../../stores/StoreProvider";
import { LineChart } from "../charts/LineChart";
import { Box, Card, Column, Text } from "../ui/Box";

const screenWidth = Dimensions.get("window").width;

export const ChartCard: React.FC = observer(() => {
  const historyStore = useHistoryStore();
  const readings = historyStore.filteredGlucoseReadings;
  return (
    <Card variant="outlined">
      <Column gap="m">
        <Text variant="title">Glucose Trend</Text>
        {readings.length >= 2 ? (
          <LineChart data={readings} width={screenWidth - 64} height={200} />
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
});
