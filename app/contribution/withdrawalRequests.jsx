import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { grey1, grey2 } from "../../components/colors";
import { api } from "../../helpers/helpers";
import { useEffect, useState } from "react";
import { useLocalSearchParams, router, Link } from "expo-router";
import { format, parseISO } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SkeletonForWithdrawals from "../../components/SkeletonForWithdrawals";
export default function WithdrawalRequests() {
  const params = useLocalSearchParams();
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const eventId = params.eventId;
  console.log("Event ID:", eventId);

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

  const fetchWithdrawals = () => {
    if (authToken) {
      setLoading(true);
      axios
        .get(`${api}withdrawals/contribution/${eventId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setLoading(false);
          setWithdrawals(response?.data);
          // console.log(response);
        })
        .catch((err) => {
          setLoading(false);
          // console.log("error fetching data", err);
        });
    }
  };
  useEffect(() => {
    fetchWithdrawals();
  }, [authToken]);
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
            Requests
          </Text>
        </View>
        {loading ? (
          <View style={{ marginTop: 10 }}>
            <SkeletonForWithdrawals />
          </View>
        ) : (
          <View>
            {withdrawals?.map((item, index) => {
              const parsedDate = parseISO(
                item?.created_at,
                "yyyy-MM-dd'T'HH:mm:ss.SSS",
                new Date()
              );
              const formattedDate = format(parsedDate, "MMMM d, yyyy, h:mm a");
              return (
                <View>
                  <Link
                    href={{
                      pathname: "/contribution/RequestStatus",
                      params: {
                        withdrawalId: item?.id,
                      },
                    }}
                    push
                    asChild
                  >
                    <TouchableOpacity
                      // onPress={() =>
                      //   router.push(
                      //     /contribution/RequestStatus?withdrawalId=${item?.id}`
                      //   )
                      // }
                      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                      style={{
                        flexDirection: "row",
                        marginBottom: 10,
                        marginTop: 10,
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                          flex: 1,
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              //   fontSize: 18,
                              fontWeight: "bold",
                              color: "white",
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item.account_name}
                          </Text>

                          <Text style={{ color: "grey", fontSize: 14 }}>
                            {item.account_number}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 12,
                            fontWeight: "bold",
                            marginBottom: 5,
                          }}
                        >
                          ₦{item.amount}
                        </Text>
                        {item?.status === "PENDING" && (
                          <Text
                            style={{
                              color: "white",
                              fontSize: 12,
                              backgroundColor: "#1a1a1a",
                              borderRadius: 10,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                              float: "right",
                              marginBottom: 5,
                            }}
                          >
                            Pending
                          </Text>
                        )}
                        {item?.status === "ADMIN_VERIFIED" && (
                          <Text
                            style={{
                              color: "#ff9a41",
                              fontSize: 12,
                              backgroundColor: "#ff770042",
                              borderRadius: 10,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                              float: "right",
                              marginBottom: 5,
                            }}
                          >
                            Verified
                          </Text>
                        )}
                        {item?.status === "APPROVED" && (
                          <Text
                            style={{
                              color: "#54dca7",
                              fontSize: 12,
                              backgroundColor: "#009c6046",
                              borderRadius: 10,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                              float: "right",
                              marginBottom: 5,
                            }}
                          >
                            Approved
                          </Text>
                        )}
                        {item?.status === "DECLINED" && (
                          <Text
                            style={{
                              color: "#ee6d7a",
                              fontSize: 12,
                              backgroundColor: "#dc354542",
                              borderRadius: 10,
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                              float: "right",
                              marginBottom: 5,
                            }}
                          >
                            Declined
                          </Text>
                        )}
                        <Text style={{ color: "grey", fontSize: 10 }}>
                          {formattedDate}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                  <View
                    style={{ borderTopColor: grey2, borderWidth: 1 }}
                  ></View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
