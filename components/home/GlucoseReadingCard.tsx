import { observer } from "mobx-react-lite";
import React from "react";
import { useGlucoseStore, useSettingsStore } from "../../stores/StoreProvider";
import { formatTimeAgo } from "../../utils/datetime";
import { Column, Text } from "../ui/Box";
import { Card } from "../ui/Card";

export const GlucoseReadingCard: React.FC = observer(() => {
  const glucoseStore = useGlucoseStore();
  const settingsStore = useSettingsStore();

  return (
    <Card variant="elevated">
      <Column alignItems="center" justifyContent="center" padding="l" gap="s">
        <Text variant="caption" color="textLight">
          Latest Blood Sugar
        </Text>
        <Text variant="display" textAlign="center">
          {glucoseStore.parsedLastReading}
        </Text>
        <Text variant="bodySmall" color="textSecondary">
          {settingsStore.glucoseUnit}
        </Text>
        {glucoseStore.lastReading && (
          <Text variant="caption" color="textLight">
            {formatTimeAgo(glucoseStore.lastReading.timestamp)}
          </Text>
        )}
      </Column>
    </Card>
  );
});

GlucoseReadingCard.displayName = "GlucoseReadingCard";
