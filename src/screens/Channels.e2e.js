import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  ImageBackground,
  FlatList,
  ActivityIndicator
} from "react-native";
import HeaderX from "../components/HeaderX";
import { firebase } from "../firebase/config";

function Channels({ route, navigation }) {
  const { userID } = route.params;
  const [initialized, setInitialization] = useState(false);
  const [playlist, setPlaylist] = useState('');
  const [disableStream, setDisableStream] = useState(true);


  //-----------------------------------------------------------------------------------------------------------------
  // FOR DETOX TESTING: EXTRA CODE TO DELETE TEST USER AFTER 'CREATE ACCOUNT'/'LEAVING DURING CREATE ACCOUNT' TESTS
  const user = firebase.auth().currentUser;
  console.log(user);

  // only want to delete the account for the 'createaccount' test and not other tests
  if (user && user.email === "deleteme@test.com") {

    console.log("mock deleting user");

    // ---- delete test account from firebase auth ----
    user.delete().then(function () {
      console.log("user deleted from firebase auth");
    }).catch(function (error) {
      alert("Detox Testing: Error deleting test user");
    });


    // ---- delete test account from firestore ----
    // need to delete innermost document/collection in firestore first, then work outwards to highest level
    // the following code deletes children, then the user

    //delete children documents from firestore
    firebase.firestore().collection("users")
      .doc(user.uid)
      .collection("students")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          firebase.firestore().collection("users")
            .doc(user.uid)
            .collection("students")
            .doc(doc.id)
            .delete().then(() => {
              console.log("child deleted: " + doc.id);
            }).catch((error) => {
              console.error("Detox: error deleting child with id " + doc.id + ": ", error);
            });
        });
      })
      .then(() => {
        firebase.firestore().collection("users").doc(user.uid).delete().then(() => {
          console.log("user deleted: " + user.uid);
        }).catch((error) => {
          console.error("Detox: error deleting child with id " + user.uid + ": ", error);
        });
      })
      .catch((error) => {
        console.error("Detox: error deleting child with id" + user.uid + ": ", error);
      });
  }
  //-----------------------------------------------------------------------------------------------------------------


  function compare_item(a, b) {
    // a should come before b in the sorted order
    if (a.time < b.time) {
      return -1;
      // a should come after b in the sorted order
    } else if (a.time > b.time) {
      return 1;
      // and and b are the same
    } else {
      return 0;
    }
  }

  useEffect(() => {
    // get firebase playlist
    // const ref = firebase.database().ref('playlist')

    // const listener =   ref.on('value', (snapshot) => {
    //   if (snapshot.exists()) {
    //     let results = Object.values(snapshot.val());
    //     let db_data = results.sort(compare_item);

    //     // Gets the days stream and removes streams that have ended
    //     // gets unix time stamp
    //     let currentTime = Math.floor(Date.now())

    //     // current day creates a Unix Timestamp of today
    //     let currentDay = new Date().setHours(0, 0, 0, 0);

    //     // filter out the streams that are done or not scheduled on this day
    //     setPlaylist(db_data.filter(item => {

    //       // get the day that the stream is scheduled
    //       let streamDay = new Date(item.startTime).setHours(0, 0, 0, 0);

    //       // returns only streams that are still running and or haven't started for today.
    //       return item.endTime > currentTime && streamDay === currentDay
    //     }));

    //     // does not disable buttons
    //     setDisableStream(false);
    //   } else {
    //     // if no playlist
    //     setPlaylist([{
    //       displayTitle: "No Streams Available",
    //       description: "Streams Occur Monday, Wednesday and Friday @ 4pm",
    //       time: "16:00",
    //       title: "nostream",
    //       image: "https://i.imgur.com/Oup90eq.png"
    //     }]);
    //     // disables buttons if no stream
    //     setDisableStream(true);
    //   }


    // DETOX MOCKING TEST CLASSROOM 
    let data = [{
      "description": "detox testing",
      "displayTitle": "Detox Test Channel",
      "endTime": 1605200711765,
      "image": "",
      "muxid": "fQ4lNLNN6I00JK9FLA11BcPHvcbAx7ldULCcJsS01ovmI",
      "startTime": 1605200711765,
      "students": 17,
      "time": "0:00",
      "title": "7UQVvaRaUDVFyLMkQjWzo92ZxfURdZP1fn52U8kwGi4"
    }]

    setPlaylist(data);
    setDisableStream(false);
    //shows streams
    setInitialization(true);

}, [])

const enterClassRoom = (userID, item) => {
  let updates = {}
  updates[item.title + "/students"] = item.students + 1;
  firebase.database().ref('playlist')
    .update(updates);
  navigation.navigate("Classroom", { userID: userID, stream: item })
};

