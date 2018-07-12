import React, {Component} from 'react'
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, Vibration} from 'react-native'
import {connect} from 'react-redux'

import {Wave, Thumb, Touchable} from '../../components'
import {createAction, NavigationActions} from '../../utils'
import RefreshListView, {RefreshState} from '../../components/loadListView'
import {List, WhiteSpace, Button, Flex, Card, Toast,SegmentedControl,WingBlank} from 'antd-mobile'
import px2dp from '../../utils/px2dp'
import extraWallet from "../treasure/extraWallet";

const Item = List.Item
const Brief = Item.Brief

class amounts extends Component {
    static navigationOptions = {
        title: '我的礼金'
    }
    state = {
        refreshState: RefreshState.Idle,
        loaded: false,
        selectInorout:''
    }
    componentDidMount(){
        this.onHeaderRefresh()
    }
    onHeaderRefresh = () =>{
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
    onFooterRefresh = () =>{
        if (this.state.loaded) {
            this.setState({refreshState: RefreshState.FooterRefreshing, refreshType: 1}, function () {
                this.getCurrencyDetailList()
            })
        }
    }
    getCurrencyDetailList = () =>{
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
                            payWays: [3]
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
    keyExtractor = (item: any, index:number) =>{
        return index
    }
    renderCell = (info: Object) =>{
        var item = info.item
        return (
            <Item key={info.index} wrap multipleLine>
                <Flex style={{height: 40}} wrap="wrap">
                    <Flex.Item wrap="wrap" style={{alignItems: 'flex-start', flex:0.5}}>
                        {
                            item.inorout == true?<Image style={{width: px2dp(30), height:px2dp(30)}} source={require('../../images/income.png')} />
                                :
                                <Image style={{width: px2dp(30), height:px2dp(30)}} source={require('../../images/spending.png')} />
                        }
                    </Flex.Item>
                    <Flex.Item style={{alignItems: 'flex-start'}}><Brief style={{color: '#333'}}>{item.timeStr}</Brief></Flex.Item>
                    <Flex.Item style={{alignItems: 'flex-start'}}><Brief style={{color: '#333'}}>{item.title}</Brief></Flex.Item>
                    <Flex.Item style={{alignItems: 'flex-start'}}><Brief style={{color: '#333'}}>
                        {item.inorout == true? '+' +item.amount /1000000
                            :'-'+item.amount /1000000}
                    </Brief></Flex.Item>
                </Flex>
            </Item>
        )
    }
    getExtractForm = () =>{
        this.props.dispatch(NavigationActions.navigate({
            routeName: 'extraWallet',
            params: {}
        }))
    }
    handelChange = (val) =>{
        var selected;
        if(val == '收入'){
            selected = '1'
        }else if(val == '支出'){
            selected = '0'
        }else{
            selected = ''
        }
        this.setState({selectInorout: selected}, () => {
            this.onHeaderRefresh()
        })
    }
    render() {
        const {userInfo} = this.props
        return (
            <View style={styles.conatiner}>
                <View style={styles.btnConatiner}>
                    <SegmentedControl onValueChange={this.handelChange} style={{height:30,lineHeight:30}} values={['全部', '收入','支出']} />
                </View>
                <List style={{marginBottom:100}}>
                    <RefreshListView
                        data={this.props.treasure.currencyDetailList.data}
                        keyExtractor={this.keyExtractor}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this.onHeaderRefresh}
                        onFooterRefresh={this.onFooterRefresh}
                        renderItem={this.renderCell}
                        //可选
                        footerRefreshingText='正在载入更多...'
                        footerFailureText='我擦嘞，居然失败了 =.=!'
                        footerNoMoreDataText='-暂无更多数据-'
                        footerEmptyDataText='-好像什么东西都没有-'
                    />
                </List>
                <View style={{
                    position: 'absolute',
                    bottom:0,
                    left:0,
                    right:0,
                    width:'100%',
                    height:50,
                    alignItems:'center'
                }}>
                    <Flex style={{height:50, alignItems:'center'}}>
                        <Flex.Item onPress={() =>{
                            this.getExtractForm()
                        }} style={{alignItems:'center', backgroundColor:'#50a4f9'}}>
                            <Text style={{lineHeight:50, color:'#fff'}}>提取</Text>
                        </Flex.Item>
                    </Flex>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    conatiner:{
        flex:1
    },
    btnConatiner:{
        paddingLeft:40,
        paddingRight:40,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#ffffff'
    }
})
export default connect(({app, user,treasure,prize}) =>({...app, user, treasure,prize}))(amounts)