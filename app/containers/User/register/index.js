import React, {Component} from 'react'
import {StyleSheet, View, Text, StatusBar, Platform, Image, ScrollView} from 'react-native'
import {connect} from 'react-redux'
import {hexMD5} from '../../../utils/md5'
import {InputItem, Flex, Button, Toast} from 'antd-mobile'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {validateMsg} from '../../../utils/validate'
import {Touchable} from '../../../components'

import {NavigationActions} from '../../../utils'

import px2dp from "../../../utils/px2dp"

var sendCode_interval = null //倒计时函数

class register extends Component {
    static navigationOptions = {
        title: '注册'
    }
    state = {
        mobile: '',
        verCode: '',
        password: '',
        invitationCode: '',
        time: '获取验证码',
        currentTime: 60,
        disabled: false
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
    handleSubmit = () => {
        if (!this.state.mobile) {
            Toast.info('请输入手机号', 1.5, null, false)
            return
        }
        var res = validateMsg('pwdA', this.state.password)
        if(!res.result){
            Toast.info(res.msg, 3, null, false)
            return
        }
        if (!this.state.verCode) {
            Toast.info('请输入验证码', 1.5, null, false)
            return
        }
        if (!this.state.invitationCode) {
            Toast.info('请输入推荐码', 1.5, null, false)
            return
        }
        let loginType =  ''
        if(Platform.OS ==='android'){
            loginType = 'Android'
        }else{
            loginType = 'iOS'
        }
        var data = {
            origin: loginType,registerType: 11, account: this.state.mobile, verCode: this.state.verCode, password: hexMD5(this.state.password)
        }
        if(this.state.invitationCode){
            data.invitationCode = this.state.invitationCode
        }
        this.props.dispatch({
            type: 'app/register',
            payload: {data: {request: {...data}}},
            callback: () => {
            }
        })
    }

    render() {

        return (
            <ScrollView>
            <View style={styles.container}>
                <KeyboardAwareScrollView>
                {/*{Platform.OS === 'android' ? <StatusBar backgroundColor={'black'}/> : <StatusBar barStyle={'default'}/>}*/}
                <View style={{
                    flexDirection: 'row', height: 100, marginTop: 40,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}>
                    <Image style={{width:px2dp(55), height:px2dp(50)}} source={require('../../../images/LOGO_wk.png')}/>
                </View>
                <View style={{marginTop: 20}}>
                    <InputItem
                        placeholder="输入手机号码"
                        type="digit"
                        onChange={(text) => {
                            this.setState({'mobile': text})
                        }}
                    />
                    <View style={[{marginTop: 20}]}/>
                    <InputItem
                        placeholder="输入密码(6~16位数字加字符)"
                        type="password"
                        onChange={(text) => {
                            this.setState({'password': text})
                        }}
                    />
                    <View style={[{marginTop: 20}]}/>
                    <InputItem
                        placeholder="请输入推荐码"
                        type="invitationCode"
                        onChange={(text) => {
                            this.setState({'invitationCode': text})
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
                {/*<View style={{marginTop: 20}}>*/}
                    {/*<Flex>*/}
                        {/*<Flex.Item><Text style={styles.login_sj_text} onPress={this.onClose}>账号密码登录</Text></Flex.Item>*/}
                    {/*</Flex>*/}
                {/*</View>*/}
                <View style={{marginTop: 40}}>
                    <Button type="primary" style={styles.class_but} onClick={this.handleSubmit}>注册</Button>
                </View>
                </KeyboardAwareScrollView>
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

export default connect(({app}) => ({...app}))(register)