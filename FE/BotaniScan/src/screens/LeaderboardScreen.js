import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import NavBar from '../components/NavBar';
import config from '../configs/config';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/leaderboard`);
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const renderPodium = () => {
    const first = leaderboard[0] || { username: 'N/A', collectionSize: 0 };
    const second = leaderboard[1] || { username: 'N/A', collectionSize: 0 };
    const third = leaderboard[2] || { username: 'N/A', collectionSize: 0 };

    return (
      <View style={styles.podiumContainer}>
        {/* Peringkat kedua */}
        <View style={[styles.podiumBlock, styles.secondPlace]}>
          <LinearGradient 
            colors={['#B1B1B1', '#808080']} 
            style={styles.podiumGradient}
          >
            <View style={styles.podiumContent}>
              <Image 
                source={require('../assets/Icons/silver-trophy.png')} 
                style={[styles.trophyIcon, { height: 50, width: 62 }]} 
              />
              <Text style={styles.podiumRank}>2nd</Text>
              <Text style={styles.podiumName} numberOfLines={1}>{second.username}</Text>
              <Text style={styles.podiumPoints}>{second.collectionSize} Collections</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Peringkat pertama */}
        <View style={[styles.podiumBlock, styles.firstPlace]}>
          <LinearGradient 
            colors={['#FFD700', '#FFA500']} 
            style={styles.podiumGradient}
          >
            <View style={styles.podiumContent}>
              <Image 
                source={require('../assets/Icons/gold-trophy.png')} 
                style={[styles.trophyIcon, { height: 70, width: 82 }]} 
              />
              <Text style={styles.podiumRank}>1st</Text>
              <Text style={styles.podiumName} numberOfLines={1}>{first.username}</Text>
              <Text style={styles.podiumPoints}>{first.collectionSize} Collections</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Peringkat ketiga */}
        <View style={[styles.podiumBlock, styles.thirdPlace]}>
          <LinearGradient 
            colors={['#CD7F32', '#8B4513']} 
            style={styles.podiumGradient}
          >
            <View style={styles.podiumContent}>
              <Image 
                source={require('../assets/Icons/bronze-trophy.png')} 
                style={[styles.trophyIcon, { height: 40, width: 52 }]} 
              />
              <Text style={styles.podiumRank}>3rd</Text>
              <Text style={styles.podiumName} numberOfLines={1}>{third.username}</Text>
              <Text style={styles.podiumPoints}>{third.collectionSize} Collections</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  };

  const renderLeaderboardItem = ({ item, index }) => (
    <View style={styles.leaderboardItem}>
      <View style={styles.leaderboardItemContent}>
        <Text style={styles.rankText}>{index + 4}.</Text>
        <Text style={styles.usernameText} numberOfLines={1}>{item.username}</Text>
      </View>
      <Text style={styles.collectionText}>{item.collectionSize} Collections</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Image
            source={require('../assets/Icons/Arrow_Circle_Left.png')}
            style={styles.backButtonIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#4B9CD3" style={styles.loadingIndicator} />
      ) : (
        <>
          {leaderboard.length > 0 && renderPodium()}
          <FlatList
            data={leaderboard.slice(3)}
            keyExtractor={(item, index) => item.username || index.toString()}
            renderItem={renderLeaderboardItem}
            contentContainerStyle={styles.leaderboardList}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  headerContainer: {
    backgroundColor: '#007b6e',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 18,
    zIndex: 1,
  },
  backButtonIcon: {
    width: 40,
    height: 40,
    tintColor: 'white',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  podiumBlock: {
    width: 110,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  podiumGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  podiumContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  firstPlace: {
    height: 210,
  },
  secondPlace: {
    height: 190,
  },
  thirdPlace: {
    height: 170,
  },
  podiumRank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  podiumName: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  podiumPoints: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  trophyIcon: {
    marginBottom: 10,
  },
  leaderboardList: {
    paddingHorizontal: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  leaderboardItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    color: '#007b6e',
    fontWeight: 'bold',
    marginRight: 10,
    width: 40,
  },
  usernameText: {
    fontSize: 16,
    color: '#2C3E50',
    maxWidth: 150,
  },
  collectionText: {
    fontSize: 16,
    color: '#007b6e',
    fontWeight: 'bold',
  },
});

export default LeaderboardScreen;