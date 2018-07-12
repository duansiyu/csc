import React, {Component} from 'react'
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, Vibration} from 'react-native'
import {connect} from 'react-redux'

import {Wave, Thumb, Touchable} from '../../components'
import {createAction, NavigationActions} from '../../utils'

import {List, WhiteSpace, Button, Flex, Card, ActionSheet, Toast, Modal} from 'antd-mobile'
import px2dp from "../../utils/px2dp"

import {timeString} from '../../utils/help'
import RefreshListView, {RefreshState} from '../../components/loadListView'
import cscTransform from "./cscTransform";

const Item = List.Item
const Brief = Item.Brief
const alert = Modal.alert

class treasureDetail extends Component {
    static navigationOptions = {
        title: '宝藏明细'
    }
    state = {
        refreshState: RefreshState.Idle,
        refreshType: 0,
        inorout: {'': '全部', 0: '支出', 1: '收入'},
        selectInorout: '',
        selectPayway: 103,
        selectAction: null,
        selectName: "",
        loaded: false
    }

    componentDidMount() {
        if (this.props.navigation.state.params) {
            if (this.props.navigation.state.params.type) {
                this.setState({
                    selectPayway: this.props.navigation.state.params.type,
                    selectName: this.props.navigation.state.params.name
                }, () => {
                    this.props.dispatch({
                        type: 'treasure/getCurrencyList',
                        payload: {
                            accountId: this.props.userInfo.accountCommonDTO.id
                        },
                    })
                    this.onHeaderRefresh()
                })
            }
        }
        this.props.dispatch({
            type: 'treasure/getCurrencyTypes',
            payload: {}
        })
    }

    componentWillReceiveProps(props) {
    }

