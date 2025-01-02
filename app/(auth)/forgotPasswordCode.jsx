import {
    View,
    Text,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import logo from "../../assets/Hotostash PNG/77.png";
  import FormField from "../../components/FormField";
  import CustomButton from "../../components/CustomButton";
  import { StatusBar } from "expo-status-bar";
  import { Link, router } from "expo-router";
  import { orange } from "../../components/colors";
  import google from "../../assets/google.png";
  import CustomButton2 from "../../components/CustomButton2";
  import OrSeparator from "../../components/OrSeparator";
  import CustomButton3 from "../../components/CustomButton3";
  import { useLocalSearchParams } from "expo-router";
  import CustomModal from "../../components/CustomModal";
  import axios from "axios";
  import { api } from "../../helpers/helpers";
  
  const registrationMessage = () => {
    const { email } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ code: "", email: email });
    const isButtonDisabled = !form?.code;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [error, setError] = useState("");
  
    useEffect(() => {
      console.log(email + "xxxxxxxxxxxxxxxxxxxxxx"); // Check what value is being logged
    }, []);
  
    const verifyAccount = async () => {
      console.log(form);
      setLoading(true);
      try {
        const response = await axios.post(`${api}mobile/verify-email/`, form);
        setLoading(false);
        if (response.status === 200) {
          console.log(response?.data);
          setModalVisible(true);
        } else {
          setError(response?.data?.detail || "Error. Please try again.");
        }
      } catch (e) {
        setLoading(false);
        const errorMessage =
          e.response?.data?.detail || "An unknown error occurred";
        console.error(errorMessage);
        setError(errorMessage);
        setModalVisible2(true);
      }
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
              </View>
  
              <Text
                style={{
                  color: "white",
                  fontSize: 24,
                  marginBottom: 8,
                  fontWeight: "900",
                  textAlign: "center",
                }}
              >
                Verify your account
              </Text>
  
              <Text style={{ color: "white", textAlign: "", marginTop: 10 }}>
                Check your email{" "}
                <Text style={{ fontWeight: "bold", color: orange }}>
                  inbox or spam
                </Text>{" "}
                for the confirmation code. Valid for 10 minutes.
              </Text>
  
              <FormField
                placeholder={"Enter verification code"}
                title="Code"
                value={form.code}
                handleChangeText={(text) =>
                  setForm({ ...form, code: text.trim() })
                }
                otherStyles="mt-3"
                keyboardType="numeric"
                maxLength={6}
              />
              <CustomButton
                title={
                  loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    "Continue"
                  )
                }
                handlePress={verifyAccount}
                isLoading={loading || isButtonDisabled}
              />
              <View
                style={{
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <Link
                  // href="/register"
                  href="/resendMail"
                  style={{ color: orange, fontWeight: "bold" }}
                >
                  Send code again
                </Link>
              </View>
            </View>
  
            <CustomModal
              modalTitle="Account verified"
              modalText="Your account has been successfully verified."
              okText={"Log in"}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(false);
              }}
              loading={loading}
              modalVisible={modalVisible} // Pass modalVisible as a prop
              setModalVisible={setModalVisible} // Pass the setter function to update the state
              handleOkPress={() => {
                router.push("/login");
                setModalVisible(false);
              }}
            />
            <CustomModal
              modalTitle={"Error"}
              modalText={error}
              okText={"OK"}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible2(false);
              }}
              handleOkPress={() => {
                setModalVisible2(false);
              }}
              loading={loading}
              modalVisible={modalVisible2} // Pass modalVisible as a prop
              setModalVisible={setModalVisible2} // Pass the setter function to update the state
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default registrationMessage;
  