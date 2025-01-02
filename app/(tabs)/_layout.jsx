import { View, Text } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";
import Header from "../../components/header";
import { grey1, grey2, grey3 } from "../../components/colors";

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

const TabsLayout = () => {
  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#ff5600",
          tabBarInactiveTintColor: "white",
          tabBarStyle: {
            backgroundColor: "black",
            borderTopWidth: 1,
            borderTopColor: grey2,
            // paddingBottom: 10,
            paddingTop: 10,
            height: 84,
          },
        }}
      >
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
                // name="Stashes"
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
                // name="Events"
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
                // name="Notifications"
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
                // name="Profile"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="viewStash"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
