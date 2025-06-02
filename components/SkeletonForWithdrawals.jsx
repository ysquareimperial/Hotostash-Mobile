import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { grey2 } from "./colors"; // Use your actual grey2

const SkeletonForWithdrawals = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    outputRange: [-200, 200],
  });

  const placeholders = new Array(7).fill(null);

  return (
    <View style={styles.container}>
      {placeholders.map((_, index) => (
        <View key={index} style={styles.placeholder}>
          {/* Left 40% */}
          <View style={styles.leftSection}>
            <View style={styles.line}>
              <Animated.View
                style={[
                  styles.shimmerEffect,
                  { transform: [{ translateX: shimmerTranslate }] },
                ]}
              />
            </View>
            <View style={[styles.line, styles.shortLine]}>
              <Animated.View
                style={[
                  styles.shimmerEffect,
                  { transform: [{ translateX: shimmerTranslate }] },
                ]}
              />
            </View>
          </View>

          {/* Spacer (40%) */}
          <View style={styles.spacer} />

          {/* Right 20% */}
          <View style={styles.rightSection}>
            <View style={styles.line}>
              <Animated.View
                style={[
                  styles.shimmerEffect,
                  { transform: [{ translateX: shimmerTranslate }] },
                ]}
              />
            </View>
            <View style={[styles.line, styles.shortLine]}>
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
    backgroundColor: "#000000", // Or grey2
  },
  placeholder: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  leftSection: {
    flex: 0.4,
  },
  spacer: {
    flex: 0.4,
  },
  rightSection: {
    flex: 0.2,
    alignItems: "flex-end", // Ensures the shimmer lines align to the end (right side)
  },
  line: {
    height: 10,
    backgroundColor: grey2,
    borderRadius: 4,
    marginBottom: 5,
    overflow: "hidden",
    width: "100%",
  },
  shortLine: {
    width: "60%",
  },
  shimmerEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000", // Or your shimmer color
    opacity: 0.2,
  },
});

export default SkeletonForWithdrawals;
