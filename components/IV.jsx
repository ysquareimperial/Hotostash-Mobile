import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { api } from "../helpers/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { useUser } from "../context/UserContext";
import CustomButton from "./CustomButton";
import CustomButton2 from "./CustomButton2";
import CustomButton3 from "./CustomButton3";
import { grey1, grey2, grey3, orange } from "./colors";
import logo from "../assets/Hotostash_PNG/66.png";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");
const IV = ({ eventId }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const { user } = useUser();

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

      setEvent(response?.data);

      console.log(response?.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    if (!authToken) return;
    setLoading(true);
    fetchEvent();
  }, [authToken]);

  return (
    <SafeAreaView edges={["left", "right"]} className="h-full">
      {/* <ScrollView> */}
      <ScrollView>
        <View className="w-full justify-center">
          <View
            className="px-4"
            style={{
              backgroundColor: "",
              // flex: 1,
              marginVertical: 0,
              marginTop: 10,
              marginBottom: 50,
            }}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="grey"
                style={{ marginTop: 20 }}
              />
            ) : (
              <>
                <View style={styles.ticket}>
                  <View style={styles.details}>
                    <View
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                        elevation: 8, // Needed for Android
                        borderRadius: 25, // Matches image borderRadius
                        overflow: Platform.OS === "ios" ? "visible" : "hidden", // Allows shadow on iOS
                      }}
                    >
                      <Image
                        source={{ uri: event?.image }}
                        style={{
                          borderRadius: 20,
                          width: "100%",
                          height: 120,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 10,
                        marginTop: 10,
                      }}
                    >
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={styles.title}>{event?.name}</Text>
                        <Text style={styles.desc}>{event?.description}</Text>
                      </View>
                      {/* {event?.image && (
                    <View
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                        elevation: 8, // Needed for Android
                        borderRadius: 25, // Matches image borderRadius
                        overflow: Platform.OS === "ios" ? "visible" : "hidden", // Allows shadow on iOS
                      }}
                    >
                      <Image
                        source={{ uri: event?.image }}
                        style={{
                          borderRadius: 25,
                          width: 50,
                          height: 50,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                  )} */}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontStyle: "italic",
                          color: "grey",
                        }}
                      >
                        {user?.firstname} {user?.lastname}, you're invited!
                      </Text>

                      <MaterialIcons name="verified" size={20} color={orange} />
                    </View>
                    <Text style={{ marginTop: 20 }}>Location</Text>
                    <Text style={styles.info}>{event?.location}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ width: "50%" }}>
                        <Text style={{ marginTop: 20 }}>Date</Text>
                        <Text style={styles.info}>
                          {event?.date
                            ? format(parseISO(event?.date), "MMM dd, yyyy")
                            : "N/A"}
                        </Text>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Text style={{ marginTop: 20 }}>Time</Text>
                        <Text style={styles.info}>
                          {event?.time
                            ? format(
                                new Date(`1970-01-01T${event?.time}`),
                                "hh:mm a"
                              )
                            : "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <View style={{ width: "50%" }}>
                        <Text style={{ marginTop: 20 }}>Ticket ID</Text>
                        <Text style={styles.info}>323</Text>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Text style={{ marginTop: 20 }}>Table No</Text>
                        <Text style={styles.info}>2</Text>
                      </View>
                    </View>
                  </View>

                  {/* Divider with dashed line and cutouts */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.cutoutLeft} />
                    <View style={styles.dashedLine} />
                    <View style={styles.cutoutRight} />
                  </View>

                  {/* QR Code */}
                  <View style={styles.qrContainer}>
                    <View style={{ width: "50%" }}>
                      <QRCode value={"fasdfsdfsd" || 2121} size={100} />
                    </View>
                    <View
                      style={{
                        width: "50%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text>
                        Ticket <Text style={{ fontWeight: "bold" }}>12</Text> of
                        50 • Participant
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 15,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Image source={logo} style={styles.logo} />
                    <Text
                      style={{
                        fontSize: 10,
                        color: "grey",
                        fontStyle: "italic",
                      }}
                    >
                      Your treasure foreva!
                    </Text>
                  </View>
                </View>
                {/* <CustomButton3 title="Get directions" /> */}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ticket: {
    backgroundColor: "white",
    borderRadius: 20,
    // margin: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    // alignItems: "center",
    width: "100%",
  },
  details: {
    padding: 15,
    // marginBottom: 20,
    // width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
    color: "black",
  },
  desc: {
    fontSize: 14,
    color: "#555",
    // marginVertical: 0,
    // textAlign: "center",
  },
  info: {
    fontSize: 14,
    color: "black",
    marginVertical: 2,
    // textAlign: "center",
    fontWeight: "bold",
  },
  qrContainer: {
    padding: 15,
    flexDirection: "row",
    // backgroundColor:'red'
    // alignItems: "center",
    // justifyContent: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: 20,
    width: "100%",
    justifyContent: "center",
    position: "relative",
  },
  cutoutLeft: {
    width: 20,
    height: 30,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "black",
    position: "absolute",
    left: -10,
    zIndex: 2,
  },
  cutoutRight: {
    width: 20,
    height: 30,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: "black",
    position: "absolute",
    right: -10,
    zIndex: 2,
  },
  dashedLine: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    zIndex: 1,
  },
  logo: {
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
});

export default IV;
