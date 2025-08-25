import React from "react";
import { Card, Column } from "../ui/Box";
import { GlucoseUnitSelector } from "./GlucoseUnitSelector";
import { RemindersSection } from "./RemindersSection";
import { SectionHeader } from "./SectionHeader";

export const AppSettingsForm: React.FC = () => {
  return (
    <Card variant="elevated" marginBottom="m">
      <SectionHeader title="App Settings" section="App Settings" />

      <Column gap="m">
        <GlucoseUnitSelector />
        <RemindersSection />
      </Column>
    </Card>
  );
};
