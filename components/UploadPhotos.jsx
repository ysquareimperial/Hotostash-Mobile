import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  Text,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function UploadPhotos() {
  const [selectedImages, setSelectedImages] = useState([]);
  const MAX_SIZE_MB = 10;
  const [loading, setLoading] = useState(false);

  const pickImages = async () => {
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

          if (sizeInMB > MAX_SIZE_MB) {
            Alert.alert(
              "Large File",
              `${asset.fileName || "Image"} is too large (${sizeInMB.toFixed(
                2
              )} MB). Use less than 10MB.`
            );
          } else {
            validImages.push(asset);
          }
        }

        setSelectedImages(validImages);
      }

      setLoading(false); // Done
    } catch (err) {
      console.error("Error picking image:", err);
      Alert.alert("Error", "Something went wrong while picking images.");
      setLoading(false); // Ensure we stop loader even on error
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Button title="Select Images" onPress={pickImages} />

      {loading ? (
        <View style={{ marginVertical: 20, alignItems: "center" }}>
          <Text style={{ marginBottom: 10 }}>Loading images...</Text>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <>
          {selectedImages.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text>Selected Images:</Text>
              {selectedImages.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.uri }}
                  style={{ width: 100, height: 100, marginVertical: 10 }}
                />
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}
