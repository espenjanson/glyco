import React, { useState } from "react";
import { GlucoseReadingCard } from "../../components/home/GlucoseReadingCard";
import { QuickActionsSection } from "../../components/home/QuickActionsSection";
import { FoodInputSheet } from "../../components/sheets/FoodInputSheet";
import { GlucoseInputSheet } from "../../components/sheets/GlucoseInputSheet";
import { InsulinInputSheet } from "../../components/sheets/InsulinInputSheet";
import {
  Box,
  Column,
  Container,
  SafeBox,
  ScrollBox,
  Text,
} from "../../components/ui/Box";
import { ActiveSheet, QuickAction } from "../../types/enums";

const HomeTab = () => {
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(ActiveSheet.NONE);

  const handleQuickAction = (action: QuickAction) => {
    switch (action) {
      case QuickAction.GLUCOSE:
        setActiveSheet(ActiveSheet.GLUCOSE);
        break;
      case QuickAction.INSULIN:
        setActiveSheet(ActiveSheet.INSULIN);
        break;
      case QuickAction.FOOD:
        setActiveSheet(ActiveSheet.FOOD);
        break;
      case QuickAction.EXERCISE:
        // TODO: Implement exercise tracking
        break;
    }
  };

  return (
    <SafeBox>
      <Container>
        <ScrollBox showsVerticalScrollIndicator={false}>
          <Column gap="m" paddingTop="xl" paddingBottom="l">
            <Box>
              <Text variant="caption" textAlign="center" color="primary">
                Glyco
              </Text>
            </Box>

            <GlucoseReadingCard />

            <QuickActionsSection onActionPress={handleQuickAction} />
          </Column>
        </ScrollBox>
      </Container>

      <GlucoseInputSheet
        isVisible={activeSheet === ActiveSheet.GLUCOSE}
        closeSheet={() => setActiveSheet(ActiveSheet.NONE)}
      />

      <InsulinInputSheet
        isVisible={activeSheet === ActiveSheet.INSULIN}
        closeSheet={() => setActiveSheet(ActiveSheet.NONE)}
      />

      <FoodInputSheet
        isVisible={activeSheet === ActiveSheet.FOOD}
        closeSheet={() => setActiveSheet(ActiveSheet.NONE)}
      />
    </SafeBox>
  );
};

HomeTab.displayName = "HomeTab";

export default HomeTab;
