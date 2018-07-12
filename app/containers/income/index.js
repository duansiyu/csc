import React, {Component} from 'react'
import {StyleSheet, View, Text, ImageBackground, ScrollView, Dimensions, Platform, Image, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {InputItem, Flex, Button, Toast} from 'antd-mobile'

import {Touchable} from '../../components'

import {NavigationActions} from '../../utils'

import px2dp from "../../utils/px2dp"
// import {Echarts, echarts} from 'react-native-secharts'
// import Echarts_ios from 'react-native-secharts'
import Echarts from '../../components/echart/components/Echarts'
import LineChart from '../Echarts/LineChart'
import { timeString } from '../../utils/help'
import instructions from "./instructions";
class IncomeIndex extends Component {
    static navigationOptions = () => ({
        title: '我的收益',
    })
    state = {
        option: {}
    }
    componentDidMount() {
        var effectiveDateStart = new Date()
        var effectiveDateEnd = new Date()
        effectiveDateEnd.setDate(effectiveDateEnd.getDate() -  7)
        this.props.dispatch({
            type:'income/getQueryByTypeAndEffectiveDate',
            payload: {days: 7,effectiveDateEnd:  timeString(effectiveDateEnd, 'yyyy-MM-dd'), effectiveDateStart: timeString(effectiveDateStart, 'yyyy-MM-dd'), assetType: '103'},
            callback: () => {
                var cat = []
                var data = []
                this.props.income.EffectiveDate.forEach((item) => {
                    cat.push(timeString(item.effectiveDate, 'MM-dd'))
                    data.push(item.yearInterestRate ? item.yearInterestRate / 100 : 0)
                })
                this.LoadwxCharts(cat, data)
            }
        })
        this.props.dispatch({
            type:'income/getCurrencyEarnings',
            payload: {accountId: this.props.userInfo.accountCommonDTO.id}
        })
    }
    LoadwxCharts = (cat, data) =>{
        cat = cat.reverse()
        data = data.reverse()
        this.setState({option: {
                xAxis: {
                    boundaryGap: false,
                    axisTick:{
                        interval:0
                    },
                    type : 'category',
                    // boundaryGap: [0, 0.01],
                    data: cat,
                },
                grid:{

                },
                yAxis: {},
                series: [{
                    type: 'line',
                    smooth:true,
                    label: {
                        normal: {
                            lineStyle:{
                                color:'#2591ff'
                            },
                            show: true,
                            position: 'top'
                        }
                    },
                    itemStyle : {
                        normal : {
                            color:'#2591ff',
                            lineStyle:{
                                color:'#2591ff'
                            },
                            areaStyle: {type: 'default'}
                        }
                    },
                    data: data
                }]}})
    }
    bindTransferPage = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'Incometransfer'}))
    }
    gotoDetails = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'IncomeDetails'}))
    }
    gotoInstructions = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'instructions'}))
    }
    bindTransferOutPage = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'turnsOut'}))
    }
    handleSubmit = () => {
        if (this.state.isPsd && ! this.state.oldPwd){
            Toast.info('请输入初始化登录密码', 1.5, null, false)
            return
        }
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*]+$)[0-9A-Za-z~!@#$%^&*]{6,16}$/
        if (!reg.test(this.state.newPwd)) {
            Toast.info('密码必须是6位以上,16位以下的数字加任意字符组合', 1.5, null, false)
            return
        }
        if (this.state.newPwd && this.state.newPwd !== this.state.restPwd) {
            Toast.info('两次输入密码不一致', 1.5, null, false)
            return
        }
        this.props.dispatch({
            type: 'user/userCommonPasswordUpdate',
            payload: {
                request: {
                    accountId: this.props.userInfo.accountCommonDTO.id,
                    password: hexMD5(this.state.newPwd),
                }
            },
            callback: () => {
                Toast.info(!this.state.isPsd? "设置登录密码成功":"修改登录密码成功", 1.5, null, false)
                this.props.dispatch(NavigationActions.back())
            }
        })
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <ImageBackground style={{ flex: 1, alignItems: 'center',width: '100%', height: 200}}  source={require('../../images/bg_wdsy.png')}>
                        <View style={{position: 'absolute',
                            right: 20,
                            top:20
                        }}>
                            <View style={{ display:'flex',flexDirection: 'row'}}>
                                <TouchableOpacity onPress={this.gotoDetails} style={{marginRight: 20}}><Image style={{width: 20, height: 20}} source={require('../../images/btn_nav_mx.png')}></Image></TouchableOpacity>
                                <TouchableOpacity onPress={this.gotoInstructions}><Image style={{width: 20, height: 20}} source={require('../../images/icon-cbsx.png')}></Image></TouchableOpacity>
                            </View>
                        </View>
                        <View style={{marginTop: 40}}><Text style={{color: '#fff'}}>CSC持币生息</Text></View>
                        <View style={{marginTop: 20}}><Text style={{color: '#fff',fontWeight: 'bold', fontSize: 20}}>{this.props.income.currencyEarnings.totalAmount / 1000000}</Text></View>
                        <View style={{position: 'absolute',justifyContent: 'center',left: 0,right: 0, bottom: 0, backgroundColor: 'rgba(14,183,255,.5)'}}>
                            <Flex style={{padding: 10}} onPress={this.gotoDetails}>
                                <Flex.Item style={{alignItems: 'center',borderColor: '#fff', borderStyle: 'solid', borderRightWidth: 1}}>
                                    <Text style={{justifyContent: 'center', color: '#fff',fontWeight: 'bold', marginBottom: 5}}>昨日收益</Text>
                                    <Text style={{justifyContent: 'center', color: '#fff',fontWeight: 'bold',}}>{this.props.income.currencyEarnings.yesterdayEarnings / 1000000}</Text>
                                </Flex.Item>
                                <Flex.Item style={{alignItems: 'center'}} onPress={this.gotoDetails}>
                                    <Text style={{justifyContent: 'center',color: '#fff',fontWeight: 'bold',marginBottom: 5}}>累计收益</Text>
                                    <Text style={{justifyContent: 'center',color: '#fff',fontWeight: 'bold',}}>{this.props.income.currencyEarnings.totalEarnings / 1000000}</Text>
                                </Flex.Item>
                            </Flex>
                        </View>
                    </ImageBackground>
                    <View style={{paddingTop: 10, padding: 10}}>
                        <View><Text style={{color: '#999'}}>七日年化收益率（%）</Text></View>
                        <View style={{marginTop: -30}}>
                            <Echarts style={{marginLeft: -40}} option={this.state.option} height={350} width={Dimensions.get('window').width}/>
                            {/*<LineChart*/}
                                {/*option={this.state.option}*/}
                            {/*/>*/}
                            {/*{Platform.OS === 'android' ?*/}
                                {/*<Echarts style={{marginLeft: -40}} option={this.state.option} height={350} width={Dimensions.get('window').width}/>*/}
                                {/*:*/}
                                {/*<Echarts_ios style={{marginLeft: -40}} option={this.state.option} height={350} width={Dimensions.get('window').width}/>*/}
                            {/*}*/}
                        </View>
                    </View>
                    <View style={{margin: 20, marginTop: -20, height: 50,alignItems: 'center'}}>
                        <Flex style={{height: 50,alignItems: 'center'}}>
                            <Flex.Item onPress={() => {
                                this.bindTransferOutPage()
                            }} style={{alignItems: 'center',backgroundColor: '#50a4f9',}}><Text style={{lineHeight: 50,color:'#fff'}}>转出到宝藏余额</Text></Flex.Item>
                            <Flex.Item onPress={() => {
                                this.bindTransferPage()
                            }} style={{alignItems: 'center',backgroundColor: '#4184ff'}}><Text style={{lineHeight: 50,color:'#fff'}}>转入到持币生息</Text></Flex.Item>
                        </Flex>
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
        width: '40%',
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

export default connect(({app, user, income}) => ({...app, user, income}))(IncomeIndex)