import firebase from "../fbconfig";
import {
    Alert
  } from "react-native";

const JoinEvent = async (friend_id, event_id) => {
    var db
    db = firebase.firestore()
    var user = firebase.auth().currentUser; // user might be null

    try {
        // check if user has already added the event by checking
        // field firend_id, change element.xxx to change identifier
        var members = await db.collection('events').doc(friend_id)
            .collection('list').doc(event_id).collection('members').get()
        const membersId = members.docs.map(doc => doc.data())
        var hasJoined = false
        var hasSend = false
        var neweventId
        
        membersId.forEach(element => {
            if(element.friend_id == user.uid){
                if(element.status == "joined"){
                    hasJoined = true
                } else if (element.status == "pending"){
                    hasSend = true
                }
            }
        });
        if(hasJoined){ 
            console.log("You already Joined")
            // Need to pop up a window
            Alert.alert("You are already in, have fun!")
            //tag, ract component, alert, modal
        } else if (hasSend) {
            Alert.alert("Join Request Sent", "waiting for owner's response")
        } else {
            //add my id to the partisapant list
            // NOTE: if you need to change the format of partisapant id,
            // content in the .add need to be changed with
            db.collection('events').doc(friend_id)
                .collection('list').doc(event_id).collection('members')
                .add({friend_id: user.uid, status: "pending"}).then(
                    (docRef) => {neweventId = docRef.id}
                );
            //get partisapant list
            members = await db.collection('events').doc(friend_id)
                .collection('list').doc(event_id).collection('members').get()
            const membersId = members.docs.map(doc => doc.data())
            //get event
            db.collection('events').doc(friend_id)
                .collection('list').doc(event_id).get().then((doc) => {
                var data
                data = doc.data()
                // create and push notification
                const noti_data = {
                    created: Date.now(),
                    type: "joinRequest",
                    uid_from: user.uid,
                    member_id: neweventId,
                    email_from: user.email,
                    uid_to: friend_id,
                    message: "",
                    event_id: event_id,
                    event_title: data.title,
                    status: "pending"
                  };

                db.collection("notification").doc(friend_id)
                  .collection("member_notify").add(noti_data)
                  .then((docRef) => {
                    db.collection('events').doc(friend_id)
                    .collection('list').doc(event_id).collection('members')
                    .doc(neweventId)
                    .update({requestId: neweventId, notificationId: docRef.id})
                    console.log("added notification successfully");
                  });
                
                Alert.alert("Join Request Send", "waiting for owner's response")
                // //write event
                // db.collection('events').doc(user.uid).
                // collection('list').add(data).then((dataRef) => {
                //     membersId.forEach(element => {
                //         db.collection('events').doc(user.uid).collection('list')
                //         .doc(dataRef.id).collection('members').add(element)
                //     });
                
                // });                        
            })
        }

    } catch (error) {
        console.log('join event error', error)
    }
}

export default JoinEvent