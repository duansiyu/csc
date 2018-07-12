import React, {Component} from 'react'
import {StyleSheet, View, Image, Text, TouchableOpacity, TextInput,ScrollView, ImageBackground, Vibration} from 'react-native'
import {connect} from 'react-redux'
import PropTypes from 'prop-types';

import {Wave, Thumb, Touchable} from '../../components'
import {createAction, NavigationActions} from '../../utils'

import {List, WhiteSpace, Button, Flex, Card, Steps, Modal, InputItem, Switch, Toast, Picker,PickerView} from 'antd-mobile'
import px2dp from "../../utils/px2dp"
import ChinaRegionWheelPicker from 'rn-wheel-picker-china-region';
import TitleBar from '../../components/TitleBar'
import { timeString } from '../../utils/help'
const Item = List.Item
const Brief = Item.Brief
const Step = Steps.Step
const alert = Modal.alert
class wallet extends Component {
    static propTypes = {
        // isVisible: PropTypes.bool,
        selectedProvince: PropTypes.string,
        selectedCity: PropTypes.string,
        selectedArea: PropTypes.string,
        navBtnColor: PropTypes.string,
        animationType: PropTypes.string,
        // transparent: PropTypes.bool,
        onSubmit: PropTypes.func,
        onCancel: PropTypes.func,
    }

