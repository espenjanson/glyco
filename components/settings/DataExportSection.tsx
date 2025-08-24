import React from "react";
import { Alert, Share } from "react-native";
import { Card, Text } from "../ui/Box";
import { Button } from "../ui/Button";
import { ExportService } from "../../utils/export";

export const DataExportSection: React.FC = () => {
  const handleExport = async () => {
    try {
      const fileUri = await ExportService.exportToCSV();
      await Share.share({
        url: fileUri,
        title: "Glyco Data Export",
      });
    } catch {
      Alert.alert("Error", "Failed to export data");
    }
  };

  return (
    <Card variant="outlined" marginBottom="l">
      <Text variant="title" marginBottom="m">
        Data Export
      </Text>
      <Text variant="body" color="textSecondary" marginBottom="m">
        Export your data for healthcare providers
      </Text>
      <Button
        label="Export to CSV"
        onPress={handleExport}
        variant="outline"
        fullWidth
      />
    </Card>
  );
};