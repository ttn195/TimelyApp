import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { windowHeight, windowWidth } from "../../utils/Dimensions";

function FriendBlock({ item, onPress, ...rest }: any) {
  let fullName;
  if (item.fullInfo.first_name && item.fullInfo.last_name) {
    fullName = item.fullInfo.first_name + " " + item.fullInfo.last_name;
  }

  return (
    <TouchableWithoutFeedback onPress={() => onPress(item)}>
      <View style={styles.item}>
        {item.fullInfo.profileImgURL ? (
          <Image
            source={{ uri: item.fullInfo.profileImgURL }}
            style={styles.defaultPic}
          />
        ) : (
          <View style={styles.defaultPic}>
            <AntDesign name="user" size={25} color="#666" />
          </View>
        )}
        <View style={styles.content}>
          {fullName && (
            <Text style={styles.title}>{fullName.toUpperCase()}</Text>
          )}
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default FriendBlock;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#ecf0f1",
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#ced6e090",
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  content: {
    alignContent: "center",
    alignSelf: "center"
  },
  title: {
    fontSize: 20,
    alignContent: "center"
  },
  defaultPic: {
    backgroundColor: "#dcdde1",
    height: windowHeight / 12,
    width: windowHeight / 12,
    justifyContent: "center",
    alignSelf: "flex-start",
    alignItems: "center",
    borderRadius: windowHeight / 12 / 2,
    marginRight: 10
  }
});
