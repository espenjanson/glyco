import { TrueSheet } from "@lodev09/react-native-true-sheet";
import React, { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { InsulinShot } from "../../types";
import { InsulinForm } from "../forms/InsulinForm";
import { Column, ScrollBox, Text } from "../ui/Box";

interface InsulinInputSheetProps {
  isVisible: boolean;
  closeSheet: () => void;
  onSave?: (shot: InsulinShot) => void;
}

export const InsulinInputSheet: React.FC<InsulinInputSheetProps> = ({
  isVisible,
  closeSheet,
  onSave,
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
            Log Insulin Shot
          </Text>

          {/* Insulin Form - handles all logic */}
          <InsulinForm closeSheet={closeSheet} />
        </Column>
      </ScrollBox>
    </TrueSheet>
  );
};

InsulinInputSheet.displayName = "InsulinInputSheet";
