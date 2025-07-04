import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  Switch,
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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TextInput } from "react-native-gesture-handler";
import ToggleSwitch from "./ToggleSwitch";
import CustomButton from "./CustomButton";
import CustomModal from "./CustomModal";
import { api } from "../helpers/helpers";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import JSZip from "jszip";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Buffer } from "buffer";
import ProgressBarr from "./ProgressBarr";

export default function DownloadAllPhotosBottomSheet({
  sheetRef,
  snapPoints,
  handleSheetChange,
  isOpen,
  eventId,
  eventName,
}) {
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0); // percentage
  const [retryingMessage, setRetryingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loadingSize, setLoadingSize] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [version, setVersion] = useState("optimized"); // default to web size
  const [fileSize, setFileSize] = useState(0);
  const [downloaded, setDownloaded] = useState(false);

  //Mocking internet
  const [forceOffline, setForceOffline] = useState(false);
  const [netInfoState, setNetInfoState] = useState({ isConnected: true });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfoState(state);
    });

    return () => unsubscribe();
  }, []);

  const effectiveIsConnected = forceOffline ? false : netInfoState.isConnected;

  useEffect(() => {
    if (!effectiveIsConnected) {
      setRetryingMessage("No network, retrying...");
    } else {
      setRetryingMessage("");
    }
  }, [effectiveIsConnected]);

  //End of mocking internet

  //Resetting states when sheet is closed
  const handleSheetChangeInternal = useCallback(
    (index) => {
      console.log("Child: BottomSheet index changed to", index);

      // ✅ Your custom logic: reset downloaded state
      if (index === -1) {
        setDownloaded(false); // reset when sheet is closed
      }

      // ✅ Call the parent function
      if (typeof handleSheetChange === "function") {
        handleSheetChange(index);
      }
    },
    [handleSheetChange]
  );

  //Check network
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setRetryingMessage("No network, retrying...");
      } else {
        setRetryingMessage("");
      }
    });

    return () => unsubscribe();
  }, []);

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

  useEffect(() => {
    if (modalVisible) {
      fetchPhotosSize();
    }
  }, [modalVisible]);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(2)} ${sizes[i]}`;
  };

  const fetchPhotosSize = async () => {
    setLoadingSize(true);

    const storageKey = `photos_size_${eventId}_${version}`;

    try {
      const cachedSize = await AsyncStorage.getItem(storageKey);

      if (cachedSize !== null) {
        setFileSize({ total_size: Number(cachedSize) });
        setLoadingSize(false);
        return;
      }

      if (authToken) {
        const response = await axios.get(
          `${api}photos/events/${eventId}/total_size`,
          {
            params: { version },
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const totalSize = response?.data?.total_size;

        if (typeof totalSize === "number") {
          await AsyncStorage.setItem(storageKey, totalSize.toString());
          setFileSize({ total_size: totalSize });
        }
      }
    } catch (err) {
      console.error("Error fetching or storing photo size:", err);
    } finally {
      setLoadingSize(false);
    }
  };

  const downloadAllPhotos = async () => {
    setLoading(true);
    setError("");
    setProgress(0);
    setRetryingMessage("");

    try {
      const response = await axios.get(
        `${api}photos/events/${eventId}/download_links`,
        {
          params: { version },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const imageUrls = response.data;

      if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
        throw new Error("No photos found for download.");
      }

      const zip = new JSZip();
      const fileNameCounts = {};
      let downloadedCount = 0;
      const downloadQueue = [...imageUrls];

      const downloadImageUntilSuccess = async (url) => {
        while (true) {
          try {
            const { data } = await axios.get(url, {
              responseType: "arraybuffer", // ✅ for JSZip
            });
            setRetryingMessage("");
            return data;
          } catch (err) {
            setRetryingMessage("Retrying download...");
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      };

      while (downloadQueue.length > 0) {
        const url = downloadQueue.shift();
        const index = downloadedCount;

        try {
          const imageData = await downloadImageUntilSuccess(url);

          let baseName =
            decodeURIComponent(url.split("?")[0]).split("/").pop() ||
            `image_${index + 1}.jpeg`;
          baseName = baseName.replace(/[^a-zA-Z0-9_\-.]/g, "_");

          if (fileNameCounts[baseName]) {
            fileNameCounts[baseName] += 1;
            const [name, ext] = baseName.split(/\.(?=[^\.]+$)/);
            baseName = `${name}_${fileNameCounts[baseName]}.${ext || "jpeg"}`;
          } else {
            fileNameCounts[baseName] = 1;
          }

          zip.file(baseName, imageData);

          downloadedCount++;
          setProgress(
            Math.min(
              100,
              Math.round((downloadedCount / imageUrls.length) * 100)
            )
          );
        } catch (err) {
          console.error("Unexpected error during download:", err);
        }
      }

      const zipBlob = await zip.generateAsync({ type: "uint8array" });

      const zipFileUri = `${FileSystem.cacheDirectory}${
        eventName || "Hotostash"
      }_Photos.zip`;

      await FileSystem.writeAsStringAsync(
        zipFileUri,
        Buffer.from(zipBlob).toString("base64"),
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(zipFileUri);
      } else {
        throw new Error("Sharing not available on this device.");
      }

      // Optionally remove size info
      await FileSystem.deleteAsync(
        `${FileSystem.cacheDirectory}photos_size_${eventId}_optimized`,
        { idempotent: true }
      ).catch(() => {});
      await FileSystem.deleteAsync(
        `${FileSystem.cacheDirectory}photos_size_${eventId}_original`,
        { idempotent: true }
      ).catch(() => {});

      setDownloaded(true);
    } catch (err) {
      console.error(err);
      setError("Failed to prepare the ZIP file. Please try again.");
    } finally {
      clearPhotoSizeCache();
      setLoading(false);
      setProgress(0);
      setRetryingMessage("");
    }
  };

  const clearPhotoSizeCache = async () => {
    const storageKey = `photos_size_${eventId}_${version}`;
    try {
      await AsyncStorage.removeItem(storageKey);
      console.log(`Cleared cache for: ${storageKey}`);
      // Optional: Reset the state if needed
      setFileSize(null);
    } catch (error) {
      console.error("Error clearing photo size cache:", error);
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
          onChange={handleSheetChangeInternal}
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
              {!loading && !downloaded && (
                <View>
                  <Text style={{ color: "white", marginTop: 20 }}>
                    {eventName}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      marginTop: 20,
                      fontWeight: "bold",
                    }}
                  >
                    Download all photos
                  </Text>
                  <Text style={{ color: "grey", marginTop: 20 }}>
                    Choose download size.
                  </Text>
                  <View
                    style={{
                      paddingBottom: 10,
                      marginTop: 10,
                      // alignItems: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "", color: "white" }}>
                      High resolution
                    </Text>

                    <View style={{ marginTop: 5 }}>
                      <Switch
                        trackColor={{ false: "#ccc", true: "#ff5600" }}
                        thumbColor={"#fff"}
                        ios_backgroundColor="#ccc"
                        onValueChange={() => setVersion("original")}
                        value={version === "original"}
                      />
                    </View>
                  </View>

                  <View style={{ marginTop: 5 }}>
                    <Text style={{ fontWeight: "", color: "white" }}>
                      Web size
                    </Text>

                    <View style={{ marginTop: 5 }}>
                      <Switch
                        trackColor={{ false: "#ccc", true: "#ff5600" }}
                        thumbColor={"#fff"}
                        ios_backgroundColor="#ccc"
                        onValueChange={() => setVersion("optimized")}
                        value={version === "optimized"}
                      />
                    </View>
                  </View>

                  <Text style={{ color: "grey", marginTop: 20 }}>
                    Photos will be downloaded as a ZIP file.
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <CustomButton
                      title={"Start download"}
                      handlePress={() => setModalVisible(true)}
                      isLoading={loading2}
                    />
                  </View>
                </View>
              )}

              {loading && !downloaded && (
                <View>
                  <View style={{ marginTop: 20 }}>
                    <ActivityIndicator size="large" color="grey" />
                  </View>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      marginTop: 20,
                      fontWeight: "bold",
                    }}
                  >
                    Download in progress
                  </Text>
                  <Text style={{ color: "grey", marginTop: 10 }}>
                    Your photos are being prepared and will download
                    automatically.
                  </Text>
                  <View
                    style={{
                      paddingBottom: 10,
                      marginTop: 20,
                      // alignItems: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "", color: "white" }}>
                      Please don't close this page while the download is in
                      progress.
                    </Text>

                    <ProgressBarr progress={progress} />
                  </View>
                </View>
              )}

              {downloaded && (
                <View>
                  <View style={{ marginTop: 20, alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name="checkbox-marked-circle-outline"
                      size={40}
                      color="#3EB489"
                    />
                  </View>
                  <Text style={{ color: "white", marginTop: 20 }}>
                    {eventName}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      marginTop: 20,
                      fontWeight: "bold",
                    }}
                  >
                    Photos downloaded
                  </Text>

                  <Text style={{ color: "grey", marginTop: 10 }}>
                    The ZIP file has been downloaded to your device.
                  </Text>
                </View>
              )}

              {retryingMessage && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 5,
                  }}
                >
                  <MaterialCommunityIcons
                    name="wifi-strength-4-alert"
                    size={20}
                    color="grey"
                  />
                  <Text style={{ color: "grey" }}>No network, retrying...</Text>
                </View>
              )}
              {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: "white" }}>Simulate Offline</Text>
                <Switch value={forceOffline} onValueChange={setForceOffline} />
              </View> */}
              {/* <TouchableOpacity onPress={clearPhotoSizeCache}>
                  <Text style={{ color: "red" }}>Clear Cache</Text>
                </TouchableOpacity> */}
            </BottomSheetView>
          </View>

          <CustomModal
            modalTitle={"Preparing your download"}
            modalText={`Please wait while we calculate the total size of the photos to be downloaded.`}
            okText={
              loading2 ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                `Download`
              )
            }
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(false);
            }}
            loading={loadingSize}
            handleOkPress={() => {
              downloadAllPhotos();
              setModalVisible(false);
            }}
            handleCancelPress={() => setModalVisible(false)}
            cancelText={"Cancel"}
            modalVisible={modalVisible} // Pass modalVisible as a prop
            setModalVisible={setModalVisible} // Pass the setter function to update the state
          >
            <Text style={{ color: "white" }}>
              {loadingSize
                ? "Calculating download size..."
                : fileSize
                ? `Total download size: ${formatBytes(fileSize.total_size)}`
                : ""}
            </Text>
          </CustomModal>
        </BottomSheet>
      )}
    </>
  );
}
