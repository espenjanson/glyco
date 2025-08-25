import * as Notifications from "expo-notifications";
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

const SettingsTab = () => {
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

  return (
    <SafeBox>
      <Container>
        <ScrollBox showsVerticalScrollIndicator={false}>
          <Column>
            <AppSettingsForm />

            <EditablePatientInformationForm />

            <EditableBasalInsulinForm />

            <EditableMealInsulinForm />

            <EditableCorrectionInsulinForm />

            <DataExportSection />

            <SettingsActions />
          </Column>
        </ScrollBox>
      </Container>
    </SafeBox>
  );
};

SettingsTab.displayName = "SettingsTab";

export default SettingsTab;
