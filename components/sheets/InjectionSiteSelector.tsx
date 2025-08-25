import React from "react";
import { Column, Row, Text, TouchableBox } from "../ui/Box";

interface InjectionSiteSelectorProps {
  selectedSite: string;
  onSiteChange: (site: string) => void;
}

const injectionSites = [
  'Abdomen', 
  'Thigh', 
  'Upper Arm', 
  'Buttocks'
];

export const InjectionSiteSelector: React.FC<InjectionSiteSelectorProps> = ({
  selectedSite,
  onSiteChange,
}) => {
  return (
    <Column gap="s">
      <Text variant="body">Injection Site (Optional)</Text>
      <Row flexWrap="wrap" gap="s">
        {injectionSites.map((siteName) => (
          <TouchableBox
            key={siteName}
            onPress={() => onSiteChange(selectedSite === siteName ? '' : siteName)}
            backgroundColor={selectedSite === siteName ? "primary" : "background"}
            borderWidth={1}
            borderColor={selectedSite === siteName ? "primary" : "border"}
            borderRadius="m"
            paddingHorizontal="m"
            paddingVertical="s"
          >
            <Text 
              variant="bodySmall" 
              color={selectedSite === siteName ? "white" : "text"}
            >
              {siteName}
            </Text>
          </TouchableBox>
        ))}
      </Row>
    </Column>
  );
};