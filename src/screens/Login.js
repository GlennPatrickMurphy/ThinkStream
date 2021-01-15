import React, {useEffect, useState} from 'react'
import {
    StyleSheet,
    View,
    Image,
    TextInput,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Linking,
    YellowBox,
    LogBox
} from "react-native";
import { firebase } from '../firebase/config';
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Dialog from "react-native-dialog";

function Login({ navigation }) {

    // Email and password state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);

    // firebase login function
    const onLoginPress = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                // get the uid
                const uid = response.user.uid;
                // get user info from firestore
                const usersRef = firebase.firestore().collection('users');
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.");
                            return;
                        }
                        const user = firestoreDocument.data();
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alert(error)
            })
    };



    const body = () => (
        <View style={styles.header}>
            <View style={styles.logo}>
                <Image
                    source={require("../assets/images/1-removebg-preview1.png")}
                    resizeMode="contain"
                    style={styles.image}
                />
            </View>
            <View>
                <Dialog.Container visible={dialogVisible} testID={'privacyPolicy'}>
                    <Dialog.Title>Privacy Policy</Dialog.Title>
                    <Dialog.Description>
                            By clicking continue you are verifying that you are above the age of 18 and that you agree to our
                                Terms and Conditions
                                Privacy Policy.
                    </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={() => setDialogVisible(!dialogVisible)} />
                    <Dialog.Button label="Continue" onPress={() => {
                        setDialogVisible(!dialogVisible);
                        navigation.navigate('Welcome')
                    }
                    } />
                </Dialog.Container>
            </View>
            <View style={styles.container}>
                <View style={styles.textBox}>
                    <MaterialCommunityIconsIcon
                        name="account-circle"
                        style={styles.iconCircle}
                    />
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="rgba(0,0,0,1)"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        secureTextEntry={false}
                        style={styles.usernameInput}
                        testID={'email'}
                    />
                </View>
                <View style={styles.textBox}>
                    <MaterialCommunityIconsIcon
                        name="key"
                        style={styles.iconCircle}
                    />
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={true}
                        textContentType="oneTimeCode"
                        style={styles.passwordInput}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        placeholderTextColor="rgba(0,0,0,1)"
                        testID={'password'}
                    />
                </View>
                <TouchableOpacity
                    style={styles.loginContainer}
                    onPress={() => onLoginPress()}
                    testID={'login'}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.createAccountContainerAndroid}
                    onPress={() => setDialogVisible(!dialogVisible)}
                    testID={'createAccount'}>
                    <Text style={styles.createAccountText}>Create Account</Text>
                </TouchableOpacity>

            </View>
        </View>
    )


    if (Platform.OS == "ios") {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.header}>
                {body()}
            </KeyboardAvoidingView>

        )
    } else {
        return (
            <View style={{ flex: 1 }}>
                {body()}
            </View>

        )
    }
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
        paddingLeft: '10%',
        paddingRight: '10%',
        paddingTop: 0,
        paddingBottom: 0,
        margin: 0,
        alignSelf: 'stretch',
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: '100%',
        height: '30%',
    },
    image: {
        width: '110%',
        height: '100%',
        marginTop: 50,
        alignSelf: "center",
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
        padding:5

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
        padding:5

    },
    or: {
        fontFamily: "OpenSans_400Regular",
        color: "#121212",
        textAlign: "center",
        width: '50%',
        height: '5%',
        letterSpacing: 0,
        fontSize: 20,
        margin: '2%',
    },
    loginContainer: {
        height: '10%',
        width: '100%',
        margin: '2%',
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: "rgba(225,148,45,1)",
        borderRadius: 5,
        justifyContent: "center"
    },
    loginText: {
        color: "rgba(255,255,255,1)",
        fontFamily: "OpenSans_600SemiBold",
        fontSize: 20,
        textAlign: "center",
        alignSelf: "center"
    },
    createAccountContainerAndroid: {
        marginTop: 30,
        height: '10%',
        width: '100%',
        margin: '2%',
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 5,
        justifyContent: "center",
        borderColor: "rgba(225,148,45,1)",
        borderWidth: 2,
    },
    createAccountContainerIOS: {
        height: '10%',
        width: '100%',
        margin: '2%',
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 5,
        justifyContent: "center",
        borderColor: "rgba(225,148,45,1)",
        borderWidth: 2,
    },
    createAccountText: {
        color: "rgba(225,148,45,1)",
        fontFamily: "OpenSans_600SemiBold",
        fontSize: 20,
        textAlign: "center",
        alignSelf: "center",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalButtons: {
        backgroundColor: 'red',
    }
});
export default Login;
