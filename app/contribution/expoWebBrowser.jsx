// ExpoWebBrowserTest.js
import React from "react";
import { View, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";

export default function ExpoWebBrowserTest() {
  const openBrowser = async () => {
    let result = await WebBrowser.openBrowserAsync("https://example.com");
    console.log("Browser closed with:", result);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Open in In-App Browser" onPress={openBrowser} />
    </View>
  );
}
