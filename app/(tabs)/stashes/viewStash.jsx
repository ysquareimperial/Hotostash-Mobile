import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
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
import SkeletonForEvents from "../../../components/SkeletonForEvents";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useUser } from "../../../context/UserContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import defaultProfile from "../../../assets/profile.png";
import LeaveStash from "./leaveStash";
import ManageMember from "./manageMember";
import InviteStashMembers from "./inviteStashMembers";

export default function ViewStash() {
  const { user } = useUser();
  const { id } = useLocalSearchParams();
  const { title } = useLocalSearchParams();
  const { image } = useLocalSearchParams();
  const { description } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [loading5, setLoading5] = useState(false);
  const { created_at } = useLocalSearchParams();
  const [stash, setStash] = useState({});
  const [stashMembers, setStashMembers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); // To track selected user ID
  const [isImageLoading, setIsImageLoading] = useState(true);

  //BOTTOM SHEET PROPS
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["35%"];
  const sheetRef = useRef(null);

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
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
    sheetRef.current?.close();
    setIsOpen(false); // Hide the bottom sheet
    setLoading2(false);
    // setForm((prevForm) => ({
    //   ...prevForm,
    //   title: "",
    //   description: "",
    // }));
  }, []);
  //END OF BOTTOM SHEET PROPS

  //BOTTOM SHEET PROPS 2
  const [isOpen2, setIsOpen2] = useState(false);
  const snapPoints2 = ["35%"];
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
    [isOpen]
  );

  const handleManageMember = (userId) => {
    setSelectedUserId(userId); // Set the selected user ID
    handleSnapPress2(0); // Open the bottom sheet for ManageMember
  };

  const handleClosePress2 = useCallback(() => {
    sheetRef2.current?.close();
    setIsOpen(false); // Hide the bottom sheet
    setLoading2(false);
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
    [isOpen]
  );

  const handleClosePress3 = useCallback(() => {
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

  //f e t c h i n g  s t a s h
  useEffect(() => {
    if (!authToken) return;
    setLoading(true);
    const fetchStash = async () => {
      try {
        const response = await axios.get(`${api}albums/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setStash(response.data);
        setStashMembers(response?.data?.members);
        console.log(response?.data?.members);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchStash();
  }, [authToken]);

  // Function to handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    if (!authToken) {
      console.error("Auth token is missing.");
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    try {
      const response = await axios.get(`${api}albums/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setStash(response.data);
      setStashMembers(response?.data?.members);
      console.log(response?.data?.members);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  }, [authToken]);

  //LEAVING STASH
  const leaveStash = () => {
    // console.log("delete album clicked");
    setLoading2(true);
    axios
      .delete(`${api}albums/${id}/leave`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setLoading2(false);
        if (response?.status === 200) {
          router.back();
        }
        console.log(response);
      })
      .catch((err) => {
        console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        console.log(err);
        setLoading2(false);
        // setModalVisible2(true);
        console.log(err)?.response?.data?.detail;
        setError(err?.response?.data?.detail);
      });
  };

  const makeStashAdmin = (user_id) => {
    setLoading3(true);
    axios
      .put(
        `${api}albums/${stash?.id}/update_member_role`,
        { album_id: stash?.id, user_id: user_id, role: "ADMIN" },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setLoading3(false);
        if (response?.status === 200) {
          handleClosePress2();
          onRefresh();
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading3(false);
        setError(err?.response?.data?.detail);
      });
  };

  const removeStashMember = (user_id) => {
    // if (accessToken) {
    setLoading4(true);
    axios
      .delete(`${api}albums/${stash?.id}/remove_member/${user_id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setLoading4(false);
        if (response?.status === 200) {
          handleClosePress2();
          onRefresh();
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading4(false);
        setError(err?.response?.data?.detail);
      });
    // }
  };

  const inviteStashMembers = () => {};

  // if (loading) {
  //   return (
  //    <SkeletonForEvents/>
  //   );
  // }

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ backgroundColor: "#000000", flex: "" }}
      className="h-full"
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
              >
                {title}
              </Text>
              <Text
                style={{
                  color: "grey",
                  fontSize: 14,
                  // width: 200, // Constrained width for truncation
                }}
              >
                {description}
              </Text>
              <Text style={{ color: "grey", fontSize: 14, fontWeight: "bold" }}>
                Created{" "}
                {created_at ? format(parseISO(created_at), "MMM, yyyy") : "N/A"}
              </Text>
            </View>
          </View>
          <View
            className=""
            style={{ borderTopColor: grey2, borderWidth: 1 }}
          ></View>

          {/* E V E N T S */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text
              className="text-white"
              style={{ fontSize: 20, fontWeight: "900", marginBottom: "" }}
            >
              Events
            </Text>
            <TouchableOpacity
              // onPress={() => handleSnapPress(0)}
              style={{ backgroundColor: orange, padding: 5, borderRadius: 50 }}
            >
              <AntDesign name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>
          {loading ? (
            <View>
              <SkeletonForEvents />
            </View>
          ) : (
            <View style={{ marginTop: 10 }}>
              {stash?.events?.map((item, index) => (
                <TouchableOpacity key={index}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      marginBottom: 10,
                      backgroundColor: grey2,
                      borderRadius: 10,
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: item?.image }}
                      style={{ borderRadius: 500, width: 50, height: 50 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{ color: "grey", fontSize: 14 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item?.date
                          ? format(parseISO(item.created_at), "MMM, yyyy")
                          : "N/A"}
                        •{item?.location}
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "white",
                          marginTop: 10,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{ color: "grey", fontSize: 14 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item?.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {/* I F  T H E R E  I S  N O  E V E N T S */}
              {stash?.events?.length === 0 ? (
                <View style={{ marginTop: 20, alignItems: "center" }}>
                  <AntDesign name="calendar" size={30} color={grey3} />
                  {stash?.members?.some(
                    (member) =>
                      member.user.username === user?.username &&
                      member.role === "admin"
                  ) ? (
                    <Text style={{ color: grey3 }}>
                      No events found, create event to get started.
                    </Text>
                  ) : (
                    <Text style={{ color: grey3 }}>
                      No events found. Contact your admin to be added to one.
                    </Text>
                  )}
                </View>
              ) : (
                ""
              )}
            </View>
          )}
          {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {/* // M E M B E R S */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 10,
              marginBottom: 10,
            }}
            onPress={() => setShowMembers(!showMembers)}
          >
            <Text
              className="text-white"
              style={{ fontSize: 15, fontWeight: "900", marginBottom: "" }}
            >
              {stash?.members?.length} Stash member(s)
            </Text>
            {showMembers ? (
              <View
                // onPress={() => handleSnapPress(0)}
                style={{ backgroundColor: grey2, padding: 5, borderRadius: 50 }}
              >
                <MaterialIcons
                  name="keyboard-arrow-up"
                  size={20}
                  color="white"
                />
              </View>
            ) : (
              <View
                // onPress={() => handleSnapPress(0)}
                style={{ backgroundColor: grey2, padding: 5, borderRadius: 50 }}
              >
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color="white"
                />
              </View>
            )}
          </TouchableOpacity>

          {/* S H O W  M E M B E R S  O F  M E M B E R S */}
          {showMembers && (
            <>
              {stash?.members?.some(
                (member) =>
                  member.user.username === user?.username &&
                  member.role === "admin"
              ) ? (
                <TouchableOpacity onPress={() => handleSnapPress3(0)}>
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
                        backgroundColor: grey2,
                        padding: 10,
                        borderRadius: 50,
                      }}
                    >
                      <AntDesign name="adduser" size={25} color="white" />
                    </View>
                    <Text style={{ color: "white" }}>Add stash members</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                ""
              )}
              {/* L I S T  O F  M E M B E R S */}
              <View>
                {stashMembers?.map((item, index) => (
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
                            fontSize: 18,
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
                            Admin
                          </Text>
                        </View>
                      )}
                      {stash?.members?.some(
                        (member) =>
                          member.user.username === user?.username &&
                          member.role === "admin"
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
                                  handleManageMember(item?.user_id)
                                }
                              />
                            ) : null
                          ) : (
                            // Admin but not the owner: show ellipsis only for members
                            item?.role === "member" &&
                            user?.username !== item?.user?.username && (
                              <Ionicons
                                name="ellipsis-vertical"
                                size={20}
                                color="grey"
                                onPress={() => handleManageMember(item.user_id)}
                              />
                            )
                          )}
                        </View>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>

              <TouchableOpacity onPress={() => handleSnapPress(0)}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // justifyContent: "space-between",
                    gap: 10,
                    // marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: grey2,
                      padding: 10,
                      borderRadius: 50,
                    }}
                  >
                    <AntDesign name="logout" size={25} color="#DC3545" />
                  </View>
                  <Text style={{ color: "#DC3545" }}>Leave stash</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
      <LeaveStash
        stashName={title}
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        handleSheetChange={handleSheetChange}
        handleClosePress={handleClosePress}
        loading={loading2}
        isOpen={isOpen}
        handleSubmit={leaveStash}
        handleSnapPress={handleSnapPress}
      />
      <ManageMember
        stashName={title}
        sheetRef={sheetRef2}
        snapPoints={snapPoints2}
        handleSheetChange={handleSheetChange2}
        handleClosePress={handleClosePress2}
        loading1={loading3}
        loading2={loading4}
        isOpen={isOpen2}
        enablePanDownToClose={loading3 || loading4 ? false : true}
        handleSubmit={() => makeStashAdmin(selectedUserId)}
        handleSubmit2={() => removeStashMember(selectedUserId)}
        handleSnapPress={handleSnapPress2}
      />
      <InviteStashMembers
        stashName={title}
        sheetRef={sheetRef3}
        snapPoints={snapPoints3}
        handleSheetChange={handleSheetChange3}
        handleClosePress={handleClosePress3}
        loading={loading5}
        isOpen={isOpen3}
        enablePanDownToClose={loading5 ? false : true}
        handleSubmit={inviteStashMembers}
        handleSnapPress={handleSnapPress3}
      />
    </SafeAreaView>
  );
}
