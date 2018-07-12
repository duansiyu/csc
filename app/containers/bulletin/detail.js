import React, { Component } from 'react'
import {StyleSheet, Clipboard,View, ScrollView, WebView,Image, StatusBar, Platform, Dimensions, TouchableOpacity, Text, ImageBackground, Animated, Easing} from 'react-native'
import { connect } from 'react-redux'
import {Touchable, Thumb, EmText} from '../../components'
import { createAction, NavigationActions } from '../../utils'
import {Modal,NoticeBar, WhiteSpace, Icon, Flex, Button, Switch, Toast, List} from 'antd-mobile'
import px2dp from "../../utils/px2dp";

var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window')

class bulletinDetail extends Component {
    static navigationOptions = {
        title: '公告详情',
    }
    state = {

    }
    componentDidMount() {
        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.id){
                this.props.dispatch({
                    type: 'cloud/getBannerDeatil',
                    payload:{
                        parentId: this.props.navigation.state.params.id
                    }
                })
            }
        }
    }
    render() {
        console.log(this.props.cloud.bannerDetail.articleChildren)
        return (
            <ScrollView>
            <View style={styles.container}>
                <View style={{alignItems: 'center',padding: 30}}><Text style={{fontSize: 15}}>{this.props.cloud.bannerDetail.title}</Text></View>
                <View style={{marginTop: 20,paddingLeft: 10, paddingRight: 10}}>
                    {/*<EmText str={this.props.cloud.bannerDetail.articleChildren ? this.props.cloud.bannerDetail.articleChildren[0].content: '没有内容'} />*/}
                    {Platform.OS === 'android' ?
                        <WebView
                            bounces={false}
                            scalesPageToFit={true}
                            source={{baseUrl: '',html: `<div style='text-align: left;font-size: 13px;overflow: hidden;'>
                            <style>
                                img{width:100%}
                            </style>
                                ${this.props.cloud.bannerDetail.articleChildren ? this.props.cloud.bannerDetail.articleChildren[0].content: '没有内容'}</div>`}}
                            style={{width:deviceWidth - 20, height:deviceHeight}}>
                        </WebView>
                        :
                        <WebView
                            bounces={false}
                            scalesPageToFit={true}
                            source={{html: `<div style='text-align: left;font-size: 40;overflow: hidden;'>${this.props.cloud.bannerDetail.articleChildren ? this.props.cloud.bannerDetail.articleChildren[0].content: '没有内容'}</div>`}}
                            style={{width:deviceWidth - 20, height:deviceHeight}}>
                        </WebView>
                    }
                </View>
            </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    webview_style:{
        fontSize: 15
    },
    class_but: {
        backgroundColor: '#4184ff'
    },
    container: {
        width: '100%',
        marginBottom: 40,
        backgroundColor: '#fff'
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
    icon: {
        width: 30,
        height: 30,
    },
    wab_home_wb_btn:{
        height: 45,
        width: '100%'
    },
})

export default connect(({app, home, cloud}) => ({...app, home, cloud}))(bulletinDetail)