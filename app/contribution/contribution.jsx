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
const Contribution = ({ eventId, stashId, event }) => {
  const { user } = useUser();
  const [authToken, setAuthToken] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // To track selected user ID
  const [refreshing, setRefreshing] = useState(false);
  const [eventParticipants, setContributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
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
    console.log(eventId);
    console.log(stashId);

    fetchToken();
  }, []);

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

  // Fetch contribution status
  useEffect(() => {
    const getContributionStatus = async () => {
      try {
        const statusStr = await AsyncStorage.getItem("contributionStatus");
        console.log("33333333333333333333", statusStr);

        if (statusStr !== null) {
          const status = JSON.parse(statusStr); // this gives true/false boolean
          console.log("Contribution status retrieved:", status);
          setContributionStatus(status);
        }

        // Clear it after reading
        await AsyncStorage.removeItem("contributionStatus");
        console.log("Contribution status cleared from AsyncStorage.");
      } catch (error) {
        console.error(
          "Error retrieving or clearing contribution status:",
          error
        );
      }
    };

    getContributionStatus();
  }, []);

  const enableContributions = () => {
    setLoading2(true);
    axios
      .post(
        `${api}contributions/${eventId}/contributions/`,
        { event_id: eventId, total_amount: 0 },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(async (response) => {
        setLoading2(false);
        if (response?.status === 200) {
          fetchContributionDetails();
          setContributionStatus(true);
          try {
            await AsyncStorage.removeItem("contributionStatus");
            console.log("Contribution status cleared from AsyncStorage.");
          } catch (error) {
            console.error(
              "Error clearing contributionStatus from AsyncStorage:",
              error
            );
          }
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
    setLoading(true);
    try {
      const response = await axios.get(
        `${api}contributions/${eventId}/contributors`,
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
      console.log(response?.data);
      setLoading(false);
      // console.log(response.data);
    } catch (err) {
      setError(err.message);
      console.log("errorrrrrrrrrrrr");
      console.log(err.detail);
      setLoading(false);
    }
  };

  const fetchContributionDetails = () => {
    if (!authToken) return;

    setLoading3(true);
    axios
      .get(`${api}contributions/${eventId}/contribution`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setLoading3(false);
        setContributionDetails(response?.data);
        setFormData((prevState) => ({
          ...prevState,
          contribution_id: response?.data?.id,
        }));
        // console.log(response);
      })
      .catch((err) => {
        setLoading3(false);
        // console.log("error fetching data", err);
      });
  };
  useEffect(() => {
    fetchContributors();
    fetchContributionDetails();
  }, [authToken]);

  // Handle refresh logic
  const onRefresh = async () => {
    fetchContributionDetails();
    if (!authToken) {
      console.error("Auth token is missing.");
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    try {
      const response = await axios.get(
        `${api}contributions/${eventId}/contributors`,
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
      console.log(response?.data);
      setRefreshing(false);
    } catch (err) {
      setError(err.message);
      console.log(err.detail);
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
        await AsyncStorage.setItem("withdrawalRequest", "true");
        handleClosePress();
        router.push(`/stashes/RequestStatus?withdrawalId=${withdrawalId}`);
        console.log("withdrawal id:", withdrawalId);
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
      let isActive = true;

      const checkFlag = async () => {
        const flag = await AsyncStorage.getItem("withdrawalRequest");
        console.log("Flag value:", flag);
        if (flag === "true" && isActive) {
          console.log("User requested withdrawal");
          await fetchContributionDetails();
          await AsyncStorage.removeItem("withdrawalRequest");
        }
      };

      checkFlag();

      return () => {
        isActive = false;
      };
    }, [])
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
        {!refreshing && loading ? (
          <View>
            <SkeletonForParticipants />
          </View>
        ) : (
          <>
            {/* {event?.contribution_status === false ? ( */}
            {contributionStatus === false ? (
              <View style={{ marginTop: 30 }}>
                {event?.participants?.some(
                  (participant) =>
                    participant.user.username === user?.username &&
                    participant.role === "admin"
                ) ? (
                  <View>
                    <View
                      style={{
                        // width: "50%",
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
                      // marginTop: 20,
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
                    marginBottom: 10,
                  }}
                >
                  <Link
                    href={{
                      pathname: "/contribution/contribute",
                      params: {
                        eventName: event?.name,
                        eventId: eventId,
                        contributionId: contributionDetails?.id,
                        participantId: participantId
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
                          backgroundColor: "#87FF87",
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
                          <TouchableOpacity
                            hitSlop={{
                              top: 15,
                              bottom: 15,
                              left: 15,
                              right: 15,
                            }}
                            onPress={() =>
                              router.push(
                                `/stashes/withdrawalRequests?eventId=${event?.id}`
                              )
                            }
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
