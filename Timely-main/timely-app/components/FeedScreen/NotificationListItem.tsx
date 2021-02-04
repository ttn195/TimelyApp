import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Alert,
  TouchableWithoutFeedback
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Text } from "../Themed";
import { windowHeight, windowWidth } from "../../utils/Dimensions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { upperCaseFirstLetter } from "../../utils/utils";
import firebase from "../../fbconfig";
import { AuthContext } from "../../providers/AuthProvider.js";

export const NotificationListItem = ({
  itemDetail,
  onPressVewDetail,
  getUserName,
  handleDone
}) => {
  const { currentUser } = useContext(AuthContext);
  const db = firebase.firestore();
  const [message, setMessage] = useState('');
  const [controlType, setControlType] = useState(false);

  useEffect(() => {
    //clean up useEffect
    let isSubscribed = true;
    console.log('i detail', itemDetail)
    if (isSubscribed) {
      try {
        defineTypeNotification(itemDetail.type);
      } catch (error) {
        console.log("retrieve member count error: " + error);
      }
    }
    return () => { isSubscribed = false };
  }, []);

  const defineTypeNotification = type => {
    switch (type) {
      case "inviteToEvent":
        const name = getUserName(itemDetail);
        setMessage(name + " has invited you to join an event: ");
        break;
      case "joinRequest":
        setControlType(false);
        setMessage(getUserName(itemDetail) + " wants to join your event: ")
        console.log('jr');
        break;
      case "joinEvent":
        break;
      case "acceptedEvent":
        setControlType(true);
        setMessage(itemDetail.message);
        break;
      case "declinedEvent":
        setControlType(true);
        setMessage(itemDetail.message);
        break;
      case "confirmation":
        setControlType(true);
        setMessage(getUserName(itemDetail) + itemDetail.message);
        break;
      case "friendRequest":
        setControlType(false);
        setMessage(getUserName(itemDetail) + " wants to be your friend.");
        console.log('fr');
        break;
      case "acceptedFriend":
        setControlType(true);
        setMessage(itemDetail.message);
        break;
      case "declinedFriend":
        setControlType(true);
        setMessage(itemDetail.message);
        break;
      default:
        break;
    }
  };

  const handleAccepted = noti => {
    if (noti.type === 'joinRequest') {
      handleAcceptedJoin(noti)
    } else if (noti.event_id) {
      handleAcceptedEvent(noti);
    } else if (noti.type === 'friendRequest') {
      handleAcceptedFriend(noti)
    }
  };

  const handleAcceptedJoin = async noti => {
    console.log(noti)
    await db
      .collection("events")
      .doc(noti.uid_to)
      .collection("list")
      .doc(noti.event_id)
      .collection("members")
      .doc(noti.member_id)
      .update({ status: "joined" })
      .then(() => {
        db.collection("events")
          .doc(noti.uid_from)
          .collection("group_list")
          .doc(noti.event_id)
          .set({
            created: Date.now(),
            event_id: noti.event_id,
            uid_event_owner: noti.uid_to
          })
          .then(() => {
            const confirmation = {
              created: Date.now(),
              type: "confirmation",
              uid_from: currentUser.uid,
              email_from:currentUser.uid,
              uid_to: noti.uid_from,
              event_id: noti.event_id,
              event_title: noti.event_title,
              message: "You have joined " + noti.event_title + "!",
              status: "done",
              member_id: noti.member_id
            };
            db.collection("notification")
              .doc(noti.uid_from)
              .collection("member_notify")
              .add(confirmation)
          });
      })
      .then(result => {
        console.log("update member is ok");
      })
      .catch(error => {
        console.log("add member error", error);
      });
  };

  const handleAcceptedEvent = async noti => {
    console.log(noti);
    await db
      .collection("events")
      .doc(noti.uid_from)
      .collection("list")
      .doc(noti.event_id)
      .collection("members")
      .doc(noti.member_id)
      .update({ status: "joined" })
      .then(() => {
        //add group event id into events collection for who is invited
        db.collection("events")
          .doc(noti.uid_to)
          .collection("group_list")
          .doc(noti.event_id)
          .set({
            created: Date.now(),
            event_id: noti.event_id,
            uid_event_owner: noti.uid_from
          })
          .then(() => {
            console.log("add group event successfully");
            //update current notification
            db.collection("notification")
              .doc(currentUser.uid)
              .collection("member_notify")
              .doc(noti.id)
              .update({
                type: "acceptedEvent",
                message: "You've now joined " + getUserName(noti) + "'s event:",
                status: "done"
              })
              .then(() => {
                //send other notification to owner to confirm
                const mes = " has joined your event: ";
                const confirmation = {
                  created: Date.now(),
                  type: "confirmation",
                  uid_from: currentUser.uid,
                  email_from: currentUser.email,
                  uid_to: noti.uid_from,
                  message: mes,
                  event_id: noti.event_id,
                  event_title: noti.event_title,
                  status: "pending",
                  member_id: noti.member_id
                };
                db.collection("notification")
                  .doc(noti.uid_from)
                  .collection("member_notify")
                  .add(confirmation);
              });
          });
      })
      .then(result => {
        console.log("update member is ok");
      })
      .catch(error => {
        console.log("add member error", error);
      });
  };

  const handleAcceptedFriend = (noti: any) => {
    console.log(noti);

    // Update our friend list
    db.collection('profiles').doc(noti.uid_to).collection('friend_list').doc(noti.uid_from).set({
      friend_id: noti.uid_from,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      pending: false
    })
    // Update their friendlist
    db.collection('profiles').doc(noti.uid_from).collection('friend_list').doc(noti.uid_to).set({
      friend_id: noti.uid_to,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      pending: false
    })

    // Update notifications
    db.collection("notification")
      .doc(currentUser.uid)
      .collection("member_notify")
      .doc(noti.id)
      .delete()

    db.collection("notification").doc(currentUser.uid).collection('member_notify').add({
      ...noti,
      type: "acceptedFriend",
      message: "You are now friends with " + getUserName(noti),
      status: "done"
    })
    //send other notification to owner to confirm
    const mes = " has accepted your friend request. ";
    const confirmation = {
      created: Date.now(),
      type: "confirmation",
      uid_from: currentUser.uid,
      email_from: currentUser.email,
      uid_to: noti.uid_from,
      message: mes,
      status: "pending",
    };
    db.collection("notification")
      .doc(noti.uid_from)
      .collection("member_notify")
      .add(confirmation);
  };

  const handleDeclined = noti => {
    //if this notification for declining event
    if (noti.event_id) {
      handleDeclinedEvent(noti);
    }

    if (noti.type === 'friendRequest') {
      handleDeclinedFriend(noti)
    }
  };
  const handleDeclinedEvent = async noti => {
    //console.log("decline", noti);

    await db
      .collection("events")
      .doc(noti.uid_from)
      .collection("list")
      .doc(noti.event_id)
      .collection("members")
      .doc(noti.member_id)
      .delete()
      .then(() => {
        console.log("deleted member successfully");

        //delete current notification
        db.collection("notification")
          .doc(currentUser.uid)
          .collection("member_notify")
          .doc(noti.id)
          .delete()
          .then(() => {
            //send declined notification to owner

            const mes = getUserName(noti) + " has declined your invitation: ";
            const confirmation = {
              created: Date.now(),
              type: "declinedEvent",
              uid_from: currentUser.uid,
              email_from: currentUser.email,
              uid_to: noti.uid_from,
              message: mes,
              event_id: noti.event_id,
              event_title: noti.event_title,
              status: "done",
              member_id: noti.member_id
            };
            db.collection("notification")
              .doc(noti.uid_from)
              .collection("member_notify")
              .add(confirmation);
          });
      });
  };

  const handleDeclinedFriend = (noti: any) => {
    //console.log("decline", noti);

    // Update our friend list
    db.collection('profiles').doc(noti.uid_to).collection('friend_list').doc(noti.uid_from).delete()

    //delete current notification
    db.collection("notification")
      .doc(currentUser.uid)
      .collection("member_notify")
      .doc(noti.id)
      .delete()
    //send declined notification to owner

    const mes = getUserName(noti) + " has declined your friend request. :( ";
    const confirmation = {
      created: Date.now(),
      type: "declinedFriend",
      uid_from: currentUser.uid,
      email_from: currentUser.email,
      uid_to: noti.uid_from,
      message: mes,
      event_id: noti.event_id,
      event_title: noti.event_title,
      status: "done",
      member_id: noti.member_id
    };
    db.collection("notification")
      .doc(noti.uid_from)
      .collection("member_notify")
      .add(confirmation);
  };

  return (
    <View style={styles.list}>
      <TouchableWithoutFeedback onPress={() => onPressVewDetail(itemDetail)}>
        {itemDetail.info_from.profileImgURL ? (
          <Image
            source={{ uri: itemDetail.info_from.profileImgURL }}
            style={styles.defaultPic}
          />
        ) : (
            <View style={styles.defaultPic}>
              <AntDesign name="user" size={30} color="#666" />
            </View>
          )}
      </TouchableWithoutFeedback>
      <View style={styles.content}>
        <TouchableWithoutFeedback onPress={() => onPressVewDetail(itemDetail)}>
          <View style={styles.contentText}>
            <Text style={styles.title} numberOfLines={2}>
              {message}
            </Text>
            <Text style={styles.titleEvent} numberOfLines={3}>
              {itemDetail.event_title && upperCaseFirstLetter(itemDetail.event_title)}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.buttonSetting}>
          {!controlType ? (
            <>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAccepted(itemDetail)}
              >
                <Text style={styles.acceptText}>
                  <AntDesign name="check" size={11} color="#10ac84" /> Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleDeclined(itemDetail)}
              >
                <Text style={styles.cancelText}>
                  <AntDesign name="close" size={11} color="#ee5253" /> Decline
                </Text>
              </TouchableOpacity>
            </>
          ) : (
              <>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleDone(itemDetail)}
                >
                  <Text style={styles.cancelText}>
                    <AntDesign name="close" size={11} color="#ee5253" /> Done
              </Text>
                </TouchableOpacity>
              </>
            )}
        </View>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#ecf0f1",
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 3,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ced6e090"
  },

  title: {
    fontSize: 12,
    color: "#2c3e50",
    alignSelf: "flex-start",
    fontWeight: "bold",
    marginBottom: 3,
    marginTop: 2
  },
  titleEvent: {
    fontSize: 13,
    color: "#2c3e50"
  },
  defaultPic: {
    backgroundColor: "#dcdde1",
    height: windowHeight / 10,
    width: windowHeight / 10,
    //borderColor: "#fff",
    borderRadius: windowHeight / 10 / 2,
    //borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginHorizontal: 15
  },
  content: {
    flex: 1,
    paddingLeft: 4,
    margin: 1
  },
  contentText: {
    //margin: 1,
    //backgroundColor: "#4cd137"
  },
  buttonSetting: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5
    //backgroundColor: "#e1b12c"
  },
  acceptText: {
    color: "#10ac84",
    fontSize: 10
  },
  cancelText: {
    color: "#ee5253",
    fontSize: 10
  },
  acceptButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 5,
    borderColor: "#10ac84",
    borderWidth: 1,
    marginHorizontal: 10
  },
  cancelButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 5,
    borderColor: "#ee5253",
    borderWidth: 1,
    marginHorizontal: 10
  },
  titleComplete: {
    fontSize: 10,
    color: "#34495e",
    fontWeight: "bold"
  }
});

export default NotificationListItem;
