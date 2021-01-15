import Matter from "matter-js";
import { Dimensions } from 'react-native';
import Floor from './Floor';

// variable to control player animation
let playerPose = 1;
let tick = 0;


let deviceMultiplier = 1; // ios frame rate is higher so we need to adjust velocity/animation speed 
let deviceMultiplierJump = 1;
if (Platform.OS === 'ios') {
    deviceMultiplier = 2;
    deviceMultiplierJump = 2.2; // *** not sure if ipad needs a higher jump
}

const Physics = (entities, { touches, time }) => {
    let engine = entities.physics.engine;
    let player = entities.player.body;
    let floor1 = entities.floor1.body;

    // listen to touches to the screen to control jumping
    touches.filter(t => t.type === "press").forEach(async t => {
        if (entities.player.canJump) {
            engine.world.gravity.y = 1;
            Matter.Body.setVelocity(player, { //zero player velocity for consistent jumps
                x: player.velocity.x,
                y: 0
            });
            Matter.Body.setVelocity(player, { x: player.velocity.x, y: -((Constants.PLATFORM_HEIGHT * 1.5) / deviceMultiplierJump) });
            entities.player.action = 'jump';
            entities.player.canJump = false; // don't allow double jumps
            playerPose = 1;
        }
    });

    Matter.Engine.update(engine, time.delta);

    // for each entity in the world, move it backwards each frame to create the illusion of the player moving forward
    Object.keys(entities).forEach(key => {
        if (key.indexOf("platforms") === 0 || key.indexOf("coins") === 0) {
            entities[key].body.forEach(entity => {
                Matter.Body.translate(entity, { x: -(Constants.MAX_WIDTH / 55 / deviceMultiplier), y: 0 });
            })
        } else if (key.indexOf("finish") === 0) {
            Matter.Body.translate(entities[key].body, { x: -(Constants.MAX_WIDTH / 55 / deviceMultiplier), y: 0 });
        }
    });

    // detect collisions between the player and the ground/platforms to display appropriate run/jump animation
    Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
        pairs.forEach(({ bodyA, bodyB }) => {

            if ((bodyA === player && bodyB === floor1)) {
                entities.player.action = 'run';
                entities.player.canJump = true;
            }

            let platforms = entities["platforms"].body;
            let len = platforms.length;
            for (let i = 0; i < len; i++) {
                if (bodyA === player && bodyB === platforms[i]) {
                    entities.player.action = 'run';
                    entities.player.canJump = true;
                }
            }
        });
    });


    // IF the player falls off the screen, recover them
    if (player.bounds.min.y > Constants.MAX_HEIGHT) {
        Matter.Body.setVelocity(player, { x: 0, y: 0 });
        Matter.Body.setPosition(player, { x: player.position.x, y: Constants.MAX_HEIGHT + Constants.PLATFORM_HEIGHT / 3 - Constants.MAX_HEIGHT / 6 - Constants.PLAYER_HEIGHT/2 });
    }

    // make sure bouncing back from platforms/falling off platforms doesn't push the player forward/backwards
    Matter.Body.setVelocity(player, { x: 0, y: player.velocity.y });

    // handle player animation
    if (entities.player.action == 'jump') { //jump animation
        if (player.velocity.y > 0) {
            entities.player.pose = 1;
        } else {
            entities.player.pose = 2;
        }
    } else { //run animation
        if (tick % deviceMultiplier === 0) {
            playerPose += 1;
            if (playerPose > 8) {
                playerPose = 1;
            }
            entities.player.pose = playerPose;
        }

    }

    return entities;
};

export default Physics;