import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions, View } from 'react-native';


const EventBlock = ({ event, ...rest }) => {
    if (!event) return <View />
    return (
        <TouchableOpacity style={styles.container} {...rest}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.description}>{event.description}</Text>
            <Text style={styles.description}>Start {event.start.toDate().toString()}</Text>
            <Text style={styles.description}>End {event.end.toDate().toString()}</Text>
        </TouchableOpacity>
    );
};

export default EventBlock;

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        width: '100%',
        padding: 10,
        borderRadius: 3,
        borderStyle: 'solid'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        
    },
    description: {
        fontSize: 14,
        
    },
});