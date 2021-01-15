import React, { Component, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { firebase } from '../firebase/config';

function TimeSlot(props) {

  // state colors and toggle
  const [color, setColor] = useState(props.selected ? "rgba(225,148,45,1)" : "#ffffff");
  const [textColor, setTextColor] = useState(props.selected ? "#ffffff" : '#000000');
  const [toggle, setToggle] = useState(props.selected ? false : true);

  const colorChange = () => {
    let data = {};
    if (toggle) {
      setToggle(false);
      setTextColor('#ffffff');
      setColor("rgba(225,148,45,1)");
      data[props.id] = true;
    } else {
      setToggle(true);
      setTextColor('#000000');
      setColor('#ffffff');
      data[props.id] = false;
    }
    // adds to firebase if clicked
    firebase.firestore().collection('users').doc(props.user.uid).update(data);
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: color }]} onPress={() => { colorChange() }}>
      <Text style={[styles.text, { color: textColor }]}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    height: '35%',
    width: '100%',
    marginLeft: '5%',
    marginRight: '5%',
    paddingBottom: 0,
    marginBottom: 10
  },
  text: {
    fontFamily: "OpenSans_600SemiBold",
    textAlign: "center",
    width: 208,
    height: 34,
    alignSelf: "center"
  }
});

export default TimeSlot;
