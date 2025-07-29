import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { grey1, grey2 } from "./colors";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { api } from "../helpers/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../context/UserContext";

export default function EventPhotoBottomSheet({
  sheetRef,
  snapPoints,
  isOpen,
  bottomSheetTitle,
  existingImage,
  eventId,
  onImageUpload,
}) {
  const [authToken, setAuthToken] = useState(null);
  const { saveUser } = useUser(); // Get saveUser from context
  const { user } = useUser();
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  //Fetch token
  const handleSheetChange2 = useCallback((index) => {
    console.log("handleSheetChange", index);
    if (index === -1) {
      console.log("changed");
    }
  }, []);
  const handleClosePress2 = useCallback(() => {
    console.log("dddddddddddddd");
    sheetRef.current?.close();
  }, []);
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

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaLibraryStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraStatus !== "granted" || mediaLibraryStatus !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Sorry, we need camera and media library permissions to make this work!"
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Enables basic cropping UI
        aspect: [1, 1], // Forces a square aspect ratio for the crop
        quality: 1, // High quality
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // You can add further manipulation here if needed, e.g., resizing to a specific smaller square
        // const manipulatedResult = await ImageManipulator.manipulateAsync(
        //   result.assets[0].uri,
        //   [{ resize: { width: 300, height: 300 } }],
        //   { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        // );
        // setSelectedImage(manipulatedResult.uri);
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick an image.");
    }
  };

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take a photo.");
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    setUploading(true);

    const filename = selectedImage.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append("file", {
      uri: selectedImage,
      name: filename,
      type,
    });

    try {
      const response = await axios.post(
        `${api}events/events/${eventId}/upload_image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Upload response:", response.data);

      //   if (response?.status === 200) {
      //     const newImageUrl = response.data?.url;

      //     // if (newImageUrl) {
      //     //   saveUser({
      //     //     ...user,
      //     //     image: newImageUrl,
      //     //   });

      //       console.log("Image updated in context:", newImageUrl);

      //       // Call your function immediately after
      //       handleClosePress2();
      //     // }
      //   }
      if (response?.status === 200) {
        const newImageUrl = response.data?.image_url;

        if (newImageUrl) {
          console.log("Image updated in context:", newImageUrl);

          // ✅ Call the parent callback here
          if (onImageUpload) {
            onImageUpload(newImageUrl);
          }

          handleClosePress2();
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Upload Error", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
  };

  return (
    <>
      {isOpen && (
        <BottomSheet
          handleIndicatorStyle={{
            backgroundColor: "white",
          }}
          backgroundStyle={{ backgroundColor: grey2 }}
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={!uploading ? true : false}
          onChange={handleSheetChange2}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior={uploading ? "none" : "close"} // closes sheet when background is pressed
            />
          )}
        >
          <View style={{ flex: 1, backgroundColor: grey2 }}>
            <BottomSheetView className="px-4">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Left-aligned text */}
                <TouchableOpacity
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                  onPress={() => {
                    handleClosePress2();
                  }}
                  disabled={uploading}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
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
                    }}
                  >
                    {bottomSheetTitle}
                  </Text>
                </View>
                {uploading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <TouchableOpacity
                    onPress={uploadImage}
                    disabled={uploading}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  >
                    <Text
                      style={{
                        color: !selectedImage ? grey1 : "white",
                        fontWeight: "bold",
                      }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* <View style={styles.container}> */}
              {selectedImage || existingImage ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri:
                        selectedImage === null ? existingImage : selectedImage,
                    }}
                    style={styles.profileImage}
                  />
                  <View style={{ flexDirection: "row", columnGap: 5 }}>
                    <TouchableOpacity
                      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                      style={{
                        backgroundColor: grey1,
                        paddingHorizontal: 5,
                        paddingVertical: 5,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        borderRadius: 50,
                        color: "white",
                      }}
                      onPress={pickImage}
                      disabled={uploading}
                    >
                      <View
                        style={{
                          backgroundColor: grey2,
                          borderRadius: 50,
                          paddingHorizontal: 5,
                          paddingVertical: 5,
                          width: 25,
                          height: 25,
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="image-outline"
                          size={16}
                          style={{ color: "white" }}
                        />
                      </View>
                      <Text
                        style={{ color: "white", fontSize: 10, marginRight: 5 }}
                      >
                        Select photo
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={takePhoto}
                      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                      style={{
                        backgroundColor: grey1,
                        paddingHorizontal: 5,
                        paddingVertical: 5,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        borderRadius: 50,
                        color: "white",
                      }}
                      disabled={uploading}
                    >
                      <View
                        style={{
                          backgroundColor: grey2,
                          borderRadius: 50,
                          paddingHorizontal: 5,
                          paddingVertical: 5,
                          width: 25,
                          height: 25,
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="camera-outline"
                          size={16}
                          style={{ color: "white" }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: "row", columnGap: 5 }}></View>
                </View>
              ) : (
                <View style={styles.buttonContainer}>
                  <Button
                    title="Pick an image from gallery"
                    onPress={pickImage}
                  />
                  <Button title="Take a photo" onPress={takePhoto} />
                </View>
              )}
              {/* </View> */}
            </BottomSheetView>
          </View>
        </BottomSheet>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100, // Makes it a circle
    marginBottom: 20,
    backgroundColor: "#eee", // Placeholder background
  },
  buttonContainer: {
    // Add styles for your initial buttons if needed
  },
  activityIndicator: {
    marginTop: 10,
  },
});
