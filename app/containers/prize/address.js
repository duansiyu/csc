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
class address extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.name,
    })
    state = {
        receiver: '',
        mobile: '',
        detail: '',
        item: {},
        checked: false
    }
    componentDidMount() {
        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.item){
                var item = this.props.navigation.state.params.item
                this.setState({receiver: item.receiver,mobile: item.mobile, detail: item.detail,item: item, checked: item.isDefault == '1' ? true : false})
            }
        }
        this.props.dispatch({
            type:'prize/updateState',
            payload:{
                btnDisabled: false
            }
        })
    }
    addressSubmit = () => {
        if(!this.state.receiver){
            Toast.info('请输入收货人姓名', 1.5, null, false)
            return
        }
        if(!this.state.mobile){
            Toast.info('请输入电话号码', 1.5, null, false)
            return
        }
        var re = /^1\d{10}$/
        if(!re.test(this.state.mobile)){
            Toast.info('请输入正确的号码', 1.5, null, false)
            return
        }
        if(!this.state.detail){
            Toast.info('请输入详细地址', 1.5, null, false)
            return
        }
        var param = {
            mobile: this.state.mobile,
            receiver: this.state.receiver,
            userId: this.props.userInfo.accountCommonDTO.id,
            detail: this.state.detail,
            isDefault: this.state.checked == true?1:0,
            type:1,
        }
        if(this.state.item && this.state.item.id){
            this.props.dispatch({
                type: 'prize/updateAddress',
                payload:{
                    address:[{...param, id: this.state.item.id}]
                },
                callback:() =>{
                    this.props.dispatch({
                        type: 'prize/selectByUserId',
                        payload:{
                            userId: this.props.userInfo.accountCommonDTO.id,
                            types:[1]
                        },
                        callback: () =>{
                            Toast.info('更新成功', 1.5, null, false)
                            this.props.dispatch(NavigationActions.back())
                        }
                    })
                }
            })
        }else{
            this.props.dispatch({
                type: 'prize/addAddress',
                payload:{
                    addressList:[{...param}]
                },
                callback:() =>{
                    this.props.dispatch({
                        type: 'prize/selectByUserId',
                        payload:{
                            userId: this.props.userInfo.accountCommonDTO.id,
                            types:[1]
                        },
                        callback: () =>{
                            Toast.info('添加成功', 1.5, null, false)
                            this.props.dispatch(NavigationActions.back())
                        }
                    })
                }
            })
        }
    }
    logout = () => {

    }
    render() {
        const {userInfo} = this.props
        return (
            <ScrollView>
                <View style={styles.container}>
                    <InputItem
                        placeholder={this.state.receiver ? this.state.receiver : "请输入收货人"}
                        type="text"
                        onChange={(text) => {
                            this.setState({'receiver': text})
                        }}
                    >姓名</InputItem>
                    <InputItem
                       placeholder={this.state.mobile ? this.state.mobile : "请输入电话号码"}
                       type="text"
                       onChange={(text) => {
                        this.setState({'mobile': text})
                    }}>
                        电话
                    </InputItem>
                    <InputItem
                        type="text"
                        placeholder={this.state.detail ? this.state.detail : "请输入详细地址"}
                        onChange={(text) => {
                        this.setState({'detail': text})
                    }}>
                        地址
                    </InputItem>
                    <View style={{marginTop: 10}}>
                        <Item
                            extra={<Switch checked={this.state.checked} onChange={(checked) => {
                                this.setState({checked: checked})
                            }}/>}
                        >设为默认地址</Item>
                    </View>
                    <View style={{marginTop: 40 ,paddingRight: 20, paddingLeft: 20}}>
                        <Button type="primary" disabled={this.props.prize.btnDisabled} style={styles.class_but}  onClick={this.addressSubmit}>保存</Button>
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


export default connect(({app, user, home, prize}) => ({...app, user, home, prize}))(address)