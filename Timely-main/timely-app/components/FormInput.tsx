import React from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width



const FormInput = ({ labelValue, placeholderText, iconType, nOfLines, ...rest }) => {
  return (
    <View style={styles.inputContainer}>
      { iconType ?
        <View style={styles.iconStyle}>
          <AntDesign name={iconType} size={25} color="#666" />
        </View> : null
      }      
      <TextInput
        value={labelValue}
        style={styles.input}
        numberOfLines={nOfLines ? nOfLines : 1}
        placeholder={placeholderText}
        placeholderTextColor="grey"
        {...rest}
      />
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});