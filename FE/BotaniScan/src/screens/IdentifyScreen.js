import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator, ToastAndroid } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/NavBar'; // Import the NavBar component

const IdentifyScreen = ({ route }) => {
  const [imageUri, setImageUri] = useState(route.params?.imageUri || null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const SERVER_URL = process.env.SERVER_URL || 'http://127.0.0.1:5000';
  const HISTORY_URL = process.env.HISTORY_URL || 'http://192.168.7.2:5001';

  useEffect(() => {
    if (imageUri) {
      processImage();
    }
  }, [imageUri]);

  const processImage = async () => {
    if (!imageUri) {
      ToastAndroid.show('No image selected.', ToastAndroid.SHORT);
      return;
    }
  
    setLoading(true); // Start loading
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });
  
    try {
      const response = await axios.post(`${SERVER_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const { species, confidence, rarity } = response.data;
      setPrediction(response.data);
  
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        ToastAndroid.show('Please log in to save predictions.', ToastAndroid.SHORT);
        return;
      }
  
      // Add species to history (always save history)
      await axios.post(
        `${HISTORY_URL}/history`,
        { species, confidence, rarity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      ToastAndroid.show('Prediction saved to history.', ToastAndroid.SHORT);
  
      // Check if species already exists in the collection
      const collectionResponse = await axios.get(`${HISTORY_URL}/collection`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const isSpeciesExists = collectionResponse.data.some(
        plant => plant.species === species
      );
  
      if (!isSpeciesExists) {
        // Add species to collection
        await axios.post(
          `${HISTORY_URL}/collection`,
          { species, confidence, rarity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        ToastAndroid.show('Species added to collection.', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Species already exists in your collection.', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Failed to process the image or save data.', ToastAndroid.SHORT);
      console.error('Prediction or data error: ', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {prediction && (
        <View style={styles.resultContainer}>
          <Text>Species: {prediction.species}</Text>
          <Text>Confidence: {prediction.confidence}</Text>
          <Text>Rarity: {prediction.rarity}</Text>
        </View>
      )}
      
      {/* Use the NavBar component */}
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    marginTop: 20,
    width: 300,
    height: 300,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default IdentifyScreen;

