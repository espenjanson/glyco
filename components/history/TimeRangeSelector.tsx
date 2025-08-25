import { observer } from "mobx-react-lite";
import React from "react";
import { useHistoryStore } from "../../stores/StoreProvider";
import { Box, Card, Column, Row, Text } from "../ui/Box";
import { Button } from "../ui/Button";

export const TimeRangeSelector: React.FC = observer(() => {
  const historyStore = useHistoryStore();
  const timeRange = historyStore.timeRange;

  return (
    <Card variant="outlined">
      <Column gap="m">
        <Text variant="title">Time Range</Text>
        <Row gap="xs">
          {[7, 14, 30, 90].map((days) => (
            <Box key={days} flex={1}>
              <Button
                label={`${days}d`}
                onPress={() => historyStore.setTimeRange(days)}
                variant={timeRange === days ? "primary" : "outline"}
                fullWidth
                size="small"
              />
            </Box>
          ))}
        </Row>
      </Column>
    </Card>
  );
});
