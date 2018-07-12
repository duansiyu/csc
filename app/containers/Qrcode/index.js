'use strict';
import React, { Component } from 'react'
import QRCode from 'react-native-qrcode';

import {
    StyleSheet,
    View,
    TextInput
} from 'react-native';

export default class QrCode extends Component {
    render() {
        return (
            <View style={styles.container}>
                <QRCode
                    value={this.props.url}
                    size={this.props.size?this.props.size:200}
                    bgColor={this.props.bgColor?this.props.bgColor:'purple'}
                    fgColor='white'/>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },

    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        borderRadius: 5,
        padding: 5,
    }
});
