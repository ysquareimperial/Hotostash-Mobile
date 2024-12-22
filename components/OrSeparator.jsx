import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { grey1 } from "./colors";

const OrSeparator = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>OR</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop:20,
    marginBottom:20,
    justifyContent: "center",
    marginVertical: 10, // Adjust this to control spacing
  },
  line: {
    borderBottomWidth: 1,
    borderColor: grey1, // You can change this to the desired line color
    flex: 1, // Makes the line take available space
  },
  text: {
    marginHorizontal: 10, // Adds spacing between the text and lines
    fontSize: 14,
    color: "#cccccc", // You can change the color of the text as needed
  },
});

export default OrSeparator;
