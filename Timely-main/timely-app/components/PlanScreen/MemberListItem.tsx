import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Alert,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { windowHeight, windowWidth } from "../../utils/Dimensions";
import React from "react";
const MemberListItem = ({ member }) => {
  let fullName;
  if (member.first_name && member.last_name) {
    fullName = member.first_name + " " + member.last_name;
  }

  return (
    <View style={styles.memberList}>
      {member.profileImgURL ? (
        <Image
          source={{ uri: member.profileImgURL }}
          style={styles.defaultPic}
        />
      ) : (
        <View style={styles.defaultPic}>
          <AntDesign name="user" size={25} color="#666" />
        </View>
      )}
      <View style={styles.memberInfo}>
        {fullName && (
          <Text style={styles.contentText}>{fullName.toUpperCase()}</Text>
        )}
        <Text style={styles.contentText}>{member.email}</Text>
      </View>

      {member.isOwner && (
        <View>
          <Text style={styles.ownText}>Owner</Text>
        </View>
      )}
    </View>
  );
};

export default MemberListItem;

const styles = StyleSheet.create({
  memberList: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 5,
    width: "95%",
    padding: 3,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#f6e58d",
    marginBottom: 2
  },
  memberInfo: {
    flex: 1,
    marginVertical: 5,
    marginLeft: 10,
    justifyContent: "center"
  },
  contentText: {
    color: "#2f3542",
    fontSize: 13
  },
  memberInvited: {
    backgroundColor: "#273c75",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  memberInvitedText: {
    color: "#dcdde1",
    fontSize: 11
  },
  defaultPic: {
    backgroundColor: "#dcdde1",
    height: windowHeight / 15,
    width: windowHeight / 15,
    justifyContent: "center",
    alignSelf: "flex-start",
    alignItems: "center",
    borderRadius: windowHeight / 15 / 2
  },
  ownText: {
    backgroundColor: "#7ed6df",
    fontSize: 11,
    color: "#34495e",
    fontWeight: "bold",
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 5,
    alignSelf: "flex-end"
  }
});
