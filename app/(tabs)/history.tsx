import React, { useState } from "react";
import { ChartCard } from "../../components/history/ChartCard";
import { RecentEntries } from "../../components/history/RecentEntries";
import { StatsCard } from "../../components/history/StatsCard";
import { TimeRangeSelector } from "../../components/history/TimeRangeSelector";
import { GlucoseInputSheet } from "../../components/sheets/GlucoseInputSheet";
import {
  Box,
  Column,
  Container,
  SafeBox,
  ScrollBox,
  Text,
} from "../../components/ui/Box";
import { GlucoseReading } from "../../types";

const HistoryTab = () => {
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [editingReading, setEditingReading] = useState<GlucoseReading | null>(
    null
  );

  const handleEditReading = (reading: GlucoseReading) => {
    setEditingReading(reading);
    setShowEditSheet(true);
  };

  const handleGlucoseSaved = () => {
    // Store automatically updates, no manual refresh needed
    setShowEditSheet(false);
    setEditingReading(null);
  };

  return (
    <SafeBox>
      <Container>
        <ScrollBox showsVerticalScrollIndicator={false}>
          <Column>
            <Box marginBottom="l">
              <Text variant="header" color="text">
                History & Charts
              </Text>
              <Text variant="body" color="textSecondary" marginTop="s">
                View your diabetes data trends
              </Text>
            </Box>

            <TimeRangeSelector />

            <StatsCard />

            <ChartCard />

            <RecentEntries onEditReading={handleEditReading} />
          </Column>
        </ScrollBox>
      </Container>

      {/* Glucose Edit Sheet */}
      <GlucoseInputSheet
        isVisible={showEditSheet}
        closeSheet={() => {
          setShowEditSheet(false);
          setEditingReading(null);
        }}
        editingReading={editingReading}
      />
    </SafeBox>
  );
};

export default HistoryTab;
