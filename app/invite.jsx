import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
  ActivityIndicator,
} from "react-native";
import { grey1 } from "../components/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../helpers/helpers";
import axios from "axios";

export default function Invite() {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { token } = useLocalSearchParams();
  const [error, setError] = useState("");
  const [displayPage, setDisplayPage] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [eventData, setEventData] = useState(null);
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
        easing: Easing.linear, // ✅ fixed
      })
    ).start();
  }, [rotateAnim]);

  // Fetching token
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

  //Join event
  useEffect(() => {
    if (!authToken) return; // wait until token is set

    setLoading(true);
    setHasError(false);

    axios
      .get(`${api}albums/invite?token=${token}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          console.log(response.data);
          //   setEventData(response.data?.event);
          setDisplayPage(true);
        } else {
          setHasError(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setHasError(true);
        setError(err?.response?.data?.detail || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authToken]); // depend on authToken

  //   const viewStash = () => {
  //     router.replace(
  //       `/events/viewEvent?eventId=${eventData.event_id}&stashId=${eventData.album_id}&name=${eventData.name}&image=${eventData.image}&description=${eventData.description}&date=${eventData.date}&location=${eventData.location}&time=${eventData.time}`
  //     );
  //   };
  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ backgroundColor: "#000000", flex: 1 }}
      className="h-full"
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
        }}
      >
        <View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Animated.Image
              source={require("../assets/Hotostash_PNG/image.png")}
              style={[styles.image, animatedStyle]}
            />
          </View>

          {loading ? (
            <View style={{ marginTop: 30 }}>
              <ActivityIndicator size="small" color="white" />
              <Text style={[styles.subhead, { marginTop: 10 }]}>
                Just a sec... Finalizing your invitation.{" "}
              </Text>
            </View>
          ) : displayPage ? (
            <View>
              <View>
                <Text style={styles.head}>Invitation accepted</Text>
                <Text style={[styles.subhead, { marginTop: 10 }]}>
                  Thank you for joining the stash on Hotostash!
                </Text>
                <Text style={[styles.subhead, { marginTop: 5 }]}>
                  We're excited to have you, and we can't wait to see the
                  memories you create.
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <CustomButton
                  title={"View stash"}
                  // handlePress={viewStash}
                />
              </View>
            </View>
          ) : hasError ? (
            <View>
              <Text
                style={{ color: "white", textAlign: "center", marginTop: 30 }}
              >
                {error}!
              </Text>
              <Text
                style={{ color: "white", textAlign: "center", marginTop: 5 }}
              >
                Please contact the stash admin.
              </Text>
            </View>
          ) : (
            <View>
              <Text style={{ color: "white" }}>Waiting...</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
  },
  head: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
    marginTop: 20,
    textAlign: "center",
  },
  subhead: {
    color: "grey",
    textAlign: "center",
  },
});
