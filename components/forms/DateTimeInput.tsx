import { observer } from "mobx-react-lite";
import React from "react";
import { useGlucoseStore } from "../../stores/StoreProvider";
import { CustomDatePicker } from "../ui/CustomDatePicker";

export const DateTimeInput: React.FC = observer(() => {
  const glucoseStore = useGlucoseStore();

  return (
    <CustomDatePicker
      label="Date & Time"
      value={glucoseStore.draftSelectedTime}
      onChange={glucoseStore.setDraftSelectedTime}
      mode="datetime"
      maximumDate={new Date()}
    />
  );
});

DateTimeInput.displayName = "DateTimeInput";
