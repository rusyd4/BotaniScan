// screens/CollectionScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NavBar from '../components/NavBar'; // Import the NavBar component

const CollectionScreen = () => {
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

        const response = await axios.get('http://10.10.59.110:5001/collection', {
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
    <View style={styles.collectionItem}>
      <Text style={styles.collectionText}>Species: {item.species}</Text>
      <Text style={styles.collectionText}>Confidence: {item.confidence.toFixed(2)}</Text>
    </View>
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
  collectionItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
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

export default CollectionScreen;