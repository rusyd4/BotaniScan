import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ToastAndroid,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../configs/config';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({ username: '', email: '', password: '' });

  const validateUsername = (value) => {
    if (value.length < 8) {
      setErrors((prev) => ({ ...prev, username: 'Username must be at least 8 characters long.' }));
    } else {
      setErrors((prev) => ({ ...prev, username: '' }));
    }
    setUsername(value);
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
    setEmail(value);
  };

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 8 characters long, include uppercase, lowercase, and a number.',
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
    setPassword(value);
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      ToastAndroid.show('Please fill in all fields.', ToastAndroid.SHORT);
      return;
    }

    if (errors.username || errors.email || errors.password) {
      ToastAndroid.show('Please correct the errors before submitting.', ToastAndroid.SHORT);
      return;
    }

    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        ToastAndroid.show('User registered successfully!', ToastAndroid.SHORT);
        if (response.data.token) {
          await AsyncStorage.setItem('authToken', response.data.token);
        }
        navigation.navigate('Login');
      } else {
        ToastAndroid.show('Registration failed. Please try again.', ToastAndroid.SHORT);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Registration error occurred. Please try again.';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Icons/botaniscan.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={validateUsername}
          placeholderTextColor="gray"
        />
      </View>
      {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={validateEmail}
          placeholderTextColor="gray"
          keyboardType="email-address"
        />
      </View>
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          placeholderTextColor="gray"
          onChangeText={validatePassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Image
            source={
              showPassword
                ? require('../assets/Icons/Hide.png')
                : require('../assets/Icons/eye-show-up-arrow.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <TouchableOpacity
  style={[
    styles.button,
    (Object.values(errors).some((error) => error) || !username || !email || !password) && { backgroundColor: '#ccc' },
  ]}
  onPress={handleRegister}
  disabled={
    Object.values(errors).some((error) => error) || !username || !email || !password
  }>
  <Text style={styles.buttonText}>Register</Text>
</TouchableOpacity>


      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.loginText}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  icon: {
    width: 24,
    height: 24,
    padding: 5,
  },
  button: {
    backgroundColor: '#007b6e',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#007b6e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#999999',
  },
  loginText: {
    color: '#007b6e',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default RegisterScreen;
