import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { grey1, grey2, grey3, orange } from "../../../components/colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import { api } from "../../../helpers/helpers";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../../context/UserContext";
import CustomModal from "../../../components/CustomModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import ToggleSwitch from "../../../components/ToggleSwitch";

export default function CreateEvent({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  isOpen,
  // enablePanDownToClose,
  stashId,
  sendEventToStashPage,
}) {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [album, setAlbum] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading2, setLoading2] = useState(false);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [form, setForm] = useState({
    name: "",
    image:
      "https://res.cloudinary.com/dkwy56ghj/image/upload/v1725735308/xm8qfutvpnkhmqltthrd.png",
    description: "",
    date: new Date(), // Convert string to Date
    time: new Date(),
    location: "",
    contribution_status: false,
  });
  // Fetching token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          // console.log("Token retrieved:", token);
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

  //Fetch stash members
  const fetchStashMembers = () => {
    axios
      .get(`${api}albums/${26}/members/search`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setMembers(response?.data?.members);
        console.log(members);
        console.log("memberssssssssssssssss");
      })
      .catch((err) => {
        console.log("error fetching data", err);
      });
  };
  useEffect(() => {
    fetchStashMembers();
  }, []);
  // Fetch users based on the search query

  // ADDING MEMBERS FXN
  const postCreateEvent = () => {
    setLoading2(true);
    const formattedTime = formatTime(form.time); // Convert to "HH:MM"
    const formattedDate = formatDate(form.date); // Convert date to "YYYY-MM-DD"

    console.log(form);
    axios
      .post(
        `${api}events/?album_id=${stashId}`,
        {
          name: form.name,
          image: form.image,
          date: formattedDate,
          description: form.description,
          location: form.location,
          time: formattedTime,
          contribution_status: form?.contribution_status,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      )
      .then((response) => {
        setLoading2(false);
        console.log(response?.data);
        handleClosePress();
        setForm((prevForm) => ({
          ...prevForm, // Keep the existing image
          name: "",
          description: "",
          date: new Date(),
          time: new Date(),
          location: "",
          contribution_status: false,
        }));

        // const extractedEventData = {
        //   id: response.data.id, // Pick only the ID
        //   name: response.data.name, // Pick only the Name
        //   image: response.data.image, // Pick only the Email
        //   description: response.data.description, // Pick only the Email
        //   location: response.data.location, // Pick only the Email
        //   date: response.data.date, // Pick only the Email
        // };

        sendEventToStashPage(response?.data);
        // if (response.status === 201) {

        // }
      })
      .catch((e) => {
        setLoading2(false);
        console.log(e);
        console.log(e.response?.data?.detail);
        // setErrorMessage(e.response?.data?.detail);
      });
  };

  return (
    <>
      {isOpen && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={loading2 ? false : true}
          onChange={handleSheetChange}
        >
          <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Wrap everything in TouchableWithoutFeedback */}
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View style={{ flex: 1, backgroundColor: grey2 }}>
                <BottomSheetView className="px-4">
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* Left-aligned text */}
                    <TouchableOpacity
                      onPress={() => {
                        handleClosePress();
                        // setForm('')
                      }}
                      disabled={loading2}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          // fontSize: 18,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    {/* Spacer to center the second text */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center",
                          marginTop: 4,
                          // fontSize: 18,
                        }}
                      >
                        New event
                      </Text>
                    </View>
                    {loading2 ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <TouchableOpacity
                        onPress={postCreateEvent}
                        disabled={
                          form.name.length === 0 || form.location.length === 0
                        } // Disable the button if length is 0
                        // Optional: Reduce opacity when disabled
                      >
                        <Text
                          style={{
                            color:
                              form.name.length === 0 ||
                              form.location.length === 0
                                ? "grey"
                                : "white", // Change color to grey if length is 0
                            fontWeight: "bold",
                            // fontSize: 18,
                          }}
                        >
                          Create
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={{ marginTop: 20 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderColor: grey1,
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: grey3 }}>
                        Event name
                      </Text>
                      <TextInput
                        style={{
                          backgroundColor: "transparent",
                          width: "80%",
                          padding: 14,
                          borderRadius: 5,
                          color: "white",
                        }}
                        value={form.name}
                        onChangeText={(value) =>
                          setForm({ ...form, name: value })
                        }
                        maxLength={50}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderColor: grey1,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: grey3 }}>
                        Event location
                      </Text>
                      <TextInput
                        style={{
                          backgroundColor: "transparent",
                          padding: 14,
                          width: "80%",
                          borderRadius: 5,
                          width: "100%",
                          color: "white",
                        }}
                        value={form.location}
                        onChangeText={(value) =>
                          setForm({ ...form, location: value })
                        }
                        maxLength={50}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderColor: grey1,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: grey3 }}>
                        Description
                      </Text>
                      <TextInput
                        style={{
                          backgroundColor: "transparent",
                          padding: 14,
                          // border: "none",
                          borderRadius: 5,
                          width: "80%",
                          color: "white",
                        }}
                        multiline
                        maxLength={200}
                        placeholder="(Optional)"
                        value={form.description}
                        onChangeText={(value) =>
                          setForm({ ...form, description: value })
                        }
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderColor: grey1,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: grey3 }}>
                        Event date
                      </Text>
                      <DateTimePicker
                        value={form.date}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedDate) => {
                          if (selectedDate) {
                            const newDate = new Date(selectedDate);
                            newDate.setUTCHours(0, 0, 0, 0); // Reset time to midnight UTC

                            // Format the date as "YYYY-MM-DD"
                            const formattedDate = newDate
                              .toISOString()
                              .split("T")[0];

                            console.log(formattedDate); // Logs "2025-02-13"

                            setForm({ ...form, date: newDate });
                          }
                        }}
                        themeVariant="dark"
                      />
                    </View>
                    {/* <Text>
                    Selected Time:{" "}
                    {form.time.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text> */}
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderColor: grey1,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: grey3 }}>
                        Event time
                      </Text>
                      <DateTimePicker
                        value={form.time}
                        mode="time"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedTime) => {
                          if (selectedTime) {
                            setForm((prev) => ({
                              ...prev,
                              time: selectedTime,
                            }));
                          }
                        }}
                      />
                    </View>

                    <View
                      style={{
                        // flexDirection: "row",
                        borderBottomWidth: 1,
                        borderColor: grey1,
                        paddingTop: 14,
                        paddingBottom: 14,
                        // alignItems: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: "white" }}>
                        Enable contributions
                      </Text>
                      <Text style={{ marginTop: 5, color: grey3 }}>
                        Enabling contributions allows event participants to
                        contribute money to your event.
                      </Text>

                      <View style={{ marginTop: 10 }}>
                        <ToggleSwitch />
                      </View>
                    </View>
                    <View
                      style={{
                        // flexDirection: "row",
                        borderBottomWidth: 1,
                        borderColor: grey1,
                        paddingTop: 14,
                        paddingBottom: 14,
                        // alignItems: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: "white" }}>
                        Add all the stash members to this event
                      </Text>
                      <Text style={{ marginTop: 5, color: grey3 }}>
                        Enabling this will automatically add all stash members
                        to this event.
                      </Text>

                      <View style={{ marginTop: 10 }}>
                        <ToggleSwitch />
                      </View>
                    </View>
                  </View>

                  <Text style={{ color: "#DC3545", marginTop: 10 }}>
                    {error}
                  </Text>
                </BottomSheetView>
              </View>
            </TouchableWithoutFeedback>
            <CustomModal
              modalTitle={"Invitation sent"}
              modalText={
                "Users invited successfully. Invitation links have been sent to their registered emails."
              }
              okText={"OK"}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(false);
              }}
              handleOkPress={() => {
                handleClosePress();
                setSelectedMembers([]);
                setSearchQuery("");
                setUsers([]);
                //   setIsOpen(false);

                setModalVisible(false);
              }}
              modalVisible={modalVisible} // Pass modalVisible as a prop
              setModalVisible={setModalVisible} // Pass the setter function to update the state
            />
          </ScrollView>
        </BottomSheet>
      )}
    </>
  );
}
