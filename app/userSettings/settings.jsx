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
import AntDesign from "@expo/vector-icons/AntDesign";
import { grey1, grey2, grey3 } from "../../components/colors";
import { useRouter } from "expo-router";
import Header from "../../components/header";
import BottomDrawer from "../../components/BottomDrawer";
import { useUser } from "../../context/UserContext";
import CustomButton from "../../components/CustomButton";
import { api } from "../../helpers/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CustomModal from "../../components/CustomModal";
import Logout from "../(auth)/logout";

export default function Settings() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [form, setForm] = useState({ username: "", email: "", phone: "" });
  const { user } = useUser();
  const { saveUser } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const snapPoints = ["85%"];
  const sheetRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [settingsMenu, setSettingsMenu] = useState("");
  const [validMail, setValidMail] = useState(false);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleSnapPress = useCallback(
    (index) => {
      if (!isOpen) {
        setIsOpen(true); // Show the bottom sheet
      }
      sheetRef.current?.snapToIndex(index);
    },
    [isOpen]
  );

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
    setIsOpen(false); // Hide the bottom sheet
  }, []);

  const updateUsername = () => {
    setLoading(true);
    axios
      .put(
        `${api}users/username/${user?.id}`,
        { username: form.username },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        if (response?.status === 200) {
          console.log("success");
          setModalVisible(true);
        }
        // response?.status === 200 && handleModal3();
        console.log("ddddddddddddddddddddddddddddddddddd");
        console.log(response);
      })
      .catch((err) => {
        console.log("xxxxxxxxxxx");
        setLoading(false);
        // setModalVisible2(true);
        console.log(err)?.response?.data?.detail;
        setError(err?.response?.data?.detail);
      });
  };

  const updateEmail = () => {
    setLoading(true);
    axios
      .put(
        `${api}users/email/${user?.id}`,
        { email: form.email },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        if (response?.status === 200) {
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
          } = response.data;
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
          saveUser(userData);
          console.log("successsssssssssssssfffff");
          setModalVisible2(true);
          setIsOpen(false);
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
        setError(errorMessage);
      });
  };

  const updatePhone = () => {
    setLoading(true);
    axios
      .put(
        `${api}users/phone/${user?.id}`,
        { phone: form.phone },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        if (response?.status === 200) {
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
          } = response.data;
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
          saveUser(userData);
          console.log("successsssssssssssssppppp");
          setModalVisible3(true);
          setIsOpen(false);
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

  //L O G O U T  F U N C T I O N
  const removeItem = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Item with key "${key}" removed successfully`);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleRemove = async () => {
    await removeItem("authToken");
    console.log("token removed");
  };

  const handleLogout = async () => {
    console.log("clicked");

    setLoading(true); // Show loading while processing logout
    try {
      await handleRemove(); // Wait for token removal to complete
      saveUser({
        id: "",
        image: "",
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        about: "",
        created_at: "",
        dob: "",
        location: "",
        phone: "",
      }); // Reset user context
      router.replace("/(auth)/login"); // Navigate to stashes page
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false); // Hide loading after logout
      setModalVisible(false); // Close modal
    }
  };
  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ backgroundColor: "#000000" }}
      className="h-full"
    >
      {/* <Header /> */}

      {/* <ScrollView> */}
      <View className="w-full min-h-[85vh] px-4 my-6" style={{ marginTop: 60 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <View>
            <TouchableOpacity>
              <MaterialIcons
                onPress={() => router.back()}
                name="arrow-back-ios"
                size={24}
                style={{ margin: 0, color: "white" }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Settings
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              width: "100%",
            }}
            onPress={() => {
              setSettingsMenu("username");
              handleSnapPress(0);
            }}
          >
            <View style={{ marginRight: 15 }}>
              <AntDesign name="user" size={20} color={grey3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold", color: "white" }}>
                Username
              </Text>
              <Text
                style={{ color: grey3 }}
                numberOfLines={2} // Limits to 2 lines and adds ellipsis if content is too long
                ellipsizeMode="tail" // Ensures the text truncates with "..."
              >
                Change your username as it appears to others on the platform.
              </Text>
            </View>
            <View style={{ marginLeft: 15 }}>
              <MaterialIcons
                name="arrow-forward-ios"
                size={20}
                style={{ margin: 0, color: grey3 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              width: "100%",
            }}
            onPress={() => {
              setSettingsMenu("email");
              handleSnapPress(0);
            }}
          >
            <View style={{ marginRight: 15 }}>
              <AntDesign name="mail" size={20} color={grey3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold", color: "white" }}>Email</Text>
              <Text
                style={{ color: grey3 }}
                numberOfLines={2} // Limits to 2 lines and adds ellipsis if content is too long
                ellipsizeMode="tail" // Ensures the text truncates with "..."
              >
                Change your email address for login, notifications and account
                updates.
              </Text>
            </View>
            <View style={{ marginLeft: 15 }}>
              <MaterialIcons
                name="arrow-forward-ios"
                size={20}
                style={{ margin: 0, color: grey3 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              width: "100%",
            }}
            onPress={() => {
              setSettingsMenu("phone");
              handleSnapPress(0);
            }}
          >
            <View style={{ marginRight: 15 }}>
              <AntDesign name="phone" size={20} color={grey3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold", color: "white" }}>Phone</Text>
              <Text
                style={{ color: grey3 }}
                numberOfLines={2} // Limits to 2 lines and adds ellipsis if content is too long
                ellipsizeMode="tail" // Ensures the text truncates with "..."
              >
                Edit your phone number for account security and recovery.
              </Text>
            </View>
            <View style={{ marginLeft: 15 }}>
              <MaterialIcons
                name="arrow-forward-ios"
                size={20}
                style={{ margin: 0, color: grey3 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              width: "100%",
            }}
            onPress={() => {
              // setSettingsMenu("password");
              // handleSnapPress(0);
              router.push("/userSettings/changePassword");
            }}
          >
            <View style={{ marginRight: 15 }}>
              <AntDesign name="lock" size={20} color={grey3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold", color: "white" }}>
                Update your password
              </Text>
              <Text
                style={{ color: grey3 }}
                numberOfLines={2} // Limits to 2 lines and adds ellipsis if content is too long
                ellipsizeMode="tail" // Ensures the text truncates with "..."
              >
                Update your password to keep your account secure.
              </Text>
            </View>
            <View style={{ marginLeft: 15 }}>
              <MaterialIcons
                name="arrow-forward-ios"
                size={20}
                style={{ margin: 0, color: grey3 }}
              />
            </View>
          </TouchableOpacity>
          <View style={{ marginTop: 30 }}>
            <Logout />
          </View>
        </View>
      </View>

      {isOpen && (
        <BottomDrawer
          sheetRef={sheetRef}
          snapPoints={snapPoints}
          cancelText={"Cancel"}
          bottomSheetTitle={
            settingsMenu === "username"
              ? "Change your username"
              : settingsMenu === "email"
              ? "Change email"
              : settingsMenu === "phone"
              ? "Change phone"
              : settingsMenu === "password"
              ? "Change password"
              : ""
          }
          saveText={
            (settingsMenu === "username" &&
              form.username &&
              form.username.length >= 3) ||
            (settingsMenu === "email" &&
              form.email.length >= 6 &&
              emailRegex.test(form.email)) ||
            (settingsMenu === "phone" &&
              form.phone &&
              form.phone.length >= 9) ? (
              loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                "Save"
              )
            ) : (
              ""
            )
          }
          handleClosePress={() => {
            handleClosePress();
            setForm({ username: "", email: "", phone: "" });
          }}
          enablePanDownToClose={true}
          handleSubmit={
            settingsMenu === "username"
              ? updateUsername
              : settingsMenu === "email"
              ? updateEmail
              : settingsMenu === "phone"
              ? updatePhone
              : ""
          }
          handleSheetChange={handleSheetChange}
        >
          <View>
            {settingsMenu === "username" ? (
              <>
                <Text
                  style={{ fontWeight: "bold", color: "white", marginTop: 50 }}
                >
                  Change your username
                </Text>
                <Text style={{ fontWeight: "", marginTop: 5, color: grey3 }}>
                  <Text style={{ color: "red" }}>Note:</Text> Changing your
                  username will automatically log you out. You will need to log
                  in again.
                </Text>
                <Text style={{ fontWeight: "", color: grey3, marginTop: 10 }}>
                  <Text style={{ color: "white" }}>Current: </Text>
                  {user?.username}
                </Text>
              </>
            ) : settingsMenu === "email" ? (
              <>
                <Text
                  style={{ fontWeight: "bold", color: "white", marginTop: 50 }}
                >
                  Change your email
                </Text>
                <Text style={{ fontWeight: "", marginTop: 5, color: grey3 }}>
                  Change your email address for login, notifications and account
                  updates.
                </Text>
                <Text style={{ fontWeight: "", color: grey3, marginTop: 10 }}>
                  <Text style={{ color: "white" }}>Current:</Text> {user?.email}
                </Text>
              </>
            ) : settingsMenu === "phone" ? (
              <>
                <Text
                  style={{ fontWeight: "bold", color: "white", marginTop: 50 }}
                >
                  Change your phone
                </Text>
                <Text style={{ fontWeight: "", marginTop: 5, color: grey3 }}>
                  Change your phone for login and account updates.
                </Text>
                <Text style={{ fontWeight: "", color: grey3, marginTop: 10 }}>
                  <Text style={{ color: "white" }}>Current:</Text> {user?.phone}
                </Text>
              </>
            ) : settingsMenu === "password" ? (
              "Change password"
            ) : (
              ""
            )}
          </View>

          {/* INPUT AND LABEL */}
          {settingsMenu === "username" ? (
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
                New username
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
                value={form.username}
                onChangeText={(value) => {
                  // Apply regex transformations
                  const cleanedValue = value
                    .replace(/\s+/g, "") // Remove all whitespaces
                    .replace(/[^a-zA-Z0-9_]/g, "") // Remove all non-alphanumeric characters except underscores
                    .replace(
                      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}]/gu,
                      "" // Remove emojis
                    );

                  // Update state with the cleaned value
                  setForm({ ...form, username: cleanedValue });
                }}
              />
            </View>
          ) : settingsMenu === "email" ? (
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
                New email
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
                value={form.email}
                onChangeText={(value) => {
                  setForm({ ...form, email: value }); // Always update the input value
                  const emailRegex =
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                  // Validate email and set error message
                  if (value.trim() !== "" && !emailRegex.test(value.trim())) {
                    setError("Invalid email address");
                  } else {
                    setError(""); // Clear the error if valid
                    setValidMail(true);
                  }
                }}
              />
            </View>
          ) : settingsMenu === "phone" ? (
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
                New phone
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
                value={form.phone}
                onChangeText={(value) => {
                  setForm({ ...form, phone: value }); // Always update the input value
                  const phoneRegex =
                    /^(\+?\d{1,4}[\s-])?(\(?\d{1,3}\)?[\s-])?(\d{1,4}[\s-]?)?(\d{1,4})$|^\d{10}$/;

                  // Validate email and set error message
                  if (value.trim() !== "" && !phoneRegex.test(value.trim())) {
                    setError("Invalid phone");
                  } else {
                    setError(""); // Clear the error if valid
                    setValidMail(true);
                  }
                }}
              />
            </View>
          ) : (
            ""
          )}
          <Text style={{ marginTop: 10, color: "red" }}>{error}</Text>
        </BottomDrawer>
      )}
      <CustomModal
        modalTitle={"Success"}
        modalText={"Username changed successfully."}
        okText={"Logout"}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
        handleOkPress={handleLogout}
        loading={loading}
        modalVisible={modalVisible} // Pass modalVisible as a prop
        setModalVisible={setModalVisible} // Pass the setter function to update the state
      />
      <CustomModal
        modalTitle={"Success"}
        modalText={"Email changed successfully."}
        okText={"OK"}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible2(false);
        }}
        handleOkPress={() => {
          //   setIsOpen(false);
          router.push("/profile");
          setModalVisible2(false);
          setForm({ username: "", email: "", phone: "" });
        }}
        loading={loading}
        modalVisible={modalVisible2} // Pass modalVisible as a prop
        setModalVisible={setModalVisible2} // Pass the setter function to update the state
      />
      <CustomModal
        modalTitle={"Success"}
        modalText={"Phone changed successfully."}
        okText={"OK"}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible3(false);
        }}
        handleOkPress={() => {
          //   setIsOpen(false);
          router.push("/profile");
          setModalVisible3(false);
          setForm({ username: "", email: "", phone: "" });
        }}
        loading={loading}
        modalVisible={modalVisible3} // Pass modalVisible as a prop
        setModalVisible={setModalVisible3} // Pass the setter function to update the state
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
