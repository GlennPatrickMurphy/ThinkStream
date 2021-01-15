import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    Text
} from "react-native";
import AccountEnterWithDelete from "../components/AccountEnterWithDelete";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { firebase } from "../firebase/config";

function AddChildAccount({ route, navigation }) {

    const user = firebase.auth().currentUser;
    const { buttonText } = route.params;
    const [existingChildAccounts, setExistingChildAccounts] = useState([]);
    const [childAccounts, setChildAccounts] = useState([]);
    const [age, setAge] = useState(0);
    const [name, setName] = useState('');


    // grab existing child accounts to display if editing child accounts from the settings page
    // if this is a new user signing up, no child accounts will be grabbed
    useEffect(() => {
        firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .get()
            .then(data => {
                let userinfo = data.data();

                // only set existing users if they exist
                if (userinfo.student != null && userinfo.student.length > 0) {
                    setExistingChildAccounts(userinfo.student);
                }
            }).catch(() => {
                alert('Error retrieving children. Please try again later.');
            });
    }, []);

    // holds child accounts as a state and resets text inputs
    const addStudent = () => {
        const id = '_' + Math.random().toString(36).substr(2, 9);
        if (name.length > 0) { //displayAge is hardcoded to 0 for now
            setChildAccounts(childAccounts.concat({ "displayName": name, "displayAge": 0, "id": id }));
        }

        setName('');
        setAge('0'); //hard code to 0 for now

    };


    const deleteChild = (studentName, studentId) => {

        // delete child from firebase
        const userRef = firebase.firestore().collection("users").doc(user.uid);

        userRef
            .collection("students")
            .doc(studentId)
            .delete()
            .then(() => {
                userRef.update({
                    "student": firebase.firestore.FieldValue.arrayRemove({
                        "displayAge": 0,
                        "displayName": studentName,
                        "id": studentId
                    })
                });
                console.log("child deleted: " + studentName + " with id " + studentId);
            })
            .catch(() => {
                alert('Error deleting child ' + studentName + '. Please try again later.');
            });

        setChildAccounts(childAccounts.filter(child => { return child.id != studentId; }));
        setExistingChildAccounts(existingChildAccounts.filter(child => { return child.id != studentId; }));

    }


    // once pressed adds all child accounts to firebase
    const finishSignUp = () => {
        if (existingChildAccounts.concat(childAccounts).length == 0) {
            alert("Make sure to add a child account");
        } else {
            const ref = firebase.firestore().collection('users').doc(user.uid);

            childAccounts.forEach(item => {
                const data = {
                    displayName: item.displayName,
                    displayAge: item.displayAge,
                    id: item.id
                };

                ref.update({
                    student: firebase.firestore.FieldValue.arrayUnion(data)
                })
                .then(() => {
                    ref.collection('students').doc(item.id).set(item);
                })
                .catch(() => {
                    alert('Error adding children. Please try again later.');
                });

            });

            navigation.goBack(); //return to 'settings'/'choose account' page
             // this will update the children when returning to the 'choose account' page
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Make Child Account</Text>
            <FlatList
                style={styles.area}
                numColumns={2}
                keyExtractor={(item) => item.displayName}
                data={existingChildAccounts.concat(childAccounts)}
                persistentScrollbar={true}
                renderItem={({ item }) => (
                    <AccountEnterWithDelete name={item.displayName} age={item.displayAge} studentId={item.id} onDelete={deleteChild} testID={item.displayName} />
                )}

            />
            <View style={styles.textBox}>
                <MaterialCommunityIconsIcon
                    name="account"
                    style={styles.iconCircle}
                />
                <TextInput
                    placeholder="Profile Nickname"
                    placeholderTextColor="rgba(0,0,0,0.75)"
                    secureTextEntry={false}
                    style={styles.usernameInput}
                    onChangeText={text => setName(text)}
                    value={name}
                    testID={'nickname'}
                />
            </View>
            <TouchableOpacity
                onPress={() => addStudent()}
                style={styles.addStudentButton}
                testID={'addStudent'}
            >
                <MaterialCommunityIconsIcon
                    name="account-plus"
                    style={styles.icon8}
                />
                <Text style={styles.addAnotherAccount}>Add Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => finishSignUp()}
                style={styles.buttonContainer}
                testID={'saveChildAccounts'}
            >
                <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(255,255,255)",
        padding: '10%',
        alignItems: "center",
    },
    area: {
        width: "100%",
    },
    title: {
        width: '70%',
        marginTop: '20%',
        marginBottom: '5%',
        fontFamily: "OpenSans_700Bold",
        textAlign: "center",
        fontSize: 28,
        color: "rgba(0,0,0,1)",
    },
    textBox: {
        height: '9%',
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
        padding: 5,
    },
    addStudentButton: {
        height: '6%',
        width: '100%',
        borderRadius: 5,
        backgroundColor: "rgba(225,148,45,1)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: '23%',
    },
    icon8: {
        color: "rgba(255,255,255,1)",
        fontSize: 40,
        paddingRight: '2%',
    },
    addAnotherAccount: {
        color: "rgba(255,255,255,1)",
        fontFamily: "OpenSans_600SemiBold",
        alignSelf: "center",
        fontSize: 15,
    },
    buttonContainer: {
        height: '7%',
        width: '100%',
        margin: '2%',
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: "#ffffff",
        justifyContent: "center",
        borderRadius: 5,
        borderColor: "rgba(225,148,45,1)",
        borderWidth: 2,
    },
    buttonText: {
        color: "rgba(225,148,45,1)",
        fontFamily: "OpenSans_600SemiBold",
        fontSize: 20,
        textAlign: "center",
        alignSelf: "center"
    },
});

export default AddChildAccount;
