//FLow
//First user enters old password. Then firebase checks if the password is correct, if not retype password.
//Then create a new password and save that password for that user.

import * as React from 'react';
import { StyleSheet, TextInput, Alert,  SafeAreaView } from 'react-native';
import FormButton from '../components/FormButton';

import * as firebase from 'firebase';

export default class EditProfileScreen extends React.Component <{ route: any, navigation: any }, { currentPassword: string, newPassword:string }> {
 
    constructor(props) {
        super(props);
        this.state = {
        currentPassword: "",
        newPassword: "",
        };
      }
     
      reauthenticate = (currentPassword) => {
          var user = firebase.auth().currentUser;
          var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
          return user.reauthenticateWithCredential(cred);
      }

      onChangePasswordPress = () => {
        this.reauthenticate(this.state.currentPassword).then(() => {
          var user = firebase.auth().currentUser;
          user.updatePassword(this.state.newPassword).then(() => {
            this.props.navigation.goBack()
            Alert.alert("Password was changed");
          }).catch((error) => { console.log(error.message); });
        }).catch((error) => { console.log(error.message) });
      }
      render() {

    return(

    <SafeAreaView>
    
        <TextInput style= {styles.topText} value={this.state.currentPassword} 
             placeholder= "Current Password" secureTextEntry = {true} onChangeText= {(text) => { this.setState({currentPassword: text}) }} />

        <TextInput style= {styles.topText} value={this.state.newPassword} 
            placeholder= "New Password" secureTextEntry = {true} onChangeText= {(text) => { this.setState({newPassword: text}) }} />

        <FormButton  buttonTitle="Change Password" onPress={this.onChangePasswordPress}/>

    </SafeAreaView>
     );
}
}
   
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafd',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },

    topText: {
        textAlign: 'center',
        fontSize: 24,
        color: '#000000',
        margin: 25,
    },
    bottomText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#000000',
        marginBottom: 25,
    },
    textInput: {

    },
    alertText: {
        margin: 5,
        color: '#ff7979',
        fontSize: 12,
        marginTop: 0,
        fontWeight: 'bold'
    }
});