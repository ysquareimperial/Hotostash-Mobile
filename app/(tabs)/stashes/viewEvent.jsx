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

export default function ViewEvent() {
  // Fetching token
  const [authToken, setAuthToken] = useState(null);
  const [existingLink, setExistingLink] = useState(null);
  const { eventId } = useLocalSearchParams();
  const { stashId } = useLocalSearchParams();
  const { name } = useLocalSearchParams();
  const { image } = useLocalSearchParams();
  const { description } = useLocalSearchParams();
  const { time } = useLocalSearchParams();
  const { location } = useLocalSearchParams();
  const { date } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

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
      console.log("from view eventtttttttttttttttttttttttt");
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
            source={{ uri: image }}
            style={{ borderRadius: 500, width: 50, height: 50 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              {name}
            </Text>
            {description.length === 0 ? (
              ""
            ) : (
              <Text
                style={{
                  color: "grey",
                  fontSize: 14,
                }}
              >
                {description}
              </Text>
            )}
            <Text
              style={{
                color: "grey",
                fontSize: 12,
                fontWeight: "bold",
                marginTop: 5,
              }}
            >
              {date ? format(parseISO(date), "MMM dd, yyyy") : "N/A"} •{" "}
              {time ? format(new Date(`1970-01-01T${time}`), "hh:mm a") : "N/A"}
            </Text>
            <Text
              style={{
                color: "grey",
                fontSize: 12,
              }}
            >
              {location}
            </Text>
          </View>
        </View>
      </View>
      <EventTabs
        eventId={eventId}
        stashId={stashId}
        existingLink={existingLink}
      />

      {/* <EventPhotos eventId={id}/> */}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}
