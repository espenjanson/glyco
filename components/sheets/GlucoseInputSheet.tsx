import { TrueSheet } from "@lodev09/react-native-true-sheet";
import React, { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { GlucoseReading } from "../../types";
import { GlucoseForm } from "../forms/GlucoseForm";
import { Column, ScrollBox, Text } from "../ui/Box";

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
      <ScrollBox ref={scrollViewRef} nestedScrollEnabled>
        <Column padding="l" gap="l">
          {/* Header */}
          <Text variant="title" textAlign="center">
            {editingReading ? "Edit Glucose Reading" : "Log Glucose Reading"}
          </Text>

          {/* Glucose Form - handles all logic */}
          <GlucoseForm
            editingReading={editingReading}
            closeSheet={closeSheet}
          />
        </Column>
      </ScrollBox>
    </TrueSheet>
  );
};

GlucoseInputSheet.displayName = "GlucoseInputSheet";
