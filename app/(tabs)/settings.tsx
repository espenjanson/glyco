import * as Notifications from "expo-notifications";
import React, { useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { BasalInsulinForm } from "../../components/medical/BasalInsulinForm";
import { CorrectionInsulinForm } from "../../components/medical/CorrectionInsulinForm";
import { MealInsulinForm } from "../../components/medical/MealInsulinForm";
import { AppSettingsForm } from "../../components/settings/AppSettingsForm";
import { DataExportSection } from "../../components/settings/DataExportSection";
import { PatientInformationForm } from "../../components/settings/PatientInformationForm";
import { SettingsActions } from "../../components/settings/SettingsActions";
import { Column, Container, SafeBox, ScrollBox } from "../../components/ui/Box";
import { useSettings } from "../../hooks/useSettings";

const SettingsTab = React.memo(() => {
  const {
    userSettings,
    medicalSettings,
    sectionWarnings,
    loadSettings,
    updateUserSetting,
    updateMedicalSetting,
  } = useSettings();

  const setupNotifications = useCallback(async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please enable notifications for reminders"
      );
    }
  }, []);

  useEffect(() => {
    loadSettings();
    setupNotifications();
  }, [loadSettings, setupNotifications]);

  if (!userSettings || !medicalSettings) return null;

  return (
    <SafeBox>
      <Container>
        <ScrollBox showsVerticalScrollIndicator={false}>
          <Column>
            <AppSettingsForm
              settings={userSettings}
              updateSetting={updateUserSetting}
            />
            <PatientInformationForm
              settings={medicalSettings}
              updateSetting={updateMedicalSetting}
              warnings={sectionWarnings["Patient Information"] || []}
            />

            <BasalInsulinForm
              settings={medicalSettings}
              updateSetting={updateMedicalSetting}
              warnings={sectionWarnings["Basal Insulin"] || []}
            />

            <MealInsulinForm
              settings={medicalSettings}
              updateSetting={updateMedicalSetting}
              warnings={sectionWarnings["Meal Insulin"] || []}
            />

            <CorrectionInsulinForm
              settings={medicalSettings}
              updateSetting={updateMedicalSetting}
              warnings={sectionWarnings["Correction Insulin"] || []}
              glucoseUnit={userSettings.glucoseUnit}
            />

            <DataExportSection />

            <SettingsActions onSettingsReloaded={loadSettings} />
          </Column>
        </ScrollBox>
      </Container>
    </SafeBox>
  );
});

SettingsTab.displayName = 'SettingsTab';

export default SettingsTab;