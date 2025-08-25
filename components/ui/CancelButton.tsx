import React from "react";
import { Text } from "./Box";
import { TouchableBox } from "./TouchableBox";

interface CancelButtonProps {
  onCancel: () => void;
}

export const CancelButton: React.FC<CancelButtonProps> = ({ onCancel }) => {
  return (
    <TouchableBox
      onPress={onCancel}
      alignItems={"flex-end"}
      justifyContent={"flex-start"}
      paddingLeft="m"
      paddingBottom="s"
    >
      <Text variant="body" textAlign="right">
        ✕
      </Text>
    </TouchableBox>
  );
};
