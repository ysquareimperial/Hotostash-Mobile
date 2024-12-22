import React, { useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { api } from "../../helpers/helpers";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import CustomModal from "../../components/CustomModal";
import { Link, router } from "expo-router";
import logo from "../../assets/Hotostash PNG/77.png";
import google from "../../assets/google.png";
import { orange } from "../../components/colors";
import OrSeparator from "../../components/OrSeparator";
import CustomButton2 from "../../components/CustomButton2";
import { useUser } from "../../context/UserContext";

const Login = () => {
  const { saveUser } = useUser(); // Get saveUser from context
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible2, setModalVisible2] = useState(false);
  const isButtonDisabled = !form.username || !form.password;

  const formData = new URLSearchParams();
  formData.append("username", form.username);
  formData.append("password", form.password);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${api}login_user`, formData);
      setLoading(false);
      if (response.status === 200) {
        const token = response?.data?.access_token;
        console.log(token);

        if (token) {
          await AsyncStorage.setItem("authToken", token); // Save token to AsyncStorage
          fetchUserProfile(token);
        } else {
          setError("Token not found. Please try again.");
        }
      } else {
        setError(response?.data?.detail || "Login failed. Please try again.");
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

  const fetchUserProfile = async (token) => {
    try {
      const profileResponse = await axios.get(`${api}users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(profileResponse.data);
      const {
        id,
        image,
        firstname,
        lastname,
        username,
        email,
        about,
        created_at,
        dob,
        location,
        phone,
      } = profileResponse.data;

      const userData = {
        id,
        image,
        firstname,
        lastname,
        username,
        email,
        about,
        created_at,
        dob,
        location,
        phone,
      };
      console.log(userData);

      saveUser(userData); // Update UserContext and AsyncStorage
      console.log("User profile saved successfully!");
      router.replace("/stashes");
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch user profile.");
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#000000" }} className="h-full">
      {/* <ScrollView> */}
      <View className="w-full justify-center min-h-[85vh] px-4 my-6">
        <View className="items-center">
          <Image
            source={logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
        </View>
        <FormField
          placeholder={"Username/Phone/Email"}
          title="Email"
          value={form.username}
          handleChangeText={(text) =>
            setForm({ ...form, username: text.trim() })
          }
          otherStyles="mt-7"
          keyboardType="email-address"
        />
        <FormField
          placeholder={"Password"}
          title="Password"
          value={form.password}
          handleChangeText={(text) => setForm({ ...form, password: text })}
          otherStyles="mt-5"
        />
        <CustomButton
          title={
            loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              "Log in"
            )
          }
          handlePress={handleSubmit}
          isLoading={loading || isButtonDisabled}
        />
        <OrSeparator />
        <CustomButton2 logo={google} title={`Sign in with google`} />
        <View
          style={{
            marginTop: 30,
            display: "flex",
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text style={{ color: "white" }}>Don't have an account?</Text>

          <Link href="/register" style={{ color: orange }}>
            Create new account
          </Link>
        </View>
        <CustomModal
          modalTitle={"Login failed"}
          modalText={error}
          okText={"OK"}
          handleOkPress={()=>setModalVisible2(false)}
          onRequestClose={() => setModalVisible2(false)}
          loading={loading}
          modalVisible={modalVisible2}
          // setModalVisible={setModalVisible2}
        />
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default Login;
