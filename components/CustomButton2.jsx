import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { grey1 } from "./colors";

const CustomButton2 = ({
  title,
  logo,
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
    //   className="mt-7"
    >
      <View style={styles.buttonContent}>
        <Image
          source={logo}
          style={{
            width: 20,
            height: 20,
            marginRight: 8,
            resizeMode: "contain",
          }}
        />
        <Text style={[styles.buttonText, validTextStyles]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black",
    borderRadius: 15,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: grey1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomButton2;
