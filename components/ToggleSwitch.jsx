import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

export default function ToggleSwitch() {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.label}>Enable Contribution</Text> */}
      <Switch
        trackColor={{ false: "#ccc", true: "#ff5600" }}
        thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
        ios_backgroundColor="#ccc"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // padding: 5,
  },
  label: {
    // fontSize: 16,
    // fontWeight: "bold",
  },
});
