import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform,
    TouchableWithoutFeedback
} from 'react-native'
import {connect} from 'react-redux'
import {NavigationActions} from '../../utils'
import {List,Button,Modal, InputItem, Toast,} from 'antd-mobile'
import {unitWidth} from "../../utils/AdapterUtil";
import {hexMD5} from '../../utils/md5'
import InputLabel from '../../components/InputLabel'
import ListItem from '../../components/ListItem'
import BaseStyle from '../../style/ListItemStyle'

const Item = List.Item
const alert = Modal.alert
const prompt = Modal.prompt;

class transform extends Component {
    static navigationOptions = {
        title: '提取',
    }
    state = {
        selectType: 103,
        currencyType: [{label:'EOS',value: 100}],
        selectName:'BTC',
        verifyDialogVisible: false,
        time: '获取', //倒计时
        currentTime: 60,
        disabled: false,
        isPayPwd: false,
        changeDisable: false,
        cscNum: 0,
        limitnNum:1,
        hiddenPsd: true,
        redColor:false,
        account: null,
        withdraw_temp_energy_ratio: 0, //临时能
        withdraw_energy_ratio: 0, //固定能量
        poundage_fee: 0, //收付费
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
        this.setState({account: this.props.userInfo.accountCommonDTO.account})
        this.bizConfig()
        this.bizConfigQueryFacade('withdraw_temp_energy_ratio')
        this.bizConfigQueryFacade('withdraw_energy_ratio')
        this.bizConfigQueryFacade('poundage_fee')
    }
    getCurrencyQuery = () => {
        this.props.dispatch({
            type: 'treasure/getCurrencyQuery',
            payload: {
                command: {
                    businessType: 103,
                    accountId: this.props.userInfo.accountCommonDTO.id
                }
            }

        })
    }
    bizConfig = (type) => {
        this.props.dispatch({
            type: 'treasure/bizConfig',
            payload:{
                key1:103 ,
                type: 9
            },
            callback:(res) =>{
                console.log('res', res)
                if(res){
                    this.setState({limitnNum: res.value1/1000000})
                }
            }
        })
    }
    bizConfigQueryFacade = (key,type=9) =>{
        this.props.dispatch({
            type: 'treasure/bizConfigQueryFacade',
            payload:{
                key1:key ,
                type: type
            },
            callback:(res) =>{
                if(res){
                    if(res.key1 == 'withdraw_energy_ratio'){
                        this.setState({withdraw_energy_ratio: res.value1 * 100})
                    }else if(res.key1 == 'poundage_fee'){
                        this.setState({poundage_fee: res.value1 * 100})
                    }else if(res.key1 == 'withdraw_temp_energy_ratio'){
                        this.setState({withdraw_temp_energy_ratio: res.value1 * 100})
                    }
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
        if(!this.state.amount){
            Toast.info('请输入提取数量', 1.5, null, false)
            return false
        }
        let data = this.props.treasure.currencyInfo
        let max = data.sourceBalance / 1000000
        let inputNum = this.state.amount
        if(inputNum > max){
            Toast.info('亲:您的余额不足', 1.5, null, false)
            return false
        }
        prompt(
            '操作',
            '输入交易密码',
            (password) => {
                this.props.dispatch({
                    type: 'treasure/cscTransition',
                    payload: {
                        account: this.state.account,
                        amount:this.state.amount * 1000000,
                        code: this.state.code,
                        symbol: 103, //CSC提取,对应103
                        payPassword: hexMD5(password),
                        accountId: this.props.userInfo.accountCommonDTO.id
                    },
                    callback: (res) => {
                        Toast.info('操作成功', 2, null, false)
                        setTimeout(() =>{
                            this.props.dispatch(NavigationActions.navigate({routeName: 'treasureDetail'}))
                        }, 1500)
                    }
                })
            },
            'secure-text',
        )

    }
    sendVerCode = () => {
        if(this.state.account == null){
            Toast.info('请输入比特兑账号', 1.5, null, false)
            return;
        }
        var reg = /^1[0-9]{10}$/;
        if(!reg.test(this.state.account)){
            Toast.info('请输入正确的手机号码', 1.5, null, false)
            return;
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
                    mobile: this.state.account,
                    domain: 'CURRENCY-CHECK',
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

    bindInputss = (value) => {
        var value = value
        var data = this.props.treasure.currencyInfo.sourceBalance/1000000
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
                    changeDisable: true
                })
            }else{
                if(value>data){
                    Toast.info('亲：您的余额不足', 1.5, null, false)
                    this.setState({
                        changeDisable: true
                    })
                }else if((value * 1000000) % (this.state.limitnNum * 1000000) != 0) {
                    this.setState({
                        changeDisable: true
                    })
                }else {
                    this.setState({
                        changeDisable: false
                    })
                }
            }
        })
    }

    info(){
        Toast.info('手机号不可编辑，需与哇矿账号一致', 3, null, false)
    }

    render() {
        const {userInfo} = this.props
        const {withdraw_temp_energy_ratio, withdraw_energy_ratio, poundage_fee,account} = this.state
        return (
            <ScrollView>
                <View style={styles.container}>
                    <ListItem label={'名称'} extra={'CSC'} />
                    <ListItem label={'可用余额'} extra={`${this.props.treasure.currencyInfo ? this.props.treasure.currencyInfo.sourceBalance / 1000000: 0}`} />
                        <InputLabel
                        label={'提取数量'}
                        placeholder={"提取必须是"+this.state.limitnNum+"的倍数"}
                        onChangeText={ (text) => {
                        this.bindInputss(text)
                    }}
                        />
                    <InputLabel
                        label={'比特兑账号'}
                        value={account}
                        placeholder={"请输入比特兑账号"}
                        onChangeText={ (text) => {
                            this.setState({account: text})
                        }}
                    />
                    <View style={BaseStyle.listItem}>
                            <View style={BaseStyle.inputListItem}>
                                <Text style={{fontSize:unitWidth * 30,color:'#000'}}>短信验证码</Text>
                                <TextInput
                                    style={{flex:1,textAlign:'right',paddingRight:8, fontSize: unitWidth* 30,borderColor:'transparent'}}
                                   placeholder="请输入验证码"
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(text) => {
                                        this.setState({'code': text})
                                    }}
                                ></TextInput>
                                <TouchableOpacity style={styles.bg} disabled={this.state.disabled} onPress={this.sendVerCode}>
                                        <Text style={styles.btText}>{this.state.time}</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={[styles.extra_p, styles.extra_top]}>1、目前仅支持提取至比特兑平台，请认真核对账号</Text>
                    <Text style={styles.extra_p}>2、宝藏是您在平台挖到的，当前平台手续费{poundage_fee}%</Text>
                    <Text style={styles.extra_p}>3、累计后提取更划算，当前每次提取需要消耗{withdraw_energy_ratio}%固定能量和{withdraw_temp_energy_ratio}%临时能量</Text>
                    <View style={{marginTop: 40 ,paddingRight: 20, paddingLeft: 20}}>
                        <Button type="primary" disabled={this.state.changeDisable} style={styles.class_but} onClick={this.addressSubmit}>确定</Button>
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
    bg: {
        width: unitWidth * 120,
        height: unitWidth * 55,
        borderRadius: unitWidth * 28,
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: unitWidth * 2,
        borderColor: '#3b8efc',
        marginLeft: unitWidth * 15
    },

    btText: {
        color: '#3b8efc',
        fontSize: unitWidth * 24
    },
    inputListItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    extra_p:{
       fontSize: unitWidth * 26,
        paddingLeft: unitWidth * 35,
        paddingRight: unitWidth * 35,
        // marginTop:unitWidth * 10,
        lineHeight:22,
        color:'#333'
    },
    extra_top:{
      paddingTop: unitWidth * 12
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