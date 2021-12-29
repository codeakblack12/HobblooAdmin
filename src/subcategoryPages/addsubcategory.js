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

export default function AddSubCategory() {
    const [name, setName] = useState("");
    const [check, setCheck] = useState([])
    const [pinstatus, setPinstatus] = useState(false);
    const [categoryopen, setcategoryOpen] = useState(false);
    const [categoryvalue, setcategoryValue] = useState(null);
    const [categories, setCategories] = useState([])

    useEffect(() => {
        readCategoryData()
    }, []);

    const AddStore = () => {
        readsubCategoryData()
        console.log(check)
        if(name == "" || categoryvalue == null){
            alert("Please complete all fields!")
        }
        else if (check.includes(name)){
            alert(name + " already exists")
        }
        else{
            _handleStoreUpload()
        }
    }

    const _handleStoreUpload = async () => {
        setPinstatus(true)
        try {  
            firebase
              .database()
              .ref("Hobbloo Data/Categories/" + categoryvalue + "/Subcategories/")
              .push({
                name: name,
              }).then(() => {
                alert("Sub Category Added!")
              }).catch((error) => {
                alert(error)
              });
        } catch (e) {
          console.log(e);
          alert("Upload failed, sorry :(");
        } finally {
            setPinstatus(false);
        }
      };

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
            console.log(snapshot.val())
            console.log(responselist)
            setCategories(toArray(responselist))
          }else{
            setCategories([])
          }
        });
      }

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
            setCheck(subValues)
          }else{
            setCheck([])
          }
        });
      }

  return (
    <View style={styles.container}>
        <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder="Name" color="black" onChangeText={text => setName(text)}/>
        <DropDownPicker
              items ={categories}
              setItems={setCategories}
              value={categoryvalue}
              setValue={setcategoryValue}
              open={categoryopen}
              setOpen={setcategoryOpen}
              placeholder="Category"
              zIndex={5000}
              defaultIndex={0}
              style={{borderColor: "#BDBDBD", paddingLeft: 17}}
              textStyle={{color: '#575757'}}
              containerStyle={{height: screenHeight * 0.055, width: screenWidth * 0.78, marginTop: 20}}
              dropDownContainerStyle={{backgroundColor: '#fff', zIndex: 1000, elevation: 1000, borderColor: "#BDBDBD", maxHeight: 200}}
        />
        <TouchableOpacity onPress={() => AddStore()} disabled={pinstatus} style={{width: screenWidth * 0.78, height: screenHeight * 0.06, borderRadius: 10, backgroundColor: "#21B3E9", alignItems: "center", justifyContent: "center", marginTop: 20}}>
            {pinstatus?(<ActivityIndicator size="small" />):(<Text style={{color: "#fff"}}>Add Sub Category!</Text>)}
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