    state = {
        selecTypeName:null,
        selecType:'1',
        accountType:[],
        region1:null,
        isPickerVisible:false,
        location:'广东深圳福田区',
        checked: false
    }
    static navigationOptions = {
        title: '新增银行卡',
        header: null
    }
    componentWillMount(){
    }
    componentDidMount() {
        this.getType()
        this.props.dispatch({
            type:'wallet/updateState',
            payload:{
                btnDisabled: false
            }
        })
        this.getRealInfo()
    }
    realName = () =>{
        if (!this.props.user.realInfo.realName) {
            alert('提示', '您还没有实名', [
                { text: '取消', onPress: () => console.log('cancel')},
                {
                    text: '马上实名',
                    onPress: () =>
                        this.props.dispatch(NavigationActions.navigate({routeName: 'SetRealName',params: {history: 'extract'}}))
                },
            ])
        }
    }
    bankSubmit = () => {
        if (!this.props.user.realInfo.realName) {
            alert('提示', '您还没有实名', [
                { text: '取消', onPress: () => console.log('cancel')},
                {
                    text: '马上实名',
                    onPress: () =>
                        this.props.dispatch(NavigationActions.navigate({routeName: 'SetRealName',params: {history: 'extract'}}))
                },
            ])
            return false
        }
        // if(!this.state.accountName){
        //     Toast.info('请输入持卡人', 1.5, null, false)
        //     return
        // }
        if(!this.state.account){
            Toast.info('请输入卡号', 1.5, null, false)
            return
        }
        if(!this.state.bankName){
            Toast.info('请输入开户行', 1.5, null, false)
            return
        }
        const  params = {
            accountType: this.state.selecType,
            account: this.state.account,
            accountName: this.props.user.realInfo.realName,
            bankName: this.state.location + this.state.bankName,
            accountId: this.props.userInfo.accountCommonDTO.id,
            isDefault: this.state.checked == true? 1:0,
            type:1
        }
        this.props.dispatch({
            type: 'wallet/AddWallet',
            payload:{
                command:{
                    rawRequest:{
                        accountType: this.state.selecType,
                        account: this.state.account,
                        accountName: this.props.user.realInfo.realName,
                        bankName: this.state.location + this.state.bankName,
                        accountId: this.props.userInfo.accountCommonDTO.id,
                        isDefault: this.state.checked == true? 1:0,
                        type:1
                    }
                }
            },
            callback:() =>{
                Toast.info('添加银行卡成功',1.5, null, false)
                setTimeout(() =>{
                    this.props.dispatch({
                        type: 'bank/getBankListAll',
                        payload:{
                            command:{
                                rawRequest:{
                                    condition:{
                                        accountId: this.props.userInfo.accountCommonDTO.id,
                                        // type: 1
                                    },
                                    pageSize:20,
                                    currentPage:1
                                }

                            }
                        },
                        callback:() =>{
                            this.handleData()
                        }
                    })
                },1500)
                setTimeout(() =>{
                    this.props.dispatch(NavigationActions.back())
                }, 2000)
            }
        })
    }
    logout = () => {

    }
    handleData = () =>{
        let walletList = []
        this.props.bank.bankList.map(item =>{
            this.props.wallet.accountType.map(menuItem =>{
                if(menuItem.others == item.accountType){
                    if(menuItem.imgUrl){
                        item.imgUrl = menuItem.imgUrl[0].value
                        item.name = menuItem.name
                    }
                }
            })
            walletList.push(item)
        })
        this.props.dispatch({
            type: 'bank/updateState',
            payload:{
                bankList: walletList
            }
        })
    }
    getType = () =>{
        this.props.dispatch({
            type: 'wallet/getType',
            payload:{
                type: 'BankType',
                activeState:1
            },
            callback: (res) =>{
                this.setState({
                    accountType: res
                })
            }
        })
    }
    hanleAccountType = (v) =>{
        if (v == this.state.selecType) {
            return
        } else {
            this.state.accountType.map(type => {
                if (type.value == v) {
                    this.setState({
                        selecType: type.value,
                        selecTypeName: type.label
                    })
                }
            })
        }
    }
    _onPressSubmit = (params) =>{
        this.setState({
            location: params.province + params.city + params.area,
            isPickerVisible: false,
        })
    }
    _onPressCancel = () =>{
        this.setState({
            isPickerVisible: false,
        })
    }
    onChange = () =>{
        this.setState({
            isPickerVisible: true,
        })
    }
    getRealInfo = () => {
        this.props.dispatch(({
            type: 'user/getRealInfo',
            payload:{
                userId: this.props.userInfo.accountCommonDTO.id
            },
            callback:() =>{
                this.realName()
            }
        }))
    }
    render() {
        const {userInfo,navigation} = this.props
        return (
            <ScrollView>
                <TitleBar title={"银行卡管理"}  navigation={navigation} right={false}
                />
                <View style={styles.container}>
                    <InputItem
                        editable={false}
                        value={this.props.user.realInfo?this.props.user.realInfo.realName:''}
                        // placeholder="请输入持卡人"
                        // type="text"
                        // onChange={(text) => {
                        //     this.setState({'accountName': text})
                        // }}
                    >
                        持卡人
                    </InputItem>
                    <List>
                        <InputItem
                            type="number"
                            placeholder= "请输入卡号"
                            onChange={(text) => {
                                this.setState({'account': text})
                            }}>
                            卡号
                        </InputItem>
                    </List>
                    <Picker
                        data={this.state.accountType.length == 0 ? [] : [this.state.accountType]}
                        cascade={false}
                        extra="请选择"
                        value={this.state.accountType.length == 0? '':[this.state.selecType]}
                        onOk={v =>
                            this.hanleAccountType(v)
                        }
                    >
                        <List.Item arrow="horizontal">选择类型</List.Item>
                    </Picker>
                    <List>
                        <Item
                            extra={this.state.location}
                            arrow="horizontal"
                            onClick={() => this.onChange()}
                        >开户行地址</Item>
                    </List>
                    <ChinaRegionWheelPicker
                        isVisible={this.state.isPickerVisible}
                        navBtnColor={'red'}
                        selectedProvince={'广东'}
                        selectedCity={'深圳'}
                        selectedArea={'福田区'}
                        transparent
                        animationType={'fade'}
                        onSubmit={this._onPressSubmit.bind(this)} // 点击确认_onPressSubmit
                        onCancel={this._onPressCancel.bind(this)} // 点击取消_onPressCancel
                    />
                    <InputItem
                        type="text"
                        placeholder="请输入开户行"
                        onChange={(text) => {
                            this.setState({'bankName': text})
                        }}>
                        开户行
                    </InputItem>
                    <View style={{marginTop: 10}}>
                        <Item
                            extra={<Switch checked={this.state.checked} onChange={(checked) => {
                                this.setState({checked: checked})
                            }}/>}
                        >设为默认账户</Item>
                    </View>
                    <View style={{marginTop: 40 ,paddingRight: 20, paddingLeft: 20}}>
                        <Button type="primary" disabled={this.props.wallet.btnDisabled} style={styles.class_but} onClick={this.bankSubmit}>确定</Button>
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


export default connect(({app, user, home, bank,wallet}) => ({...app, user, home, bank,wallet}))(wallet)