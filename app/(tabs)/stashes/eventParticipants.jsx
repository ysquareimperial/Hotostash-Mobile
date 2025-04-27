import {
  View,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../../helpers/helpers";
import axios from "axios";
import SkeletonForEvents from "../../../components/SkeletonForEvents";
import Ionicons from "@expo/vector-icons/Ionicons";
import SkeletonForParticipants from "../../../components/SkeletonForParticipants";
import { grey1, grey2 } from "../../../components/colors";
import ManageParticipant from "./manageParticipant";
import { useUser } from "../../../context/UserContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import AddEventParticipants from "./addEventParticipants";

const EventParticipants = ({ id }) => {
  const { user } = useUser();
  const [authToken, setAuthToken] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // To track selected user ID
  const [refreshing, setRefreshing] = useState(false);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  //BOTTOM SHEET PROPS 2
  const [isOpen2, setIsOpen2] = useState(false);
  const snapPoints2 = ["65%"];
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
    setIsOpen(false); // Hide the bottom sheet
    setLoading3(false);
    // setForm((prevForm) => ({
    //   ...prevForm,
    //   title: "",
    //   description: "",
    // }));
  }, []);
  //END OF BOTTOM SHEET PROPS

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

  //f e t c h i n g  p a r t i c i p a n t s
  const fetchEventParticipants = async () => {
    if (!authToken) return;
    setLoading(true);
    const sentt = `${api}events/${id}/participants`;
    try {
      const response = await axios.get(`${api}events/${165}/participants`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("from view eventtttttttttttttttttt");
      setEventParticipants(response?.data);
      console.log(response?.data);
      setLoading(false);
      console.log(sentt);
    } catch (err) {
      console.log("from view eventtttttttttttttttttt");
      setError(err.message);
      console.log(sentt);
      console.log(err.detail);

      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEventParticipants();
  }, [authToken]);

  // Handle refresh logic
  const onRefresh = () => {
    setRefreshing(true);
    fetchEventParticipants().finally(() => setRefreshing(false));
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
                <TouchableOpacity onPress={() => handleSnapPress3(0)}>
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
                <TouchableOpacity>
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
                <View style={{ marginLeft: 10 }}>
                  {item?.role === "admin" && (
                    <View
                      style={{
                        backgroundColor: grey2,
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
                            onPress={() =>
                              handleManageParticipant(item?.user_id)
                            }
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
                            onPress={() =>
                              handleManageParticipant(item.user_id)
                            }
                          />
                        )
                      )}
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}
      <ManageParticipant
        // stashName={title}
        sheetRef={sheetRef2}
        snapPoints={snapPoints2}
        handleSheetChange={handleSheetChange2}
        handleClosePress={handleClosePress2}
        // loading1={loading3}
        // loading2={loading4}
        isOpen={isOpen2}
        // enablePanDownToClose={loading3 || loading4 ? false : true}
        // handleSubmit={() => makeStashAdmin(selectedUserId)}
        // handleSubmit2={() => removeStashMember(selectedUserId)}
        handleSnapPress={handleSnapPress2}
      />

      <AddEventParticipants
        sheetRef={sheetRef3}
        snapPoints={snapPoints3}
        handleSheetChange={handleSheetChange3}
        handleClosePress={handleClosePress3}
        isOpen={isOpen3}
        // enablePanDownToClose={loading5 ? false : true}
        // handleSubmit={inviteStashMembersFunction}
        handleSnapPress={handleSnapPress3}
        // stashId={stash?.id}
      />
    </View>
  );
};

export default EventParticipants;
