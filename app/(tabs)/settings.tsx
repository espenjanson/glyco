import * as Notifications from "expo-notifications";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { AppSettingsForm } from "../../components/settings/AppSettingsForm";
import { DataExportSection } from "../../components/settings/DataExportSection";
import { EditableBasalInsulinForm } from "../../components/settings/EditableBasalInsulinForm";
import { EditableCorrectionInsulinForm } from "../../components/settings/EditableCorrectionInsulinForm";
import { EditableMealInsulinForm } from "../../components/settings/EditableMealInsulinForm";
import { EditablePatientInformationForm } from "../../components/settings/EditablePatientInformationForm";
import { SettingsActions } from "../../components/settings/SettingsActions";
import { Column, Container, SafeBox, ScrollBox } from "../../components/ui/Box";
import { useSettingsStore } from "../../stores/StoreProvider";

const SettingsTab = observer(() => {
  const settingsStore = useSettingsStore();

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please enable notifications for reminders"
      );
    }
  };

  useEffect(() => {
    setupNotifications();
  }, []);

  if (!settingsStore.userSettings || !settingsStore.medicalSettings)
    return null;

  const { userSettings, medicalSettings } = settingsStore;

  return (
    <SafeBox>
      <Container>
        <ScrollBox showsVerticalScrollIndicator={false}>
          <Column>
            <AppSettingsForm
              settings={userSettings}
              updateSetting={settingsStore.updateUserSetting}
            />

            <EditablePatientInformationForm
              settings={medicalSettings}
              warnings={
                settingsStore.sectionWarnings["Patient Information"] || []
              }
            />

            <EditableBasalInsulinForm
              settings={medicalSettings}
              warnings={settingsStore.sectionWarnings["Basal Insulin"] || []}
            />

            <EditableMealInsulinForm
              settings={medicalSettings}
              warnings={settingsStore.sectionWarnings["Meal Insulin"] || []}
            />

            <EditableCorrectionInsulinForm
              settings={medicalSettings}
              warnings={
                settingsStore.sectionWarnings["Correction Insulin"] || []
              }
              glucoseUnit={userSettings.glucoseUnit}
            />

            <DataExportSection />

            <SettingsActions onSettingsReloaded={() => {}} />
          </Column>
        </ScrollBox>
      </Container>
    </SafeBox>
  );
});

SettingsTab.displayName = "SettingsTab";

export default SettingsTab;
