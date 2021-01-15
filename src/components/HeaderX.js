import React, { Component , useState, useEffect} from "react";
import { StyleSheet, View, Text, Image} from "react-native";
import {Icon} from "react-native-elements";
import LogoHeader from "./legacy/LogoHeader";
const colors = ["#bf185e","#3c73b1", "#469d9c", "#b1af3c","#ef2e32"];
const color = colors[Math.floor(Math.random() * colors.length)];
function HeaderX(props) {
  const {userID} = props;
  // holds the name of the student
  const [points, setPoints] = useState("...");
  useEffect(() => {
    const unsubscribe = userID.onSnapshot((snapshot)=>{
      setPoints(snapshot.data().totalPoints);
    })
    return unsubscribe;
  })

  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.filler}>
        <View style={styles.topArea}>
          <View style={styles.totalPointsArea}>
            <Icon
              style={styles.starIcon}
              solid
              color = "#FFC82F"
              size = {40}
              name = 'star'
              type = 'font-awesome-5'
            />
            <Text style={styles.totalPoints}>
              {points}
            </Text>
          </View>
        </View>
        <View style={styles.bottomArea}>
          <Text style={styles.fullName} numberOfLines={1}>
            {props.name}
          </Text>
          <Text style={styles.pointsDesc}>
          Your total Points
          </Text>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/3-removebg-preview.png")}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
    flexDirection: "row",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "flex-end",
    paddingTop: 5,
    paddingBottom: 10,
  },
  filler: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
  },
  totalPointsArea: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  starIcon:{
    margin: 5,
    transform: [{ rotate: "-15deg" }],
  },
  totalPoints:{
    fontSize: 45,
    color: "#000",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
    marginRight: 10,
  },
  bottomArea:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
  },
  fullName:{
    flex: 1,
    fontWeight: "bold",
    fontSize: 20,
    color: "#000",
  },
  pointsDesc:{
    flex: 2,
    fontSize: 15,
    color: "#000",
    textAlign: "center",
  },
  logoContainer:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  logo: {
    width: 50,
    height: 20,
  }
});

export default HeaderX;
