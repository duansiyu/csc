import React, {Component} from 'react'
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, Vibration} from 'react-native'
import {connect} from 'react-redux'

import {Wave, Thumb, Touchable} from '../../components'
import {createAction, NavigationActions} from '../../utils'

import {List, WhiteSpace, Button, Flex, Card, Toast} from 'antd-mobile'
import px2dp from "../../utils/px2dp"

import {timeString} from '../../utils/help'
import RefreshListView, {RefreshState} from '../../components/loadListView'

const Item = List.Item
const Brief = Item.Brief

class prizeList extends Component {
    static navigationOptions = {
        title: '我的礼品'
    }

    constructor(props) {
        super(props)
        this.state = {
            refreshState: RefreshState.Idle,
            refreshType: 0,
            statusItem: {80: "待领取", 1: "待领取", 2: "详情", 3: "已到账", 4: '已过期',5:'详情'},
            loaded: false
        }
    }

    state = {}

    componentDidMount() {
        this.props.dispatch({
            type:'prize/updataAction',
            payload: {btnDisabled: false}
        })
        this.onHeaderRefresh()
    }

    componentWillReceiveProps(props) {
    }

    logout = () => {
        this.props.dispatch(createAction('app/logout')())
    }
    onHeaderRefresh = () => {
        this.setState({refreshState: RefreshState.HeaderRefreshing, refreshType: 0}, function () {
            this.props.dispatch({
                type: 'prize/updataAction',
                payload: {currentPage: 1, awrardList: {}},
                callback: () => {
                    setTimeout(() => {
                        this.getCurrencyDetailList()
                    }, 100)
                }
            })
        })
    }

    onFooterRefresh = () => {
        if (this.state.loaded) {
            this.setState({refreshState: RefreshState.FooterRefreshing, refreshType: 1}, function () {
                this.getCurrencyDetailList()
            })
        }
    }
    getCurrencyDetailList = () => {
        this.props.dispatch({
            type: 'prize/getAwardResultLists',
            payload: {
                request: {
                    currentPage: this.state.refreshType === 1 ? this.props.prize.currentPage + 1 : this.props.prize.currentPage,
                    pageSize: this.props.prize.pageSize,
                    condition: {
                        accountId: this.props.userInfo.accountCommonDTO.id, activityType: 2
                    }
                }
            },
            callback: (res) => {
                console.log(res)
                this.setState({
                    refreshState: !res.searchLoading ? RefreshState.NoMoreData : RefreshState.Idle,
                    loaded: true
                })
            }
        })
    }
    keyExtractor = (item: any, index: number) => {
        return index
    }
    setStartText = (item) => {
        if (!item.getTime) { //未领取
            //statusItem:{80:"待领取", 1:"待领取",2:"详情", 3:"已到账",4:'已过期',5:'详情'},
            if (item.overdue) {
                return '已过期'
            } else {
                if (item.awardDTO.awardType == 80) {
                    return '待领取'
                } else {
                    return '待领取'
                }
            }
        } else {  //已经领取
            if (item.awardDTO.awardType == 80 || item.awardDTO.awardType == 3) {
                return '详情'
            } else {
                return '已到账'
            }
        }
    }
    changLink = (item) => {
        // alert(JSON.stringify(item))
        if (item.status == 80) {
            this.props.dispatch({
                type: 'prize/orderRedPacket',
                payload: {
                    awardResultId: item.id,
                    accountId: this.props.userInfo.accountCommonDTO.id
                },
                callback: (res) => {
                    Toast.info("领取成功", 1.5, null, false)
                    setTimeout(() => {
                        this.onHeaderRefresh()
                    }, 2000)
                }
            })
        } else if (item.status == 2) {
            this.props.dispatch({
                type: 'prize/setDataPrizeResultAct',
                payload: {
                    prizeResult: {data: item}
                },
                callback: (res) => {
                    // alert(JSON.stringify(res))
                    this.props.dispatch(NavigationActions.navigate({
                        routeName: 'prizeDetail',
                        params: {status: item.status, history: 'list'}
                    }))
                }
            })
        } else if (item.status == 1) {
            this.props.dispatch({
                type: 'prize/financeRedPacket',
                payload: {
                    awardResultId: item.id,
                    accountId: this.props.userInfo.accountCommonDTO.id
                },
                callback: (res) => {
                    if (res) {
                        Toast.info('领取成功', 1.5, null, false)
                        setTimeout(() => {
                            this.onHeaderRefresh()
                        }, 1500)
                    }
                }
            })
        } else if (item.status == 3) {
            this.props.dispatch(NavigationActions.navigate({
                routeName: 'treasureDetail',
                params: {type: item.awardDTO.awardType, name: item.awardDTO.awardName}
            }))
        }else if(item.status == 5){
            this.props.dispatch(NavigationActions.navigate({
                routeName: 'amounts',
                params:{}
            }))
        }
    }
    renderCell = (info: Object) => {
        var item = info.item
        return <Item arrow="horizontal" key={info.index} wrap multipleLine onClick={() => {
            this.changLink(item)
        }}>
            <Flex style={{height: 40, marginLeft: 0}} wrap="wrap">
                <Flex.Item wrap="wrap" style={{alignItems: 'center', flex: 1.2}}><Brief
                    style={{color: '#333'}}>{timeString(item.hitTime, 'yyyy-MM-dd hh:mm')}</Brief></Flex.Item>
                <Flex.Item style={{alignItems: 'center', flex: 0.8}}><Brief
                    style={{color: '#333'}}>{item.awardDTO.awardName}</Brief></Flex.Item>
                <Flex.Item style={{alignItems: 'center', flex: 1.1}}><Brief
                    style={{color: '#333'}}>{item.awardDTO.awardType == 80 ? item.awardDTO.amount : item.awardDTO.amount / 1000000}</Brief></Flex.Item>
                <Flex.Item style={{alignItems: 'center', flex: 0.5}}><Brief
                    style={{color: '#2da4fd'}}>{this.setStartText(item)}</Brief></Flex.Item>
            </Flex>
        </Item>
    }

