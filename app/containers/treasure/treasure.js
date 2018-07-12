import React, {Component} from 'react'
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, Vibration} from 'react-native'
import {connect} from 'react-redux'

import {Wave, Thumb, Touchable} from '../../components'
import {createAction, NavigationActions} from '../../utils'

import {List, WhiteSpace, Button, Flex, Card, Steps, Modal, InputItem, Switch, Toast} from 'antd-mobile'
import px2dp from "../../utils/px2dp"

import { timeString } from '../../utils/help'
const Item = List.Item
const Brief = Item.Brief
const Step = Steps.Step
const alert = Modal.alert
class treasure extends Component {
    static navigationOptions = {
        title: '我的宝藏',
    }
    state = {
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'treasure/getCurrencyTypes',
            payload: {},
        })
        this.props.dispatch({
            type: 'treasure/getCurrencyList',
            payload: {
                accountId: this.props.userInfo.accountCommonDTO.id
            },
        })
    }
    logout = () => {

    }
    bindCurrencyDetails = (item) => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'treasureDetail', params: {type: item.accountType, name: item.name}}))
    }
    render() {
        const {userInfo} = this.props
        return (
            <ScrollView>
                <View style={styles.container}>
                   <List>
                       {
                           this.props.treasure.currencyList.map((item, index) =>
                            <Item onClick={() => {
                                this.bindCurrencyDetails(item)
                            }} key={index} arrow="horizontal" extra={<Brief style={{color: '#d63a33', fontSize: 17}}>{item.accountType == '103'? '+'+item.freezeAmount/1000000+'收益': ''}</Brief>} thumb={<Thumb style={{height:px2dp(45),width: px2dp(45)}} img={{uri: item.imgUrl}}/>} multipleLine>
                                <Brief style={{color: '#d63a33', fontSize: 17, paddingLeft: 10}}>{item.balance / 1000000}</Brief> <Brief style={{color: '#333333', fontSize: 17, paddingLeft: 10}}>{item.name}</Brief>
                            </Item>
                           )
                       }
                   </List>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    coupon_receive_wrapper: {
        display: 'none',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '150%',
        zIndex: 3,
    },
    active: {
        display: 'flex'
    },
    container: {
        marginBottom: 40,
        backgroundColor: '#fff',
        marginTop: 10
    },
    class_but: {
        width: '50%',
        marginTop: 40,
        backgroundColor: '#4184ff'
    },
    header: {
        backgroundColor: '#2591ff',
        padding: 30,
        paddingRight: 10,
        paddingBottom: 100
    },
    text:{
        width: '88%',
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 8
    },
    ui_cell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#fff'
    },
    ui_cell_1: {
        flex: 1,
        height: 50
    },
    ui_cell_2: {
        flex: 0.4,
        height: 50
    },
    ui_cell_3: {
        height: 50,
        marginTop: 69
    },
    parts_p: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 75
    },
    icon: {
        width: 30,
        height: 30,
    },
    list_arrow: {
        width: 7,
        height: 10,
        marginLeft: 8,
        marginRight: 8
    },
    class_but: {
        backgroundColor: '#4184ff'
    },
    dice_1:{ width: '100%',  height: '999%'},
    dice_2:{ width: '100%',  height: '788%'},
    dice_3:{width: '100%',  height: '588%'},
    dice_4:{width: '100%',  height: '380%'},
    dice_5:{width: '100%',  height: '150%'},
    dice_6:{ width: '100%', transform: [{rotate:'180deg'}],height: '270%'},
    dice_t:{ width: '100%', transform: [{rotate:'180deg'}],height: '470%'},
    dice_s:{ width: '100%', transform: [{rotate:'180deg'}],height: '700%'},
    dice_e:{ width: '100%', transform: [{rotate:'180deg'}],height: '950%' },
})


export default connect(({app, user, home, treasure}) => ({...app, user, home, treasure}))(treasure)