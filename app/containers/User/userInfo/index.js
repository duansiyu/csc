import React, {Component} from 'react'
import {StyleSheet, View, Image, Text, Platform, ScrollView} from 'react-native'
import {connect} from 'react-redux'

import {Wave, Touchable} from '../../../components'

import {List, WhiteSpace, Button} from 'antd-mobile'
import {NavigationActions} from "../../../utils";
import ImagePicker from "react-native-image-picker";
import config from "../../../../config";

const Item = List.Item

class UserInfo extends Component {
    static navigationOptions = {
        title: '个人信息',
    }
    state = {}

    componentDidMount() {
        this.props.dispatch({
            type: 'user/getRealInfo',
            payload: {
                userId: this.props.userInfo.accountCommonDTO.id
            }
        })
    }

    bingToReal = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'SetRealName'}))
    }
    gotoUserInfoPage = () => {
        const photoOptions = {
            title: '请选择',
            quality: 0.8,
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择相册',
            allowsEditing: true,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }
        console.log(photoOptions)
        ImagePicker.showImagePicker(photoOptions, (res) => {
            if (res.didCancel) {  // 返回
                return
            } else {
                let source;  // 保存选中的图片
                source = {uri: 'data:image/jpeg;base64,' + res.data}

                if (Platform.OS === 'android') {
                    source = {uri: res.uri}
                } else {
                    source = {uri: res.uri.replace('file://', '')}
                }
                const param = {
                    "command": {
                        "rawRequest": {
                            "fileType": 1,
                            "appId": config.APPID,
                            "fileName": "app.png",
                            "businessId": '12001'
                        }
                    }
                }
                const option = {
                    file: res,
                    uid: 0
                }
                this.props.dispatch({
                    type: 'upload/uploadImage',
                    payload: {...param},
                    option,
                    callback: (url, fileId) => {
                        var param = {
                            updateCondition: {
                                id: this.props.userInfo.accountCommonDTO.id,
                                avatar: url
                            }
                        }
                        this.props.dispatch({
                            type: 'user/updateCommonAvatar',
                            payload: {...param},
                            callback: (url) => {
                                this.setState({actUrl: url})
                            }
                        })
                    }
                })
            }
        })
    }

    render() {
        const {userInfo, user: {realInfo}} = this.props
        console.log(realInfo)
        return (
            <ScrollView
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}>
                <Touchable onPress={this.gotoUserInfoPage}>
                    <View style={styles.header}>
                        <View style={styles.ui_cell}>
                            <View style={styles.ui_cell_1}>
                                <View>
                                    {
                                        userInfo.accountCommonDTO ?
                                            userInfo.accountCommonDTO.avatar ?
                                                <Image
                                                    source={{uri: userInfo.accountCommonDTO.avatar}}
                                                    style={styles.avatar}/> :
                                                <Image
                                                    source={require('../../../images/touxiang1.png')}
                                                    style={styles.avatar}/>
                                            :
                                            <Image
                                                source={require('../../../images/touxiang1.png')}
                                                style={styles.avatar}/>
                                    }
                                </View>
                                {
                                    !realInfo.identityNum ?
                                        <View style={styles.ui_cell_3}>
                                            <Image
                                                source={require('../../../images/icon_sm_wrz.png')}
                                                style={styles.ed_name}/>
                                            <Text style={styles.parts_p1}> 未实名认证</Text>
                                        </View> :
                                        <View style={styles.ui_cell_3}>
                                            <Image
                                                source={require('../../../images/icon_sm_cg.png')}
                                                style={styles.ed_name}/>
                                            <Text style={styles.parts_p1}> 已实名认证</Text>
                                        </View>
                                }
                            </View>
                            <View style={styles.ui_cell_2}>
                                <Image style={{width:24, height:22}} source={require('../../../images/photo.png')}/>
                            </View>
                        </View>
                        <Wave/>
                    </View>
                </Touchable>
                <WhiteSpace/>

                <List>
                    <Item extra={userInfo.accountCommonDTO.account}>账号</Item>
                    <Item extra={userInfo.accountCommonDTO.mobile}>手机号码</Item>
                    <Item extra={realInfo.realName || '未实名认证'}>实名</Item>
                    <Item extra={realInfo.identityNum || '未实名认证'}>证件号码</Item>
                </List>
                <List>
                    <Item arrow="horizontal" onClick={() => {
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'addressList',
                            params: {type: 'userInfo'}
                        }))
                    }}>常用地址</Item>
                </List>
                {/*<List>*/}
                    {/*<Item arrow="horizontal" onClick={() => {*/}
                        {/*this.props.dispatch(NavigationActions.navigate({*/}
                            {/*routeName: 'bankList',*/}
                            {/*params: {type: 'userInfo'}*/}
                        {/*}))*/}
                    {/*}}>钱包管理</Item>*/}
                {/*</List>*/}
                <List>
                    <Item arrow="horizontal" onClick={() => {
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'walletList',
                            params: {type: 'userInfo'}
                        }))
                    }}>卡号管理</Item>
                </List>
                <WhiteSpace/>
                <WhiteSpace/>
                <WhiteSpace/>
                <WhiteSpace/>
                {
                    !realInfo.identityNum ?
                        <View>
                            <Button type="primary" style={styles.class_but}
                                    onClick={this.bingToReal}>马上实名认证</Button>
                        </View>
                        : null
                }
                <WhiteSpace size={50}/>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    class_but: {
        backgroundColor: '#4184ff',
        marginBottom: 30,
        marginLeft: 20,
        marginRight:20,
        borderRadius:50
    },
    container: {
        flex: 1,
    },
    stretch: {
        flex: 1,
        textAlign: 'center'
    },
    ed_name: {
        width: 20,
        height: 20,
        marginLeft: 24,
        marginTop: 5
    },
    header: {
        backgroundColor: '#2591ff',
        padding: 60,
        paddingRight: 10,
        paddingBottom: 160,
        height: 100
    },
    ui_cell: {
        flex: 1,
        flexDirection: 'row',
    },
    avatar: {
        width: 75,
        height: 75,
        borderRadius: 38,
        borderWidth: 1,
        borderColor: '#fff'
    },
    ui_cell_1: {
        alignItems: 'center',
        justifyContent:'center',
        flex: 1,
        height: 50,
        flexDirection: 'column',
    },
    ui_cell_2: {
        width: 36,
        height: 31
    },
    ui_cell_3: {
        flexDirection:'row',
        marginTop:10
    },
    parts_p: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 75
    },
    parts_p1: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 35
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

})


export default connect(({app, user, upload}) => ({...app, user, upload}))(UserInfo)