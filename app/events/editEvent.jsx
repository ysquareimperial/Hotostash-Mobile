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
import { grey1, grey2, grey3, orange } from "../../components/colors";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { api } from "../../helpers/helpers";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../context/UserContext";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditEvent({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  isOpen,
  // enablePanDownToClose,
  eventId,
  sendResToEventPage,
  name,
  date,
  time,
  location,
  description,
}) {
  const { user } = useUser();
  const { setRefreshPageA, setEventEdited } = useUser();
  const [authToken, setAuthToken] = useState(null);
  const [album, setAlbum] = useState({});
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
    name: name,
    description: description,
    date: date || new Date(),
    time: time || new Date(),
    location: location,
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

  //Event edited
  // const handleEditEvent = async () => {
  //   await AsyncStorage.setItem("eventEdited", "true");
  //   console.log("event edited");
  // };

  const _editEvent = () => {
    setLoading2(true);
    const formattedTime = formatTime(form.time); // Convert to "HH:MM"
    const formattedDate = formatDate(form.date); // Convert date to "YYYY-MM-DD"

    console.log(form);
    axios
      .put(
        `${api}events/${eventId}`,
        {
          name: form.name,
          date: formattedDate,
          description: form.description,
          location: form.location,
          time: formattedTime,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      )
      .then((response) => {
        setLoading2(false);
        console.log("resssss", response?.status);
        handleClosePress();
        sendResToEventPage(response?.data);
        // handleEditEvent();
        if (response?.status === 200) {
          console.log("✅ only set the flag");
          setRefreshPageA(true);
          setEventEdited(true);
        }
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
          keyboardBehavior="extend"
          handleIndicatorStyle={{
            backgroundColor: "white",
          }}
          backgroundStyle={{ backgroundColor: grey2 }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior={loading2 ? "none" : "close"} // closes sheet when background is pressed
            />
          )}
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
                      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
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
                        Edit event
                      </Text>
                    </View>
                    {loading2 ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <TouchableOpacity
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                        onPress={_editEvent}
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
                          Save
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
                  </View>
                  <Text style={{ color: "#DC3545", marginTop: 10 }}>
                    {error}
                  </Text>
                </BottomSheetView>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </BottomSheet>
      )}
    </>
  );
}
