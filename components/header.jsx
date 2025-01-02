import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import logo from "../assets/Hotostash PNG/77.png";
import { grey2 } from "./colors";
import { StatusBar } from "expo-status-bar";
import { Link, router } from "expo-router";

const Header = () => {
  return (
    <View style={styles.header} className='px-4'>
      {/* App Logo */}
      <Image
        source={logo} // Replace with your logo path
        style={styles.logo}
      />
      {/* Icons */}
      <View style={styles.icons}>
        <TouchableOpacity style={styles.icon}>
          <AntDesign name="bells" size={22} color="#fff" />
        </TouchableOpacity>
        {/* <Link>
        </Link> */}
        <TouchableOpacity
          style={styles.icon}
          onPress={() => router.push("/userSettings/settings")}
        >
          <AntDesign name="setting" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <StatusBar backgroundColor="#000000" style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: grey2,
    // padding: 10,
    paddingTop: 50, // Add some padding for the status bar on iOS
  },
  logo: {
    width: 110,
    height: 40,
    resizeMode: "contain",
  },
  icons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 15,
  },
});

export default Header;
