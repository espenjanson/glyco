import React, { useState } from "react";
import { Modal } from "react-native";
import { Box, Text, TouchableBox } from "../ui/Box";

interface HelpTooltipProps {
  title: string;
  content: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ title, content }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableBox
        onPress={() => setModalVisible(true)}
        marginLeft="s"
        padding="xs"
      >
        <Text
          variant="bodySmall"
          color="textLight"
          style={{
            fontWeight: "bold",
            borderWidth: 1,
            borderColor: "#858585",
            borderRadius: 10,
            width: 20,
            height: 20,
            textAlign: "center",
            lineHeight: 18,
          }}
        >
          ?
        </Text>
      </TouchableBox>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Box
            backgroundColor="background"
            borderRadius="l"
            padding="l"
            style={{
              width: "80%",
              maxWidth: 300,
            }}
          >
            <Text
              variant="title"
              color="text"
              marginBottom="s"
            >
              {title}
            </Text>
            <Text
              variant="bodySmall"
              color="textLight"
              marginBottom="l"
              style={{
                lineHeight: 20,
              }}
            >
              {content}
            </Text>
            <TouchableBox
              onPress={() => setModalVisible(false)}
              backgroundColor="primary"
              borderRadius="m"
              padding="s"
              alignItems="center"
            >
              <Text variant="button" color="white">
                Understood
              </Text>
            </TouchableBox>
          </Box>
        </Box>
      </Modal>
    </>
  );
};