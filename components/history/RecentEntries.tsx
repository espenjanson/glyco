import { observer } from "mobx-react-lite";
import React from "react";
import { useGlucoseStore } from "../../stores/StoreProvider";
import { GlucoseReading } from "../../types";
import { Card, Column, Text } from "../ui/Box";
import { ReadingEntry } from "./ReadingEntry";

interface RecentEntriesProps {
  onEditReading?: (reading: GlucoseReading) => void;
  maxEntries?: number;
}

export const RecentEntries: React.FC<RecentEntriesProps> = observer(
  ({ onEditReading, maxEntries = 5 }) => {
    const glucoseStore = useGlucoseStore();
    const readings = glucoseStore.readings.slice(0, maxEntries);

    return (
      <Card variant="outlined">
        <Column gap="m">
          <Text variant="title">Recent Entries</Text>
          <Column gap="s" paddingHorizontal="s">
            {readings.map((reading, index) => (
              <ReadingEntry
                key={reading.id}
                reading={reading}
                onEdit={onEditReading}
                showDivider={index < readings.length - 1}
              />
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
  }
);
