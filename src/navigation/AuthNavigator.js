
import React, { useState, useEffect, createContext, useRef } from 'react'
import { firebase } from '../firebase/config';
import SignedInStack from "./SignedInStack";
import LoginStack from "./LoginStack";
export const AuthContext = createContext(null);
import InternetConnectionAlert from "react-native-internet-connection-alert";


export default function AuthNavigator() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const authSubscriber = firebase.auth().onAuthStateChanged(result => {
            if (result) {
                setUser(result);
            }
            setInitializing(false);
        });

        // unsubscribe on unmount
        return authSubscriber
    }, [user, setUser]);


    if (initializing) {
        return null
    }

    return (user) ? (
        <InternetConnectionAlert
            onChange={(connectionState) => {
                console.log("Connection State: ", connectionState);
            }}
            title="Oh No! You aren't connected to the Internet!"
            message="You must be connected to the internet to use ThinkStation.
                Please reconnect to the internet"
        >
            <AuthContext.Provider value={user}>
                <SignedInStack />
            </AuthContext.Provider>
        </InternetConnectionAlert>
    ) : (
            <InternetConnectionAlert
                onChange={(connectionState) => {
                    console.log("Connection State: ", connectionState);
                }}
                title="Oh No! You aren't connected to the Internet!"
                message="You must be connected to the internet to use ThinkStation.
            Please reconnect to the internet"
            >
                <LoginStack></LoginStack>
            </InternetConnectionAlert>

        )
}