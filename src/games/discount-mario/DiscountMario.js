import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, StatusBar, Alert, TouchableOpacity, Image } from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Player from './Player';
import Physics from './Physics';
import Constants from './Constants';
import Platforms from './Platforms';
import Floor from './Floor';
import Coins from './Coins';
import Finish from './Finish';
import FinishTile from './FinishTile';
import Images from '../../assets/Images';

// the main app: the control center

export const addPlatforms = (world, platformPositions) => {

    let platforms = [];
    platformPositions.forEach(([x, y]) => {
        let platform = Matter.Bodies.rectangle(x, y, Constants.PLATFORM_WIDTH, Constants.PLATFORM_HEIGHT, { isStatic: true });
        platforms.push(platform);
        Matter.World.add(world, platform);
    });
    return platforms;
}


export const addCoins = (world, coinPositions) => {

    let coins = [];
    coinPositions.forEach(([x, y]) => {
        let coin = Matter.Bodies.circle(x, y, Constants.COIN_RADIUS, { isStatic: true });
        coins.push(coin);
        Matter.World.add(world, coin);
        Matter.Body.setMass(coin, 0);
        coin.isSensor = true;
    });
    return coins;
}


export default class DiscountMario extends Component {
    constructor(props) {
        super(props);

        this.state = {
            running: true,
            score: 0,
        };
        this.multipier = this.props.multiplier;
        this.quizVisible = this.props.quizVisible;
        this.onFinish = this.props.route.params.onFinish;
        this.route = this.props.route;
        this.navigation = this.props.navigation;

        this.gameEngine = null;

        this.entities = this.setupWorld();
    }


    setupWorld = () => {

        //initialize world
        let engine = Matter.Engine.create({ enableSleeping: false });
        let world = engine.world;
        world.gravity.y = 0;

        // initialize character, floors, platforms, coins
        let player = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT + Constants.PLATFORM_HEIGHT / 3 - Constants.MAX_HEIGHT / 6 - Constants.PLAYER_HEIGHT / 2, Constants.PLAYER_WIDTH, Constants.PLAYER_HEIGHT);

