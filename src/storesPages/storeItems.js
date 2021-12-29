import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import firebase from "../../config"
import {Ionicons, AntDesign} from "@expo/vector-icons"

const numColumns = 2
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function StoreItems({route, navigation}) {
  const [items, setItems] = useState([]);
  const [available, setAvailable] = useState([])
  const [availablevalues, setAvailablevalues] = useState({})
  const [refresh, setRefresh] = useState(false)
  const {name, address, logo, category} = route.params;

  useEffect(() => {
    //console.log(name)
    readItemData()
    readAvailableItems()
  }, []);

  const readItemData = () => {
    firebase.database().ref('Hobbloo Data/Items').orderByChild("category").equalTo(category).on('value', function (snapshot) {
      if (snapshot.val() != null){
        let responselist = Object.values(snapshot.val())
        setItems(responselist)
       }
      //console.log(categories)
    });
  }

  const readAvailableItems = () => {
    firebase.database().ref('Hobbloo Data/Stores/' + name + "-" + address + "/Inventory/" + category).on('value', function (snapshot) {
      if (snapshot.val() != null){
        //console.log(snapshot.val())
        let resp = Object.values(snapshot.val())
        let responselist = Object.keys(snapshot.val())
        setAvailablevalues(snapshot.val())
        setAvailable(responselist)
    }else{
        setAvailablevalues([])
        setAvailable([])
    }
    });
  }
  

  const Delete = (value) => {
    Alert.alert(
      'Remove Category',
      'Are you sure you want to remove ' + value + " from stock?",
      [
        {text: 'yes', onPress: () => deleteItem(value)},
        {text: 'no', onPress: () => console.log('Not deleted!')},
        
      ]
    );
  }

  const deleteItem = (value) => {
    let userRef = firebase.database().ref("Hobbloo Data/Stores/" + name + "-" + address + "/Inventory/" + category + "/" + value);
    userRef.remove()
    alert(value + " removed successfully!")
    readAvailableItems()
    }

  const StockStore = (name) => {
    Alert.prompt(
        "Enter Price",
        "Enter the price for "+ name,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "OK",
            onPress: price => HandleStock(name,price)
          }
        ],
        "plain-text",
        "",
        "number-pad"
      );
    };

const HandleStock = (itemname, itemprice) => {
    if(itemprice < 1){
        alert("Invalid price!")
    }else{
        try {
            firebase
                .database()
                .ref("Hobbloo Data/Stores/" + name + "-" + address + "/Inventory/" + category + "/" + itemname)
                .set({
                price: itemprice,
                }).then(() => {
                alert(itemname + " added to " + name + "stock")
                }).catch((error) => {
                alert(error)
            });
        } catch(e){
            console.log(e);
            alert("Could not add to stock!")
        }
    }
}

const numberFormat = (value) => {
    return new Intl.NumberFormat('en-NG', {style: 'currency',currency: 'NGN'}).format(value);
}

  const formatData = (dataList, numColumns) => {
    const totalRows = Math.floor(dataList.length / numColumns)
    let totalLastRow = dataList.length - (totalRows * numColumns)

    while (totalLastRow !== 0 && totalLastRow !== numColumns) {
        dataList.push({key: 'blank', empty: true})
        totalLastRow++
    }
    return dataList
}

const resizeImage = (url) => {
  var new_url = url.replace("https://firebasestorage.googleapis.com/v0/b/hobbloo-4e226.appspot.com/", "https://ik.imagekit.io/13avkwpfpv6/")
  return new_url
}

  const _renderItem = ({item, index}) => {
    let {itemStyle, itemText, itemInvisible, btnStyle} = styles
    if (item.empty){
        return <View style={[itemStyle, itemInvisible]} />
    }
    return (
        <View style={{alignItems: "center", marginBottom: 20}}>
        <View style={{width: screenWidth*0.4, height: screenHeight*0.3, backgroundColor: "#fff", marginHorizontal: 15, marginTop: 10, borderRadius: 15, alignItems: "center" }}>
          <Image resizeMode="contain" source={{uri: resizeImage(item.logoUrl)}} style={{height: screenHeight*0.25, width: screenWidth*0.4}} />
          <Text style={{fontSize: 12, textAlign: "center", fontWeight: "500"}}>{item.name}</Text>
          <Text style={{color: "#707272", fontSize: 10}}>{item.category}</Text>
        </View>
        {available.includes(item.name) & availablevalues[item.name] != null ?(<View style={{width: screenWidth*0.4, height: screenHeight*0.05, backgroundColor: "green", alignItems: "center", borderRadius: 10, justifyContent: "center", marginTop: 5}}>
              <Text style={{color: "#fff", fontWeight: "bold"}}>{numberFormat(availablevalues[item.name].price)}</Text>
        </View>):
        (<View style={{width: screenWidth*0.4, height: screenHeight*0.05, backgroundColor: "red", alignItems: "center", borderRadius: 10, justifyContent: "center", marginTop: 5}}>
              <Text style={{color: "#fff", fontWeight: "bold"}}>Not in Stock</Text>
        </View>)}
        {available.includes(item.name)? (<TouchableOpacity  onPress={() => Delete(item.name)} style={{top: 10, right: 10, position: "absolute"}}><Ionicons name="checkmark-circle" color="green" size={45} /></TouchableOpacity>):(<TouchableOpacity onPress={() => StockStore(item.name)} style={{top: 10, right: 10, position: "absolute"}}><Ionicons name="ios-add-circle-outline" color="black" size={45} /></TouchableOpacity>)}
        </View>
    )
}


  return (
    <View style={styles.container}>
        <FlatList
        data={formatData(items, numColumns)}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
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
  itemStyle: {
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
      height: 100,
      flex: 1,
      margin: 1,
      height: screenWidth/numColumns
  },
  itemText: {
      fontSize: 11,
      color: "#707070",
      marginVertical: 10,
      fontWeight: "bold"
  },
  itemInvisible: {
      backgroundColor: "transparent"
  },
  btnStyle: {
      backgroundColor: "#fff",
      width: (screenWidth/numColumns) * 0.7,
      height: screenWidth/numColumns * 0.8,
      borderRadius: 5,
      shadowColor: "black",
      shadowOpacity: 0.2,
      elevation: 8,
      shadowOffset: {width: 0, height: 1},
      shadowRadius: 2,
      alignItems: "center",
      justifyContent: "center",
  }
});
