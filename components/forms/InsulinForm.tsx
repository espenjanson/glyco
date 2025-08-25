import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useInsulinStore } from "../../stores/StoreProvider";
import { InjectionSiteSelector } from "../sheets/InjectionSiteSelector";
import { InsulinDosageSelector } from "../sheets/InsulinDosageSelector";
import { InsulinTypeSelector } from "../sheets/InsulinTypeSelector";
import { SheetFooterButtons } from "../sheets/SheetFooterButtons";
import { Column, Text } from "../ui/Box";
import { CustomDatePicker } from "../ui/CustomDatePicker";
import { Input } from "../ui/Input";

interface InsulinFormProps {
  closeSheet: () => void;
}

export const InsulinForm: React.FC<InsulinFormProps> = observer(
  ({ closeSheet }) => {
    const insulinStore = useInsulinStore();

    useEffect(() => {
      insulinStore.resetDraft();
    }, []);

    const handleSave = async () => {
      insulinStore.saveDraftShot();
      closeSheet();
    };

    return (
      <Column gap="l">
        {/* Insulin Units */}
        <InsulinDosageSelector
          value={insulinStore.draftUnits}
          onValueChange={insulinStore.setDraftUnits}
        />

        {/* Insulin Type */}
        <InsulinTypeSelector
          selectedType={insulinStore.draftType}
          onTypeChange={insulinStore.setDraftType}
        />

        {/* Injection Site */}
        <InjectionSiteSelector
          selectedSite={insulinStore.draftSite}
          onSiteChange={insulinStore.setDraftSite}
        />

        {/* Date & Time */}
        <CustomDatePicker
          label="Date & Time"
          value={insulinStore.draftSelectedTime}
          onChange={insulinStore.setDraftSelectedTime}
          mode="datetime"
          maximumDate={new Date()}
        />

        {/* Notes */}
        <Column gap="s">
          <Text variant="body">Notes (Optional)</Text>
          <Input
            value={insulinStore.draftNotes}
            onChangeText={insulinStore.setDraftNotes}
            placeholder="Add context about the injection"
            variant="multiline"
          />
        </Column>

        {/* Footer Buttons */}
        <SheetFooterButtons
          onCancel={closeSheet}
          onSave={handleSave}
          saveLabel="Save Shot"
          disabled={!insulinStore.isDraftValid}
          successMessage="Insulin shot saved successfully!"
          errorMessage="Failed to save insulin shot."
        />
      </Column>
    );
  }
);

InsulinForm.displayName = "InsulinForm";
