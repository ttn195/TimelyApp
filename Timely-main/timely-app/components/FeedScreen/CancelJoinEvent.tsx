import firebase from "../../fbconfig";
import {
    Alert
} from "react-native";

const CancelJoinEvent = async (friend_id, event_id) => {
    var db
    db = firebase.firestore()
    var user = firebase.auth().currentUser; // user might be null

    try {
        var members = await db.collection('events').doc(friend_id)
            .collection('list').doc(event_id).collection('members')
            .get()
        const membersId = members.docs.map(doc => doc.data())
        // var membersList = await db.collection('events').doc(friend_id)
        //     .collection('list').doc(event_id).collection('members')
        //     .listDocuments()
        // const membersIdList = membersList.docs.map(doc => doc.data())

        var notification = await db.collection('notification').doc(friend_id)
            .collection('member_notify').get()
        const notificationId = members.docs.map(doc => doc.data())
        // var notificationList = await db.collection('notification').doc(friend_id)
        // .collection('member_notify').get()
        // const notificationIdList = members.docs.map(doc => doc.data())
        
        let eventCounter = 0;
        let notificationCounter = 0;
        //let eventIndex = -1;
        //let notificationIndex = -1;

        var eventdeleted = false
        var notificationDeleted = false


        membersId.forEach(element => {
            if (element.friend_id == user.uid && element.status == "pending") {
                console.log(element.requestId)
                db.collection('events').doc(friend_id)
                .collection('list').doc(event_id).collection('members')
                .doc(element.requestId).delete()
                
                db.collection('notification').doc(friend_id)
                .collection('member_notify').doc(element.notificationId)
                .delete()
                eventdeleted = true
                notificationDeleted = true
            }
            //eventCounter++;
        });
        // notificationId.forEach(element => {
        //     if (element.uid_from == user.uid && element.event_id == event_id) {
        //         notificationIndex = notificationCounter
        //     }
        //     notificationCounter++;
        // });


        // if (eventIndex == -1) {
        //     Alert.alert("Ops, your friend already know you want to join")
        // } else {
        //     // db.collection('notification').doc(friend_id)
        //     // .collection('member_notify')
        //     // .doc(notificationIdList[notificationIndex]).delete()
        //     db.collection('notification').doc(friend_id)
        //     .collection('member_notify').doc[notificationCounter].delete
        //     console.log("notification deleted")
        // }
        if (!eventdeleted) {
            Alert.alert("Can't cancel")
        // } else {
        //     // db.collection('events').doc(friend_id)
        //     // .collection('list').doc(event_id).collection('members')
        //     // .doc(membersIdList[eventCounter]).delete()
        //     db.collection('events').doc(friend_id)
        //     .collection('list').doc(event_id).collection('members')
        //     .doc[eventCounter].delete()
        //     console.log("eventdeleted")

        }
    }
    catch (error) {
        console.log('join event error', error)
    }
}




    export default CancelJoinEvent