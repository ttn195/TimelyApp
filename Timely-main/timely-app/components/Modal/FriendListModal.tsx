import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator
} from "react-native";
import { windowHeight, windowWidth } from "../../utils/Dimensions";
import FriendListItem from "../PlanScreen/FriendListItem";
import firebase from "../../fbconfig";
import { AuthContext } from "../../providers/AuthProvider";

const FriendListModal = props => {
  const {
    onPressModal,
    membersData,
    addMembers,
    sendCancelToModal,
    ...attributes
  } = props;

  const db = firebase.firestore();
  const { currentUser } = useContext(AuthContext);
  // initial state
  const [isVisible, setIsVisible] = useState(true);
  const [friendListData, setFriendListData] = useState();
  const [isFetching, setIsFetching] = useState();
  const [isMembersEmpty, setIsMembersEmpty] = useState(true);

  useEffect(() => {
    //clean up useEffect
    let isSubscribed = true;
    if (isSubscribed) {
      retrieveFriendList();
      return () => (isSubscribed = false);
    }
  }, []);

  // hide show modal
  const displayModal = show => {
    onPressModal(show);
    setIsVisible(show);
  };

  const retrieveFriendList = async () => {
    try {
      const data = await db
        .collection("profiles")
        .doc(currentUser.uid)
        .collection("friend_list")
        .where("pending", "==", false)
        .onSnapshot(snapshot => {
          if (snapshot.size) {
            setIsFetching(true);
            let friend_list = [];
            snapshot.forEach(item => {
              //call back to get all friend infor
              return db
                .collection("profiles")
                .doc(item.data().friend_id)
                .get()
                .then(doc => {
                  //console.log({...doc.data(), id: doc.id})
                  friend_list.push({ ...doc.data(), id: doc.id });
                });
            });
            setTimeout(() => {
              //add attribute to know which friend is already selected
              if (membersData) {
                setIsMembersEmpty(false);
                friend_list.forEach((friend, index) => {
                  membersData.forEach(member => {
                    if (member.id === friend.id) {
                      //console.log("isFriendSelected");
                      friend_list[index]["isFriendSelected"] = true;
                      if (member.member) {
                        friend_list[index]["isMemberFromDB"] = true;
                      }
                    }
                  });
                });
              } else {
                setIsMembersEmpty(true);
              }
              console.log(friend_list);
              setFriendListData(friend_list);
              setIsFetching(false);
            }, 800);
          } else {
            console.log("User does not have any friend");
          }
        });
    } catch (error) {
      console.log("retrieve friend list error", error);
    }
  };

  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        displayModal(false);
        console.log("Modal has now been closed.");
      }}
    >
      <View style={styles.container}>
        <View style={styles.contentBody}>
          <Text style={styles.text}>Invite Friends: </Text>
          {isFetching ? (
            <ActivityIndicator size="large" color="#ff7979" />
          ) : (
            <>
              {friendListData ? (
                <FlatList
                  data={friendListData}
                  renderItem={({ item }) => (
                    <FriendListItem
                      member={item}
                      addMember={addMembers}
                      onPressCancelInvitation={sendCancelToModal}
                      checkMembersData={isMembersEmpty}
                      //extraData={friendListData}
                    />
                  )}
                />
              ) : (
                <Text style={styles.noFriendtext}>
                  {"You have no friend :("}
                </Text>
              )}
            </>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              displayModal(false);
            }}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FriendListModal;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2f354295"
  },
  contentBody: {
    backgroundColor: "#ecf0f1",
    borderRadius: 6,
    width: "95%"
  },
  closeButton: {
    display: "flex",
    width: windowWidth / 3.5,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#2e64e5",
    shadowColor: "#2AC062",
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0
    },
    shadowRadius: 25,
    marginVertical: 20,
    fontWeight: "bold"
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18
  },
  image: {
    marginTop: 150,
    marginBottom: 10,
    width: "100%",
    height: 350
  },
  text: {
    fontSize: 18,
    marginVertical: 20,
    marginLeft: 10,
    fontWeight: "bold"
  },
  noFriendtext: {
    fontSize: 16,
    marginVertical: 20,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  }
});
