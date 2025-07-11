// components/CircularProgressBar.js
import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const CircularProgressBar = ({ progress, radius = 10, stroke = 2 }) => {
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg height={radius * 2} width={radius * 2}>
        <Circle
          stroke="#1a1a1a"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <Circle
          stroke="white"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </Svg>
    </View>
  );
};

export default CircularProgressBar;
