import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Platform, Image } from 'react-native';
import {createStackNavigator} from "@react-navigation/stack";

import storesList from "./storesList"
import StoreCategories from "./storeCategories"
import StoreItems from "./storeItems"
var screenWidth = Dimensions.get('window').width;

const Stack = createStackNavigator();

export default function EditStore() {

  return (
    <View style={{flex: 1, width: screenWidth}}>
    <Stack.Navigator
      initialRouteName="storesList"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="storesList"
        component={storesList}
        options={{
          title: '',
          headerStyle: {shadowOpacity: 0, height: 0},
        }}
      />

      <Stack.Screen
        name="StoreCategories"
        component={StoreCategories}
        options={{
          title: '',
          headerStyle: {shadowOpacity: 0, height: 0},
        }}
      />

      <Stack.Screen
        name="StoreItems"
        component={StoreItems}
        options={{
          title: '',
          headerStyle: {shadowOpacity: 0, height: 0},
        }}
      />
      
    </Stack.Navigator>
    </View>
    
  );
}