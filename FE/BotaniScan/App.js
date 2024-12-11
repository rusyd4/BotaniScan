// App.js
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen'; // Import the new HomeScreen
import RegisterScreen from './src/screens/RegisterScreen'; // Import the new RegisterScreen
import IdentifyScreen from './src/screens/IdentifyScreen'; // Import the new RegisterScreen
import HistoryScreen from './src/screens/HistoryScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import UserScreen from './src/screens/UserScreen';
import PasswordScreen from './src/screens/PasswordScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Login', headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen} // Add HomeScreen here
          options={{title: 'Home', headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen} // Add HomeScreen here
          options={{title: 'Register', headerShown: false}}
        />
        <Stack.Screen
          name="Identify"
          component={IdentifyScreen} // Add HomeScreen here
          options={{title: 'Identify'}}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen} // Add HomeScreen here
          options={{title: 'History', headerShown: false}}
        />
        <Stack.Screen
          name="Leaderboard"
          component={LeaderboardScreen} // Add HomeScreen here
          options={{title: 'Leaderboard', headerShown: false}}
        />
        <Stack.Screen
          name="User"
          component={UserScreen} // Add HomeScreen here
          options={{title: 'User', headerShown: false}}
        />
        <Stack.Screen
          name="Password"
          component={PasswordScreen} // Add HomeScreen here
          options={{title: 'Password'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
