import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Home from './components/Home';
import Detail from './components/Detail';
import Favorite from './components/Favorite';
import Ladies from './components/Ladies';
import Automatic from './components/Automatic';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Favorite') {
          iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === 'Ladies') {
          iconName = focused ? 'woman' : 'woman-outline';
        } else if (route.name === 'Automatic') {
          iconName = focused ? 'car' : 'car-outline';
        } 

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={Home} options={{ title: 'Home' }} />
    <Tab.Screen name="Favorite" component={Favorite} options={{ title: 'Favorites' }} />
    <Tab.Screen name="Ladies" component={Ladies} options={{ title: 'Ladies' }} />
    <Tab.Screen name="Automatic" component={Automatic} options={{ title: 'Automatic' }} />

  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={Detail} options={{ title: '', headerTransparent: 'true' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
