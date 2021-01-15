import React, { Component } from "react";
import { View, Image } from "react-native";
import Images from '../../assets/Images';

export default class Platforms extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let platforms = this.props.children;
        let platformsRenderArr = [];

        platforms.forEach(platform => {
            const width = Constants.PLATFORM_WIDTH;
            const height = Constants.PLATFORM_HEIGHT;
            const x = platform.bounds.min.x;
            const y = platform.bounds.min.y;
            
            const imageIterations = Math.ceil(width / height);

            platformsRenderArr.push(
                <View
                    style={{
                        position: "absolute",
                        left: x,
                        top: y,
                        width: width,
                        height: height,
                        overflow: 'hidden',
                        flexDirection: 'row'
                    }}>
                    {Array.apply(null, Array(imageIterations)).map((el, idx) => {
                        return <Image style={{ width: height, height: height }} key={idx} resizeMode="stretch" source={Images.floor} />
                    })}
                </View>
            )
        });

        return (
            <View>
                {platformsRenderArr}
            </View>
        );
    }
}