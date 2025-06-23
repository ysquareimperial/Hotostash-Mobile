import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { grey2 } from "./colors";
import CustomButton from "./CustomButton";
import CustomButton2 from "./CustomButton2";
import CustomButton3 from "./CustomButton3";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import axios from "axios";
import { api } from "../helpers/helpers";

const GenerateEventLink = ({
  modalText,
  modalExtraText,
  modalTitle,
  cancelText,
  //   okText,
  handleCancelPress,
  handleOkPress,
  onRequestClose,
  modalVisible, // Receive modalVisible as a prop
  setModalVisible, // Receive setModalVisible to update state in the parent
  children,
  eventParticipants,
  user,
  existingLink,
  eventId,
  ...props
}) => {
  const [link, setLink] = useState(null);
  const [copied, setCopied] = useState(false); // State to manage copy icon change
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  // FETCHING TOKEN
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

  const handleCopy = async () => {
    const textToCopy = link?.invite_link || existingLink;

    await Clipboard.setStringAsync(textToCopy);
    setCopied(true);

    console.log("Copied to clipboard!");

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const generateLink = () => {
    setLoading(true);
    axios
      .post(
        `${api}events/${eventId}/generate-invite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setLink(response?.data);
        console.log(response?.data);
      })
      .catch((err) => {
        setLoading(false);
        // console.log("error fetching data", err);
      });
  };

  const showAlert = () => {
    Alert.alert(
      "Reset link",
      "If you reset the link, no one will be able to use it to join this event. Are you sure you want to reset?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            console.log("OK Pressed");
            generateLink();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible} // Use modalVisible prop here
        onRequestClose={onRequestClose}
        {...props}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalText}>{modalText}</Text>
            <Text style={styles.modalExtraText}>{modalExtraText}</Text>
            <View style={{ fontSize: 12, width: "100%", overflow: "hidden" }}>
              {link?.invite_link ? (
                <Text style={{ color: "grey" }}>{link?.invite_link}</Text>
              ) : (
                <Text style={{ color: "grey" }}>{existingLink}</Text>
              )}
            </View>

            {children}
            <View className="">
              {eventParticipants?.participants?.some(
                (participants) =>
                  participants.user.username === user?.username &&
                  participants.role !== "admin"
              ) ? (
                <Text className="" style={{ fontSize: 12, color: "grey" }}>
                  Only organizers can generate public link.
                </Text>
              ) : null}
            </View>
            {existingLink || link?.invite_link ? (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 30,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  {copied ? (
                    <Text style={{ color: "white" }}>Link copied</Text>
                  ) : (
                    <TouchableOpacity onPress={handleCancelPress}>
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 20,
                    // marginTop: 30,
                    justifyContent: "flex-end",
                  }}
                >
                  {eventParticipants?.participants?.some(
                    (participants) =>
                      participants.user.username === user?.username &&
                      participants.role === "admin"
                  ) ? (
                    <>
                      {loading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <TouchableOpacity onPress={showAlert}>
                          <AntDesign name="reload1" size={25} color="white" />
                        </TouchableOpacity>
                      )}
                    </>
                  ) : null}
                  <TouchableOpacity onPress={handleCopy}>
                    <AntDesign name="copy1" size={25} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                {cancelText && (
                  <CustomButton3
                    title={cancelText}
                    handlePress={handleCancelPress}
                    isLoading={loading}
                  />
                )}

                {eventParticipants?.participants?.some(
                  (participants) =>
                    participants.user.username === user?.username &&
                    participants.role === "admin"
                ) ? (
                  <CustomButton
                    title={
                      loading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        "Generate link"
                      )
                    }
                    isLoading={loading}
                    handlePress={generateLink} // Close modal on OK button press
                  />
                ) : null}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GenerateEventLink;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  },
  modalView: {
    margin: 250,
    width: "80%",
    backgroundColor: "black",
    borderRadius: 5, // Rounded corners (if you want to keep this)
    padding: 14, // Padding inside the modal for better spacing
    // alignItems: "center",
    borderWidth: 1, // Add border width
    borderColor: grey2, // Set border color (black in this case)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    color: "grey",
    // textAlign: "center",
  },
  modalExtraText: {
    color: "white",
    // marginTop: 10,
    // textAlign: "center",
  },
  modalTitle: {
    marginBottom: 5,
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    // textAlign: "center",
  },
});
