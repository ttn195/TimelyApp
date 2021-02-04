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

export const ListItem = ({
  onPressDetail,
  itemDetail,
  onPressVewDetail,
  onPressRemoveGoal
}) => {
  const createDeleteAlert = () =>
    Alert.alert(
      "Goal Delete",
      "Are you sure about this?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "DELETE", onPress: () => onPressRemoveGoal(itemDetail) }
      ],
      { cancelable: false }
    );

  return (
    <View style={styles.list}>
      <TouchableWithoutFeedback onPress={() => onPressVewDetail(itemDetail)}>
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
        <TouchableWithoutFeedback onPress={() => onPressVewDetail(itemDetail)}>
          <View style={styles.contentText}>
            <Text style={styles.title} numberOfLines={3}>
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
          </View>
        </TouchableWithoutFeedback>
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
    marginBottom: 3,
    marginTop: 2
  },
  defaultPic: {
    backgroundColor: "#dcdde1",
    height: windowHeight / 8,
    width: windowWidth / 4,
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
    width: "82%",
    height: "90%",
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
    fontWeight: "bold"
  },
  status: {
    backgroundColor: "#22a6b3",
    fontSize: 9,
    color: "#ecf0f1",
    fontWeight: "bold",
    borderRadius: 3,
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 5
  },
  statusNotComp: {
    backgroundColor: "#ff6b6b",
    fontSize: 9,
    color: "#ecf0f1",
    fontWeight: "bold",
    borderRadius: 3,
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 5
  }
});

export default ListItem;
