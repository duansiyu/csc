import React, {Component} from 'react'
import {StyleSheet, View, Text, StatusBar, Platform, Image, ScrollView} from 'react-native'
import {connect} from 'react-redux'
import {hexMD5} from '../../../utils/md5'
import {InputItem, Flex, Button, Toast} from 'antd-mobile'
import {validateMsg} from '../../../utils/validate'
import {Touchable} from '../../../components'

import {NavigationActions} from '../../../utils'

import px2dp from "../../../utils/px2dp"
import Account from "../../Account/Account";

var sendCode_interval = null //倒计时函数

class setPassword extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.name,
    })
    state = {
        isPsd: true,
        oldPwd: '',
        newPwd: '',
        restPwd: ''
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'user/financePasswordExist',
            payload: {
                account: this.props.userInfo.accountCommonDTO.id
            },
            callback: (res) => {
                this.setState({isPsd: res})
                if (this.state.isPsd === false) {
                    this.props.navigation.setParams({name: '设置登录密码'})
                } else {
                    this.props.navigation.setParams({name: '修改登录密码'})
                }
            }
        })
    }
    sendVerCode = () => {
        if (!this.state.mobile) {
            Toast.info('请输入手机号', 1.5, null, false)
            return
        }
        this.setState({disabled: true})
        let loginType = ''
        if (Platform.OS === 'android') {
            loginType = 'Android'
        } else {
            loginType = 'iOS'
        }
        var currentTime = this.state.currentTime
        this.props.dispatch({
            type: 'app/sendVerCode',
            payload: {
                request: {
                    mobile: this.state.mobile,
                    domain: 'REG',
                    deviceUid: loginType,
                }},
            callback: (res) => {
                if (res===true){
                    sendCode_interval = setInterval( () => {
                        currentTime--;
                        this.setState({
                            time: currentTime + '秒',
                            currentTime: this.state.currentTime,
                        })
                        if (currentTime <= 0) {
                            clearInterval(sendCode_interval)
                            this.setState({
                                time: '重新发送',
                                currentTime: 60,
                                disabled: false
                            })
                        }
                    }, 1000)
                }else{
                    this.setState({
                        time: '重新发送',
                        currentTime: 60,
                        disabled: false
                    })
                }
            },
        })
    }
    bindToResetPsd = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'ResetPassword'}))
    }
    handleSubmit = () => {
        if (this.state.isPsd && ! this.state.oldPwd){
            Toast.info('请输入初始化登录密码', 1.5, null, false)
            return
        }
        if (this.state.newPwd && this.state.newPwd !== this.state.restPwd) {
            Toast.info('两次输入密码不一致', 1.5, null, false)
            return
        }
        var res = validateMsg('pwdA', this.state.newPwd)
        if(!res.result){
            Toast.info(res.msg, 3, null, false)
            return
        }
        if(this.state.isPsd){
            this.props.dispatch({
                type: 'user/userCommonPasswordUpdate',
                payload: {

                        accountId: this.props.userInfo.accountCommonDTO.id,
                        password: hexMD5(this.state.oldPwd),
                        newPassword: hexMD5(this.state.newPwd)

                },
                callback: () => {
                    Toast.info(!this.state.isPsd? "设置登录密码成功":"修改登录密码成功", 1.5, null, true)
                    setTimeout(() =>{
                        this.props.dispatch({
                            type: 'app/logoutPwd'
                        })
                    },2000)
                    // setTimeout(() =>{
                    //     this.props.dispatch(NavigationActions.navigate({routeName: 'Login'}))
                    // },800)
                }
            })
        }else{
            this.props.dispatch({
                type: 'user/userCommonPasswordSet',
                payload: {
                    request:{
                        accountId: this.props.userInfo.accountCommonDTO.id,
                        password: hexMD5(this.state.newPwd)
                    }
                },
                callback: () => {
                    Toast.info(!this.state.isPsd? "设置登录密码成功":"修改登录密码成功", 1.5, null, true)
                    setTimeout(() =>{
                        this.props.dispatch({
                            type: 'app/logout'
                        })
                    },2000)
                    // setTimeout(() =>{
                    //     this.props.dispatch(NavigationActions.navigate({routeName: 'Login'}))
                    // },800)
                }
            })
        }

    }

    render() {

        return (
            <ScrollView>
            <View style={styles.container}>
                <View style={{marginTop: 20}}>
                    {this.state.isPsd &&
                    <View>
                            <InputItem
                                placeholder="请输入初始登录密码"
                                type="password"
                                onChange={(text) => {
                                    this.setState({'oldPwd': text})
                                }}
                            />
                            <View style={[{marginTop: 20}]}/>
                        </View>
                    }
                    <InputItem
                        placeholder="输入新密码(6~16位数字加字符)"
                        type="password"
                        onChange={(text) => {
                            this.setState({'newPwd': text})
                        }}
                    />
                    <View style={[{marginTop: 20}]}/>
                    <InputItem
                        placeholder="请确认您的密码"
                        type="password"
                        onChange={(text) => {
                            this.setState({'restPwd': text})
                        }}
                    />
                    <View style={[{marginTop: 20}]}/>
                </View>
                <View style={{marginTop: 5}}>
                <Flex>
                {this.state.isPsd && <Flex.Item><Text style={styles.login_sj_text} onPress={this.bindToResetPsd}>旧密码忘记，找回?</Text></Flex.Item>}
                </Flex>
                </View>
                <View style={{marginTop: 20}}>
                    <Button type="primary" style={styles.class_but} onClick={this.handleSubmit}>确认</Button>
                </View>
            </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: '#fff',
    },
    login_sj_text: {
        textAlign: 'left',
        marginLeft: 10,
        color: '#2591ff'
    },
    login_sj_text_r: {
        textAlign: 'right',
        color: '#888'
    },
    close: {
        position: 'absolute',
        right: 20,
        top: 40,
    },
    close_img: {
        width: 15,
        height: 15,
    },
    class_but: {
        backgroundColor: '#4184ff'
    },
    login_sj_zc: {
        textAlign: 'center',
        color: '#2591ff',
        fontSize: 16
    },
    yzm_bodey_but: {
        flex: 0.5
    },
    yzm_bodey_but_class:{
        borderColor: '#2591ff',
        height: 40
    },
    yzm_bodey_text:{
        fontSize: 16,
        color: '#2591ff',
    }
})

export default connect(({app, user}) => ({...app, user}))(setPassword)