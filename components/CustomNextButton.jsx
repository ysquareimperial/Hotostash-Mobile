import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";

const CustomNextButton = ({
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
      className="mt-5"
    >
      <Text style={[styles.buttonText, validTextStyles]}>
        {title === "loader" ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <MaterialIcons
            name={title === "final" ? `check` : `arrow-forward-ios`}
            size={24}
            style={{ margin: 0 }}
          />
        )}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff5600", // Replace with your secondary color
    borderRadius: 50,
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

export default CustomNextButton;
