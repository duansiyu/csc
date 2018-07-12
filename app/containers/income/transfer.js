import React, {Component} from 'react'
import {StyleSheet, View, Text, ImageBackground, ScrollView, Dimensions} from 'react-native'
import {connect} from 'react-redux'
import {InputItem, Flex, Button, Toast, List, Picker} from 'antd-mobile'
import {NavigationActions} from '../../utils'
import {strip} from '../../utils/StringUtil'
const Item = List.Item;

class Incometransfer extends Component {
    static navigationOptions = () => ({
        title: '转入',
    })
    state = {
        option: {},
        type: ['CSC云享链'],
        typeIndex: 0,
        inputNum: "",
        disabled: false,
    }
    componentDidMount() {
        this.props.dispatch({
            type:'income/getBalance',
            payload: {types: [103],accountId: this.props.userInfo.accountCommonDTO.id}
        })
    }
    bindToResetPsd = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'ResetPassword'}))
    }
    bindTransferPage = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'ResetPassword'}))
    }
    handleSubmit = () => {
        if(!this.state.amount){
            Toast.info('请输入使用数量', 1.5, null, false)
            return false
        }
        var num = this.state.amount* 1000000
        this.props.dispatch({
            type: 'income/interestChangeIn',
            payload: {
                    accountId: this.props.userInfo.accountCommonDTO.id,
                    amount: strip(num)
            },
            callback: () => {
                Toast.info('转入成功', 1.5, null, true)
                this.props.dispatch({
                    type:'income/getCurrencyEarnings',
                    payload: {accountId: this.props.userInfo.accountCommonDTO.id}
                })
                this.props.dispatch(NavigationActions.back())
            }
        })
    }

    render() {
        const seasons = [
            [
                {
                    label: 'CSC云享链',
                    value: '0',
                }
            ]
        ]
        console.log(this.state)
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={{margin: 5, marginTop: 10}}>
                        <List>
                            <Picker
                                data={seasons}
                                cascade={false}
                                extra="请选择"
                                value={['0']}
                                onOk={v => this.setState({ sValue: v })}
                            >
                                <List.Item arrow="horizontal">选择类型</List.Item>
                            </Picker>
                            <Item extra={`${this.props.income.energyNum  / 1000000}`}>我的余数</Item>
                            <InputItem
                                editable={true}
                                defaultValue={`${this.state.inputNum}`}
                                placeholder="请输入使用数量"
                                type='number'
                                onChangeText={ (text) => {
                                    var energyNum = this.props.income.energyNum  / 1000000
                                    this.setState({
                                        amount: text
                                    })
                                    let value = text
                                    let index = value.indexOf('.')
                                    let decimal = value.substring(index+1)
                                    console.log(decimal)
                                    console.log(index)
                                    if(index>-1 && decimal.length>6){
                                        Toast.info('亲：小数最小为6', 1.5, null, false)
                                        this.setState({
                                            disabled: true
                                        })
                                        this.setState({
                                            inputNum: value
                                        })
                                        let setValue = value.substring(0, index+7 )
                                        this.setState({
                                            amount: setValue,
                                            inputNum: setValue,
                                            updataSt: value
                                        })
                                        return
                                    }else{
                                        if(text > energyNum){
                                            Toast.info('亲：您的余额不足', 1.5, null, false)
                                            this.setState({
                                                disabled: true
                                            })
                                        }else{
                                            this.setState({
                                                disabled: false
                                            })
                                        }
                                    }
                                }}
                                extra="全部转入"
                                onExtraClick={() =>
                                    this.setState({
                                        amount: this.props.income.energyNum  / 1000000,
                                        inputNum: this.props.income.energyNum  / 1000000
                                    })
                                }
                            >使用数量</InputItem>
                        </List>
                    </View>
                    <View style={{margin: 20}}>
                        <Button type="primary" disabled={this.state.disabled} style={styles.class_but} onClick={this.handleSubmit}>确定转入</Button>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: 20
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

export default connect(({app, user, income}) => ({...app, user, income}))(Incometransfer)