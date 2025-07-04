import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from "react-native";

const ProfilePictureUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    formData.append("profilePicture", {
      uri: selectedImage,
      name: filename,
      type,
    });

    try {
      // Replace with your actual API endpoint
      const response = await fetch("YOUR_API_ENDPOINT/upload-profile-picture", {
        method: "POST", // Or 'PUT'
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          // 'Authorization': `Bearer ${yourAuthToken}` // If you have authentication
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Profile picture uploaded successfully!");
        setSelectedImage(null); // Clear the selection
      } else {
        Alert.alert(
          "Upload Failed",
          responseData.message || "Something went wrong."
        );
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Network error or server issue. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.profileImage} />
          <Button title="Reselect Image" onPress={pickImage} />
          <Button title="Take New Photo" onPress={takePhoto} />
          <Button
            title="Upload Profile Picture"
            onPress={uploadImage}
            disabled={uploading}
          />
          {uploading && (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              style={styles.activityIndicator}
            />
          )}
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Pick an image from gallery" onPress={pickImage} />
          <Button title="Take a photo" onPress={takePhoto} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
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

export default ProfilePictureUpload;
