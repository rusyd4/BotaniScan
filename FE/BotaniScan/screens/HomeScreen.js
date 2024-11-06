// screens/HomeScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // For token storage

const HomeScreen = ({ navigation }) => {

  const handleLogout = async () => {
    // Clear token from AsyncStorage when logging out
    await AsyncStorage.removeItem('authToken');
    navigation.navigate('Login'); // Navigate back to the login screen or wherever appropriate
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to BotaniScan!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default HomeScreen;
