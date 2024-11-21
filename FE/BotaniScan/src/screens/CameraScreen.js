import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'; // Import axios
import AsyncStorage from '@react-native-async-storage/async-storage';  // For storing token

const CameraScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // Function to open the camera
  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled camera picker');
        } else if (response.errorCode) {
          console.log('Camera error: ', response.errorCode);
        } else {
          setImageUri(response.assets[0].uri); // Save the image URI
        }
      }
    );
  };

  // Function to choose an image from storage
  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('Image picker error: ', response.errorCode);
        } else {
          setImageUri(response.assets[0].uri); // Save the image URI
        }
      }
    );
  };

  // Function to process the image with the deep learning model
  const processImage = async () => {
    if (!imageUri) {
      console.log('No image selected');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });
  
    try {
      // Make the POST request to Flask API with the image
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const { species, confidence, rarity } = response.data;
  
      // Update state with prediction result
      setPrediction(response.data);
  
      // Save the result to history
      const token = await AsyncStorage.getItem('authToken'); // Sesuaikan kunci dengan LoginScreen
      if (!token) {
        console.log('User not logged in');
        return;
      }
  
      const historyResponse = await axios.post(
        'http://192.168.7.3:5001/history',
        { species, confidence, rarity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Added to history:', historyResponse.data);
      alert('Prediction saved to history');
    } catch (error) {
      console.log('Error in prediction or saving history: ', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Button title="Open Camera" onPress={openCamera} />
      <Button title="Choose from Gallery" onPress={openGallery} />

      {imageUri && (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Button title="Process Image" onPress={processImage} />
        </>
      )}

      {prediction && (
        <View style={styles.resultContainer}>
          <Text>Species: {prediction.species}</Text>
          <Text>Confidence: {prediction.confidence}</Text>
          <Text>Rarity: {prediction.rarity}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: 20,
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default CameraScreen;
