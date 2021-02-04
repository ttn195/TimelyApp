import React from "react";
import { Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const NewEventButton = props => {
  const handlePress = () => {
    switch (props.selected) {
      case "Events":
        return props.navigation.navigate("NewEvent");
      case "Goals":
        return props.navigation.navigate("NewGoal");
    }
  };

  const buttonTitle = () => {
    switch (props.selected) {
      case "Events":
        return "+ New Event";
      case "Goals":
        return "+ New Goal";
    }
  };
  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      {...props}
      onPress={handlePress}
    >
      <Text style={styles.buttonText}>{buttonTitle()}</Text>
    </TouchableOpacity>
  );
};

export default NewEventButton;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#2e64e5",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff"
  }
});
