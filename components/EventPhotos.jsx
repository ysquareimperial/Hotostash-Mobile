import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  Image,
  Dimensions,
  Text,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Button,
  SafeAreaView,
} from "react-native";
import { api } from "../helpers/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { grey1, grey2, grey3 } from "./colors";
import SelectPhotosSheet from "../app/(tabs)/stashes/selectPhotosSheet";
import { StyleSheet, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const MAX_SELECTION = 10;

const EventPhotos = ({ eventId }) => {
  const [images, setImages] = useState([]);
  const [fetchedImages, setFetchedImages] = useState([]);
  const [pickedImages, setPickedImages] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // New state

  const [imagesToUpload, setImagesToUpload] = useState(null);

  //BOTTOM SHEET PROPS
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["100%"];
  const sheetRef = useRef(null);

  const handleSheetChange = useCallback((index) => {
    setPickedImages([]);

    console.log("handleSheetChange", index);
  }, []);

  const handleSnapPress = useCallback(
    (index) => {
      console.log("clicked");
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
  }, []);
  //END OF BOTTOM SHEET PROPS

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
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
    if (authToken) {
      fetchImages(true); // Fetch fresh images when authToken is available
    }
  }, [authToken]);

  const fetchImages = async (isRefreshing = false) => {
    if (loading || (!hasMore && !isRefreshing)) return;

    if (isRefreshing) {
      setPage(1);
      setHasMore(true);
    }

    setLoading(true);
    try {
      const offset = isRefreshing ? 0 : (page - 1) * 10;
      const response = await fetch(
        `${api}photos/${eventId}/photos?limit=10&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.length > 0) {
        setFetchedImages(isRefreshing ? data : [...fetchedImages, ...data]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchImages(true);
  };

  // Pick images from gallery
  const pickPhotos = async () => {
    const { granted } = await MediaLibrary.requestPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission required to access media library");
      return;
    }

    const result = await MediaLibrary.getAssetsAsync({
      mediaType: "photo",
      first: 50, // Load more if needed
      sortBy: MediaLibrary.SortBy.creationTime,
    });

    const selected = result.assets.slice(0, 10 - pickedImages.length); // Limit to 10

    const resolved = await Promise.all(
      selected.map(async (asset) => {
        const info = await MediaLibrary.getAssetInfoAsync(asset.id);
        return {
          uri: info.localUri || info.uri, // usable uri
          filename: asset.filename,
          id: asset.id,
        };
      })
    );

    setPickedImages((prev) => [...prev, ...resolved]);
  };

  // Upload to API
  const uploadImages = async () => {
    if (pickedImages.length === 0) {
      Alert.alert("No images selected");
      return;
    }

    const formData = new FormData();

    pickedImages.forEach((img, index) => {
      formData.append("images", {
        uri: img.uri,
        name: img.filename || `image${index}.jpg`,
        type: "image/jpeg",
      });
    });

    try {
      const response = await fetch("https://your-api-endpoint.com/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const resJson = await response.json();
      console.log("Upload successful:", resJson);
      Alert.alert("Upload Successful");
    } catch (err) {
      console.error("Upload failed:", err);
      Alert.alert("Upload Failed");
    }
  };

  return (
    <View>
      <View
        className="px-4"
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
          marginBottom: 5,
        }}
      >
        <TouchableOpacity
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
          onPress={() => handleSnapPress(0)}
          // onPress={pickPhotos}
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
            <Octicons name="upload" size={16} style={{ color: "white" }} />
          </View>
          <Text style={{ color: "white", fontSize: 10, marginRight: 5 }}>
            Stash event photos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
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
            <MaterialCommunityIcons name="share" size={16} color="white" />
          </View>
          <Text style={{ color: "white", fontSize: 10, marginRight: 5 }}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        // className="px-4"
        style={{
          height: "100%",
        }}
        data={fetchedImages}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        nestedScrollEnabled
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.url }}
            style={{
              width: Dimensions.get("window").width / 2 - 10,
              height: 200,
              margin: 5,
              borderRadius: 10,
            }}
            onError={(e) =>
              console.error("Failed to load image:", e.nativeEvent.error)
            }
          />
        )}
        onEndReached={() => fetchImages(false)}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="small"
              color="white"
              style={{ marginTop: 10, marginBottom: 10 }}
            />
          ) : null
        }
        ListEmptyComponent={
          <>
            {!loading && (
              <View
                style={{
                  marginTop: 20,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "white",
                    textAlign: "center",
                    marginLeft: 20,
                    marginRight: 20,
                  }}
                >
                  No photos have been stashed for this event. Only organizers or
                  uploader can stash photos.
                </Text>
              </View>
            )}
          </>
        }
        contentContainerStyle={{ paddingBottom: 0, flexGrow: 1 }}
      />

      {/* <Button
        title="Upload Images"
        onPress={uploadImages}
        disabled={images.length === 0}
      /> */}

      <SelectPhotosSheet
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        handleSheetChange={handleSheetChange}
        handleClosePress={handleClosePress}
        loading={loading2}
        isOpen={isOpen}
        children={
          <>
            <View style={styles.container}>
              <Button title="Select Photos" onPress={pickPhotos} />
              <ScrollView horizontal style={styles.scroll}>
                {pickedImages.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img.uri }}
                    style={styles.image}
                  />
                ))}
              </ScrollView>
              <Button title="Send to API" onPress={uploadImages} />
            </View>
          </>
        }
        // selectPhotos={pickPhotos}
        handleSnapPress={handleSnapPress}
      />
    </View>
  );
};

export default EventPhotos;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  scroll: {
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
});
