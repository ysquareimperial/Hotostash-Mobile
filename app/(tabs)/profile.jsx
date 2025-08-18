import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../context/UserContext";
import { grey1, grey2, grey3 } from "../../components/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { format, parseISO, addDays, differenceInDays } from "date-fns";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import FormField2 from "../../components/FormField2";
import { TextInput } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { api } from "../../helpers/helpers";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomModal from "../../components/CustomModal";
// import ProfilePictureUpload from "../../components/ProfileImageUploader";
import ProfilePictureBottomSheet from "../../components/ProfilePictureBottomSheet";

const Profile = () => {
  const { user } = useUser();
  const { saveUser } = useUser(); // Get saveUser from context
  const [error, setError] = useState("");
  const [modalVisible2, setModalVisible2] = useState(false);

  //Bottom sheet
  const [isOpen2, setIsOpen2] = useState(false);
  const snapPoints2 = ["90%"];
  const sheetRef2 = useRef(null);

  // const handleSheetChange2 = useCallback((index) => {
  //   console.log("handleSheetChange", index);
  //   // if (index === -1) {
  //   //   Keyboard.dismiss();
  //   // }
  // }, []);

  const handleSnapPress2 = useCallback(
    (index) => {
      console.log("snapped");
      if (!isOpen2) {
        setIsOpen2(true); // Show the bottom sheet
      }
      sheetRef2.current?.snapToIndex(index);
    },
    [isOpen2]
  );

  // const handleClosePress2 = useCallback(() => {
  //   console.log("dddddddddddddd");
  //   sheetRef.current?.close();
  // }, []);
  //End of Bottom sheet props

  // const formattedDOB = format(user?.dob, "MMMM dd, yyyy");
  const formattedDOB = user?.dob
    ? format(new Date(user.dob), "MMMM dd, yyyy")
    : "Unknown";
  // const joined = format(user?.created_at, "MMMM, yyyy");
  const joined = user?.created_at
    ? format(new Date(user.created_at), "MMMM, yyyy")
    : "Unknown";
  const [authToken, setAuthToken] = useState(null);
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    dob: user.dob ? new Date(user.dob) : new Date(2000, 0, 1), // Convert string to Date
    location: user?.location,
    about: user?.about,
  });

  const snapPoints = ["100%"];
  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleSnapPress = useCallback(
    (index) => {
      console.log("snaped");
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

  const handleSubmit = () => {
    const formattedForm = {
      ...form,
      dob: form.dob.toISOString().split("T")[0], // Format the date
    };

    console.log("Submitting form:", formattedForm);
    setLoading(true);
    axios
      .put(`${api}users/${user.id}`, formattedForm, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        console.log(response.status);
        if (response?.status === 200) {
          console.log(response.data);
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
          console.log(response?.status);
          saveUser(userData);
          handleClosePress();
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        const errorMessage =
          e.response?.data?.detail || "An unknown error occurred";
        console.log(errorMessage);
        setError(errorMessage);
        setModalVisible2(true);
        console.log(e.response);
        // alert(errorMessage);
      });
  };
  return (
    <>
      <SafeAreaView
        edges={["left", "right"]}
        style={{ backgroundColor: "#000000" }}
        className="h-full"
      >
        {/* <ScrollView> */}
        <View
          className="w-full min-h-[85vh] px-4 my-6"
          style={{ backgroundColor: "" }}
        >
          {/* <ProfilePictureUpload /> */}
          {/* <Text style={{color:'white'}}>{authToken}</Text> */}
          <View>
            <TouchableOpacity
              onPress={() => handleSnapPress2(0)}
              style={{
                borderRadius: 500,
                width: 80,
                height: 80,
                overflow: "hidden", // ensures no extra clickable area outside the circle
              }}
            >
              <Image
                source={{ uri: user?.image }}
                // className="w-[84px] h-[84px]"
                style={{
                  borderRadius: 500,
                  width: 80,
                  height: 80,
                  backgroundColor: "",
                }}
                // resizeMode="contain"
              />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  className="text-white mt-3"
                  style={{ fontSize: 20, fontWeight: "900" }}
                >
                  {user?.firstname} {user?.lastname}
                </Text>
                <Text className="" style={{ color: grey3 }}>
                  @{user?.username}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleSnapPress(0)}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <AntDesign name="edit" size={25} style={{ color: "white" }} />
              </TouchableOpacity>
            </View>
            {user?.about?.length === 0 ? (
              <Text className="" style={{ marginTop: 20, color: "grey" }}>
                You haven’t written anything about yourself yet.
              </Text>
            ) : (
              <Text className="text-white" style={{ marginTop: 20 }}>
                {user?.about}
              </Text>
            )}
            <Text className="" style={{ marginTop: 10, color: "white" }}>
              {user?.email} • {user?.phone}
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 20,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <MaterialCommunityIcons
                  name="cake-variant-outline"
                  size={12}
                  style={{ color: grey3 }}
                />
                <Text
                  className="text-white"
                  style={{ marginTop: "", color: grey3 }}
                >
                  {formattedDOB}
                  {/* {user.dob} */}
                </Text>
              </View>
              {user?.location?.length === 0 || user?.location === null ? (
                ""
              ) : (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <SimpleLineIcons
                    name="location-pin"
                    size={10}
                    style={{ color: grey3 }}
                  />
                  <Text
                    className="text-white"
                    style={{ marginTop: "", color: grey3 }}
                  >
                    {user?.location}
                  </Text>
                </View>
              )}
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <AntDesign name="calendar" size={10} style={{ color: grey3 }} />
                <Text
                  className="text-white"
                  style={{ marginTop: "", color: grey3 }}
                >
                  Joined {joined}
                </Text>
              </View>
            </View>

            <View
              className="mt-5"
              style={{ borderTopColor: grey2, borderWidth: 1 }}
            ></View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              <View
                style={{
                  backgroundColor: grey2,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <Text style={{ color: grey3, fontSize: 10 }}>
                  Past events{" "}
                  <Text
                    style={{ color: "white", fontWeight: 900, fontSize: 20 }}
                  >
                    30
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: grey2,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <Text style={{ color: grey3, fontSize: 10 }}>
                  Events created{" "}
                  <Text
                    style={{ color: "white", fontWeight: 900, fontSize: 20 }}
                  >
                    30
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: grey2,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <Text style={{ color: grey3, fontSize: 10 }}>
                  Photos stashed{" "}
                  <Text
                    style={{ color: "white", fontWeight: 900, fontSize: 20 }}
                  >
                    300
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          {isOpen && (
            <BottomSheet
              ref={sheetRef}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              onChange={handleSheetChange}
              handleIndicatorStyle={{
                backgroundColor: "white",
              }}
              backgroundStyle={{ backgroundColor: grey2 }}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  appearsOnIndex={0}
                  disappearsOnIndex={-1}
                  pressBehavior={"close"} // closes sheet when background is pressed
                />
              )}
            >
              <View style={{ flex: 1, backgroundColor: grey2 }}>
                <BottomSheetView className="px-4">
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* Left-aligned text */}
                    <Text
                      onPress={() => handleClosePress()}
                      style={{ color: "white", fontWeight: "bold" }}
                    >
                      Cancel
                    </Text>

                    {/* Spacer to center the second text */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center",
                          marginTop: 4,
                        }}
                      >
                        Edit profile
                      </Text>
                    </View>
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text
                        onPress={() => {
                          handleSubmit();
                        }}
                        style={{ color: "white", fontWeight: "bold" }}
                      >
                        Save
                      </Text>
                    )}
                  </View>
                  {/* <FormField2 /> */}

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
                        First name
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
                        value={form.firstname}
                        onChangeText={(value) =>
                          setForm({ ...form, firstname: value })
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
                        Last name
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
                        maxLength={50}
                        value={form.lastname}
                        onChangeText={(value) =>
                          setForm({ ...form, lastname: value })
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
                        About
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
                        value={form.about}
                        onChangeText={(value) =>
                          setForm({ ...form, about: value })
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
                        Location
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
                        maxLength={50}
                        value={form.location}
                        onChangeText={(value) =>
                          setForm({ ...form, location: value })
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
                        Birth date
                      </Text>
                      <DateTimePicker
                        value={form.dob}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedDate) => {
                          if (selectedDate) {
                            // Resetting the time to 00:00:00 UTC to only keep the date
                            const newDate = new Date(selectedDate);
                            newDate.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC
                            setForm({ ...form, dob: newDate }); // Set the state with the date-only object
                          }
                        }}
                        themeVariant="dark"
                        minimumDate={new Date(1950, 0, 1)}
                        maximumDate={new Date(2010, 11, 31)}
                      />
                    </View>
                  </View>
                </BottomSheetView>
              </View>
            </BottomSheet>
          )}
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
        </View>
        <ProfilePictureBottomSheet
          bottomSheetTitle={"Update profile photo"}
          sheetRef={sheetRef2}
          snapPoints={snapPoints2}
          // handleSheetChange={handleSheetChange2}
          // handleClosePress={handleClosePress2}
          isOpen={isOpen2}
          existingImage={user?.image}
          // eventId={eventId}
          // eventName={eventParams.name}
        />
        {/* </ScrollView> */}
      </SafeAreaView>
      {/* <BottomDrawer /> */}
    </>
  );
};

export default Profile;
