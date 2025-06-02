import { View, Text } from "react-native";
import React from "react";
import { Slot, SplashScreen, Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="stashes"
        options={{
          title: "Stashes",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="viewStash"
        options={{
          title: "viewStash",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="viewEvent"
        options={{
          title: "viewEvent",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="withdrawalRequests"
        options={{
          title: "withdrawalRequests",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RequestStatus"
        options={{
          title: "RequestStatus",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default StackLayout;
