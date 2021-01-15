import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
const colors = ["#bf185e","#3c73b1", "#469d9c", "#e1942d", "#b1af3c","#ef2e32"];
const color = colors[Math.floor(Math.random() * colors.length)];

const backgroundStyle = (color) => {
    return {
        backgroundColor:color,
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 5,
        flex:2,
        width:"100%",
        padding:"10%"
    }
};

function AccountEnter(props) {
  const name = props.name.charAt(0).toUpperCase() ;

  return (
      <View style={[styles.container, props.style]} testID={props.testID}>
        <View style={backgroundStyle(color)}>
            <Text style={styles.initial}>{name}</Text>
        </View>
        <Text style={styles.name}>{props.name}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 5,
    alignItems: "center",
    flex:1,
    margin:10,
  },
  initial: {
    fontFamily: "OpenSans_400Regular",
    color: "rgba(255,255,255,1)",
    textAlign: "center",
    fontSize: 40,
    justifyContent: "center",
    flex:1,
  },
  name: {
    fontFamily: "OpenSans_400Regular",
    color: "#121212",
    flex:1,
    textAlign: "center",
    fontSize: 15,
    marginBottom:"10%"
  }
});

export default AccountEnter;
