import React from "react";
import { Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const windowHeight = Dimensions.get("window").height;

const SelectButton = ({ buttonTitle, ...rest }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} {...rest}>
      <Text style={styles.buttonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default SelectButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 5,
    width: "50%",
    height: windowHeight / 18,
    backgroundColor: "#2e64e5",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    marginHorizontal: 1
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff"
  }
});
