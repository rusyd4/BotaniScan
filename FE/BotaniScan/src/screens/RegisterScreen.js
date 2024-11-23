import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';  // For storing token

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // Check if fields are filled
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      // Send registration request to backend
      const response = await axios.post('http://192.168.7.2:5001/auth/register', {
        username,
        email,
        password,
      });

      // If registration is successful
      if (response.status === 201) {
        Alert.alert("Success", "User registered successfully!");

        // Optional: Store token if returned by backend
        if (response.data.token) {
          await AsyncStorage.setItem('userToken', response.data.token);
        }

        // Navigate to login screen or dashboard
        navigation.navigate('Login');
      } else {
        Alert.alert("Registration Failed", "Unable to register. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Registration Error", error.response?.data?.error || "Failed to register user.");
    }
  };


  return (
    <View style={styles.container}>
      <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Register" onPress={handleRegister} />
      <Text style={styles.text} onPress={() => navigation.goBack()}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  text: {
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default RegisterScreen;