import React, { Component } from 'react'
import {StyleSheet, Clipboard,View, ScrollView, Image, StatusBar, Platform, Dimensions, TouchableOpacity, Text, ImageBackground, Animated, Easing} from 'react-native'
import { connect } from 'react-redux'
import {Touchable, Thumb} from '../../components'
import { createAction, NavigationActions } from '../../utils'
import {Modal,NoticeBar, WhiteSpace, Icon, Flex, Button, Switch, Toast, List} from 'antd-mobile'
import px2dp from "../../utils/px2dp"
import {timeString} from "../../utils/help"
import Qrcode from '../Qrcode'
const Item = List.Item
const Brief = Item.Brief
class Friend extends Component {
    static navigationOptions = {
        title: '邀请好友'
    }
    state = {
        head_height: 0,
        dayNum:'28',
        invitationCode: ""
    }
    componentDidMount() {
        this.setState({invitationCode: 'http://csc.gzduobeibao.com/#/register/invite/'+ this.props.userInfo.accountCommonDTO.invitationCode})
        this.getInviteInfo()
        this.getFriList()
        this.getVerCode()
        this.getDayTime()
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
        //Clipboard.setString('http://beta.csc.gzduobeibao.com/#/register/invite/'+ invitationCode)
        Clipboard.setString('http://csc.szhedehan.com/#/register/invite/'+ invitationCode)
        try {
            var content = await Clipboard.getString()
            Toast.info('复制成功，请粘贴至浏览器中打开', 1.5, null, false)
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

    logout = () => {
        this.props.dispatch(createAction('app/logout')())
    }
    render() {
        const {isLogin} = this.props
        var invitationCode = this.props.userInfo.accountCommonDTO.invitationCode
        var url = 'http://csc.szhedehan.com/#/register/invite/'+ invitationCode

        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={{height: 150}}>
                        <ImageBackground style={[styles.backgroundImage]} source={require('../../images/bg_yqhy.png')} resizeMode='cover'>
                            <View style={{position: 'absolute', bottom:10}}><Text style={{color: '#fff',fontSize: 15}}>临时能量失效后将从总能量中减去</Text></View>
                        </ImageBackground>
                    </View>
                    <View style={{padding: 15,width: '100%',backgroundColor: '#fff'}}>
                        <TouchableOpacity onPressIn={this.gotoLogin}>
                        <View style={{width: '100%', height: 85, borderRadius: 5, backgroundColor: '#2da4fd',}}>
                            <View style={{ marginLeft: 12, marginRight: 50}}>
                                <View><Text style={{color: '#fff', lineHeight: 40}}>我的好友数：<Text style={{color: '#ffc256',width: 30}}>{this.props.friend.friNuM.total}</Text></Text></View>
                                <View style={{ borderTopColor: '#6cbffe',borderTopWidth: 0.4}}><Text style={{color: '#fff', lineHeight: 40}}>我获得：<Text style={{color: '#ffc256',width: 30}}>{this.props.friend.totalEnergy / 100}</Text>  <Text style={{width: 30}}>固定能量和  </Text><Text style={{color: '#ffc256',width: 30}}>{this.props.friend.tempEnergy / 100}</Text><Text>  临时能量</Text></Text></View>
                                <View style={{position: 'absolute', top:28, right: -40}}>
                                    <Image style={{width: 24, height: 24}} source={require('../../images/btn_gg_more.png')}/>
                                </View>
                            </View>
                        </View>
                        </TouchableOpacity>

                        <View>
                            <Text style={{marginTop:20,marginBottom:10}}>我的二维码：</Text>
                            <Qrcode
                                size={150}
                                url={url}
                                bgColor={'#000'}
                            />
                        </View>

                        <View style={{paddingTop: 30}}>
                            <Text>活动奖励说明：</Text>
                            <WhiteSpace/>
                            <Text style={{lineHeight: 23}}>
                                1.每邀请一个好友完成注册，且注册成功，您可以获得10个临时能量和5个固定能量。
                            </Text>
                            <Text style={{lineHeight: 30}}>
                                2.您邀请的好友，其邀请一个好友完成注册，即二级好友，注册认证，您可以获得8个临时能量和4个固定能量。
                            </Text>
                            <Text style={{lineHeight: 23}}>
                                3.更多好友以此类推。
                            </Text>
                            <Text style={{lineHeight: 23}}>
                                4.临时能量将在{this.state.dayNum}天后失效。
                            </Text>
                            <Text style={{lineHeight: 23}}>
                                5.本平台拥有对于全部活动的所有解释权。
                            </Text>
                        </View>
                        <View style={{marginTop: 20}}>
                            <Button type="primary" style={styles.class_but} onClick={this.handleSubmit}>立即复制分享链接</Button>
                        </View>
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

export default connect(({app, home, friend}) => ({...app, home, friend}))(Friend)