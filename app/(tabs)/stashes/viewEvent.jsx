import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
  Keyboard,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { grey1, grey2, grey3, orange } from "../../../components/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, parseISO } from "date-fns";
import AntDesign from "@expo/vector-icons/AntDesign";
import { api } from "../../../helpers/helpers";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventTabs from "../../../components/EventTabs";
import EventPhotos from "../../../components/EventPhotos";
import EditEvent from "./editEvent";
import { useUser } from "../../../context/UserContext";
import { useFocusEffect } from "@react-navigation/core";

export default function ViewEvent() {
  const { user } = useUser();
  const params = useLocalSearchParams();
  const [contributionStatus, setContributionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [event, setEvent] = useState({});
  const [existingLink, setExistingLink] = useState(null);
  const { eventId } = useLocalSearchParams();
  const { stashId } = useLocalSearchParams();
  const [eventParams, setEventParams] = useState({
    name: params.name,
    image: params.image,
    description: params.description,
    time: params.time,
    date: params.date,
    location: params.location,
  });

  const [form, setForm] = useState({
    name: eventParams.name,
    description: eventParams.description,
    date: eventParams.date, // Convert string to Date
    time: eventParams.time,
    location: eventParams.location,
  });

  //Contribution status
  // useEffect(() => {
  //   if (params?.contributionStatus !== undefined) {
  //     const status =
  //       params.contributionStatus === true ||
  //       params.contributionStatus === "true";
  //     setContributionStatus(status);
  //     console.log("paramsssssss:", status);
  //   }
  // }, [params]);
  useEffect(() => {
    if (event?.contribution_status === false) {
      const status = event?.contribution_status;
      setContributionStatus(status);
      console.log("paramsssssss:", status);
    }
  }, [params]);
  
  useEffect(() => {
    if (contributionStatus === false) {
      // Save only if explicitly false
      console.log("paramsssssss:", contributionStatus);
      
      AsyncStorage.setItem(
        "contributionStatus",
        JSON.stringify(contributionStatus)
      );
      console.log("contribution status saved:", contributionStatus);
    }
  }, [contributionStatus]);
  //Contribution status

  //Bottom sheet
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["100%"];
  const sheetRef = useRef(null);

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
    if (index === -1) {
      // Sheet has been closed (either by pan-down or programmatically)
      Keyboard.dismiss();
    }
  }, []);

  const handleSnapPress = useCallback(
    (index) => {
      console.log("snapped");
      if (!isOpen) {
        setIsOpen(true); // Show the bottom sheet
      }
      sheetRef.current?.snapToIndex(index);
    },
    [isOpen]
  );

  const handleClosePress = useCallback(() => {
    console.log("dddddddddddddd");
    Keyboard.dismiss();
    sheetRef.current?.close();
    setIsOpen(false); // Hide the bottom sheet
    setLoading2(false);
    // setForm((prevForm) => ({
    //   ...prevForm,
    //   title: "",
    //   description: "",
    // }));
  }, []);
  //End of Bottom sheet props

  //Refresh if user left an event
  // useFocusEffect(
  //   useCallback(() => {
  //     const checkFlag = async () => {
  //       const flag = await AsyncStorage.getItem("goBackFlag");
  //       console.log(flag);
  //       if (flag === "true") {
  //         console.log("User came back from Screen B");
  //         fetchStash();
  //         await AsyncStorage.removeItem("goBackFlag");
  //       }
  //     };

  //     checkFlag();
  //   }, [])
  // );

  //Fetch token
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

  //Fetch Event
  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${api}events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setExistingLink(response?.data?.public_photo_link);
      setEvent(response?.data);
      console.log("from view eventtttttttttttttttttttttttt");
      console.log(response?.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) return;
    setLoading(true);
    fetchEvent();
  }, [authToken]);

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ backgroundColor: "#000000", flex: 1 }}
      className="h-full"
    >
      {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
      <View
        className="px-4"
        style={{
          backgroundColor: "",
          flex: "",
          marginVertical: 0,
          marginTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginBottom: 10,
            backgroundColor: "",
          }}
        >
          <Image
            source={{ uri: eventParams.image }}
            style={{ borderRadius: 500, width: 50, height: 50 }}
          />
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => handleSnapPress(0)}
              disabled={
                !event?.participants?.some(
                  (member) =>
                    member.user.username === user?.username &&
                    member.role === "admin"
                )
              }
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
              >
                {eventParams.name}
              </Text>
              {eventParams.description.length === 0 ? (
                ""
              ) : (
                <Text
                  style={{
                    color: "grey",
                    fontSize: 14,
                  }}
                >
                  {eventParams.description}
                </Text>
              )}
              <Text
                style={{
                  color: "grey",
                  fontSize: 12,
                  // fontWeight: "bold",
                  // marginTop: 5,
                }}
              >
                {eventParams.date
                  ? format(parseISO(eventParams.date), "MMM dd, yyyy")
                  : "N/A"}{" "}
                •{" "}
                {eventParams.time
                  ? format(
                      new Date(`1970-01-01T${eventParams.time}`),
                      "hh:mm a"
                    )
                  : "N/A"}
              </Text>
              <Text
                style={{
                  color: "grey",
                  fontSize: 12,
                }}
              >
                {eventParams.location}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <EventTabs
        event={event}
        eventId={eventId}
        stashId={stashId}
        existingLink={existingLink}
      />
      {/* <EventPhotos eventId={id}/> */}
      {/* </ScrollView> */}

      <EditEvent
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        handleSheetChange={handleSheetChange}
        handleClosePress={handleClosePress}
        isOpen={isOpen}
        // enablePanDownToClose={loading5 ? false : true}
        // handleSubmit={inviteStashMembersFunction}
        handleSnapPress={handleSnapPress}
        // stashId={stash?.id}
        // sendEventToStashPage={handleCreatedEvent}
      />
    </SafeAreaView>
  );
}
