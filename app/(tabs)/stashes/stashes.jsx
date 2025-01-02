import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { api } from "../../../helpers/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { grey2, orange } from "../../../components/colors";
import { format, parseISO } from "date-fns";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomBottomSheet from "../../../components/CustomBottomSheet";
import SkeletonPlaceholder from "../../../components/SkeletonPlaceholder";

import { router, Link } from "expo-router";

const Stashes = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image:
      "https://res.cloudinary.com/dkwy56ghj/image/upload/v1725735308/xm8qfutvpnkhmqltthrd.png",
  });
  const { user } = useUser();
  const [authToken, setAuthToken] = useState(null);
  const [stashes, setStashes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const sheetRef = useRef(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

  // Fetching stashes
  useEffect(() => {
    if (!authToken) return;
    setLoading(true);
    const fetchStashes = async () => {
      try {
        const response = await axios.get(`${api}albums/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setStashes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchStashes();
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
      const response = await axios.get(`${api}albums/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setStashes(response.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [authToken]);

  //B o t t o m s h e e t
  const snapPoints = ["100%"];
  // callbacks
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
    setForm((prevForm) => ({
      ...prevForm,
      title: "",
      description: "",
    }));
  }, []);

  const handleSubmit = () => {
    setLoading2(true);
    axios
      .post(`${api}albums/`, form, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setLoading2(false);
        if (response?.status === 201) {
          setForm((prevForm) => ({
            ...prevForm,
            title: "",
            description: "",
          }));
          router.push(
            `/stashes/viewStash?id=${response?.data?.id}&title=${response?.data?.title}&image=${response?.data?.image}&description=${response?.data?.description}&created_at=${response?.data?.created_at}`
          );
          console.log(response?.data);
          console.log("success");
          setStashes((prevStashes) => [response.data, ...prevStashes]);
          handleClosePress();
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading2(false);
        // setModalVisible2(true);
        console.log(err)?.response?.data?.detail;
        setError(err?.response?.data?.detail);
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Render item for FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push(
          `/stashes/viewStash?id=${item?.id}&title=${item?.title}&image=${item?.image}&description=${item?.description}&created_at=${item?.created_at}`
        )
      } // Navigate with params
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
          source={{ uri: item?.image }}
          style={{ borderRadius: 500, width: 50, height: 50 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            {item.title}
          </Text>
          <Text
            style={{
              color: "grey",
              fontSize: 14,
              // width: 200, // Constrained width for truncation
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.description}
          </Text>
          <Text style={{ color: "grey", fontSize: 14 }}>
            {item?.members.length} Members • Created{" "}
            {item?.created_at
              ? format(parseISO(item.created_at), "MMM, yyyy")
              : "N/A"}
          </Text>
          <View
            className="mt-2"
            style={{ borderTopColor: grey2, borderWidth: 1 }}
          ></View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      // <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      // {/* <ActivityIndicator size="small" color="white" /> */}
      <SkeletonPlaceholder />
      // {/* </SafeAreaView> */}
    );
  }

  // if (error) {
  //   return (
  //     <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
  //       <Text style={{ color: "white" }}>Error: {error}</Text>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ backgroundColor: "#000000", flex: 1 }}
      className="h-full"
    >
      <View
        className="px-4"
        style={{ backgroundColor: "", flex: 1, marginVertical: 10 }}
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
            style={{ fontSize: 30, fontWeight: "900", marginBottom: 10 }}
          >
            Stashes
          </Text>
          <TouchableOpacity
            onPress={() => handleSnapPress(0)}
            style={{ backgroundColor: orange, padding: 5, borderRadius: 50 }}
          >
            <AntDesign name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={stashes} // Data to render
          keyExtractor={(item) => item.id.toString()} // Unique key for each item
          renderItem={renderItem} // Function to render each item
          refreshing={refreshing} // Pull-to-refresh indicator
          onRefresh={onRefresh} // Function to call on pull-to-refresh
          // style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        <CustomBottomSheet
          sheetRef={sheetRef}
          snapPoints={snapPoints}
          handleSheetChange={handleSheetChange}
          handleClosePress={handleClosePress}
          handleSubmit={handleSubmit}
          form={form}
          loading={loading2}
          isOpen={isOpen}
          handleChangeTitle={(text) => setForm({ ...form, title: text })}
          handleChangeDescription={(text) =>
            setForm({ ...form, description: text })
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Stashes;
