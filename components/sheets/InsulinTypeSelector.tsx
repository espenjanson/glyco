import React from "react";
import { Row, Text, TouchableBox } from "../ui/Box";

interface InsulinTypeSelectorProps {
  selectedType: "rapid" | "long-acting" | "intermediate";
  onTypeChange: (type: "rapid" | "long-acting" | "intermediate") => void;
}

const insulinTypes = [
  { value: 'rapid', label: 'Rapid', desc: 'Humalog, Novolog' },
  { value: 'long-acting', label: 'Long', desc: 'Lantus, Levemir' },
  { value: 'intermediate', label: 'NPH', desc: 'Humulin N' },
];

export const InsulinTypeSelector: React.FC<InsulinTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
}) => {
  return (
    <Row gap="s">
      {insulinTypes.map((option) => (
        <TouchableBox
          key={option.value}
          flex={1}
          onPress={() => onTypeChange(option.value as "rapid" | "long-acting" | "intermediate")}
          backgroundColor={selectedType === option.value ? "primary" : "background"}
          borderWidth={1}
          borderColor={selectedType === option.value ? "primary" : "border"}
          borderRadius="m"
          padding="s"
          alignItems="center"
        >
          <Text 
            variant="bodySmall" 
            color={selectedType === option.value ? "white" : "text"}
            fontWeight={selectedType === option.value ? "bold" : "normal"}
            textAlign="center"
          >
            {option.label}
          </Text>
          <Text 
            variant="caption" 
            color={selectedType === option.value ? "white" : "textLight"}
            textAlign="center"
            numberOfLines={1}
          >
            {option.desc}
          </Text>
        </TouchableBox>
      ))}
    </Row>
  );
};