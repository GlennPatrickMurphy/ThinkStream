import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { firebase } from "../firebase/config";

const colors = ["#bf185e", "#3c73b1", "#469d9c", "#e1942d", "#b1af3c", "#ef2e32"];
const color = colors[Math.floor(Math.random() * colors.length)];

const backgroundStyle = (color) => {
  return {
    backgroundColor: color,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    flex: 2,
    width: "100%",
    padding: "10%"
  }
};

function AccountEnterWithDelete(props) {
  const name = props.name.charAt(0).toUpperCase();
  const studentName = props.name;
  const studentId = props.studentId;
  const deleteChild = props.onDelete;

  const deleteConfirmation = () => {
    Alert.alert(
      'Delete ' + studentName,
      'Are you sure you want to delete ' + studentName + '\'s account?',
      [
        { text: 'Cancel', onPress: () => { } },
        { text: 'Delete', onPress: () => deleteChild(studentName, studentId)}
      ],
      { cancelable: true },
    );
  }


  return (
    <View style={[styles.container, props.style]}>
      <View style={backgroundStyle(color)}>
        <TouchableOpacity
          style={styles.deleteButton}
          testID={'deletetester'}
          onPress={() => { deleteConfirmation() }}>
          <Entypo name="cross" color="#d3d3d3" size={30} testID={'deletetester'}/>
        </TouchableOpacity>
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
    flex: 1,
    margin: 10,
  },
  initial: {
    fontFamily: "OpenSans_400Regular",
    color: "rgba(255,255,255,1)",
    textAlign: "center",
    fontSize: 40,
    justifyContent: "center",
    flex: 1,
  },
  name: {
    fontFamily: "OpenSans_400Regular",
    color: "#121212",
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    marginBottom: "10%"
  },
  deleteButton: {
    position: 'absolute',
    height: 40,
    width: 40,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default AccountEnterWithDelete;
