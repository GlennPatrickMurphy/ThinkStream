import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

function Billing(props) {
    return (
        <View style={styles.root}>
            <Text>Billing</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "rgb(255,255,255)"
    },
});

export default Billing;
