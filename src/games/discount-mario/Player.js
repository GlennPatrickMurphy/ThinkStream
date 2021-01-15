import React, { Component } from "react";
import { View, Image, Animated } from "react-native";
import Images from '../../assets/Images';

export default class Player extends Component {

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;

        //current pose is controlled by physics
        var image;
        if (this.props.action === 'run') {
            image = Images['run' + this.props.pose];
        } else {
            image = Images['jump' + this.props.pose];
        }

        return (
            <Image
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                }}
                resizeMode="cover"
                source={image} />
        );
    }
}