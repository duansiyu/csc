import React, { Component } from 'react'
import {StyleSheet, Clipboard,View, ScrollView, Image, StatusBar, Platform, Dimensions, TouchableOpacity, Text, ImageBackground, Animated, Easing} from 'react-native'
import { connect } from 'react-redux'
import {Touchable, Thumb} from '../../components'
import { createAction, NavigationActions } from '../../utils'
import {Modal,NoticeBar, WhiteSpace, Icon, Flex, Button, Switch, Toast, List} from 'antd-mobile'
import px2dp from "../../utils/px2dp"
import {timeString} from "../../utils/help"
const Item = List.Item
const Brief = Item.Brief
class bulletinList extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.type === 1 ? '系统公告' : '社区公告',
    })
    state = {

    }
    componentDidMount() {
        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.type){
                var parentId = '214001175344714246'
                if(this.props.navigation.state.params.type == 1){
                    parentId = '214001175344714246'
                }else{
                    parentId = '21400117480217220'
                }
                this.props.dispatch({
                    type: 'cloud/getBannerList',
                    payload:{parentId: parentId,postStatus:"publish",pageSize:20,pageIndex:1},
                })
            }
        }
    }
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <List style={{marginTop: 10}}>
                        {
                            this.props.cloud.bannerLists.map(item =>
                                <Item extra={item.timeStr}  onClick={() => {
                                    this.props.dispatch(NavigationActions.navigate({routeName: 'bulletinDetail', params: {id: item.id}}))
                                }} arrow="horizontal" wrap={false}>
                                    <Brief>{item.title}</Brief>
                                </Item>
                            )
                        }

                    </List>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    class_but: {
        backgroundColor: '#4184ff'
    },
    container: {
        width: '100%',
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
    icon: {
        width: 30,
        height: 30,
    },
    wab_home_wb_btn:{
        height: 45,
        width: '100%'
    },
})

export default connect(({app, home, cloud}) => ({...app, home, cloud}))(bulletinList)