import React, {Component} from 'react'
import {StyleSheet, View, ScrollView, Image, StatusBar, Platform, Dimensions, TouchableOpacity, Text, ImageBackground, Animated, Easing, Linking} from 'react-native'
import {connect} from 'react-redux'
import {NavigationActions} from '../../utils'
import {Touchable, Thumb} from '../../components'
import {Modal,NoticeBar, WhiteSpace, Icon, Flex, Button, Switch, Toast, List, Carousel} from 'antd-mobile';
import Swiper from 'react-native-swiper';
import px2dp from "../../utils/px2dp"
import {width, unitWidth} from '../../utils/AdapterUtil'
import { timeString } from '../../utils/help'
import normal from '../../images/bg_home_nl.png'
import red from '../../images/bg_home_nl_red.png'
import ModalImg from '../../components/ModalImg'
import ModalPity from '../../components/ModalPity'

const Item = List.Item
const alert = Modal.alert

class Home extends Component {
    static navigationOptions = {
        title: '哇矿',
        tabBarLabel: '哇矿',
        tabBarIcon: ({focused, tintColor}) => (
            <Image
                style={[styles.icon, {tintColor: focused ? tintColor : ''}]}
                source={focused? require('../../images/tabbar/wb_selected.png'): require('../../images/tabbar/wb_normal.png')}
            />
        ),
    }
    state = {
        head_height: 0,
        RADIUS: 120,
        tags: [],
        windowWidth: 0,
        energy_height: 0,
        animatedValue: new Animated.Value(0),
        linkImg: true,
        prizes: [],
        prizesModal: false,
        prizePity: false,
        signModal: false,
        ODialogPrize: {
            // imgsrc: '../../images/pic-weizj.png',
            money:'元',
            btnText:'现金红包',
            prizeText: '99434299'
        }

    }

