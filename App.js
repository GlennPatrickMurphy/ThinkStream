import React, { useState, useEffect} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { useFonts, OpenSans_400Regular,OpenSans_700Bold,OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import {View} from "react-native";


function App() {

  let [fontsLoaded] = useFonts({
      OpenSans_400Regular,
      OpenSans_600SemiBold,
      OpenSans_700Bold,
  });


  if(fontsLoaded) {
      return (
            <AuthNavigator/>
      );
  } else{
      return null
  }
}

export default App;

