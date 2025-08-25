import { observer } from "mobx-react-lite";
import React from "react";
import { useSettingsStore } from "../../stores/StoreProvider";
import { Column, Row, Text } from "../ui/Box";
import { Input } from "../ui/Input";
import { Switch } from "../ui/Switch";

export const RemindersSection: React.FC = observer(() => {
  const settingsStore = useSettingsStore();

  const remindersEnabled = settingsStore.remindersEnabled;
  const reminderTimes = settingsStore.reminderTimes;

  const handleRemindersToggle = (enabled: boolean) => {
    settingsStore.updateUserSetting("remindersEnabled", enabled);
  };

  const handleReminderTimeChange = (index: number, newTime: string) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = newTime;
    settingsStore.updateUserSetting("reminderTimes", newTimes);
  };

  return (
    <Column gap="m">
      <Row justifyContent="space-between" alignItems="center">
        <Text variant="body">Enable Reminders</Text>
        <Switch
          value={remindersEnabled}
          onValueChange={handleRemindersToggle}
        />
      </Row>

      {remindersEnabled && (
        <Column gap="s">
          <Text variant="body">Reminder Times</Text>
          <Text variant="caption" color="textLight">
            Set times for glucose testing reminders
          </Text>
          <Column gap="s">
            {reminderTimes.map((time, index) => (
              <Input
                key={index}
                value={time}
                onChangeText={(newTime) =>
                  handleReminderTimeChange(index, newTime)
                }
                placeholder="HH:MM"
              />
            ))}
          </Column>
        </Column>
      )}
    </Column>
  );
});
