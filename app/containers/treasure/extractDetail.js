import React, {Component} from 'react'
import {StyleSheet, View, Text, ImageBackground, ScrollView, Dimensions, Platform} from 'react-native'
import {connect} from 'react-redux'
import {InputItem, Flex, Button, Toast, List, Picker, Tabs} from 'antd-mobile'
import { timeString } from '../../utils/help'
const Item = List.Item
const Brief = Item.Brief

class extractDetail extends Component {
    static navigationOptions = () => ({
        title: '提取详情',
    })
    state = {
        withdrawStatus:{1:'等待处理',2:'处理中',3: '提取成功',4:'提取失败'},
        itemObj: {},
    }
    componentDidMount() {
        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.id){
                this.props.dispatch(({
                    type: 'user/getRealInfo',
                    payload: {
                        userId: this.props.userInfo.accountCommonDTO.id
                    }
                }))
                let data =  this.props.treasure.extractDetailList.data
                data.map(item => {
                    if (this.props.navigation.state.params.id == item.id) {
                        this.setState({itemObj: item})
                    }
                })

            }
        }
        this.getType()
    }
    getType = () =>{
        this.props.dispatch({
            type: 'wallet/getType',
            payload:{
                type: 'BankType',
                activeState:1
            },
            callback:() =>{
                var item = this.state.itemObj
                this.props.wallet.accountType.map(menuItem =>{
                    if(item.thirdpartyAccount && item.thirdpartyAccount.type == 1 && item.thirdpartyAccount.accountType == menuItem.others){
                        item.bankName = menuItem.name
                    }
                })
                this.setState({itemObj: item})
            }
        })
    }
    render() {
            return (
                <ScrollView>
                <View style={styles.container}>
                    <List>
                        <Item extra={this.state.withdrawStatus[this.state.itemObj.withdrawStatus]}>状态：</Item>
                        <Item extra={this.props.user.realInfo.realName}>申请人：</Item>
                        <Item extra={this.state.itemObj.timeStr}>申请时间：</Item>
                        <Item extra={this.state.itemObj.thirdpartyAccount && this.state.itemObj.thirdpartyAccount.type == 1 ? this.state.itemObj.bankName : '镭达钱包'}>钱包类型：</Item>
                        <Item extra={this.state.itemObj.thirdpartyAccount ? this.state.itemObj.thirdpartyAccount.account : ''}>账号或地址：</Item>
                        <Item extra={(this.state.itemObj.poundage + this.state.itemObj.otherAmount + this.state.itemObj.amount) / 1000000}>申请提取金额：</Item>
                        <Item extra={this.state.itemObj.poundage === 0 ? '0' : this.state.itemObj.poundage/1000000}>提取手续费：</Item>
                        <Item extra={this.state.itemObj.otherAmount === 0 ? '0' : this.state.itemObj.otherAmount/1000000}>其它费用：</Item>
                        <Item extra={this.state.itemObj.amount ?  this.state.itemObj.amount/1000000 : 0}>实际到账：</Item>
                    </List>
                </View>
                </ScrollView>
            )
        }
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
        marginTop: 10,
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

export default connect(({app, user, home, treasure,wallet}) => ({...app, user, home, treasure,wallet}))(extractDetail)