    logout = () => {
        this.props.dispatch(createAction('app/logout')())
    }
    onHeaderRefresh = () => {
        this.setState({refreshState: RefreshState.HeaderRefreshing, refreshType: 0}, function () {
            this.props.dispatch({
                type: 'treasure/updataAction',
                payload: {currentPage: 1, currencyDetailList: {}},
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
            type: 'treasure/getCurrencyDetailList',
            payload: {
                command: {
                    rawRequest: {
                        currentPage: this.state.refreshType === 1 ? this.props.treasure.currentPage + 1 : this.props.treasure.currentPage,
                        pageSize: this.props.treasure.pageSize,
                        condition: {
                            accountId: this.props.userInfo.accountCommonDTO.id,
                            inorout: this.state.selectInorout,
                            payWays: [this.state.selectPayway]
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
    keyExtractor = (item: any, index: number) => {
        return index
    }
    renderCell = (info: Object) => {
        var item = info.item
        return <Item key={info.index} wrap multipleLine>
            <Flex style={{height: 40}} wrap="wrap">
                <Flex.Item wrap="wrap" style={{alignItems: 'flex-start', flex: 0.5}}>
                    {
                        item.inorout == '1' ? <Image style={{width: px2dp(30), height: px2dp(30)}}
                                                     source={require('../../images/icon_wbsr.png')}></Image>
                            :
                            <Image style={{width: px2dp(30), height: px2dp(30)}}
                                   source={require('../../images/icon_ZC.png')}></Image>
                    }
                </Flex.Item>
                <Flex.Item style={{alignItems: 'flex-start',}}><Brief
                    style={{color: '#333'}}>{item.timeStr}</Brief></Flex.Item>
                <Flex.Item style={{alignItems: 'flex-start',}}><Brief
                    style={{color: '#333'}}>{item.title}</Brief></Flex.Item>
                <Flex.Item style={{alignItems: 'flex-start',}}><Brief style={{color: '#333'}}>
                    {
                        item.inorout == '1' ? '+' + item.amount / 1000000
                            :
                            '-' + item.amount / 1000000
                    }
                </Brief></Flex.Item>
            </Flex>
        </Item>
    }
    showActionSheet = () => {
        const BUTTONS = ['全部', '支出', '收入', '取消']
        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                cancelButtonIndex: 3,
                maskClosable: true,
                'data-seed': 'logId',
            },
            (buttonIndex) => {
                var selectInorout;
                if (buttonIndex == 0) {
                    selectInorout = ''
                } else if (buttonIndex == 1) {
                    selectInorout = 0
                } else if (buttonIndex == 2) {
                    selectInorout = 1
                } else {
                    selectInorout = this.state.selectInorout
                }
                this.setState({selectInorout: selectInorout}, () => {
                    this.onHeaderRefresh()
                })
            });
    }
    showActionSheet1 = () => {
        console.log(this.props.treasure.currencyType)
        var BUTTONS = []
        this.props.treasure.currencyType.map(item => {
            BUTTONS.push(item.name)
        })
        BUTTONS.push('取消')
        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                cancelButtonIndex: BUTTONS.length - 1,
                maskClosable: true,
                'data-seed': 'logId',
            },
            (buttonIndex) => {
                console.log(buttonIndex)
                if (this.props.treasure.currencyType[buttonIndex]) {
                    this.setState({
                        selectName: BUTTONS[buttonIndex],
                        selectPayway: this.props.treasure.currencyType[buttonIndex].others
                    }, () => {
                        this.onHeaderRefresh()
                    })
                }
            })
    }
    getTransForm = () => {
        var currencyType = []
        this.props.treasure.currencyType.map(type => {
            if (type.others !== '103') {
                currencyType.push({label: type.name, value: type.others})
            }
        })
        this.props.dispatch(NavigationActions.navigate({
            routeName: 'transform',
            params: {
                type: `${this.state.selectPayway == 103 ? 100 : this.state.selectPayway}`,
                name: this.state.selectName,
                currencyType: currencyType
            }
        }))
    }
    getExtractForm = () => {
        var currencyType = []
        this.props.treasure.currencyType.map(type => {
            currencyType.push({label: type.name, value: type.others})
        })
        console.log(this.state.selectPayway)
        if(this.state.selectPayway == 103){
            this.props.dispatch(NavigationActions.navigate({
                routeName: 'cscTransform',
                params: {type: `${this.state.selectPayway}`, name: this.state.selectName}
            }))

        }else {
            Toast.info('功能尚未开通', 3, null, false)
        }
    }



    render() {
        const {userInfo} = this.props
        return (
            <View style={styles.container}>
                <View style={{paddingTop: 0, backgroundColor: '#f7fafd'}}>
                    <Flex style={{height: 40, alignItems: 'center'}}>
                        <Flex.Item onPressIn={() => {
                            this.showActionSheet()
                        }} style={{flex: 1, alignItems: 'flex-end'}}><Text
                            style={{lineHeight: 40}}>{this.state.inorout[this.state.selectInorout]}</Text></Flex.Item>
                        <Flex.Item onPressIn={() => {
                            this.showActionSheet()
                        }} style={{alignItems: 'flex-start'}}><Image source={require('../../images/btn_xiala_sj.png')}/></Flex.Item>
                        <Flex.Item onPressIn={() => {
                            this.showActionSheet1()
                        }} style={{flex: 1, alignItems: 'flex-end'}}><Text
                            style={{lineHeight: 40}}>{this.state.selectName}</Text></Flex.Item>
                        <Flex.Item onPressIn={() => {
                            this.showActionSheet1()
                        }} style={{alignItems: 'flex-start'}}><Image source={require('../../images/btn_xiala_sj.png')}/></Flex.Item>
                    </Flex>
                </View>
                <List style={{marginBottom: 80}}>
                    <RefreshListView
                        data={this.props.treasure.currencyDetailList.data}
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
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    height: 50,
                    alignItems: 'center'
                }}>
                    <Flex style={{height: 50, alignItems: 'center'}}>
                        <Flex.Item onPress={() => {
                            this.getExtractForm()
                        }} style={{alignItems: 'center', backgroundColor: '#50a4f9',}}><Text
                            style={{lineHeight: 50, color: '#fff'}}>提取</Text></Flex.Item>
                        <Flex.Item onPress={() => {
                            this.getTransForm()
                        }} style={{alignItems: 'center', backgroundColor: '#4184ff'}}><Text
                            style={{lineHeight: 50, color: '#fff'}}>转换</Text></Flex.Item>
                    </Flex>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
        //marginBottom: 80
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


export default connect(({app, user, home, treasure}) => ({...app, user, home, treasure}))(treasureDetail)