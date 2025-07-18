import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import "../global.css";
import { UserProvider } from "../context/UserContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Header from "../components/header";
import NetworkStatus from "../components/NetworkStatus";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/Poppins/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/Poppins/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/Poppins/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/Poppins/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/Poppins/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/Poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/Poppins/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;
  return (
    <GestureHandlerRootView>
      <UserProvider>
        {/* <Header /> */}
        {/* <NetworkStatus/> */}
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="events/viewEvent" options={{ presentation: "modal", headerShown:false }}/>
          <Stack.Screen
            name="userSettings/settings"
            options={{
              headerShown: false, // Show a header for this screen
              title: "Settings",
            }}
          />
          <Stack.Screen
            name="userSettings/changePassword"
            options={{
              headerShown: false, // Show a header for this screen
              title: "Change password",
            }}
          />
          <Stack.Screen
            name="/search/[query]"
            options={{ headerShown: false }}
          />
        </Stack>
      </UserProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
