import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  Image, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import config from '../configs/config';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log('User not logged in');
        return;
      }

      const response = await axios.get(`${config.API_BASE_URL}/history`, {
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

  const getScoreColor = (score) => {
    if (score > 0.8) return '#4CAF50'; // Green for high confidence
    if (score > 0.5) return '#FFC107'; // Yellow for medium confidence
    return '#F44336'; // Red for low confidence
  };

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity style={styles.historyItemContainer}>
      <View style={styles.historyItem}>
        <Image
          source={{ uri: item.image || 'default-placeholder-url' }}
          style={styles.historyImage}
        />
        <View style={styles.historyTextContainer}>
          <Text style={styles.speciesText} numberOfLines={1}>
            {item.species}
          </Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.confidenceLabel}>Confidence:</Text>
            <Text 
              style={[
                styles.scoreText, 
                { color: getScoreColor(item.score) }
              ]}
            >
              {(item.score * 100).toFixed(2)}%
            </Text>
          </View>
          <Text style={styles.timestampText}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Your Scan History</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading your history...</Text>
        </View>
      ) : history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.historyList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateIcon}>🌱</Text>
          <Text style={styles.noHistoryTitle}>No Scan History</Text>
          <Text style={styles.noHistorySubtitle}>
            Your scanned plant results will appear here
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  historyList: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  historyItemContainer: {
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
  },
  historyImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginRight: 15,
  },
  historyTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  speciesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 80,
    marginBottom: 15,
  },
  noHistoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  noHistorySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default HistoryScreen;