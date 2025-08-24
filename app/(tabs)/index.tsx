import React, { useCallback, useEffect, useMemo, useState } from "react";
import { QuickActionType } from "../../components/home/QuickActionButton";
import { QuickActionsSection } from "../../components/home/QuickActionsSection";
import { GlucoseInputSheet } from "../../components/sheets/GlucoseInputSheet";
import { InsulinInputSheet } from "../../components/sheets/InsulinInputSheet";
import { GlucoseConverter } from "../../utils/glucose";
import {
  Box,
  Card,
  Column,
  Container,
  Row,
  SafeBox,
  ScrollBox,
  Text,
} from "../../components/ui/Box";
import { GlucoseReading, InsulinShot } from "../../types";
import { StorageService } from "../../utils/storage";


const HomeTab = React.memo(() => {
  const [lastGlucose, setLastGlucose] = useState<GlucoseReading | null>(null);
  const [todayStats, setTodayStats] = useState({ totalUnits: 0, shotCount: 0 });
  const [userGlucoseUnit, setUserGlucoseUnit] = useState<"mg/dL" | "mmol/L">(
    "mg/dL"
  );
  const [showGlucoseSheet, setShowGlucoseSheet] = useState(false);
  const [showInsulinSheet, setShowInsulinSheet] = useState(false);

  const loadDashboardData = useCallback(async () => {
    const [insulinShots, glucoseReadings, userSettings] = await Promise.all([
      StorageService.getInsulinShots(),
      StorageService.getGlucoseReadings(),
      StorageService.getUserSettings(),
    ]);

    if (glucoseReadings.length > 0) {
      setLastGlucose(glucoseReadings[0]);
    }

    // Set user's preferred glucose unit
    setUserGlucoseUnit(userSettings.glucoseUnit);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayShots = insulinShots.filter((shot) => shot.timestamp >= today);
    const totalUnits = todayShots.reduce((sum, shot) => sum + shot.units, 0);

    setTodayStats({
      totalUnits: Math.round(totalUnits * 10) / 10,
      shotCount: todayShots.length,
    });
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const formatTimeAgo = useCallback((date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m ago`;
    }
    return `${diffMins}m ago`;
  }, []);

  const handleQuickAction = useCallback((action: QuickActionType) => {
    switch (action) {
      case "glucose":
        setShowGlucoseSheet(true);
        break;
      case "insulin":
        setShowInsulinSheet(true);
        break;
      case "food":
      case "exercise":
        // TODO: Implement other action sheets
        break;
    }
  }, []);

  const handleGlucoseSaved = useCallback((newReading: GlucoseReading) => {
    // Update the last glucose reading and refresh dashboard
    setLastGlucose(newReading);
    loadDashboardData();
  }, [loadDashboardData]);

  const handleInsulinSaved = useCallback((newShot: InsulinShot) => {
    // Refresh dashboard to show updated stats
    loadDashboardData();
  }, [loadDashboardData]);

  // Get glucose value in user's preferred unit
  const getDisplayGlucoseValue = useMemo((): string => {
    if (!lastGlucose) return "--";

    // Convert from stored mmol/L to user's preferred unit using GlucoseConverter
    const convertedValue = GlucoseConverter.storageToDisplay(
      lastGlucose.value,
      userGlucoseUnit
    );

    // Format using GlucoseConverter for consistency
    return GlucoseConverter.formatForDisplay(convertedValue, userGlucoseUnit);
  }, [lastGlucose, userGlucoseUnit]);

  return (
    <SafeBox>
      <Container>
        <ScrollBox showsVerticalScrollIndicator={false}>
          <Column>
            <Box marginTop="xl" marginBottom="l">
              <Text variant="caption" textAlign="center" color="primary">
                Glyco
              </Text>
            </Box>

            <Card variant="elevated" marginBottom="m">
              <Column alignItems="center" justifyContent="center" padding="l">
                <Text variant="caption" color="textLight" marginBottom="s">
                  Latest Blood Sugar
                </Text>
                <Text variant="display" textAlign="center">
                  {getDisplayGlucoseValue}
                </Text>
                <Text variant="bodySmall" color="textSecondary">
                  {userGlucoseUnit}
                </Text>
                {lastGlucose && (
                  <Text variant="caption" color="textLight" marginTop="s">
                    {formatTimeAgo(lastGlucose.timestamp)}
                  </Text>
                )}
              </Column>
            </Card>

            <Card backgroundColor="backgroundSecondary" marginBottom="m">
              <Text variant="title" marginBottom="m">
                Today&apos;s Summary
              </Text>
              <Row justifyContent="space-between">
                <Box flex={1} marginRight="s">
                  <Text variant="caption" color="textLight" textAlign="center">
                    Total Insulin
                  </Text>
                  <Text variant="subheader" color="text" textAlign="center">
                    {todayStats.totalUnits}
                  </Text>
                  <Text variant="caption" color="textLight" textAlign="center">
                    units
                  </Text>
                </Box>
                <Box width={1} backgroundColor="border" />
                <Box flex={1} marginHorizontal="s">
                  <Text variant="caption" color="textLight" textAlign="center">
                    Shots Today
                  </Text>
                  <Text variant="subheader" color="text" textAlign="center">
                    {todayStats.shotCount}
                  </Text>
                  <Text variant="caption" color="textLight" textAlign="center">
                    injections
                  </Text>
                </Box>
                <Box width={1} backgroundColor="border" />
                <Box flex={1} marginLeft="s">
                  <Text variant="caption" color="textLight" textAlign="center">
                    Last Glucose
                  </Text>
                  <Text variant="subheader" color="text" textAlign="center">
                    {lastGlucose ? lastGlucose.value : "--"}
                  </Text>
                  <Text variant="caption" color="textLight" textAlign="center">
                    {lastGlucose?.unit || "mg/dL"}
                  </Text>
                </Box>
              </Row>
            </Card>
            <QuickActionsSection onActionPress={handleQuickAction} />
          </Column>
        </ScrollBox>
      </Container>

      {/* Glucose Input Sheet */}
      <GlucoseInputSheet
        isVisible={showGlucoseSheet}
        onClose={() => setShowGlucoseSheet(false)}
        onSave={handleGlucoseSaved}
      />

      {/* Insulin Input Sheet */}
      <InsulinInputSheet
        isVisible={showInsulinSheet}
        onClose={() => setShowInsulinSheet(false)}
        onSave={handleInsulinSaved}
      />
    </SafeBox>
  );
});

HomeTab.displayName = 'HomeTab';

export default HomeTab;
