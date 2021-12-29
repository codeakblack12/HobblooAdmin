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

export default function AddItem() {
    const [name, setName] = useState(null);

    const [logo, setLogo] = useState(null);

    const [pinstatus, setPinstatus] = useState(false);

    const [categoryopen, setcategoryOpen] = useState(false);
    const [categoryvalue, setcategoryValue] = useState(null);
    const [categories, setCategories] = useState([])

    const [subcategoryopen, setsubcategoryOpen] = useState(false);
    const [subcategoryvalue, setsubcategoryValue] = useState(null);
    const [subcategories, setsubCategories] = useState([])

    

    const AddStore = () => {
        if(name == "" || logo == null || categoryvalue == null || subcategoryvalue == null){
            alert("Please complete all fields!")
        }else{
            _handleStoreUpload()
        }
    }

    useEffect(() => {
        readCategoryData()
      }, []);

      const toArray = (obj) => {
          var len = obj.length
          var array = []
          for (let i = 0; i < len; i++) {
            array.push({label: obj[i], value: obj[i]});
          }
          return array
      }
    
      const readCategoryData = async () => {
        firebase.database().ref('Hobbloo Data/Categories').on('value', function (snapshot) {
          if(snapshot.val() != null){
            let responselist = Object.keys(snapshot.val())
            setCategories(toArray(responselist))
          }else{
            setCategories([])
          }
        });
      }
    

    const _handleStoreUpload = async () => {
        setPinstatus(true)
        try {  
          if (!logo.cancelled) {
            var uploadUrl = await uploadImageAsync(logo);
            firebase
              .database()
              .ref("Hobbloo Data/Items/" + name)
              .set({
                name: name,
                logoUrl: uploadUrl,
                category: categoryvalue,
                subcategory: subcategoryvalue,
              }).then(() => {
                alert("Item Added!")
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
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        setLogo(result.uri);
      }
    };

    const readsubCategoryData = async () => {
      firebase.database().ref('Hobbloo Data/Categories/' + categoryvalue + '/Subcategories').on('value', function (snapshot) {
        if(snapshot.val() != null){
          let values = [];
          snapshot.forEach((child) => {
              values.push(child.val());
          });
          //console.log(values)
          var subValues = []
          for(var i=0; i<values.length;i++){
              subValues.push(values[i].name)
          }
          setsubCategories(toArray(subValues))
        }else{
          setsubCategories([])
        }
      });
    }

  return (
    <View style={styles.container}>
        <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder="Name" color="black" onChangeText={text => setName(text)}/>
        <TouchableOpacity onPress={pickImage} style={{overflow: "hidden", alignItems: "center", justifyContent: "center", width: screenWidth * 0.78, height: screenHeight*0.2, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 10}}>
            {logo != null? (
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Image source={{ uri: logo}} resizeMode="contain" style={{ width: screenWidth*0.4, height: screenHeight*0.3 }} />
                </View>
            ):(
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Fontisto name="picture" size={50} style={{marginBottom: 10}} />
                    <Text style={{color: "#000", fontSize: 15}}>Click to add Item logo!</Text>
                </View>
            )}
        </TouchableOpacity>
        <DropDownPicker
              items ={categories}
              setItems={setCategories}
              value={categoryvalue}
              setValue={setcategoryValue}
              open={categoryopen}
              setOpen={setcategoryOpen}
              placeholder="Category"
              onChangeValue={() => readsubCategoryData()}
              zIndex={5000}
              defaultIndex={0}
              style={{borderColor: "#BDBDBD", paddingLeft: 17}}
              textStyle={{color: '#575757'}}
              containerStyle={{height: screenHeight * 0.055, width: screenWidth * 0.78, marginTop: 20}}
              dropDownContainerStyle={{backgroundColor: '#fff', zIndex: 1000, elevation: 1000, borderColor: "#BDBDBD", maxHeight: 200}}
        />
        <DropDownPicker
              items ={subcategories}
              setItems={setsubCategories}
              value={subcategoryvalue}
              setValue={setsubcategoryValue}
              open={subcategoryopen}
              setOpen={setsubcategoryOpen}
              placeholder="Sub Category"
              zIndex={4000}
              defaultIndex={0}
              style={{borderColor: "#BDBDBD", paddingLeft: 17}}
              textStyle={{color: '#575757'}}
              containerStyle={{height: screenHeight * 0.055, width: screenWidth * 0.78, marginTop: 20}}
              dropDownContainerStyle={{backgroundColor: '#fff', zIndex: 900, elevation: 900, borderColor: "#BDBDBD", maxHeight: 100}}
        />
        <TouchableOpacity onPress={() => AddStore()} disabled={pinstatus} style={{width: screenWidth * 0.78, height: screenHeight * 0.06, borderRadius: 10, backgroundColor: "#21B3E9", alignItems: "center", justifyContent: "center", marginTop: 20}}>
            {pinstatus?(<ActivityIndicator size="small" />):(<Text style={{color: "#fff"}}>Add Item!</Text>)}
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: "flex-start",
    width: screenWidth
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
