import React, { useState, useEffect } from "react";
// import MasonryList from "react-native-masonry-list";
import ImageViewing from "react-native-image-viewing";
import { Image as RNImage } from "react-native";
import {
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { api } from "../helpers/helpers";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Octicons from "@expo/vector-icons/Octicons";
import { grey1, grey2, grey3, red } from "./colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { PhotoOptions } from "./PhotoOptions";
import SkeletonForPhotos from "./SkeletonForPhotos";
import MasonryWithSelection from "./MasonryWithSelection";
import MasonryList from "@react-native-seoul/masonry-list";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import CustomModal from "./CustomModal";
import GeneratePublicLink from "./GeneratePublicLink";
import { useUser } from "../context/UserContext";
import ShareComponent from "./ShareComponent";
import { usePhotoRefresh } from "./PhotoRefreshContext";


const EventPhotos = ({
  eventId,
  eventParticipants,
  existingLink,
  openDownloadSheet,
  openStashPhotosSheet,
}) => {
  const { user } = useUser();
  const [fetchedImages, setFetchedImages] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesForViewer = fetchedImages.map((item) => ({ uri: item.url }));
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
    const { refreshCount } = usePhotoRefresh();


  //Deleting photos----------------------------------------------------------
  const [loading2, setLoading2] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [deleteAllButton, setDeleteAllButton] = useState(false);

  const togglePhotoSelection = (imageId) => {
    let updatedSelectedPhotos;

    if (selectedPhotos.includes(imageId)) {
      updatedSelectedPhotos = selectedPhotos.filter((id) => id !== imageId);
    } else {
      updatedSelectedPhotos = [...selectedPhotos, imageId];
    }

    setSelectedPhotos(updatedSelectedPhotos);
    setSelectionMode(updatedSelectedPhotos.length > 0);
    console.log("selected");
  };

  const handleSelectAll = () => {
    if (selectedPhotos.length === fetchedImages.length) {
      setSelectedPhotos([]);
      setSelectionMode(false);
    } else {
      setSelectedPhotos(fetchedImages.map((img) => img.id));
      setSelectionMode(true);
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = async () => {
    // Perform delete logic (API call, update state, etc.)
    // Example:
    // await deleteImages(selectedPhotos);

    setSelectedPhotos([]);
    setSelectionMode(false);
    // Refetch or update fetchedImages after deletion
  };
  //Deleting photos----------------------------------------------------------

  const handleImagePress = (id) => {
    const correctIndex = fetchedImages.findIndex((img) => img.id === id);
    if (correctIndex !== -1) {
      setCurrentIndex(correctIndex);
      setTimeout(() => {
        setViewerVisible(true);
      }, 0);
    }
  };

  //Download Image
  const handleDownload = async (url) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
        return;
      }

      const fileName = url.split("/").pop();
      const fileUri = FileSystem.documentDirectory + fileName;

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri
      );
      const { uri } = await downloadResumable.downloadAsync();

      await MediaLibrary.saveToLibraryAsync(uri);

      alert("Photo saved to your gallery!");
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image.");
    }
  };

  //Share Image
  const handleShare = async (url) => {
    try {
      const fileName = url.split("/").pop();
      const fileUri = FileSystem.documentDirectory + fileName;

      // Download the image
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri
      );
      const { uri } = await downloadResumable.downloadAsync();

      // Check if sharing is available on the device
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        alert("Sharing is not available on this device");
        return;
      }

      // Share the downloaded file
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error sharing image:", error);
      alert("Failed to share image.");
    }
  };

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

  //Fetch images
  // const fetchImages = async (isRefreshing = false) => {
  //   if (loading || (!hasMore && !isRefreshing)) return;

  //   if (isRefreshing) {
  //     setPage(1);
  //     setHasMore(true);
  //   }

  //   setLoading(true);
  //   if (firstLoad) {
  //     setLoadingPhotos(true); // Show skeleton only on first load
  //   }

  //   try {
  //     const offset = isRefreshing ? 0 : (page - 1) * 10;
  //     const response = await fetch(
  //       `${api}photos/${eventId}/photos?limit=10&offset=${offset}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     // 👉 Add actual image dimensions to each image object
  //     const imagesWithDimensions = await Promise.all(
  //       data.map(async (img) => {
  //         try {
  //           const dimensions = await new Promise((resolve, reject) => {
  //             RNImage.getSize(
  //               img.url,
  //               (width, height) => resolve({ width, height }),
  //               reject
  //             );
  //           });

  //           return {
  //             ...img,
  //             width: dimensions.width,
  //             height: dimensions.height,
  //           };
  //         } catch (e) {
  //           console.warn(`Failed to get size for image: ${img.url}`);
  //           return {
  //             ...img,
  //             width: 1, // fallback square
  //             height: 1,
  //           };
  //         }
  //       })
  //     );

  //     if (imagesWithDimensions.length > 0) {
  //       setFetchedImages((prev) =>
  //         isRefreshing
  //           ? imagesWithDimensions
  //           : [...prev, ...imagesWithDimensions]
  //       );
  //       setPage((prevPage) => prevPage + 1);
  //     } else {
  //       setHasMore(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching images:", error);
  //   } finally {
  //     setLoading(false);
  //     setLoadingPhotos(false);
  //     if (firstLoad) setFirstLoad(false);
  //     if (isRefreshing) setRefreshing(false);
  //   }
  // };

  const fetchImages = async (isRefreshing = false) => {
    if (loading || (!hasMore && !isRefreshing)) return;

    const nextPage = isRefreshing ? 1 : page;
    const offset = isRefreshing ? 0 : (page - 1) * 10;

    if (isRefreshing) {
      setHasMore(true);
    }

    setLoading(true);
    if (firstLoad) {
      setLoadingPhotos(true);
    }

    try {
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

      const imagesWithDimensions = await Promise.all(
        data.map(async (img) => {
          try {
            const dimensions = await new Promise((resolve, reject) => {
              RNImage.getSize(
                img.url,
                (width, height) => resolve({ width, height }),
                reject
              );
            });

            return {
              ...img,
              width: dimensions.width,
              height: dimensions.height,
            };
          } catch (e) {
            console.warn(`Failed to get size for image: ${img.url}`);
            return {
              ...img,
              width: 1,
              height: 1,
            };
          }
        })
      );

      if (imagesWithDimensions.length > 0) {
        setFetchedImages((prev) =>
          isRefreshing
            ? imagesWithDimensions
            : [...prev, ...imagesWithDimensions]
        );

        setPage((prev) => (isRefreshing ? 2 : prev + 1));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
      setLoadingPhotos(false);
      if (firstLoad) setFirstLoad(false);
      if (isRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      console.log("event id from event photos", eventId);

      fetchImages(true); // Fetch fresh images when authToken is available
    }
  }, [authToken, refreshCount]);

  //Delete photos
  const deletePhotos = () => {
    const idsToDelete = Array.from(selectedPhotos);
    console.log("Photos to delete:", idsToDelete);
    setLoading2(true);
    axios
      .delete(`${api}photos/photos`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: idsToDelete,
      })
      .then((response) => {
        console.log(response);
        if (response?.status === 200) {
          setSelectedPhotos([]);
          setSelectionMode(false);

          setFetchedImages((prevImages) =>
            prevImages.filter((image) => !idsToDelete.includes(image.id))
          );

          setModalVisible(false);
        }
        setLoading2(false);
      })
      .catch((err) => {
        setLoading2(false);
        console.log("error deleting photo", err);
      });
  };

  //Delete all photos
  const deleteAllPhotos = () => {
    setLoading2(true);
    axios
      .delete(`${api}photos/${eventId}/photos`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response?.status === 200) {
          setSelectedPhotos([]);
          setSelectionMode(false);
          setFetchedImages([]);
          setModalVisible(false);
        }
        setLoading2(false);
      })
      .catch((err) => {
        setLoading2(false);
        console.log("error deleting photo", err);
      });
  };

  //Refresh Images
  const handleRefresh = () => {
    setRefreshing(true);
    fetchImages(true);
  };

  return (
    <View className="">
      {!selectionMode ? (
        <View
          className="px-4"
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 8,
          }}
        >
          {/* <MasonryWithSelection /> */}
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
            onPress={openStashPhotosSheet}
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
          {fetchedImages.length !== 0 && (
            <View style={{ flexDirection: "row", columnGap: 5 }}>
              <TouchableOpacity
                onPress={openDownloadSheet}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
                  <Octicons
                    name="download"
                    size={16}
                    style={{ color: "white" }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible2(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
                  <MaterialCommunityIcons
                    name="share"
                    size={16}
                    color="white"
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View className="">
          {selectionMode && (
            <View style={styles.actionBar}>
              <View>
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => {
                    handleSelectAll();
                    setDeleteAllButton(!deleteAllButton);
                  }}
                >
                  <Text style={styles.actionText}>
                    {selectedPhotos.length === fetchedImages.length
                      ? "Deselect All"
                      : "Select All"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => setModalVisible(true)}
                >
                  <AntDesign name="delete" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
      {loadingPhotos ? (
        <View style={{ paddingLeft: "8", paddingRight: "8" }}>
          <SkeletonForPhotos />
        </View>
      ) : (
        <View
          style={{
            height: "100%",
            // flex:1,
            paddingLeft: "12",
            paddingRight: "12",
          }}
        >
          <MasonryList
            data={fetchedImages}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{
              backgroundColor: "black",
              // padding: 2,
              paddingBottom: 250,
            }}
            // style={{marginBottom:200}}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReachedThreshold={0.5}
            onEndReached={() => fetchImages(false)}
            ListFooterComponent={
              loading ? (
                <ActivityIndicator
                  size="small"
                  color="white"
                  style={{ marginTop: 10 }}
                />
              ) : null
            }
            ListEmptyComponent={
              !loading &&
              fetchedImages.length === 0 && (
                <View style={{ marginTop: 20, alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "grey",
                      textAlign: "center",
                      marginHorizontal: 20,
                    }}
                  >
                    No photos have been stashed for this event. Only organizers
                    or uploader can stash photos.
                  </Text>
                </View>
              )
            }
            renderItem={({ item, index }) => {
              const imageId = item.id;
              const isSelected = selectedPhotos.includes(imageId);

              return (
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.9}
                  onPress={() => handleImagePress(item.id)}
                  onLongPress={() => togglePhotoSelection(imageId)}
                  style={{ margin: 2, borderRadius: 10, overflow: "hidden" }}
                >
                  <View>
                    <Image
                      source={{ uri: item.url }}
                      style={{
                        width: "100%", // 🔥 this is crucial
                        aspectRatio: item.width / item.height || 1,
                        borderRadius: 10,
                      }}
                      resizeMethod="cover"
                    />
                    {selectionMode && (
                      <View style={styles.checkboxWrapper}>
                        <TouchableOpacity
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected,
                          ]}
                          onPress={() => togglePhotoSelection(imageId)}
                        >
                          {isSelected && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="white"
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
      {/* Image Viewer */}
      <ImageViewing
        images={imagesForViewer}
        imageIndex={currentIndex}
        visible={isViewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        FooterComponent={({ imageIndex }) => (
          <PhotoOptions
            handleDownload={() =>
              handleDownload(imagesForViewer[imageIndex].uri)
            }
            handleShare={() => handleShare(imagesForViewer[imageIndex].uri)}
          />
        )}
      />

      <CustomModal
        modalTitle={"Delete photos"}
        modalText={
          deleteAllButton
            ? `Are you sure? All photos will be deleted from this event.`
            : `Are you sure? ${selectedPhotos.length} selected photo(s) will be deleted.`
        }
        okText={
          loading2 ? (
            <ActivityIndicator size="small" color="white" />
          ) : deleteAllButton ? (
            `Delete all photos`
          ) : (
            `Delete ${selectedPhotos.length} photo(s)`
          )
        }
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
        loading={loading2}
        handleOkPress={deleteAllButton ? deleteAllPhotos : deletePhotos}
        handleCancelPress={() => setModalVisible(false)}
        cancelText={"Cancel"}
        modalVisible={modalVisible} // Pass modalVisible as a prop
        setModalVisible={setModalVisible} // Pass the setter function to update the state
      />

      <GeneratePublicLink
        modalTitle={"Share photos with a public link"}
        modalText={"Anyone with this link will be able to view these photos"}
        participants={eventParticipants}
        user={user}
        existingLink={existingLink}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible2(false);
        }}
        eventId={eventId}
        handleCancelPress={() => setModalVisible2(false)}
        cancelText={"Close"}
        modalVisible={modalVisible2} // Pass modalVisible as a prop
        setModalVisible2={setModalVisible2} // Pass the setter function to update the state
      ></GeneratePublicLink>
    </View>
  );
};

export default EventPhotos;

const styles = StyleSheet.create({
  checkboxWrapper: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 999,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: grey1,
    borderWidth: 0,
  },
  checkboxInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  actionText: {
    color: "white",
  },
});
