import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import JoinEvent from '../JoinEvent';

const NewEventButton = props => {
    const handlePress = () => {
        return JoinEvent('rfrrAqOrVcgjBQKBYmlXB9ZqgMJ2','TEyBcX1WrMsnoL5DujUE')
    }

    return (
        <TouchableOpacity style={styles.buttonContainer} {...props} onPress={handlePress}>
            <Text style={styles.buttonText}>{'Join Event'}</Text>
        </TouchableOpacity>
    );
};

export default JoinEventButton;

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#2e64e5',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
        
    },
});