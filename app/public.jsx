import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  Alert,
  Share,
  RefreshControl,
} from "react-native";
import { grey1, grey2 } from "../components/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../helpers/helpers";
import axios from "axios";
import MasonryList from "@react-native-seoul/masonry-list";
import SkeletonForPhotos from "../components/SkeletonForPhotos";
import { Image as RNImage } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { LinearGradient } from "expo-linear-gradient";
import Octicons from "@expo/vector-icons/Octicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { PhotoOptions } from "../components/PhotoOptions";
import { format, parseISO } from "date-fns";

const { height, width } = Dimensions.get("window");
export default function event() {
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
  const { e, l } = useLocalSearchParams();
  //   const eventSlug = "cggg";
  //   const linkId = "U2YV8dm";

  const [eventImage, setEventImage] = useState(null);
  const [eventDate, setEventDate] = useState(null);

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
        `${api}photos/public/${e}/photos?limit=10&offset=${offset}&link_id=${l}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setEventImage(data?.event_image_url);
      setEventDate(data?.event_date);
      console.log("eventImage:", data?.event_image_url); // log directly from data

      const imagesWithDimensions = await Promise.all(
        data?.photos.map(async (img) => {
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

  //Refresh Images
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchImages(true);
    console.log("clickeddddddddddddddddd");
  };

  useEffect(() => {
    if (authToken) {
      //   console.log("event id from event photos", eventId);

      fetchImages(true); // Fetch fresh images when authToken is available
    }
  }, [authToken]);

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
    console.log("handleDownload called with:", url); // 👈 ADD THIS

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

      Alert.alert("", "Photo saved to your gallery!");
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

  // const shareLink = async () => {
  //   try {
  //     const urlToShare = link?.public_link ? link.public_link : existingLink;

  //     await Share.share({
  //       message: ``,
  //       url: urlToShare,
  //     });
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };
  return (
    <>
      <MasonryList
        data={fetchedImages}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ backgroundColor: "black", paddingBottom: 250 }}
        showsVerticalScrollIndicator={false}
        // refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["white"]} // spinner color
            progressBackgroundColor="black" // background color of pull
          />
        }
        // onRefresh={handleRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={() => fetchImages(false)}
        ListHeaderComponent={
          <View style={{ height: height }}>
            <ImageBackground
              source={{ uri: eventImage }}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.85)", "transparent"]}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
                style={styles.overlay}
              />

              <View style={styles.shareContainer}>
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
                  <Text
                    style={{ color: "white", fontSize: 10, marginRight: 5 }}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.heroContent}>
                <Text style={styles.title}>{e}</Text>
                <Text style={styles.date}>
                  {eventDate
                    ? format(parseISO(eventDate), "dd/MM/yyyy")
                    : "Event date..."}
                </Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>View Photos</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomText}>
                <Text style={styles.powered}>Powered by</Text>
                <TouchableOpacity onPress={() => console.log("Go to stashes")}>
                  <Image
                    source={{
                      uri: "https://hotoprod.s3.af-south-1.amazonaws.com/hoto_logo_light.png",
                    }}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        }
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
                No photos have been stashed for this event. Only organizers or
                uploader can stash photos.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            activeOpacity={0.9}
            onPress={() => handleImagePress(item.id)}
            style={{ margin: 2, borderRadius: 10, overflow: "hidden" }}
          >
            <Image
              source={{ uri: item.url }}
              style={{
                width: "100%",
                aspectRatio: item.width / item.height || 1,
                borderRadius: 10,
              }}
              resizeMethod="cover"
            />
          </TouchableOpacity>
        )}
      />
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
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
  },
  head: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
    marginTop: 20,
    textAlign: "center",
  },
  subhead: {
    color: "grey",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    width,
    height,
    // position: "relative",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  shareContainer: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    // padding: 10,
    // backgroundColor: grey1,
    // borderRadius: 20,
  },
  heroContent: {
    zIndex: 2,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  date: {
    fontSize: 14,
    color: "#fff",
    marginVertical: 12,
    letterSpacing: 2,
  },
  button: {
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bottomText: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
  },
  powered: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 5,
  },
  logo: {
    width: 100,
    height: 30,
  },
});
