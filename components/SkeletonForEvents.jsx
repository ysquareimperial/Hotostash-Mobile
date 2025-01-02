import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { grey2 } from "./colors";

const { height } = Dimensions.get("window");

const SkeletonForEvents = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Looping shimmer animation
    Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnimation]);

  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200], // Adjust for shimmer's movement width
  });

  const placeholders = new Array(2).fill(null); // Create 8 skeleton placeholders

  return (
    <View style={styles.container}>
      {placeholders.map((_, index) => (
        <View key={index} style={styles.placeholder}>
          {/* Avatar Skeleton */}
          <View style={styles.avatar}>
            <Animated.View
              style={[
                styles.shimmerEffect,
                { transform: [{ translateX: shimmerTranslate }] },
              ]}
            />
          </View>

          {/* Content Skeleton */}
          <View style={styles.content}>
            <View style={[styles.line, styles.shortLine]}>
              <Animated.View
                style={[
                  styles.shimmerEffect,
                  { transform: [{ translateX: shimmerTranslate }] },
                ]}
              />
            </View>
            <View style={styles.line}>
              <Animated.View
                style={[
                  styles.shimmerEffect,
                  { transform: [{ translateX: shimmerTranslate }] },
                ]}
              />
            </View>
            <View style={styles.line}>
              <Animated.View
                style={[
                  styles.shimmerEffect,
                  { transform: [{ translateX: shimmerTranslate }] },
                ]}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flexWrap: "wrap",
    height: height, // Full height of the device
    backgroundColor: "#000000", // grey2
    // paddingHorizontal: 16,
    paddingTop: 16,
  },
  placeholder: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16, // Space between placeholders
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: grey2, // grey1
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 16,
    position: "relative",
  },
  content: {
    flex: 1,
  },
  line: {
    height: 10,
    backgroundColor: grey2, // grey1
    borderRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
    position: "relative",
  },
  shortLine: {
    width: "60%",
  },
  shimmerEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000", // grey3
    opacity: 0.2,
  },
});

export default SkeletonForEvents;
