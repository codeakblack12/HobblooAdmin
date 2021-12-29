import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, SafeAreaView, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import {Ionicons} from "@expo/vector-icons"

import firebase from "../../config"

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function StoreCategories({route, navigation}) {
  const [categories, setCategories] = useState({});
  const [available, setAvailable] = useState([])
  const {name, address, logo} = route.params;

  useEffect(() => {
    console.log(name)
    readCategoryData()
    readAvailableCategories()
  }, []);

  const readCategoryData = () => {
    firebase.database().ref('Hobbloo Data/Categories').on('value', function (snapshot) {
      if (snapshot.val() != null)
      {let responselist = Object.values(snapshot.val())
      setCategories(responselist)}
      //console.log(categories)
    });
  }

  const readAvailableCategories = () => {
    firebase.database().ref('Hobbloo Data/Stores/' + name + "-" + address + "/Inventory").on('value', function (snapshot) {
      if (snapshot.val() != null)
      {let responselist = Object.keys(snapshot.val())
      setAvailable(responselist)}
    });
  }

  const ItemNavigate = (item) => {
    console.log(item.name)
    navigation.navigate("StoreItems", {name: name, address: address, logo: logo, category: item.name })
  }

  const resizeImage = (url) => {
    var new_url = url.replace("https://firebasestorage.googleapis.com/v0/b/hobbloo-4e226.appspot.com/", "https://ik.imagekit.io/13avkwpfpv6/")
    return new_url
  }


  return (
    <View style={styles.container}>
        <FlatList
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
          <View style={{alignItems: "center", marginBottom: 20}}>
            <View style={styles.btn}>
              <TouchableOpacity style={{overflow: "hidden", borderRadius: 5}} onPress={() => ItemNavigate(item)}>
              <ImageBackground resizeMode="cover" source={{uri: resizeImage(item.logoUrl)}} style={{height: screenHeight*0.13, width: screenWidth*0.9}} >
                {available.includes(item.name)? (<View style={{top: 10, right: 10, position: "absolute"}}><Ionicons name="checkmark-circle" color="green" size={35} /></View>):(<View/>)}
                <Text style={{fontSize: 17, color: "#fff", position: "absolute", bottom: 15, left: 15, fontWeight: "bold"}}>{item.name}</Text>
              </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
          }
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  btn: {
    alignItems: "center", 
    justifyContent: "center", 
    marginHorizontal:20, 
    height: screenHeight*0.13, 
    width: screenWidth*0.9, 
    backgroundColor: "#313131", 
    borderRadius: 5, 
    marginTop: 10,
    shadowColor: "black",
    shadowOpacity: 0.5,
    elevation: 8,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
  }
});
