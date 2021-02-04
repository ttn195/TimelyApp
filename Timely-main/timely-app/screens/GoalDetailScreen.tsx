import {
  SafeAreaView,
  Switch,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { windowHeight, windowWidth } from "../utils/Dimensions";

export const GoalDetailScreen = ({ route, navigation }) => {
  const endDate = route.params.end.toDate();
  const image = route.params.picUrl;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView style={styles.container}>
        {image ? (
          <Image source={{ uri: image }} style={styles.defaultPic} />
        ) : (
          <View style={styles.defaultPic}>
            <AntDesign name="picture" size={40} color="#666" />
          </View>
        )}

        <Text style={styles.title}>{route.params.title}</Text>
        <View style={styles.detailContent}>
          <AntDesign style={styles.detailIcon} name="filetext1" size={45} />

          <Text style={styles.contentText} numberOfLines={5}>
            {route.params.description}
          </Text>
        </View>
        <View style={styles.detailContent}>
          <AntDesign style={styles.detailIcon} name="clockcircleo" size={45} />
          <View style={styles.contentBody}>
            <Text style={styles.contentText}>Completed By:</Text>

            <Text style={styles.notCompleteTextBoxStyle}>
              {new Date(endDate).toLocaleString("en-US")}
            </Text>
          </View>
        </View>
        <View style={styles.detailContent}>
          <AntDesign style={styles.detailIcon} name="checksquareo" size={45} />
          <View style={styles.contentBody}>
            <Text style={styles.contentText}>Status:</Text>
            {route.params.status ? (
              <Text style={styles.completeTextBoxStyle}>Completed</Text>
            ) : (
              <Text style={styles.notCompleteTextBoxStyle}>
                Not yet completed
              </Text>
            )}
          </View>
        </View>
        <View style={styles.detailContent}>
          <AntDesign style={styles.detailIcon} name="infocirlceo" size={45} />
          <View style={styles.contentBody}>
            <Text style={styles.contentText}>Public:</Text>
            {route.params.public ? (
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

export default GoalDetailScreen;

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
