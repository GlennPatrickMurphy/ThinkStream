import {firebase} from "./config";

class FireChat {

    constructor(streamid) {
        this.streamid = streamid;
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get ref() {
        return firebase.database().ref("messaging/"+this.streamid);
    }

    ref_message(messageID){
        return firebase.database().ref("messaging/"+this.streamid.concat('/'+messageID))
    }

    ref_sanitized(messageID) {
        return firebase.database().ref("messaging/"+this.streamid.concat('/'+messageID+'/sanitized'))
    }

    get ref_quiz() {
        return firebase.database().ref("gaming/"+this.streamid);
    }

    parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: _id } = snapshot;
        const timestamp = new Date(numberStamp);
        const message = {
            _id,
            timestamp,
            text,
            user,
        };
        return message;
    };

    // when message created in firebase realtime db, this function runs with callback function
    // from the FirebaseChat.js
    on = callback =>
        // listens for message added to the messaging node
        this.ref
            .limitToLast(20)
            .on('child_added', snapshot => {
                // creates listener to the sanitized field in message node
                this.ref_sanitized(snapshot.key)
                    .on('value',data=>{

                        if (data.val()===true) {
                            // when sanitized field is true get the message node value
                            this.ref_message(snapshot.key).once('value')
                                .then( message_info=> {
                                    // parse the message and run callback function
                                    callback(this.parse(message_info));
                                })
                            // unmount listener
                            this.ref_sanitized(snapshot.key).off();
                        }
                    })
            });


    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }

    // sends the message to firebase realtime db
    send = messages => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {
                text,
                user,
                timestamp: this.timestamp,
                sanitized:false,
                moderated:false
            };
            this.append(message);
        }
    };

    append = message => this.ref.push(message);

    // close the connection to the Backend
    off() {
        this.ref.off();
    }
}

export default FireChat;
