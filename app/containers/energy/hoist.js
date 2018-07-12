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
class Hoist extends Component {
    static navigationOptions = {
        title: '能量提升'
    }
    state = {
        head_height: 0,
        dayNum:'28'
    }
    componentDidMount() {
        this.getRealInfo()
        this.signExitss()
        this.getCurrencyTypes()
    }
    getCurrencyTypes = () => {
        this.props.dispatch({
            type: 'treasure/getCurrencyTypes',
            payload: {}
        })
    }
    signExitss = () => {
        this.props.dispatch({
            type: 'home/signExit',
            payload: {accountId: this.props.userInfo.accountCommonDTO.id}
        })
    }
    getRealInfo = () => {
        this.props.dispatch(({
            type: 'user/getRealInfo',
            payload: {
                userId: this.props.userInfo.accountCommonDTO.id
            }
        }))
    }
    getInviteInfo = () => {
        this.props.dispatch({
            type: 'friend/getInviteInfo',
            payload:{
                accountId: this.props.userInfo.accountCommonDTO.id
            }
        })
    }
    getFriList = () => {
        this.props.dispatch({
            type: 'friend/getFriList',
            payload: {
                id: this.props.userInfo.accountCommonDTO.id
            }
        })
    }
    getVerCode = () => {
        this.props.dispatch({
            type: 'friend/getVerCode',
            payload: {
                request: {id: this.props.userInfo.accountCommonDTO.id}
            }
        })
    }
    handleSubmit = async () => {
        var invitationCode = this.props.userInfo.accountCommonDTO.invitationCode
        //Clipboard.setString('http://release.csc.gzduobeibao.com/#/register/invite/'+ invitationCode)
        Clipboard.setString('http://beta.csc.gzduobeibao.com/#/register/invite/'+ invitationCode)
        try {
            var content = await Clipboard.getString()
            console.log(content)
            Toast.info('复制成功', 1.5, null, false)
        } catch (e) {
            Toast.info('复制失败', 1.5, null, false)
        }
    }
    getDayTime = () => {
        this.props.dispatch({
            type: 'friend/getDayTime',
            payload:{
                key1:'temp_energy_overdue',
                type: 0,
            },
            callback: (res) =>{
                this.setState({dayNum: res})
            }
        })
    }
    gotoLogin = () => {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'friendList' }))
    }

    treasureB = () => {
        var currencyType = []
        this.props.treasure.currencyType.map(type => {
            if (type.others !== '103') {
                currencyType.push({label: type.name,value:type.others})
            }
        })
        console.log(currencyType)
        this.props.dispatch(NavigationActions.navigate({routeName: 'transform', params: {type: '100', name: 'EOS', currencyType: currencyType}}))
    }
    bindChargeSign = () => {
        if (this.props.home.signExit === true) {
            Toast.info("您今天已签到，请明日再来", 1.5, null, false)
        }else {
            this.props.dispatch({
                type: 'home/homeSign',
                payload: {  accountId: this.props.userInfo.accountCommonDTO.id },
                callback: (res) => {
                    return Toast.info("恭喜签到成功，获得1能量", 2, null, false)
                }
            })
        }
    }
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={{height: 160}}>
                        <ImageBackground style={[styles.backgroundImage]} source={require('../../images/bg_banner_TSNL.png')} resizeMode='cover'>
                        </ImageBackground>
                    </View>
                    <View style={{backgroundColor: '#fff',marginTop: 20}}>
                        <Image style={{width: 200, height: 34}} source={require('../../images/pic_tsnl.png')}/>
                    </View>
                    <View style={{marginTop: 20}}>
                        <Text>完成以下小任务，可快速提升能量，或获得额外奖励</Text>
                    </View>
                    <View style={{padding: 15,width: '100%'}}>
                        <Flex style={{marginTop: 10, marginLeft: 10,marginRight: 10, marginBottom: 30}}>
                            <Flex.Item style={{alignItems: 'flex-start',flex: 0.7}} onPress={() => {
                                if(this.props.user.realInfo.realName){
                                    Toast.info('您已实名', 1.5, null, false)
                                }else{
                                    this.props.dispatch(NavigationActions.navigate({routeName: 'SetRealName'}))
                                }
                            }}>
                                <Image style={{width: 56, height: 56}} source={require('../../images/icon_smrz.png')}/>
                            </Flex.Item>
                            <Flex.Item style={{alignItems: 'flex-start'}} onPress={() => {
                                if(this.props.user.realInfo.realName){
                                    Toast.info('您已实名', 1.5, null, false)
                                }else{
                                    this.props.dispatch(NavigationActions.navigate({routeName: 'SetRealName'}))
                                }
                            }}>
                                <Text>实名认证</Text>
                                <Text style={{color: '#808080', fontSize: 13}}>实名认证 +50</Text>
                            </Flex.Item>
                            <Flex.Item style={{alignItems: 'flex-start',flex: 0.7}} onPress={() => {
                                    this.props.dispatch(NavigationActions.navigate({routeName: 'friendList'}))
                            }}>
                                <Image style={{width: 56, height: 56}} source={require('../../images/icon_tjhy.png')}/>
                            </Flex.Item>
                            <Flex.Item style={{alignItems: 'flex-start'}} onPress={() => {
                                    this.props.dispatch(NavigationActions.navigate({routeName: 'friendList'}))
                            }}>
                                <Text>推荐好友</Text>
                                <Text style={{color: '#808080', fontSize: 13}}>推荐一级好友 +15</Text>
                            </Flex.Item>
                        </Flex>
                        <Flex style={{marginTop: 10, marginLeft: 10,marginRight: 10, marginBottom: 30}}>
                            <Flex.Item style={{alignItems: 'flex-start',flex: 0.7}} onPress={() => {
                                this.treasureB()
                            }}>
                                <Image style={{width: 56, height: 56}} source={require('../../images/icon_bzh.png')}/>
                            </Flex.Item>
                            <Flex.Item style={{alignItems: 'flex-start'}} onPress={() => {
                                this.treasureB()
                            }}>
                                <Text>币转换</Text>
                                <Text style={{color: '#808080', fontSize: 13}}>币转换 +10%</Text>
                            </Flex.Item>
                            <Flex.Item style={{alignItems: 'flex-start',flex: 0.7}} onPress={() => {
                                this.bindChargeSign()
                            }}>
                               <Image style={{width: 56, height: 56}} source={require('../../images/icon_mrqd.png')}/>
                            </Flex.Item>
                            <Flex.Item onPress={() => {
                                this.bindChargeSign()
                            }}>
                                <Text style={{alignItems: 'flex-start'}}>每天签到</Text>
                                <Text style={{color: '#808080', fontSize: 13}}>每天签到 +1</Text>
                            </Flex.Item>
                        </Flex>
                    </View>
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
        backgroundColor: '#fff',
        width: '100%',
        flex: 1,
        alignItems: 'center',
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

export default connect(({app, home, user, friend, treasure}) => ({...app, home, user, friend, treasure}))(Hoist)