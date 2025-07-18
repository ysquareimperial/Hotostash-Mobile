// components/NetworkStatus.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Network from 'expo-network';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkNetwork = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsOnline(networkState.isConnected && networkState.isInternetReachable);
    };

    checkNetwork();

    const interval = setInterval(checkNetwork, 3000); // Check every 3 secs
    return () => clearInterval(interval);
  }, []);

  if (isOnline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>No Internet Connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'red',
    padding: 10,
    position: 'absolute',
    top: 50,
    width: '100%',
    zIndex: 9999,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});

export default NetworkStatus;
