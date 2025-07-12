import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  Button,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { grey1, grey2, grey3, orange } from "./colors";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { api } from "../helpers/helpers";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import * as ImageManipulator from "expo-image-manipulator";
import { Platform } from "react-native";
import { manipulate } from "expo-image-manipulator";
import * as Sharing from "expo-sharing";
import AntDesign from "@expo/vector-icons/AntDesign";
import CircularProgressBar from "./CircularProgressBar";
import axios from "axios";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

export default function StashPhotosBottomSheet({
  sheetRef,
  snapPoints,
  handleClosePress,
  isOpen,
  bottomSheetTitle,
  eventId,
  eventName,
  overallProgress,
  setOverallProgress 
}) {
  const [authToken, setAuthToken] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  // const [overallProgress, setOverallProgress] = useState(0);
  const MAX_SIZE_MB = 10;
  const [loading, setLoading] = useState(false);
  const [stashing, setStashing] = useState(false);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [compressingProgress, setCompressingProgress] = useState(0);
  const compressionCancelled = useRef(false);
  const abortControllerRef = useRef(null);
  const stashingRef = useRef(false);

  useEffect(() => {
    stashingRef.current = stashing;
  }, [stashing]);

  const handleSheetChange = useCallback(
    (index) => {
      console.log("handleSheetChange", index);
      if (index === -1) {
        if (stashingRef.current) {
          Alert.alert(
            "Cancel stash",
            "Are you sure? These photos will not be stashed.",
            [
              {
                text: "No",
                style: "cancel",
                onPress: () => {
                  console.log("❌ Cancel aborted by user.");
                },
              },
              {
                text: "Yes",
                style: "destructive",
                onPress: () => {
                  cancelStashProcess();
                },
              },
            ],
            { cancelable: true }
          );
        }
        setSelectedPhotos([]);
        setCompressingProgress(0);
      }
    },
    [stashing]
  ); // <-- Add this

  const cancelStashProcess = () => {
    console.log("✅ User confirmed cancellation.");
    setSelectedPhotos([]);
    setCompressingProgress(0);
    compressionCancelled.current = true;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("🚫 Upload aborted");
    }
  };

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
        img.fileName === newAsset.fileName && img.fileSize === newAsset.fileSize
    );

  //Selecting photos
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
            fileName: asset.fileName || asset.uri.split("/").pop(),
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

  //Deselecting photos
  const deselectPhoto = (uri) => {
    setSelectedPhotos((prevPhotos) =>
      prevPhotos.filter((photo) => photo.uri !== uri)
    );
  };

  const formatSize = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

  //Compressing photo
  const compressPhotoRecursively = async (
    uri,
    maxWidth = 1280,
    targetSize = 200 * 1024,
    initialQuality = 0.9
  ) => {
    let quality = initialQuality;
    const minQuality = 0.5;
    let result = null;
    let size = Infinity;

    // ✅ Get original dimensions without creating a new image
    const originalInfo = await ImageManipulator.manipulateAsync(uri, []);
    const originalWidth = originalInfo.width;

    // ✅ Resize only if original is wider than maxWidth
    const resizeWidth = originalWidth > maxWidth ? maxWidth : originalWidth;

    // ✅ Try different compression levels
    for (let i = 0; i < 5 && quality >= minQuality; i++) {
      result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: resizeWidth } }],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      const info = await FileSystem.getInfoAsync(result.uri);
      size = info.size;

      if (size <= targetSize) break;
      quality -= 0.1;
    }

    return {
      ...result,
      sizeKB: (size / 1024).toFixed(1),
    };
  };

  const compressWithLimit = async (photos, limit = 3) => {
    const results = [];
    let index = 0;

    const worker = async () => {
      while (index < photos.length) {
        const currentIndex = index++;
        const photo = photos[currentIndex];
        try {
          const compressed = await compressPhotoRecursively(photo.uri);
          results[currentIndex] = {
            ...compressed,
            originalFileName: photo.fileName,
          };
        } catch (err) {
          results[currentIndex] = {
            ...photo,
            originalFileName: photo.fileName,
          };
        }
      }
    };

    const workers = Array(limit).fill().map(worker);
    await Promise.all(workers);
    return results;
  };

  // Utility: Convert base64 to Blob
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  // Upload file to S3 via presigned URL
  const uploadFile = async (url, uri, mimeType = "image/jpeg", signal) => {
    try {
      const fileResponse = await fetch(uri);
      const blob = await fileResponse.blob();

      const response = await fetch(url, {
        method: "PUT",
        body: blob,
        signal, // 🧠 Pass signal here
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload failed: ${text}`);
      }

      return response;
    } catch (err) {
      if (err.name === "AbortError") {
        console.warn("⚠️ Upload aborted");
      } else {
        console.error("❌ uploadFile error:", err);
      }
      throw err;
    }
  };

  const handleSubmit = async () => {
    console.log("🔁 handleSubmit called");
    setCompressingProgress(0);
    setOverallProgress(0);
    setStashing(true);
    compressionCancelled.current = false;

    abortControllerRef.current = new AbortController(); // ✅ Create new controller
    const signal = abortControllerRef.current.signal;

    try {
      let completed = 0;
      const total = selectedPhotos.length;
      const progressInterval = setInterval(() => {
        completed++;
        setCompressingProgress(Math.min((completed / total) * 100, 100));
      }, 500); // Simulate smooth progress

      const compressedResults = await compressWithLimit(selectedPhotos, 3);
      clearInterval(progressInterval);
      setCompressingProgress(100);

      if (compressionCancelled.current) throw new Error("Process cancelled");

      // ✅ Setup overall progress
      const totalSteps = 1 + selectedPhotos.length * 2 + 1;
      let completedSteps = 0;
      const incrementProgress = () => {
        completedSteps++;
        const percent = Math.round((completedSteps / totalSteps) * 100);
        setOverallProgress(percent);
      };
      // 🔗 Fetch presigned URLs
      console.log("🔗 Fetching presigned upload URLs...");
      const queryString = selectedPhotos
        .map((f) => `filenames=${encodeURIComponent(f.fileName)}`)
        .join("&");

      const { data } = await axios.get(
        `${api}photos/${eventId}/generate_upload_urls?${queryString}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      console.log("✅ Presigned URLs fetched:", data.upload_urls);
      incrementProgress(); // ✅ Step 1 done

      const uploadedInfo = [];

      // ⬆️ Upload files
      for (let i = 0; i < selectedPhotos.length; i++) {
        if (compressionCancelled.current) throw new Error("Upload cancelled");

        const original = selectedPhotos[i];
        const compressed = compressedResults[i];

        const originalFileName =
          original.fileName || original.uri.split("/").pop();

        const presigned = data.upload_urls.find(
          (u) =>
            u.original_name.toLowerCase() === originalFileName.toLowerCase()
        );

        if (!presigned) {
          console.warn(`⚠️ No presigned URL for ${originalFileName}`);
          continue;
        }

        try {
          console.log(`📄 Uploading original: ${originalFileName}`);
          await uploadFile(
            presigned.upload_url,
            original.uri,
            "image/jpeg",
            signal
          );

          console.log(`🗜️ Uploading compressed: ${compressed.uri}`);
          await uploadFile(
            presigned.optimized_upload_url,
            compressed.uri,
            "image/jpeg",
            signal
          );
          incrementProgress(); // ✅ Compressed upload done

          uploadedInfo.push({
            filename: presigned.filename,
            url: presigned.upload_url.split("?")[0],
          });

          console.log(`🟢 Upload complete for ${originalFileName}`);
        } catch (err) {
          console.error(`❌ Upload failed for ${originalFileName}:`, err);
          if (err.name === "AbortError" || compressionCancelled.current) break;
        }
      }

      // Confirm uploaded files
      if (compressionCancelled.current) throw new Error("Confirmation skipped");
      if (uploadedInfo.length > 0) {
        console.log(`✅ Confirming ${uploadedInfo.length} uploaded files...`);
        await axios.post(
          `${api}photos/${eventId}/confirm_upload1`,
          { uploads: uploadedInfo },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        console.log("✅ Upload confirmation complete");
        incrementProgress(); // ✅ Confirm step done

        Alert.alert(
          "Upload complete",
          `${uploadedInfo.length} files uploaded successfully.`
        );
      } else {
        console.warn("⚠️ No files to confirm upload");
        Alert.alert("Upload Failed", "No files were uploaded successfully.");
      }

      setCompressingProgress(100);
    } catch (err) {
      if (
        err.message === "Compression cancelled" ||
        err.message === "Upload cancelled"
      ) {
        console.warn("❗ Upload process was cancelled by user.");
      } else {
        console.error("❌ Upload process failed:", err);
        // Alert.alert("Upload failed", "An error occurred during upload.");
      }
    } finally {
      setStashing(false);
      setOverallProgress(100); // ✅ Ensure it's 100% on finish

      console.log("🏁 handleSubmit process finished");
    }
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
          enablePanDownToClose={!loading ? true : false}
          onChange={handleSheetChange}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior={loading ? "none" : "close"} // closes sheet when background is pressed
            />
          )}
        >
          <View style={{ flex: 1, backgroundColor: grey2 }}>
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
                  <View style={{ marginBottom: "" }}>
                    {selectedPhotos.length > 0 && (
                      <View
                        style={{
                          marginTop: 15,
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          //   alignItems:'center',
                          //   justifyContent: "center", // Center the row of items
                          //   columnGap: 10, // if supported in your setup
                          rowGap: 10,
                        }}
                      >
                        {selectedPhotos.map((image, index) => (
                          <View
                            key={image.uri} // ✅ Add a unique key here
                            style={{
                              position: "relative",
                              width: 110,
                              height: 110,
                              //   marginBottom: 10,
                            }}
                          >
                            <Image
                              source={{ uri: image.uri }}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 10,
                              }}
                            />
                            <TouchableOpacity
                              onPress={() => deselectPhoto(image.uri)}
                              style={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                backgroundColor:
                                  compressingProgress > 0 &&
                                  compressingProgress < 100
                                    ? "rgba(0,0,0,0.3)"
                                    : "rgba(0,0,0,0.6)",
                                borderRadius: 12,
                                width: 24,
                                height: 24,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              disabled={
                                compressingProgress > 0 &&
                                compressingProgress < 100
                              }
                            >
                              <Ionicons name="close" size={16} color="#fff" />
                            </TouchableOpacity>
                          </View>
                        ))}
                        {overallProgress > 0 && (
                          <View style={{ marginVertical: 10 }}>
                            <Text style={{ color: "white", marginBottom: 5 }}>
                              Uploading: {overallProgress}%
                            </Text>
                            <View
                              style={{
                                height: 10,
                                backgroundColor: "#ccc",
                                borderRadius: 5,
                                overflow: "hidden",
                              }}
                            >
                              <View
                                style={{
                                  height: "100%",
                                  width: `${overallProgress}%`,
                                  backgroundColor: "#00ff00", // Green progress
                                }}
                              />
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}
                <View style={{ marginBottom: 50 }}>
                  {selectedPhotos.length > 0 && (
                    <View>
                      {!compressingProgress > 0 && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 20,
                          }}
                        >
                          {!loading && (
                            <View>
                              <TouchableOpacity
                                hitSlop={{
                                  top: 10,
                                  bottom: 10,
                                  left: 10,
                                  right: 10,
                                }}
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
                                onPress={selectPhotos}
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
                                  <AntDesign
                                    name="plus"
                                    size={16}
                                    style={{ color: "white" }}
                                  />
                                </View>
                                <Text
                                  style={{
                                    color: "white",
                                    fontSize: 10,
                                    marginRight: 5,
                                  }}
                                >
                                  Add more photos
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                          <View>
                            <TouchableOpacity
                              hitSlop={{
                                top: 10,
                                bottom: 10,
                                left: 10,
                                right: 10,
                              }}
                              style={{
                                backgroundColor: orange,
                                paddingHorizontal: 5,
                                paddingVertical: 5,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                                borderRadius: 50,
                                color: "white",
                              }}
                              onPress={() => {
                                setTimeout(() => {
                                  handleSubmit();
                                }, 0);
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: grey1,
                                  borderRadius: 50,
                                  paddingHorizontal: 5,
                                  paddingVertical: 5,
                                  width: 25,
                                  height: 25,
                                  alignItems: "center",
                                }}
                              >
                                <SimpleLineIcons
                                  name="cloud-upload"
                                  size={15}
                                  style={{ color: "white" }}
                                />
                              </View>
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: 10,
                                  marginRight: 5,
                                }}
                              >
                                Stash
                              </Text>
                            </TouchableOpacity>
                          </View>
                          {/* <View>
                            <CustomButton
                              title={"Stash"}
                              handlePress={handleSubmit}
                            />
                          </View> */}
                        </View>
                      )}
                    </View>
                  )}

                  {compressingProgress > 0 && compressingProgress < 100 && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <Text style={{ color: "white" }}>
                        Almost there! Preparing your photos...
                      </Text>
                      <CircularProgressBar progress={compressingProgress} />
                    </View>
                  )}

                  {!loading && !selectedPhotos.length > 0 && (
                    <TouchableOpacity onPress={selectPhotos}>
                      <View
                        style={{
                          borderWidth: 1, // use borderWidth instead of border
                          borderRadius: 15,
                          borderColor: grey1,
                          width: "100%",
                          padding: 50, // this is fine
                          borderStyle: "dashed", // or 'dotted', or 'solid'
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >
                        <Text style={{ color: grey3 }}>
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
