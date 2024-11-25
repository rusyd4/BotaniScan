import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import NavBar from '../components/NavBar'; // Import the NavBar component

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]); // State untuk leaderboard
  const [loading, setLoading] = useState(true); // State untuk loading

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch leaderboard data dari backend
        const response = await axios.get('http://192.168.7.2:5001/leaderboard');
        setLeaderboard(response.data); // Menyimpan data leaderboard
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false); // Sembunyikan indikator loading setelah fetch selesai
      }
    };

    fetchLeaderboard();
  }, []);

  const renderLeaderboardItem = ({ item, index }) => (
    <View style={styles.leaderboardItem}>
      <Text style={styles.rankText}>{index + 1}. {item.username}</Text>
      <Text style={styles.collectionText}>Collections: {item.collectionSize}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Leaderboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" style={styles.loadingIndicator} />
      ) : leaderboard.length > 0 ? (
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.username}
          renderItem={renderLeaderboardItem}
          style={styles.leaderboardList}
        />
      ) : (
        <Text style={styles.noLeaderboardText}>No leaderboard data found.</Text>
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
  leaderboardList: {
    marginTop: 20,
  },
  leaderboardItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  rankText: {
    fontSize: 18,
    color: '#333',
  },
  collectionText: {
    fontSize: 16,
    color: '#555',
  },
  noLeaderboardText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
});

export default LeaderboardScreen;
