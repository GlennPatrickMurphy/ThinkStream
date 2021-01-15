import { Dimensions } from 'react-native';

export default Constants = {
    MAX_WIDTH: Dimensions.get("screen").width,
    MAX_HEIGHT: Dimensions.get("screen").height,
    PLATFORM_WIDTH: (Dimensions.get("screen").width) / 3,
    PLATFORM_HEIGHT: (Dimensions.get("screen").width) / 12,
    PLAYER_WIDTH: (Dimensions.get("screen").width) / 6,
    PLAYER_HEIGHT: (Dimensions.get("screen").width) / 6,
    COIN_RADIUS: Dimensions.get("screen").width / 16, 
    BIG_COIN_RADIUS: Dimensions.get("screen").width / 8,
    COIN_VERT_OFFSET: Dimensions.get("screen").height / 18,
    COIN_HOR_OFFSET: Dimensions.get("screen").height / 18,
    FINISH_TILE_HEIGHT: (Dimensions.get("screen").height) / 3 - ((Dimensions.get("screen").width) / 12) / 3,
}

