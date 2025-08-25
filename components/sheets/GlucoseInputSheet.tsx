import { TrueSheet } from "@lodev09/react-native-true-sheet";
import React, { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { GlucoseReading } from "../../types";
import { GlucoseForm } from "../forms/GlucoseForm";
import { Column, ScrollBox } from "../ui/Box";
import { SheetHeader } from "./SheetHeader";

interface GlucoseInputSheetProps {
  isVisible: boolean;
  closeSheet: () => void;
  editingReading?: GlucoseReading | null;
}

export const GlucoseInputSheet: React.FC<GlucoseInputSheetProps> = ({
  isVisible,
  closeSheet,
  editingReading,
}) => {
  const sheetRef = useRef<TrueSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isVisible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [isVisible]);

  return (
    <TrueSheet
      ref={sheetRef}
      // @ts-ignore
      scrollRef={scrollViewRef}
      sizes={["auto"]}
      cornerRadius={24}
      onDismiss={closeSheet}
    >
      <Column>
        <ScrollBox ref={scrollViewRef} nestedScrollEnabled>
          {/* Header with close button */}
          <SheetHeader emoji="🩸" onClose={closeSheet} />

          <Column padding="l" gap="xxl">
            {/* Glucose Form - handles all logic */}
            <GlucoseForm
              editingReading={editingReading}
              closeSheet={closeSheet}
            />
          </Column>
        </ScrollBox>
      </Column>
    </TrueSheet>
  );
};

GlucoseInputSheet.displayName = "GlucoseInputSheet";
