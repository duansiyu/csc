import React, { Component } from 'react'
import {StyleSheet, Clipboard,View, ScrollView, Image, StatusBar, Platform, Dimensions, TouchableOpacity, Text, ImageBackground, Animated, Easing} from 'react-native'
import { connect } from 'react-redux'
import {Touchable, Thumb} from '../../components'
import { createAction, NavigationActions } from '../../utils'
import {Modal,NoticeBar, WhiteSpace, Icon, Flex, Button, Switch, Toast, List} from 'antd-mobile'
import px2dp from "../../utils/px2dp"
import {timeString} from "../../utils/help"
const Item = List.Item
const Brief = Item.Brief
class friendList extends Component {
    static navigationOptions = {
        title: '我的好友'
    }
    state = {

    }
    componentDidMount() {
        this.getFriList()
    }
    getFriList = () => {
        this.props.dispatch({
            type: 'friend/getFriList',
            payload: {
                id: this.props.userInfo.accountCommonDTO.id
            }
        })
    }
    render() {
        const {isLogin} = this.props
        return (
            <ScrollView>
                <View style={styles.container}>
                    <List>
                    <Item thumb={<Thumb
                        img={{uri: 'https://cdn.sz.gzduobeibao.com/csc/img/friend@2x.png'}}/>} extra={`${this.props.friend.friNuM.m1}`}  onClick={() => {}}>M1</Item>
                    <Item thumb={<Thumb
                        img={{uri: 'https://cdn.sz.gzduobeibao.com/csc/img/friend@2x.png'}}/>} extra={`${this.props.friend.friNuM.m2}`}  onClick={() => {}}>M2</Item>
                    <Item thumb={<Thumb
                        img={{uri: 'https://cdn.sz.gzduobeibao.com/csc/img/friend@2x.png'}}/>} extra={`${this.props.friend.friNuM.m3}`} onClick={() => {}}>M3</Item>
                    <Item thumb={<Thumb
                        img={{uri: 'https://cdn.sz.gzduobeibao.com/csc/img/friend@2x.png'}}/>} extra={`${this.props.friend.friNuM.m4}`}  onClick={() => {}}>M4</Item>
                    <Item thumb={<Thumb
                        img={{uri: 'https://cdn.sz.gzduobeibao.com/csc/img/friend@2x.png'}}/>} extra={`${this.props.friend.friNuM.m5}`}  onClick={() => {}}>M5</Item>
                    </List>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    class_but: {
        backgroundColor: '#4184ff'
    },
    container: {
        width: '100%',
        marginBottom: 40
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        // resizeMode: Image.resizeMode.contain,
        height: '100%',
        width: Dimensions.get('window').width
    },
    coupon_receive_wrapper: {
        display: 'none',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '150%',
        zIndex: 3
    },
    active: {
        display: 'flex'
    },
    icon: {
        width: 30,
        height: 30,
    },
    wab_home_wb_btn:{
        height: 45,
        width: '100%'
    },
})

export default connect(({app, home, friend}) => ({...app, home, friend}))(friendList)