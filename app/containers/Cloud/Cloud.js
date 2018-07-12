import React, { Component } from 'react'
import {StyleSheet, View, ScrollView, Image, StatusBar, Platform, Dimensions, TouchableOpacity, Text, ImageBackground, Animated, Easing} from 'react-native'
import { connect } from 'react-redux'

import {Touchable, Thumb} from '../../components'
import { createAction, NavigationActions } from '../../utils'
import {Modal,NoticeBar, WhiteSpace, Icon, Flex, Button, Switch, Toast, List, Carousel} from 'antd-mobile';
import px2dp from "../../utils/px2dp";
import {timeString} from "../../utils/help";
const Item = List.Item

class Cloud extends Component {
    static navigationOptions = {
        title: '云上之巅',
        tabBarLabel: '云上之巅',
        tabBarIcon: ({ focused, tintColor }) => (
            <Image
                style={[styles.icon, { tintColor: focused ? tintColor : '' }]}
                source={focused? require('../../images/tabbar/yun_selected.png'): require('../../images/tabbar/yun_normal.png')}
            />
        ),
    }
    state = {
        head_height: 0,
    }
    componentDidMount() {
        var head_height = Dimensions.get('window').height / 3
        this.setState({head_height: head_height * 0.8})
        if(this.props.isLogin){
            this.getAwardCountTotal()
            this.getAwardCountCurrent()
            this.getEnergyList()
            this.getUserNum()
            this.getSysBanner()
        }
    }
    componentWillReceiveProps(props){
        if(props.tab === 'Cloud' && this.props.tab !== 'Cloud'){
            if(this.props.isLogin){
                console.log('Cloud')
                this.getAwardCountTotal()
                this.getAwardCountCurrent()
                this.getEnergyList()
                this.getUserNum()

            }else{
                this.getSysBanner()
            }
        }
    }
    getAwardCountTotal = () => {
        this.props.dispatch({
            type: 'cloud/getAwardCount',
            payload: {request: {activityType:1}}
        })
    }
    getAwardCountCurrent = () => {
        let date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)
        let startGetTime = date.getTime()
        let endGetTime = new Date().getTime()
        this.props.dispatch({
            type: 'cloud/getAwardCount',
            payload: {request :{activityType: 1, startGetTime: startGetTime, endGetTime: endGetTime}}
        })
    }
    getEnergyList = () =>{
        this.props.dispatch({
            type: 'cloud/getEnergyList',
            payload: {types:[30,31], top: 11}
        })
    }
    getUserNum = () => {
        this.props.dispatch({
            type: 'cloud/getUserNum'
        })
    }
    getSysBanner = () => {
        this.props.dispatch({
            type: 'cloud/getBanners',
            payload:{parentId: "21400117480217220",postStatus:"publish",pageSize:20,pageIndex:1}
        })
    }

    logout = () => {
        this.props.dispatch(createAction('app/logout')())
    }
    gotoLogin = () => {
        if(!this.props.isLogin){
            this.props.dispatch(NavigationActions.navigate({routeName: 'Login'}))
        }
    }
    getBalanceList (){
        if(this.props.cloud.bannerListC.length > 0) {
            this.props.dispatch(NavigationActions.navigate({routeName: 'bulletinList',params: {type: 2}}))
        }
    }
    render() {
        const {isLogin} = this.props
        return (
            <ScrollView>
                <View  style={styles.container}>
                    <TouchableOpacity onPress={this.gotoLogin}
                                      style={[styles.coupon_receive_wrapper, !isLogin ? styles.active : styles.unActive]}>
                    </TouchableOpacity>
                    <View style={{height: this.state.head_height}}>
                        <ImageBackground style={[styles.backgroundImage]} source={require('../../images/bg_yszd.png')} resizeMode='cover'>
                            <View style={{position: 'absolute',left: 0,
                                top: 20,
                                right: 0,
                                marginLeft: 15,
                                bottom: 0}}>
                                <Flex>
                                    <Image style={{width: 20,height: 20}} source={require('../../images/icon_yszd_dw.png')}/>
                                    <View style={{marginLeft: 10}}><Text style={{color: '#ffffff', fontSize: 15}}>云上之巅</Text></View>
                                </Flex>
                            </View>
                            <View style={{position: 'absolute',left: 0,
                                right: 0,
                                marginLeft: 15,
                                bottom: 30}}>
                                <Flex>
                                    <Image style={{width: 12,height: 16}} source={require('../../images/icon_yszd_rs.png')}/>
                                    <Flex.Item style={{marginLeft: 5}}>
                                        <Text style={{color: '#ffffff', fontSize: 15}}>{!isLogin ? '登录后查看' : this.props.cloud.accoutNum}</Text>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <Text style={{color: '#ffffff', fontSize: 15}}>云上之巅城市总人口数</Text>
                                    </Flex.Item>
                                </Flex>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={{paddingTop: 20, paddingLeft: 12, paddingRight: 12,width: '100%', height: 100}}>
                        <Flex>
                            <Flex.Item style={{marginLeft: 5,alignItems: 'center',}}>
                                <ImageBackground style={{width: '96%', height: '100%',alignItems: 'center', paddingRight: '4%'}} source={require('../../images/bg_jrhl.png')} resizeMode='cover'>
                                    <Text style={{color: '#fff', lineHeight: 25, marginTop: 15}}>今日挖宝获利次数</Text>
                                        <Text style={{color: '#fff', lineHeight: 25}}>{!isLogin ? '登录后查看' : this.props.cloud.currentCount}</Text>
                                </ImageBackground>
                            </Flex.Item>
                            <Flex.Item>
                                <ImageBackground style={{width: '96%', height: '100%', marginLeft: '4%',alignItems: 'center'}} source={require('../../images/bg_ljwb.png')} resizeMode='cover'>
                                    <Text style={{color: '#fff', lineHeight: 25,marginTop: 15}}>累计挖宝获利次数</Text>
                                    <Text style={{color: '#fff', lineHeight: 25}}>{!isLogin ? '登录后查看' : this.props.cloud.totalCount + 101933}</Text>
                                </ImageBackground>
                            </Flex.Item>
                        </Flex>
                    </View>
                    <View style={[styles.wab_home_wb_btn,{marginTop: 15,paddingTop: 10, paddingLeft: 12, paddingRight: 12,}]}>
                        <List style={{backgroundColor: '#2dbbfd'}}>
                            <Item
                                style={{backgroundColor: '#2dbbfd'}}
                                thumb={<Thumb style={{width: 35,
                                    height: 30, marginRight: 20}} img={require('../../images/pic_title_sqgg.png')}/>}
                                arrow="horizontal"
                                onClick={() => {
                                    this.getBalanceList()
                                }}
                            >
                                {
                                    this.props.cloud.bannerListC.length > 0 ?
                                        <Carousel
                                            vertical
                                            dots={false}
                                            dragging={false}
                                            swiping={false}
                                            autoplay
                                            infinite={this.props.cloud.bannerListC.length === 1 ? false : true}
                                        >
                                            {
                                                this.props.cloud.bannerListC.map(item =>
                                                    <Text style={{fontSize: 14, lineHeight: 33}} key={item}>{item.title}</Text>
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
                    <View style={{paddingTop: 10, paddingLeft: 12, paddingRight: 12,width: '100%'}}>
                        <View style={{marginTop: 10, alignItems: 'center',height: 35}}>
                            <Text style={{alignItems: 'center', fontSize: 15}}>挖宝能量排行榜</Text>
                        </View>
                        <View style={{backgroundColor: '#fff', width: '100%', padding: 0}}>
                            <ImageBackground style={{alignItems: 'center',width: '100%',height:px2dp(30)}} source={require('../../images/bg_list_title.png')}>
                                <Flex>
                                    <Flex.Item style={{alignItems: 'center'}}>
                                        <Text style={{color: '#fff',lineHeight: 32}}>排名</Text>
                                    </Flex.Item>
                                    <Flex.Item style={{alignItems: 'center'}}>
                                        <Text style={{color: '#fff',lineHeight: 32}}>居民</Text>
                                    </Flex.Item>
                                    <Flex.Item style={{alignItems: 'center'}}>
                                        <Text style={{color: '#fff',lineHeight: 32}}>能量值</Text>
                                    </Flex.Item>
                                </Flex>
                            </ImageBackground>
                        </View>
                        {
                            isLogin ? this.props.cloud.energyList.map((item, index) =>
                                <Flex key={index} style={{height: 35, borderColor: '#d6d7dc', borderBottomWidth: 1, backgroundColor: '#f7fafd'}}>
                                    <Flex.Item style={{alignItems: 'center'}}>
                                        {
                                            index+1 === 1 ?
                                                <Image style={{width: 26, height: 23}} source={{uri: 'https://cdn.sz.gzduobeibao.com/csc/img/icon_ph_1@2x.png'}}></Image>
                                                :
                                                index+1 === 2 ?
                                                    <Image style={{width: 26, height: 23}} source={{uri: 'https://cdn.sz.gzduobeibao.com/csc/img/icon_ph_2@2x.png'}}></Image>:
                                                    index+1 === 3 ?
                                                        <Image style={{width: 26, height: 23}} source={{uri: 'https://cdn.sz.gzduobeibao.com/csc/img/icon_ph_3@2x.png'}}></Image>:
                                                        <Text>{index+1}</Text>
                                        }
                                    </Flex.Item>
                                    <Flex.Item style={{alignItems: 'center'}}>
                                        <Text>{item.nickname}</Text>
                                    </Flex.Item>
                                    <Flex.Item style={{alignItems: 'center'}}>
                                        <Text>{item.balance /100}</Text>
                                    </Flex.Item>
                                </Flex>
                            )
                                :
                                <Flex style={{height: 35, borderColor: '#d6d7dc', borderBottomWidth: 1, backgroundColor: '#f7fafd'}}>
                                    <Flex.Item style={{alignItems: 'center'}}>
                                        <Text>登录后查看</Text>
                                    </Flex.Item>
                                </Flex>
                        }
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
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
        zIndex: 0,
    },
    icon: {
        width: 30,
        height: 30,
    },
    wab_home_wb_btn:{
        height: 45,
        width: '100%'
    },
})

export default connect(({app, home, cloud, prize}) => ({...app, home, cloud, prize}))(Cloud)