import React from 'react';
import {
  StatusBar,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Dashboard from './src/screens/Dashboard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Bookmarks from './src/screens/Bookmarks';
import Settings from './src/screens/Settings';

const Tab = createBottomTabNavigator()

function App(): React.JSX.Element {

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = ''

            if(route.name === '홈') {
              iconName = focused ? 'home' : 'home-outline'
            }else if(route.name === '북마크') {
              iconName = focused ? 'bookmark' : 'bookmark-outline'
            }else if(route.name === '설정') {
              iconName = focused ? 'settings-sharp' : 'settings-outline'
            }

            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: '#607D8B',
          tabBarInactiveTintColor: 'gray'
        })}
      >
        <Tab.Screen name="홈" component={Dashboard} />
        <Tab.Screen name="북마크" component={Bookmarks} />
        <Tab.Screen name="설정" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  }
});

export default App;
