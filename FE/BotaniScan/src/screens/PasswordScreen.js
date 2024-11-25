import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      ToastAndroid.show('Both fields are required.', ToastAndroid.SHORT);
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
        'http://192.168.7.2:5001/user/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);
      ToastAndroid.show('Password changed successfully.', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error('Change password error:', error);
      ToastAndroid.show('Failed to change password. Please try again.', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Change Password</Text>

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00c853" />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleChangePassword}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#00c853',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PasswordScreen;

