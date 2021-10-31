import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, SafeAreaView, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import {AntDesign} from "@expo/vector-icons"

import firebase from "../../config"

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function EditCategory() {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    readCategoryData()
  }, []);

  const readCategoryData = () => {
    firebase.database().ref('Hobbloo Data/Categories').on('value', function (snapshot) {
      if (snapshot.val() != null)
      {let responselist = Object.values(snapshot.val())
      setCategories(responselist)}
      //console.log(categories)
    });
  }

  const Delete = (value, logo) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete ' + value,
      [
        {text: 'yes', onPress: () => deleteCategory(value, logo)},
        {text: 'no', onPress: () => console.log('Not deleted!')},
        
      ]
    );
  }

  const deleteCategory = (value, logo) => {
    let userRef = firebase.database().ref('Hobbloo Data/Categories/' + value);
    userRef.remove()
    let imageRef = firebase.storage().refFromURL(logo);
    imageRef.delete().then(() => {
        console.log("Deleted")
    }).catch(err => console.log(err))
    alert(value + " Deleted successfully!")
  }

  const renderItem = ({item})=>( 
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text style={{fontSize: 30, color: "red"}}></Text>
    </View>
  );

  return (
    <View style={styles.container}>
        <FlatList
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
          <View style={{alignItems: "center", marginBottom: 20}}>
            <View style={styles.btn}>
              <View style={{overflow: "hidden", borderRadius: 5}}>
              <ImageBackground resizeMode="cover" source={{uri: item.logoUrl}} style={{height: screenHeight*0.13, width: screenWidth*0.9}} >
                <TouchableOpacity onPress={() => Delete(item.name, item.logoUrl)} style={{top: 10, right: 10, position: "absolute"}}><AntDesign name="delete" color="red" size={30} /></TouchableOpacity>
                <Text style={{fontSize: 17, color: "#fff", position: "absolute", bottom: 15, left: 15, fontWeight: "bold"}}>{item.name}</Text>
              </ImageBackground>
              </View>
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
    marginTop: 0,
    
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
