import {StyleSheet, TouchableOpacity, Alert, Image} from 'react-native';
import React, { useContext } from 'react'
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firebase from "../fbconfig";
import * as Google from 'expo-google-app-auth';
import {AuthContext} from "../providers/AuthProvider"
import { Formik } from "formik";
import * as Yup from "yup";
import { Text, View } from '../components/Themed';
import GoogleButton from '../components/GoogleButton'

export const SignInScreen = ({navigation}) => {

    const db = firebase.firestore();
    const {currentUser} = useContext(AuthContext);

    function handleSignIn(values){
        console.log('is pressed?? ', values)
        try{
            firebase
            .auth()
            .signInWithEmailAndPassword(values.email, values.password).then((res) =>{
                console.log('SIGNED IN SUCCESSFULLY: ')
                return db.collection('profiles').doc(res.user.uid).update(
                  {
                    last_logged_in: Date.now()
                  }
                )
            }).catch((err) => {
                Alert.alert('OOPS!', err.message, [{text:'Try again!'}])
                console.log(err)
            });
        } catch(err){
            console.log(err)
        }
    }

    async function handleSignInWithGoogleAsync() {
        try {
          const result = await Google.logInAsync({
            androidClientId: '953645514664-3j4ed83dtshv3bpuagshrq99gbcpa0v6.apps.googleusercontent.com',
            iosClientId: '953645514664-nabr329ih9vkf53l4ghh5a1060ihaec3.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {

            onSignIn(result)
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
      }

      function onSignIn(googleUser) {
        console.log('Google Auth Response', googleUser);
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(googleUser, currentUser)) {
              // Build Firebase credential with the Google ID token.
              var credential = firebase.auth.GoogleAuthProvider.credential(
                  googleUser.idToken,
                  googleUser.accessToken
              );
              // Sign in with credential from the Google user.
              firebase
                .auth()
                .signInAndRetrieveDataWithCredential(credential)
                .then((res) => {
                  //check if this is new user
                  if (res.additionalUserInfo.isNewUser) {
                    //save user info to firestore
                    return db.collection('profiles').doc(res.user.uid).set(
                        {
                            email: res.user.email,
                            first_name: googleUser.user.givenName,
                            last_name: googleUser.user.familyName,
                            profile_visibility: true,
                            profileImgURL: googleUser.user.photoUrl,
                            status: 0,
                            notification: false,
                            created: Date.now()
                        }
                    )
                  }else{
                    return db.collection('profiles').doc(res.user.uid).update(
                      {
                        last_logged_in: Date.now()
                      }
                    )
                  }
                }).then(() =>{
                      console.log('SIGNED IN WITH GOOGLE PROVIDER SUCCESSFULLY')
                  }).catch(error => {
                      console.log("google provider error:", error);
                  });
            } else {
              console.log('User already signed in to Firebase.');
            }
      }

      function isUserEqual(googleUser, firebaseUser) {

        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
              console.log('user id: ',providerData[i].uid)
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.user.id) {
               console.log('We dont need to reauth the Firebase connection.')
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      }

    /****** VALIDATION using Formik and Yup ******/  
    const initialValues = {
      email: '',
      password: ''
    }
    
    // With Yup validationSchema
    const signInValidationSchema = Yup.object().shape({
      email: Yup.string()
          .email("Please enter a valid email address.")
          .required('Email Address is Required'),
      password: Yup
      .string()
      .required('Password is required'),
    })

    return (
        <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        {/* <Text style={styles.text}>Timely</Text> */}
        <Formik
          initialValues={initialValues}
          validationSchema={signInValidationSchema}
          onSubmit={(values) => { handleSignIn(values) }}
        >
          {({
          handleChange, 
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          touched
          }) => (
          <>
          <FormInput
            labelValue={values.email}
            onChangeText={handleChange('email')}
            placeholderText="Email"
            iconType="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onBlur={handleBlur('email')}
          />

          {
            (errors.email && touched.email) && 
            <Text style={styles.alertText}>{errors.email}</Text>
          }

          <FormInput
            labelValue={values.password}
            onChangeText={handleChange('password')}
            placeholderText="Password"
            iconType="lock"
            secureTextEntry={true}
            onBlur={handleBlur('password')}
          />

          {
            (errors.password && touched.password) &&
            <Text style={styles.alertText}>{errors.password}</Text>
          }

          <FormButton
            buttonTitle="Sign In" 
            onPress={handleSubmit} 
            disabled={!(isValid)}
          />
            </>
          )}
        </Formik>

        <GoogleButton
            buttonTitle="Sign In with Google"
            btnType="google"
            color="#de4d41"
            backgroundColor="#f5e7ea"
            onPress={handleSignInWithGoogleAsync}
        />
  
        <TouchableOpacity
        style={styles.verticalButton}
        onPress={() => navigation.navigate('SignUp')}>          
          <Text style={styles.navButtonText}>
            Don't have an account? Create here
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.forgotButton} 
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.navButtonText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    )
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f9fafd',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    logo: {
      height: 200,
      width: 200,
      marginTop: -35,
      marginBottom: 35,
      resizeMode: 'cover',
    },
    text: {
      fontSize: 28,
      marginBottom: 10,
      color: '#051d5f',
    },
    navButton: {
      marginTop: 15,
    },
    verticalButton: {
      marginVertical: 35,
    },
    navButtonText: {
      fontSize: 18,
      fontWeight: '500',
      color: '#2e64e5',
    },
    alertText:{
      margin: 5,
      color: '#ff7979',
      fontSize: 12,
      marginTop: 0,
      fontWeight: 'bold'
    },
    forgotButton: {
      marginVertical: 10,
      fontSize: 13,
    }
  });
