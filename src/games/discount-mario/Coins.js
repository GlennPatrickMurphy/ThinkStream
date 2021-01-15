import React, { Component } from "react";
import { View, Image } from "react-native";
import Images from '../../assets/Images';


export default class Coins extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let coins = this.props.children;
        let coinsRenderArr = [];

        let len = coins.length;
        for (let i = 0; i < len; i++) {

            let x = coins[i].bounds.min.x + (Constants.COIN_RADIUS / 2);
            let y = coins[i].bounds.min.y + (Constants.COIN_RADIUS / 2);
            let width = Constants.COIN_RADIUS;
            let height = Constants.COIN_RADIUS;

            // the last coin is the big coin by convention right now
            if (i === len - 1) {
                x = coins[i].bounds.min.x;
                y = coins[i].bounds.min.y;
                width = Constants.BIG_COIN_RADIUS + (Constants.BIG_COIN_RADIUS / 2);
                height = Constants.BIG_COIN_RADIUS + (Constants.BIG_COIN_RADIUS / 2);
            }

            let image = Images['coin1'];

            coinsRenderArr.push(
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
            )
        }

        return (
            <View>
                {coinsRenderArr}
            </View>
        );
    }
}