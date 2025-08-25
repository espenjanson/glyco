import { observer } from "mobx-react-lite";
import React, { ReactNode, useState } from "react";
import { Alert } from "react-native";
import { Box, Card, Column, Row, Text } from "../ui/Box";
import { Button } from "../ui/Button";
import { ValidationWarnings } from "./ValidationWarnings";

export interface EditableSectionProps {
  title: string;
  children: (isEditing: boolean) => ReactNode;
  onSave: () => void;
  onCancel?: () => void;
  validation?: () => string[] | null;
  warnings?: string[];
  isLoading?: boolean;
}

export const EditableSection: React.FC<EditableSectionProps> = observer(
  ({
    title,
    children,
    onSave,
    onCancel,
    validation,
    warnings = [],
    isLoading = false,
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleCancel = () => {
      setIsEditing(false);
      onCancel?.();
    };

    const handleSave = () => {
      // Run validation if provided
      if (validation) {
        const validationErrors = validation();
        if (validationErrors && validationErrors.length > 0) {
          Alert.alert("Validation Error", validationErrors.join("\n"), [
            { text: "OK" },
          ]);
          return;
        }
      }

      setSaving(true);

      onSave();
      setIsEditing(false);

      setSaving(false);
    };

    return (
      <Card variant="elevated" marginBottom="m">
        <Column gap="m">
          {/* Header with Edit/Save buttons */}
          <Row justifyContent="space-between" alignItems="center">
            <Text variant="title">{title}</Text>
            {!isEditing ? (
              <Button
                label="Edit"
                onPress={handleEdit}
                variant="outline"
                size="small"
                disabled={isLoading}
              />
            ) : (
              <Row gap="s">
                <Button
                  label="Cancel"
                  onPress={handleCancel}
                  variant="ghost"
                  size="small"
                  disabled={saving}
                />
                <Button
                  label="Save"
                  onPress={handleSave}
                  variant="primary"
                  size="small"
                  loading={saving}
                  disabled={saving}
                />
              </Row>
            )}
          </Row>

          {/* Validation warnings */}
          <ValidationWarnings warnings={warnings} />

          {/* Content */}
          <Box opacity={isEditing ? 1 : 0.7}>{children(isEditing)}</Box>
        </Column>
      </Card>
    );
  }
);

EditableSection.displayName = "EditableSection";
