import React, { useState, useEffect} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import Welcome from "../screens/Welcome";
import SignUp from "../screens/SignUp";
// import Schedule from "../screens/Schedule";
import AddChildAccount from "../screens/AddChildAccount";


const Stack = createStackNavigator();

function LoginStack() {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="Sign Up" component={SignUp} />
                {/*<Stack.Screen name="Schedule" component={Schedule}/>*/}
                <Stack.Screen name="AddChildAccount" component={AddChildAccount}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default LoginStack;
