import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, SafeAreaView, ImageBackground, TouchableOpacity, Alert, LogBox } from 'react-native';
import {AntDesign} from "@expo/vector-icons"
import DropDownPicker from 'react-native-dropdown-picker';

import firebase from "../../config"

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function EditSubCategory() {
    const [categoryopen, setcategoryOpen] = useState(false);
    const [categoryvalue, setcategoryValue] = useState(null);
    const [categories, setCategories] = useState([]);

    const [subcategories, setsubCategories] = useState([])

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
    if (snapshot.val() != null){
        let responselist = Object.keys(snapshot.val())
        setCategories(toArray(responselist))
    }else{
        setCategories([])
    }
    });
  }

  const readsubCategoryData = async () => {
    firebase.database().ref('Hobbloo Data/Categories/' + categoryvalue + '/Subcategories').on('value', function (snapshot) {
        if (snapshot.val() != null){
            let values = [];
            snapshot.forEach((child) => {
                values.push(child.val());
            });
            setsubCategories(values)
        }else{
            setsubCategories([])
        }
    }
    );
  }

  const Delete = (value) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete ' + value,
      [
        {text: 'yes', onPress: () => deleteCategory(value)},
        {text: 'no', onPress: () => console.log('Not deleted!')},
        
      ]
    );
  }

  const deleteCategory = (value) => {
    //console.log(value)
    let userRef = firebase.database().ref('Hobbloo Data/Categories/' + categoryvalue + '/Subcategories').orderByChild('name').equalTo(value);
    userRef.on('value', function(abcdSnap){
        var a = abcdSnap.val();
        //var b = Object.keys(a)[0];
        console.log(Object.keys(a)[0])
        firebase.database().ref('Hobbloo Data/Categories/' + categoryvalue + '/Subcategories').child(Object.keys(a)[0]).remove();
        LogBox.ignoreLogs(["TypeError: null is not an object (evaluating 'Object.keys(a)')"]);
    })

    alert(value + " Deleted successfully!")
  }

  const renderItem = ({item})=>( 
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text style={{fontSize: 30, color: "red"}}></Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
              dropDownContainerStyle={{backgroundColor: '#fff', zIndex: 1000, elevation: 1000, borderColor: "#BDBDBD", maxHeight: 500}}
        />

        {subcategories != [] ? (<FlatList
          data={subcategories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
          <View style={{alignItems: "center", marginBottom: 20}}>
            <View style={styles.btn}>
              <View style={{overflow: "hidden", borderRadius: 5}}>
              <ImageBackground resizeMode="cover" source={{uri: item.logoUrl}} style={{height: screenHeight*0.13, width: screenWidth*0.9}} >
                <TouchableOpacity onPress={() => Delete(item.name)} style={{top: 10, right: 10, position: "absolute"}}><AntDesign name="delete" color="red" size={30} /></TouchableOpacity>
                <Text style={{fontSize: 17, color: "#fff", position: "absolute", bottom: 15, left: 15, fontWeight: "bold"}}>{item.name}</Text>
              </ImageBackground>
              </View>
            </View>
          </View>
          }
        />):(<View/>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
