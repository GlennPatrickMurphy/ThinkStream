import React, { useEffect } from "react";
import { StyleSheet, View, StatusBar, Image } from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import {firebase} from "../firebase/config";

function SplashScreen({navigation}) {


    useEffect(()=> {
            const unsubscribe = AutoLogin();
            return () => unsubscribe;
        }
    );

    function AutoLogin(){
       const {user} = firebase.auth();
       if (user) {
           navigation.navigate('ChooseAccount', {user});
       } else {
           navigation.navigate('Login')
       }
    }


    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0)" />
            <View style={styles.background}>
                <View style={styles.rect3Stack}>
                    <View style={styles.rect3}/>
                    <Svg viewBox="0 0 859 890" style={styles.ellipse}>
                        <Ellipse
                            stroke="rgba(230, 230, 230,1)"
                            strokeWidth={0}
                            fill="rgba(255,255,255,1)"
                            cx={430}
                            cy={445}
                            rx={430}
                            ry={445}
                        />
                    </Svg>
                    <View style={styles.rect2}/>
                    <View style={styles.group2}>
                        <View style={styles.logo}>
                            <Image
                                source={require("../assets/images/3-removebg-preview3.png")}
                                resizeMode="contain"
                                style={styles.image}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "rgb(255,255,255)"
    },
    background: {
        height: 1366
    },
    rect3: {
        top: 0,
        left: 69,
        width: 360,
        height: 740,
        position: "absolute",
        backgroundColor: "rgba(225,148,45,1)"
    },
    ellipse: {
        top: 0,
        left: 0,
        width: 859,
        height: 890,
        position: "absolute"
    },
    rect2: {
        top: 690,
        left: 35,
        width: 88,
        height: 82,
        position: "absolute",
        backgroundColor: "rgba(255,255,255,1)"
    },
    group2: {
        top: 204,
        left: 69,
        position: "absolute",
        alignItems: "center",
        justifyContent: "space-around",
        height: 862,
        right: 0
    },
    logo: {
        alignSelf: "center",
        flex: 1,
        justifyContent: "center"
    },
    image: {
        width: 1026,
        height: 589,
        alignSelf: "center"
    },
    rect3Stack: {
        height: 1066,
        marginLeft: -69
    }
});

export default SplashScreen;
