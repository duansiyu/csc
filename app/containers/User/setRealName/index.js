import React, {Component} from 'react'
import {StyleSheet, View, Text, StatusBar, Platform, Image, ScrollView} from 'react-native'
import {connect} from 'react-redux'
import {hexMD5} from '../../../utils/md5'
import {InputItem, Flex, Button, Toast, List, Picker} from 'antd-mobile'

import {Touchable} from '../../../components'

import {NavigationActions} from '../../../utils'
import px2dp from "../../../utils/px2dp"
import ImagePicker from "react-native-image-picker";
import config from "../../../../config";
import {getStringCharLength, getNumberLengthChar} from '../../../utils/StringUtil'

var sendCode_interval = null //倒计时函数

class setRealName extends Component {
    static navigationOptions = {
        title: '实名认证'
    }
    state = {
        mobile: '',
        verCode: '',
        password: '',
        newPassword: '',
        time: '获取验证码',
        currentTime: 60,
        disabled: false,
        psd: '',
        realName: '',
        identityNum: '',
        selectType: 1,
        certType: [{value: 1, label: '身份证'}, {value: 2, label: '护照'}, {value: 10, label: '境外身份证'}]
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
                }
            },
            callback: (res) => {
                if (res === true) {
                    sendCode_interval = setInterval(() => {
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
                } else {
                    this.setState({
                        time: '重新发送',
                        currentTime: 60,
                        disabled: false
                    })
                }
            },
        })
    }

    componentDidMount() {
        this.getRealInfo()
    }

    getRealInfo = () => {
        this.props.dispatch(({
            type: 'user/getRealInfo',
            payload: {
                userId: this.props.userInfo.accountCommonDTO.id
            }
        }))
    }
    handleSubmit = () => {
        var formData = {
            identityNum: this.state.identityNum,
            realName: this.state.realName,
            identityType: this.state.selectType,
            id: this.props.userInfo.accountCommonDTO.id
        }
        if (!formData.realName) {
            Toast.info('请输入真实姓名', 1.5, null, false)
            return false
        }
        var name = formData.realName
        var identityNum = formData.identityNum
        if(this.state.selectType == 1){
            var regName = /[\u4e00-\u9fa5]/;
            for(var i=0; i<name.length;i++){
                if(!regName.test(name[i]) ||  i > 3){
                    Toast.info('请输入正确的真实姓名', 1.5, null, false)
                    return;
                }
            }
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if(!reg.test(formData.identityNum)){
                Toast.info('请输入正确的证件号码', 1.5, null, false)
                return false
            }
        }else {
            var nameR = /[\u4e00-\u9fa5_a-zA-Z]/; //中文和英文
            var idenR = /[\u4e00-\u9fa5_a-zA-Z0-9]/; //中文、英文、数字
            for(var j=0; j<name.length;j++){
                if(!nameR.test(name[j])){
                    Toast.info('请输入正确的真实姓名', 1.5, null, false)
                    return;
                }
            }
            for(var k=0; k<identityNum.length;k++){
                if(!idenR.test(identityNum[k])){
                    Toast.info('请输入正确的证件号码', 1.5, null, false)
                    return;
                }
            }
        }
        if (!formData.identityNum) {
            Toast.info('请输入证件号码', 1.5, null, false)
            return false
        }
        this.props.dispatch({
            type: 'user/userCommonRealNameUpdate',
            payload: {
                userCommon: formData
            },
            callback: () => {
                this.getRealInfo()
                setTimeout(() =>{
                    Toast.info("完善实名成功", 2, null, false)
                },500)
                this.props.dispatch(NavigationActions.back())

            }
        })
    }
    pickechen = (v) => {
        if (v == this.state.selectType) {
            return
        } else {
            this.state.certType.map(type => {
                if (type.value == v) {
                    this.setState({selectType: type.value})
                }
            })
        }
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={{marginTop: 10}}>
                        {/*<InputItem*/}
                        {/*type="text"*/}
                        {/*editable={false}*/}
                        {/*defaultValue={this.props.userInfo.accountCommonDTO.nickname}*/}
                        {/*>昵称</InputItem>*/}
                        <InputItem
                            placeholder="请输入您的真实姓名"
                            type="text"
                            maxLength={20}
                            // value={this.state.realName}
                            // editable={this.props.user.realInfo.identityNum ? false : true}
                            // defaultValue={this.props.user.realInfo.realName}
                            onChange={(text) => {
                                if (getStringCharLength(text) > 20) {
                                    this.setState({'realName': getNumberLengthChar(text, 20)})
                                    return
                                }
                                this.setState({'realName': text})
                            }}
                        >真实姓名</InputItem>
                        <Picker
                            data={[this.state.certType]}
                            cascade={false}
                            extra="请选择"
                            value={[this.state.selectType]}
                            onOk={v =>
                                this.pickechen(v)
                            }
                        >
                            <List.Item arrow="horizontal">选择类型</List.Item>
                        </Picker>
                        <InputItem
                            placeholder="请输入您的证件号码"
                            type="text"
                            maxLength={18}
                            // editable={this.props.user.realInfo.identityNum ? false : true}
                            // defaultValue={this.props.user.realInfo.identityNum}
                            onChange={(text) => {
                                this.setState({'identityNum': text})
                            }}
                        >证件号码</InputItem>
                    </View>
                    {/*{!this.props.user.realInfo.identityNum &&*/}
                        <View style={{marginTop: 40}}>
                        <Button type="primary" style={styles.class_but} onClick={this.handleSubmit}>确认</Button>
                        </View>
                    {/*}*/}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
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
    yzm_bodey_but_class: {
        borderColor: '#2591ff',
        height: 40
    },
    yzm_bodey_text: {
        fontSize: 16,
        color: '#2591ff',
    }
})

export default connect(({app, user}) => ({...app, user}))(setRealName)