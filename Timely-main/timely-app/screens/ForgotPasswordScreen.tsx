import { StyleSheet, Alert, Image, SafeAreaView } from 'react-native';
import React from 'react'
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firebase from "../fbconfig";
import * as Yup from 'yup';
import { Text } from '../components/Themed';
import { Formik } from 'formik';


export const ForgotPasswordScreen = ({ navigation }) => {

    async function handleSendResetLink(email: string) {
        try {
            await firebase.auth().sendPasswordResetEmail(email)
            Alert.alert('Reset link sent to ' + email)
        } catch (err) {
            Alert.alert('No user exists with ' + email)
        }
    }

    const initialValues = {
        email: '',
    }

    const ForgotPasswordValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Please enter valid email")
            .required('Email Address is Required'),
    })

    return (
        <SafeAreaView style={styles.container}>

            <Image
                source={require('../assets/images/padlock.png')}
                style={styles.padlock}
            />

            <Text style={styles.topText}>Trouble Logging In?</Text>
            <Text style={styles.bottomText}>Enter your UCSD email and we'll send you a link to get back into your account.</Text>

            <Formik
                initialValues={initialValues}
                validationSchema={ForgotPasswordValidationSchema}
                onSubmit={(values: any) => { handleSendResetLink(values.email) }}
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
                                nOfLines="1"
                                labelValue={values.email}
                                onChangeText={handleChange('email')}
                                placeholderText="Email"
                                iconType="user"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                onBlur={handleBlur('email')}
                            />

                            {
                                (errors.email && touched.email) &&
                                <Text style={styles.alertText}>{errors.email}</Text>
                            }

                            <FormButton
                                buttonTitle="Send Login Link"
                                onPress={handleSubmit}
                                disabled={!(isValid)}
                            />
                        </>
                    )}
            </Formik>
        </SafeAreaView>
    )
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafd',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    padlock: {
        marginTop: -250,
        marginBottom: -100,
        resizeMode: 'center'
    },
    topText: {
        
        textAlign: 'center',
        fontSize: 18,
        color: '#000000',
        marginBottom: 25,
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