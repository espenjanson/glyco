import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { QuickActionType } from "../../components/home/QuickActionButton";
import { QuickActionsSection } from "../../components/home/QuickActionsSection";
import { FoodInputSheet } from "../../components/sheets/FoodInputSheet";
import { GlucoseInputSheet } from "../../components/sheets/GlucoseInputSheet";
import { InsulinInputSheet } from "../../components/sheets/InsulinInputSheet";
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
import {
  useGlucoseStore,
  useInsulinStore,
  useSettingsStore,
} from "../../stores/StoreProvider";
import { FoodEntry, GlucoseReading, InsulinShot } from "../../types";
import { GlucoseConverter } from "../../utils/glucose";

const HomeTab = observer(() => {
  const glucoseStore = useGlucoseStore();
  const insulinStore = useInsulinStore();
  const settingsStore = useSettingsStore();
  const [showGlucoseSheet, setShowGlucoseSheet] = useState(false);
  const [showInsulinSheet, setShowInsulinSheet] = useState(false);
  const [showFoodSheet, setShowFoodSheet] = useState(false);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m ago`;
    }
    return `${diffMins}m ago`;
  };

  const handleQuickAction = (action: QuickActionType) => {
    switch (action) {
      case "glucose":
        setShowGlucoseSheet(true);
        break;
      case "insulin":
        setShowInsulinSheet(true);
        break;
      case "food":
        setShowFoodSheet(true);
        break;
      case "exercise":
        // TODO: Implement exercise tracking
        break;
    }
  };

  const handleGlucoseSaved = (newReading: GlucoseReading) => {
    // Store automatically updates, no manual refresh needed
  };

  const handleInsulinSaved = (newShot: InsulinShot) => {
    // Store automatically updates, no manual refresh needed
  };

  const handleFoodSaved = (newEntry: FoodEntry) => {
    // Store automatically updates, no manual refresh needed
  };

  // Get glucose value in user's preferred unit
  const getDisplayGlucoseValue = (): string => {
    const lastGlucose = glucoseStore.lastReading;
    if (!lastGlucose) return "--";

    const userGlucoseUnit = settingsStore.glucoseUnit;
    // Convert from stored mmol/L to user's preferred unit using GlucoseConverter
    const convertedValue = GlucoseConverter.storageToDisplay(
      lastGlucose.value,
      userGlucoseUnit
    );

    // Format using GlucoseConverter for consistency
    return GlucoseConverter.formatForDisplay(convertedValue, userGlucoseUnit);
  };

  const lastGlucose = glucoseStore.lastReading;
  const userGlucoseUnit = settingsStore.glucoseUnit;
  const todayStats = {
    totalUnits: Math.round(insulinStore.totalUnitsToday * 10) / 10,
    shotCount: insulinStore.shotsCountToday,
  };

  return (
    <SafeBox>
      <Container>
        <ScrollBox showsVerticalScrollIndicator={false}>
          <Column gap="m" paddingTop="xl" paddingBottom="l">
            <Box>
              <Text variant="caption" textAlign="center" color="primary">
                Glyco
              </Text>
            </Box>

            <Card variant="elevated">
              <Column
                alignItems="center"
                justifyContent="center"
                padding="l"
                gap="s"
              >
                <Text variant="caption" color="textLight">
                  Latest Blood Sugar
                </Text>
                <Text variant="display" textAlign="center">
                  {getDisplayGlucoseValue()}
                </Text>
                <Text variant="bodySmall" color="textSecondary">
                  {userGlucoseUnit}
                </Text>
                {lastGlucose && (
                  <Text variant="caption" color="textLight">
                    {formatTimeAgo(lastGlucose.timestamp)}
                  </Text>
                )}
              </Column>
            </Card>

            <Card backgroundColor="backgroundSecondary">
              <Column gap="m">
                <Text variant="title">Today&apos;s Summary</Text>
                <Row justifyContent="space-between" gap="s">
                  <Box flex={1}>
                    <Column gap="xs">
                      <Text
                        variant="caption"
                        color="textLight"
                        textAlign="center"
                      >
                        Total Insulin
                      </Text>
                      <Text variant="subheader" color="text" textAlign="center">
                        {todayStats.totalUnits}
                      </Text>
                      <Text
                        variant="caption"
                        color="textLight"
                        textAlign="center"
                      >
                        units
                      </Text>
                    </Column>
                  </Box>
                  <Box width={1} backgroundColor="border" />
                  <Box flex={1}>
                    <Column gap="xs">
                      <Text
                        variant="caption"
                        color="textLight"
                        textAlign="center"
                      >
                        Shots Today
                      </Text>
                      <Text variant="subheader" color="text" textAlign="center">
                        {todayStats.shotCount}
                      </Text>
                      <Text
                        variant="caption"
                        color="textLight"
                        textAlign="center"
                      >
                        injections
                      </Text>
                    </Column>
                  </Box>
                  <Box width={1} backgroundColor="border" />
                  <Box flex={1}>
                    <Column gap="xs">
                      <Text
                        variant="caption"
                        color="textLight"
                        textAlign="center"
                      >
                        Last Glucose
                      </Text>
                      <Text variant="subheader" color="text" textAlign="center">
                        {lastGlucose ? lastGlucose.value : "--"}
                      </Text>
                      <Text
                        variant="caption"
                        color="textLight"
                        textAlign="center"
                      >
                        {lastGlucose?.unit || "mg/dL"}
                      </Text>
                    </Column>
                  </Box>
                </Row>
              </Column>
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

      {/* Food Input Sheet */}
      <FoodInputSheet
        isVisible={showFoodSheet}
        onClose={() => setShowFoodSheet(false)}
        onSave={handleFoodSaved}
      />
    </SafeBox>
  );
});

HomeTab.displayName = "HomeTab";

export default HomeTab;
