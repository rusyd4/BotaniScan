import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import NavBar from '../components/NavBar';

const { width } = Dimensions.get('window');

const IdentifyScreen = ({ route }) => {
  const [imageUri, setImageUri] = useState(route.params?.imageUri || null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const processImage = async () => {
    if (!imageUri) {
      ToastAndroid.show('Tidak ada gambar yang dipilih.', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
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
      const bestMatch = apiData.bestMatch;
      const results = apiData.results.map(item => ({
        score: item.score,
        species: item.species.scientificName,
        commonNames: item.species.commonNames,
      }));

      setPrediction({ bestMatch, results });
      ToastAndroid.show('Gambar berhasil diproses.', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Gagal memproses gambar.', ToastAndroid.SHORT);
      console.error('Kesalahan prediksi atau data: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageUri) {
      processImage();
    }
  }, [imageUri]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image 
              source={{uri: imageUri}} 
              style={styles.image} 
              blurRadius={loading ? 5 : 0}
            />
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#2E7D32" />
              </View>
            )}
          </View>
        )}

        {prediction && !loading && (
          <View style={styles.resultContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.leafEmoji}>🍃</Text>
              <Text style={styles.headerTitle}>Hasil Identifikasi</Text>
            </View>

            <Text style={styles.bestMatchText}>
              Kecocokan Terbaik: {prediction.bestMatch}
            </Text>

            {prediction.results.map((result, index) => (
              <View key={index} style={styles.resultCard}>
                <View style={styles.resultContent}>
                  <Text style={styles.flaskEmoji}>🧪</Text>
                  <Text style={styles.resultSpecies}>{result.species}</Text>
                </View>
                <Text style={styles.resultCommonNames}>
                  Nama Umum: {result.commonNames.join(', ')}
                </Text>
                <Text style={styles.resultScore}>
                  Akurasi: {(result.score * 100).toFixed(2)}%
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <NavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  scrollView: {
    backgroundColor: '#E8F5E9',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 80,
  },
  imageContainer: {
    marginTop: 30,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  leafEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  bestMatchText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#F1F8E9',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  flaskEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  resultSpecies: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388E3C',
  },
  resultCommonNames: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 5,
  },
  resultScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'right',
  },
});

export default IdentifyScreen;