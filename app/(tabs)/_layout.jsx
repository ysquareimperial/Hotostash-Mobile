import { View, Text, StyleSheet } from "react-native";
import { Stack, Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";
import Header from "../../components/header";
import { grey1, grey2, grey3 } from "../../components/colors";
import React, { useEffect, useState } from "react";
import BlurTabBar from "../../components/BlurTabBar";
import * as Network from "expo-network";

const TabIcon = ({ focused, icon, name, color }) => {
  return (
    <View
      style={{ alignItems: "center", justifyContent: "center", width: 100 }}
    >
      {icon}
      <Text
        numberOfLines={1} // Ensure text stays on a single line
        style={{
          color,
          fontWeight: focused ? "bold" : "normal",
          fontSize: 12,
          marginTop: 4, // Add space between icon and text
          textAlign: "center", // Ensure text is centered
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const NetworkStatus = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>You're offline</Text>
    </View>
  );
};

const TabsLayout = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkNetwork = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsOnline(networkState.isConnected && networkState.isInternetReachable);
    };

    checkNetwork();

    const interval = setInterval(checkNetwork, 3000); // Check every 3 secs
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#ffffff",
          tabBarInactiveTintColor: grey3,
          tabBarStyle: {
            backgroundColor: "#121212",
            borderTopWidth: 1,
            borderTopColor: grey2,
            // paddingBottom: 10,
            paddingTop: 10,
            height: isOnline ? 84 : 60,
          },
        }}
      >
        {/* <Tabs
        tabBar={(props) => <BlurTabBar {...props} />}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#ff5600",
          tabBarInactiveTintColor: "white",
          tabBarStyle: {
            backgroundColor: "transparent", // Important for blur
            borderTopWidth: 1,
            borderTopColor: grey2,
            paddingTop: 10,
            height: 84,
            position: "absolute",
            elevation: 0, // for Android
          },
        }}
      > */}
        <Tabs.Screen
          name="stashes"
          options={{
            title: "Stashes",
            // tabBarStyle:{display:'non'}
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={<AntDesign name="home" size={25} color={color} />}
                name="Stashes"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={<AntDesign name="hearto" size={25} color={color} />}
                name="Events"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifications",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={<AntDesign name="bells" size={25} color={color} />}
                name="Notifications"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={<AntDesign name="user" size={25} color={color} />}
                name="Profile"
              />
            ),
          }}
        />
      </Tabs>
      <NetworkStatus isOnline={isOnline} />
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: grey1,
    padding: 6,
    // position: "absolute",
    // top: 50,
    width: "100%",
    zIndex: 1000,
    height: 50,
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});

export default TabsLayout;
