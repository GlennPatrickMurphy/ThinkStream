import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import ToggleSwitch from 'toggle-switch-react-native';
import { firebase } from "../firebase/config";
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";


function Settings(props, navigation) {

    const user = firebase.auth().currentUser;

    const [isToggled, setIsToggled] = useState(false);
    const [feedback, setFeedback] = useState('');
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
                console.log(response);
            });

            // unsubscribe when component unmounts
            return () => {
                Notifications.removeNotificationSubscription(notificationListener);
                Notifications.removeNotificationSubscription(responseListener);
            };
        }
    }, []);

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

            // ask for permission if not already given
            if (existingStatus !== 'granted') {
                const { status: newStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = newStatus;
            }
            token = (await Notifications.getExpoPushTokenAsync({ experienceId })).data;

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


    firebase.firestore().collection('users').doc(user.uid).get().then(data => {
        let userinfo = data.data();
        setIsToggled(userinfo.notificationToken !== "disabled" ? true : false);
    }).catch(() => {
        alert('Error getting notification permission.');
    });

    async function isGranted() {
        if (Constants.isDevice) {
            if (Platform.OS === 'ios') {
                await Permissions.askAsync(Permissions.NOTIFICATIONS); //there's an ios bug that needs you to call askAsync again for getAsync to work
            }
            const { status: newStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
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

    async function toggleNotifications() {

        if (!isToggled) { //turning notifications from off to on
            // get them to allow notifications in their settings page

            if (await isGranted() === true) {
                setIsToggled(true);
                registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
                firebase.firestore().collection('users').doc(user.uid).update({
                    notificationToken: expoPushToken
                }).catch(() => {
                    alert('Error turning on notifications. Please try again later.');
                });

            } else {
                Alert.alert(
                    'Enable Notifications',
                    'Please enable notifications for ThinkStation in your settings. Notifications will remind you when a ThinkStation stream will begin.',
                    [
                        { text: 'Cancel', onPress: () => { } },
                        { text: 'Open Settings', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
                    ],
                    { cancelable: true },
                );
            }
        } else { // turning notifications from on to off
            setIsToggled(false);
            firebase.firestore().collection('users').doc(user.uid).update({
                notificationToken: "disabled"
            }).catch(() => {
                alert('Error turning off notifications. Please try again later.');
            });

        }
    }

    const submitFeedback = () => {

        if (feedback === "") { //make sure the feedback box isn't empty
            alert("Please enter a message.");
            return;
        }

        const ref = firebase.database().ref('feedback');

        const data = {
            message: feedback,
            userid: user.uid,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
        };
        ref.push(data, (error) => {
            if (error) {
                console.error("Error submitting feedback: " + error);
                alert('Error submitting feeback. Please try again in a moment.');

            } else {
                Alert.alert(
                    'Submitted',
                    'Thanks for your feedback!',
                    [
                        { text: 'OK', onPress: () => {} },
                    ],
                    { cancelable: true },
                );
                setFeedback('');
            }
        });
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.childrenScheduleButtons}
                onPress={() => props.navigation.navigate('AddChildAccount', {buttonText: 'Save'})}
                testID={'settingsAddChildren'}>
                <View style={styles.iconAndText}>
                    <MaterialCommunityIconsIcon
                        name="account-plus"
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>Add Children</Text>
                </View>
                <MaterialCommunityIconsIcon
                    name="chevron-right"
                    style={styles.arrowIconChildren}
                />
            </TouchableOpacity>
            {/*<View style={styles.divider} />*/}
            {/*<TouchableOpacity*/}
            {/*    style={styles.childrenScheduleButtons}*/}
            {/*    onPress={() => props.navigation.navigate('Schedule', { user: user, buttonText: 'Save' })}>*/}
            {/*    <View style={styles.iconAndText}>*/}
            {/*        <MaterialCommunityIconsIcon*/}
            {/*            name="clock-outline"*/}
            {/*            style={styles.icon}*/}
            {/*        />*/}
            {/*        <Text style={styles.buttonText}>Edit Schedule</Text>*/}
            {/*    </View>*/}
            {/*    <MaterialCommunityIconsIcon*/}
            {/*        name="chevron-right"*/}
            {/*        style={styles.arrowIconSchedule}*/}
            {/*    />*/}
            {/*</TouchableOpacity>*/}
            <View style={styles.divider} />
            <View style={styles.notifications}>
                <Text style={styles.notificationsText} testID={'notifications'}>Stream Notifications</Text>
                <ToggleSwitch style={styles.notificationsToggle}
                    isOn={isToggled}
                    onColor="rgba(225,148,45,1)"
                    offColor="gray"
                    label=""
                    labelStyle={{ color: "black", fontWeight: "900" }}
                    size="large"
                    onToggle={async function () { toggleNotifications() }}
                />
            </View>
            <View style={styles.divider} />
            <View style={styles.feedback}>
                <Text style={styles.loveFeedback}>
                    We'd love to hear your feedback!
                </Text>
                <TextInput
                    placeholder="Send us a message..."
                    placeholderTextColor="#454545"
                    style={styles.feedbackTextInput}
                    onChangeText={text => setFeedback(text)}
                    value={feedback}
                    multiline={true}
                    testID={'feedback'}
                />
                <TouchableOpacity
                style={styles.feedbackSubmit}
                onPress={() => submitFeedback()}
                testID={'submitFeedback'}>
                    <Text style={{ color: "white" }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '8%',
        marginTop: -25,
        flexDirection: "column",
        justifyContent: "space-evenly",
        backgroundColor: 'white',
    },
    divider: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    iconAndText: {
        flexDirection: "row",
    },
    childrenScheduleButtons: {
        marginTop: '15%',
        height: '12%',
        width: '100%',
        margin: '2%',
        flexDirection: "row",
        justifyContent: "space-between"
    },
    buttonText: {
        color: "black",
        fontFamily: "OpenSans_400Bold",
        fontSize: 22,
        alignSelf: "flex-start",
        justifyContent: "center",
        marginTop: '4%',
        alignItems: "center",
    },
    icon: {
        color: "black",
        fontSize: 40,
        margin: 5,
        paddingRight: '10%'
    },
    arrowIconChildren: {
        color: "black",
        fontSize: 40,
        margin: 5,
        paddingRight: '5%',
    },
    arrowIconSchedule: {
        color: "black",
        fontSize: 40,
        margin: 5,
        paddingRight: '5%',
    },
    notifications: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: '15%',
        margin: '2%',
        marginBottom: '15%',
    },
    notificationsText: {
        color: "rgba(0,0,0,1)",
        fontFamily: "OpenSans_400Bold",
        fontSize: 22,
        textAlign: "left",
        alignSelf: "flex-end",
    },
    feedback: {
        marginTop: '15%',
        alignItems: "flex-start",
    },
    loveFeedback: {
        color: "rgba(0,0,0,1)",
        fontFamily: "OpenSans_400Bold",
        fontSize: 22,
        textAlign: "left",
    },
    feedbackTextInput: {
        height: '50%',
        width: '100%',
        maxHeight: '50%',
        maxWidth: '100%',
        borderColor: "black",
        borderWidth: 1.5,
        borderRadius: 5,
        textAlign: "left",
        textAlignVertical: "top",
        color: "rgba(0,0,0,1)",
        fontFamily: "OpenSans_400Regular",
        fontSize: 20,
        alignSelf: "center",
        marginTop: '2%',
        backgroundColor: "#f0f0f0",
        paddingLeft: '2%',
    },
    feedbackSubmit: {
        marginTop: '2%',
        height: '10%',
        width: '22%',
        flexDirection: "row",
        backgroundColor: "rgba(225,148,45,1)",
        justifyContent: "center",
        alignSelf: "flex-end",
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "gray",
        padding: '2%',
    },
});

export default Settings;

