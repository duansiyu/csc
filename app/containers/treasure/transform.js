import React, {Component} from 'react'
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, Vibration} from 'react-native'
import {connect} from 'react-redux'

import {Wave, Thumb, Touchable} from '../../components'
import {createAction, NavigationActions} from '../../utils'

import {List, WhiteSpace, Button, Flex, Card, Steps, Modal, InputItem, Switch, Toast, Picker} from 'antd-mobile'
import px2dp from "../../utils/px2dp"

import { timeString } from '../../utils/help'
import {hexMD5} from '../../utils/md5'
const Item = List.Item
const Brief = Item.Brief
const Step = Steps.Step
const alert = Modal.alert
const prompt = Modal.prompt;
class transform extends Component {
    static navigationOptions = {
        title: '转换',
    }
    state = {
        selectType: 100,
        currencyType: [{label:'EOS',value: 100}],
        selectName:'BTC',
        verifyDialogVisible: false,
        time: '获取验证码', //倒计时
        currentTime: 60,
        disabled: false,
        isPayPwd: false,
        changeDisable: false,
        cscNum: 0,
        hiddenPsd: true,
        redColor:false
    }
    componentDidMount() {
        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.type){
                this.setState({selectName: this.props.navigation.state.params.name,selectType: this.props.navigation.state.params.type, currencyType: this.props.navigation.state.params.currencyType}, () => {
                        this.getCurrencyQuery()
                        const param = {
                            accountId: this.props.userInfo.accountCommonDTO.id
                        }
                        this.props.dispatch({
                            type: 'user/financePayPasswordExist',
                            payload: {
                                ...param
                            },
                            callback: (res) => {
                                this.setState({ isPayPwd: res})
                            }
                        })
                    })
            }
        }
    }
    getCurrencyQuery = () => {
        this.props.dispatch({
            type: 'treasure/getCurrencyQuery',
            payload: {
                    command: {
                        businessType: this.state.selectType,
                        accountId: this.props.userInfo.accountCommonDTO.id
                    }
            }

        })
    }
    addressSubmit = () => {
        if(!this.props.user.isPayPassword){
            alert('提示', '您还没设置交易密码', [
                { text: '取消', onPress: () => console.log('cancel')},
                {
                    text: '立即设置',
                    onPress: () =>
                        this.props.dispatch(NavigationActions.navigate({routeName: 'SetPayPassword', params: {name: '修改交易密码'}}))
                },
            ])
            return false
        }
        if(!this.state.sourceAmount){
            Toast.info('请输入使用数量', 1.5, null, false)
            return false
        }
        let data = this.props.treasure.currencyInfo
        let max = data.sourceBalance / 1000000
        let inputNum = this.state.sourceAmount
        if(inputNum > max){
            Toast.info('亲:您的余额不足', 1.5, null, false)
            return false
        }
        prompt(
            '操作',
            '输入交易密码',
            (password) => {
                this.props.dispatch({
                    type: 'treasure/currencyTransform',
                    payload: {
                        command: {
                            sourceType: this.state.selectType,
                            sourceAmount:this.state.sourceAmount * 1000000,
                            accountId: this.props.userInfo.accountCommonDTO.id,
                            payPassword: hexMD5(password)
                        }
                    },
                    callback: (res) => {
                        this.props.dispatch(NavigationActions.navigate({routeName: 'treasureSuccess'}))
                    }
                })
            },
            'secure-text',
        )

    }
    logout = () => {

    }
    pickechen = (v) => {
        if(v == this.state.selectType){
            return
        }else{
            this.setState({cscNum: 0, sourceAmount: ''})
            this.state.currencyType.map(type => {
                if (type.value == v) {
                    this.setState({selectType: type.value, selectName: type.label}, () => {
                        this.getCurrencyQuery()
                    })
                }
            })
        }
    }
    render() {
        const {userInfo} = this.props
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Picker
                        data={this.state.currencyType.length == 0 ? [] : [this.state.currencyType]}
                        cascade={false}
                        extra="请选择"
                        value={[this.state.selectType]}
                        onOk={v =>
                            this.pickechen(v)
                        }
                    >
                        <List.Item arrow="horizontal">选择类型</List.Item>
                    </Picker>
                    <Item extra={`${this.props.treasure.currencyInfo ? this.props.treasure.currencyInfo.sourceDayPrice / 1000000 : 0}`}>今日单价</Item>
                    <Item extra={`${this.props.treasure.currencyInfo ? this.props.treasure.currencyInfo.sourceBalance / 1000000: 0}`}>我的余数</Item>
                    <InputItem
                        value = {this.state.sourceAmount}
                        editable={true}
                        placeholder="请输入使用数量"
                        type='number'
                        onChangeText={ (text) => {
                            var value = text
                            let data = this.props.treasure.currencyInfo
                            this.setState({sourceAmount: value},() => {
                                if(this.state.sourceAmount > data.sourceBalance / 1000000){
                                    this.setState({
                                        changeDisable: true
                                    })
                                    Toast.info('亲:您的余额不足', 1.5, null, false)
                                }else{
                                    this.setState({
                                        changeDisable: false
                                    })
                                    let index = value.indexOf('.')
                                    let decimal = value.substring(index+1)
                                    if(index>-1 && decimal.length>6){
                                        value = value.substring(0, index+7 )
                                        this.setState({
                                            sourceAmount: value,
                                        })
                                    }
                                    let max = (data.sourceDayPrice/1000000) *  this.state.sourceAmount / (data.targetDayPrice/1000000)
                                    if(max <1){
                                        this.setState({changeDisable: true})
                                        Toast.info('获得CSC大于1才允许转换', 1.5, null, false)
                                    }else{
                                        this.setState({changeDisable: false})
                                    }
                                    let maxIndex = max.toString().indexOf('.')
                                    let maxDecimal = max.toString().substring(maxIndex+1)
                                    this.setState({cscNum: max})
                                    if(maxIndex>-1 && maxDecimal.length>6){
                                        this.setState({cscNum: max.toFixed(6)})
                                    }
                                }
                            })
                        }}
                    >使用数量</InputItem>
                    <Item extra={`${this.props.treasure.currencyInfo ? this.props.treasure.currencyInfo.targetDayPrice / 1000000: 0}`}>CSC单价</Item>
                    <Item extra={`${this.state.cscNum}`}>获得CSC</Item>
                    <View style={{marginTop: 40 ,paddingRight: 20, paddingLeft: 20}}>
                        <Button type="primary" disabled={this.state.changeDisable} style={styles.class_but} onClick={this.addressSubmit}>转换</Button>
                    </View>
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


export default connect(({app, user, home, treasure}) => ({...app, user, home, treasure}))(transform)