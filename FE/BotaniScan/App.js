// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';  // Import the new HomeScreen
import RegisterScreen from './screens/RegisterScreen';  // Import the new RegisterScreen

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}  // Add HomeScreen here
          options={{ title: 'Home' }}
        />
        <Stack.Screen
                  name="Register"
                  component={RegisterScreen}  // Add HomeScreen here
                  options={{ title: 'Register' }}
                />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
