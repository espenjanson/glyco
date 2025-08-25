import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useInsulinStore } from "../../stores/StoreProvider";
import { InputUtils } from "../../utils/input";
import { FormFooterButtons } from "../sheets/FormFooterButtons";
import { InjectionSiteSelector } from "../sheets/InjectionSiteSelector";
import { InsulinDosageSelector } from "../sheets/InsulinDosageSelector";
import { InsulinTypeSelector } from "../sheets/InsulinTypeSelector";
import { Column, Text } from "../ui/Box";
import { CustomDatePicker } from "../ui/CustomDatePicker";
import { MultilineTextInput } from "../ui/Input";

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
      <Column gap="xxl" padding="l">
        {/* Date & Time */}
        <CustomDatePicker
          value={insulinStore.draft.timestamp}
          onChange={(value) => insulinStore.setDraftSelectedTime(value)}
          mode="datetime"
          maximumDate={new Date()}
        />
        {/* Insulin Type */}
        <InsulinTypeSelector
          selectedType={insulinStore.draft.type}
          onTypeChange={(value) => insulinStore.setDraftType(value)}
        />
        {/* Insulin Units */}
        <InsulinDosageSelector
          value={
            insulinStore.draft.units === 0
              ? ""
              : insulinStore.draft.units.toString()
          }
          onValueChange={(value) => {
            const numericValue = InputUtils.parseNumber(value, true);
            insulinStore.setDraftUnits(isNaN(numericValue) ? 0 : numericValue);
          }}
        />

        {/* Injection Site */}
        <InjectionSiteSelector
          selectedSite={insulinStore.draft.injectionSite || ""}
          onSiteChange={(value) => insulinStore.setDraftSite(value)}
        />

        {/* Notes */}
        <Column gap="s">
          <Text variant="body">Notes (Optional)</Text>
          <MultilineTextInput
            value={insulinStore.draft.notes || ""}
            onChangeText={(value) => insulinStore.setDraftNotes(value)}
            placeholder="Add context about the injection"
          />
        </Column>

        {/* Footer Buttons */}
        <FormFooterButtons
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
