import {
  View,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../../helpers/helpers";
import axios from "axios";
import SkeletonForEvents from "../../../components/SkeletonForEvents";
import Ionicons from "@expo/vector-icons/Ionicons";
import SkeletonForParticipants from "../../../components/SkeletonForParticipants";
import { grey1, grey2, orange } from "../../../components/colors";
import ManageParticipant from "./manageParticipant";
import { useUser } from "../../../context/UserContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AddEventParticipants from "./addEventParticipants";
import CustomModal from "../../../components/CustomModal";
import { useRouter } from "expo-router";
import CustomButton2 from "../../../components/CustomButton2";
import GenerateEventLink from "../../../components/GenerateEventLink";

const EventParticipants = ({ eventId, stashId, existingLink }) => {
  const { user } = useUser();
  const [authToken, setAuthToken] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // To track selected user ID
  const [refreshing, setRefreshing] = useState(false);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [error, setError] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [tappedParticipantId, setTappedParticipantId] = useState(null);

  //BOTTOM SHEET PROPS 2
  const [isOpen2, setIsOpen2] = useState(false);
  const snapPoints2 = ["50%"];
  const sheetRef2 = useRef(null);

  const handleSheetChange2 = useCallback((index) => {
    console.log("handleSheetChange", index);
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

  const handleManageParticipant = (userId) => {
    setSelectedUserId(userId); // Set the selected user ID
    handleSnapPress2(0); // Open the bottom sheet for ManageMember
  };

  const handleClosePress2 = useCallback(() => {
    sheetRef2.current?.close();
    // setIsOpen(false); // Hide the bottom sheet
    // setLoading2(false);
    // setForm((prevForm) => ({
    //   ...prevForm,
    //   title: "",
    //   description: "",
    // }));
  }, []);
  //END OF BOTTOM SHEET PROPS

  //BOTTOM SHEET PROPS 3
  const [isOpen3, setIsOpen3] = useState(false);
  const snapPoints3 = ["100%"];
  const sheetRef3 = useRef(null);

  const handleSheetChange3 = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

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

  const handleClosePress3 = useCallback(() => {
    console.log("dddddddddddddd");

    Keyboard.dismiss();
    sheetRef3.current?.close();
    // setIsOpen(false); // Hide the bottom sheet
    // setLoading3(false);
    // setForm((prevForm) => ({
    //   ...prevForm,
    //   title: "",
    //   description: "",
    // }));
  }, []);
  //END OF BOTTOM SHEET PROPS

  // FETCHING TOKEN
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

  //FETCHING EVENT PARTICIPANTS
  const fetchEventParticipants = async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`${api}events/${eventId}/participants`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setEventParticipants(response?.data);
      console.log(response?.data);
      setLoading(false);
      console.log(sentt);
    } catch (err) {
      setError(err.message);
      console.log(err.detail);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEventParticipants();
  }, [authToken]);

  // Handle refresh logic
  const onRefresh = async () => {
    if (!authToken) {
      console.error("Auth token is missing.");
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    try {
      const response = await axios.get(`${api}events/${eventId}/participants`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setEventParticipants(response?.data);
      console.log(response?.data);
      setRefreshing(false);
    } catch (err) {
      setError(err.message);
      console.log(err.detail);
      setRefreshing(false);
    }
  };

  //UPDATE PARTICIPANT ROLE
  const updateParticipantRole = (participantId) => {
    if (!authToken) return;
    setLoading1(true);
    axios
      .put(
        `${api}events/${eventId}/update_participant_role`,
        { event_id: eventId, user_id: participantId, role: "ADMIN" },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setLoading1(false);
        if (response?.status === 200) {
          handleClosePress2();
          onRefresh();
        }
      })
      .catch((err) => {
        setLoading1(false);
        console.log("error fetching data", err);
      });
    // }
  };

  //UPDATE PARTICIPANT ROLE
  const makePhotoUploader = (participantId) => {
    if (!authToken) return;
    setLoading2(true);
    axios
      .put(
        `${api}events/${eventId}/update_participant_role`,
        { event_id: eventId, user_id: participantId, role: "UPLOADER" },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        console.log("uploaderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        setLoading2(false);
        if (response?.status === 200) {
          handleClosePress2();
          onRefresh();
        }
      })
      .catch((err) => {
        setLoading2(false);
        console.log("error fetching data", err);
      });
    // }
  };

  //REMOVE PARTICIPANT
  const removeParticipant = async () => {
    if (!authToken) return;
    setLoading3(true);
    try {
      const response = await axios.delete(
        `${api}events/${eventId}/participants/${tappedParticipantId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response?.status === 204) {
        handleClosePress2();
        // Remove participant locally
        setEventParticipants((prev) => ({
          ...prev,
          participants: prev.participants.filter(
            (participant) => participant.user_id !== tappedParticipantId
          ),
        }));
      }
      setLoading3(false);
    } catch (err) {
      setLoading3(false);
    }
  };

  const router = useRouter();

  const handleLeave = async () => {
    console.log("from left eventttttttttttttt");
    await AsyncStorage.setItem("leftEvent", "true");
    router.back();
  };

  //LEAVE EVENT
  const leaveEvent = () => {
    setLoading4(true);
    console.log("Leaving event", eventId, authToken);

    axios
      .delete(`${api}events/${eventId}/leave`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log(response);
        console.log("from deleteeeee");
        setLoading4(false);
        handleLeave();
      })
      .catch((err) => {
        setLoading4(false);
        console.log("DELETE failed:", err.response?.data || err.message || err);
      });
  };

  return (
    <View
      className="px-4"
      style={{
        marginTop: 10,
        marginBottom: 5,
        height: "100%",
      }}
    >
      {loading ? (
        <View>
          <SkeletonForParticipants />
        </View>
      ) : (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {eventParticipants?.participants?.some(
              (participants) =>
                participants.user.username === user?.username &&
                participants.role === "admin"
            ) ? (
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                <TouchableOpacity onPress={() => handleSnapPress3(0)} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
                  <View
                    style={{
                      backgroundColor: grey1,
                      padding: 10,
                      borderRadius: 50,
                    }}
                  >
                    <AntDesign name="adduser" size={25} color="white" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible2(true)} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
                  <View
                    style={{
                      backgroundColor: grey1,
                      padding: 10,
                      borderRadius: 50,
                    }}
                  >
                    <AntDesign name="link" size={25} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              ""
            )}

            {eventParticipants?.participants?.map((item, index) => (
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
                          backgroundColor: "grey", // Placeholder color
                        }}
                      />
                    )}
                    <Image
                      source={{ uri: item?.user?.image }}
                      style={{
                        borderRadius: 500,
                        width: 45,
                        height: 45,
                      }}
                      onLoadStart={() => setIsImageLoading(true)} // Show placeholder while loading
                      onLoadEnd={() => setIsImageLoading(false)} // Hide placeholder after loading
                    />
                  </View>
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
                      {item?.user.firstname} {item?.user.lastname}
                    </Text>

                    <Text style={{ color: "grey", fontSize: 14 }}>
                      {item?.user.username}
                    </Text>
                  </View>
                </View>
                {/* L O G I C  T O  S H O W  M E M B E R  O P T I O N S */}
                <View style={{ marginLeft: 10, flexDirection: "row" }}>
                  {item?.role === "admin" && (
                    <View
                      style={{
                        backgroundColor: grey1,
                        borderRadius: 10,
                        paddingHorizontal: 5,
                        paddingVertical: 2,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 12 }}>
                        Organizer
                      </Text>
                    </View>
                  )}
                  {item?.role === "uploader" && (
                    <View
                      style={{
                        backgroundColor: orange,
                        borderRadius: 50,
                        padding: 5,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="file-image-plus-outline"
                        size={10}
                        color={"white"}
                      />
                    </View>
                  )}
                  {eventParticipants?.participants?.some(
                    (participant) =>
                      participant.user.username === user?.username &&
                      participant.role === "admin"
                  ) ? (
                    <View>
                      {user?.is_owner ? (
                        // Admin who is also the owner: show ellipsis for other admins (non-owners) and members
                        (item?.role === "admin" && !item?.is_owner) ||
                        item?.role === "member" ? (
                          <Ionicons
                            name="ellipsis-vertical"
                            size={20}
                            color="grey"
                            onPress={() => {
                              handleManageParticipant(item?.user_id);
                              setTappedParticipantId(item?.user_id);
                            }}
                          />
                        ) : null
                      ) : (
                        // Admin but not the owner: show ellipsis only for members
                        (item?.role === "member" ||
                          item?.role === "uploader") &&
                        user?.username !== item?.user?.username && (
                          <Ionicons
                            name="ellipsis-vertical"
                            size={20}
                            color="grey"
                            onPress={() => {
                              handleManageParticipant(item.user_id);
                              setTappedParticipantId(item?.user_id);
                            }}
                          />
                        )
                      )}
                    </View>
                  ) : null}
                </View>
              </View>
            ))}

            <TouchableOpacity onPress={() => setModalVisible(true)} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  // justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    backgroundColor: grey1,
                    padding: 10,
                    borderRadius: 50,
                  }}
                >
                  <AntDesign name="logout" size={25} color="#DC3545" />
                </View>
                <Text style={{ color: "#DC3545" }}>Leave event</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
      <ManageParticipant
        // stashName={title}
        sheetRef={sheetRef2}
        snapPoints={snapPoints2}
        handleSheetChange={handleSheetChange2}
        handleClosePress={handleClosePress2}
        loading1={loading1}
        loading2={loading2}
        loading3={loading3}
        // loading2={loading4}
        isOpen={isOpen2}
        // enablePanDownToClose={loading3 || loading4 ? false : true}
        // handleSubmit={() => makeStashAdmin(selectedUserId)}
        handleSubmit1={() => updateParticipantRole(tappedParticipantId)}
        handleSubmit2={() => makePhotoUploader(tappedParticipantId)}
        handleSubmit3={removeParticipant}
        // handleSubmit2={() => removeStashMember(selectedUserId)}
        handleSnapPress={handleSnapPress2}
      />

      <AddEventParticipants
        sheetRef={sheetRef3}
        snapPoints={snapPoints3}
        handleSheetChange={handleSheetChange3}
        handleClosePress={handleClosePress3}
        isOpen={isOpen3}
        // handleSubmit={inviteStashMembersFunction}
        handleSnapPress={handleSnapPress3}
        stashId={stashId}
        eventId={eventId}
        updateParticipants={(newParticipants) => {
          setEventParticipants((prev) => ({
            ...prev,
            participants: [...(prev?.participants || []), ...newParticipants],
          }));
        }}
      />

      <CustomModal
        modalTitle={"Leave event"}
        modalText={
          "Leaving this event means you won't be able to see participants or have access to the event's photos."
        }
        okText={
          loading4 ? <ActivityIndicator size="small" color="white" /> : "Leave"
        }
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
        loading={loading4}
        handleOkPress={leaveEvent}
        // handleOkPress={() => {
        //   handleClosePress();
        //   setSelectedMembers([]);
        //   setSearchQuery("");
        //   setUsers([]);

        //   setModalVisible(false);
        // }}
        handleCancelPress={() => setModalVisible(false)}
        cancelText={"Cancel"}
        modalVisible={modalVisible} // Pass modalVisible as a prop
        setModalVisible={setModalVisible} // Pass the setter function to update the state
      />

      <GenerateEventLink
        modalTitle={"Share to invite friends via link"}
        modalText={"Anyone with this link will be able to join this event"}
        eventParticipants={eventParticipants}
        user={user}
        existingLink={existingLink}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible2(false);
        }}
        // loading={loading4}
        // handleOkPress={leaveEvent}
        // handleOkPress={() => {
        //   handleClosePress();
        //   setSelectedMembers([]);
        //   setSearchQuery("");
        //   setUsers([]);

        //   setModalVisible2(false);
        // }}
        eventId={eventId}
        handleCancelPress={() => setModalVisible2(false)}
        cancelText={"Close"}
        modalVisible={modalVisible2} // Pass modalVisible as a prop
        setModalVisible2={setModalVisible2} // Pass the setter function to update the state
      ></GenerateEventLink>
    </View>
  );
};

export default EventParticipants;
