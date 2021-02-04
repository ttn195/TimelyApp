import React from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width



const FormikInput = props => {
    if (!props.formik) return <View />
    return (
        <View style={styles.inputContainer}>
            <TextInput
                onChangeText={props.formik.handleChange(props.name)}
                onBlur={props.formik.handleBlur(props.name)}
                value={props.formik.values[props.name]}
                secureTextEntry={props.secureTextEntry}
                style={styles.input}
            />
        </View>
    );
};

export default FormikInput;

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