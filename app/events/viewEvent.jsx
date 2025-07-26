import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
  Keyboard,
  StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocalSearchParams, router, Link } from "expo-router";
import { grey1, grey2, grey3, orange } from "../../components/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, parseISO } from "date-fns";
import AntDesign from "@expo/vector-icons/AntDesign";
import { api } from "../../helpers/helpers";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventTabs from "../../components/EventTabs";
import EventPhotos from "../../components/EventPhotos";
import EditEvent from "./editEvent";
import { useUser } from "../../context/UserContext";
import { useFocusEffect } from "@react-navigation/core";
import CustomBottomSheet from "../../components/CustomBottomSheet";
import DownloadAllPhotosBottomSheet from "../../components/DownloadAllPhotosBottomSheet";
import EventPhotoBottomSheet from "../../components/EventPhotoBottomSheet";
import StashPhotosBottomSheet from "../../components/StashPhotosBottomSheet";
import { PhotoRefreshProvider } from "../../components/PhotoRefreshContext";
import * as Network from "expo-network";

export default function ViewEvent() {
  const stashPhotosRef = useRef();
  const [isOnline, setIsOnline] = useState(true);
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
  const [overallProgress, setOverallProgress] = useState(0);
  const [eventParams, setEventParams] = useState({
    name: params.name,
    image: params.image,
    description: params.description,
    time: params.time,
    date: params.date,
    location: params.location,
  });

  const NetworkStatus = ({ isOnline }) => {
    if (isOnline) return null;

    return (
      <View style={styles.banner}>
        <Text style={styles.text}>You're offline</Text>
      </View>
    );
  };

  useEffect(() => {
    const checkNetwork = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsOnline(networkState.isConnected && networkState.isInternetReachable);
    };

    checkNetwork();

    const interval = setInterval(checkNetwork, 3000); // Check every 3 secs
    return () => clearInterval(interval);
  }, []);

  //Updating stash image
  const handleImageUpdate = (newImageUrl) => {
    setEventParams((prev) => ({
      ...prev,
      image: newImageUrl,
    }));
  };

  const parseTimeToDate = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const date = new Date(); // today’s date
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds || 0);
    date.setMilliseconds(0);
    return date;
  };

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
  const snapPoints = ["90%"];
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

  //Bottom sheet
  const [isOpen2, setIsOpen2] = useState(false);
  const snapPoints2 = ["90%"];
  const sheetRef2 = useRef(null);

  const handleSheetChange2 = useCallback((index) => {
    console.log("handleSheetChange", index);
    if (index === -1) {
      Keyboard.dismiss();
    }
  }, []);

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

  const handleClosePress2 = useCallback(() => {
    console.log("dddddddddddddd");
    Keyboard.dismiss();
    sheetRef.current?.close();
  }, []);
  //End of Bottom sheet props

  //Bottom sheet
  const [isOpen3, setIsOpen3] = useState(false);
  const snapPoints3 = ["90%"];
  const sheetRef3 = useRef(null);

  const handleSnapPress3 = useCallback(
    (index) => {
      console.log("snapped");
      if (!isOpen3) {
        setIsOpen3(true); // Show the bottom sheet
      }
      sheetRef3.current?.snapToIndex(index);
    },
    [isOpen3]
  );
  //End of Bottom sheet props

  //Bottom sheet
  const [isOpen4, setIsOpen4] = useState(false);
  const snapPoints4 = ["90%"];
  const sheetRef4 = useRef(null);

  const handleSheetChange4 = useCallback((index) => {
    console.log("handleSheetChange", index);
    if (index === -1) {
      Keyboard.dismiss();
    }
  }, []);

  const handleSnapPress4 = useCallback(
    (index) => {
      console.log("snapped");
      if (!isOpen4) {
        setIsOpen4(true); // Show the bottom sheet
      }
      sheetRef4.current?.snapToIndex(index);
    },
    [isOpen4]
  );

  const handleClosePress4 = useCallback(() => {
    console.log("dddddddddddddd");
    Keyboard.dismiss();
    sheetRef.current?.close();
  }, []);
  //End of Bottom sheet props

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
    console.log("nameeeeeeeeee", eventParams.name);

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

  const handleEditedEvent = (updatedEvent) => {
    if (!updatedEvent) return;

    setEventParams((prev) => ({
      ...prev,
      name: updatedEvent.name ?? prev.name,
      image: updatedEvent.image ?? prev.image,
      description: updatedEvent.description ?? prev.description,
      time: updatedEvent.time ?? prev.time,
      date: updatedEvent.date ?? prev.date,
      location: updatedEvent.location ?? prev.location,
    }));
  };

  const triggerCancelStash = () => {
    stashPhotosRef.current?.cancelStashProcess(); // ✅ Call the function from EventTabs
  };

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ backgroundColor: "#000000", flex: 1 }}
      className="h-full"
    >
      {/* <ScrollView> */}
      <View
        className="px-4"
        style={{
          backgroundColor: "",
          // flex: 1,
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
          <TouchableOpacity onPress={() => handleSnapPress3(0)}>
            <Image
              source={{ uri: eventParams.image }}
              style={{ borderRadius: 500, width: 50, height: 50 }}
            />
          </TouchableOpacity>
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
                    marginTop: 5,
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
                  marginTop: 5,
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

      <PhotoRefreshProvider>
        <View style={{ flex: 1 }}>
          <EventTabs
            event={event}
            eventId={eventId}
            stashId={stashId}
            existingLink={existingLink}
            existingPublicLink={event?.public_photo_link}
            eventParticipants={event?.participants}
            openDownloadSheet={() => handleSnapPress2(0)}
            openStashPhotosSheet={() => handleSnapPress4(0)}
            overallProgress={overallProgress} // ✅ pass to EventTabs
            triggerCancelStash={triggerCancelStash}
          />
        </View>

        <StashPhotosBottomSheet
          bottomSheetTitle={"Stash event photos"}
          sheetRef={sheetRef4}
          snapPoints={snapPoints4}
          handleSheetChange={handleSheetChange4}
          // handleClosePress={handleClosePress4}
          isOpen={isOpen4}
          eventId={eventId}
          eventName={eventParams.name}
          overallProgress={overallProgress}
          setOverallProgress={setOverallProgress} // ✅ pass setter to BottomSheet
          ref={stashPhotosRef}
        />
      </PhotoRefreshProvider>

      <EditEvent
        name={eventParams.name}
        description={eventParams.description}
        date={new Date(eventParams.date)}
        time={parseTimeToDate(eventParams.time)}
        location={eventParams.location}
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        handleSheetChange={handleSheetChange}
        handleClosePress={handleClosePress}
        isOpen={isOpen}
        eventId={eventId}
        // enablePanDownToClose={loading5 ? false : true}
        // handleSubmit={inviteStashMembersFunction}
        handleSnapPress={handleSnapPress}
        // stashId={stash?.id}
        sendResToEventPage={handleEditedEvent}
      />
      {/* </ScrollView> */}

      <DownloadAllPhotosBottomSheet
        sheetRef={sheetRef2}
        snapPoints={snapPoints2}
        handleSheetChange={handleSheetChange2}
        handleClosePress={handleClosePress2}
        isOpen={isOpen2}
        eventId={eventId}
        eventName={eventParams.name}
      />
      <EventPhotoBottomSheet
        bottomSheetTitle={"Update event photo"}
        sheetRef={sheetRef3}
        snapPoints={snapPoints3}
        isOpen={isOpen3}
        eventId={eventId}
        existingImage={eventParams?.image}
        onImageUpload={handleImageUpdate}
      />
      <NetworkStatus isOnline={isOnline} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: grey1,
    padding: 6,
    // position: "absolute",
    // top: 50,
    width: "100%",
    zIndex: 1000,
    height: 50,
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});
