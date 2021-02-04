import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import SelectButton from '../SelectButton';

const windowHeight = Dimensions.get('window').height
const SelectPlan = ({ onSelect }) => {
    return (
        <View style={styles.container}>
            <SelectButton buttonTitle='Events' onPress={() => { onSelect('Events') }} />
            <SelectButton buttonTitle='Goals' onPress={() => onSelect('Goals')} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        display: 'flex',
        width: '100%'
    },
});
export default SelectPlan