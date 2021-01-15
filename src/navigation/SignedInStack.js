import React, { useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
// import Schedule from "../screens/Schedule";
import AddChildAccount from "../screens/AddChildAccount";
import Channels from "../screens/Channels";
import ChooseAccount from "../screens/ChooseAccount";
import Classroom from "../screens/Classroom";
import DiscountMario from "../games/discount-mario/DiscountMario";

import Stats from "../screens/Stats";
import Settings from "../screens/Settings"
import Billing from "../screens/Billing";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// the signed in stack
const Stack = createStackNavigator();
// tab stack for parent page
const Tab = createBottomTabNavigator();

//handles the bottom tab navigator screens
function ParentPage({ route, navigation }) {

    const { onGoBack } = route.params;

    return (
        // needs to pass independent as true to not affect other navigation stack
        <NavigationContainer independent={true}>
            <Tab.Navigator>
                {/*<Tab.Screen name="Stats" component={Stats} />*/}
                <Tab.Screen name="Settings">
                    {() => <Settings navigation={navigation} onGoBack={onGoBack} />}
                </Tab.Screen>
                {/*<Tab.Screen name="Billing" component={Billing} />*/}
            </Tab.Navigator>
        </NavigationContainer>
    );
}

// signed in stack of all screens
function SignedInStack() {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ChooseAccount">
                <Stack.Screen name="ParentPage" component={ParentPage}
                    options={{
                        headerBackTitle: "Back"
                    }} />
                <Stack.Screen name="Channels" component={Channels}
                    options={{
                        headerBackTitleVisible: false
                    }}
                />
                <Stack.Screen name="Classroom" component={Classroom}
                    options={{
                        headerBackTitle: "Leave Class"
                    }}
                />
                <Stack.Screen name="ChooseAccount" component={ChooseAccount} />
                {/*<Stack.Screen name="Schedule" component={Schedule} />*/}
                <Stack.Screen name="AddChildAccount" component={AddChildAccount}
                    options={{
                        headerLeft: null
                    }}
                />
                <Stack.Screen options={{headerShown: false}} name="DiscountMario" component={DiscountMario}/>

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default SignedInStack;

