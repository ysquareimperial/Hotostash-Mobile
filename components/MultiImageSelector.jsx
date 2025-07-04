import React, { useState } from 'react';
import { View, Button, Image, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function MultiImageSelector() {
  const [images, setImages] = useState([]);
  const MAX_SIZE_MB = 10;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert('Permission denied', 'We need permission to access your gallery.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(image.uri);
      const sizeMB = fileInfo.size / (1024 * 1024);

      if (sizeMB > MAX_SIZE_MB) {
        return Alert.alert('Large File', 'Use image files less than 10MB.');
      }

      setImages((prev) => [...prev, image]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Button title="Add Image" onPress={pickImage} />
      {images.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text>Selected Images:</Text>
          {images.map((img, index) => (
            <View key={index} style={{ marginVertical: 10 }}>
              <Image source={{ uri: img.uri }} style={{ width: 100, height: 100, borderRadius: 10 }} />
              <TouchableOpacity onPress={() => removeImage(index)}>
                <Text style={{ color: 'red', marginTop: 5 }}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
