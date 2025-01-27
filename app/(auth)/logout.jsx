import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useUser } from "../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { grey2 } from "../../components/colors";
import CustomModal from "../../components/CustomModal";

export default function Logout() {
  const { saveUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
      router.replace("/login"); // Navigate to login and replace current route
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false); // Hide loading after logout
      setModalVisible(false); // Close modal
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View
          style={{
            marginTop: 30,
            width: "100%",
            backgroundColor: grey2,
            borderRadius: 5,
            padding: 20,
          }}
        >
          <Text
            style={{
              color: "#DC3545",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Log out
          </Text>
        </View>
      </TouchableOpacity>

      <CustomModal
        modalTitle={"Log out"}
        cancelText={"Cancel"}
        handleCancelPress={() => setModalVisible(false)}
        modalText={"Are you sure you want to log out?"}
        okText={
          loading ? <ActivityIndicator size="small" color="white" /> : "Log out"
        }
        handleOkPress={handleLogout}
        onRequestClose={() => setModalVisible(false)}
        loading={loading}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
}