        let floor1 = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT + Constants.PLATFORM_HEIGHT / 3, Constants.MAX_WIDTH + 200, Constants.MAX_HEIGHT / 3, { isStatic: true });

        let platformPositions = [
            // ea element is an [x, y] pair to specify where the platform will be

            // at the moment there are 9 total platforms, separated into 5 sections
            [900, Constants.MAX_HEIGHT / 2 + Constants.MAX_HEIGHT / 6], 

            [1600, Constants.MAX_HEIGHT / 2 + Constants.MAX_HEIGHT / 6], 
            [1600 + Constants.MAX_WIDTH / 2.5, Constants.MAX_HEIGHT / 2],

            [2600, Constants.MAX_HEIGHT / 2 + Constants.MAX_HEIGHT / 6],

            [3300, Constants.MAX_HEIGHT / 2 + Constants.MAX_HEIGHT / 6],
            [3300 + Constants.MAX_WIDTH / 2.5, Constants.MAX_HEIGHT / 2],
            [3300 + 2 * (Constants.MAX_WIDTH / 2.5), Constants.MAX_HEIGHT / 2 + Constants.MAX_HEIGHT / 12],

            [4500, Constants.MAX_HEIGHT / 2 + Constants.MAX_HEIGHT / 6],
            [4500 + Constants.MAX_WIDTH / 2.5, Constants.MAX_HEIGHT / 2]
        ];

        let coinPositions = [
            // ea element is an [x, y] pair to specify where each coin will be

            //platform coins
            [platformPositions[0][0] - Constants.COIN_HOR_OFFSET, platformPositions[0][1] - Constants.COIN_VERT_OFFSET],
            [platformPositions[0][0], platformPositions[0][1] - Constants.COIN_VERT_OFFSET],
            [platformPositions[0][0] + Constants.COIN_HOR_OFFSET, platformPositions[0][1] - Constants.COIN_VERT_OFFSET],

            [platformPositions[1][0] - Constants.COIN_HOR_OFFSET / 2, platformPositions[1][1] - Constants.COIN_VERT_OFFSET],
            [platformPositions[1][0] + Constants.COIN_HOR_OFFSET / 2, platformPositions[1][1] - Constants.COIN_VERT_OFFSET],

            [platformPositions[2][0] - Constants.COIN_HOR_OFFSET, platformPositions[2][1] - Constants.COIN_VERT_OFFSET],
            [platformPositions[2][0], platformPositions[2][1] - Constants.COIN_VERT_OFFSET],
            [platformPositions[2][0] + Constants.COIN_HOR_OFFSET, platformPositions[2][1] - Constants.COIN_VERT_OFFSET],

            [platformPositions[3][0] - Constants.COIN_HOR_OFFSET / 2, platformPositions[3][1] - Constants.COIN_VERT_OFFSET],
            [platformPositions[3][0] + Constants.COIN_HOR_OFFSET / 2, platformPositions[3][1] - Constants.COIN_VERT_OFFSET],

            [platformPositions[4][0], platformPositions[4][1] - Constants.COIN_VERT_OFFSET],

            [platformPositions[5][0] - Constants.COIN_HOR_OFFSET / 2, platformPositions[5][1] - Constants.COIN_VERT_OFFSET],
            [platformPositions[5][0] + Constants.COIN_HOR_OFFSET / 2, platformPositions[5][1] - Constants.COIN_VERT_OFFSET],

            [platformPositions[6][0] - Constants.COIN_HOR_OFFSET, platformPositions[6][1] - Constants.COIN_VERT_OFFSET],
            [platformPositions[6][0], platformPositions[6][1] - Constants.COIN_VERT_OFFSET],
            [platformPositions[6][0] + Constants.COIN_HOR_OFFSET, platformPositions[6][1] - Constants.COIN_VERT_OFFSET],

            [platformPositions[7][0] - Constants.COIN_HOR_OFFSET / 2, platformPositions[7][1] - Constants.COIN_VERT_OFFSET],
            [platformPositions[7][0] + Constants.COIN_HOR_OFFSET / 2, platformPositions[7][1] - Constants.COIN_VERT_OFFSET],

            [platformPositions[8][0] - Constants.COIN_HOR_OFFSET, platformPositions[8][1] - Constants.COIN_VERT_OFFSET],
            [platformPositions[8][0], platformPositions[8][1] - Constants.COIN_VERT_OFFSET],
            [platformPositions[8][0] + Constants.COIN_HOR_OFFSET, platformPositions[8][1] - Constants.COIN_VERT_OFFSET],

            // floor coins
            [1250 - Constants.COIN_HOR_OFFSET, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],
            [1250, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],
            [1250 + Constants.COIN_HOR_OFFSET, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],

            [2250 - Constants.COIN_HOR_OFFSET / 2, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],
            [2250 + Constants.COIN_HOR_OFFSET / 2, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],

            [2600 - Constants.COIN_HOR_OFFSET, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],
            [2600, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],
            [2600 + Constants.COIN_HOR_OFFSET, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],

            [3450 - Constants.COIN_HOR_OFFSET, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],
            [3450, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],
            [3450 + Constants.COIN_HOR_OFFSET, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],

            [3750 - Constants.COIN_HOR_OFFSET / 2, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],
            [3750 + Constants.COIN_HOR_OFFSET / 2, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],

            [4200, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],

            [4650 - Constants.COIN_HOR_OFFSET, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],
            [4650, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],
            [4650 + Constants.COIN_HOR_OFFSET, Constants.MAX_HEIGHT - Constants.COIN_VERT_OFFSET * 3.2],

            //for now, the last element of this array will be the BIG COIN (sits in the air)
            [platformPositions[6][0] + Constants.PLATFORM_WIDTH * 2 / 3, platformPositions[6][1] - Constants.MAX_HEIGHT / 4],
        ];

        // add the platforms and coins to the world
        let platforms = addPlatforms(world, platformPositions);
        let coins = addCoins(world, coinPositions);

        // the invisible finish collision detector
        let finish = Matter.Bodies.rectangle(5500 + Constants.PLATFORM_WIDTH, 200, Constants.PLATFORM_WIDTH, Constants.MAX_HEIGHT * 2, { isStatic: true });
        // the actual visible finish tile
        let finishTile = Matter.Bodies.rectangle(5500, Constants.MAX_HEIGHT - Constants.MAX_HEIGHT / 10, Constants.PLATFORM_WIDTH, Constants.PLATFORM_HEIGHT * 1.2, { isStatic: true });
        finishTile.isSensor = true;

        //add the player, floors, finish tiles to the world
        Matter.World.add(world, [floor1, player, finish, finishTile]);

        //detect collisions
        Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
            pairs.forEach(({ bodyA, bodyB }) => {

                // check for player-coin collision
                let len = coins.length;
                for (let i = 0; i < len; i++) {
                    if (bodyA === player && bodyB === coins[i]) {
                        if (i === len - 1) { //if big coin, + 10 points
                            this.setState({
                                score: this.state.score + 10
                            })
                        } else {
                            this.setState({
                                score: this.state.score + 1
                            })
                        }

                        Matter.World.remove(engine.world, bodyB);
                        Matter.Body.setPosition(bodyB, { x: -(Constants.MAX_WIDTH + 200), y: 0 });
                        break;
                    }
                    if (bodyA === coins[i] && bodyB === player) {
                        if (i === len - 1) { //if big coin, + 10 points
                            this.setState({
                                score: this.state.score + 10
                            })
                        } else {
                            this.setState({
                                score: this.state.score + 1
                            })
                        }
                        Matter.World.remove(engine.world, bodyB);
                        Matter.Body.setPosition(bodyB, { x: -(Constants.MAX_WIDTH + 200), y: 0 });
                        break;
                    }
                }

                // detect if player has reached the end of the game
                if ((bodyA === player && bodyB === finish) || (bodyA === finish && bodyB === player)) {
                    this.setState({
                        running: false
                    });
                    this.gameOver();
                }
            });
        });

        return {
            physics: { engine: engine, world: world },
            floor1: { body: floor1, renderer: Floor },
            player: { body: player, size: [Constants.PLAYER_WIDTH, Constants.PLAYER_HEIGHT], pose: 1, action: 'run', canJump: true, renderer: Player },
            platforms: { body: platforms, children: platforms, renderer: Platforms },
            coins: { body: coins, children: coins, renderer: Coins },
            finish: { body: finish, renderer: Finish },
            finishTile: { body: finishTile, color: 'white', renderer: FinishTile },
        }
    }

    // reset the game
    gameOver = () => {
        setTimeout(() => {
            this.multiplier = this.state.score;
            this.quizVisible = true;
            this.gameEngine.swap(this.setupWorld());
            this.setState({
                running: false,
                score: 0,
            });
            this.navigation.goBack();
            this.onFinish(this.multiplier);
        }, 8000); //automatically navigate to quiz after 8 seconds
  
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.backgroundImage} resizeMode="cover" source={Images.background} />
                <GameEngine
                    ref={(ref) => { this.gameEngine = ref; }}
                    style={styles.gameContainer}
                    systems={[Physics]}
                    running={this.state.running}
                    onEvent={this.onEvent}
                    entities={this.entities}>
                    <StatusBar hidden={true} />
                </GameEngine>
                <Image style={styles.staticCoin} resizeMode="cover" source={Images.staticCoin} />
                <Text style={styles.score}>{this.state.score}</Text>
                <View>
                    <Text style={styles.instructions}>TAP the screen to jump. {"\n"} Collect as many coins as you can!</Text>
                </View>
                {!this.state.running && <TouchableOpacity style={styles.fullScreenButton} disabled={true}>
                    <View style={styles.fullScreen}>
                        <Text style={styles.gameOverText}>Amazing!</Text>
                        <Text style={styles.gameOverText}>Your score: {this.state.score} </Text>
                        <Text style={styles.gameOverSubText}>Let's test your knowledge to boost your score...</Text>
                    </View>
                </TouchableOpacity>}
            </View>
        );
    }


}

const styles = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: Constants.MAX_WIDTH,
        height: Constants.MAX_HEIGHT
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    gameContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullScreenButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1
    },
    staticCoin: {
        position: 'absolute',
        left: Constants.MAX_WIDTH / 2 - 95,
        top: 77,
        width: 60,
        height: 60,
    },
    score: {
        color: 'white',
        fontSize: 72,
        position: 'absolute',
        top: 50,
        left: Constants.MAX_WIDTH / 2 - 24,
        textShadowColor: '#222222',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
    },
    instructions: {
        color: 'white',
        fontSize: Constants.MAX_WIDTH / 16,
        position: 'absolute',
        top: 150,
        textShadowColor: '#222222',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
        textAlign: 'center',
    },
    gameOverText: {
        color: 'white',
        fontSize: 48,
    },
    gameOverSubText: {
        color: 'white',
        fontSize: 24,
        textAlign: 'center',
    },
});
