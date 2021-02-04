import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Alert,
  TouchableWithoutFeedback
} from "react-native";
import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Text } from "../Themed";
import { windowHeight, windowWidth } from "../../utils/Dimensions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { upperCaseFirstLetter } from "../../utils/utils";

export const FollowingGoalListItem = ({ itemDetail, navigation }) => {
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
    navigation.navigate("FollowingGoalDetail", itemDetail);
  };

  return (
    <View style={styles.list}>
      <TouchableWithoutFeedback onPress={() => handleViewDetail(itemDetail)}>
        {itemDetail.picUrl ? (
          <Image
            source={{ uri: itemDetail.picUrl }}
            style={styles.defaultPic}
          />
        ) : (
          <View style={styles.defaultPic}>
            <AntDesign name="picture" size={35} color="#666" />
          </View>
        )}
      </TouchableWithoutFeedback>
      <View style={styles.content}>
        <TouchableWithoutFeedback onPress={() => handleViewDetail(itemDetail)}>
          <View style={styles.contentText}>
            <Text style={styles.title} numberOfLines={2}>
              {upperCaseFirstLetter(itemDetail.title)}
            </Text>
            {itemDetail.status ? (
              <Text style={styles.status}>Completed</Text>
            ) : (
              <Text style={styles.statusNotComp}>Not yet completed</Text>
            )}
            <Text style={styles.titleComplete}>
              Complete By:{" "}
              {new Date(itemDetail.end.toDate()).toLocaleString("en-US")}
            </Text>
            <Text style={styles.titleComplete}>
              From: {getUserName(itemDetail.friend_info)}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f9fafd",
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#ced6e090"
  },

  title: {
    fontSize: 13,
    color: "#2c3e50",
    alignSelf: "flex-start",
    fontWeight: "bold",
    height: "60%",
    marginBottom: 3
  },
  defaultPic: {
    backgroundColor: "#dcdde1",
    height: windowHeight / 7.5,
    width: windowWidth / 3.5,
    //borderColor: "#cccccc90",
    borderRadius: 3,
    //borderWidth: 1,
    justifyContent: "center",
    alignSelf: "flex-start",
    alignItems: "center"
  },
  content: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 4,
    backgroundColor: "#ecf0f1",
    margin: 1
  },
  contentText: {
    height: "75%",
    alignSelf: "flex-start",
    margin: 1
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
    marginBottom: 2
  },
  removeButton: {
    backgroundColor: "#353b48",
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginTop: 2
  },
  titleComplete: {
    fontSize: 10,
    color: "#34495e",
    fontWeight: "bold",
    marginTop: 1
  },
  status: {
    backgroundColor: "#22a6b3",
    fontSize: 9,
    color: "#ecf0f1",
    fontWeight: "bold",
    borderRadius: 3,
    alignSelf: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: 5
  },
  statusNotComp: {
    backgroundColor: "#ff6b6b",
    fontSize: 9,
    color: "#ecf0f1",
    fontWeight: "bold",
    borderRadius: 3,
    alignSelf: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: 5
  }
});

export default FollowingGoalListItem;
