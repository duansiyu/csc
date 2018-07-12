import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Vibration,
    Platform
} from 'react-native'
import {connect} from 'react-redux'

import {Wave, Thumb, Touchable} from '../../components'
import {createAction, NavigationActions} from '../../utils'

import {List, WhiteSpace, Button, Flex, Card, Steps, Modal, Checkbox} from 'antd-mobile'
import px2dp from "../../utils/px2dp"

import { timeString } from '../../utils/help'
const Item = List.Item
const Brief = Item.Brief
const Step = Steps.Step
const alert = Modal.alert
const CheckboxItem = Checkbox.CheckboxItem
class bankList extends Component {
    static navigationOptions = {
        title: '钱包账户管理'
    }
    state = {

    }

    componentDidMount() {
        this.getBankList()
    }
    //获取银行卡列表
    getBankList = ()=> {
        this.props.dispatch({
            type: 'bank/getBankList',
            payload:{
                command:{
                    condition:{
                        accountId: this.props.userInfo.accountCommonDTO.id,
                        type: 0
                    },
                    pageSize:20,
                    currentPage:1
                }

            }
        })
    }
    DelateBank = (item) => {
        this.props.dispatch({
            type: 'bank/DelateBank',
            payload:{
                id: item.id,
                accountId: this.props.userInfo.accountCommonDTO.id
            },
            callback:()=>{
                this.getBankList()
            }
        })
    }
    editBank= (item) => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'bank', params: {name: '编辑钱包账户', item: item }}))
    }
    addBank = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'bank', params: {name: '新增钱包账户'}}))
    }
    bindSelectBank = (item) => {
        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.type){

            }
        }else{
            this.props.dispatch({
                type: 'bank/updateState',
                payload:{
                    selectBank: item
                }
            })
            setTimeout(() =>{
                this.props.dispatch(NavigationActions.back())
            },100)
        }
    }
    logout = () => {

    }
    render() {
        const {userInfo} = this.props
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View>
                        <List>
                            {
                                this.props.bank.bankList.map((item, index) =>
                                    <View>
                                        <Item onClick={() => {
                                           this.bindSelectBank(item)
                                        }}  key={index} multipleLine >
                                            {/*雷达钱包 <Brief>{item.bankName}</Brief>*/}
                                            <Flex>
                                                <Flex.Item>
                                                    <Image style={{width:20,height:20,marginLeft:16}} source={require('../../images/bank.png')}/>
                                                </Flex.Item>
                                                <Flex.Item>
                                                    <Text>{item.account}</Text>
                                                </Flex.Item>
                                            </Flex>
                                            <Flex>
                                                <Flex.Item>
                                                    <Text>镭达钱包</Text>
                                                </Flex.Item>
                                                <Flex.Item>
                                                    <Text>{item.bankName}</Text>
                                                </Flex.Item>
                                            </Flex>
                                        </Item>
                                        <Item>
                                            {
                                                Platform.OS === 'android' ?
                                                    <Flex style={{height: 35}}>
                                                        <Flex.Item onPress={() => {
                                                            console.log(1)
                                                        }} style={{alignItems: 'flex-end', flex: 0.5}}>
                                                            <Text style={{lineHeight: 35}}>默认账户</Text><View></View>
                                                        </Flex.Item>
                                                        <Flex.Item onPress={() => {
                                                            console.log(1)
                                                        }} style={{alignItems: 'flex-start', flex: 1}}>
                                                           <View><CheckboxItem checked={item.isDefault == 1 ? true : false} /></View>
                                                        </Flex.Item>
                                                        <Flex.Item onPress={() => {
                                                            this.editBank(item)
                                                        }}style={{alignItems: 'center', flex: 0.6}}><Text style={{lineHeight: 35}}><Image style={{width:40,height:40}} source={require('../../images/cion_edit.png')}/> 编辑</Text></Flex.Item>
                                                        <Flex.Item onPress={() => {
                                                            this.DelateBank(item)
                                                        }}style={{alignItems: 'center', flex: 0.6}}><Text style={{lineHeight: 35}}><Image style={{width:40,height:40}} source={require('../../images/cion_delete.png')}/> 删除</Text></Flex.Item>
                                                    </Flex>
                                                    :
                                                    <Flex style={{height: 35}}>
                                                        <Flex.Item onPress={() => {
                                                            console.log(1)
                                                        }} style={{alignItems: 'flex-end', flex: 0.5}}>
                                                            <Text style={{lineHeight: 35}}>默认账户</Text><View></View>
                                                        </Flex.Item>
                                                        <Flex.Item onPress={() => {
                                                            console.log(1)
                                                        }} style={{alignItems: 'flex-start', flex: 1}}>
                                                            <View><CheckboxItem checked={item.isDefault == 1 ? true : false} /></View>
                                                        </Flex.Item>
                                                        <Flex.Item onPress={() => {
                                                            this.editBank(item)
                                                        }}style={{alignItems: 'center', flex: 0.6}}><Text style={{lineHeight: 35}}><Image style={{width:20,height:18}} source={require('../../images/cion_edit.png')}/> 编辑</Text></Flex.Item>
                                                        <Flex.Item onPress={() => {
                                                            this.DelateBank(item)
                                                        }}style={{alignItems: 'center', flex: 0.6}}><Text style={{lineHeight: 35}}><Image style={{width:20,height:18}} source={require('../../images/cion_delete.png')}/> 删除</Text></Flex.Item>
                                                    </Flex>
                                            }
                                        </Item>
                                    </View>
                                )
                            }
                        </List>
                    </View>
                    <View style={{marginTop: 40 ,paddingRight: 20, paddingLeft: 20}}>
                        <Button type="primary" style={styles.class_but} onClick={this.addBank}>添加新账户</Button>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    class_but: {
        backgroundColor: '#4184ff'
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
        // backgroundColor: '#fff',
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
        // borderColor: '#fff'
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
        // color: '#fff',
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


export default connect(({app, user, home, bank}) => ({...app, user, home, bank}))(bankList)