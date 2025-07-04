import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { grey1, grey2, grey3 } from "./colors";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
export default function StashPhotosBottomSheet({
  sheetRef,
  snapPoints,
  handleSheetChange,
  handleClosePress,
  handleSubmit,
  isOpen,
  bottomSheetTitle,
  eventId,
  eventName,
}) {
  const [authToken, setAuthToken] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const MAX_SIZE_MB = 10;
  const [loading, setLoading] = useState(false);
  //Fetch token
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
const isDuplicate = (newAsset, selected) =>
  selected.some(
    (img) =>
      img.fileName === newAsset.fileName &&
      img.fileSize === newAsset.fileSize
  );

const selectPhotos = async () => {
  try {
    setLoading(true); // Start loading

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "Permission to access gallery is required!"
      );
      setLoading(false);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const validImages = [];

      for (const asset of result.assets) {
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        const sizeInMB = fileInfo.size / (1024 * 1024);

        // Attach fileSize and fileName manually (for comparison)
        const enrichedAsset = {
          ...asset,
          fileSize: fileInfo.size,
          fileName: asset.fileName || asset.uri.split('/').pop()
        };

        if (sizeInMB > MAX_SIZE_MB) {
          Alert.alert(
            "Large File",
            `${enrichedAsset.fileName} is too large (${sizeInMB.toFixed(
              2
            )} MB). Use less than 10MB.`
          );
        } else if (isDuplicate(enrichedAsset, selectedPhotos)) {
          Alert.alert(
            "Duplicate Image",
            `${enrichedAsset.fileName} has already been selected.`
          );
        } else {
          validImages.push(enrichedAsset);
        }
      }

      setSelectedPhotos((prevImages) => [...prevImages, ...validImages]);
    }

    setLoading(false); // Done
  } catch (err) {
    console.error("Error picking image:", err);
    Alert.alert("Error", "Something went wrong while picking images.");
    setLoading(false);
  }
};


  return (
    <>
      {isOpen && (
        <BottomSheet
          handleIndicatorStyle={{
            backgroundColor: "white",
          }}
          backgroundStyle={{ backgroundColor: "black" }}
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={!loading ? true : false}
          //   onChange={handleSheetChangeInternal}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior={loading ? "none" : "close"} // closes sheet when background is pressed
            />
          )}
        >
          <View style={{ flex: 1, backgroundColor: "black" }}>
            <BottomSheetView className="px-4">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Left-aligned text */}
                {/* <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  //   onPress={() => {
                  //     handleClosePress2();
                  //   }}
                  //   disabled={uploading}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Cancel
                  </Text>
                </TouchableOpacity> */}

                {/* Spacer to center the second text */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginTop: 4,
                      marginBottom: 10,
                    }}
                  >
                    {bottomSheetTitle}
                  </Text>
                </View>
                {/* {uploading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : ( */}
                {/* <TouchableOpacity
                  // onPress={uploadImage}
                  // disabled={uploading}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      //   color: !selectedImage ? grey1 : "white",
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity> */}
                {/* )} */}
              </View>
              <ScrollView contentContainerStyle={{ padding: "" }}>
                {loading ? (
                  <View style={{ marginVertical: 20, alignItems: "center" }}>
                    <ActivityIndicator size="small" color="#grey" />
                  </View>
                ) : (
                  <View style={{ marginBottom: "30" }}>
                    {selectedPhotos.length > 0 && (
                      <View
                        style={{
                          marginTop: 20,

                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "space-between", // or "flex-start"
                          gap: 10,
                        }}
                      >
                        {selectedPhotos.map((image, index) => (
                          <Image
                            key={index}
                            source={{ uri: image.uri }}
                            style={{
                              width: 100,
                              height: 100,
                              marginVertical: 10,
                            }}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                )}
                <View style={{ marginBottom: 50 }}>
                  {selectedPhotos.length > 0 && (
                    <TouchableOpacity
                      onPress={selectPhotos}
                      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        {selectedPhotos.length > 0
                          ? `Add more photos`
                          : `Select photos`}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {!loading && !selectedPhotos.length > 0 && (
                    <TouchableOpacity onPress={selectPhotos}>
                      <View
                        style={{
                          borderWidth: 1, // use borderWidth instead of border
                          borderRadius: 15,
                          borderColor: grey3,
                          padding: 50, // this is fine
                          borderStyle: "dashed", // or 'dotted', or 'solid'
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "white" }}>
                          Tap to select photos
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </BottomSheetView>
          </View>
        </BottomSheet>
      )}
    </>
  );
}
