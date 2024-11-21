import React, { useState, useEffect, useCallback } from 'react'; // Tambahkan useCallback di sini
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native'; // Import focus listener
import plantImages from '../assets/plants/plantImages'; // Impor plantImages.js

const HomeScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk memuat data riwayat
  const fetchHistory = async () => {
    try {
      setLoading(true); // Tampilkan loading
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log('User not logged in');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get('http://192.168.7.3:5001/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false); // Matikan loading setelah selesai
    }
  };

  // Gunakan useFocusEffect untuk memuat ulang riwayat saat layar difokuskan
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.navigate('Login');
  };

  const handleChooseImage = () => {
    navigation.navigate('Camera');
  };

  const handleCollection = () => {
    navigation.navigate('Collection');
  };

  const handleLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Image
        source={plantImages[item.species]} // Gambar default jika tidak ditemukan
        style={styles.historyImage}
      />
      <View style={styles.historyTextContainer}>
        <Text style={styles.historyText}>Species: {item.species}</Text>
        <Text style={styles.historyText}>Rarity: {item.rarity}</Text>
        <Text style={styles.historyText}>Confidence: {item.confidence.toFixed(2)}</Text>
        <Text style={styles.historyTimestamp}>Predicted on: {new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to BotaniScan!</Text>
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Choose Image" onPress={handleChooseImage} />
      <Button title="Collection" onPress={handleCollection} />
      <Button title="Leaderboard" onPress={handleLeaderboard} />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  historyList: {
    marginTop: 20,
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
