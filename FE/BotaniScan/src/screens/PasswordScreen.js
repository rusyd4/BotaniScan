import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Image,
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../configs/config';

const PasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const isFormValid = () => {
    return currentPassword.length > 0 && isPasswordValid(newPassword);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !isPasswordValid(newPassword)) {
      ToastAndroid.show('Please fill out all fields correctly.', ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        ToastAndroid.show('You are not logged in.', ToastAndroid.SHORT);
        setLoading(false);
        return;
      }

      await axios.post(
        `${config.API_BASE_URL}/user/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);
      setModalVisible(true); // Show success modal
    } catch (error) {
      setLoading(false);
      console.error('Change password error:', error);
      ToastAndroid.show('Failed to change password. Please try again.', ToastAndroid.SHORT);
    }
  };

  const handleLoginRedirect = () => {
    setModalVisible(false);
    navigation.replace('Login'); // Navigate to login screen
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image
          source={require('../assets/Icons/Arrow_Circle_Left.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Change Password</Text>

      {/* Current Password */}
      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/Icons/Lock_Password.png')}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry={!showCurrentPassword}
          value={currentPassword}
          placeholderTextColor="gray"
          onChangeText={setCurrentPassword}
        />
        <TouchableOpacity
          onPress={() => setShowCurrentPassword(!showCurrentPassword)}
          style={styles.eyeIcon}>
          <Image
            source={
              showCurrentPassword
                ? require('../assets/Icons/Hide.png')
                : require('../assets/Icons/eye-show-up-arrow.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {currentPassword.length === 0 && (
        <Text style={styles.warningText}>Current password is required.</Text>
      )}

      {/* New Password */}
      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/Icons/Lock_Password.png')}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!showNewPassword}
          value={newPassword}
          placeholderTextColor="gray"
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
          onPress={() => setShowNewPassword(!showNewPassword)}
          style={styles.eyeIcon}>
          <Image
            source={
              showNewPassword
                ? require('../assets/Icons/Hide.png')
                : require('../assets/Icons/eye-show-up-arrow.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {!isPasswordValid(newPassword) && newPassword.length > 0 && (
        <Text style={styles.warningText}>
          New password must be at least 8 characters long, contain upper and lower case letters, and include a number.
        </Text>
      )}

      {/* Submit Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#00c853" />
      ) : (
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid() && { backgroundColor: '#ccc' },
          ]}
          onPress={handleChangePassword}
          disabled={!isFormValid()}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}

      {/* Success Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Password Changed Successfully</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleLoginRedirect}>
              <Text style={styles.modalButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backIcon: {
    width: 50,
    height: 50,
    tintColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  inputIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: '#000',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  eyeIcon: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  warningText: {
    fontSize: 14,
    color: '#ff0000',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#007b6e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007b6e',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PasswordScreen;