import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function Welcome({ navigation }) {
  // push notification state
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // check the os of device, run as long as its not undefined
    if (Platform.OS !== 'undefined') {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        //console.log(response);
      });

      // unsubscribe when component unmounts
      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    }
  }, []);


  async function isGranted() {
    if (Constants.isDevice) {
      if (Platform.OS === 'ios') {
        await Permissions.askAsync(Permissions.NOTIFICATIONS); //there's an ios bug that needs you to call askAsync again for getAsync to work
      }
      const {status: newStatus} = await Permissions.getAsync(Permissions.NOTIFICATIONS);

      console.log(newStatus);
      if (newStatus === 'granted') {
        console.log('granted');
        return true;
      }
      console.log('cancelled')
      return false;
    }
    console.log('Must use physical device for Push Notifications')
    return true;
  }

  const alertPermission = () => new Promise((resolve) => {
    Alert.alert(
        'Enable Notifications',
        'Please enable notifications for ThinkStation in your settings to continue. Notifications will remind you when a ThinkStation stream will begin.',
        [
          // If they said no initially and want to change their mind,
          // we can automatically open our app in their settings
          // so there's less friction in turning notifications on
          { text: 'No Notifications', onPress: () => navigation.navigate('Sign Up', { notification: "cancelled" })},
          { text: 'Enable Notifications', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
          ],
        { cancelable: false },
    );
  });


  async function registerForPushNotificationsAsync() {
    let token;
    let experienceId = undefined;
    if (!Constants.manifest) {
      // Absence of the manifest means we're in bare workflow
      experienceId = '@thinkstation/ThinkStation';
    }
    if (Constants.isDevice) {

      // see if they already have permission
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      console.log(existingStatus);

      // ask for permission if not already given
      if (existingStatus !== 'granted') {
        const { status: newStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = newStatus;
      }
      token = (await Notifications.getExpoPushTokenAsync({experienceId})).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    //specific to android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image
          source={require("../assets/images/1-removebg-preview1.png")}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
      <ScrollView>
        <Text style={styles.text1} testID={'welcomeText1'}>
          Welcome to ThinkStation! We run Interactive and
          Educational Streams for ages 5 to 10.{"\n"}
          To get started, we will: {"\n"}{"\n"}
        </Text>
        <Text style={styles.text2} testID={'welcomeText2'}>
          1. Setup Your Account{"\n"}{"\n"}
          2. Setup Your Kid's Accounts
        </Text>
      </ScrollView>
      <TouchableOpacity
          // only navigate to 'sign up' screen if notification permission is granted
          onPress={async function checkGranted() { await isGranted() ? navigation.navigate('Sign Up', { notification: expoPushToken }) : alertPermission() }}
          style={styles.buttonContainer}
          testID={'continueToSignup'}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(255,255,255)",
    padding: '10%',
    alignSelf: 'stretch',
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: '100%',
    height: '30%',
  },
  image: {
    width: '100%',
    height: '100%',
    marginTop: 15,
    alignSelf: "center"
  },
  text1: {
    fontFamily: "OpenSans_400Regular",
    color: "rgba(0,0,0,1)",
    height: 180,
    width: 290,
    textAlign: "center",
    fontSize: 20,
  },
  text2: {
    fontFamily: "OpenSans_400Regular",
    color: "rgba(0,0,0,1)",
    height: 180,
    width: 290,
    textAlign: "left",
    fontSize: 20,
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

export default Welcome;