    componentDidMount() {
        //刷新令牌
        this.timer = setInterval(() =>{
            if (this.props.isLogin) {
                this.accessTokenRefresh()
        }},60000)
        this.timerAd = setInterval(() =>{
            if (this.props.isLogin) {
                this.getAwardResultRoll()
        }},120000)

        var head_height = Dimensions.get('window').height / 3
        this.setState({head_height: head_height * 2})
        this.setState({energy_height: this.state.head_height})
        this.setState({windowWidth: Dimensions.get('window').width})
        this.animate()
        if(this.props.isLogin){
            this.getjoinGame()
            this.signExit()
            this.getBalance()
            this.getAwardResultList()
            this.getAwardResultLists()
            this.getPrizeList(3)
            this.getAwardResultRoll()
        }else{
            this.props.dispatch({
                type: 'home/updateState',
                payload: {signExit: false,
                    energyNum: 0,
                    energy: [],
                    myenergy: [],
                    checked: false},
            })
        }
        this.props.dispatch({
            type: 'home/getVersionUpdata',
            payload: {},
        })
        this.getSysBanner()
        // setTimeout(() =>{
        //     this.alertModal()
        // },1500)
    }
    alertModal = async(res) =>{
        await this.homeSign(res)
    }
    homeSign = async (res) =>{
        if(res == false) {
            this.props.dispatch({
                type: 'home/homeSign',
                payload: {  accountId: this.props.userInfo.accountCommonDTO.id },
                callback: (res) => {
                    Toast.info("签到成功，+1能量", 3, () =>{
                        this.getBalance()
                        setTimeout(() =>{
                            this.joinGameExit()
                        },1000)
                    }, true)

                }
            })
        }else {
            this.joinGameExit()
        }
    }
    joinGameExit = () =>{
        this.props.dispatch({
            type: 'home/joinGameExit',
            payload: { accountId: this.props.userInfo.accountCommonDTO.id },
            callback: (res) => {
                this.setState({ signModal: !res})
                // if (res === false) {
                //
                //    setTimeout(() =>{
                //        console.log('l;s')
                //        this.setState({ signModal: true})
                //        alert('是否参与自动挖宝？', '', [
                //            { text: '不，谢谢'},
                //            {
                //                text: '立即参与',
                //                onPress: () =>
                //                    this.handleZanSwitchChange()
                //            },
                //        ])
                //    }, 1000)
                // }
            }
        })
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
        this.timerAd && clearInterval(this.timerAd);
    }
    componentWillReceiveProps(props){
       if(props.tab === 'Home' && this.props.tab !== 'Home'){
           if(this.props.isLogin){
               this.getjoinGame()
               this.signExitProps()
               this.getBalance()
               this.getAwardResultList()
               // this.getAwardResultLists()
               this.getPrizeList(3)
           }else{
           }
           this.getSysBanner()
       }
    }
    animate () {
        this.state.animatedValue.setValue(0)
        Animated.timing(
            this.state.animatedValue,
            {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear
            }
        ).start(() => this.animate())
    }
    accessTokenRefresh = () =>{
        this.props.dispatch({
            type: 'user/accessTokenRefresh',
            payload: {
                accessToken: this.props.userInfo.accessToken
            }
        })
    }
    createdEnergy = (data) => {
        let tags = []
        if (this.props.home.checked && data.length === 0){
            let tag = {}
            tag.id = ""
            tag.num = ""
            tag.name = '正在挖宝中...'
            tag.x = ((this.state.windowWidth / 2.6))
            tag.y = ((this.state.head_height - 120) / 2.1)
            tags.push(tag)
        }
        const dataLeng = data.length > 9 ? 9 : data.length
        data.forEach((item, index) => {
            let tag = {}
            let k = -1 + (1.5 * (index + 1) - 1) / (dataLeng)
            let a = Math.acos(k)
            let b = a * Math.sqrt(dataLeng * Math.PI)
            tag.id = item.id
            tag.num = item.awardDTO.amount / 1000000
            tag.name = item.awardDTO.awardName
            tag.x = ((this.state.windowWidth / 2.6)) + this.state.RADIUS * Math.sin(a) * Math.cos(b)
            tag.y = ((this.state.head_height - 120) / 2.2) + this.state.RADIUS * Math.sin(a) * Math.sin(b)
            tags.push(tag)
        })
        this.setState({ tags: tags})
    }
    getAwardResultList = () => {
        this.props.dispatch({
            type: 'home/getAwardResultList',
            payload: { request: { overdue: false, accept: false, limit: 8,activityType: 1,accountId: this.props.userInfo.accountCommonDTO.id}},
            callback: (res) => {
                this.createdEnergy(res)
            }
        })
    }
    signExit = () => {
        this.props.dispatch({
            type: 'home/signExit',
            payload: { accountId: this.props.userInfo.accountCommonDTO.id },
            callback: (res) =>{
                this.alertModal(res)
            }
        })
    }
    signExitProps = () =>{
        this.props.dispatch({
            type: 'home/signExit',
            payload: { accountId: this.props.userInfo.accountCommonDTO.id }
        })
    }
    getBalance = () => {
        this.props.dispatch({
            type: 'home/getBalance',
            payload: { types: [30, 31], accountId: this.props.userInfo.accountCommonDTO.id },
        })
    }
    getjoinGame = () => {
        this.props.dispatch({
            type: 'home/joinGame',
            payload: { accountId: this.props.userInfo.accountCommonDTO.id },
            callback: () =>{
            }
        })
    }
    getAwardResultLists = () => {
        Toast.hide()
        this.props.dispatch({
            type: 'home/getAwardResultLists',
            payload: { request: { accept: true, limit: 3,activityType: 1,accountId: this.props.userInfo.accountCommonDTO.id } },
        })
    }
    getSysBanner = () => {
        this.props.dispatch({
            type: 'cloud/getBanner',
            payload:{parentId: "214001175344714246",postStatus:"publish",pageSize:20,pageIndex:1}
        })
    }
    getAwardResultRoll = () =>{
        this.props.dispatch({
            type:'cloud/awardResultRoll',
            payload:{
                request:{
                    activityTypes:[2],
                    num: 5
                }
            }
        })
    }
    bindChargeEnergy = (item, index) => {
        if(!item.id){
            return
        }
        const param = {
            id: item.id
        }
        this.props.dispatch({
            type: 'home/receiveAward',
            payload: { ...param },
            callback: () => {
                const tags = this.state.tags
                var x = tags[index].x
                var y = tags[index].y
                tags.splice(index, 1)
                tags.forEach((item) => {
                    if(!item.x){
                        item.x = x
                        item.y = y
                    }
                })
                if(tags.length === 0){
                    this.getAwardResultList()
                }
                this.setState({ tags: tags })
                this.getAwardResultLists()
            }
        })
    }
    bindChargePrize = (item, index) => {
        // this.props.dispatch(NavigationActions.navigate({routeName: 'prizeDetail', params: {status: 80}}))
        // return;
        if(!item.id){
            return
        }
        this.props.dispatch({
            type: 'prize/getRedPacket',
            payload: { accountId: this.props.userInfo.accountCommonDTO.id,
                activityId: item.id },
            callback: (res) => {
                const prizes = this.state.prizes
                var x = prizes[index].x
                var y = prizes[index].y
                prizes.splice(index, 1)
                prizes.forEach((item) => {
                    if(!item.x){
                        item.x = x
                        item.y = y
                    }
                })
                if(prizes.length === 0){
                    this.getPrizeList(3)
                }
                this.setState({ prizes: prizes })
                if(res.data){//现金红包
                    if(res.data.awardDTO.awardType == 3){
                        this.setState({
                            prizesModal: true,
                            prizePity: false,
                            ODialogPrize: {
                                btnText:res.data.awardDTO.awardName,
                                money:'元',
                                prizeText: res.data.awardDTO.amount/1000000
                        }})
                    }else {
                        this.setState({
                            prizesModal: true,
                            prizePity: false,
                            ODialogPrize: {
                                btnText:'',
                                money:'',
                                prizeText: res.data.awardDTO.awardName
                        }})
                    }
                }else{
                    this.setState({prizePity: true})
                }
            }
        })
    }
    getPrizeList = (num) => {
        this.props.dispatch({
            type: 'prize/getPrizeList',
            payload: {
                accountId: this.props.userInfo.accountCommonDTO.id,
                num: 100
            },
            callback: (res) =>{
                console.log('res', res)
                this.createPrize(res)
            }
        })
    }
    createPrize = (data) => {
        let prizes = []
        var dataLength = data.length >= 8 ? 8 : data.length
        data.forEach((item, index) => {
            let prize = {}
            let k = -1 + (1.5 * (index + 1) - 1) / dataLength
            let a = Math.acos(k)
            let b = a * Math.sqrt(dataLength * Math.PI)
            prize.id = item
            prize.x = ((this.state.windowWidth / 2.6)) + this.state.RADIUS * Math.sin(a) * Math.cos(b)
            prize.y = ((this.state.head_height - 120) / 2.2) + this.state.RADIUS * Math.sin(a) * Math.sin(b)
            prizes.push(prize)
        })
        this.setState({prizes: prizes})
    }
    bindChargeSign = () => {
        if (this.props.home.signExit === true) {
           Toast.info("您今天已签到，请明日再来", 1.5, null, false)
        }else {
            this.props.dispatch({
                type: 'home/homeSign',
                payload: {  accountId: this.props.userInfo.accountCommonDTO.id },
                callback: (res) => {
                    Toast.info("恭喜签到成功，获得1能量", 1.5, null, true)
                    setTimeout(() => {
                        this.getBalance()
                    }, 2000)
                }
            })
        }
    }
    handleZanSwitchChange = () => {
        this.props.dispatch({
            type: 'home/joinGameExit',
            payload: { accountId: this.props.userInfo.accountCommonDTO.id },
            callback: (res) => {
                if (res === true) {
                    return Toast.info("您今天已参加游戏，请明日再来", 1.5, null, false)
                }
                this.props.dispatch(NavigationActions.navigate({routeName: 'Game'}))
            }
        })
    }
    gotoDetail = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'Detail'}))
    }
    gotoLogin = () => {
        if(!this.props.isLogin){
            this.props.dispatch(NavigationActions.navigate({routeName: 'Login'}))
        }
    }
    onClose = key => () => {
        this.setState({
            [key]: false
        })
    }
    bindPrize = () => {
        let data = this.props.prize.prizeResult.data
        if(data){
            if(data.awardDTO.awardType == 80){
                this.setState({
                    prizesModal: false
                })
                this.props.dispatch({
                    type:'prize/orderRedPacket',
                    payload:{
                        awardResultId: data.id,
                        accountId: this.props.userInfo.accountCommonDTO.id
                    },
                    callback: (res) =>{
                        // Toast.info("领取成功", 1.5, null, false)
                        // setTimeout(() => {
                            this.props.dispatch(NavigationActions.navigate({routeName: 'prizeDetail', params: {status: 80}}))
                        // }, 1500)
                    }
                })
            }else{
                this.props.dispatch({
                    type:'prize/financeRedPacket',
                    payload:{
                        awardResultId: data.id,
                        accountId: this.props.userInfo.accountCommonDTO.id
                    },
                    callback: (res) =>{
                        if(res){
                            this.setState({
                                prizesModal: false
                            })
                            Toast.info("领取成功", 1.5, null, false)
                            setTimeout(() => {
                                this.props.dispatch(NavigationActions.navigate({routeName: 'prizeList'}))
                            }, 1000)
                        }
                    }
                })
            }
        }else{
            this.setState({
                prizesModal: false
            })
        }
    }
    getBalanceList = () => {
        if(this.props.cloud.bannerList.length > 0){
            this.props.dispatch(NavigationActions.navigate({routeName: 'bulletinList', params: {type: 1}}))
        }
    }
    closeVersion = () => {
        this.props.dispatch({
            type:'home/updateState',
            payload:{
                updataVersion: false,
            }
        })
    }
    downloadApp = (url) => {
        Linking.openURL(url)
            .catch((err)=>{
                console.log('打开失败', err);
            });
    }
    render() {
        const {isLogin} = this.props
        const movingMargin = this.state.animatedValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, 6, 0]
        })
        var others = this.props.home.updataVersionInfo.others ?  JSON.parse(this.props.home.updataVersionInfo.others) : {}
        return (
            <ScrollView>
            <View style={styles.container}>
                {Platform.OS === 'android' ? <StatusBar backgroundColor={'#2591ff'}/> :
                    <StatusBar barStyle={'light-content'}/>}
                <TouchableOpacity onPress={this.gotoLogin}
                                  style={[styles.coupon_receive_wrapper, !isLogin ? styles.active : styles.unActive]}>
                </TouchableOpacity>
                {this.state.linkImg &&
                <NoticeBar style={{backgroundColor: '#4dcef9'}} marqueeProps={{
                    loop: true,
                    leading: 1,
                    trailing: 800,
                    style: {color: '#fff', paddingRight: '10%', paddingLeft: '10%'}
                }}>
                    能量越高挖宝越多 挖宝不会额外占用手机内存和电量 48小时内不领取宝藏将消失
                </NoticeBar>
                }
                <View style={[styles.wab_home_head,{height: this.state.head_height}]}>
                    <ImageBackground style={[styles.backgroundImage]} source={this.state.linkImg?normal: red} resizeMode='cover'>
                        <View style={[styles.wab_home_body]}>
                            {this.state.linkImg == true?
                            <View style={styles.wab_home_head_btn}>
                                <Flex>
                                    <Flex.Item>
                                        <Button size="small" onClick={this.bindChargeSign}
                                                style={styles.wab_home_btn_round}>
                                            {Platform.OS === 'android' ?
                                                <Image style={{width: 43, height: 43}}
                                                       source={require('../../images/btn_qiandao.png')}/>
                                                :
                                                <View style={{marginTop: -2}}><Image
                                                    style={{width: px2dp(15), height: px2dp(15)}}
                                                    source={require('../../images/btn_qiandao.png')}/></View>
                                            }
                                            <Text
                                                style={styles.wab_home_btn_round_text}> {this.props.home.signExit === true ? '已签到' : isLogin === false ? '签到' : ' 签到'}
                                            </Text>
                                        </Button>
                                    </Flex.Item>
                                    <Flex.Item style={{alignItems: 'flex-end'}} onPress={() => {
                                        this.props.dispatch(NavigationActions.navigate({routeName: 'Hoist'}))
                                    }}>
                                        {Platform.OS === 'android' ?
                                            <View style={{
                                                alignItems: 'flex-start', position: 'absolute',
                                                left: 42,
                                                top: 8,
                                                right: 0,
                                                bottom: 0,
                                                zIndex: 2
                                            }}>
                                                <Image style={{width: 30, height: 30}}
                                                       source={require('../../images/icon_nengliang.png')}/></View>
                                            :
                                            ''
                                        }
                                        <Button size="small" style={styles.wab_home_btn_left_round} onPress={() => {
                                            this.props.dispatch(NavigationActions.navigate({routeName: 'Hoist'}))
                                        }}>
                                            {Platform.OS === 'android' ?
                                                ''
                                                :
                                                <View style={{marginTop: -3}} onPress={() => {
                                                    this.props.dispatch(NavigationActions.navigate({routeName: 'Hoist'}))
                                                }}><Image style={{width: px2dp(20), height: px2dp(20)}}
                                                          source={require('../../images/icon_nengliang.png')}/></View>
                                            }
                                            <Text onPress={() => {
                                                this.props.dispatch(NavigationActions.navigate({routeName: 'Hoist'}))
                                            }}
                                                  style={styles.wab_home_btn_round_text_s}>{this.props.home.energyNum / 100}  </Text>
                                            <Text onPress={() => {
                                                this.props.dispatch(NavigationActions.navigate({routeName: 'Hoist'}))
                                            }} style={[styles.wab_home_btn_round_text, {
                                                lineHeight: 22,
                                                height: 25
                                            }]}>提升</Text>
                                        </Button>
                                    </Flex.Item>
                                </Flex>
                            </View>
                                :
                                <View style={styles.wab_home_head_no}></View>
                            }
                            <View style={[{height: this.state.head_height - 120}]}>
                                { !this.state.linkImg && <TouchableOpacity onPress={() => {
                                    this.setState({linkImg: !this.state.linkImg})
                                }} style={{alignItems: 'center',width: 30, height: 30,position: 'absolute', left: 10, top: '40%'}}>
                                    { Platform.OS === 'android' ?
                                    <Image style={{width:32, height:16}} source={require('../../images/left.gif')}/>
                                        :
                                    <Image style={{width:32, height:16}} source={require('../../images/left.gif')}/>
                                    }
                                </TouchableOpacity>}
                                {
                                    Platform.OS === 'android' ?
                                        this.state.linkImg  ?
                                            this.state.tags.map((item, index) =>
                                                index < 8 ?
                                                    <TouchableOpacity style={{ position: 'absolute', width: 50,
                                                        height: 80,top: item.x, left: item.y,alignItems: 'center'}} onPressIn={() => {
                                                        this.bindChargeEnergy(item,index)
                                                    }}>
                                                    <Animated.View style={{marginTop: movingMargin}}>
                                                        <ImageBackground style={{ width: 53,
                                                            height: 50,
                                                            alignItems: 'center'}} source={require('../../images/icon_NL.png')}>
                                                            <View>
                                                                <Text style={{ fontSize: 10,
                                                                color: '#333333',
                                                                paddingTop: 18,alignItems: 'center'}}>{item.num}
                                                                </Text></View>
                                                            <View><Text style={{marginLeft: 4,fontSize: 13,
                                                                color: '#fff',
                                                                fontWeight: 'bold',marginTop: 13}}>{item.name}</Text></View>
                                                        </ImageBackground>
                                                    </Animated.View>
                                                    </TouchableOpacity>: null
                                            )
                                            :
                                            this.state.prizes.map((item, index) =>
                                                index < 3 ?
                                                    <TouchableOpacity disabled={this.props.prize.btnDisabled} key={index} style={{ position: 'absolute',alignItems: 'center', width: 50,
                                                        height: 80 , top: item.x, left: item.y,alignItems: 'center'}} onPressIn={() => {
                                                        this.bindChargePrize(item,index)
                                                    }}>
                                                        <Animated.View style={{marginTop: movingMargin}}>
                                                            <ImageBackground  style={{ width: 50,
                                                                height: 50,
                                                                alignItems: 'center'}} source={require('../../images/icon_HB.png')}>
                                                            </ImageBackground>
                                                        </Animated.View>
                                                    </TouchableOpacity>: null
                                            )

                                        :
                                        this.state.linkImg  ?
                                            this.state.tags.map((item, index) =>
                                                index < 8 ?
                                                    <TouchableOpacity onPressIn={() => {
                                                        this.bindChargeEnergy(item,index)
                                                    }}>
                                                        <Animated.View style={{ position: 'absolute',alignItems: 'center', width: 50,
                                                            height: 80, top: item.x, left: item.y,  marginTop: movingMargin}} key={item.id}>
                                                            <ImageBackground style={[styles.energy_ball]} source={require('../../images/icon_NL.png')} resizeMode='cover' key={item.id}>
                                                                <View><Text style={styles.energy_num}>{item.num}</Text></View>
                                                                <View><Text style={styles.energy_name}>{item.name}</Text></View>
                                                            </ImageBackground> </Animated.View></TouchableOpacity>: null
                                            ) :
                                            this.state.prizes.map((item, index) =>
                                                index < 3 ?
                                                    <TouchableOpacity disabled={this.props.prize.btnDisabled} onPressIn={() => {
                                                        this.bindChargePrize(item,index)
                                                    }}>
                                                        <Animated.View style={{ position: 'absolute',alignItems: 'center', width: 50,
                                                            height: 50 , top: item.x, left: item.y,  marginTop: movingMargin}} key={item.id}>
                                                            <ImageBackground style={[styles.energy_ball]} source={require('../../images/icon_HB.png')} resizeMode='cover' key={item.id}>
                                                            </ImageBackground> </Animated.View></TouchableOpacity>: null
                                            )
                                }
                                { this.state.linkImg && <TouchableOpacity onPress={() => {
                                    this.setState({linkImg: !this.state.linkImg})
                                }} style={{alignItems: 'center',width: 30, height: 30,position: 'absolute', right: 10, top: '40%'}}>
                                    { Platform.OS === 'android' ?
                                        <Image style={{width:32, height:16}} source={require('../../images/right.gif')}/>
                                        :
                                        <Image style={{width:32, height:16}} source={require('../../images/right.gif')}/>
                                    }
                                </TouchableOpacity>}
                            </View>
                            <View style={{marginTop: 0}}>
                                <Flex>
                                    { this.state.linkImg ?
                                        <Flex.Item style={{alignItems: 'flex-start', paddingLeft: 20, flex: 0.7}} onPress={() => {
                                            this.props.dispatch(NavigationActions.navigate({routeName: 'IncomeIndex'}))
                                        }}>
                                            <Image style={{width:px2dp(40),height:px2dp(40), marginLeft: 4}} source={require('../../images/icon_WDSY.png')}/>
                                            <Text style={{marginTop: 3,alignItems: 'center',fontSize: 13,}}>我的收益</Text>
                                        </Flex.Item>
                                        :
                                        <Flex.Item style={{alignItems: 'flex-start', paddingLeft: 20, flex: 1}} onPress={() => {
                                            this.props.dispatch(NavigationActions.navigate({routeName: 'prizeList'}))
                                        }}>
                                            <Image style={{width:px2dp(40),height:px2dp(40), marginLeft: 4}} source={require('../../images/icon_WDLP.png')}/>
                                            <Text style={{marginTop: 3,alignItems: 'center',fontSize: 13,}}>我的礼品</Text>
                                        </Flex.Item>
                                    }
                                    { this.state.linkImg &&
                                        <Flex.Item style={{alignItems: 'flex-start'}} onPress={() => {
                                            this.props.dispatch(NavigationActions.navigate({routeName: 'Treasure'}))
                                        }}>
                                            <Image style={{width: px2dp(40), height: px2dp(40)}}
                                                   source={require('../../images/icon_WDBZ.png')}/>
                                            {Platform.OS === 'android' ?
                                                <Text style={{
                                                    marginTop: 3,
                                                    alignItems: 'center',
                                                    marginLeft: 0,
                                                    fontSize: 13,
                                                }}>我的宝藏</Text>
                                                :
                                                <Text style={{
                                                    marginTop: 3,
                                                    alignItems: 'center',
                                                    marginLeft: -7,
                                                    fontSize: 13,
                                                }}>我的宝藏</Text>
                                            }
                                        </Flex.Item>
                                    }
                                    <Flex.Item style={{alignItems: 'flex-end', marginRight: 10}} onPress={() => {
                                        this.props.dispatch(NavigationActions.navigate({routeName: 'friend'}))
                                    }}>
                                        <Image style={{width:px2dp(40),height:px2dp(40),marginRight: 10}} source={require('../../images/icon_YQHY.png')}/>
                                        <Text style={{marginTop: 3,alignItems: 'center',fontSize: 13,marginRight: 5}}>邀请好友</Text>
                                    </Flex.Item>
                                </Flex>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
                {!this.state.linkImg && this.props.cloud.awardResult.length>0 &&
                <View style={[styles.wab_home_wb_btn]}>
                    <List>
                        <Item
                            thumb={<Thumb style={{width: 20,
                                height: 20, marginRight: 20}} img={require('../../images/icon-lb.png')}/>}
                        >
                            <Swiper
                                horizontal={false}
                                autoplay
                                showsButtons={false}
                                showsPagination={false}
                                autoplayTimeout={3}
                            >
                                {
                                    this.props.cloud.awardResult.map(item =>
                                        <Text style={{fontSize: 14, lineHeight: 30}} key={item}>恭喜昵称<Text style={{color:'#039BE5'}}>{item.nickname}</Text> {item.displayTime}前获得{item.awardDTO.awardName}</Text>
                                    )
                                }
                            </Swiper>

                        </Item>
                    </List>
                </View>
                }
                <View style={styles.wab_home_wb_btn}>
                    <Flex style={{alignItems:'center', justifyContent:'center'}}>
                        <Flex.Item>
                            <Text style={{lineHeight: 45, marginLeft: 5}}>参与挖宝</Text>
                        </Flex.Item>
                        <Flex.Item style={{alignItems: 'flex-end', marginRight: 10,marginTop:6}}>
                            {Platform.OS === 'android' ?
                                <Switch checked={this.props.home.checked} color="#2591ff" onChange={(checked) => {
                                    this.handleZanSwitchChange()
                                }}/>
                                :
                                <Text style={{lineHeight: 45}}><Switch checked={this.props.home.checked} color="#2591ff" onChange={(checked) => {
                            this.handleZanSwitchChange()
                            }}/></Text>

                            }
                        </Flex.Item>
                    </Flex>
                </View>
                <View style={styles.wab_home_wb_btn}>
                    <List>
                        <Item
                            thumb={<Thumb style={{width: 30,
                                height: 13, marginRight: 20}} img={require('../../images/home_icon_GG.png')}/>}
                            arrow="horizontal"
                            onClick={() => {
                                this.getBalanceList()
                            }}
                        >
                            {
                                this.props.cloud.bannerList.length > 0 ?
                                    <Carousel
                                        vertical
                                        dots={false}
                                        dragging={false}
                                        swiping={false}
                                        autoplay
                                        infinite={this.props.cloud.bannerList.length === 1 ? false : true}
                                    >
                                        {
                                            this.props.cloud.bannerList.map(item =>
                                                <Text style={{fontSize: 14, lineHeight: 20}} key={item}>{item.title}</Text>
                                            )
                                        }
                                    </Carousel>
                                    :
                                    <Text style={{fontSize: 14}}>暂无公告</Text>
                            }

                            {/*<Text style={{fontSize: 14}}>{this.props.cloud.bannerList[0] ? this.props.cloud.bannerList[0].title : ''}</Text>*/}
                        </Item>
                    </List>
                </View>
                <View style={{backgroundColor: '#fff', width: '100%', padding: 10}}>
                     <ImageBackground style={{alignItems: 'center',width: '100%',height:px2dp(30)}} source={require('../../images/bg_list_title.png')}>
                         <Text style={{alignItems: 'center', color: '#fff', lineHeight: 30}}>挖到宝藏</Text>
                     </ImageBackground>
                    {
                        this.props.home.myenergy.map((item, index) =>
                            <Flex key={index} style={{height: 35, borderColor: '#d6d7dc', borderBottomWidth: 1, backgroundColor: '#f7fafd'}}>
                                <Flex.Item style={{alignItems: 'center', flex: 0.6}}>
                                    <Text>获得</Text>
                                </Flex.Item>
                                <Flex.Item style={{alignItems: 'center'}}>
                                    <Text style={{color: '#d63a33'}}>{item.awardDTO.amount / 1000000}<Text style={{color: '#333333'}}>  {item.awardDTO.awardName}</Text></Text>
                                </Flex.Item>
                                <Flex.Item style={{alignItems: 'center'}}>
                                    <Text>{timeString(item.getTime, 'MM-dd hh:mm')}</Text>
                                </Flex.Item>
                            </Flex>
                        )
                    }
                    <TouchableOpacity onPressIn={() => {
                        this.props.dispatch(NavigationActions.navigate({routeName: 'Treasure'}))
                    }}>
                        {isLogin ?
                            <View style={{alignItems: 'center', padding: 20}}><Text
                                style={{color: '#A6A6A6'}}>{this.props.home.myenergy.length > 0 ? '查看更多宝藏' : '暂无数据'}</Text></View>

                            :
                            <View style={{alignItems: 'center', padding: 20}}><Text
                                style={{color: '#A6A6A6'}}>登录后查看</Text></View>
                        }
                    </TouchableOpacity>
                </View>
            </View>
            {/*<Modal*/}
                {/*visible={this.state.prizesModal}*/}
                {/*transparent*/}
                {/*maskClosable={false}*/}
                {/*onClose={this.onClose('prizesModal')}*/}
            {/*>*/}
                {/*<View style={{backgroundColor: '#fff',marginLeft: -40, marginRight: -40, marginBottom: -40, marginTop: -40}}>*/}
                    {/*<View style={{padding: 25}}>*/}
                        {/*<Image style={{width: '100%', height: px2dp(200)}}*/}
                               {/*source={this.props.prize.prizeResult.data ? require('../../images/pic-zhongjiang.png') : require('../../images/pic-weizj.png')}/>*/}
                        {/*<View style={{alignItems: 'center'}}>*/}
                            {/*<ImageBackground style={{paddingRight: 40, marginLeft: 40, alignItems: 'center', height: 50 , width: '100%'}} source={require('../../images/pic_jiangpin.png')} resizeMode='cover'>*/}
                                {/*<Text style={{fontSize: 20, color: '#ff7241',lineHeight: 50}}>{this.state.ODialogPrize.prizeText}</Text>*/}
                            {/*</ImageBackground>*/}
                            {/*<View style={{marginTop: 12, marginBottom: 15, width: '100%'}}>*/}
                                {/*<Button style={{backgroundColor: '#ffce1c', marginRight: 10, marginLeft: 10}} type="primary" onClick={this.bindPrize}>{this.state.ODialogPrize.btnText}</Button>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                    {/*<TouchableOpacity style={{position: 'absolute', right: 35, top: 30}} onPress={() => {*/}
                        {/*this.setState({prizesModal: false})*/}
                    {/*}}>*/}
                        {/*<Image style={{width: px2dp(14), height: px2dp(14)}}*/}
                               {/*source={require('../../images/lingjiang_icon_guanbi.png')}/>*/}
                    {/*</TouchableOpacity>*/}
                {/*</View>*/}
            {/*</Modal>*/}
            <Modal
                visible={this.props.home.updataVersion}
                transparent
                maskClosable={false}
                title="发现新版本"
                footer={others.isForceUpdate === false ? [
                    { text: '取消', onPress: () => { this.closeVersion()}},
                    { text: '去下载', onPress: () => { this.downloadApp(Platform.OS === 'android' ? others.downloadUrl : others.qrCodeDownloadUrl) } }
                    ]
                    :
                    [
                      { text: '去下载', onPress: () => { this.downloadApp(Platform.OS === 'android' ? others.downloadUrl : others.qrCodeDownloadUrl) } }
                    ]}
                >
                <View style={{padding: 25}}>
                    <Text>{this.props.home.updataVersionInfo.description}</Text>
                </View>
            </Modal>
            <Modal
                visible={this.state.signModal}
                transparent
                maskClosable={false}
                footer={
                    [
                        { text: '不，谢谢', style:{color:'#999', fontSize: unitWidth * 34}, onPress:() => this.setState({signModal: false})},
                        {
                            text: '立即参与',
                            style:{fontSize: unitWidth * 34},
                            onPress: () =>
                                this.setState({signModal: false},() =>{
                                    this.handleZanSwitchChange()
                                })
                        },
                    ]
                }
            >
                <View style={{backgroundColor: '#fff',marginLeft: -40, marginRight: -40, marginTop: -45}}>
                    <Image resizeMode='contain' style={{width:'100%',height: unitWidth * 228}} source={require('../../images/bj_wanbaotishi.png')}></Image>
                </View>
                <Text style={{textAlign:'center', fontSize: unitWidth* 36 , color:'#333',justifyContent:'center',paddingTop: unitWidth* 10, paddingBottom: unitWidth *10}}>是否参与自动挖宝？</Text>
                {/*<View style={{borderTopColor: '#e5e5e5', borderTopWidth: 1*unitWidth, flexDirection:'row'}}>*/}
                    {/*<View style={{flex:1}}><Text style={{color:'#999', fontSize: unitWidth * 34}}>不，谢谢</Text></View>*/}
                    {/*<View style={{flex:1,borderLeftColor:'#e5e5e5',borderLeftWidth: 1*unitWidth}}><Text style={{color:'#2da4fd', fontSize: unitWidth * 34}}>立即参与</Text></View>*/}
                {/*</View>*/}
            </Modal>
                {this.props.prize.prizeResult.data ?
                    <ModalImg
                        ODialogPrize={this.state.ODialogPrize}
                        visible={this.state.prizesModal}
                        bindPrize={this.bindPrize}
                        onCancel={() => this.setState({prizesModal: false})}
                    />
                    :
                    <ModalPity
                        visible={this.state.prizePity}
                        onCancel={() => this.setState({prizePity: false})}
                    />
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    wab_home_content:{
    },
    wab_home_wb_btn:{
        height: 45,
        width: '100%',
        backgroundColor: '#fff',
        paddingLeft: 2,
        paddingRight: 2
    },
    wab_home_bu:{
      borderColor:'#d6d7dc',
      borderBottomWidth:1
    },
    demo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 30
    },
    energy_ball: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        // position: 'absolute',
        // alignItems: 'center'
    },
    energy_num:{
        fontSize: 10,
        color: '#333333',
        paddingTop: 18
    },
    energy_name:{
        paddingTop: 18,
        fontSize: 13,
        color: '#fff',
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 40
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        // resizeMode: Image.resizeMode.contain,
        height: '100%',
        width: Dimensions.get('window').width
    },
    wab_home_head_btn: {
        paddingTop: 5,
        paddingLeft: 10,
    },
    wab_home_head_no:{
      paddingTop:50
    },
    wab_home_btn_round:{
        borderRadius: 50,
        height: 40,
        width: '60%'
    },
    wab_home_btn_round_text:{
        color: '#2da4fd',
        fontSize: 13,
        fontWeight: 'bold'
    },
    wab_home_btn_left_round: {
        borderRadius: 50,
        height: 45,
        width: '80%',
        paddingLeft: 5
},
    wab_home_btn_round_text_s: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff7241',
        lineHeight: 45,
        paddingRight: 3,
        marginRight: 10
    },
    wab_home_body: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 3
    },
    wab_home_btn_right_round:{
        borderRadius: 50,
        width: 60,
        borderColor: '#2591ff',
        alignItems: 'center',
        borderWidth: 1,
        marginTop: -3
    },
    wab_home_head: {
        //position: 'absolute'
    },
    coupon_receive_wrapper: {
        display: 'none',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '150%',
        zIndex: 3
    },
    active: {
        display: 'flex'
    },
    unActive: {
        display: 'none',
        zIndex: 0
    },
    icon: {
        width: 30,
        height: 30,
    },
})
export default connect(({app, home, cloud, prize}) => ({...app, home, cloud, prize}))(Home)
