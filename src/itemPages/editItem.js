import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import firebase from "../../config"

const numColumns = 2
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function EditItem() {
    const [items, setItems] = useState([]);

    useEffect(() => {
      readItemData()
    }, []);

    const readItemData = () => {
        firebase.database().ref('Hobbloo Data/Items').on('value', function (snapshot) {
          if (snapshot.val() != null)
          {let responselist = Object.values(snapshot.val())
          setItems(responselist)}
          //console.log(categories)
        });
    }

    const Delete = (value, logo) => {
        Alert.alert(
          'Delete Item',
          'Are you sure you want to delete ' + value + "?",
          [
            {text: 'yes', onPress: () => deleteItem(value, logo)},
            {text: 'no', onPress: () => console.log('Not deleted!')},
            
          ]
        );
      }

    const deleteItem = (value, logo) => {
        let userRef = firebase.database().ref('Hobbloo Data/Items/' + value);
        userRef.remove()
        let imageRef = firebase.storage().refFromURL(logo);
        imageRef.delete().then(() => {
            console.log("Deleted")
        }).catch(err => console.log(err))
        alert(value + " Deleted successfully!")
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

    const _renderItem = ({item, index}) => {
        let {itemStyle, itemText, itemInvisible, btnStyle} = styles
        if (item.empty){
            return <View style={[itemStyle, itemInvisible]} />
        }
        return (
            <View style={{alignItems: "center", marginBottom: 20}}>
            <View style={{width: screenWidth*0.4, height: screenHeight*0.3, backgroundColor: "#fff", marginHorizontal: 15, marginTop: 10, borderRadius: 15, alignItems: "center", marginBottom: 7, paddingVertical: 0}}>
              <Image resizeMode="contain" source={{uri: item.logoUrl}} style={{height: screenHeight*0.25, width: screenWidth*0.4}} />
              <Text style={{fontSize: 12, textAlign: "center", fontWeight: "500"}}>{item.name}</Text>
              <Text style={{color: "#707272", fontSize: 10}}>{item.category}</Text>
            </View>
            <TouchableOpacity onPress={() => Delete(item.name, item.logoUrl)} style={{width: screenWidth*0.4, height: screenHeight*0.05, backgroundColor: "#29ABE2", alignItems: "center", borderRadius: 10, justifyContent: "center", marginTop: 5}}>
                  <Text style={{color: "#fff", fontWeight: "bold"}}>Delete</Text>
            </TouchableOpacity>
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
    width: screenWidth,
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
