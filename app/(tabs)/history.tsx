import React, { useState, useEffect } from 'react';
import { Box, Text, Container, Column, SafeBox, ScrollBox } from '../../components/ui/Box';
import { StorageService } from '../../utils/storage';
import { GlucoseReading, UserSettings } from '../../types';
import { MedicalCalculator } from '../../utils/medical';
import { StatsCard } from '../../components/history/StatsCard';
import { ChartCard } from '../../components/history/ChartCard';
import { RecentEntries } from '../../components/history/RecentEntries';
import { TimeRangeSelector } from '../../components/history/TimeRangeSelector';
import { GlucoseInputSheet } from '../../components/sheets/GlucoseInputSheet';

export default function HistoryTab() {
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [timeRange, setTimeRange] = useState(7);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [editingReading, setEditingReading] = useState<GlucoseReading | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [glucoseData, userSettings] = await Promise.all([
      StorageService.getGlucoseReadings(),
      StorageService.getUserSettings(),
    ]);
    setReadings(glucoseData);
    setSettings(userSettings);
  };

  const getFilteredReadings = () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - timeRange);
    return readings.filter(r => r.timestamp >= cutoff).slice(0, 20);
  };

  const calculateStats = () => {
    const filteredReadings = getFilteredReadings();
    if (filteredReadings.length === 0) return null;

    const sum = filteredReadings.reduce((acc, r) => acc + r.value, 0);
    const average = sum / filteredReadings.length;
    
    const inRange = filteredReadings.filter(r => {
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
    // Refresh the data after save/update
    loadData();
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
                glucoseUnit={settings?.glucoseUnit}
              />
            )}

            <ChartCard readings={filteredReadings} />

            <RecentEntries readings={readings} onEditReading={handleEditReading} />
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
}