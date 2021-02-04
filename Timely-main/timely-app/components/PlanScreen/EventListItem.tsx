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
import { AuthContext } from "../../providers/AuthProvider.js";

import firebase from "../../fbconfig";
import {
  upperCaseFirstLetter,
  getFormattedDateString
} from "../../utils/utils";

export const EventListItem = ({
  onPressDetail,
  itemDetail,
  navigation
}: any) => {
  const { currentUser } = useContext(AuthContext);
  const db = firebase.firestore();
  const [memberCount, setMemberCount] = useState(0);
  const [ownerDetail, setOwnerDetail] = useState();

  useEffect(() => {
    //clean up useEffect
    let isSubscribed = true;
    if (isSubscribed) {
      try {
        getMemberCount(itemDetail);
        getOwnerDetail(itemDetail);
      } catch (error) {
        console.log("retrieve member count error: " + error);
      }
    }
    return () => {
      isSubscribed = false;
    };
  }, []);

  const getMemberCount = (event: any) => {
    let uid = currentUser.uid;
    let countOwner = 0;
    if (event.uid_owner) {
      //log("owner: ", event.uid_owner))
      uid = event.uid_owner;
      countOwner = 1;
    }
    db.collection("events")
      .doc(uid)
      .collection("list")
      .doc(event.id)
      .collection("members")
      .where("status", "==", "joined")
      .onSnapshot(snapshot => {
        //console.log("newcount: " + event.id, snapshot.size);
        setMemberCount(snapshot.size + countOwner);
      });
  };

  const getOwnerDetail = (event: any) => {
    if (event.uid_owner) {
      db.collection("profiles")
        .doc(event.uid_owner)
        .get()
        .then((owner: any) => {
          setOwnerDetail(owner.data());
        });
    }
  };
  const getUserName = info => {
    let name;
    if (info.first_name || info.last_name) {
      const fullname =
        upperCaseFirstLetter(info.first_name) +
        " " +
        upperCaseFirstLetter(info.last_name);
      name = fullname;
    } else {
      name = info.email;
    }
    return name;
  };
  const handleViewDetail = itemDetail => {
    //console.log("detail pressed", itemDetail);
    navigation.navigate("EventDetail", {
      itemDetail: itemDetail,
      ownerDetail: ownerDetail
    });
  };

  const handleRemoveEvent = async itemDetail => {
    let query = await db
      .collection("events")
      .doc(currentUser.uid)
      .collection("list")
      .doc(itemDetail.id);

    query
      .collection("members")
      .get()
      .then(members => {
        if (members.size) {
          members.forEach(member => {
            //delete all members
            query
              .collection("members")
              .doc(member.id)
              .delete();

            //delete member in group list
            db.collection("events")
              .doc(member.data().friend_id)
              .collection("group_list")
              .doc(itemDetail.id)
              .delete();
            //delete all notifications from this event
            let notiQuery = db
              .collection("notification")
              .doc(member.data().friend_id)
              .collection("member_notify");
            //search for all notifications that belong to this event
            notiQuery
              .where("event_id", "==", itemDetail.id)
              .get()
              .then(items => {
                if (items.size) {
                  items.forEach(item => {
                    //delete notification
                    notiQuery
                      .doc(item.id)
                      .delete()
                      .then(() => {
                        console.log("delete event's notification successfully");
                      });
                  });
                }
              });
          });
        }
        //delete event
        query
          .delete()
          .then(function() {
            console.log("Document successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing document: ", error);
          });
        //delete current user's event notification
        let notiOwnerQuery = db
          .collection("notification")
          .doc(currentUser.uid)
          .collection("member_notify");
        notiOwnerQuery
          .where("event_id", "==", itemDetail.id)
          .get()
          .then(items => {
            if (items.size) {
              items.forEach(item => {
                //delete notification
                notiOwnerQuery
                  .doc(item.id)
                  .delete()
                  .then(() => {
                    console.log(
                      "delete onwer event's notification successfully"
                    );
                  });
              });
            }
          });
      });
  };

  const createDeleteAlert = () =>
    Alert.alert(
      "Event Delete",
      "Are you sure about this?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "DELETE", onPress: () => handleRemoveEvent(itemDetail) }
      ],
      { cancelable: false }
    );

  return (
    <View style={styles.list}>
      <View style={styles.content}>
        <TouchableWithoutFeedback onPress={() => handleViewDetail(itemDetail)}>
          <View style={styles.contentText}>
            {!ownerDetail ? (
              <View style={styles.ownContent}>
                <Text style={styles.ownText}>Owned by you</Text>
              </View>
            ) : (
              <View style={styles.ownContent}>
                <Text style={styles.ownerText}>
                  Owned by {getUserName(ownerDetail)}
                </Text>
              </View>
            )}
            <Text style={styles.title} numberOfLines={3}>
              {upperCaseFirstLetter(itemDetail.title)}
            </Text>
            <Text style={styles.memberText}>Members: {memberCount}</Text>
            <View style={styles.dateContent}>
              <Text style={styles.titleStart}>
                Start By:{"  "}
                {getFormattedDateString(itemDetail.start.toDate())}
              </Text>
              <Text style={styles.titleEnd}>
                End By:{"  "}
                {getFormattedDateString(itemDetail.end.toDate())}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {!itemDetail.uid_owner && (
          <>
            <View style={styles.buttonSetting}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => onPressDetail(itemDetail)}
              >
                <AntDesign name="edit" size={18} color="#f9fafd" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => createDeleteAlert()}
              >
                <AntDesign name="delete" size={18} color="#f9fafd" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
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
    borderWidth: 1,
    borderColor: "#ced6e090"
  },

  title: {
    fontSize: 14,
    color: "#2c3e50",
    alignSelf: "flex-start",
    //fontWeight: "bold",
    //height:'60%',
    marginBottom: 3,
    marginTop: 2
  },
  content: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 4,
    backgroundColor: "#ecf0f1",
    margin: 5
  },
  contentText: {
    width: "85%",
    //height: '90%',
    alignSelf: "flex-start",
    margin: 1
  },
  ownContent: {
    flex: 1
  },
  ownText: {
    backgroundColor: "#e58e26",
    fontSize: 9,
    color: "#ecf0f1",
    fontWeight: "bold",
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 5,
    alignSelf: "flex-end"
  },
  ownerText: {
    backgroundColor: "#192a56",
    fontSize: 9,
    color: "#ecf0f1",
    fontWeight: "bold",
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 5,
    alignSelf: "flex-end"
  },
  memberText: {
    fontSize: 12,
    color: "#2c3e50",
    fontWeight: "bold"
  },
  buttonSetting: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  editButton: {
    backgroundColor: "#20bf6b",
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginBottom: 4
  },
  removeButton: {
    backgroundColor: "#353b48",
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginTop: 4
  },
  dateContent: {
    flex: 1,
    flexDirection: "row"
  },
  titleStart: {
    fontSize: 12,
    color: "#34495e",
    fontWeight: "bold",
    marginRight: 10
  },
  titleEnd: {
    fontSize: 12,
    color: "#34495e",
    fontWeight: "bold",
    marginLeft: 10
  }
});

export default EventListItem;
