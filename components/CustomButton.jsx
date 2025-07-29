import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const CustomButton = ({
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
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.button,
        validContainerStyles,
        isLoading && styles.disabledButton,
      ]}
      disabled={isLoading}
      className="mt-7"
    >
      <Text style={[styles.buttonText, validTextStyles]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff5600", // Replace with your secondary color
    borderRadius: 15,
    // minHeight: 62,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold", // Replace with your font name
    fontSize: 14,
  },
});

export default CustomButton;
