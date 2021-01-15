import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity, FlatList, ScrollView, Alert
} from "react-native";
import AccountEnter from "../components/AccountEnter";
import { firebase } from "../firebase/config";
import { NavigationHelpersContext } from "@react-navigation/native";
import prompt from 'react-native-prompt-android';


function ChooseAccount({ routes, navigation }) {
  const [childAccounts, setChildAccounts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const user = firebase.auth().currentUser;
  const userEmail = user.email;

  if (!user) {
    return null;
  }

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot(data => {
        let userinfo = data.data();

        if (userinfo.student != null && userinfo.student.length > 0) {
          setChildAccounts(userinfo.student);
          setLoaded(true);
        } else { // user has left during sign-up process and has not added children yet
          setLoaded(false);
          navigation.navigate('AddChildAccount', { buttonText: 'Save'});
        }
      }, err => {
        alert('Error retrieving children. Please try again later.');
      });
    return () => unsubscribe()
  },[firebase.firestore]);


  let enterAccount=(userID, studentName)=>{
    navigation.navigate("Channels", {
      // getting an warning because passing non serialized value
      userID: firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .collection('students')
          .doc(userID),
      studentName: studentName,
      studentID: userID
    });
  };


  const parentPageLogin = (password) => {
    const credential = firebase.auth.EmailAuthProvider.credential(
      userEmail,
      password
    );

    // verify the user's password
    user.reauthenticateWithCredential(credential).then(function () {
      navigation.navigate("ParentPage", { childAccounts: childAccounts})
    }).catch(function (error) {
      Alert.alert(
        'Oops!',
        'Incorrect password. Please try again.',
        [
          { text: 'OK', onPress: () => { } },
        ],
        { cancelable: true },
      );
    });
  }

  const promptPassword = () => prompt(
    'Enter parent password',
    'Please enter your password to see stats, settings, and billing.',
    [
      { text: 'Cancel', onPress: () => { } },
      {
        text: 'OK', onPress: (password) => { parentPageLogin(password) }
      },
    ],
    {
      type: 'secure-text',
      cancelable: false,
      defaultValue: '',
      placeholder: 'Password'
    }
  );

  if (!loaded) {

    return null

  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title} testID={'Who\'s Watching ThinkStation?'}>
          Who&#39;s Watching ThinkStation?
            </Text>
        <FlatList
          style={styles.area}
          numColumns={2}
          keyExtractor={(item) => item.displayName}
          data={childAccounts}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => enterAccount(item.id, item.displayName)} style={styles.accountEnter} testID={item.displayName}>
              <AccountEnter name={item.displayName} age={item.displayAge} />
            </TouchableOpacity>
          )}
        >
        </FlatList>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => { promptPassword() }}
          testID={'parentPage'}
        >
          <Text style={styles.buttonText}>Parent Login / Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(255,255,255)",
    padding: '10%',
    alignSelf: 'stretch',
    alignItems: "center",
  },
  area: {
    width: "100%",
  },
  title: {
    width: '70%',
    marginBottom: '10%',
    fontFamily: "OpenSans_700Bold",
    textAlign: "center",
    fontSize: 30,
    color: "rgba(0,0,0,1)",
  },
  scrollArea_contentContainerStyle: {
    width: "100%",
    height: "50%",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addStudentButton: {
    height: "10%",
    borderRadius: 5,
    backgroundColor: "rgba(225,148,45,1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
    margin: "5%"
  },
  icon8: {
    color: "rgba(255,255,255,1)",
    fontSize: 40,
    margin: 5
  },
  addAnotherAccount: {
    width: "80%",
    color: "rgba(255,255,255,1)",
    fontFamily: "OpenSans_600SemiBold",
    alignSelf: "center",
    margin: "20%"
  },
  accountEnter: {
    margin: "2%",
    flex: 1,
    flexGrow: 1
  },
  buttonContainer: {
    height: '10%',
    width: '100%',
    margin: '2%',
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "rgba(225,148,45,1)",
    borderRadius: 5,
    justifyContent: "center"
  },
  buttonText: {
    color: "rgba(255,255,255,1)",
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 20,
    textAlign: "center",
    alignSelf: "center"
  }
});

export default ChooseAccount;
