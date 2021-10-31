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

export default function AddStore() {
    const [name, setName] = useState(null);
    const [address, setAddress] = useState(null); 

    const [logo, setLogo] = useState(null);
    const [location, setLocation] = useState(null);
    const [pinstatus, setPinstatus] = useState(false);

    const [fromWeekday, setFromWeekday] = useState(0);
    const [toWeekday, setToWeekday] = useState(24);

    const [fromWeekend, setFromWeekend] = useState(0);
    const [toWeekend, setToWeekend] = useState(24);

    const AddStore = () => {
        if(name == "" || address == ""|| logo == null || location == null ){
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
              .ref("Hobbloo Data/Stores/" + name + "-" + address + "/")
              .set({
                name: name,
                logoUrl: uploadUrl,
                address: address,
                weekdayOpen: fromWeekday,
                weekdayClose: toWeekday,
                weekendOpen: fromWeekend,
                weekendClose: toWeekend,
                geolocation: location,
              }).then(() => {
                alert("Store Added!")
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

    const PinLocation = async () => {
        setPinstatus(true)
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
        var pinlocation = await Location.getCurrentPositionAsync({});
        setLocation(pinlocation);
        alert("Location pinned!")
        setPinstatus(false)
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

    const Pin = () => {
        Alert.alert(
          'Location Verification',
          'Are you sure you are in the store location?',
          [
            {text: 'yes', onPress: () => PinLocation()},
            {text: 'no', onPress: () => alert("Please go to the store location!")},
            
          ]
        );
    }

    const GetTime = (value) => {
 
        // Creating variables to hold time.
        //var date, TimeType, hour, minutes, seconds, fullTime;
        var TimeType, fullTime, hour
        hour = value
        if(hour <= 11) {TimeType = 'AM';} else {TimeType = 'PM';}
    
        if( hour > 12 ){hour = hour - 12;}

        if( hour == 0 ){hour = 12;} 
    
    
        // Adding all the variables in fullTime variable.
        fullTime = hour.toString() + ':00' + TimeType.toString();

        return fullTime
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
        <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder="Name" color="#fff" onChangeText={text => setName(text)}/>
        <TouchableOpacity onPress={pickImage} style={{overflow: "hidden", alignItems: "center", justifyContent: "center", width: screenWidth * 0.78, height: screenHeight*0.2, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 10}}>
            {logo != null? (
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Image source={{ uri: logo}} style={{ width: screenWidth * 0.78, height: screenHeight*0.2 }} />
                </View>
            ):(
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Fontisto name="picture" size={50} style={{marginBottom: 10}} />
                    <Text style={{color: "#000", fontSize: 15}}>Click to add store logo!</Text>
                </View>
            )}
        </TouchableOpacity>
        <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder="Address" color="#fff" onChangeText={text => setAddress(text)}/>
        <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder="Coordinates" color="#fff" onChangeText={text => setLocation(text)}/>
        {/*location == null?(<TouchableOpacity disabled={pinstatus} onPress={() => Pin()} style={{width: screenWidth * 0.78, height: screenHeight * 0.06, borderRadius: 10, backgroundColor: "#F50052", alignItems: "center", justifyContent: "center"}}>
            {pinstatus?(<ActivityIndicator size="small" />):(<Text style={{color: "#fff"}}>Click to pin store location</Text>)}
        </TouchableOpacity>):
        (<TouchableOpacity disabled={pinstatus} onPress={() => Pin()} style={{width: screenWidth * 0.78, height: screenHeight * 0.06, borderRadius: 10, backgroundColor: "#4CAF50", alignItems: "center", justifyContent: "center"}}>
            {pinstatus?(<ActivityIndicator size="small" />):(<Text style={{color: "#fff"}}>Location Pinned!</Text>)}
        </TouchableOpacity>)
            */}
        <View style={{marginTop: 20, marginBottom: 0, alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#fff", fontSize: 15}}>Weekday Open and Close Time</Text>
                <View style={{flexDirection: "row", marginTop: 10, width: screenWidth*0.87}}>
                    <Text style={{color: "#BDBDBD", position: "absolute", bottom: -20, left: 13}}>Open</Text>
                    <Text style={{color: "#BDBDBD", position: "absolute", bottom: -20, right: 13}}>Close</Text>
                </View>
                <View style={{flexDirection: "row", top: 0, width: screenWidth*0.87}}>
                    <Text style={{color: "#BDBDBD", position: "absolute", left: 15, bottom: -65}}>{GetTime(fromWeekday)}</Text>
                    <Text style={{color: "#BDBDBD", position: "absolute", right: 15, bottom: -65}}>{GetTime(toWeekday)}</Text>
                </View>
                <View style={{flexDirection: "row"}}>
                    <RangeSlider min={0} max={24}
                        fromValueOnChange={value => setFromWeekday(value)}
                        toValueOnChange={value => setToWeekday(value)}
                        initialFromValue={0}
                        styleSize={15}
                        toKnobColor="#327087"
                        fromKnobColor="#327087"
                        inRangeBarColor="#21B3E9"
                        rangeLabelsTextColor="#BDBDBD"
                        valueLabelsBackgroundColor="#327087"
                        showRangeLabels={false}
                        showValueLabels={true}
                        step={1}
                        width={20}
                    />
                </View>
        </View>
        <View style={{marginTop: 0, marginBottom: 0, alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#fff", fontSize: 15}}>Weekend Open and Close Time</Text>
                <View style={{flexDirection: "row", marginTop: 10, width: screenWidth*0.87}}>
                    <Text style={{color: "#BDBDBD", position: "absolute", bottom: -20, left: 13}}>Open</Text>
                    <Text style={{color: "#BDBDBD", position: "absolute", bottom: -20, right: 13}}>Close</Text>
                </View>
                <View style={{flexDirection: "row", top: 0, width: screenWidth*0.87}}>
                    <Text style={{color: "#BDBDBD", position: "absolute", left: 15, bottom: -65}}>{GetTime(fromWeekend)}</Text>
                    <Text style={{color: "#BDBDBD", position: "absolute", right: 15, bottom: -65}}>{GetTime(toWeekend)}</Text>
                </View>
                <View style={{flexDirection: "row"}}>
                    <RangeSlider min={0} max={24}
                        fromValueOnChange={value => setFromWeekend(value)}
                        toValueOnChange={value => setToWeekend(value)}
                        initialFromValue={0}
                        styleSize={15}
                        toKnobColor="#327087"
                        fromKnobColor="#327087"
                        inRangeBarColor="#21B3E9"
                        rangeLabelsTextColor="#BDBDBD"
                        valueLabelsBackgroundColor="#327087"
                        showRangeLabels={false}
                        showValueLabels={true}
                        step={1}
                        width={20}
                    />
                </View>
        </View>
        <TouchableOpacity onPress={() => AddStore()} disabled={pinstatus} style={{width: screenWidth * 0.78, height: screenHeight * 0.06, borderRadius: 10, backgroundColor: "#21B3E9", alignItems: "center", justifyContent: "center", marginBottom: 20}}>
            {pinstatus?(<ActivityIndicator size="small" />):(<Text style={{color: "#fff"}}>Add Store!</Text>)}
        </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001027',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth*0.87
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
