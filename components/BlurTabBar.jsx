import { BlurView } from 'expo-blur';
import { View, StyleSheet } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

export default function BlurTabBar(props) {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
      <BottomTabBar {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    height: 84,
  },
});
