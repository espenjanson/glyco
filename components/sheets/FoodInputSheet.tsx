import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { useTimePicker } from "../../hooks/useTimePicker";
import { useFoodStore, useSettingsStore } from "../../stores/StoreProvider";
import { FoodEntry, FoodItem } from "../../types";
import { FoodUtils } from "../../utils/food";
import { GlucoseConverter } from "../../utils/glucose";
import { FoodItemsStep } from "../food/FoodItemsStep";
import { FoodReviewStep } from "../food/FoodReviewStep";
import { FoodTimeStep } from "../food/FoodTimeStep";
import { Box, Row, ScrollBox } from "../ui/Box";
import { Button } from "../ui/Button";
import { WizardLayout } from "../wizard/WizardLayout";
import { GlucoseInputSheet } from "./GlucoseInputSheet";

interface FoodInputSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSave?: (entry: FoodEntry) => void;
}

type WizardStep = 0 | 1 | 2;

export const FoodInputSheet: React.FC<FoodInputSheetProps> = observer(
  ({ isVisible, onClose, onSave }) => {
    const sheetRef = useRef<TrueSheet>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const foodStore = useFoodStore();
    const settingsStore = useSettingsStore();

    const [currentStep, setCurrentStep] = useState<WizardStep>(0);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);
    const [insulinCalculation, setInsulinCalculation] = useState<any>(null);
    const [currentGlucose, setCurrentGlucose] = useState("");
    const [showGlucoseSheet, setShowGlucoseSheet] = useState(false);

    const userGlucoseUnit = settingsStore.glucoseUnit;

    const {
      selectedTime,
      setSelectedTime,
      showTimePicker,
      setShowTimePicker,
      handleTimeChange,
      handleTimePickerChange,
    } = useTimePicker(new Date());

    const resetForm = () => {
      setCurrentStep(0);
      setFoods([]);
      setNotes("");
      setSelectedTime(new Date());
      setCurrentGlucose("");
      setInsulinCalculation(null);
    };

    useEffect(() => {
      if (isVisible) {
        resetForm();
        sheetRef.current?.present();
      } else {
        sheetRef.current?.dismiss();
      }
    }, [isVisible]);

    const calculateTotalCarbs = () => {
      return foods.reduce((sum, food) => sum + food.totalCarbs, 0);
    };

    const handleNext = () => {
      if (currentStep === 0) {
        setCurrentStep(1);
      } else if (currentStep === 1 && foods.length > 0) {
        setCurrentStep(2);
      } else if (currentStep === 1) {
        Alert.alert("Error", "Please add at least one food item");
      }
    };

    const handleBack = () => {
      if (currentStep > 0) setCurrentStep((prev) => (prev - 1) as WizardStep);
    };

    const handleSave = () => {
      setSaving(true);
      try {
        const totalCarbs = calculateTotalCarbs();
        const mealType = FoodUtils.getMealTypeByTime(selectedTime);

        const entry: FoodEntry = {
          id: Date.now().toString(),
          foods,
          totalCarbs,
          mealType,
          timestamp: selectedTime,
          notes: notes.trim() || undefined,
        };

        if (insulinCalculation && currentGlucose) {
          const glucose = parseFloat(currentGlucose);
          const glucoseInMmol = GlucoseConverter.inputToStorage(
            glucose,
            userGlucoseUnit
          );
          entry.insulinCalculation = {
            ...insulinCalculation,
            currentGlucose: glucoseInMmol,
          };
        }

        foodStore.addEntry(entry);
        onSave?.(entry);

        Alert.alert("Success", "Food entry saved successfully!");
        onClose();
      } catch {
        Alert.alert("Error", "Failed to save food entry.");
      } finally {
        setSaving(false);
      }
    };

    const stepTitles = [
      "Step 1: Select Time",
      "Step 2: Add Foods",
      "Step 3: Calculate Insulin",
    ];

    const stepComponents = [
      <FoodTimeStep
        key={0}
        selectedTime={selectedTime}
        showTimePicker={showTimePicker}
        onTimeChange={handleTimeChange}
        onShowTimePicker={() => setShowTimePicker(true)}
        onTimePickerChange={handleTimePickerChange}
        onCloseTimePicker={() => setShowTimePicker(false)}
      />,
      <FoodItemsStep
        key={1}
        foods={foods}
        onAddFood={(food) => setFoods((prev) => [...prev, food])}
        onRemoveFood={(id) =>
          setFoods((prev) => prev.filter((f) => f.id !== id))
        }
      />,
      <FoodReviewStep
        key={2}
        selectedTime={selectedTime}
        foods={foods}
        totalCarbs={calculateTotalCarbs()}
        notes={notes}
        glucoseUnit={userGlucoseUnit}
        onNotesChange={setNotes}
        onInsulinCalculation={(calc, glucose) => {
          setInsulinCalculation(calc);
          setCurrentGlucose(glucose);
        }}
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
          <Box flex={1}>
            <Button
              label="Save Entry"
              onPress={handleSave}
              variant="primary"
              size="medium"
              loading={saving}
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
        onDismiss={onClose}
      >
        <ScrollBox ref={scrollViewRef} nestedScrollEnabled>
          <WizardLayout
            title="Log Food Entry"
            currentStep={currentStep}
            totalSteps={3}
            stepTitle={stepTitles[currentStep]}
            onNext={handleNext}
            onBack={handleBack}
            onCancel={onClose}
            nextDisabled={currentStep === 1 && foods.length === 0}
            showNext={currentStep < 2}
            showBack={currentStep > 0}
            showCancel={currentStep === 0}
            customFooter={customFooter}
          >
            {stepComponents[currentStep]}
          </WizardLayout>
        </ScrollBox>

        {/* Glucose Input Sheet */}
        <GlucoseInputSheet
          isVisible={showGlucoseSheet}
          onClose={() => setShowGlucoseSheet(false)}
          onSave={() => {
            setShowGlucoseSheet(false);
            // Force FoodReviewStep to reload by triggering a re-render
            setCurrentStep(2);
          }}
        />
      </TrueSheet>
    );
  }
);

FoodInputSheet.displayName = "FoodInputSheet";
