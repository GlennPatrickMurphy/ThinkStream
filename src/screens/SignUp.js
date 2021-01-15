import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity
} from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { firebase } from '../firebase/config';

function SignUp({ route, navigation }) {
  // passed prop from last screen
  const { notification } = route.params;

  // state for all text inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');


  const onSignUpPress = () => {
    if (password !== passwordTwo) {
      alert("Passwords do not match")
    } else {

      // add user to firebase authentication
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          // User is signed in.
          let uid = response.user.uid;
          let user = response.user;

          // data to be stored in firestore
          let data = {
            "email": email.toLowerCase(),
            "name": name,
            "sectiona": false,
            "sectionb": false,
            "sectionc": false,
            "sectiond": false,
            "sectione": false,
            "notificationToken": (typeof notification === "undefined" ? "disabled" : notification)
          };

          // store user info in firestore
          firebase.firestore().collection('users').doc(uid).set(data);

          // go to the next screen and pass user prop
          navigation.navigate('AddChildAccount', {buttonText: 'Go to Login'});
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          alert("Something Went Wrong Try Again : " + errorMessage);
          // ...
        });

    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <Text style={styles.title} testID={'createParentAccount'}>Create {"\n"}Account</Text>
        <View style={styles.textBox}>
          <MaterialCommunityIconsIcon
            name="account-circle"
            style={styles.iconCircle}
          />
          <TextInput
            placeholder="Name"
            placeholderTextColor="rgba(0,0,0,1)"
            secureTextEntry={false}
            onChangeText={(text) => setName(text)}
            style={styles.usernameInput}
            testID={'parentName'}
          />
        </View>
        <View style={styles.textBox}>
          <MaterialCommunityIconsIcon
            name="account-card-details"
            style={styles.iconCircle}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(0,0,0,1)"
            secureTextEntry={false}
            style={styles.usernameInput}
            onChangeText={(text) => setEmail(text)}
            testID={'companyEmail'}
          />
        </View>
        <View style={styles.textBox}>
          <MaterialCommunityIconsIcon
            name="key"
            style={styles.iconCircle}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(0,0,0,1)"
            secureTextEntry={true}
            textContentType="oneTimeCode"
            style={styles.passwordInput}
            onChangeText={(text) => setPassword(text)}
            testID={'createParentPassword'}
          />
        </View>
        <View style={styles.textBox}>
          <MaterialCommunityIconsIcon
            name="key"
            style={styles.iconCircle}
          />
          <TextInput
            placeholder="Retype Password"
            placeholderTextColor="rgba(0,0,0,1)"
            secureTextEntry={true}
            textContentType="oneTimeCode"
            style={styles.passwordInput}
            onChangeText={(text) => setPasswordTwo(text)}
            testID={'retypeParentPassword'}
          />
        </View>
        <TouchableOpacity
          onPress={() => onSignUpPress()}
          style={styles.buttonContainer}
          testID={'gotoCreateChildAccounts'}>
          <Text style={styles.buttonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({

  header: {
    flex: 1,
    backgroundColor: "rgb(255,255,255)",
    padding: 0,
    alignSelf: 'stretch',
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "rgb(255,255,255)",
    padding: '10%',
    alignSelf: 'stretch',
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
  },
  title: {
    width: '70%',
    marginTop: '20%',
    marginBottom: '10%',
    fontFamily: "OpenSans_700Bold",
    textAlign: "center",
    fontSize: 25,
    color: "rgba(0,0,0,1)",
  },
  textBox: {
    height: '10%',
    width: '100%',
    margin: '2%',
    backgroundColor: "rgba(251,247,247,0.25)",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000000",
    flexDirection: "row",
    alignSelf: "center",
    padding: '3%',
  },
  iconCircle: {
    color: "rgba(0,0,0,1)",
    fontSize: 30,
    alignSelf: "center",
    paddingBottom: '1%'
  },
  usernameInput: {
    height: 30,
    color: "rgba(0,0,0,1)",
    fontFamily: "OpenSans_400Regular",
    fontSize: 20,
    flex: 1,
    marginRight: 11,
    marginLeft: 11,
    alignSelf: "center",
    padding: 5

  },
  passwordInput: {
    height: 30,
    color: "rgba(0,0,0,1)",
    fontFamily: "OpenSans_400Regular",
    fontSize: 20,
    flex: 1,
    marginRight: 11,
    marginLeft: 11,
    alignSelf: "center",
    padding: 5
  },
  buttonContainer: {
    height: '10%',
    width: '100%',
    marginTop: '10%',
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
  },
});
export default SignUp;
