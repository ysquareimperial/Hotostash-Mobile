import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="resendMail" options={{ headerShown: false }} />
        <Stack.Screen
          name="registrationMessage"
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="settings" options={{ headerShown: false }} /> */}
      </Stack>
      <StatusBar backgroundColor="#000000" style="light" />
    </>
  );
};

export default AuthLayout;
