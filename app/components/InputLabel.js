import React, {Component} from 'react';
import {View, Text, TextInput,StyleSheet} from 'react-native';
import {width, unitWidth} from '../utils/AdapterUtil'
import PropTypes from 'prop-types'

export default class InputLabel extends Component{
    constructor(props){
        super(props)
        this.state = {
            text:'',
        }
    }

    static PropTypes = {
        ...TextInput.propTypes,
        label: PropTypes.string.isRequired,
    }

    change(text) {
        this.setState({
            text: text,
            showClean: false
        })
        if (this.props.onChangeText) {
            this.props.onChangeText(text)
        }
    }

    render() {
        return (
            <View style={styles.listItem}>
                <View style={styles.inputListItem}>
                    <Text style={styles.text}>{this.props.label}</Text>
                    <TextInput
                        style={styles.input}
                        // placeholderTextColor='#c3c3c3'
                        underlineColorAndroid={'transparent'}
                        {...this.props}
                        onChangeText={this.change.bind(this)}
                    />
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