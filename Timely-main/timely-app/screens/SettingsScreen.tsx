import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import FormButton from '../components/FormButton';
import firebase from "../fbconfig";

export default function SettingsScreen() {

  function handleSignOut() {
    firebase.auth().signOut();
  }

  return (
    <View style={styles.container}>
      <FormButton
        buttonTitle="Sign Out" onPress={handleSignOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
