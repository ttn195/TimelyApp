import { SafeAreaView, StyleSheet, Image } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { windowHeight } from "../utils/Dimensions";
import firebase from "../fbconfig";
import { AuthContext } from "../providers/AuthProvider.js";
import { Text, View } from "../components/Themed";
import FormButton from "../components/FormButton";
import { upperCaseFirstLetter } from "../utils/utils";

const ProfileScreen = ({ navigation }) => {
  const db = firebase.firestore();
  const { currentUser } = useContext(AuthContext);
  const user = firebase.auth();
  const [profile, setProfile] = useState<any>({});
  console.log("user", currentUser);
  function handleSignOut() {
    firebase.auth().signOut();
  }

  useEffect(() => {
    db.collection("profiles")
      .doc(currentUser.uid)
      .onSnapshot(snapshot => {
        const profile = snapshot.data();
        setProfile(profile);
      });
  }, []);

  const image = profile.profileImgURL;
  const email = currentUser.email;
  const bio = currentUser.bio ? currentUser.bio : "Not bio yet";

  let fullName;
  if (profile.first_name && profile.last_name) {
    fullName =
      upperCaseFirstLetter(profile.first_name) +
      " " +
      upperCaseFirstLetter(profile.last_name);
  } else {
    fullName = "Not yet set";
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.nameText}>{fullName}</Text>
      {image ? (
        <Image
          source={{ uri: profile.profileImgURL }}
          style={styles.profile_picture}
        />
      ) : (
        <View style={styles.profile_picture}>
          <AntDesign name="picture" size={40} color="#666" />
        </View>
      )}
      <Text style={styles.emailText}>{email}</Text>
      <Text style={styles.bioText}>{profile.bio}</Text>
      <FormButton
        buttonTitle="Edit Profile"
        onPress={() => {
          navigation.navigate("EditProfile", profile);
        }}
      />
      <FormButton buttonTitle="Sign Out" onPress={handleSignOut} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  nameText: {
    fontSize: 36,
    color: "#8395a7"
  },

  profile_picture: {
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
    marginTop: 25,
    marginBottom: 15
  },

  emailText: {
    fontSize: 18,
    textDecorationLine: "underline",
    marginBottom: 25,
    color: "#8395a7"
  },

  bioText: {
    fontSize: 18,
    marginBottom: 25,
    color: "#576574"
  },

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
