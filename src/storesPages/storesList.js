import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import firebase from "../../config"

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function StoresList({navigation}) {
  const [stores, setStores] = useState({});

  useEffect(() => {
    readStoreData()
  }, []);

  const readStoreData = () => {
    firebase.database().ref('Hobbloo Data/Stores').on('value', function (snapshot) {
      if (snapshot.val() != null)
      {let responselist = Object.values(snapshot.val())
      setStores(responselist)
      //console.log(responselist)
      }
    });
  }

  const CategoryNavigate = (item) => {
    console.log(item.name)
    navigation.navigate("StoreCategories", {name: item.name, address: item.address, logo: item.logoUrl })
  }

  const resizeImage = (url) => {
    var new_url = url.replace("https://firebasestorage.googleapis.com/v0/b/hobbloo-4e226.appspot.com/", "https://ik.imagekit.io/13avkwpfpv6/")
    return new_url
  }

  const randColor = () => {
    var colors = ["#EC3539", "#F16136", "#007A3E", "#DA2418", "#D41F42", "#008080", "#1E90FF", "#4B0082", "#800080", "#FF00FF", "#8B4513"]
    /*var colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
    */
    var random = Math.floor(Math.random() * colors.length);
    return colors[random]
  }

  return (
        <View style={styles.container}>
            <FlatList
            data={stores}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) =>
              <TouchableOpacity onPress={() => CategoryNavigate(item)} style={[styles.pbtnStyle, {backgroundColor: randColor()}]}>
                <View style={{height: screenHeight*0.15, width: screenHeight*0.15, borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginRight: 5}}>
                  <ImageBackground resizeMode="contain" source={{uri: resizeImage(item.logoUrl)}} style={{height: screenHeight*0.15, width: screenHeight*0.15}} >
                  </ImageBackground>
                </View>
                <View style={{width: screenWidth*0.5, alignItems: "flex-start", marginTop: 10}}>
                  <Text style={{color:"#fff", fontSize: 13, fontWeight: "bold"}}>{item.name}</Text>
                  <Text style={{color:"#fff", fontSize: 11, fontWeight: "500", flexWrap: "wrap", marginTop: 5}}>{item.address}</Text>
                </View>
              </TouchableOpacity>
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
  },
  pbtnStyle: {
    alignItems: "flex-start", 
    justifyContent: "flex-start", 
    marginHorizontal:20, 
    height: screenHeight*0.15, 
    width: screenWidth*0.90,
    marginTop: 20, 
    borderRadius: 15, 
    shadowColor: "black",
    shadowOpacity: 0.4,
    elevation: 8,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    flexDirection: "row"
  },
});
