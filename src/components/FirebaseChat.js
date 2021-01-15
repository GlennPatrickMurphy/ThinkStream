// @flow
import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import {StyleSheet} from 'react-native';

import FireChat from "../firebase/FireChat";
type Props = {
    name?: string,
    streamid?: string
};


class FirebaseChat extends React.Component<Props> {

    constructor(props) {
        super(props);
        this.FireChat = new FireChat(this.props.streamid);
    }

    static navigationOptions = ({ navigation }) => ({
        title: (navigation.state.params || {}).name || 'Chat!',
    });

    state = {
        messages: [],
    };

    get user() {
        return {
            name: this.props.name,
            _id: this.props.studentID,
        };
    }

    render() {
        return (
            <GiftedChat
                renderUsernameOnMessage={true}
                messages={this.state.messages}
                onSend={this.FireChat.send}
                user={this.user}
            />
        );
    }

    componentDidMount() {
        this.FireChat.on( message => {
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
            }))
        });
    }
    componentWillUnmount() {
        this.FireChat.off();
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    scrollview:{
        flexGrow:1
    }
});

export default FirebaseChat;
