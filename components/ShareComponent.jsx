import React from "react";
import { View, Button, Share, Linking, StyleSheet, TouchableOpacity, Text } from "react-native";

const linkToShare = "https://hotostash.com/";

export default function ShareComponent() {
//   const shareViaWhatsApp = () => {
//     const url = `whatsapp://send?text=${encodeURIComponent(linkToShare)}`;
//     Linking.openURL(url).catch(() => alert("WhatsApp not installed"));
//   };

//   const shareViaFacebook = () => {
//     const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkToShare)}`;
//     Linking.openURL(url).catch(() => alert("Facebook app or browser not available"));
//   };

//   const shareViaTwitter = () => {
//     const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(linkToShare)}`;
//     Linking.openURL(url).catch(() => alert("Twitter app or browser not available"));
//   };

 

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Share via</Text>
      <TouchableOpacity style={styles.button} onPress={shareViaWhatsApp}>
        <Text style={styles.buttonText}>WhatsApp</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={shareViaFacebook}>
        <Text style={styles.buttonText}>Facebook</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={shareViaTwitter}>
        <Text style={styles.buttonText}>Twitter</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.button} onPress={shareViaSystem}>
        <Text style={styles.buttonText}>Other Apps</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  button: {
    padding: 15,
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
