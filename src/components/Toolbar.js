import React, {useEffect,useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View,Share} from "react-native";
import {firebase} from "../firebase/config";

function Toolbar(props) {
    const [students, setStudents] = useState(0);
    const [title,setTitle] = useState('')
    const [shared,setShared] = useState(false);
    useEffect(()=>{

        firebase.database().ref('playlist/' + props.stream)
            .on('value', (snapshot) => {
                setStudents(snapshot.val().students);
                setTitle(snapshot.val().description);
            });

    },[])

    const share = async () => {
        try {
            const result = await Share.share({
                message:`I learnt about `+title,
                title:"ThinkStation",
            });

            if (result.action === Share.sharedAction) {
                alert("Post Shared")
                //TODO
                // share for 100 points
                // props.shareCallback({type: 'increment'});
                // props.shareCallback({type: 'increment'});
                setShared(true);

            } else if (result.action === Share.dismissedAction) {
                // dismissed
                alert("Post cancelled")
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return(
        <View style={styles.toolbar}>
            <View style={styles.vertical}>
            {/*    spacer */}
            </View>
            <View style={styles.vertical}>
                <Text style={styles.subtitle}>
                    Students in Stream
                </Text>
                <Text style={styles.info}>
                    {students}
                </Text>
            </View>
            <View style={styles.vertical}>
                <Text style={styles.subtitle}>
                    Points
                </Text>
                <Text style={styles.info}>
                    {(props.points)?Object.keys(props.points).reduce((acc, val) => acc + props.points[val], 0):0}
                </Text>
            </View>
            <View style={styles.vertical}>
                {/*    spacer */}
            </View>
            {/*<TouchableOpacity disabled = {shared} style={styles.toolbarButton} onPress={() => share()}>*/}
            {/*    <Text style={styles.shareTxt}>Share For 100 pts</Text>*/}
            {/*</TouchableOpacity>*/}

        </View>
    );
}

const styles = StyleSheet.create({
    toolbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "1%",
        backgroundColor: "rgba(225,148,45,1)",
    },
    vertical:{
        flexDirection:"column",
        justifyContent: "center",
        alignItems:"center"
    },
    subtitle:{
        color:"white"
    },
    info:{
        color:"white"
    },
    shareTxt:{
        color:"white"
    },
    toolbarButton:{
        paddingRight:10,
        paddingLeft:10,
        marginRight:10,
        borderWidth:1,
        borderRadius:5
    }
})

export default Toolbar;
