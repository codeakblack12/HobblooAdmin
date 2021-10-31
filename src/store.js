import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, Button, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';


//import stores
import AddStore from './storesPages/addStore';
import EditStore from './storesPages/editStore';
import StoresList from './storesPages/storesList';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function Store() {

  const [activityopen, setactivityOpen] = useState(false);
  const [activityvalue, setactivityValue] = useState("");
  const [activity, setActivity] = useState([
    {label: 'Add', value: 'add'},
    {label: 'Edit', value: 'edit'}
  ]);

  const [uploading, setUploading] = useState(false);
  GLOBAL.uploading = uploading
  GLOBAL.setUploading = setUploading

  return (
    <View style={styles.container}>
      {Platform.OS !== 'android'?(<View style={{zIndex: 1000}}>
      <DropDownPicker
        items ={activity}
        setItems={setActivity}
        value={activityvalue}
        setValue={setactivityValue}
        open={activityopen}
        setOpen={setactivityOpen}
        placeholder="Activity"
        zIndex={1000}
        defaultIndex={0}
        style={{borderColor: "#21B3E9", paddingLeft: 17, backgroundColor: "#21B3E9"}}
        textStyle={{color: '#575757'}}
        containerStyle={{height: screenHeight * 0.055, width: screenWidth}}
        dropDownContainerStyle={{backgroundColor: '#21B3E9', zIndex: 1000, elevation: 1000, borderColor: "#21B3E9", maxHeight: 100, paddingLeft: 7}}
      />
      </View>):(
        <View>
        <DropDownPicker
          items ={activity}
          setItems={setActivity}
          value={activityvalue}
          setValue={setactivityValue}
          open={activityopen}
          setOpen={setactivityOpen}
          placeholder="Activity"
          zIndex={1000}
          defaultIndex={0}
          style={{borderColor: "#21B3E9", paddingLeft: 17, backgroundColor: "#21B3E9"}}
          textStyle={{color: '#575757'}}
          containerStyle={{height: screenHeight * 0.055, width: screenWidth}}
          dropDownContainerStyle={{backgroundColor: '#21B3E9', zIndex: 1000, elevation: 1000, borderColor: "#21B3E9", maxHeight: 100, paddingLeft: 7}}
        />
        </View>
      )}
      <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
        {activityvalue=="add"?(<AddStore/>):(activityvalue=="edit"?(<EditStore/>):(<Text style={{fontSize: 15, color: "#fff"}}>Please select an activity!</Text>))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001027',
    alignItems: 'center',
    justifyContent: "flex-start",
  },
});
