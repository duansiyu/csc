import React, {Component} from 'react'
import {StyleSheet, View, Text, ImageBackground, ScrollView, Dimensions, Platform} from 'react-native'
import {connect} from 'react-redux'
import {InputItem, Flex, Button, Toast, List, Picker, Tabs} from 'antd-mobile'

import {Touchable} from '../../components'

import {NavigationActions} from '../../utils'

import px2dp from "../../utils/px2dp"
import { timeString } from '../../utils/help'
import RefreshListView, {RefreshState} from '../../components/loadListView'
const Item = List.Item
const Brief = Item.Brief

class extractList extends Component {
    static navigationOptions = () => ({
        title: '提取记录',
    })
    state = {
        refreshState: RefreshState.Idle,
        withdrawStatus:{1:'等待处理',2:'处理中',3: '提取成功',4:'提取失败'},
        refreshType: 0
    }
    componentDidMount() {
        this.onHeaderRefresh()
    }
    getCurrencyDetailList = () => {
        this.props.dispatch({
            type: 'treasure/getWidthdrawAccount',
            payload: {
                command: {
                    currentPage: this.state.refreshType === 1 ? this.props.treasure.extract_currentPage + 1 :  this.props.treasure.extract_currentPage,
                    pageSize: this.props.treasure.pageSize,
                    condition:{
                        accountId: this.props.userInfo.accountCommonDTO.id,
                        withdrawType:''
                    }}
                },
            callback: (res) => {
                this.setState({
                    refreshState: !res.extract_searchLoading ? RefreshState.NoMoreData : RefreshState.Idle,
                })
            }
        })

    }
    bindToResetPsd = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'ResetPassword'}))
    }
    bindTransferPage = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'ResetPassword'}))
    }

    onHeaderRefresh = () => {
        this.setState({refreshState: RefreshState.HeaderRefreshing, refreshType: 0},function () {
            this.props.dispatch({
                type: 'treasure/updataAction',
                payload: {extract_currentPage: 1, extractDetailList: {}},
                callback: () => {
                    setTimeout(() =>{
                        this.getCurrencyDetailList()
                    },100)
                }
            })
        })
    }

    onFooterRefresh = () => {
        this.setState({refreshState: RefreshState.FooterRefreshing, refreshType: 1},function () {
            this.getCurrencyDetailList()
        })
    }

    keyExtractor = (item: any, index: number) => {
        return index
    }
o
    renderCell = (info: Object) => {
        var item =info.item
        return <Item key={info.id} wrap multipleLine arrow="horizontal" onClick={() => {
            this.bindCurrencyDetails(item.id)
        }}>
            <Flex style={{height: 40}} wrap="wrap">
                <Flex.Item style={{alignItems: 'center'}}><Brief style={{color: '#333'}}>{item.timeStr}</Brief></Flex.Item>
                <Flex.Item style={{alignItems: 'center'}}><Brief style={{color: '#333'}}>{item.withdrawType == 10? '礼金':'Coin'}</Brief></Flex.Item>
                <Flex.Item style={{alignItems: 'center'}}><Brief style={{color: '#333'}}>{(item.amount + item.poundage + item.otherAmount) /1000000}</Brief></Flex.Item>
                <Flex.Item style={{alignItems: 'flex-end'}}><Text style={{color: '#FF6B00'}}>{this.state.withdrawStatus[item.withdrawStatus]}</Text></Flex.Item>
            </Flex>
        </Item>
    }
    bindCurrencyDetails = (id) => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'extractDetail', params: {id: id}}))
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{marginTop: 10,marginBottom: 40}}>
                    <RefreshListView
                        data={this.props.treasure.extractDetailList.data}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderCell}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this.onHeaderRefresh}
                        onFooterRefresh={this.onFooterRefresh}

                        // 可选
                        footerRefreshingText= '正在载入更多...'
                        footerFailureText = '我擦嘞，居然失败了 =.=!'
                        footerNoMoreDataText= '-暂无更多数据-'
                        footerEmptyDataText= '-好像什么东西都没有-'
                    />
                </View>
            </View>
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

export default connect(({app, user, home, treasure}) => ({...app, user, home, treasure}))(extractList)