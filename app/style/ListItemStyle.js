/**
 * Created by Tloy on 2018/5/14.
 */


import {StyleSheet} from 'react-native'
import {width, height, unitWidth} from '../utils/AdapterUtil'

export default BaseStyle = StyleSheet.create({
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
        fontSize: unitWidth * 32,
        color:'#333'
    },
    text:{
        fontSize: unitWidth * 35,
        color:'#333'
    }

})