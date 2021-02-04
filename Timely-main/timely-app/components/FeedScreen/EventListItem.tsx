import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Alert,
  TouchableWithoutFeedback
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Text } from "../Themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  upperCaseFirstLetter,
  getFormattedDateString
} from "../../utils/utils";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider.js";
import joinEvent from "../../screens/JoinEvent"
import firebase from "../../fbconfig";
import CancelJoinEvent from "./CancelJoinEvent"
export const EventListItem = ({ itemDetail, navigation }) => {
  const [isSelected, setIsSelected] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const db = firebase.firestore();
  const [memberCount, setMemberCount] = useState(0);
  useEffect(() => {
    //clean up useEffect
    let isSubscribed = true;
    if (isSubscribed) {
      try {
        getMemberCount(itemDetail);
      } catch (error) {
        console.log("retrieve member count error: " + error);
      }
    }
    return () => {
      isSubscribed = false;
    };
  }, []);
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
        { text: "DELETE", onPress: () => console.log("Delete event Pressed") }
      ],
      { cancelable: false }
    );

  const getMemberCount = (event: any) => {
    db.collection("events")
      .doc(event.friend_id)
      .collection("list")
      .doc(event.id)
      .collection("members")
      .where("status", "==", "joined")
      .onSnapshot(snapshot => {
        //console.log("newcount: " + event.id, snapshot.size);
        setMemberCount(snapshot.size);
      });
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
    //console.log("view detail pressed", itemDetail);
    navigation.navigate("FollowingEventDetail", itemDetail);
  };
  return (
    <View style={styles.list}>
      <View style={styles.content}>
        <TouchableWithoutFeedback onPress={() => handleViewDetail(itemDetail)}>
          <View style={styles.contentText}>
            <Text style={styles.title} numberOfLines={1}>
              {upperCaseFirstLetter(itemDetail.title)}
            </Text>
            <Text style={styles.memberText}>Members: {memberCount}</Text>
            <View style={styles.dateContent}>
              <Text style={styles.titleStart}>
                Start:{"  "}
                {getFormattedDateString(itemDetail.start.toDate())}
              </Text>
              <Text style={styles.titleEnd}>
                End:{"  "}
                {getFormattedDateString(itemDetail.end.toDate())}
              </Text>
            </View>
            <Text style={styles.memberText}>
              From:{"  "}
              {getUserName(itemDetail.friend_info)}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.buttonSetting}>
          {!isSelected ? (
            <TouchableOpacity
              style={styles.joinEventButton}
              onPress={() => { 
                console.log("pressed joinEvent");
                //console.log(itemDetail.user_id)
                //console.log(itemDetail.id)
                joinEvent(itemDetail.friend_id,itemDetail.id)
                setIsSelected(true);
              }}
            >
              <Text style={styles.buttonText}>
                <AntDesign name="plus" size={12} color="#ecf0f1" />
                JOIN
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.pendingButton}
              onPress={() => {
                console.log("pressed to cancel");
                CancelJoinEvent(itemDetail.friend_id,itemDetail.id)
                setIsSelected(false);
              }}
            >
              <Text style={styles.buttonText}>
                <AntDesign name="close" size={12} color="#ecf0f1" />
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
    borderRadius: 3
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
    width: "78%",
    //height: '90%',
    alignSelf: "flex-start",
    margin: 1
  },
  ownContent: {
    flex: 1
  },
  buttonText: {
    fontSize: 12,
    color: "#ecf0f1",
    fontWeight: "bold",
    borderRadius: 3,
    paddingVertical: 7,
    paddingHorizontal: 7,
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
  pendingButton: {
    backgroundColor: "#ee5253",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3
  },
  dateContent: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 3
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
  },
  joinEventButton: {
    backgroundColor: "#20bf6b",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 3
  }
});

export default EventListItem;
