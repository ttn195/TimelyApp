import {
  SafeAreaView,
  Switch,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { windowHeight, windowWidth } from "../utils/Dimensions";
import firebase from "../fbconfig";
import { AuthContext } from "../providers/AuthProvider.js";

import { Text, View } from "../components/Themed";
import FormButton from "../components/FormButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationActions } from "react-navigation";
import { upperCaseFirstLetter } from "../utils/utils";

const friendStatusArray = ["", "non", "friends", "pending"];
const OtherProfileScreen = ({ navigation, route }: any) => {
  const db = firebase.firestore();
  const { currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState<any>({ empty: true });
  const [friendStatus, setFriendStatus] = useState<number>(0);

  useEffect(() => {
    // Redirect to profile if user
    if (currentUser.uid === route.params.uid) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Friends"
          }
        ]
      });
      return navigation.navigate("Profile");
    }

    // Getting profile and friend status
    db.collection("profiles")
      .doc(route.params.uid)
      .get()
      .then(snapshot => {
        const newProfile = snapshot.data();
        setProfile(newProfile);
        db.collection("profiles")
          .doc(route.params.uid)
          .collection("friend_list")
          .doc(currentUser.uid)
          .get()
          .then(snapshot => {
            const friendDoc = snapshot.data();
            if (!friendDoc) setFriendStatus(1);
            else if (friendDoc.pending) setFriendStatus(2);
            else setFriendStatus(3);
          });
      });
  }, []);

  function handleFriend() {
    // Add doc to collection
    db.collection("profiles")
      .doc(route.params.uid)
      .collection("friend_list")
      .doc(currentUser.uid)
      .set({
        friend_id: route.params.uid,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        pending: true
      });
    // Add notif
    db.collection("notification")
      .doc(route.params.uid)
      .collection("member_notify")
      .doc(currentUser.uid)
      .set({
        created: firebase.firestore.FieldValue.serverTimestamp(),
        type: "friendRequest",
        uid_from: currentUser.uid,
        email_from: currentUser.email,
        uid_to: route.params.uid,
        status: "pending"
      });
    setFriendStatus(2);
  }

  function handleUnfriend() {
    // Remove docs from both profiles
    db.collection("profiles")
      .doc(currentUser.uid)
      .collection("friend_list")
      .doc(route.params.uid)
      .delete();
    db.collection("profiles")
      .doc(route.params.uid)
      .collection("friend_list")
      .doc(currentUser.uid)
      .delete();
    setFriendStatus(1);
  }

  function renderAddButton() {
    // Render add button depending on friendStatus
    if (friendStatus === 1) {
      return <FormButton buttonTitle="Add Friend" onPress={handleFriend} />;
    }
    if (friendStatus === 2) {
      return (
        <FormButton buttonTitle="Pending" onPress={() => {}} disabled={true} />
      );
    }
    if (friendStatus === 3) {
      return <FormButton buttonTitle="Unfriend" onPress={handleUnfriend} />;
    }
  }

  const { email, bio } = profile;
  const image = profile.profileImgURL
    ? { uri: profile.profileImgURL }
    : require("../assets/images/proplaceholder.jpg");
  //const name = profile.full_name ? profile.full_name : "Not yet set";

  let fullName;
  if (profile.first_name && profile.last_name) {
    fullName =
      upperCaseFirstLetter(profile.first_name) +
      " " +
      upperCaseFirstLetter(profile.last_name);
  } else {
    fullName = "Not yet set";
  }

  if (!email) return <ActivityIndicator size="large" color="#0097e6" />;
  return (
    <SafeAreaView style={styles.container}>
      {image && <Image source={image} style={styles.defaultPic} />}
      <Text style={styles.dispText}>Name: {fullName}</Text>
      <Text style={styles.dispText}>Email: {email}</Text>
      <Text style={styles.dispText}>Bio: {bio}</Text>
      {renderAddButton()}
    </SafeAreaView>
  );
};

export default OtherProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  verticalButton: {},
  defaultPic: {
    backgroundColor: "#dcdde1",
    height: windowHeight / 4,
    width: windowHeight / 4,
    borderColor: "#ccc",
    borderRadius: windowHeight / 4 / 2,
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 50
  },
  cog: {
    width: 50,
    height: 50
  },
  profile_picture: {},
  buttonContainer: {
    backgroundColor: "#2e64e5",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3
  },
  bottomText: {
    fontFamily: "Roboto",
    textAlign: "center",
    fontSize: 14,
    color: "#000000",
    marginBottom: 25
  },
  textInput: {},
  dispText: {
    fontSize: 18,
    color: "#fefefe",
    margin: 20
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff"
  },
  button1: {},
  alertText: {
    margin: 5,
    color: "#ff7979",
    fontSize: 12,
    marginTop: 0,
    fontWeight: "bold"
  }
});
