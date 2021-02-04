import { StyleSheet, SafeAreaView, View, TouchableOpacity } from "react-native";
import { Text } from "../../components/Themed";
import React, { useState, useEffect, useContext } from "react";
import { ButtonGroup } from "react-native-elements";

const FollowingFilter = ({ onPressFilter }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState();

  const updateIndex = index => {
    setSelectedIndex(index);
    //console.log("all pressed", index);
    switch (index) {
      case 0:
        //console.log("all pressed", index);
        onPressFilter(false);
        setSelectedColor({
          backgroundColor: "#0097e6"
        });
        break;
      case 1:
        //console.log("Own by other pressed", index);
        onPressFilter(true);
        setSelectedColor({
          backgroundColor: "#192a56"
        });
        break;
    }
  };

  const buttons = ["Events", "Goals"];

  return (
    <View style={styles.filterContent}>
      <Text style={styles.filterText}>Filter:</Text>
      <ButtonGroup
        onPress={selectedIndex => updateIndex(selectedIndex)}
        selectedIndex={selectedIndex}
        buttons={buttons}
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
        selectedButtonStyle={[styles.selectedButton, selectedColor]}
      />
    </View>
  );
};
export default FollowingFilter;

const styles = StyleSheet.create({
  filterContent: {
    alignItems: "flex-start"
  },
  buttonContainer: {
    height: 30,
    backgroundColor: "#00000000",
    borderWidth: 0
  },
  button: {
    //backgroundColor: "grey",
    marginHorizontal: 3,
    borderRadius: 5
  },
  selectedButton: {
    borderRadius: 5
  },
  filterText: {
    fontSize: 14,
    color: "#718093",
    marginLeft: 15,
    fontWeight: "bold"
  }
});
