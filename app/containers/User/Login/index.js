import React, { Component } from 'react'
import { StyleSheet, View, Text, StatusBar, Platform, Image, ScrollView} from 'react-native'
import { connect } from 'react-redux'
import { hexMD5 } from '../../../utils/md5'
import { InputItem, Flex, Button, Toast } from 'antd-mobile'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Touchable } from '../../../components'

import { createAction, NavigationActions } from '../../../utils'
import px2dp from '../../../utils/px2dp'
const dismissKeyboard = require('dismissKeyboard')

class Login extends Component {
    static navigationOptions = {
        title: '登录'
    }
    state = {
        account: '',
        password: ''
    }
    gotoMobileLogin = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'MobileLogin'}))
    }
    gotoRegister = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'Register'}))
    }
    gotoResetPwd = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'ResetPwd'}))
    }
    onClose = () => {
        this.props.dispatch(NavigationActions.back())
    }
    handleSubmit = () => {
        dismissKeyboard()
        if(!this.state.account){
            Toast.info('请输入用户名', 1.5, null, false)
            return
        }
        if(!this.state.password){
            Toast.info('请输入密码', 1.5, null, false)
            return
        }
        let loginType =  ''
        if(Platform.OS ==='android'){
            loginType = 'Android'
        }else{
            loginType = 'iOS'
        }
        const deviceUid = this.state.account
        this.props.dispatch({
            type: 'app/login',
            url: '/api/service.ucenter.login.base',
            payload: {data:{login:{account: this.state.account, password: hexMD5(this.state.password), loginType, deviceUid}}},
            callback: () => {
            }
        })
    }
    render() {

        return (
            <ScrollView>
                <View style={styles.container}>
                    {/*{Platform.OS ==='android' ?  <StatusBar backgroundColor={'black'} /> : <StatusBar barStyle={'default'} />}*/}
                    <KeyboardAwareScrollView>
                        <View style={{flexDirection: 'row',height:100,marginTop: 40,
                            justifyContent: 'center',
                            alignItems: 'flex-start',}}>
                            <Image style={{width:px2dp(55), height:px2dp(50)}} source={require('../../../images/LOGO_wk.png')}/>
                        </View>
                        <View style={{marginTop:20}}>
                            <InputItem
                                placeholder="输入用户名/手机号码"
                                onChange={ (text) => {
                                    this.setState({'account': text})
                                }}
                            />
                            <View style={{marginTop:20}}/>
                            <InputItem
                                placeholder="输入密码"
                                type="password"
                                onChange={ (text) => {
                                    this.setState({'password': text})
                                }}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <Flex>
                                <Flex.Item><Text style={styles.login_sj_text} onPress={this.gotoMobileLogin}>手机验证码登录</Text></Flex.Item>
                                <Flex.Item><Text style={styles.login_sj_text_r} onPress={this.gotoResetPwd}>忘记密码?</Text></Flex.Item>
                            </Flex>
                        </View>
                        <View style={{marginTop: 40}}>
                            <Button type="primary" style={styles.class_but} onClick={this.handleSubmit}>登录</Button>
                        </View>
                        <View style={{marginTop: 40}}>
                            <Text style={styles.login_sj_zc} onPress={this.gotoRegister}> 注册 </Text>
                        </View>
                        {/*<Touchable style={styles.close} text="Close" onPress={this.onClose}>*/}
                            {/*<Image style={styles.close_img}*/}
                                {/*source={require('../../../images/close.png')}/>*/}
                        {/*</Touchable>*/}
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
    login_sj_text:{
        textAlign:  'left',
        marginLeft: 10,
        color: '#2591ff'
    },
    login_sj_text_r: {
        textAlign:  'right',
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
    logo: {
        width: 200,
    },
    class_but: {
        backgroundColor: '#4184ff'
    },
    login_sj_zc:{
        textAlign: 'center',
        color: '#2591ff',
        fontSize: 16
    }
})

export default connect(({app}) => ({...app}))(Login)