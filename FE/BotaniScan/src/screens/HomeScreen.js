import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import plantImages from '../assets/plants/plantImages';
import NavBar from '../components/NavBar'; // Import the NavBar component

const HomeScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log('User not logged in');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get('http://192.168.1.6:5001/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Image
        source={plantImages[item.species]}
        style={styles.historyImage}
      />
      <View style={styles.historyTextContainer}>
        <Text style={styles.historyText}>Species: {item.species}</Text>
        <Text style={styles.historyText}>Rarity: {item.rarity}</Text>
        <Text style={styles.historyText}>Confidence: {item.confidence.toFixed(2)}</Text>
        <Text style={styles.historyTimestamp}>
          Predicted on: {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" style={styles.loadingIndicator} />
      ) : history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={renderHistoryItem}
          style={styles.historyList}
        />
      ) : (
        <Text style={styles.noHistoryText}>No history found.</Text>
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
  loadingIndicator: {
    marginTop: 20,
  },
  historyList: {
    marginBottom: 80, // Leave space for navbar
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  historyImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyText: {
    fontSize: 16,
    color: '#333',
  },
  historyTimestamp: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noHistoryText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
});

export default HomeScreen;
