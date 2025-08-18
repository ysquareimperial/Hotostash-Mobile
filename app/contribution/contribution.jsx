import {
  View,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Button,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../helpers/helpers";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import SkeletonForParticipants from "../../components/SkeletonForParticipants";
import { grey1, grey2, orange } from "../../components/colors";
import { useUser } from "../../context/UserContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, router } from "expo-router";
import defaultProfile from "../../assets/profile.png";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import CustomButton2 from "../../components/CustomButton2";
import { SafeAreaView } from "react-native-safe-area-context";
import WithdrawBottomSheet from "../../components/WithdrawBottomSheet";
import CustomButton3 from "../../components/CustomButton3";

const Contribution = ({ eventId }) => {
  const { user } = useUser();
  const [authToken, setAuthToken] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // To track selected user ID
  const [refreshing, setRefreshing] = useState(false);
  const [eventParticipants, setContributors] = useState([]);
  const [fetchingContributors, setFetchingContributors] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [fetchingContDetails, setFetchingContDetails] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [contributorsList, setContributorsList] = useState([]);
  const [contributionDetails, setContributionDetails] = useState({});
  const [contributionStatus, setContributionStatus] = useState(null);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [error, setError] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [tappedParticipantId, setTappedParticipantId] = useState(null);
  const [errors, setErrors] = useState({});
  const [participantId, setParticipantId] = useState(null);
  const { refreshPageA, setRefreshPageA } = useUser();
  const [event, setEvent] = useState(null);

  const [contributionLoading, setContributionLoading] = useState(false);
  const [formData, setFormData] = useState({
    contribution_id: "",
    amount: "",
    account_name: "",
    account_number: "",
    bank_name: "",
  });

  // Fetch AuthToken
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

  // Fetch Event after token is ready
  const fetchEvent = async () => {
    if (!authToken) return; // avoid running with null
    setFetchingEvent(true);
    setContributionLoading(true);
    try {
      const response = await axios.get(`${api}events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setFetchingEvent(false);
      setEvent(response?.data);
      console.log("Event data:", response?.data);
    } catch (err) {
      console.log("Fetch event error:", err);
      setContributionLoading(false);
    } finally {
      setFetchingEvent(false);
    }
  };
  useEffect(() => {
    fetchEvent();
  }, [authToken]);

  // Find the matching participant
  useEffect(() => {
    const matchingParticipant = event?.participants?.find(
      (participant) =>
        participant.user.firstname === user.firstname &&
        participant.user.lastname === user.lastname &&
        participant.user.username === user.username
    );

    // Update the state with the matching participant ID if found
    if (matchingParticipant) {
      setParticipantId(matchingParticipant.id);
    }
  }, [event, user]);

  // Enable contribution
  const enableContributions = () => {
    setLoading2(true);
    axios
      .post(
        `${api}contributions/${event?.id}/contributions/`,
        { event_id: event?.id, total_amount: 0 },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(async (response) => {
        setLoading2(false);
        if (response?.status === 200) {
          setContributionStatus(true);
          await fetchEvent(); // wait for event refresh
          fetchContributionDetails(); // now event.id will exist
        }
      })
      .catch((e) => {
        setLoading2(false);
        // Optional: handle or log error
        console.error("Error enabling contributions:", e);
      });
  };

  const fetchContributors = async () => {
    if (!authToken) return;
    setFetchingContributors(true);
    try {
      const response = await axios.get(
        `${api}contributions/${event?.id}/contributors`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const successfulContributions = response?.data?.filter(
        (item) => item?.payment?.status === "success"
      );
      setContributorsList(successfulContributions);

      setContributors(response?.data);
      console.log("from contribution");
      console.log("vvvvvvvvvvvvv", contributorsList);
      console.log(response?.data);
      setFetchingContributors(false);
      // console.log(response.data);
    } catch (err) {
      setError(err.message);
      console.log("errorrrrrrrrrrrr");
      console.log(err.detail);
      setFetchingContributors(false);
    }
  };

  const fetchContributionDetails = () => {
    if (!authToken) return;

    setFetchingContDetails(true);
    axios
      .get(`${api}contributions/${event?.id}/contribution`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setFetchingContDetails(false);
        setContributionDetails(response?.data);
        setContributionLoading(false);

        setFormData((prevState) => ({
          ...prevState,
          contribution_id: response?.data?.id,
        }));
        console.log("from contribution details", response?.data);
      })
      .catch((err) => {
        setContributionLoading(false);
        console.log("from contribution details", err);
        setFetchingContDetails(false);
        // console.log("error fetching data", err);
      });
  };

  useEffect(() => {
    if (authToken && event?.id) {
      fetchContributionDetails();
      fetchContributors();
    }
  }, [authToken, event?.id]);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      let token = authToken;

      // If authToken is not yet in state, try fetching from AsyncStorage
      if (!token) {
        token = await AsyncStorage.getItem("authToken");
        if (token) {
          console.log("Token retrieved on refresh:", token);
          setAuthToken(token);
        } else {
          console.error("Auth token is missing.");
          setRefreshing(false);
          return;
        }
      }

      // ✅ Call your event fetcher
      await fetchEvent();

      // ✅ Call your contribution details function
      await fetchContributionDetails();

      // ✅ Then call your contributors API
      const response = await axios.get(
        `${api}contributions/${event?.id}/contributors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const successfulContributions = response?.data?.filter(
        (item) => item?.payment?.status === "success"
      );

      setContributorsList(successfulContributions);
      setContributors(response?.data);
      console.log(response?.data);
    } catch (err) {
      setError(err.message);
      console.error(err.detail || err.message);
    } finally {
      setRefreshing(false);
    }
  };

  //Bottom sheet
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["100%"];
  const sheetRef = useRef(null);

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
    if (index === -1) {
      // Sheet has been closed
      Keyboard.dismiss();
      setIsOpen(false); // Close the state
      setFormData({
        contribution_id: "",
        amount: "",
        account_name: "",
        account_number: "",
        bank_name: "",
      });
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
    Keyboard.dismiss();
    sheetRef.current?.close();
    setIsOpen(false); // Hide the bottom sheet
    // setLoading2(false);
    setFormData((prevForm) => ({
      ...prevForm,
      bank_name: "",
      amount: "",
      account_name: "",
      account_number: "",
    }));
  }, []);
  //End of Bottom sheet

  const sendWithdrawalRequest = async () => {
    console.log(formData);
    try {
      setLoading4(true);
      const response = await axios.post(`${api}withdrawals/`, formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setLoading4(false);
      console.log(response?.data);

      if (response.status === 200) {
        const withdrawalId = response.data?.id;
        // await AsyncStorage.setItem("withdrawalRequest", "true");
        handleClosePress();
        router.push(`/contribution/RequestStatus?withdrawalId=${withdrawalId}`);
        console.log("withdrawal id:", withdrawalId);
        setRefreshPageA(true);
        // setShouldRefreshPageA(true);
      }
    } catch (e) {
      setLoading4(false);
      console.log("error from sendrequest:", e);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.account_number) {
      newErrors.account_number = "Account number is required";
    } else if (
      formData.account_number.length < 10 ||
      formData.account_number.length > 15
    ) {
      newErrors.account_number =
        "Account number must be between 10 and 15 digits.";
    } else if (!/^[0-9]*$/.test(formData.account_number)) {
      newErrors.account_number =
        "Account number is invalid. Please use digits only.";
    }

    if (!formData.account_name) {
      newErrors.account_name = "Account name is required";
    } else if (formData.account_name.length < 3) {
      newErrors.account_name = "Account name must be at least 3 characters";
    }

    if (!formData.bank_name) {
      newErrors.bank_name = "Bank name is required";
    } else if (formData.bank_name.length < 3) {
      newErrors.bank_name = "Bank name must be at least 3 characters";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.amount)) {
      newErrors.amount = "Amount must be a valid number";
    } else if (parseFloat(formData.amount) < 500) {
      newErrors.amount = "Amount must be at least 500";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      sendWithdrawalRequest();
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("context flag", refreshPageA);
      if (refreshPageA) {
        console.log("Refreshing Page A...");
        setRefreshPageA(false); // reset flag
        onRefresh();
      }
    }, [refreshPageA])
  );
  return (
    // <SafeAreaView
    //   edges={["left", "right"]}
    //   style={{ backgroundColor: "#000000", flex: 1 }}
    //   className="h-full"
    // >
    <View
      className="px-4"
      style={{
        marginTop: 10,
        marginBottom: 5,
        height: "100%",
      }}
    >
      <View>
        {!refreshing && contributionLoading ? (
          <View>
            <SkeletonForParticipants />
          </View>
        ) : (
          <>
            {event?.contribution_status === false ? (
              <View style={{ marginTop: 30 }}>
                {event?.participants?.some(
                  (participant) =>
                    participant.user.username === user?.username &&
                    participant.role === "admin"
                ) ? (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        alignSelf: "center", // <- this centers it horizontally
                      }}
                    >
                      <CustomButton3
                        handlePress={enableContributions}
                        title={
                          loading2 ? (
                            <ActivityIndicator size="small" color="white" />
                          ) : (
                            "Enable Contribution"
                          )
                        }
                        isLoading={loading2}
                      />
                    </View>
                    <Text
                      style={{
                        color: "grey",
                        textAlign: "center",
                        marginTop: 20,
                        fontSize: 12,
                        marginLeft: 20,
                        marginRight: 20,
                      }}
                    >
                      Enable contributions to allow participants to deposit
                      funds for your event.
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={{
                      color: "grey",
                      textAlign: "center",
                      fontSize: 12,
                      marginLeft: 20,
                      marginRight: 20,
                    }}
                  >
                    Contribution is not enabled for this event, please contact
                    your organizer.
                  </Text>
                )}
              </View>
            ) : (
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: 250,
                  // paddingTop: ,
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 15,
                  }}
                >
                  <Link
                    href={{
                      pathname: "/contribution/contribute",
                      params: {
                        eventName: event?.name,
                        eventId: event?.id,
                        contributionId: contributionDetails?.id,
                        participantId: participantId,
                      },
                    }}
                    push
                    asChild
                  >
                    <TouchableOpacity
                      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    >
                      <View
                        style={{
                          backgroundColor: "#6DCD6D",
                          padding: 10,
                          borderRadius: 50,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {/* <AntDesign name="adduser" size={25} color="white" /> */}
                        <Text style={{ color: "black" }}>Contribute</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>

                  {event?.participants?.some(
                    (participant) =>
                      participant.user.username === user?.username &&
                      participant.role === "admin"
                  ) && (
                    <View>
                      {event?.withdrawal_exists === true ? (
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <TouchableOpacity
                            onPress={() => handleSnapPress(0)}
                            hitSlop={{
                              top: 15,
                              bottom: 15,
                              left: 15,
                              right: 15,
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: grey1,
                                padding: 10,
                                borderRadius: 50,
                              }}
                            >
                              {/* <AntDesign name="link" size={25} color="white" /> */}
                              <Text style={{ color: "white" }}>Withdraw</Text>
                            </View>
                          </TouchableOpacity>
                          <Link
                            href={{
                              pathname: "/contribution/withdrawalRequests",
                              params: {
                                eventId: event?.id,
                              },
                            }}
                            push
                            asChild
                          >
                            <TouchableOpacity
                              hitSlop={{
                                top: 15,
                                bottom: 15,
                                left: 15,
                                right: 15,
                              }}
                              // onPress={() =>
                              //   router.push(
                              //     `/stashes/withdrawalRequests?eventId=${event?.id}`
                              //   )
                              // }
                            >
                              <View
                                style={{
                                  backgroundColor: grey1,
                                  padding: 10,
                                  borderRadius: 50,
                                }}
                              >
                                {/* <AntDesign name="link" size={25} color="white" /> */}
                                <Ionicons
                                  name="ellipsis-horizontal"
                                  size={15}
                                  color="white"
                                />
                              </View>
                            </TouchableOpacity>
                          </Link>
                        </View>
                      ) : (
                        <View>
                          {contributionDetails?.available_balance !== 0 && (
                            <TouchableOpacity
                              hitSlop={{
                                top: 15,
                                bottom: 15,
                                left: 15,
                                right: 15,
                              }}
                              onPress={() => handleSnapPress(0)}
                            >
                              <View
                                style={{
                                  backgroundColor: grey1,
                                  padding: 10,
                                  borderRadius: 50,
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                {/* <AntDesign name="link" size={25} color="white" /> */}
                                <Text style={{ color: "white" }}>Withdraw</Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>
                <Text
                  style={{
                    color: "white",
                    // textAlign: "center",
                    marginBottom: 15,
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                >
                  {contributorsList?.length} Contributors
                </Text>

                {contributorsList?.map((item, index) => {
                  // Parse and format the payment_datetime
                  const parsedDate = parseISO(
                    item?.payment?.payment_datetime,
                    "yyyy-MM-dd'T'HH:mm:ss.SSS",
                    new Date()
                  );
                  const formattedDate = format(
                    parsedDate,
                    "MMMM d, yyyy, h:mm a"
                  );

                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: 10,
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      key={index}
                    >
                      {/* M E M B E R */}
                      {event?.participants?.some(
                        (participant) =>
                          participant.user.username === user?.username &&
                          participant.role === "admin"
                      ) ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            flex: 1,
                          }}
                        >
                          <View
                            style={{
                              position: "relative",
                              width: 45,
                              height: 45,
                            }}
                          >
                            {isImageLoading && (
                              <View
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  borderRadius: 500,
                                  backgroundColor: "grey",
                                }}
                              />
                            )}
                            <Image
                              source={{
                                uri: item?.user?.image || defaultProfile,
                              }}
                              style={{
                                borderRadius: 500,
                                width: 45,
                                height: 45,
                              }}
                              onLoadStart={() => setIsImageLoading(true)}
                              onLoadEnd={() => setIsImageLoading(false)}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{ fontWeight: "bold", color: "white" }}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item?.user.firstname} {item?.user.lastname}
                            </Text>
                            <Text style={{ color: "grey", fontSize: 14 }}>
                              {item?.user.username}
                            </Text>
                          </View>
                        </View>
                      ) : event?.participants?.some(
                          (participant) =>
                            participant.user.username === user?.username &&
                            participant.role !== "admin" &&
                            item?.payment?.anonymity === true
                        ) ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            flex: 1,
                          }}
                        >
                          <View
                            style={{
                              position: "relative",
                              width: 45,
                              height: 45,
                            }}
                          >
                            {isImageLoading && (
                              <View
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  borderRadius: 500,
                                  backgroundColor: "grey",
                                }}
                              />
                            )}
                            <Image
                              source={defaultProfile}
                              style={{
                                borderRadius: 500,
                                width: 45,
                                height: 45,
                              }}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{ fontWeight: "bold", color: "white" }}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              *************
                            </Text>
                            <Text style={{ color: "grey", fontSize: 14 }}>
                              ********
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            flex: 1,
                          }}
                        >
                          <View
                            style={{
                              position: "relative",
                              width: 45,
                              height: 45,
                            }}
                          >
                            {isImageLoading && (
                              <View
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  borderRadius: 500,
                                  backgroundColor: "grey",
                                }}
                              />
                            )}
                            <Image
                              source={{
                                uri: item?.user?.image || defaultProfile,
                              }}
                              style={{
                                borderRadius: 500,
                                width: 45,
                                height: 45,
                              }}
                              onLoadStart={() => setIsImageLoading(true)}
                              onLoadEnd={() => setIsImageLoading(false)}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{ fontWeight: "bold", color: "white" }}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item?.user.firstname} {item?.user.lastname}
                            </Text>
                            <Text style={{ color: "grey", fontSize: 14 }}>
                              {item?.user.username}
                            </Text>
                          </View>
                        </View>
                      )}

                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: grey1,
                            borderRadius: 10,
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                            float: "right",
                            marginBottom: 5,
                          }}
                        >
                          {event?.participants?.some(
                            (participant) =>
                              participant.user.username === user?.username &&
                              participant.role !== "admin" &&
                              item?.payment?.anonymity === true
                          ) ? (
                            <Text style={{ color: "white", fontSize: 12 }}>
                              ₦ ***
                            </Text>
                          ) : (
                            <Text style={{ color: "white", fontSize: 12 }}>
                              ₦ {item.payment?.amount}
                            </Text>
                          )}
                        </View>
                        <Text style={{ color: "grey", fontSize: 10 }}>
                          {formattedDate}
                        </Text>
                      </View>
                    </View>
                  );
                })}
                {contributorsList?.length === 0 && (
                  <View>
                    <Text
                      style={{
                        color: "grey",
                        textAlign: "center",
                        marginTop: 20,
                        fontSize: 12,
                        marginLeft: 20,
                        marginRight: 20,
                      }}
                    >
                      No contributor(s) yet. Be the first to contribute.
                    </Text>
                    {/* <button className="app_btn">Contribute</button> */}
                  </View>
                )}
                <View
                  className="mt-3"
                  style={{ borderTopColor: grey2, borderWidth: 1 }}
                ></View>

                {contributorsList?.length !== 0 && (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 10,
                      }}
                    >
                      <Text style={{ color: "white" }}>Total</Text>
                      {contributionDetails?.total_amount === 0 ? (
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          ₦ 0.00
                        </Text>
                      ) : (
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          ₦ {contributionDetails.total_amount}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 10,
                      }}
                    >
                      <Text style={{ color: "white" }}>Requested</Text>
                      {contributionDetails?.requested_amount === 0 ? (
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          ₦ 0.00
                        </Text>
                      ) : (
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          ₦ {contributionDetails.requested_amount}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 10,
                      }}
                    >
                      <Text style={{ color: "white" }}>Available</Text>
                      {contributionDetails?.available_balance === 0 ? (
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          ₦ 0.00
                        </Text>
                      ) : (
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          ₦ {contributionDetails.available_balance}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      backgroundColor: "#6DCD6D",
                      padding: 10,
                      borderRadius: 50,
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 15,
                    }}
                  >
                    {/* <AntDesign name="adduser" size={25} color="white" /> */}
                    <Text style={{ color: "black" }}>Ask to contribute</Text>
                  </View>
                </View>
              </ScrollView>
            )}
          </>
        )}
      </View>

      <WithdrawBottomSheet
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        handleSheetChange={handleSheetChange}
        handleSubmit={validateForm}
        formData={formData}
        loading={loading4}
        isOpen={isOpen}
        handleChangeAccountName={(text) =>
          setFormData({ ...formData, account_name: text })
        }
        handleChangeAccountNumber={(text) =>
          setFormData({ ...formData, account_number: text })
        }
        handleChangeBankName={(text) =>
          setFormData({ ...formData, bank_name: text })
        }
        handleChangeAmount={(text) =>
          setFormData({ ...formData, amount: text })
        }
        errors={errors}
      />
    </View>
  );
};

export default Contribution;
