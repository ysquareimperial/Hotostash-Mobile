import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { grey2 } from "./colors";

const SPACING = 8;
const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - SPACING * 5) / 2;

const SkeletonForPhotos = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const placeholders = new Array(10).fill(null).map((_, idx) => ({
    key: idx,
    height: Math.floor(Math.random() * 100) + 150,
  }));

  const leftColumn = placeholders.filter((_, i) => i % 2 === 0);
  const rightColumn = placeholders.filter((_, i) => i % 2 !== 0);

  const renderColumn = (items: { key: number, height: number }[]) =>
    items.map((item) => (
      <View
        key={item.key}
        style={[styles.imagePlaceholder, { height: item.height }]}
      >
        <Animated.View
          style={[
            styles.shimmerOverlay,
            { transform: [{ translateX: shimmerTranslate }] },
          ]}
        />
      </View>
    ));

  return (
    <View style={styles.container}>
      <View style={styles.column}>{renderColumn(leftColumn)}</View>
      <View style={styles.column}>{renderColumn(rightColumn)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACING,
    backgroundColor: "#000",
  },
  column: {
    width: COLUMN_WIDTH,
  },
  imagePlaceholder: {
    backgroundColor: grey2,
    borderRadius: 10,
    marginBottom: SPACING,
    overflow: "hidden",
    position: "relative",
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
    opacity: 0.1,
  },
});

export default SkeletonForPhotos;
