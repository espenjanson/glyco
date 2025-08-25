import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { useFoodStore } from "../../stores/StoreProvider";
import { FoodItemsStep } from "../food/FoodItemsStep";
import { FoodReviewStep } from "../food/FoodReviewStep";
import { Box, Column, Row, ScrollBox } from "../ui/Box";
import { Button } from "../ui/Button";
import { WizardLayout } from "../wizard/WizardLayout";
import { GlucoseInputSheet } from "./GlucoseInputSheet";
import { SheetHeader } from "./SheetHeader";

interface FoodInputSheetProps {
  isVisible: boolean;
  closeSheet: () => void;
}

type WizardStep = 0 | 1 | 2;

export const FoodInputSheet: React.FC<FoodInputSheetProps> = observer(
  ({ isVisible, closeSheet }) => {
    const sheetRef = useRef<TrueSheet>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const foodStore = useFoodStore();

    const [currentStep, setCurrentStep] = useState<WizardStep>(0);
    const [showGlucoseSheet, setShowGlucoseSheet] = useState(false);

    const resetForm = () => {
      setCurrentStep(0);
      foodStore.resetDraft();
    };

    useEffect(() => {
      if (isVisible) {
        resetForm();
        sheetRef.current?.present();
      } else {
        sheetRef.current?.dismiss();
      }
    }, [isVisible]);

    const handleNext = () => {
      if (currentStep === 0) {
        setCurrentStep(1);
      } else if (currentStep === 1 && foodStore.draft.foods.length > 0) {
        setCurrentStep(2);
      } else if (currentStep === 1) {
        Alert.alert("Error", "Please add at least one food item");
      }
    };

    const handleBack = () => {
      if (currentStep > 0) setCurrentStep((prev) => (prev - 1) as WizardStep);
    };

    const stepTitles = [
      "Step 1: Select Time",
      "Step 2: Add Foods",
      "Step 3: Calculate Insulin",
    ];

    const stepComponents = [
      <FoodItemsStep key={0} />,
      <FoodReviewStep
        key={1}
        closeSheet={closeSheet}
        onAddGlucoseReading={() => setShowGlucoseSheet(true)}
      />,
    ];

    const customFooter =
      currentStep === 2 ? (
        <Row gap="m">
          <Box flex={1}>
            <Button
              label="Back"
              onPress={handleBack}
              variant="secondary"
              size="medium"
              fullWidth
            />
          </Box>
        </Row>
      ) : undefined;

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
            <SheetHeader emoji="🍽️" onClose={closeSheet} />
            <WizardLayout
              currentStep={currentStep}
              onNext={handleNext}
              onBack={handleBack}
              nextDisabled={
                currentStep === 1 && foodStore.draft.foods.length === 0
              }
              showNext={currentStep < 2}
              showBack={currentStep > 0}
              customFooter={customFooter}
            >
              {stepComponents[currentStep]}
            </WizardLayout>
          </ScrollBox>
        </Column>

        {/* Glucose Input Sheet */}
        <GlucoseInputSheet
          isVisible={showGlucoseSheet}
          closeSheet={() => setShowGlucoseSheet(false)}
        />
      </TrueSheet>
    );
  }
);

FoodInputSheet.displayName = "FoodInputSheet";
