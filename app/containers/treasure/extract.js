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
class extract extends Component {
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
        energy: 0

    }
    componentWillMount(){
        this.getBankList()
    }
    componentDidMount() {
        this.getRealInfo()
        var currencyType = []
        this.props.treasure.currencyType.map(type => {
            currencyType.push({label: type.name,value:type.others})
        })
        this.setState({currencyType: currencyType})
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
        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.type){
                this.setState({selectName: this.props.navigation.state.params.name,selectType: this.props.navigation.state.params.type}, () => {
                    this.getCurrencyQuery()
                })
                this.bizConfigEnergy()
                this.bizConfigLsEnergy()
                this.bizConfig(this.props.navigation.state.params.type)
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
            Toast.info('请输入钱包账号或地址', 1.5, null, false)
            return false
        }
        if(!this.props.bank.selectBank.bankName){
            Toast.info('请输入对应手机号', 1.5, null, false)
            return false
        }
        prompt(
            '操作',
            '输入交易密码',
            (password) => {
                var prams = {
                    command: {
                        amount: this.state.amount * 1000000,
                        thirdAccountMessage: this.props.bank.selectBank.bankName,
                        thirdAccount: this.props.bank.selectBank.account,
                        thirdAccountType: 10,
                        withdrawType:9,
                        payWay: this.state.selectType,
                        allWithdraw: false,
                        accountId: this.props.userInfo.accountCommonDTO.id,
                        account: this.props.userInfo.accountCommonDTO.account,
                        desc: '提取'
                    }
                }
                prams.command.password = hexMD5(password)
                console.log(prams)
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
              key1: type,
              type: 9
          },
          callback:(res) =>{
                if(res){
                    console.log(res)
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
                type: 9
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
    pickechen = (v) => {
        if(v == this.state.selectType){
            return
        }else{
            this.setState({cscNum: 0, sourceAmount: ''})
            this.state.currencyType.map(type => {
                if (type.value == v) {
                    this.setState({selectType: type.value, selectName: type.label}, () => {
                        this.bizConfig(this.state.selectType)
                        this.getCurrencyQuery()
                    })
                }
            })
        }
    }
    bindInputss = (value) => {
        var value = value
        var data = this.props.treasure.currencyInfo.sourceBalance/1000000
        this.setState({amount: value},() => {
            var type = this.state.selectType

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
            type: 'bank/getBankList',
            payload:{
                command:{
                    condition:{
                        accountId: this.props.userInfo.accountCommonDTO.id,
                    },
                    pageSize:20,
                    currentPage:1
                }

            }
        })
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
                    <Item extra={`${this.props.treasure.currencyInfo ? this.props.treasure.currencyInfo.sourceBalance / 1000000: 0}`}>可用余额</Item>
                    <InputItem
                        value = {this.state.amount}
                        editable={true}
                        placeholder={"提取必须是"+this.state.limitnNum+"的倍数"}
                        type='number'
                        onChangeText={ (text) => {
                            this.bindInputss(text)
                        }}
                    >提取数量</InputItem>
                    <Item extra="镭达钱包">钱包类型</Item>
                    <Item onClick={() => {
                        this.props.dispatch(NavigationActions.navigate({routeName: 'bankList'}))
                    }}extra={this.props.bank.selectBank.account?this.props.bank.selectBank.account:'请输入钱包账号'} arrow="horizontal" align="middle" multipleLine>
                        钱包账号或地址
                    </Item>
                    {/*<InputItem*/}
                        {/*labelNumber={7}*/}
                        {/*placeholder="请输入钱包账号或地址"*/}
                        {/*type='text'*/}
                        {/*defaultValue={this.props.bank.defaultBank.accountName}*/}
                        {/*onChangeText={ (text) => {*/}
                            {/*this.setState({thirdAccount: text})*/}
                        {/*}}*/}
                    {/*>钱包账号或地址</InputItem>*/}
                    <InputItem
                        labelNumber={7}
                        placeholder="请输入对应手机号"
                        defaultValue={this.props.bank.selectBank.bankName}
                        value={this.props.bank.selectBank.bankName}
                        type='text'
                        onChangeText={ (text) => {
                            this.setState({thirdAccountMessage: text})
                        }}
                    >钱包对应手机号</InputItem>
                    <View style={{padding: 10,marginLeft: 4,marginTop: 10}}>
                        <Text style={{color: '#333333',fontSize: 14}}>提示：1.宝藏是您在平台挖到的，提取收10%手续费</Text>
                        <Text style={{color: '#333333',fontSize: 14}}>2、每次提取需要消耗{this.state.energy}%固定能量和{this.state.temp_energy}%临时能量，建议累计后提取。</Text>
                    </View>
                    <View style={{marginTop: 40 ,paddingRight: 20, paddingLeft: 20}}>
                        <Button type="primary" disabled={this.state.betdisabled} style={styles.class_but} onClick={this.addressSubmit}>提取</Button>
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
    }
})


export default connect(({app, user, treasure,bank}) => ({...app, user, treasure,bank}))(extract)