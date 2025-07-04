import React, { useState, useRef } from "react";
import { View, Button, Image, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const CropperScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const webviewRef = useRef();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      base64: true, // ← include this
    });

    if (!result.cancelled) {
      const base64 = result.assets[0].base64;
      const dataUrl = `data:image/jpeg;base64,${base64}`;
      setImageUri(dataUrl); // send to WebView
    }
  };
  const cropperHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Cropper</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background: #000;
          overflow: hidden;
        }
    #image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
}

        button {
          margin-top: 10px;
          padding: 10px 20px;
          font-size: 16px;
        }
      </style>
      <link href="https://unpkg.com/cropperjs/dist/cropper.min.css" rel="stylesheet" />
    </head>
    <body>
      <div style="padding: 10px; background: #111; height: 100vh;">
  <img id="image" />
  <button onclick="crop()">Crop & Send</button>
</div>
      <script src="https://unpkg.com/cropperjs"></script>
      <script>
        let cropper;
      window.addEventListener('message', function(event) {
  const uri = event.data;
  const img = document.getElementById('image');
  img.src = uri; // base64 now
  cropper = new Cropper(img, {
    aspectRatio: 1,
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 1,
  });
});

        function crop() {
          const canvas = cropper.getCroppedCanvas({ width: 512, height: 512 });
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          window.ReactNativeWebView.postMessage(dataUrl);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      {imageUri ? (
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html: cropperHTML }}
          onLoadEnd={() => webviewRef.current.postMessage(imageUri)}
          onMessage={(e) => {
            setCroppedImage(e.nativeEvent.data);
            setImageUri(null);
          }}
        />
      ) : (
        <View style={styles.container}>
          <Button title="Pick and Crop Image" onPress={pickImage} />
          {croppedImage && (
            <Image
              source={{ uri: croppedImage }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                marginTop: 20,
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    alignItems: "center",
  },
});

export default CropperScreen;
