import {
  SafeAreaView,
  Switch,
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { windowHeight, windowWidth } from "../utils/Dimensions";
import firebase from "../fbconfig";
import { AuthContext } from "../providers/AuthProvider.js";
import { upperCaseFirstLetter } from "../utils/utils";
import MemberListItem from "../components/PlanScreen/MemberListItem";

export const FollowingEventDetailScreen = ({ route, navigation }) => {
  //get member detail
  const memberDetail = route.params;

  const [memberList, setMemberList] = useState();
  const endDate = memberDetail.end.toDate();
  const startDate = memberDetail.start.toDate();

  const db = firebase.firestore();

  useEffect(() => {
    //clean up useEffect
    let isSubscribed = true;
    if (isSubscribed) {
      try {
        getMembers();
      } catch (error) {
        console.log("retrieve members list error: " + error);
      }
    }
    return () => (isSubscribed = false);
  }, []);

  const getMembers = async () => {
    //get members info

    await db
      .collection("events")
      .doc(memberDetail.friend_id)
      .collection("list")
      .doc(memberDetail.id)
      .collection("members")
      .where("status", "==", "joined")
      .onSnapshot(snapshot => {
        let members = [{ ...memberDetail.friend_info, isOwner: true }];
        console.log(members);
        if (snapshot.size) {
          snapshot.forEach(member => {
            db.collection("profiles")
              .doc(member.data().friend_id)
              .get()
              .then(info => {
                members.push({
                  ...info.data(),
                  id: info.id
                });
              });
          });
        }
        setTimeout(() => {
          console.log(members);
          setMemberList(members);
        }, 300);
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.detailContentTitle}>
          <Text style={styles.title}>{memberDetail.title}</Text>
        </View>
        <View style={styles.detailContent}>
          <AntDesign style={styles.detailIcon} name="profile" size={45} />

          <Text style={styles.contentText} numberOfLines={5}>
            {memberDetail.description}
          </Text>
        </View>
        <View style={styles.detailContent}>
          <AntDesign style={styles.detailIcon} name="tago" size={45} />
          <View style={styles.contentBody}>
            <Text style={styles.contentText}>Goal:</Text>
            <Text style={styles.contentText}>{memberDetail.goal}</Text>
          </View>
        </View>
        <View style={styles.detailContent}>
          <AntDesign style={styles.detailIcon} name="team" size={45} />
          <View style={styles.contentBody}>
            <Text style={styles.contentText}>Members:</Text>
            {memberList ? (
              <FlatList
                data={memberList}
                renderItem={({ item }) => <MemberListItem member={item} />}
              />
            ) : (
              <Text style={styles.notCompleteTextBoxStyle}>
                No members Available.
              </Text>
            )}
          </View>
        </View>
        <View style={styles.detailContent}>
          <AntDesign style={styles.detailIcon} name="clockcircleo" size={45} />
          <View style={styles.contentBody}>
            <Text style={styles.contentText}>Started By:</Text>

            <Text style={styles.notCompleteTextBoxStyle}>
              {new Date(startDate).toLocaleString("en-US")}
            </Text>
            <Text style={styles.contentText}>Ended By:</Text>

            <Text style={styles.notCompleteTextBoxStyle}>
              {new Date(endDate).toLocaleString("en-US")}
            </Text>
          </View>
        </View>
        <View style={styles.detailContent}>
          <AntDesign style={styles.detailIcon} name="infocirlceo" size={45} />
          <View style={styles.contentBody}>
            <Text style={styles.contentText}>Public:</Text>
            {memberDetail.public ? (
              <Text style={styles.notCompleteTextBoxStyle}>Yes</Text>
            ) : (
              <Text style={styles.notCompleteTextBoxStyle}>No</Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default FollowingEventDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 0
  },

  defaultPic: {
    backgroundColor: "#dcdde1",
    height: windowHeight / 3.5,
    width: "100%",
    borderColor: "#ccc",
    borderRadius: 3,
    borderWidth: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center"
  },
  detailContentTitle: {
    height: windowHeight / 10,
    backgroundColor: "#7ed6df",
    marginBottom: 4,
    borderRadius: 5,
    paddingLeft: 10,
    justifyContent: "center"
  },
  title: {
    fontSize: 16,
    textTransform: "capitalize",
    color: "#34495e",
    marginVertical: 5,
    fontWeight: "bold"
  },
  detailContent: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fbc531",
    marginBottom: 4,
    borderRadius: 5
  },
  detailIcon: {
    color: "#2f3640",
    marginRight: 15,
    marginTop: 10,
    marginLeft: 5
  },
  contentBody: {
    flex: 1
  },

  contentText: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    color: "#34495e",
    width: "80%"
  },

  completeTextBoxStyle: {
    fontSize: 18,
    color: "#10ac84",
    alignItems: "flex-start",
    fontWeight: "bold",
    marginVertical: 5
  },

  descriptionBoxStyle: {
    backgroundColor: "#fff",
    height: windowHeight / 8,
    paddingLeft: 10,
    borderColor: "#ccc",
    borderRadius: 3,
    borderWidth: 1
  },

  notCompleteTextBoxStyle: {
    fontSize: 18,
    color: "#576574",
    alignItems: "flex-start",
    fontWeight: "bold",
    marginVertical: 5
  }
});
