import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { grey1, grey3 } from "../../components/colors";
import CustomModal from "../../components/CustomModal";
import axios from "axios";
import { api } from "../../helpers/helpers";
import { useUser } from "../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ChangePassword() {
  const [isSecure, setIsSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [error, setError] = useState("");
  const { user } = useUser();
  const [modalVisible3, setModalVisible3] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const updatePassword = () => {
    const new_formData = new URLSearchParams();
    new_formData.append("current_password", form.currentPassword);
    new_formData.append("new_password", form.newPassword);
    new_formData.append("confirm_new_password", form.confirmPassword);
    console.log(new_formData + "qqqqqqqqqqqqqqqqqqqqqqqq");
    setLoading(true);
    axios
      .post(`${api}change_password/`, new_formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setLoading(false);
        if (response?.status === 200) {
          console.log("successsssssssssssssppppp");
          setModalVisible3(true);
        }
        // response?.status === 200 && handleModal3();
        console.log("ddddddddddddddddddddddddddddddddddd");
        console.log(response?.data);
      })
      .catch((e) => {
        console.log("xxxxxxxxxxx");
        setLoading(false);
        const errorMessage =
          e.response?.data?.detail || "An unknown error occurred";
        console.error(errorMessage);
        console.error(e);
        setError(errorMessage);
      });
  };

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

    fetchToken();
  }, []);
  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ backgroundColor: "#000000" }}
      className="h-full"
    >
      {/* <Header /> */}

      {/* <ScrollView> */}
      <View className="w-full min-h-[85vh] px-4 my-6" style={{ marginTop: 60 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity>
            <MaterialIcons
              onPress={() => router.back()}
              name="arrow-back-ios"
              size={24}
              style={{ margin: 0, color: "white" }}
            />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Change password
            </Text>
          </View>
          <TouchableOpacity onPress={updatePassword}>
            {form.currentPassword.length > 3 &&
              form.newPassword.length > 3 &&
              (form.confirmPassword.length > 3 && (
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    "Save"
                  )}
                </Text>
              ))}
          </TouchableOpacity>
        </View>

        <Text
          style={{ color: grey3, marginTop: 40 }}
          numberOfLines={2} // Limits to 2 lines and adds ellipsis if content is too long
          ellipsizeMode="tail" // Ensures the text truncates with "..."
        >
          Update your password to keep your account secure.
        </Text>
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderColor: grey1,
            alignItems: "center",
            width: "100%",
            marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", color: grey3 }}>
            Current password
          </Text>
          <TextInput
            style={{
              backgroundColor: "transparent",
              width: "80%",
              padding: 14,
              borderRadius: 5,
              color: "white",
            }}
            maxLength={50}
            secureTextEntry={isSecure}
            value={form.currentPassword}
            onChangeText={(value) => {
              setForm({ ...form, currentPassword: value });
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderColor: grey1,
            alignItems: "center",
            width: "100%",
            // marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", color: grey3 }}>New password</Text>
          <TextInput
            style={{
              backgroundColor: "transparent",
              width: "80%",
              padding: 14,
              borderRadius: 5,
              color: "white",
            }}
            maxLength={50}
            secureTextEntry={isSecure}
            value={form.newPassword}
            onChangeText={(value) => {
              setForm({ ...form, newPassword: value });
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderColor: grey1,
            alignItems: "center",
            width: "100%",
            // marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", color: grey3 }}>
            Confirm new password
          </Text>
          <TextInput
            style={{
              backgroundColor: "transparent",
              width: "80%",
              padding: 14,
              borderRadius: 5,
              color: "white",
            }}
            maxLength={50}
            secureTextEntry={isSecure}
            value={form.confirmPassword}
            onChangeText={(value) => {
              setForm({ ...form, confirmPassword: value });
            }}
          />
        </View>
        <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
        <Text
          style={{ color: "white", fontWeight: "bold", marginTop: 20 }}
          onPress={() => setIsSecure(!isSecure)}
        >
          {!isSecure ? "Hide password" : "Show password"}
        </Text>
      </View>
      <CustomModal
        modalTitle={"Success"}
        modalText={"Password changed successfully."}
        okText={"OK"}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible3(false);
        }}
        handleOkPress={() => {
          //   setIsOpen(false);
          router.push("/profile");
          setModalVisible3(false);
          setForm({
            newPassword: "",
            confirmPassword: "",
            currentPassword: "",
          });
        }}
        loading={loading}
        modalVisible={modalVisible3} // Pass modalVisible as a prop
        setModalVisible={setModalVisible3} // Pass the setter function to update the state
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
