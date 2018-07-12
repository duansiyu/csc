import React, {Component} from 'react'
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Platform} from 'react-native'
import {connect} from 'react-redux'

import {Wave, Thumb, Touchable} from '../../components'
import {createAction, NavigationActions} from '../../utils'

import {List, WhiteSpace, Flex, Modal, InputItem} from 'antd-mobile'
import {unitWidth} from "../../utils/AdapterUtil";
import Toast from 'react-native-root-toast';

const Item = List.Item
const prompt = Modal.prompt

class Account extends Component {
    static navigationOptions = {
        title: '我的',
        tabBarLabel: '我的',
        tabBarIcon: ({focused, tintColor}) => (
            <Image
                style={[styles.icon, {tintColor: focused ? tintColor : ''}]}
                source={focused? require('../../images/tabbar/my_selected.png'): require('../../images/tabbar/my_normal.png')}
            />
        ),
    }
    state = {
        nickName: "",
        visible: false
    }

    componentDidMount() {
    }

    componentWillReceiveProps(props) {
        if (props.tab === 'Account' && this.props.tab !== 'Account') {
            this.setState({res: true})
        }
    }

    gotoLogin = () => {
        if (!this.props.isLogin) {
            this.props.dispatch(NavigationActions.navigate({routeName: 'Login'}))
        }
    }
    gotoUserInfoPage = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'UserInfo'}))
    }
    gotoUserSettings = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'Settings'}))
    }
    logout = () => {
        this.props.dispatch(createAction('app/logout')())
    }
    addressSubmit = () => {
        this.setState({visible: true})
    }
    addressSubmitPr = () => {
        if(Platform.OS == 'ios'){
            this.setState({visible: true})
        }else {
            prompt('操作', '修改昵称', [
                    {text: '取消'},
                    {
                        text: '确认', onPress: async (text) => {
                            var reg = await this.checkNick(text)
                            if(reg == true){
                                this.updateNickName(text)
                            }
                            // var regex = null
                            // if (/^[a-zA-Z]/.test(text)) {
                            //     console.log(2)
                            //     regex = new RegExp("^([a-zA-Z0-9_-]){1,12}$");
                            // } else if (/^[\w\u4e00-\u9fa5]{1,8}$/) {
                            //     console.log('呵呵')
                            //     regex = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,7}$");
                            // } else if (/^[\u4e00-\u9fa5]/.test(text)) {
                            //     console.log(3)
                            //     regex = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,6}$");
                            // } else {
                            //     regex = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,7}$");
                            // }
                            // if (regex.test(text)) {
                            //     this.props.dispatch({
                            //         type: 'user/updateNickName',
                            //         payload: {
                            //             nickName: text,
                            //             accountId: this.props.userInfo.accountCommonDTO.id
                            //         },
                            //         callback: (res) => {
                            //             this.setState({nickName: text})
                            //         }
                            //     })
                            // } else {
                            //     // Toast.info('请输入正确的昵称', 1.5, null, false)
                            //     Toast.show('请输入正确的昵称',{
                            //         duration:2500,
                            //         position: unitWidth * 450
                            //     })
                            //     // return false
                            // }
                        }
                    },
                ],
                'default',
            )
        }
    }
    addressSubmitNek = async (text) => {
        var reg = await this.checkNick(text)
        if(reg == true){
           this.updateNickName(text)
        }
    }
    updateNickName = (text) =>{
        this.props.dispatch({
            type: 'user/updateNickName',
            payload: {
                nickName: text,
                accountId: this.props.userInfo.accountCommonDTO.id
            },
            callback: (res) => {
                this.setState({nickName: text, visible: false})
            }
        })
    }
    checkNick = async (text) =>{
        var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
        if(text.match(regStr)){
            this.setState({visible: false,result: false})
            Toast.show('昵称不能含有表情字符',{
                duration:2500,
                position: unitWidth * 450
            })
            return false;
        }else {
            var reg = await this.checkLength(text)
            return reg
        }
    }

    checkLength = (text) =>{
        var reg = false
        var len = 0;
        for(var i=0;i<text.length;i++){
            var mat = text.charAt(i)
            if(mat.match(/[^\x00-\xff]/ig) != null){
                len += 2
            }else {
                len += 1
            }
            if(len>12){
                this.setState({visible: false,result: false})
                Toast.show('请输入正确的昵称',{
                    duration:2500,
                    position: unitWidth * 450
                })
                reg = false
                break;

            }else{
                reg = true
            }
        }

        return reg
    }

    render() {
        const {isLogin, userInfo} = this.props
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.gotoLogin}
                                  style={[styles.coupon_receive_wrapper, !isLogin ? styles.active : styles.unActive]}>
                </TouchableOpacity>
                <View style={styles.header}>
                    <View style={styles.ui_cell}>
                        {
                            userInfo.accountCommonDTO && userInfo.accountCommonDTO.avatar ?
                                (<Image
                                        source={{uri: userInfo.accountCommonDTO.avatar}}
                                        style={styles.avatar}/>
                                ) :
                                (
                                    <Image
                                        source={require('../../images/touxiang1.png')}
                                        style={styles.avatar}/>
                                )
                        }
                        <View style={styles.ui_cell_2}>
                            <Text
                                style={styles.parts_p}>{userInfo.accountCommonDTO ? userInfo.accountCommonDTO.nickname : ''}</Text>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={{width: 80, height: 80, alignItems: 'center', justifyContent: 'center'}}
                                onPress={() => {
                                    this.addressSubmitPr()
                                }}><Image style={{width: 15, height: 15}}
                                          source={require('../../images/btn_my_bianji.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Wave/>
                </View>

                <WhiteSpace/>
                <List>
                    <Item
                        thumb={<Thumb img={require('../../images/me/my_list_cion_sy.png')}/>}
                        arrow="horizontal"
                        onClick={() => {
                            this.props.dispatch(NavigationActions.navigate({routeName: 'IncomeIndex'}))
                        }}
                    >我的收益</Item>
                    {/*<Item*/}
                        {/*thumb={<Thumb img={require('../../images/me/my_list_cion_bz.png')}/>}*/}
                        {/*onClick={() => {*/}
                            {/*this.props.dispatch(NavigationActions.navigate({routeName: 'extractList'}))*/}
                        {/*}}*/}
                        {/*arrow="horizontal"*/}
                    {/*>*/}
                        {/*我的提取*/}
                    {/*</Item>*/}
                    <Item
                        thumb={<Thumb img={require('../../images/me/icon_list_li.png')}/>}
                        onClick={() => {
                            this.props.dispatch(NavigationActions.navigate({routeName: 'amounts'}))
                        }}
                        arrow="horizontal"
                    >
                        我的礼金
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Item
                        thumb={<Thumb img={require('../../images/me/my_list_cion_sm.png')}/>}
                        arrow="horizontal"
                        onClick={() => {
                            this.props.dispatch(NavigationActions.navigate({routeName: 'UserInfo'}))
                        }}
                    >个人信息</Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Item
                        thumb={<Thumb img={require('../../images/me/my_list_cion_sz.png')}/>}
                        arrow="horizontal"
                        onClick={this.gotoUserSettings}
                    >安全设置</Item>
                </List>
                <Modal
                    visible={this.state.visible }
                    transparent
                    maskClosable={true}
                    style={{bottom: unitWidth * 150}}
                    title="修改昵称"
                    footer={[{
                        text: '取消', onPress: () => {
                            this.setState({visible: false})
                        }
                    }, {
                        text: '确认', onPress: () => {
                            this.addressSubmitNek(this.state.nickName)
                        }
                    }]}
                >
                    <InputItem
                        placeholder="请输入昵称"
                        type="text"
                        onChange={(text) => {
                            this.setState({'nickName': text})
                        }}
                    ></InputItem>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {},
    header: {
        backgroundColor: '#2591ff',
        padding: 30,
        paddingTop: 60,
        paddingRight: 10,
        paddingBottom: 120
    },
    ui_cell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    avatar: {
        width: 75,
        height: 75,
        borderRadius: 38,
        borderWidth: 1,
        borderColor: '#fff',
        marginRight: 30
    },
    ui_cell_1: {
        flex: 0.6,
        height: 50
    },
    ui_cell_2: {
        flexDirection: 'row',
        flex: 2,
        height: 80,
        alignItems: 'flex-start',
        alignItems: 'center',
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
        height: 15,
        marginLeft: 8,
    },
    coupon_receive_wrapper: {
        display: 'none',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 3
    },
    active: {
        display: 'flex'
    },
    unActive: {
        display: 'none',
        zIndex: 0,
    },
})


export default connect(({app, user}) => ({...app, user}))(Account)

