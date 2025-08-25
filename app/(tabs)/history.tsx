import React, { useState } from 'react';
import { Box, Text, Container, Column, SafeBox, ScrollBox } from '../../components/ui/Box';
import { GlucoseReading } from '../../types';
import { observer } from 'mobx-react-lite';
import { useGlucoseStore, useSettingsStore } from '../../stores/StoreProvider';
import { MedicalCalculator } from '../../utils/medical';
import { StatsCard } from '../../components/history/StatsCard';
import { ChartCard } from '../../components/history/ChartCard';
import { RecentEntries } from '../../components/history/RecentEntries';
import { TimeRangeSelector } from '../../components/history/TimeRangeSelector';
import { GlucoseInputSheet } from '../../components/sheets/GlucoseInputSheet';

const HistoryTab = observer(() => {
  const glucoseStore = useGlucoseStore();
  const settingsStore = useSettingsStore();
  const [timeRange, setTimeRange] = useState(7);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [editingReading, setEditingReading] = useState<GlucoseReading | null>(null);

  const getFilteredReadings = () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - timeRange);
    return glucoseStore.readings.filter(r => r.timestamp >= cutoff).slice(0, 20);
  };

  const calculateStats = () => {
    const filteredReadings = getFilteredReadings();
    if (filteredReadings.length === 0) return null;

    const sum = filteredReadings.reduce((acc, r) => acc + r.value, 0);
    const average = sum / filteredReadings.length;
    
    const inRange = filteredReadings.filter(r => {
      const settings = settingsStore.userSettings;
      if (!settings) return false;
      return r.value >= settings.targetRangeLow && r.value <= settings.targetRangeHigh;
    }).length;

    const percentage = Math.round((inRange / filteredReadings.length) * 100);
    const a1c = MedicalCalculator.estimateHbA1c(average);

    return {
      average: Math.round(average),
      inRangePercentage: percentage,
      a1cEstimate: a1c,
      totalReadings: filteredReadings.length,
    };
  };

  const handleEditReading = (reading: GlucoseReading) => {
    setEditingReading(reading);
    setShowEditSheet(true);
  };

  const handleGlucoseSaved = (updatedReading: GlucoseReading) => {
    // Store automatically updates, no manual refresh needed
    setShowEditSheet(false);
    setEditingReading(null);
  };

  const stats = calculateStats();
  const filteredReadings = getFilteredReadings();

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

            <TimeRangeSelector
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />

            {stats && (
              <StatsCard
                stats={stats}
                timeRange={timeRange}
                glucoseUnit={settingsStore.glucoseUnit}
              />
            )}

            <ChartCard readings={filteredReadings} />

            <RecentEntries readings={glucoseStore.readings} onEditReading={handleEditReading} />
          </Column>
        </ScrollBox>
      </Container>

      {/* Glucose Edit Sheet */}
      <GlucoseInputSheet
        isVisible={showEditSheet}
        onClose={() => {
          setShowEditSheet(false);
          setEditingReading(null);
        }}
        onSave={handleGlucoseSaved}
        editingReading={editingReading}
      />
    </SafeBox>
  );
});

export default HistoryTab;