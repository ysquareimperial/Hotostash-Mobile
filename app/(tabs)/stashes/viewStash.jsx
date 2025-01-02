import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
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
import defaultProfile from "../../../assets/profile.png";

export default function ViewStash() {
  const { user } = useUser();
  const { id } = useLocalSearchParams();
  const { title } = useLocalSearchParams();
  const { image } = useLocalSearchParams();
  const { description } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const { created_at } = useLocalSearchParams();
  const [stash, setStash] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [showMembers, setShowMembers] = useState(false);

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

  //fetching stash
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
        console.log(response?.data);
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
      console.log("from refreshhh");
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [authToken]);

  const renderItem = ({ item }) => (
    <TouchableOpacity>
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
          {/* <View
            className="mt-2"
            style={{ borderTopColor: grey2, borderWidth: 1 }}
          ></View> */}
        </View>
      </View>
    </TouchableOpacity>
  );

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
      <ScrollView>
        <View
          className="px-4"
          style={{ backgroundColor: "", flex: "", marginVertical: 10 }}
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
            <View style={{ backgroundColor: "red" }}>
              <SkeletonForEvents />
            </View>
          ) : (
            <View style={{ marginTop: 10 }}>
              {/* <FlatList
              data={stash?.events} // Data to render
              keyExtractor={(item) => item.id.toString()} // Unique key for each item
              renderItem={renderItem} // Function to render each item
              refreshing={refreshing} // Pull-to-refresh indicator
              onRefresh={onRefresh} // Function to call on pull-to-refresh
              // style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 10, flexGrow: 0 }}
            /> */}
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
                      {/* <View
            className="mt-2"
            style={{ borderTopColor: grey2, borderWidth: 1 }}
          ></View> */}
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
            }}
            onPress={() => setShowMembers(!showMembers)}
          >
            <Text
              className="text-white"
              style={{ fontSize: 20, fontWeight: "900", marginBottom: "" }}
            >
              Members
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

          {showMembers && (
            <>
              {/* L I S T  O F  M E M B E R S */}
              <TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // justifyContent: "space-between",
                    gap: 10,
                    marginTop: 10,
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
                    <AntDesign name="adduser" size={25} color="white" />
                  </View>
                  <Text style={{ color: "white" }}>Add members</Text>
                </View>
              </TouchableOpacity>
              <View>
                {stash?.members?.map((item, index) => (
                  // <TouchableOpacity key={index}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      marginBottom: 10,
                      alignItems: "center",
                    }}
                    key={index}
                  >
                    <Image
                      source={{
                        uri: item?.user?.image,
                      }}
                      style={{ borderRadius: 500, width: 50, height: 50 }}
                    />
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
                  // </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity>
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
                      backgroundColor: grey1,
                      padding: 10,
                      borderRadius: 50,
                    }}
                  >
                    <AntDesign name="logout" size={25} color="red" />
                  </View>
                  <Text style={{ color: "red" }}>Leave stash</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
