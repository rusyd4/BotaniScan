import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator, ToastAndroid } from 'react-native';
import axios from 'axios';

const IdentifyScreen = ({ route }) => {
  const [imageUri, setImageUri] = useState(route.params?.imageUri || null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const SERVER_URL = process.env.SERVER_URL || 'http://127.0.0.1:5000';
  const HISTORY_URL = process.env.HISTORY_URL || 'http://192.168.7.23:5001';

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
    formData.append('images', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post(
        'https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&nb-results=10&lang=en&api-key=2b10P1iYknQtt6YMuwMAqGfjku',
        formData,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const apiData = response.data;

      // Check for error in the API response
      if (apiData.statusCode === 404) {
        throw new Error('Species not found');
      }

      // Mapping output to the desired format
      const bestMatch = apiData.bestMatch;
      const results = apiData.results.map(item => ({
        score: item.score,
        species: item.species.scientificName,
        commonNames: item.species.commonNames,
      }));

      // Set prediction
      setPrediction({ bestMatch, results });

      ToastAndroid.show('Image processed successfully.', ToastAndroid.SHORT);
    } catch (error) {
        ToastAndroid.show('Species not found.', ToastAndroid.SHORT);
      
        console.error('Prediction or data error: ', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {prediction && (
        <View style={styles.resultContainer}>
          <Text>Best Match: {prediction.bestMatch}</Text>
          <Text>Top Results:</Text>
          {prediction.results.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text>Species: {result.species}</Text>
              <Text>Common Names: {result.commonNames.join(', ')}</Text>
              <Text>Score: {result.score.toFixed(4)}</Text>
            </View>
          ))}
        </View>
      )}
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
  resultItem: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default IdentifyScreen;
