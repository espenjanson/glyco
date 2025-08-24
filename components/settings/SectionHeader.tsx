import React, { useState } from "react";
import { Row, Text } from "../ui/Box";
import { Button } from "../ui/Button";
import { ChangeHistoryModal } from "./ChangeHistoryModal";

interface SectionHeaderProps {
  title: string;
  section: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  section,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <Row justifyContent="space-between" alignItems="center">
        <Text variant="title">{title}</Text>
        <Button
          label="History"
          onPress={() => setShowHistory(true)}
          variant="outline"
          size="small"
        />
      </Row>
      
      <ChangeHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        section={section}
        sectionTitle={title}
      />
    </>
  );
};