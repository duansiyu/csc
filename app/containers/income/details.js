import React, {Component} from 'react'
import {StyleSheet, View, Text, ImageBackground, ScrollView, Dimensions, Platform} from 'react-native'
import {connect} from 'react-redux'
import {InputItem, Flex, Button, Toast, List, Picker, Tabs} from 'antd-mobile'

import {Touchable} from '../../components'

import {NavigationActions} from '../../utils'

import px2dp from "../../utils/px2dp"
import Echarts from 'react-native-secharts'
import {timeString} from '../../utils/help'
import RefreshListView, {RefreshState} from '../../components/loadListView'

const Item = List.Item
const Brief = Item.Brief

class IncomeDetails extends Component {
    static navigationOptions = () => ({
        title: '持币生息明细',
    })

    constructor(props) {
        super(props)
        this.state = {
            refreshState: RefreshState.Idle,
            dataType: '',
            scrollHeight: 0,
            title: {108: '收益', 110: '转入', 111: '转出'},
            refreshType: 0,
            loaded: false
        }
    }

    componentDidMount() {
        this.onHeaderRefresh()
    }

    getCurrencyDetailList = () => {
        this.props.dispatch({
            type: 'income/getCurrencyDetailList',
            payload: {
                command: {
                    rawRequest: {
                        currentPage: this.state.refreshType === 1 ? this.props.income.currentPage + 1 : this.props.income.currentPage,
                        pageSize: this.props.income.pageSize,
                        condition: {
                            accountId: this.props.userInfo.accountCommonDTO.id,
                            inorout: this.state.dataType,
                            payWays: [40],
                            tradeTypes: [108, 110, 111]
                        }
                    }
                }
            },
            callback: (res) => {
                this.setState({
                    refreshState: !res.searchLoading ? RefreshState.NoMoreData : RefreshState.Idle,
                    loaded: true
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
    bindIncomeType = (tab) => {
        this.setState({dataType: tab.sub, refreshType: 0}, function () {
            this.onHeaderRefresh()
        })
    }
    handleSubmit = () => {
        if (!this.state.amount) {
            Toast.info('请输入使用数量', 1.5, null, false)
            return false
        }
        this.props.dispatch({
            type: 'income/interestChangeIn',
            payload: {
                accountId: this.props.userInfo.accountCommonDTO.id,
                amount: this.state.amount * 1000000,
            },
            callback: () => {
                Toast.info('转入成功', 1.5, null, false)
                this.props.dispatch(NavigationActions.back())
            }
        })
    }

    onHeaderRefresh = () => {
        this.setState({refreshState: RefreshState.HeaderRefreshing, refreshType: 0}, function () {
            this.props.dispatch({
                type: 'income/updataAction',
                payload: {currentPage: 1, currencyDetailList: {}}
            })
            setTimeout(() => {
                this.getCurrencyDetailList()
            }, 100)
        })
    }

    onFooterRefresh = () => {
        if (this.state.loaded) {
            this.setState({refreshState: RefreshState.FooterRefreshing, refreshType: 1}, function () {
                this.getCurrencyDetailList()
            })
        }
    }

    keyExtractor = (item: any, index: number) => {
        return index
    }

    renderCell = (info: Object) => {
        var item = info.item
        return <List key={info.index}>

            <Item extra={item.inorout == '1' ? '+' + item.amount / 1000000 : '-' + item.amount / 1000000}
                  key={info.index}>
                <Text style={{fontSize: 15}}>{this.state.title[item.tradeType]}</Text>
                <Brief>{item.tradeType == '108' ? timeString(item.payTime, 'yyyy-MM-dd') : timeString(item.payTime, 'yyyy-MM-dd hh:mm')}</Brief>
            </Item>
        </List>
    }

    render() {
        const tabs = [
            {title: '全部', sub: ''},
            {title: '收入', sub: '1'},
            {title: '支出', sub: '0'},
        ]
        return (
            <View style={styles.container}>
                <Tabs tabs={tabs}
                      swipeable={false}
                      initialPage=""
                      onChange={(tab, index) => {
                          this.bindIncomeType(tab)
                      }}
                >
                    <View style={{marginTop: 10}}>
                        <RefreshListView
                            data={this.props.income.currencyDetailList.data}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderCell}
                            refreshState={this.state.refreshState}
                            onHeaderRefresh={this.onHeaderRefresh}
                            onFooterRefresh={this.onFooterRefresh}

                            // 可选
                            footerRefreshingText='正在载入更多...'
                            footerFailureText='我擦嘞，居然失败了 =.=!'
                            footerNoMoreDataText='-暂无更多数据-'
                            footerEmptyDataText='-好像什么东西都没有-'
                        />
                    </View>
                </Tabs>
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
    yzm_bodey_but_class: {
        borderColor: '#2591ff',
        height: 40
    },
    yzm_bodey_text: {
        fontSize: 16,
        color: '#2591ff',
    }
})

export default connect(({app, user, income}) => ({...app, user, income}))(IncomeDetails)