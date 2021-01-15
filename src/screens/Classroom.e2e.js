
import React, {useState, useEffect,useReducer,useRef} from "react";
import {
    StyleSheet,
    View,
    Text,
    Modal,
    Image,
    Alert,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { Video } from 'expo-av';
import { firebase } from "../firebase/config";
import FirebaseChat from "../components/FirebaseChat";
import Toolbar from "../components/Toolbar";

// Classroom page for thinkstation app
// video player is the expo video component
// the chat is done by gifted chat and is controlled by components/FirebaseChat.js
//
function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { score: state.score + 50 };
        default:
            throw new Error();
    }
}

function Classroom({ route, navigation }) {
    // gets the user and stream information from previous page
    const { userID, stream } = route.params;
    // holds the name of the student
    const [name, setNames] = useState('');
    // holds the question from firebase realtime database
    const [studentID, setStudentID] = useState('');
    // holds the question from firebase realtime database
    const [quizText, setQuizText] = useState({});
    // holds an array of the students points
    const [points, setPoints] = useState([]);
    // checks if the page is ready
    const [initialized, setInitialization] = useState('loading');
    // hides and shows quiz modal
    const [quizVisible, setQuizVisible] = useState(true);
    // hides and shows the correct/wrong modal
    const [responseVisible, setResponseVisible] = useState(false);
    // disables the quiz buttons once the student answered
    const [disabled, setDisabled] = useState(false);
    // holds current answer status
    const [answerState, setAnswerState] = useState('Correct');
    // holds the array value of the gif to play
    const [celebration, setCelebration] = useState(0);
    // reducer function for score
    const [state, dispatch] = useReducer(reducer, { score: 0 });
    // firebase ref for realtime database for gaming
    const dbStreamRef = 'gaming'+stream.title+'/question';
    // number of students in this stream
    const [students, setStudents] = useState(0);
    // reference to students to handle stale states on unmount
    const studentsRef = useRef(students);
    // description of the current stream
    const [description, setDescription] = useState(stream.description);
    // starts the video at a specific spot
    const [positionMillis, setPositionMillis] = useState(0);

    // time variable
    const timeArray = stream.time.split(':');
    // array holds all the gifs
    const gifs = [require('assets/gifs/wrong/1.gif'),
    require('assets/gifs/wrong/2.gif'),
    require('assets/gifs/wrong/3.gif'),
    require('assets/gifs/wrong/4.gif'),
    require('assets/gifs/correct/1.gif'),
    require('assets/gifs/correct/2.gif'),
    require('assets/gifs/correct/3.gif'),
    require('assets/gifs/correct/4.gif'),
    ];

    function updateStudents(newCount) {
        studentsRef.current = newCount;
        setStudents(newCount);
    }


    // onMount grab the server time
    useEffect(()=>{
        // sets name state
        userID.get().then(data => {
            setNames(data.data().displayName);
            setStudentID(data.data().id);
        });

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({"stream":stream.title});

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://thinkstage-f15c5.web.app/playback", requestOptions)
            .then(response => response.json())
            .then(result => {
                if("time" in result){
                    setInitialization('Ready');
                    console.log(result.time);
                    return setPositionMillis(result.time);
                }else{
                    return setInitialization('Stream Not Ready');
                }
            })
            .catch(error => console.log('error', error));

    },[])


    // grabs the quiz question
    useEffect(()=>{

        const ref = firebase.database().ref('gaming/'+stream.title+'/currentQ');

        const listener = ref.on('value',(snapshot)=>{
            // if the currentQ is set to 0 the quiz is hidden else it gets the question
            if(snapshot.val()==0){
                setQuizVisible(false);
            }else{
                grabQuestion(dbStreamRef+snapshot.val());
            }
        })

        return ()=>ref.off('value',listener)
    },[firebase.database])


    // keeps count of students in stream
    useEffect(() => {

        // db ref
        const ref = firebase.database().ref('playlist/' + stream.title)

        // listens to realtime database for number of students
        const listener = ref.on('value', (snapshot) => {
            updateStudents(snapshot.val().students);
            setDescription(snapshot.val().description);
        });

        return () => {
            let updates = {}
            updates[stream.title+"/students"]= studentsRef.current - 1;
            firebase.database().ref('playlist').update(updates);
            return ref.off('value',listener)
        };
    }, [firebase.database]);


    let grabQuestion = (string) => {
        // grabs the question from the _gaming ref and gets the text and answers
        firebase.database().ref(string)
            .once('value', (snapshot) => {
                if (snapshot.val() == null) {
                    setQuizVisible(false)
                } else {
                    setQuizText(snapshot.val());
                    setQuizVisible(true);
                    setDisabled(false);
                }
            })
            .catch(
                setQuizVisible(false)
            )
    };

    // when a student clicks on an answer
    function clickAnswer(item) {
        let data = {};
        // gets random gif
        let imageNumber = Math.floor(Math.random() * (3));
        // sets points, celebration gif, answer state and points
        if(!quizText.answer || quizText.answer.length === 0){
            //if no answer is set, assume the question is a poll
            setPoints(points => points.concat(quizText.points));
            setCelebration(imageNumber+4);
            setAnswerState("Nice!");//TODO: have better message
            data[firebase.auth().currentUser.uid+"_"+studentID]= points.concat(quizText.points);
            dispatch({type: 'increment'});
        }
        else if(item === quizText.answer){
            setPoints(points => points.concat(quizText.points));
            setCelebration(imageNumber + 4);
            setAnswerState("Way To Go !!!");
            data[firebase.auth().currentUser.uid+"_"+studentID]= points.concat(quizText.points);
            dispatch({type: 'increment'});
        }else{
            setCelebration(imageNumber);
            setAnswerState("Sorry That's Not Right")
            setPoints(points => points.concat(0));
            data[firebase.auth().currentUser.uid+"_"+studentID]= points.concat(0);
        }
        // store the users answers in the firebase realtime database a an array in a node under
        // $(stream)_gaming_$(username)
        firebase.database().ref(stream.title.concat('_gaming')).update(data);
        setResponseVisible(true);
        // displays the question for a certain amount of time
        setTimeout(() => {
            setResponseVisible(false)
        }, 5000);
        setDisabled(true);
        setQuizVisible(false);
    }

    // organizes the questions as an array to display
    function prettifyQuestion(){
        let quizOptions = [];
        if(quizText.optionA) quizOptions = quizOptions.concat({ question: quizText.optionA, key: "optionA" });
        if(quizText.optionB) quizOptions = quizOptions.concat({ question: quizText.optionB, key: "optionB" });
        if(quizText.optionC) quizOptions = quizOptions.concat({ question: quizText.optionC, key: "optionC" });
        if(quizText.optionD) quizOptions = quizOptions.concat({ question: quizText.optionD, key: "optionD" });
        if(quizText.options)
            quizOptions = quizOptions.concat(quizText.options.map((item, index) => {return {question: item, key: "option"+index}}));
        if(quizOptions.length == 0)return [{question:"loading",key:"loading"}];
        return quizOptions;
    }


    // if (initialized==='loading') {
    //     // returns that the stream isn't ready yet and says class starts at specific time
    //     return (
    //         <View style={styles.root}>
    //             <View style={styles.indicator}>
    //                 <ActivityIndicator size="large" color="rgba(225,148,45,1)" />
    //             </View>
    //         </View>
    //     )
    // }else if(initialized==='Stream Not Ready'){
       return(
        <View style={styles.root}>
            <Text style={{padding:"5%",
                fontSize:35,
                color:"black",
                flexShrink: 1,
                textAlign:'center'
            }}
            testID={'waitingForClass'}
            >Stream Hasn't Started</Text>
            <Image style ={{flex:1, width:null,height:null,resizeMode: 'contain'}} source={require('assets/gifs/sleepycat.gif')}/>
        </View>
       )
    // } else {
    //     // hide quiz modal if not ready
    //     if (quizText === 'undefined') {
    //         setQuizVisible(false);
    //     }
    //     return (
    //         <View style={styles.root}>
    //             {/*<StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0)"/>*/}
    //             {/*<HeaderX style={styles.headerX}/>*/}
    //             {/*celebration modal*/}
    //             <Modal
    //                 animationType="slide"
    //                 transparent={true}
    //                 visible={responseVisible}
    //                 onRequestClose={() => {
    //                     Alert.alert("Modal has been closed.");
    //                 }}
    //             >
    //                 <View style={styles.celebrationView}>
    //                     <Text style={{
    //                         padding: "5%",
    //                         fontSize: 35,
    //                         color: "black",
    //                         flexShrink: 1,
    //                         textAlign: 'center'
    //                     }}> {answerState} </Text>
    //                     <Image style={{ resizeMode: 'contain' }} source={gifs[celebration]} />
    //                 </View>
    //             </Modal>
    //             {/*quiz modal*/}
    //             <Modal
    //                 animationType="slide"
    //                 transparent={true}
    //                 visible={quizVisible}
    //                 onRequestClose={() => {
    //                     Alert.alert("Modal has been closed.");
    //                 }}
    //             >
    //                 <View style={styles.centeredView}>
    //                     <Text style={styles.questionTitle}>{quizText.question}</Text>

    //                     <FlatList
    //                         // numColumns={2}
    //                         data={prettifyQuestion()}
    //                         renderItem={({ item }) => (
    //                             <TouchableOpacity
    //                                 style={{ ...styles.openButton, backgroundColor: "#469d9c", margin: 10 }}
    //                                 onPress={() => clickAnswer(item.question)}
    //                                 disabled={disabled}
    //                             >
    //                                 <Text style={styles.textStyle}>{item.question}</Text>
    //                             </TouchableOpacity>
    //                         )}>
    //                     </FlatList>
    //                 </View>
    //             </Modal>
    //             {/*video*/}
    //             {/*element wrapped in scroll view so that the keyboard goes away after
    //             message is sent*/}
    //             <ScrollView contentContainerStyle={{ flex: 1 }}>
    //                 <Video
    //                     source={{uri: "https://stream.mux.com/".concat(stream.title+".m3u8")}}
    //                     posterSource={{uri:stream.image}}
    //                     positionMillis={positionMillis}
    //                     usePoster={true}
    //                     rate={1.0}
    //                     volume={1.0}
    //                     isMuted={false}
    //                     resizeMode="stretch"
    //                     shouldPlay
    //                     isLooping
    //                     style={{ flex: 1 }}
    //                 />
    //                 {/*class info bar*/}
    //                 <Toolbar stream={stream.title} name={name} score={state.score} shareCallback={dispatch} students={students} description={description}/>
    //                 {/*chat */}
    //                 <FirebaseChat style={styles.content} name={name} studentID={studentID} streamid={stream.title}/>
    //             </ScrollView>
    //         </View>
    //     );
    // }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "rgb(255,255,255)",
    },
    toolbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "2%",
        backgroundColor: "rgba(225,148,45,1)",
        height: 40
    },
    headerX: {
        height: 80,
        elevation: 15,
        shadowOffset: {
            height: 7,
            width: 1
        },
        shadowColor: "rgba(0,0,0,1)",
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    content: {
        flex: 1
    },
    materialCardWithRightButtons: {
        alignSelf: "stretch",
        flex: 1
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "#3c73b1"
    },
    celebrationView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "white"
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        flexShrink: 1,

    },

    questionTitle: {
        padding: "5%",
        fontSize: 35,
        color: "white",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    indicator: {
        flex: 1,
        justifyContent: "center"
    },
});

export default Classroom;
