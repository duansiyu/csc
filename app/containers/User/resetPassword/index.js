import React, {Component} from 'react'
import {StyleSheet, View, Text, StatusBar, Platform, Image, ScrollView} from 'react-native'
import {connect} from 'react-redux'
import {hexMD5} from '../../../utils/md5'
import {InputItem, Flex, Button, Toast} from 'antd-mobile'
import {validateMsg, validator} from '../../../utils/validate'
import {Touchable} from '../../../components'

import {NavigationActions} from '../../../utils'
import px2dp from "../../../utils/px2dp"
const dismissKeyboard = require('dismissKeyboard')

var sendCode_interval = null //倒计时函数

class ResetPassword extends Component {
    static navigationOptions = {
        title: '重置登录密码'
    }
    state = {
        mobile: '',
        verCode: '',
        password: '',
        newPassword: '',
        time: '获取验证码',
        currentTime: 60,
        disabled: false
    }
    sendVerCode = () => {
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
                    mobile: this.props.userInfo.accountCommonDTO.account,
                    domain: 'FINDPWD',
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
    handleSubmit = () => {
        dismissKeyboard()
        if (this.state.newPassword && this.state.newPassword !== this.state.password) {
            Toast.info('两次输入密码不一致', 1.5, null, false)
            return
        }
        var res = validateMsg('pwdA', this.state.newPassword)
        if(!res.result){
            Toast.info(res.msg, 3, null, false)
            return
        }
        if (!this.state.verCode) {
            Toast.info('请输入验证码', 1.5, null, false)
            return
        }
        this.props.dispatch({
            type: 'app/resetPassword',
            payload: {data: {request: {account: this.props.userInfo.accountCommonDTO.account, verCode: this.state.verCode, password: hexMD5(this.state.password)}}},
            callback: () => {
                Toast.info('密码重置成功', 1.5, null, true)
                setTimeout(() =>{
                    this.props.dispatch({
                        type: 'app/logoutPwd'
                    })
                },2000)
            }
        })
    }

    render() {

        return (
            <ScrollView>
            <View style={styles.container}>
                <View style={{marginTop: 10}}>
                    <InputItem
                        type="text"
                        editable={false}
                        defaultValue={this.props.userInfo.accountCommonDTO ? this.props.userInfo.accountCommonDTO.account: ''}
                    />
                    <InputItem
                        placeholder="输入新密码(6~16位数字加字符)"
                        type="password"
                        onChange={(text) => {
                            this.setState({'newPassword': text})
                        }}
                    />
                    <View style={[{marginTop: 20}]}/>
                    <InputItem
                        placeholder="确认新密码"
                        type="password"
                        onChange={(text) => {
                            this.setState({'password': text})
                        }}
                    />
                    <View style={[{marginTop: 20}]}/>
                    <Flex>
                        <Flex.Item>
                            <InputItem
                                placeholder="输入验证码"
                                type="text"
                                onChange={(text) => {
                                    this.setState({'verCode': text})
                                }}
                            />
                        </Flex.Item>
                        <Flex.Item style={styles.yzm_bodey_but}>
                            <Touchable><Button type="ghost" inline onClick={this.sendVerCode} disabled={this.state.disabled} size="small" style={styles.yzm_bodey_but_class}><Text style={styles.yzm_bodey_text}>{this.state.time}</Text></Button></Touchable>
                        </Flex.Item>
                    </Flex>
                </View>
                <View styl e={{marginTop: 40}}>
                    <Button type="primary" style={styles.class_but} onClick={this.handleSubmit}>重置</Button>
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

export default connect(({app,user}) => ({...app, user}))(ResetPassword)