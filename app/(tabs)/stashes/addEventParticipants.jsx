import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { grey1, grey2, grey3, orange } from "../../../components/colors";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import { api } from "../../../helpers/helpers";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../../context/UserContext";
import CustomModal from "../../../components/CustomModal";
export default function AddEventParticipants({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  isOpen,
  // enablePanDownToClose,
  stashId,
  eventId,
  updateParticipants,
}) {
  const { user } = useUser();
  const [participants, setParticipants] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [album, setAlbum] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [remMsg, setRemMsg] = useState({ albumName: "", memberName: "" });
  const [selectedUserToRemoveId, setSelectedUserToRemoveId] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef();
  const [showMembers, setShowMembers] = useState(false);

  // Fetching token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          // console.log("Token retrieved:", token);
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

  //FETCH STASH MEMBERS
  const fetchStashMembers = () => {
    setIsLoading(true);
    // console.log("clickedddddddddddddddddddd");

    // if (authToken && query.trim() !== "") {
    // Only fetch if query is not empty
    axios
      .get(`${api}albums/${stashId}/members/search`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        // params: {
        //   search: query, // Include the search query as a parameter
        // },
      })
      .then((response) => {
        setIsLoading(false);
        setParticipants(response?.data?.members);
        console.log(response);
      })
      .catch((err) => {
        setIsLoading(false);
        // console.log("error fetching data", err);
        setError(err.response.data?.detail);
      });
    // } else {
    //   setParticipants([]); // Clear the users list if query is empty
    // }
  };

  useEffect(() => {
    if (authToken) {
      fetchStashMembers();
    }
  }, [authToken]);

  // Handle the search input change
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    setSearchTerm(text);
  };

  // Filter users based on the search query
  const filteredUsers =
    searchQuery.trim() === ""
      ? participants // if no search, show all
      : participants?.filter((item) => {
          const fullName = `${item?.user?.firstname ?? ""} ${
            item?.user?.lastname ?? ""
          }`.toLowerCase();
          const username = (item?.user?.username ?? "").toLowerCase();
          const query = searchQuery.toLowerCase();
          return fullName.includes(query) || username.includes(query);
        });

  // Handle the selection or deselection of a member
  const handleSelectMember = (member) => {
    // console.log("presedddd");
    const isSelected = selectedMembers.some(
      (selected) => selected.user.username === member.user.username
    );

    if (isSelected) {
      // Deselect the member
      setSelectedMembers(
        selectedMembers.filter(
          (selected) => selected.user.username !== member.user.username
        )
      );
    } else {
      // Select the member
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  // Convert the array of integers to a comma-separated string (no brackets)
  const membersDataToSubmit = selectedMembers.map((user) => ({
    event_id: eventId,
    user_id: user?.user_id,
  }));

  // ADDING MEMBERS FXN
  const addParticipants = () => {
    console.log(selectedMembers);
    setLoading2(true);
    axios
      .post(
        `${api}events/${eventId}/participants`,
        { participants: membersDataToSubmit },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setLoading2(false);
        console.log("API Response:", response?.data);
        updateParticipants(response?.data?.participants); // << ONLY pass the participants array
        handleClosePress();
        setSelectedMembers([]);
        setSearchQuery("");
      })
      .catch((err) => {
        console.log(err);
        setLoading2(false);
      });
    // }
  };

  return (
    <>
      {isOpen && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={loading2 ? false : true}
          onChange={handleSheetChange}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior={loading2 ? "none" : "close"} // closes sheet when background is pressed
            />
          )}
          handleIndicatorStyle={{
            backgroundColor: "white",
          }}
          backgroundStyle={{ backgroundColor: grey2 }}
        >
          {/* Wrap everything in TouchableWithoutFeedback */}
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={{ flex: 1, backgroundColor: grey2 }}>
              <BottomSheetView className="px-4">
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* Left-aligned text */}
                  <TouchableOpacity
                    onPress={() => {
                      handleClosePress();
                      setSelectedMembers([]);
                      setSearchQuery("");
                    }}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    disabled={loading2}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        // fontSize: 18,
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  {/* Spacer to center the second text */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: 4,
                        // fontSize: 18,
                      }}
                    >
                      Add participants
                    </Text>
                  </View>
                  {loading2 ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <TouchableOpacity
                      onPress={addParticipants}
                      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                      disabled={selectedMembers.length === 0} // Disable the button if length is 0
                      // Optional: Reduce opacity when disabled
                    >
                      <Text
                        style={{
                          color:
                            selectedMembers.length === 0 ? "grey" : "white", // Change color to grey if length is 0
                          fontWeight: "bold",
                          // fontSize: 18,
                        }}
                      >
                        Add
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderColor: grey1,
                    alignItems: "center",
                    width: "100%",
                    marginTop: 20,
                    marginBottom: 5,
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: grey3 }}>
                    <AntDesign name="search1" size={24} color="grey" />
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: "transparent",
                      width: "80%",
                      padding: 14,
                      borderRadius: 5,
                      color: "white",
                    }}
                    maxLength={50}
                    placeholder="Search by username or name"
                    placeholderTextColor="gray" // Ensure placeholder is visible
                    value={searchQuery}
                    onChangeText={(text) => handleSearchChange(text)} // Pass the value properly
                  />
                </View>

                {/* SELECTED MEMBERS */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "",
                      gap: 20,
                      marginTop: 10,
                      marginBottom: selectedMembers.length > 0 ? 30 : 0,

                      // paddingBottom: 5, // Ensure space at the bottom
                    }}
                  >
                    {selectedMembers.map((member, index) => (
                      <TouchableOpacity
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                        key={index}
                        onPress={() => handleSelectMember(member)}
                      >
                        <View style={{ alignItems: "center" }}>
                          <Image
                            source={{ uri: member?.user?.image }}
                            style={{
                              borderRadius: 500,
                              width: 40,
                              height: 40,
                            }}
                          />
                          <Text
                            className="m-0"
                            style={{ fontSize: 10, color: "white" }}
                          >
                            {member?.user?.firstname?.length > 5
                              ? `${member.user.firstname.slice(0, 6)}...`
                              : member.user.firstname}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: grey3,
                            borderRadius: 50,
                            padding: 5,
                            position: "absolute",
                            right: -10,
                            top: -5,
                          }}
                        >
                          <AntDesign name="close" size={10} color="white" />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* END OF SELECTED MEMBERS */}
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="white"
                    style={{ marginTop: 10 }}
                  />
                ) : (
                  <ScrollView
                    style={{ backgroundColor: "" }}
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{
                      paddingBottom: 200,
                      // paddingTop: ,
                    }}
                  >
                    {filteredUsers?.length > 0 ? (
                      filteredUsers.map((item, index) => {
                        const isSelected = selectedMembers.some(
                          (selected) =>
                            selected.username === item?.user?.username
                        );
                        return (
                          <View
                            key={index}
                            className={`mb-2 ${isSelected ? "selected" : ""}`}
                            style={{}}
                          >
                            <TouchableOpacity
                              style={{
                                flexDirection: "row",
                                gap: 10,
                                alignItems: "center",
                              }}
                              onPress={() => {
                                Keyboard.dismiss();
                                handleSelectMember(item);
                              }}
                              hitSlop={{
                                top: 15,
                                bottom: 15,
                                left: 15,
                                right: 15,
                              }}
                            >
                              <View>
                                <Image
                                  source={{ uri: item?.user?.image }}
                                  style={{
                                    borderRadius: 500,
                                    width: 40,
                                    height: 40,
                                  }}
                                />
                              </View>
                              <View>
                                <Text style={{ color: "white" }}>
                                  {item?.user?.firstname} {item?.user?.lastname}
                                </Text>
                                <Text style={{ color: "grey" }}>
                                  {item?.user?.username}
                                </Text>
                              </View>
                              {isSelected && (
                                <Text className="ml-auto text-secondary">
                                  &#10003;
                                </Text> // Checkmark icon for selected items
                              )}
                            </TouchableOpacity>
                          </View>
                        );
                      })
                    ) : (
                      <Text
                        className="text-center"
                        style={{ fontSize: 10, color: "white" }}
                      >
                        No participants found matching your search.
                      </Text>
                    )}
                  </ScrollView>
                )}
                <Text style={{ color: "#DC3545", marginTop: 10 }}>{error}</Text>
              </BottomSheetView>
            </View>
          </TouchableWithoutFeedback>
        </BottomSheet>
      )}
    </>
  );
}
