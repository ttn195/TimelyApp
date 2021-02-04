import React from "react";
import { Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { View } from "./Themed";

const windowHeight = Dimensions.get("window").height;

const NotificationButton = ({ buttonTitle, ...rest }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} {...rest}>
      <Ionicons
        style={styles.iconNoti}
        name="ios-notifications"
        size={30}
        color="#f5f6fa"
      />
      <View style={styles.badgeContent}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 5,
    width: "50%",
    height: windowHeight / 18,
    backgroundColor: "#2e64e5",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    marginHorizontal: 1
  },
  badgeContent: {
    backgroundColor: "#e55039",
    borderRadius: 22 / 2,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -7,
    marginTop: -12
  },
  buttonText: {
    fontSize: 11,
    color: "#f5f6fa",
    fontWeight: "bold"
  },
  iconNoti: {
    //marginRight: 5
  }
});
