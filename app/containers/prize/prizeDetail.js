import React, {Component} from 'react'
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, Vibration} from 'react-native'
import {connect} from 'react-redux'

import {Wave, Thumb, Touchable} from '../../components'
import {createAction, NavigationActions} from '../../utils'

import {List, WhiteSpace, Button, Flex, Card, Steps, Modal, Toast} from 'antd-mobile'
import px2dp from "../../utils/px2dp"

import { timeString } from '../../utils/help'
const Item = List.Item
const Brief = Item.Brief
const Step = Steps.Step
const alert = Modal.alert
class prizeDetail extends Component {
    static navigationOptions = {
        title: '订单详情'
    }
    state = {
        item: null,
        getTime: null,
        addItem: {},
        status: 80, //80表示待领取  2详情
        orderDetail:{},
        Logistics: {},
        orderState:2,
        orderArray:{1:'待添加地址', 2:'待发货', 6:'已发货', 7:'已收货'},
        expressName:'暂无',
        awardDTO: ""
    }

    componentDidMount() {
        this.props.dispatch({
            type:'prize/updateState',
            payload:{
                btnDisabled: false
            }
        })
        this.setState({status: this.props.navigation.state.params.status},() => {
            if(this.props.navigation.state.params.item){
                this.setState({addItem: this.props.navigation.state.params.item},() => {
                })
            }else{
                this.selectByUserId()
            }
            let data = this.props.prize.prizeResult.data
            console.log('prizeResult',data)
            if(data){
                this.setState({item: data,awardDTO: data.awardDTO,getTime: timeString(data.hitTime, 'yyyy-MM-dd hh:mm')},() => {
                    //if(this.state.status == 2){
                    this.getOrderDetail()
                    //}
                })
            }
            this.getRealInfo()
        })
    }
    componentWillReceiveProps(props){
        if(props.prize.selectAdd.receiver){
            this.setState({addItem: props.prize.selectAdd},() => {
            })
        }else{
        }
    }
    selectByUserId = () => {
        this.props.dispatch({
            type: 'prize/selectByUserId',
            payload: {
                userId: this.props.userInfo.accountCommonDTO.id
            },
            callback: (res) => {
                this.setState({addItem: res})
            }
        })
    }
    getOrderDetail = ()  => {
        this.props.dispatch(({
            type: 'prize/getOrderDetail',
            payload: {
                thirdNo: this.state.item.id
            },
            callback:(res,addressDTO,orderDetail) =>{
                console.log(res,orderDetail)
                if(orderDetail){
                    this.setState({
                        orderDetail: orderDetail,
                    },() =>{
                        if(orderDetail.orderState){
                            this.setState({orderState: orderDetail.orderState})
                        }
                        if(orderDetail.orderState == '6' || orderDetail.orderState == '7'){
                            this.getLogisticsMessage()
                        }
                        if(addressDTO){
                            this.setState({addItem: addressDTO})
                        }
                    })
                }
            }
        }))
    }
    getRealInfo = () => {
        this.props.dispatch(({
            type: 'user/getRealInfo',
            payload: {
                userId: this.props.userInfo.accountCommonDTO.id
            }
        }))
    }
    //物流信息
    getLogisticsMessage = () => {
        this.props.dispatch({
            type: 'prize/getLogisticsMessage',
            payload:{
                type: this.state.orderDetail.transportType || '',
                deliverNumber: this.state.orderDetail.trackingNumber || ''
            },
            callback:(res) =>{
                console.log('Logistics', res)
                this.setState({Logistics: res})
            }
        })
    }
    UpdateaddressSubmit = () => {
        if(!this.state.addItem.receiver){
            Toast.info('请选择收货地址', 1.5, null, false)
            return
        }
        let data = this.state.addItem
        var param = {
            command: {
                orderId: this.state.orderDetail.id,
                receiver: data.receiver,
                mobile: data.mobile,
                location: data.detail,
                accountId: this.props.userInfo.accountCommonDTO.id,
                nickname: this.props.userInfo.accountCommonDTO.nickname
            }
        }
        this.props.dispatch({
            type: 'prize/updateOrderAddress',
            payload: {...param},
            callback: () => {
                setTimeout(() => {
                    if(this.props.navigation.state.params.history){
                        this.props.dispatch(NavigationActions.back())
                    }else{
                        this.props.navigation.replace('prizeList')
                    }
                }, 1500)
            }
        })
        // this.props.dispatch({
        //     type:'prize/orderRedPacket',
        //     payload:{
        //         awardResultId: this.state.item.id,
        //         accountId: this.props.userInfo.accountCommonDTO.id
        //     },
        //     callback: (res) =>{
        //
        //     }
        // })
    }
    logout = () => {
        if (!this.props.user.realInfo.identityNum) {
            alert('提示', '您还没有实名', [
                { text: '取消', onPress: () => console.log('cancel')},
                {
                    text: '马上实名',
                    onPress: () =>
                        this.props.dispatch(NavigationActions.navigate({routeName: 'SetRealName',params: {history: 'prize'}}))
                },
            ])
            return false
        }
    }
    render() {
        const {userInfo} = this.props

        return (
            <ScrollView>
                <View style={styles.container}>
                    <TouchableOpacity onPress={this.logout}
                                      style={[styles.coupon_receive_wrapper, !this.props.user.realInfo.identityNum ? styles.active : styles.unActive]}>
                    </TouchableOpacity>
                    {
                        <View style={{paddingTop: 10, backgroundColor: '#f7fafd'}}>
                            { this.state.orderDetail.orderState == 1 ?
                                this.state.addItem.receiver ?
                                    <Item onClick={() => {
                                        this.props.dispatch(NavigationActions.navigate({routeName: 'addressList'}))
                                    }}multipleLine arrow="horizontal" thumb={<Thumb
                                        img={{uri: 'https://cdn.sz.gzduobeibao.com/csc/img/icon-dizhi@2x.png'}}/>}>
                                        <Brief>收货人:    {this.state.addItem.receiver}    {this.state.addItem.mobile}</Brief><Brief>收货地址：{this.state.addItem.detail}</Brief>
                                    </Item>
                                    :
                                    <Item onClick={() => {
                                        this.props.dispatch(NavigationActions.navigate({routeName: 'addressList'}))
                                    }}extra="选择收货地址" arrow="horizontal" align="middle" thumb={<Thumb
                                        img={{uri: 'https://cdn.sz.gzduobeibao.com/csc/img/icon-dizhi@2x.png'}}/>} multipleLine>
                                    </Item>
                                :
                                this.state.addItem.receiver ?
                                    <Item multipleLine thumb={<Thumb
                                        img={{uri: 'https://cdn.sz.gzduobeibao.com/csc/img/icon-dizhi@2x.png'}}/>}>
                                        <Brief>收货人:    {this.state.addItem.receiver}    {this.state.addItem.mobile}</Brief><Brief>收货地址：{this.state.addItem.location}</Brief>
                                    </Item> :
                                    <Item multipleLine thumb={<Thumb
                                        img={{uri: 'https://cdn.sz.gzduobeibao.com/csc/img/icon-dizhi@2x.png'}}/>}>
                                        <Brief>无地址信息</Brief>
                                    </Item>
                            }
                        </View>
                    }
                    <View style={{marginTop: 10}}>
                        <List>
                            <Item extra={<Text style={{fontSize: 14}}>{this.state.orderDetail.id}</Text>}>订单号</Item>
                            <Item extra={this.state.orderArray[this.state.orderState]}>{this.state.orderDetail.createdAt ? timeString(this.state.orderDetail.createdAt,'yyyy-MM-dd hh:mm'): ''}</Item>
                        </List>
                        <Card full>
                            <Card.Header
                                title={<Brief style={{marginTop: -30}}>{this.state.awardDTO  ? this.state.awardDTO.awardName : ''}</Brief>}
                                thumbStyle={{width: 105, height: 79}}
                                thumb="https://cdn.sz.gzduobeibao.com/csc/img/sp-moren@2x.png"
                            />
                        </Card>
                        <List>
                            <Item extra={`共${this.state.awardDTO ? this.state.awardDTO.amount : '1'}件商品`}></Item>
                        </List>
                    </View>
                    { this.state.orderDetail.orderState == '6' || this.state.orderDetail.orderState == '7' ?
                        <View style={{marginTop: 10}}>
                            <List>
                                <Item extra={<Text style={{fontSize: 14}}>{this.state.orderDetail && this.state.orderDetail.trackingNumber ? `${this.state.orderDetail.trackingNumber}` : '暂无'}</Text>}><Brief style={{fontSize: 14}}>物流公司: {this.state.orderDetail.transportName? this.state.orderDetail.transportName:'暂无'}</Brief></Item>
                            </List>
                        </View> : <View></View>
                    }
                    { this.state.orderDetail.orderState == '1' &&
                    <View style={{padding: 30}}>
                        <Button type="primary" style={styles.class_but} disabled={this.props.prize.btnDisabled} onClick={() => {
                            this.UpdateaddressSubmit()
                        }}>确定</Button>
                    </View>
                    }
                    <View style={{marginLeft: 10, marginTop: 20, paddingRight: 34,flexWrap:'wrap'}}>
                        {
                            this.state.Logistics.resultListDTO ?
                                <Steps size="small" >
                                    {
                                        this.state.Logistics.resultListDTO.map((item, index) =>{
                                            if(!item.time){
                                                return <Step key={index} directio="vertical" status="process" title={<Text style={{color:'#222',fontSize:14}}>{item.status}</Text>} />
                                            }
                                            return  <Step key={index} directio="vertical" status="process" title={item.time} description={<Brief style={{paddingRight: 10, marginRight: 10,flexWrap:'wrap'}}>{item.status}</Brief>} />
                                        })
                                    }
                                </Steps>
                                : <Text></Text>
                        }
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
    unActive: {
        display: 'none',
        zIndex: 0,
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


export default connect(({app, user, home, prize}) => ({...app, user, home, prize}))(prizeDetail)