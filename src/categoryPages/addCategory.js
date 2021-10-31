import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import RangeSlider from 'react-native-range-slider-expo';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import firebase from "../../config"
import uuid from "uuid";

import {Fontisto, AntDesign} from "@expo/vector-icons"

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function AddCategory() {
    const [name, setName] = useState(null);

    const [logo, setLogo] = useState(null);

    const [pinstatus, setPinstatus] = useState(false);

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

    const AddStore = () => {
        if(name == "" || logo == null){
            alert("Please complete all fields!")
        }else{
            _handleStoreUpload()
        }
    }

    const _handleStoreUpload = async () => {
        setPinstatus(true)
        try {  
          if (!logo.cancelled) {
            var uploadUrl = await uploadImageAsync(logo);
            firebase
              .database()
              .ref("Hobbloo Data/Categories/" + name)
              .set({
                name: name,
                logoUrl: uploadUrl,
              }).then(() => {
                alert("Category Added!")
              }).catch((error) => {
                alert(error)
              });
          }
        } catch (e) {
          console.log(e);
          alert("Upload failed, sorry :(");
        } finally {
            setPinstatus(false);
        }
      };


    const uploadImageAsync = async (uri) => {
        console.log(uri)
        const response = await fetch(uri);
        const blob = await response.blob()
        const ref = firebase
          .storage()
          .ref()
          .child(uuid.v4())
        const snapshot = await ref.put(blob);
        // We're done with the blob, close and release it
        blob.close();
        return await snapshot.ref.getDownloadURL();
    }
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        setLogo(result.uri);
      }
    };

    const readCategoryData = () => {
        firebase.database().ref('Categories/').on('value', function (snapshot) {
            console.log(snapshot.val())
        });
    }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
        <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder="Name" color="black" onChangeText={text => setName(text)}/>
        <TouchableOpacity onPress={pickImage} style={{overflow: "hidden", alignItems: "center", justifyContent: "center", height: screenHeight*0.13, width: screenWidth*0.9, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 10}}>
            {logo != null? (
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Image source={{ uri: logo}} style={{ width: screenWidth * 0.78, height: screenHeight*0.2 }} />
                </View>
            ):(
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Fontisto name="picture" size={50} style={{marginBottom: 10}} />
                    <Text style={{color: "#000", fontSize: 15}}>Click to add Category logo!</Text>
                </View>
            )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => AddStore()} disabled={pinstatus} style={{width: screenWidth * 0.78, height: screenHeight * 0.06, borderRadius: 10, backgroundColor: "#21B3E9", alignItems: "center", justifyContent: "center", marginTop: 20}}>
            {pinstatus?(<ActivityIndicator size="small" />):(<Text style={{color: "#fff"}}>Add Category!</Text>)}
        </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    width: screenWidth * 0.78,
    height: screenHeight * 0.06,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    paddingLeft:20,
    fontSize: 15,
    color: '#575757',
    marginVertical: 20,
    borderWidth: 1,
},
});
