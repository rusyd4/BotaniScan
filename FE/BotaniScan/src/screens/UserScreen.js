import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null); // State untuk menyimpan data user
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error

  useEffect(() => {
    // Fungsi untuk mengambil data user
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.log('User not logged in');
          return;
        }
        const response = await axios.get('http://192.168.7.2:5001/user/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00c853" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Ganti dengan URI gambar profil jika ada
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userData.username}</Text>
      </View>

      {/* User Info */}
      <View style={styles.infoSection}>
        {/* Full Name */}
        <View style={styles.infoRow}>
          <Icon name="person-outline" size={20} color="#000" style={styles.infoIcon} />
          <TextInput
            style={styles.infoText}
            value={userData.username}
            editable={false} // Non-editable
          />
        </View>

        {/* Email Address */}
        <View style={styles.infoRow}>
          <Icon name="mail-outline" size={20} color="#000" style={styles.infoIcon} />
          <TextInput
            style={styles.infoText}
            value={userData.email}
            editable={false} // Non-editable
          />
        </View>
      </View>

      {/* Change Password */}
      <TouchableOpacity
        style={styles.changePasswordButton}
        onPress={() => navigation.navigate('Password')}
      >
        <Text style={styles.changePasswordText}>Change Password</Text>
        <Icon name="chevron-forward" size={20} color="#000" />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00c853',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
  },
  infoSection: {
    marginTop: 32,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    flex: 1,
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    justifyContent: 'space-between',
  },
  changePasswordText: {
    fontSize: 16,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default UserScreen;

