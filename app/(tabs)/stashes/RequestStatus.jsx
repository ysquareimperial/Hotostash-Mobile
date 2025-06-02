import {
  Image,
  Text,
  View,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { grey1, grey2, orange } from "../../../components/colors";
import { api } from "../../../helpers/helpers";
import { useEffect, useState, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { format, parseISO, isValid } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SkeletonForWithdrawals from "../../../components/SkeletonForWithdrawals";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Easing } from "react-native";
import CustomButton from "../../../components/CustomButton";
import { useUser } from "../../../context/UserContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomButton2 from "../../../components/CustomButton2";
import CustomButton3 from "../../../components/CustomButton3";
import {
  StatusBar,
  StatusBar2,
  StatusBar3,
} from "../../../components/StatusBarComponents";

export default function RequestStatus() {
  const { user } = useUser();
  const params = useLocalSearchParams();
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [requestStatus, setRequestStatus] = useState({});
  const withdrawalId = params.withdrawalId;
  console.log("Withdrawal ID:", withdrawalId);

  const rotateAnim = useRef(new Animated.Value(0)).current;
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

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  // Fetching Token
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

  const fetchRequestStatus = () => {
    if (authToken) {
      setLoading(true);
      axios
        .get(`${api}withdrawals/${withdrawalId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setLoading(false);
          setRequestStatus(response?.data);
          // console.log(response);
        })
        .catch((err) => {
          setLoading(false);
          // console.log("error fetching data", err);
        });
    }
  };
  useEffect(() => {
    fetchRequestStatus();
  }, [authToken]);

  const approve = () => {
    setLoading2(true);
    axios
      .post(
        `${api}withdrawals/${withdrawalId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setLoading2(false);
        // console.log(response);
        if (response.status === 200) {
          fetchRequestStatus();
        }
      })
      .catch((err) => {
        setLoading2(false);
        // setError(err?.response?.data?.detail);
        // handleModal();
        console.log("error approving...", err);
      });
  };

  const decline = () => {
    setLoading3(true);
    axios
      .post(
        `${api}withdrawals/${withdrawalId}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setLoading3(false);
        console.log(response);
        if (response.status === 200) {
          fetchRequestStatus();
        }
      })
      .catch((err) => {
        setLoading3(false);
        // setError(err?.response?.data?.detail);
        // handleModal();
        console.log("error declining", err);
      });
  };

  let formattedDate = "";
  if (requestStatus?.created_at) {
    const parsedDate = parseISO(requestStatus.created_at);
    if (isValid(parsedDate)) {
      formattedDate = format(parsedDate, "MMMM d, yyyy, h:mm a");
    }
  }
  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ backgroundColor: "#000000", flex: "" }}
      className="h-full"
    >
      <View
        className="px-4"
        style={{
          backgroundColor: "",
          flex: 1,
          marginVertical: 0,
          marginTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            className="text-white"
            style={{ fontSize: 30, fontWeight: "900" }}
          >
            Request status
          </Text>
        </View>

        {/* <StatusBar />
        <StatusBar2/>
        <StatusBar3/> */}
        {loading ? (
          <View style={{ marginTop: 10 }}>
            <SkeletonForWithdrawals />
          </View>
        ) : (
          <View>
        <View style={{marginTop:10}}>
          {requestStatus?.status === "PENDING" && <StatusBar />}
          {requestStatus?.status === "ADMIN_VERIFIED" && <StatusBar2 />}
          {requestStatus?.status === "APPROVED" && <StatusBar3 />}
        </View>
            <View style={{ marginTop: 10 }}>
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                Account information
              </Text>
              <Text style={{ color: "white", marginTop: 10, color: "grey" }}>
                Account name
              </Text>
              <Text style={{ color: "white" }}>
                {requestStatus.account_name}
              </Text>
              <Text style={{ color: "white", marginTop: 10, color: "grey" }}>
                Account number
              </Text>
              <Text style={{ color: "white" }}>
                {requestStatus.account_number}
              </Text>
              <Text style={{ color: "white", marginTop: 10, color: "grey" }}>
                Bank name
              </Text>
              <Text style={{ color: "white" }}>{requestStatus.bank_name}</Text>
              <View
                style={{ borderTopColor: grey2, borderWidth: 1, marginTop: 20 }}
              ></View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                Request details
              </Text>
              <Text style={{ color: "white", marginTop: 10, color: "grey" }}>
                Amount requested
              </Text>
              <Text style={{ color: "white" }}>₦ {requestStatus.amount}</Text>
              <Text style={{ color: "white", marginTop: 10, color: "grey" }}>
                Requested by
              </Text>
              <Text style={{ color: "white" }}>
                {requestStatus?.requested_by_admin?.firstname}{" "}
                {requestStatus?.requested_by_admin?.lastname}
              </Text>
              <Text style={{ color: "white", marginTop: 10, color: "grey" }}>
                Date requested
              </Text>
              <Text style={{ color: "white" }}>
                {formattedDate || "Unknown Date"}
              </Text>

              <Text style={{ color: "white", marginTop: 10, color: "grey" }}>
                Event
              </Text>
              <Text style={{ color: "white" }}>{requestStatus.event_name}</Text>
              <View
                style={{ borderTopColor: grey2, borderWidth: 1, marginTop: 20 }}
              ></View>
            </View>
            {requestStatus?.status !== "APPROVED" && (
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Approval
                </Text>
                <Text style={{ fontSize: 12, color: orange }}>
                  All organizers must approve the fund request before Hotostash
                  can release the funds.
                </Text>
              </View>
            )}

            {requestStatus?.status === "ADMIN_VERIFIED" ? (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    columnGap: 10,
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(0, 156, 96, 0.273)",
                      borderRadius: 500,
                      width: 30,
                      height: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      // padding:5
                    }}
                  >
                    <AntDesign name="check" size={24} color="rgb(0, 156, 96)" />
                  </View>
                  <Text style={{ color: "white" }}>
                    Approved by all organizers
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    columnGap: 10,
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <View>
                    <Animated.Image
                      source={require("../../../assets/Hotostash_PNG/image.png")}
                      style={[styles.image, animatedStyle]}
                    />
                  </View>
                  <Text style={{ color: "white" }}>
                    Awaiting Hotostash approval
                  </Text>
                </View>
              </View>
            ) : requestStatus?.status === "DECLINED" ? (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    columnGap: 10,
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#390E12",
                      borderRadius: 500,
                      width: 30,
                      height: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      // padding:5
                    }}
                  >
                    <AntDesign name="close" size={22} color="#DC3545" />
                  </View>
                  <Text style={{ color: "white" }}>Declined</Text>
                </View>
              </View>
            ) : requestStatus?.status === "DECLINED" ? (
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 10,
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <View>
                  <Image
                    source={require("../../../assets/Hotostash_PNG/image.png")}
                    style={[styles.image]}
                  />
                </View>
                <Text style={{ color: "white" }}>Approved</Text>
              </View>
            ) : requestStatus?.approved_by_admins?.includes(user?.id) ? (
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 10,
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#421F00",
                    borderRadius: 500,
                    width: 30,
                    height: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    // padding:5
                  }}
                >
                  <MaterialCommunityIcons
                    name="timer-sand"
                    size={22}
                    color="#FF7700"
                  />
                </View>
                <Text style={{ color: "white" }}>
                  Waiting for organizers approval
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", columnGap: 10 }}>
                <CustomButton
                  title={
                    loading2 ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      "Approve"
                    )
                  }
                  handlePress={approve}
                  isLoading={loading2}
                />
                <CustomButton3
                  title={
                    loading3 ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      "Decline"
                    )
                  }
                  handlePress={decline}
                  isLoading={loading3}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 25,
    height: 25,
  },
});
