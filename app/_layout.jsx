import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import "../global.css";
// import { PaystackProvider } from "react-native-paystack-webview";
import { UserProvider } from "../context/UserContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
        {/* <PaystackProvider publicKey="pk_test_ac95b08abbda866c61e311476591cec34beaa2ed"> */}
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
          <Stack.Screen
            name="events/viewEvent"
            options={{
              // presentation: "modal",
              headerShown: false,
              title: "Event",
            }}
          />
          {/* <Stack.Screen
            name="events/joinEvent"
            options={{ presentation: "modal", headerShown: false }}
          /> */}
          <Stack.Screen
            name="contribution/contribute"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="contribution/paystackWebview"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="contribution/withdrawalRequests"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="contribution/RequestStatus"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="invite/event"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="invite"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen name="public" options={{ headerShown: false }} />
          {/* <Stack.Screen
            name="public"
            options={{ presentation: "modal", headerShown: false }}
          /> */}
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
        {/* </PaystackProvider> */}
      </UserProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
