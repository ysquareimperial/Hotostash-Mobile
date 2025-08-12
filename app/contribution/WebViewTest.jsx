// WebViewTest.js
import React, { useState } from "react";
import { View, Button } from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewTest() {
  const [showWebView, setShowWebView] = useState(false);

  if (showWebView) {
    return (
      <WebView
        source={{ uri: "https://example.com" }}
        onNavigationStateChange={(event) => {
          console.log("Navigating:", event.url);
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Open Embedded WebView" onPress={() => setShowWebView(true)} />
    </View>
  );
}
