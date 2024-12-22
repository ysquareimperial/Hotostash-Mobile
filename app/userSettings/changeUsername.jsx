import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { grey1, grey3 } from "../../components/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import BottomDrawer from "../../components/BottomDrawer";
import { useUser } from "../../context/UserContext";
import { useRouter } from "expo-router";
import CustomModal from "../../components/CustomModal";
import { TextInput } from "react-native-gesture-handler";

const ChangeUsername = () => {
  const [form, setForm] = useState({ username: "" });
  const { user } = useUser();
  const { saveUser } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const snapPoints = ["85%"];
  const sheetRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    <View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          width: "100%",
        }}
        // () => handleSnapPress(0)
        onPress={() => handleSnapPress(0)}
      >
        <View style={{ marginRight: 15 }}>
          <AntDesign name="user" size={20} color={grey3} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", color: "white" }}>Username</Text>
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

      {isOpen && (
        <BottomDrawer
          sheetRef={sheetRef}
          snapPoints={snapPoints}
          cancelText={"Cancel"}
          bottomSheetTitle={"Change your username"}
          saveText={
            form.username.length >= 3 ? (
              loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                "Save"
              )
            ) : (
              ""
            )
          }
          handleClosePress={() => handleClosePress()}
          enablePanDownToClose={true}
          handleSubmit={updateUsername}
          handleSheetChange={handleSheetChange}
        >
          <View>
            <Text style={{ fontWeight: "bold", color: "white", marginTop: 50 }}>
              Change your username
            </Text>
            <Text style={{ fontWeight: "", marginTop: 5, color: grey3 }}>
              <Text style={{ color: "red" }}>Note:</Text> Changing your username
              will automatically log you out. You will need to log in again.
            </Text>
            <Text style={{ fontWeight: "", color: grey3, marginTop: 10 }}>
              <Text style={{ color: "white" }}>Current:</Text> {user?.username}
            </Text>
          </View>

          {/* INPUT AND LABEL */}
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
    </View>
  );
};

export default ChangeUsername;

const styles = StyleSheet.create({});
