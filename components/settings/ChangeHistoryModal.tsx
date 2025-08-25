import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Alert, Modal, ScrollView } from "react-native";
import { useSettingsStore } from "../../stores/StoreProvider";
import { SettingsHistoryEntry } from "../../types";
import { Box, Column, Row, Text } from "../ui/Box";
import { Button } from "../ui/Button";

interface ChangeHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  section: string;
  sectionTitle: string;
}

export const ChangeHistoryModal: React.FC<ChangeHistoryModalProps> = observer(
  ({ visible, onClose, section, sectionTitle }) => {
    const [history, setHistory] = useState<SettingsHistoryEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const settingsStore = useSettingsStore();

    const loadHistory = () => {
      setLoading(true);
      try {
        const allHistory = settingsStore.getSettingsHistory();
        const sectionHistory = allHistory.filter(
          (entry) => entry.section === section
        );
        setHistory(sectionHistory);
      } catch {
        Alert.alert("Error", "Failed to load change history");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (visible) {
        loadHistory();
      }
    }, [visible]);

    const handleRemoveEntry = (entryId: string) => {
      Alert.alert(
        "Remove Entry",
        "Are you sure you want to remove this change from history?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              settingsStore.removeSettingsHistoryEntry(entryId);
              loadHistory();
            },
          },
        ]
      );
    };

    const formatValue = (value: any): string => {
      if (value === null || value === undefined) return "None";
      if (typeof value === "boolean") return value ? "Yes" : "No";
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    };

    const formatTime = (date: Date): string => {
      return (
        date.toLocaleDateString() +
        " at " +
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <Box flex={1} backgroundColor="background" padding="l">
          <Column gap="l">
            <Row justifyContent="space-between" alignItems="center">
              <Text variant="title">{sectionTitle} History</Text>
              <Button
                label="Done"
                onPress={onClose}
                variant="outline"
                size="small"
              />
            </Row>

            {loading ? (
              <Box flex={1} justifyContent="center" alignItems="center">
                <Text>Loading...</Text>
              </Box>
            ) : history.length === 0 ? (
              <Box flex={1} justifyContent="center" alignItems="center">
                <Text color="textSecondary">No changes recorded yet</Text>
              </Box>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Column gap="s">
                  {history.map((entry) => (
                    <Box
                      key={entry.id}
                      backgroundColor="cardBackground"
                      padding="m"
                      borderRadius="m"
                    >
                      <Column gap="xs">
                        <Row
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Column flex={1}>
                            <Text variant="body" fontWeight="medium">
                              {entry.field}
                            </Text>
                            <Text variant="caption" color="textSecondary">
                              {formatTime(entry.timestamp)}
                            </Text>
                          </Column>
                          <Button
                            label="Remove"
                            onPress={() => handleRemoveEntry(entry.id)}
                            variant="outline"
                            size="small"
                          />
                        </Row>

                        <Column gap="xs">
                          <Row alignItems="center" gap="xs">
                            <Text variant="caption" color="textSecondary">
                              From:
                            </Text>
                            <Text variant="caption">
                              {formatValue(entry.oldValue)}
                            </Text>
                          </Row>

                          <Row alignItems="center" gap="xs">
                            <Text variant="caption" color="textSecondary">
                              To:
                            </Text>
                            <Text variant="caption" fontWeight="medium">
                              {formatValue(entry.newValue)}
                            </Text>
                          </Row>
                        </Column>
                      </Column>
                    </Box>
                  ))}
                </Column>
              </ScrollView>
            )}
          </Column>
        </Box>
      </Modal>
    );
  }
);
