import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NavBar from '../components/NavBar'; // Import NavBar
import plantImages from '../assets/plants/plantImages'; // Import plant images
import config from '../configs/config';

const HomeScreen = () => {
  const [collection, setCollection] = useState([]); // State untuk menyimpan koleksi tanaman
  const [loading, setLoading] = useState(true); // State untuk loading

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.log('User not logged in');
          return;
        }

        const response = await axios.get(`${config.API_BASE_URL}/collection`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCollection(response.data); // Menyimpan data koleksi spesies unik
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  const renderCollectionItem = ({ item }) => (
    <TouchableOpacity style={styles.collectionCard}>
      {/* Display plant image */}
      <Image
        source={plantImages[item.species]} // Assuming the species name matches the image name
        style={styles.plantImage}
        resizeMode="cover"
      />
      <Text style={styles.collectionText}>{item.species}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Plant Collection</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" style={styles.loadingIndicator} />
      ) : collection.length > 0 ? (
        <FlatList
          data={collection}
          keyExtractor={(item) => item._id}
          renderItem={renderCollectionItem}
          numColumns={2} // Membuat dua kolom
          columnWrapperStyle={styles.columnWrapper} // Gaya kolom
          style={styles.collectionList}
        />
      ) : (
        <Text style={styles.noCollectionText}>No collection found.</Text>
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
    paddingTop: 20,
    paddingBottom: 100, // Tambahkan padding bawah untuk memberi ruang bagi navbar
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  collectionList: {
    marginTop: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  collectionCard: {
    flex: 0.48, // Mengatur lebar kartu menjadi 48% agar ada jarak antar kolom
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  plantImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  collectionText: {
    fontSize: 16,
    color: '#333',
  },
  noCollectionText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
});

export default HomeScreen;