    render() {
        const {userInfo} = this.props
        return (
            <View style={styles.container}>
                <View style={{paddingTop: 0, backgroundColor: '#f7fafd'}}>
                    <Flex style={{height: 40}}>
                        <Flex.Item style={{alignItems: 'center'}}><Text style={{lineHeight: 40}}>中奖时间</Text></Flex.Item>
                        <Flex.Item style={{alignItems: 'center'}}><Text style={{lineHeight: 40}}>名称</Text></Flex.Item>
                        <Flex.Item style={{alignItems: 'center'}}><Text style={{lineHeight: 40}}>数量</Text></Flex.Item>
                        <Flex.Item style={{alignItems: 'center'}}><Text style={{lineHeight: 40}}>操作</Text></Flex.Item>
                    </Flex>
                </View>
                <List style={{marginBottom: 40}}>
                    <RefreshListView
                        data={this.props.prize.awrardList.data}
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
                </List>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 40
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
    text: {
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
    dice_1: {width: '100%', height: '999%'},
    dice_2: {width: '100%', height: '788%'},
    dice_3: {width: '100%', height: '588%'},
    dice_4: {width: '100%', height: '380%'},
    dice_5: {width: '100%', height: '150%'},
    dice_6: {width: '100%', transform: [{rotate: '180deg'}], height: '270%'},
    dice_t: {width: '100%', transform: [{rotate: '180deg'}], height: '470%'},
    dice_s: {width: '100%', transform: [{rotate: '180deg'}], height: '700%'},
    dice_e: {width: '100%', transform: [{rotate: '180deg'}], height: '950%'},
})


export default connect(({app, user, home, prize}) => ({...app, user, home, prize}))(prizeList)