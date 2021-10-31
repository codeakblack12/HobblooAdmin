import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {FontAwesome5, AntDesign, Ionicons} from "@expo/vector-icons"
import * as SplashScreen from 'expo-splash-screen'
import * as ImagePicker from 'expo-image-picker';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Store from "./src/store"
import Category from "./src/category"
import Item from "./src/item"

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 3000)

const Tab = createBottomTabNavigator();

export default function App() {

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);


  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Category" screenOptions={{
            tabBarActiveTintColor: "#001027",
            tabBarStyle: {backgroundColor: "#21B3E9"}
        }}>
        <Tab.Screen name="Store" component={Store} options={{
          tabBarLabel: 'Store',
          tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="store-alt" color={color} size={size} />
          ),
          headerStyle: {backgroundColor: '#21B3E9', shadowColor: "transparent"},
        }}/>
        <Tab.Screen name="Category" component={Category} options={{
          tabBarLabel: 'Category',
          tabBarIcon: ({ color, size }) => (
              <AntDesign name="appstore1" color={color} size={size} />
          ),
          headerStyle: {backgroundColor: '#21B3E9', shadowColor: "transparent"},
        }}/>
        <Tab.Screen name="Item" component={Item} options={{
          tabBarLabel: 'Item',
          tabBarIcon: ({ color, size }) => (
              <Ionicons name="fast-food" color={color} size={size} />
          ),
          headerStyle: {backgroundColor: '#21B3E9', shadowColor: "transparent"},
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
