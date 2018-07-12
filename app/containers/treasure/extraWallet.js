import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Vibration,
    Platform
} from 'react-native'
import {connect} from 'react-redux'

import {Wave, Thumb, Touchable} from '../../components'
import {createAction, NavigationActions} from '../../utils'

import {List, WhiteSpace, Button, Flex, Card, Steps, Modal, InputItem, Switch, Toast, Picker} from 'antd-mobile'
import px2dp from "../../utils/px2dp"

import { timeString } from '../../utils/help'
import {hexMD5} from '../../utils/md5'
const Item = List.Item
const Brief = Item.Brief
const alert = Modal.alert
const prompt = Modal.prompt;

class extraWallet extends Component {
    static navigationOptions = ({navigation}) => ({
        title: '提取',
        headerRight:(
            Platform.OS === 'android' ?
                <View style={{marginRight: 15}}><Text onPress={()=> { navigation.dispatch(NavigationActions.navigate({routeName: 'extractList'})) }} style={{fontSize: 16,color: '#fff'}}>历史 <Image style={{width: 45,height: 45}} source={require('../../images/btn_nav_mx.png')}/></Text></View>
                :
                <View style={{marginRight: 15}}><Text onPress={()=> { navigation.dispatch(NavigationActions.navigate({routeName: 'extractList'})) }} style={{fontSize: 16,color: '#fff'}}>历史 <Image style={{width: 16,height: 16}} source={require('../../images/btn_nav_mx.png')}/></Text></View>
        )
    })
    state = {
        selectType: 100,
        currencyType: [{label:'EOS',value: 100}],
        selectName:'BTC',
        verifyDialogVisible: false,
        time: '获取验证码', //倒计时
        currentTime: 60,
        betdisabled: false,
        isPayPwd: false,
        changeDisable: false,
        cscNum: 0,
        hiddenPsd: true,
        redColor:false,
        limitnNum:1,
        temp_energy: 0,
        energy: 0,
        maxNum:0

    }
    componentWillMount(){
        this.getBankList()
    }
    componentDidMount() {
        this.findByAccountIdAndType()
        this.bizConfig()
        this.getRealInfo()
        const param = {
            accountId: this.props.userInfo.accountCommonDTO.id
        }
        this.props.dispatch({
            type: 'user/financePayPasswordExist',
            payload: {
                ...param
            },
            callback: (res) => {
                //this.setState({ isPayPwd: res})
            }
        })
    }
    getRealInfo = () => {
        this.props.dispatch(({
            type: 'user/getRealInfo',
            payload:{
                userId: this.props.userInfo.accountCommonDTO.id
            }
        }))
    }
    addressSubmit = () => {
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
        if(!this.state.amount){
            Toast.info('请输入提取数量', 1.5, null, false)
            return false
        }
        if(!this.props.bank.selectBank.account){
            Toast.info('请选择银行卡', 1.5, null, false)
            return false
        }
        if(!this.props.bank.selectBank.bankName){
            Toast.info('请选择银行卡', 1.5, null, false)
            return false
        }

        prompt(
            '操作',
            '输入交易密码',
            (password) => {
                var prams = {
                    command: {
                        amount: this.state.amount * 1000000,
                        payWay: 3,
                        account: this.props.userInfo.accountCommonDTO.account,
                        thirdAccountMessage: this.props.bank.selectBank.bankName,
                        thirdAccount: this.props.bank.selectBank.account,
                        thirdAccountName: this.props.bank.selectBank.accountName,
                        thirdAccountType: 1,
                        thirdAccountId: this.props.bank.selectBank.id,
                        withdrawType:10,
                        accountId: this.props.userInfo.accountCommonDTO.id,
                        desc: '提取',
                        allWithdraw: false,
                    }
                }
                prams.command.password = hexMD5(password)
                this.props.dispatch({
                    type: 'treasure/widthDraw',
                    payload: prams,
                    callback: () => {
                        Toast.info('提交成功', 1.5, null, true)
                        setTimeout(() =>{
                            this.props.dispatch(NavigationActions.navigate({routeName: 'extractList'}))
                        },300)
                    }
                })
            },
            'secure-text',
        )

    }
    bizConfig = (type) => {
        this.props.dispatch({
            type: 'treasure/bizConfig',
            payload:{
                key1: 3,
                type: 10
            },
            callback:(res) =>{
                if(res){
                    console.log('res',res)
                    this.setState({limitnNum: res.value1/1000000})
                }
            }
        })
    }
    bizConfigEnergy = (type) => {
        this.props.dispatch({
            type: 'treasure/bizConfig',
            payload:{
                key1: 'withdraw_temp_energy_ratio',
                type: 910
            },
            callback:(res) =>{
                if(res){
                    this.setState({temp_energy: res.value1*100})
                }
            }
        })
    }
    bizConfigLsEnergy = (type) => {
        this.props.dispatch({
            type: 'treasure/bizConfig',
            payload:{
                key1: 'withdraw_energy_ratio',
                type: 9
            },
            callback:(res) =>{
                if(res){
                    this.setState({energy: res.value1*100})
                }
            }
        })
    }
    logout = () => {

    }
    bindInputss = (value) => {
        var value = value
        var data = this.state.maxNum
        this.setState({amount: value},() => {
            var index = value.indexOf('.')
            var decimal = value.substring(index + 1)
            if (index > -1 && decimal.length > 6) {
                value = value.substring(0, index+7 )
                this.setState({
                    amount: value
                })
            }
            if (value < this.state.limitnNum) {

                Toast.info('亲：提取必须是'+this.state.limitnNum+'的倍数', 1.5, null, false)
                this.setState({
                    betdisabled: true
                })
            }else{
                if(value>data){
                    Toast.info('亲：您的余额不足', 1.5, null, false)
                    this.setState({
                        betdisabled: true
                    })
                }else if((value * 1000000) % (this.state.limitnNum * 1000000) != 0) {
                    this.setState({
                        betdisabled: true
                    })
                }else {
                    this.setState({
                        betdisabled: false
                    })
                }
            }
        })
    }
    //获取银行卡列表
    getBankList = ()=> {
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
                this.getType()
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
                },() =>{
                    this.handleData()
                })
            }
        })
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
                if(item.isDefault == 1){
                    this.props.dispatch({
                        type:'bank/updateState',
                        payload:{
                            selectBank: item
                        }
                    })
                }
            })
            walletList.push(item)
        })
        console.log(this.props.bank.bankList)
    }
    findByAccountIdAndType = () =>{
        this.props.dispatch({
            type:'wallet/findByAccountIdAndType',
            payload:{
                type: 3,
                accountId: this.props.userInfo.accountCommonDTO.id
            },
            callback:(res) =>{
                this.setState({maxNum:res.balance / 1000000})
            }
        })
    }
    render() {
        const {userInfo} = this.props
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Item extra="礼金">名称</Item>
                    <Item extra={`${this.state.maxNum}`}>可用余额</Item>
                    <InputItem
                        value = {this.state.amount}
                        editable={true}
                        placeholder={"提取必须是"+this.state.limitnNum+"的倍数"}
                        type='number'
                        onChangeText={ (text) => {
                            this.bindInputss(text)
                        }}
                    >提取数量</InputItem>
                    <Item onClick={() => this.props.dispatch(NavigationActions.navigate({routeName:'walletList',params:{name:'extraWallet'}}))} extra='请选择' arrow="horizontal" align="middle" multipleLine>银行卡</Item>
                    {this.props.bank.selectBank.accountName && <View style={styles.bankConatiner}>
                        <Flex>
                            <Flex.Item><Text style={styles.left}>{this.props.bank.selectBank.accountName}</Text></Flex.Item>
                            <Flex.Item><Text></Text></Flex.Item>
                        </Flex>
                        <Flex style={{flexDirection:'row'}}>
                            <Flex.Item style={{flex:0.4}}><Text style={styles.left}>{this.props.bank.selectBank.name}</Text></Flex.Item>
                            <Flex.Item style={{flex:1}}><Text style={styles.right}>{this.props.bank.selectBank.account}</Text></Flex.Item>
                        </Flex>
                        <Flex style={{flexDirection:'row'}}>
                            <Flex.Item><Text style={styles.right}>{this.props.bank.selectBank.bankName}</Text></Flex.Item>
                        </Flex>
                    </View>}
                    <View style={{marginTop: 20 ,paddingRight: 20, paddingLeft: 20}}>
                        <Button type="primary" disabled={this.state.betdisabled} style={styles.class_but} onClick={this.addressSubmit}>提取</Button>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 40,
        backgroundColor: '#fff',
        marginTop: 10
    },
    class_but: {
        width: '100%',
        marginTop: 40,
        backgroundColor: '#4184ff'
    },
    bankConatiner:{
        backgroundColor:'#f5f5f9',
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:'10%'
    },
    left:{
        paddingRight:18,
        lineHeight:30,
        fontSize:17,
        color:'#999',
        flex:0.2

    },
    right:{
        textAlign:'left',
        fontSize:17,
        color:'#999',
        lineHeight:30,
        flex:1
    }
})


export default connect(({app, user, treasure,bank, wallet}) => ({...app, user, treasure,bank,wallet}))(extraWallet)