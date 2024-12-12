import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import NavBar from '../components/NavBar'; // Import the NavBar component
import config from '../configs/config';

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]); // State untuk leaderboard
  const [loading, setLoading] = useState(true); // State untuk loading

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch leaderboard data dari backend
        const response = await axios.get(`${config.API_BASE_URL}/leaderboard`);
        setLeaderboard(response.data); // Menyimpan data leaderboard
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false); // Sembunyikan indikator loading setelah fetch selesai
      }
    };

    fetchLeaderboard();
  }, []);

  // Render podium untuk 3 peringkat teratas
  const renderPodium = () => {
    const first = leaderboard[0] || { username: 'N/A', collectionSize: 0 };
    const second = leaderboard[1] || { username: 'N/A', collectionSize: 0 };
    const third = leaderboard[2] || { username: 'N/A', collectionSize: 0 };

    return (
      <View style={styles.podiumContainer}>
        {/* Peringkat kedua */}
        <View style={[styles.podiumBlock, styles.secondPlace]}>
          <Text style={styles.podiumRank}>2</Text>
          <Text style={styles.podiumName}>{second.username}</Text>
          <Text style={styles.podiumPoints}>{second.collectionSize} Collections</Text>
        </View>
        {/* Peringkat pertama */}
        <View style={[styles.podiumBlock, styles.firstPlace]}>
          <Text style={styles.podiumRank}>1</Text>
          <Text style={styles.podiumName}>{first.username}</Text>
          <Text style={styles.podiumPoints}>{first.collectionSize} Collections</Text>
        </View>
        {/* Peringkat ketiga */}
        <View style={[styles.podiumBlock, styles.thirdPlace]}>
          <Text style={styles.podiumRank}>3</Text>
          <Text style={styles.podiumName}>{third.username}</Text>
          <Text style={styles.podiumPoints}>{third.collectionSize} Collections</Text>
        </View>
      </View>
    );
  };

  // Render item untuk sisa leaderboard
  const renderLeaderboardItem = ({ item, index }) => (
    <View style={styles.leaderboardItem}>
      <Text style={styles.rankText}>{index + 4}. {item.username}</Text>
      <Text style={styles.collectionText}>Collections: {item.collectionSize}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" style={styles.loadingIndicator} />
      ) : (
        <>
          {/* Tampilkan podium */}
          {leaderboard.length > 0 && renderPodium()}
          {/* Tampilkan sisa leaderboard */}
          <FlatList
            data={leaderboard.slice(3)}
            keyExtractor={(item, index) => item.username || index.toString()}
            renderItem={renderLeaderboardItem}
            style={styles.leaderboardList}
          />
        </>
      )}
      {/* Gunakan NavBar */}
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  leaderboardList: {
    marginTop: 20,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  podiumBlock: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
    borderRadius: 10,
    width: 100,
  },
  firstPlace: {
    backgroundColor: '#FFD700',
    height: 150,
  },
  secondPlace: {
    backgroundColor: '#C0C0C0',
    height: 130,
  },
  thirdPlace: {
    backgroundColor: '#CD7F32',
    height: 115,
  },
  podiumRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  podiumName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  podiumPoints: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  leaderboardItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      marginHorizontal: 20,
  },
  rankText: {
    fontSize: 16,
    color: '#333',
  },
  collectionText: {
    fontSize: 14,
    color: '#555',
  },
});

export default LeaderboardScreen;