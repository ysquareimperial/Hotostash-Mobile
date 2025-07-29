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
export default function InviteStashMembers({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  isOpen,
  // enablePanDownToClose,
  stashId,
}) {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [album, setAlbum] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [remMsg, setRemMsg] = useState({ albumName: "", memberName: "" });
  const [selectedUserToRemoveId, setSelectedUserToRemoveId] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
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
  // Fetch users based on the search query
  const fetchUsers = (query = "") => {
    setIsLoading(true);
    // console.log("clickedddddddddddddddddddd");

    if (authToken && query.trim() !== "") {
      // Only fetch if query is not empty
      axios
        .get(`${api}users/search`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            search: query, // Include the search query as a parameter
          },
        })
        .then((response) => {
          setIsLoading(false);
          setUsers(response?.data);
          // console.log(response);
        })
        .catch((err) => {
          setIsLoading(false);
          // console.log("error fetching data", err);
          setError(err.response.data?.detail);
        });
    } else {
      setUsers([]); // Clear the users list if query is empty
    }
  };

  // Handle the search input change
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    setSearchTerm(text);
    fetchUsers(text); // Fetch users based on the search query
  };

  // Filter users based on the search query
  const filteredUsers = users?.filter((user) => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    const username = user.username.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || username.includes(query);
  });

  // Handle the selection or deselection of a member
  const handleSelectMember = (member) => {
    // console.log("presedddd");

    const isSelected = selectedMembers.some(
      (selected) => selected.username === member.username
    );

    if (isSelected) {
      // Deselect the member
      setSelectedMembers(
        selectedMembers.filter(
          (selected) => selected.username !== member.username
        )
      );
    } else {
      // Select the member
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  // Convert the array of integers to a comma-separated string (no brackets)
  const membersDataToSubmit = selectedMembers.map((user) => ({
    album_id: stashId,
    user_id: user.id,
  }));

  // ADDING MEMBERS FXN
  const inviteStashMembersFunction = () => {
    // console.log("damnnnnnnnn");
    // console.log(membersDataToSubmit);

    setLoading2(true);
    axios
      .post(
        `${api}albums/${stashId}/invite`,
        { members: membersDataToSubmit },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setLoading2(false);
        if (response?.status === 200) {
          setModalVisible(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading2(false);
        // setModalVisible2(true);
        // console.log(err?.response?.data?.detail);
        // setError(err?.response?.data?.detail);
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
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    onPress={() => {
                      handleClosePress();
                      setSelectedMembers([]);
                      setSearchQuery("");
                      setUsers([]);
                    }}
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
                      Invite members
                    </Text>
                  </View>
                  {loading2 ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <TouchableOpacity
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                      onPress={inviteStashMembersFunction}
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
                        Send
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={{ color: "white", marginTop: 20 }}>
                  We'll email the invitation link to their registered email
                  address. Ask them to check their{" "}
                  <Text style={{ fontWeight: "bold", color: orange }}>
                    inbox or spam
                  </Text>{" "}
                  folder.
                </Text>
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
                        // style={{ marginBottom: 10 }}
                        onPress={() => handleSelectMember(member)}
                      >
                        <View style={{ alignItems: "center" }}>
                          <Image
                            source={{ uri: member?.image }}
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
                            {member?.firstname.length > 5
                              ? `${member.firstname.slice(0, 6)}...` // Truncate and add ellipsis
                              : member.firstname}
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
                    contentContainerStyle={{
                      paddingBottom: 200,
                      // paddingTop: ,
                    }}
                  >
                    {searchTerm === "" ? (
                      <Text
                        className="text-center"
                        style={{ fontSize: 10, marginTop: 10, color: "white" }}
                      >
                        Try searching for people by their full name or username.
                      </Text>
                    ) : filteredUsers?.length > 0 ? (
                      filteredUsers.map((item, index) => {
                        const isSelected = selectedMembers.some(
                          (selected) => selected.username === item?.username
                        );
                        return (
                          <View
                            key={index}
                            className={`mb-2 ${isSelected ? "selected" : ""}`}
                            style={{}}
                          >
                            <TouchableOpacity
                            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                              style={{
                                flexDirection: "row",
                                gap: 10,
                                alignItems: "center",
                              }}
                              onPress={() => {
                                Keyboard.dismiss(); // Dismiss the keyboard
                                handleSelectMember(item); // Execute the selection function
                              }}
                            >
                              <View>
                                <Image
                                  source={{ uri: item?.image }}
                                  style={{
                                    borderRadius: 500,
                                    width: 40,
                                    height: 40,
                                  }}
                                />
                              </View>
                              <View>
                                <Text style={{ color: "white" }}>
                                  {item?.firstname} {item?.lastname}
                                </Text>
                                <Text style={{ color: "grey" }}>
                                  {item?.username}
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
                        No users found matching your search.
                      </Text>
                    )}
                  </ScrollView>
                )}
                <Text style={{ color: "#DC3545", marginTop: 10 }}>{error}</Text>
              </BottomSheetView>
            </View>
          </TouchableWithoutFeedback>
          <CustomModal
            modalTitle={"Invitation sent"}
            modalText={
              "Users invited successfully. Invitation links have been sent to their registered emails."
            }
            okText={"OK"}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(false);
            }}
            handleOkPress={() => {
              handleClosePress();
              setSelectedMembers([]);
              setSearchQuery("");
              setUsers([]);
              //   setIsOpen(false);

              setModalVisible(false);
            }}
            modalVisible={modalVisible} // Pass modalVisible as a prop
            setModalVisible={setModalVisible} // Pass the setter function to update the state
          />
        </BottomSheet>
      )}
    </>
  );
}
