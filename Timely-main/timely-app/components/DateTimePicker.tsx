import React, { useState } from 'react'

import DatePicker from '@react-native-community/datetimepicker'
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { date } from 'yup';
import { View } from './Themed';

export default class DateTimePicker extends React.Component<{ initialDate: Date, onSubmit: Function }, { phase: Number, date: Date }>{
    constructor(props) {
        super(props)
        this.state = {
            phase: 0,
            date: props.initialDate
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit() {
        this.props.onSubmit(this.state.date)
    }

    handleChange(e, val) {
        if (!val) return
        switch (this.state.phase) {
            case 1:
                return
            case 2:
                this.setState({ date: val, phase: 3 })
                return
            case 3:
                this.setState({
                    date: val,
                    phase: 1,
                }, () => {
                    this.handleSubmit()
                })

                return
        }
    }

    getFormattedDate(date) {
        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear()
        const hour = date.getHours()
        const minute = date.getMinutes()

        return "" + month + '/' + day + '/' + year + ' ' + hour + ':' + minute
    }
    render() {
        return (
            <>
            
                <TouchableOpacity 
                    style={styles.editDate}
                    onPress={() => {
                    this.setState({
                        phase: 2
                    })
                }}>
                    <Text style={styles.textDate}> Click to Edit</Text>
                    <Text style={styles.textDate}> {this.getFormattedDate(this.state.date)}</Text>
                </TouchableOpacity>
                { this.state.phase === 2
                    &&
                    <DatePicker
                        value={this.state.date}
                        mode={'date'}
                        display="default"
                        onChange={this.handleChange}
                    />
                }
                { this.state.phase === 3
                    &&
                    <DatePicker
                        value={this.state.date}
                        mode={'time'}
                        display="default"
                        onChange={this.handleChange}
                    />
                }
            
            </>
        )
    }
}
const styles = StyleSheet.create({
    editDate: {
        padding: 10,
        alignSelf: 'center',
        borderColor: '#0984e3',
        borderRadius: 3,
        borderWidth: 2,
    },
    textDate: {
        color: '#0984e3',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    }
})