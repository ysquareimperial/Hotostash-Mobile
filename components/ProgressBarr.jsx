import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";

export default function ProgressBarr({ progress }) {
  const animatedProgress = new Animated.Value(0); // For smooth transition

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false, // width animation needs layout
    }).start();
  }, [progress]);

  const widthInterpolated = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.progress,
            {
              width: widthInterpolated,
            },
          ]}
        />
      </View>
      <Text style={styles.text}>{progress}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    marginTop:10,
    backgroundColor: "#000",
  },
  track: {
    width: "100%",
    height: 5,
    backgroundColor: "#1a1a1a",
    borderRadius: 5,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#363636",
    borderRadius: 5,
  },
  text: {
    color: "white",
    marginTop: 5,
  },
});
