import React from "react";
import {
  FlatList,
  Modal,
} from "react-native";
import { Box, Text, TouchableBox } from "./Box";

type PickerOption = {
  label: string;
  value: string;
};

type PickerProps = {
  options: PickerOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: any;
};

export const Picker: React.FC<PickerProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = "Select an option",
  style,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  return (
    <>
      <TouchableBox
        borderWidth={1}
        borderColor="border"
        borderRadius="l"
        padding="m"
        backgroundColor="background"
        minHeight={44}
        justifyContent="center"
        style={style}
        onPress={() => setModalVisible(true)}
      >
        <Text
          variant="body"
          color={selectedOption ? "text" : "textLight"}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </TouchableBox>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Box
          flex={1}
          justifyContent="flex-end"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box
            backgroundColor="background"
            paddingTop="l"
            style={{
              maxHeight: "70%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal="l"
              paddingBottom="l"
              borderBottomWidth={1}
              borderBottomColor="border"
            >
              <Text variant="title" color="text">
                {placeholder}
              </Text>
              <TouchableBox onPress={() => setModalVisible(false)}>
                <Text variant="button" color="text">
                  Done
                </Text>
              </TouchableBox>
            </Box>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableBox
                  paddingVertical="m"
                  paddingHorizontal="l"
                  borderBottomWidth={1}
                  borderBottomColor="border"
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    variant="body"
                    color={selectedValue === item.value ? "text" : "textSecondary"}
                    style={{
                      fontFamily: selectedValue === item.value ? "Circular-Medium" : "Circular-Book",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableBox>
              )}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};