import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Changed import
import NavBar from '../components/NavBar';
import config from '../configs/config';

const HomeScreen = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollection = async () => {
    try {
      setLoading(true);
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
      setCollection(response.data);
    } catch (error) {
      console.error('Error fetching collection:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCollection();
    }, [])
  );

  const renderCollectionItem = ({ item }) => (
    <TouchableOpacity style={styles.collectionCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.plantImage}
        resizeMode="cover"
      />
      <Text style={styles.collectionText} numberOfLines={2}>
        {item.species}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.headerContainer}>
  <Text style={styles.headerTitle}>Your Plant Collection</Text>
  <Text style={styles.headerSubtitle}>
    {collection.length} unique plants in your collection
  </Text>
</View>


      {/* Collection Content */}
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
        ) : collection.length > 0 ? (
          <FlatList
            data={collection}
            keyExtractor={(item) => item._id}
            renderItem={renderCollectionItem}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.collectionList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Icon name="leaf-outline" size={80} color="#E0E0E0" />
            <Text style={styles.noCollectionText}>
              Your plant collection is empty
            </Text>
            <Text style={styles.noCollectionSubtext}>
              Start adding your first plant!
            </Text>
          </View>
        )}
      </View>

      {/* Navigation Bar */}
      <NavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    backgroundColor: '#007b6e',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    flexDirection: 'column', // Ubah agar ada elemen stacked
    alignItems: 'center',
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  subtitleText: {
    color: '#333',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  collectionList: {
    paddingBottom: 20,
  },
  collectionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  plantImage: {
    width: '100%',
    height: 180,
  },
  collectionText: {
    padding: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noCollectionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  noCollectionSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  addButton: {
    padding: 5,
  },
});

export default HomeScreen;