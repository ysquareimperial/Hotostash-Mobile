import React, { useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import MasonryList from "react-native-masonry-list";
import { Ionicons } from "@expo/vector-icons"; // for checkbox icons

const images = [
  {
    uri: "https://cdn1.hotostash.com/compressed/jordan-whitfield-sm3Ub_IJKQg-unsplash_2025-06-10_at_10.31.19_9cb.jpeg",
  },
  {
    uri: "https://cdn1.hotostash.com/compressed/jordan-whitfield-sm3Ub_IJKQg-unsplash_2025-06-10_at_10.31.19_9cb.jpeg",
  },
  {
    uri: "https://cdn1.hotostash.com/compressed/jordan-whitfield-sm3Ub_IJKQg-unsplash_2025-06-10_at_10.31.19_9cb.jpeg",
  },
  // Add more images here
];

const MasonryWithSelection = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const toggleSelect = (uri) => {
    setSelectedImages((prev) =>
      prev.includes(uri) ? prev.filter((item) => item !== uri) : [...prev, uri]
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedImages.includes(item.uri);

    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.8}
          onPress={() => toggleSelect(item.uri)}
        >
          <View>
            <MasonryList.Image
              source={{ uri: item.uri }}
              style={styles.image}
            />
            <View style={styles.checkboxContainer}>
              <Ionicons
                name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={isSelected ? "#2e7d32" : "#fff"}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MasonryList
        images={images}
        columns={2}
        spacing={4}
        renderIndividualHeader={(item) => renderItem({ item })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    borderRadius: 8,
    width: "100%",
  },
  checkboxContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#00000070",
    borderRadius: 12,
    padding: 2,
  },
});

export default MasonryWithSelection;
