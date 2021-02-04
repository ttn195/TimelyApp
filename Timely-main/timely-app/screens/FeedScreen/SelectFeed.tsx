import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import SelectButton from "../../components/SelectButton";
import NotificationButton from "../../components/NotificationButton";

const windowHeight = Dimensions.get("window").height;
const SelectFeed = ({ onSelect, badge }) => {
  return (
    <View style={styles.container}>
      <SelectButton
        buttonTitle="Following"
        onPress={() => {
          onSelect("Following");
        }}
      />
      <NotificationButton
        buttonTitle={badge}
        onPress={() => onSelect("Notifications")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    display: "flex",
    width: "100%",
    paddingHorizontal: 4
  }
});
export default SelectFeed;
