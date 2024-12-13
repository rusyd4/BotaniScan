import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Image,
  ToastAndroid,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NavBar from '../components/NavBar';
import config from '../configs/config';

const UserScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isChangeUsernameVisible, setChangeUsernameVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [errors, setErrors] = useState({ username: '' });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.log('User not logged in');
          return;
        }
        const response = await axios.get(`${config.API_BASE_URL}/user/me`, {
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

  // Logout handler
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.navigate('Login');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  // Validate new username
  const validateUsername = (value) => {
    if (value.length < 8) {
      setErrors((prev) => ({ ...prev, username: 'Username must be at least 8 characters long.' }));
    } else {
      setErrors((prev) => ({ ...prev, username: '' }));
    }
    setNewUsername(value);
  };

  // Change username handler
  const handleChangeUsername = async () => {
    if (errors.username) {
      Alert.alert('Error', 'Please fix the errors before submitting.');
      return;
    }

    if (!newUsername) {
      Alert.alert('Error', 'Username cannot be empty.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        return;
      }

      await axios.put(
        `${config.API_BASE_URL}/user/change-username`,
        { username: newUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData({ ...userData, username: newUsername });
      setChangeUsernameVisible(false);
      ToastAndroid.show('Username changed successfully.', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Change username error:', error);
      Alert.alert('Error', 'Failed to change username. Please try again.');
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
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
    <SafeAreaView style={styles.wrapper}>
      <NavBar />
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../assets/Icons/botaniscan.png')}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>{userData.username}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>
        </View>

        {/* User Actions Section */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setChangeUsernameVisible(true)}
          >
            
            <Text style={styles.actionText}>Change Username</Text>
            <Image
              source={require('../assets/Icons/Edit_Pencil_01.png')}
              style={styles.actionIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('Password')}
          >
            
            <Text style={styles.actionText}>Change Password</Text>
            <Image
              source={require('../assets/Icons/Group.png')}
              style={styles.actionIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Change Username Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isChangeUsernameVisible}
          onRequestClose={() => setChangeUsernameVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Change Username</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="New Username"
                value={newUsername}
                onChangeText={validateUsername}
              />
              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
              <View style={styles.modalButtonContainer}>

              <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={handleChangeUsername}>
                <Text  style={styles.modalButtonTextCancel}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={() => setChangeUsernameVisible(false)}>
                <Text style={styles.modalButtonTextConfirm}>Cancel</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Logout Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Image 
                source={require('../assets/Icons/Circle_Warning.png')} 
                style={styles.modalIcon} 
              />
              <Text style={styles.modalTitle}>Logout Confirmation</Text>
              <Text style={styles.modalDescription}>
                Are you sure you want to log out of your account?
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={handleLogout}>
                  <Text style={styles.modalButtonTextConfirm}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 170,
    height: 170,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  actionSection: {
    marginTop: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 24,
    height: 24,
    marginLeft: 190,
    tintColor: '#007b6e',
  },
  actionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#007b6e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    width: 24,
    height: 24,
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
  changePasswordIcon: {
    width: 20,
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 320,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  modalButtonCancel: {
    backgroundColor: '#007b6e',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtonConfirm: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonTextCancel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalButtonTextConfirm: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  editIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  editIcon: {
    width:30,
    height: 30,
  },
  
});

export default UserScreen;
