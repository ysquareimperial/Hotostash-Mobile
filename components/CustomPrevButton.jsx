import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { grey1 } from "./colors";

const CustomPrevButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  // Ensure containerStyles and textStyles are either objects or empty objects
  const validContainerStyles =
    containerStyles && typeof containerStyles === "object"
      ? containerStyles
      : {};
  const validTextStyles =
    textStyles && typeof textStyles === "object" ? textStyles : {};

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.button,
        validContainerStyles,
        isLoading && styles.disabledButton,
      ]}
      disabled={isLoading}
      className="mt-5"
    >
      <Text style={[styles.buttonText, validTextStyles]}>
        <MaterialIcons name="arrow-back-ios" size={24} style={{ margin: 0 }} />
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black", // Replace with your secondary color
    borderRadius: 50,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: grey1,
    // minHeight: 62,
    width: 50,
    height: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
  },
});

export default CustomPrevButton;
