import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
  Dimensions
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {windowHeight, windowWidth} from '../../utils/Dimensions';

const Loader = props => {
  const {
    progress,
    isDone,
    messText,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
        {isDone ?
            (
             <>
                <AntDesign name="check" size={45} color="#2ecc71" />
                <Text style={styles.messText}>{messText}</Text>
             </>
            ) :

            (
                <>
                    <ActivityIndicator size="large" color="#ff7979" />
                    <Text style={styles.messText}>{messText} {progress}</Text>
                </>
            )
        }

        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000070'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#ecf0f1',
    height: windowWidth / 2.5,
    width: windowWidth / 1.5,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 5,
  },
  messText: {
      alignSelf: 'center',
      color: '#2c3e50'
  }
});

export default Loader;