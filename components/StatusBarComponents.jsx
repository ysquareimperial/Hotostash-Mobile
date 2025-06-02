// StatusBarComponents.js

import React from "react";
import { View, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";

export const StatusBar = () => (
  <View style={styles.statusBar}>
    <View style={styles.statuses}>
      <View style={styles.first}>
        <View style={styles.iconGrey}>
          <AntDesign name="ellipsis1" size={24} color="#fff" />
        </View>
      </View>
      <View style={styles.second}>
        <View style={styles.iconDark}>
          <AntDesign name="check" size={24} color="#363636" />
        </View>
      </View>
      <View style={styles.last}>
        <View style={styles.iconDark}>
          <Octicons name="verified" size={24} color="#363636" />
        </View>
      </View>
    </View>
    <View style={styles.line} />
  </View>
);

export const StatusBar2 = () => (
  <View style={styles.statusBar}>
    <View style={styles.statuses}>
      <View style={styles.first}>
        <View style={styles.iconGrey}>
          <AntDesign name="ellipsis1" size={24} color="#fff" />
        </View>
      </View>
      <View style={styles.second}>
        <View style={styles.iconOrange}>
          <AntDesign name="check" size={24} color="#ff7700" />
        </View>
      </View>
      <View style={styles.last}>
        <View style={styles.iconDark}>
          <Octicons name="verified" size={24} color="#363636" />
        </View>
      </View>
    </View>
    <View style={styles.line} />
  </View>
);

export const StatusBar3 = () => (
  <View style={styles.statusBar}>
    <View style={styles.statuses}>
      <View style={styles.first}>
        <View style={styles.iconGrey}>
          <AntDesign name="ellipsis1" size={24} color="#fff" />
        </View>
      </View>
      <View style={styles.second}>
        <View style={styles.iconOrange}>
          <AntDesign name="check" size={24} color="#ff7700" />
        </View>
      </View>
      <View style={styles.last}>
        <View style={styles.iconGreen}>
          <Octicons name="verified" size={24} color="#009c60" />
        </View>
      </View>
    </View>
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  statusBar: {
    position: "relative",
    // paddingBottom: 30,
  },
  statuses: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingHorizontal: 20,
  },
  first: {
    zIndex: 10,
  },
  second: {
    zIndex: 10,
  },
  last: {
    zIndex: 10,
  },

  iconGrey: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#363636",
    justifyContent: "center",
    alignItems: "center",
  },
  iconOrange: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#363636",
    justifyContent: "center",
    alignItems: "center",
  },
  iconGreen: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#363636",
    justifyContent: "center",
    alignItems: "center",
  },
  iconDark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#1a1a1a",
    zIndex: 0, // Add this line
  },
});
