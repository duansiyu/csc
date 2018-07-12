import React, {Component} from 'react';
import {View, Text, TextInput,StyleSheet} from 'react-native';
import {width, unitWidth} from '../utils/AdapterUtil'

export default class ListItem extends Component{
    render() {
        return (
            <View style={styles.listItem}>
                <View style={styles.inputListItem}>
                    <Text style={styles.text}>{this.props.label}</Text>
                    <Text style={styles.input}>{this.props.extra}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listItem: {
        width: width,
        height: unitWidth * 90,
        flexDirection: 'row',
        paddingLeft: unitWidth * 30,
        paddingRight: unitWidth * 25,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    inputListItem: {
        width: width - unitWidth * 60,
        height: unitWidth * 90,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1*unitWidth
    },
    input: {
        flex: 1,
        textAlign: 'right',
        marginLeft: unitWidth * 20,
        textAlignVertical: 'bottom',
        paddingTop: 0,
        marginTop: 0,
        fontSize: unitWidth * 30,
        color:'#333'
    },
    text:{
        fontSize: unitWidth * 30,
        color:'#000'
    }
})