// App.js
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen'; // Import the new HomeScreen
import RegisterScreen from './src/screens/RegisterScreen'; // Import the new RegisterScreen
import CameraScreen from './src/screens/CameraScreen'; // Import the new RegisterScreen
import CollectionScreen from './src/screens/CollectionScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Login'}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen} // Add HomeScreen here
          options={{title: 'Home'}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen} // Add HomeScreen here
          options={{title: 'Register'}}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen} // Add HomeScreen here
          options={{title: 'Camera'}}
        />
        <Stack.Screen
          name="Collection"
          component={CollectionScreen} // Add HomeScreen here
          options={{title: 'Collection'}}
        />
        <Stack.Screen
          name="Leaderboard"
          component={LeaderboardScreen} // Add HomeScreen here
          options={{title: 'Leaderboard'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
