import React from "react";
import { View, Button } from "react-native";
import { WebView } from "react-native-webview";

export default function PaystackWeb() {
  const [showWebView, setShowWebView] = React.useState(false);

  const paystackHTML = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: white;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      </style>
      <script src="https://js.paystack.co/v1/inline.js"></script>
    </head>
    <body>
      <script>
        var handler = PaystackPop.setup({
          key: 'pk_test_ac95b08abbda866c61e311476591cec34beaa2ed',
          email: 'waleyinka55@gmail.com',
          amount: 100 * 100,
          currency: 'NGN',
          callback: function(response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'success', transaction: response }));
          },
          onClose: function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'cancelled' }));
          }
        });
        handler.openIframe();
      </script>
    </body>
  </html>
`;


  if (showWebView) {
    return (
      <WebView
        style={{ flex: 1, }} // ✅ makes it full screen
        originWhitelist={["*"]}
        source={{ html: paystackHTML }}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.event === "success") {
            console.log("Payment Successful:", data.transaction);
          } else {
            console.log("Payment Cancelled");
          }
          setShowWebView(false); // Close after payment
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Pay Now" onPress={() => setShowWebView(true)} />
    </View>
  );
}
