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
import React, { useState, useEffect } from "react";
//import { TouchableOpacity} from 'react-native-gesture-handler'

const FriendListItem = ({
  member,
  addMember,
  onPressCancelInvitation,
  checkMembersData
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [itemColor, setItemColor] = useState();
  let fullName;
  if (member.first_name && member.last_name) {
    fullName = member.first_name + " " + member.last_name;
  }

  useEffect(() => {
    //clean up useEffect
    let isSubscribed = true;
    if (isSubscribed) {
      if (member.isFriendSelected) {
        isFriendSelected(member.isFriendSelected);
      }
      return () => (isSubscribed = false);
    }
  }, []);

  const isFriendSelected = selected => {
    //console.log("Friend selected?");
    setIsSelected(selected);
    if (selected) {
      //console.log("Friend selected? ", isSelected);
      setItemColor(styles.selected);
    } else {
      //console.log("Friend selected? ", isSelected);
      setItemColor(styles.memberList);
    }
  };

  return (
    <View style={[styles.memberList, itemColor]}>
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
      {//check if member data got from db
      !member.isMemberFromDB ? (
        <>
          {!isSelected ? (
            <TouchableOpacity
              style={styles.memberSelect}
              onPress={() => {
                isFriendSelected(true);
                //this func is retrieveFriendInvitation in AddEventScreen
                addMember(member);
              }}
            >
              <AntDesign name="plus" size={25} color="#718093" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.memberSelected}
              onPress={() => {
                isFriendSelected(false);
                console.log("cancel member", member);

                //cancel a invitation
                onPressCancelInvitation(member);
              }}
            >
              <AntDesign name="check" size={25} color="#f5f6fa" />
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={styles.memberInvited}>
          <Text style={styles.memberInvitedText}>invited</Text>
        </View>
      )}
    </View>
  );
};

export default FriendListItem;

const styles = StyleSheet.create({
  memberList: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5,
    borderRadius: 5,
    borderColor: "#778ca350",
    borderWidth: 1,
    width: "95%",
    padding: 5,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa"
  },
  selected: {
    backgroundColor: "#74b9ff70",
    borderColor: "#74b9ff90"
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
  memberSelect: {
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 40 / 2,
    borderColor: "#718093",
    borderWidth: 1,
    marginVertical: 5,
    marginRight: 10
  },
  memberSelected: {
    backgroundColor: "#2d98da",
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 40 / 2,
    borderColor: "#2d98da",
    borderWidth: 1,
    marginVertical: 5,
    marginRight: 10
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
    height: windowHeight / 14,
    width: windowHeight / 14,
    justifyContent: "center",
    alignSelf: "flex-start",
    alignItems: "center",
    borderRadius: windowHeight / 14 / 2
  }
});
