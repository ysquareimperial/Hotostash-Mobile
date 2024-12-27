import {
  View,
  Text,
  ScrollView,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/Hotostash PNG/77.png";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { grey1, grey2, grey3, orange } from "../../components/colors";
import google from "../../assets/google.png";
import CustomButton2 from "../../components/CustomButton2";
import OrSeparator from "../../components/OrSeparator";
import { api } from "../../helpers/helpers";
import axios from "axios";
import CustomModal from "../../components/CustomModal";

const ForgotPassword = () => {
  const [form, setForm] = useState({ email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    axios
      .post(`${api}password_reset`, {
        email: form.email,
      })
      .then((response) => {
        setLoading(false);
        console.log(response);

        if (response.status === 200) {
          //   console.log("rrrrrrrrr");
          //   alert("A confirmation link has been sent to your email address.");
          setModalVisible(true);
          //   setModalVisible(true)
        }
      })
      .catch((e) => {
        setLoading(false);
        const errorMessage =
          e.response?.data?.detail || "An unknown error occurred";
        console.log(errorMessage);
        // console.log(e.response);
        setError(e.response.data.detail);
        setModalVisible2(true);
        // alert(errorMessage);
      });
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#000000" }} className="h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // style={styles.container}
      >
        <ScrollView>
          <View className="w-full justify-center min-h-[85vh] px-4 my-6">
            <View className="items-center">
              <Image
                source={logo}
                className="w-[130px] h-[84px]"
                resizeMode="contain"
              />
              <Text
                style={{
                  color: "white",
                  fontSize: 24,
                  marginBottom: 8,
                  fontWeight: "900",
                }}
              >
                Password reset
              </Text>
            </View>

            <Text style={{ color: "white", marginTop: 10 }}>
              Please provide the email linked to your account in order to reset
              your password.
            </Text>
            <FormField
              placeholder={"Email"}
              title="Email"
              value={form.email}
              handleChangeText={(text) => {
                setForm({ ...form, email: text.trim() }); // Directly use 'text' instead of e.target.value
              }}
              otherStyles="mt-3"
              keyboardType="email-address"
            />
            {form.email === "" ||
            form.email === " " ||
            !/\S+@\S+\.\S+/.test(form.email) ? null : (
              <CustomButton
                title={
                  loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    "Send reset link"
                  )
                }
                handlePress={handleSubmit}
                isLoading={loading}
              />
            )}
            <View
              style={{
                marginTop: 30,
                display: "flex",
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Text style={{ color: "white" }}>Go back to</Text>

              <Link href="/login" style={{ color: orange, fontWeight: "bold" }}>
                Log in
              </Link>
              <CustomModal
                modalTitle={"Link sent"}
                modalText={`A reset link has been sent to ${form.email}. Kindly check your inbox or spam folder.`}
                okText={"OK"}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(false);
                }}
                handleOkPress={() => {
                  setForm({ email: "" });
                  setModalVisible(!modalVisible);
                }}
                loading={loading}
                modalVisible={modalVisible} // Pass modalVisible as a prop
                setModalVisible={setModalVisible} // Pass the setter function to update the state
              />
              <CustomModal
                modalTitle={"Error"}
                modalText={error}
                okText={"OK"}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(false);
                }}
                loading={loading}
                modalVisible={modalVisible2} // Pass modalVisible as a prop
                setModalVisible={setModalVisible2} // Pass the setter function to update the state
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
