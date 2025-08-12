import {
  View,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  TextInput,
  Switch,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../helpers/helpers";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import SkeletonForParticipants from "../../components/SkeletonForParticipants";
import { grey1, grey2, grey3, orange } from "../../components/colors";
import { useUser } from "../../context/UserContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, router, useLocalSearchParams } from "expo-router";
import defaultProfile from "../../assets/profile.png";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import CustomButton2 from "../../components/CustomButton2";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import CustomModal from "../../components/CustomModal";

const Contribute = () => {
  const { user } = useUser();
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const { eventName, eventId, contributionId, participantId } =
    useLocalSearchParams();
  const [showWebView, setShowWebView] = React.useState(false);
  const [enableAnonymity, setEnableAnonymity] = useState(false);

  console.log(
    "with contribution id",
    eventName,
    eventId,
    contributionId,
    participantId
  );

  const [formData, setFormData] = useState({
    contribution_id: "",
    amount: "",
    account_name: "",
    account_number: "",
    bank_name: "",
  });

  // Handle input changes
  const handleChangeAmount = (text) => {
    setFormData((prev) => ({ ...prev, amount: text }));
  };

  // Fetch AuthToken
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          console.log("Token retrieved:", token);
          setAuthToken(token);
        } else {
          console.error("Token not found.");
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };

    console.log(eventId);

    fetchToken();
  }, []);

  //paystack price calculation
  let paystackTotalPriceInKobo = formData?.amount * 100;
  paystackTotalPriceInKobo += paystackTotalPriceInKobo * 0.025;
  if (paystackTotalPriceInKobo >= 250000) {
    paystackTotalPriceInKobo += 10000;
  }

  console.log(paystackTotalPriceInKobo);

  //generating transaction reference
  const generateTransactionRef = () => {
    const prefix = "HTSH";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randomPart = Array.from({ length: 12 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
    return `${prefix}${randomPart}`;
  };

  //post paystack transaction to db
  const paymentAPIPaystack = `${api}payment/?participant_id=${Number(
    participantId
  )}&contribution_id=${Number(contributionId)}&provider=paystack`;
  const postPaystackTransactionToDB = (transaction_id, reference_id) => {
    setLoading2(true);
    setModalVisible(true);
    axios
      .post(
        paymentAPIPaystack,
        {
          transaction_id: transaction_id,
          reference_id: reference_id,
          amount: Number(formData?.amount),
          anonymity: enableAnonymity,
          payment_datetime: new Date().toISOString(),

          // description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        // if (response?.status === 201 && response?.data?.status === "success") {
        //   handleModal();
        // } else {
        //   handleModal3();
        // }
        setModalVisible(true);
        setLoading2(false);
        // router.back();
        console.log("posted to db successfully", response);
      })
      .catch((err) => {
        setModalVisible(true);
        setLoading2(false);
        console.log("error fetching data", err.response?.data || err.message);
      });
  };
  const publicKeyTestPaystack =
    "pk_test_ac95b08abbda866c61e311476591cec34beaa2ed";
  //   paystack payment
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
          email: '${user?.email}',
          amount: ${paystackTotalPriceInKobo},
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
        style={{ flex: 1 }} // ✅ makes it full screen
        originWhitelist={["*"]}
        source={{ html: paystackHTML }}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.event === "success") {
            console.log("Payment Successful:", data.transaction);
            postPaystackTransactionToDB(
              data.transaction?.trxref,
              data.transaction?.trxref
            );
          } else {
            console.log("Payment Cancelled");
          }
          setShowWebView(false); // Close after payment
        }}
      />
    );
  }

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ backgroundColor: grey2, flex: 1 }}
      className="h-full"
    >
      <View
        className="px-4"
        style={{
          marginTop: 16,
          marginBottom: 5,
          height: "100%",
        }}
      >
        {loading2 || modalVisible ? (
          <CustomModal
            modalTitle={loading2 ? "Processing Payment" : "Payment Successful"}
            modalText={
              loading2
                ? "Processing payment..."
                : `A contribution of ₦${formData?.amount} was successfully made to "${eventName}"`
            }
            okText={
              loading2 ? <ActivityIndicator size="small" color="white" /> : "Ok"
            }
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(false);
            }}
            loading={loading2}
            handleOkPress={
              loading2
                ? null // disable press when loading
                : () => {
                    setModalVisible(false);
                    router.back();
                    // router.back(); // if you want to auto-close modal page
                  }
            }
            handleCancelPress={() => setModalVisible(false)}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        ) : (
          <View>
            <View>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Write the amount you wish to pay to "{eventName}"
              </Text>
              <Text style={{ color: "grey", marginTop: 5 }}>
                Minimum amount is ₦500
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                marginBottom: 5,
                height: "100%",
              }}
            >
              {/* <PaystackWebview /> */}
              <View
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderColor: grey1,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text style={{ fontWeight: "bold", color: grey3 }}>Amount</Text>
                <TextInput
                  keyboardType="number-pad"
                  style={{
                    backgroundColor: "transparent",
                    width: "80%",
                    padding: 14,
                    borderRadius: 5,
                    color: "white",
                  }}
                  onSubmitEditing={Keyboard.dismiss}
                  maxLength={45}
                  value={formData.amount}
                  onChangeText={handleChangeAmount}
                />
              </View>

              {errors.amount && (
                <Text style={{ color: "#DC3545", fontSize: 12 }}>
                  {errors.amount}
                </Text>
              )}

              {/* <ExpoWebBrowserTest /> */}
              {/* <WebViewTest />
          <PaystackCheckout/> */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Enable anonymity
                </Text>
                <Text style={{ color: "grey", marginTop: 5 }}>
                  Enabling this hides your name and contribution from
                  participants, but organizers can see it.
                </Text>
                <Switch
                  trackColor={{ false: "#ccc", true: "#ff5600" }}
                  thumbColor={"#fff"}
                  ios_backgroundColor="#ccc"
                  style={{ marginTop: 10 }}
                  onValueChange={setEnableAnonymity}
                  value={enableAnonymity}
                />

                <View style={{ flexDirection: "row" }}>
                  <CustomButton
                    title={"Contribute now"}
                    isLoading={loading || formData.amount < 500}
                    handlePress={() => {
                      setShowWebView(true);
                      generateTransactionRef();
                      console.log("anonymity", enableAnonymity);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Contribute;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff5600",
    borderRadius: 15,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28, // matches mt-7
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
  },
});
