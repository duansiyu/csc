import React, {Component} from 'react'
import {StyleSheet, View, Image, Text, TouchableOpacity, Platform} from 'react-native'
import {connect} from 'react-redux'
import ImagePicker from 'react-native-image-picker'
import {Wave, Thumb, Touchable} from '../../../components'
import {createAction, NavigationActions} from '../../../utils'

import {List, WhiteSpace, Button} from 'antd-mobile'
import config from '../../../../config'

const Item = List.Item

class Settings extends Component {
    static navigationOptions = {
        title: '安全设置'
    }
    state = {}

    componentDidMount() {

    }
    gotoUserInfoPage = () => {
        const photoOptions = {
            title:'请选择',
            quality: 0.8,
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'选择相册',
            allowsEditing: true,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }
        ImagePicker.showImagePicker(photoOptions,(res) => {
            if (res.didCancel) {  // 返回
                return
            } else {
                let source;  // 保存选中的图片
                source = {uri: 'data:image/jpeg;base64,' + res.data}

                if (Platform.OS === 'android') {
                    source = { uri: res.uri }
                } else {
                    source = { uri: res.uri.replace('file://','') }
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
                    payload: { ...param },
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
                            payload: { ...param },
                            callback: (url) => {
                                this.setState({actUrl: url})
                            }
                        })
                    }
                })
            }
        })
    }
    logout = () => {
        this.props.dispatch(createAction('app/logout')())
    }
    render() {
        const {userInfo} = this.props
        console.log(userInfo)
        return (
            <View style={styles.container}>
                {/*<Touchable onPress={this.gotoUserInfoPage}>*/}
                    {/*<View style={styles.header}>*/}
                        {/*<View style={styles.ui_cell}>*/}
                            {/*<View style={styles.ui_cell_1}>*/}
                                {/*{*/}
                                    {/*userInfo.accountCommonDTO ?*/}
                                        {/*userInfo.accountCommonDTO.avatar ?*/}
                                            {/*<Image*/}
                                                {/*source={{uri: userInfo.accountCommonDTO.avatar}}*/}
                                                {/*style={styles.avatar}/> :*/}
                                            {/*<Image*/}
                                                {/*source={require('../../../images/touxiang1.png')}*/}
                                                {/*style={styles.avatar}/>*/}
                                        {/*:*/}
                                        {/*<Image*/}
                                            {/*source={require('../../../images/touxiang1.png')}*/}
                                            {/*style={styles.avatar}/>*/}
                                {/*}*/}

                            {/*</View>*/}
                            {/*<View style={styles.ui_cell_2}>*/}
                                {/*<Text*/}
                                    {/*style={styles.parts_p}>更换头像</Text>*/}
                            {/*</View>*/}
                            {/*<View style={styles.ui_cell_3}>*/}
                                {/*<Image source={require('../../../images/me/btn_my_bai.png')} style={styles.list_arrow}/>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                        {/*<Wave/>*/}
                    {/*</View>*/}
                {/*</Touchable>*/}
                <WhiteSpace/>
                <List>
                    <Item
                        thumb={<Thumb img={require('../../../images/me/my_list_cion_sy.png')}/>}
                        arrow="horizontal"
                        onClick={() => {
                            this.props.dispatch(NavigationActions.navigate({routeName: 'SetPassword', params: {name: '修改登录密码'}}))
                        }}
                    >登录密码</Item>
                    <Item
                        thumb={<Thumb img={require('../../../images/me/my_list_cion_bz.png')}/>}
                        onClick={() => {
                            this.props.dispatch(NavigationActions.navigate({routeName: 'SetPayPassword', params: {name: '修改交易密码'}}))
                        }}
                        arrow="horizontal"
                    >
                        交易密码
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Item
                        thumb={<Thumb img={require('../../../images/me/my_list_cion_sm.png')}/>}
                        extra={config.version}
                        onClick={() => {
                        }}
                    >当前版本</Item>
                </List>
                <View style={{paddingTop: 60, padding: 20}}>
                    <Touchable><Button style={styles.class_but} type="primary" onClick={this.logout}>退出登录</Button></Touchable>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {},
    header: {
        backgroundColor: '#2591ff',
        padding: 30,
        paddingRight: 10,
        paddingBottom: 100
    },
    ui_cell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        width: 75,
        height: 75,
        borderRadius: 38,
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
})


export default connect(({app, user, upload}) => ({...app, user, upload}))(Settings)