if (!initialized) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0)" />
      <HeaderX
        icon2Family="Feather"
        icon2Name="search"
        style={styles.headerX}
      />
      <View style={styles.body}>

        <View style={styles.indicator}>
          <ActivityIndicator size="large" color="rgba(225,148,45,1)" />
        </View>

      </View>
    </View>

  )
} else {
  console.log("playlist");
  console.log(playlist);
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0)" />
      <HeaderX
        icon2Family="Feather"
        icon2Name="search"
        style={styles.headerX}
      />
      <View style={styles.body}>
        <FlatList
          keyExtractor={(item) => item.title}
          data={playlist}
          renderItem={({ item }) => (
            <TouchableOpacity disabled={disableStream} style={styles.button2}
              onPress={() => enterClassRoom(userID, item)}
              testID={item.displayTitle}
            >

              <ImageBackground
                source={{ uri: item.image }}
                resizeMode="cover"
                style={styles.image}
                imageStyle={styles.image_imageStyle}
              >
                <View style={styles.rect8}>
                  <Text style={[styles.text22, { fontWeight: 'bold' }]}>{item.displayTitle} @ {item.time}</Text>
                  <Text style={styles.text22}>{item.description}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}>
        </FlatList>
      </View>
    </View>
  );
}
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgb(255,255,255)"
  },
  headerX: {
    height: 80,
    elevation: 15,
    shadowOffset: {
      height: 7,
      width: 1
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  body: {
    flex: 1
  },
  tabs: {
    height: 80,
    backgroundColor: "rgba(225,148,45,1)",
    flexDirection: "row",
    elevation: 0,
    shadowOffset: {
      height: 0,
      width: 0
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowRadius: 0,
    justifyContent: "space-around",
    alignItems: "baseline"
  },
  popular: {
    width: 100,
    height: 38,
    backgroundColor: "rgba(247,247,247,0)",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
    alignSelf: "center"
  },
  streams: {
    color: "rgba(255,255,255,1)"
  },
  categories: {
    backgroundColor: "rgba(255,255,255,1)",
    alignItems: "center",
    flex: 1
  },
  button2: {
    height: 313,
    backgroundColor: "rgba(230, 230, 230,1)",
    elevation: 18,
    borderRadius: 5,
    overflow: "hidden",
    margin: 10,
    alignSelf: "stretch"
  },
  image: {
    flex: 1
  },
  indicator: {
    flex: 1,
    justifyContent: "center"
  },
  rect8: {
    height: 35,
    backgroundColor: "rgba(21,19,19,0.5)",
    justifyContent: "center",
    marginBottom: 1
  },
  text22: {
    color: "rgba(247,252,253,1)",
    fontSize: 14,
    fontFamily: "OpenSans_400Regular",
    textAlign: "center",
    alignSelf: "center"
  },
  button3: {
    height: 313,
    backgroundColor: "rgba(230, 230, 230,1)",
    elevation: 18,
    borderRadius: 5,
    overflow: "hidden",
    margin: 10,
    alignSelf: "stretch"
  },
  image2: {
    flex: 1
  },
  image2_imageStyle: {},
  rect82: {
    height: 27,
    backgroundColor: "rgba(21,19,19,0.5)",
    justifyContent: "center"
  },
  ipsum: {
    color: "rgba(247,252,253,1)",
    fontSize: 14,
    fontFamily: "OpenSans_400Regular",
    textAlign: "center",
    alignSelf: "center"
  },
  button4: {
    height: 313,
    backgroundColor: "rgba(230, 230, 230,1)",
    elevation: 18,
    borderRadius: 5,
    overflow: "hidden",
    margin: 10,
    alignSelf: "stretch"
  },
  image3: {
    flex: 1
  },
  image3_imageStyle: {},
  rect83: {
    height: 27,
    backgroundColor: "rgba(21,19,19,0.5)",
    justifyContent: "center",
    marginBottom: 1
  },
  lorem: {
    color: "rgba(247,252,253,1)",
    fontSize: 14,
    fontFamily: "OpenSans_400Regular",
    textAlign: "center",
    alignSelf: "center"
  },
  button5: {
    height: 313,
    backgroundColor: "rgba(230, 230, 230,1)",
    elevation: 18,
    borderRadius: 5,
    overflow: "hidden",
    margin: 10,
    alignSelf: "stretch"
  },
  image4: {
    flex: 1
  },
  image4_imageStyle: {},
  rect84: {
    height: 27,
    backgroundColor: "rgba(21,19,19,0.5)",
    marginBottom: 1
  },
  ipsum2: {
    color: "rgba(247,252,253,1)",
    fontSize: 14,
    fontFamily: "OpenSans_400Regular",
    textAlign: "center",
    marginTop: 7,
    alignSelf: "center"
  },
  button7: {
    width: 428,
    height: 313,
    backgroundColor: "rgba(230, 230, 230,1)",
    elevation: 18,
    borderRadius: 5,
    overflow: "hidden",
    margin: 10
  },
  image22: {
    flex: 1,
    marginBottom: -1,
    marginTop: 1
  },
  image22_imageStyle: {},
  rect85: {
    height: 27,
    backgroundColor: "rgba(21,19,19,0.5)",
    width: 150,
    marginBottom: 2,
    alignSelf: "center"
  },
  lorem3: {
    color: "rgba(247,252,253,1)",
    fontSize: 14,
    fontFamily: "OpenSans_400Regular",
    textAlign: "center",
    marginTop: 7,
    alignSelf: "center"
  },
  button6: {
    width: 428,
    height: 313,
    backgroundColor: "rgba(230, 230, 230,1)",
    elevation: 18,
    borderRadius: 5,
    overflow: "hidden",
    margin: 10
  },
  image32: {
    flex: 1,
    marginBottom: -1,
    marginTop: 1
  },
  image32_imageStyle: {},
  rect86: {
    height: 27,
    backgroundColor: "rgba(21,19,19,0.5)",
    marginBottom: 1
  },
  ipsum3: {
    color: "rgba(247,252,253,1)",
    fontSize: 14,
    fontFamily: "OpenSans_400Regular",
    textAlign: "center",
    marginTop: 6,
    alignSelf: "center"
  }
});

export default Channels;
