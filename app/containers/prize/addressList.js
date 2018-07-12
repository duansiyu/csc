import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView,
    Platform,
} from 'react-native'
import {connect} from 'react-redux'
import {NavigationActions} from '../../utils'
import {List, Button, Flex, Card, Steps, Modal, Checkbox} from 'antd-mobile'

const Item = List.Item
const CheckboxItem = Checkbox.CheckboxItem

class addressList extends Component {
    static navigationOptions = {
        title: '地址管理'
    }
    state = {

    }

    componentDidMount() {
        this.selectByUserId()
    }
    selectByUserId = () => {
        this.props.dispatch({
            type: 'prize/selectByUserId',
            payload:{
                userId: this.props.userInfo.accountCommonDTO.id,
                types:[1]
            }
        })
    }
    deleteAddress = (item) => {
        Modal.alert(
            '删除地址信息',
            '删除之后不可复原',
            [
                {text:'取消'},
                {text: '确认', onPress: () => {
                    this.props.dispatch({
                        type: 'prize/deleteAddress',
                        payload:{
                            addressId:	[item.id]
                        },
                        callback:()=>{
                            this.selectByUserId()
                        }
                    })
                }}
            ]
        )

    }
    editAddress= (item) => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'address', params: {name: '编辑地址', item: item }}))
    }
    addAddress = () => {
        this.props.dispatch(NavigationActions.navigate({routeName: 'address', params: {name: '添加地址'}}))
    }
    bindSelectAdd = (item) => {
        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.type){

            }
        }else{
            this.props.dispatch({
                type: 'prize/updateState',
                payload:{
                    selectAdd: item
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
                    <View style={{marginTop: 10}}>
                        {/*<List>*/}
                            {
                                this.props.prize.addresssList.map((item, index) =>
                                    <View style={{marginBottom:5}}>
                                        <Item onClick={() => {
                                           this.bindSelectAdd(item)
                                        }}  key={index}>
                                            <Flex style={{paddingTop:5,paddingBottom:5}}>
                                                <Flex.Item><Text>{item.receiver}</Text></Flex.Item>
                                                <Flex.Item style={{alignItems: 'flex-end'}}><Text>{item.mobile}</Text></Flex.Item>
                                            </Flex>
                                            <Text style={{paddingBottom:5}}>{item.detail}</Text>
                                             {/*<Brief></Brief>*/}
                                        </Item>
                                        <Item>
                                            <Flex style={{height: 35}}>
                                                {item.isDefault == '1' ?
                                                    <Flex.Item style={{flex:0.5}}>
                                                        <Flex style={{flexDirection:'row'}}>
                                                            <Flex.Item onPress={() => {
                                                                console.log(1)
                                                            }} style={{alignItems: 'flex-end', flex: 0.6}}>
                                                                <Text style={{lineHeight: 35}}>默认地址</Text><View></View>
                                                            </Flex.Item>
                                                            <Flex.Item onPress={() => {
                                                                console.log(1)
                                                            }} style={{alignItems: 'flex-start', flex: 1}}>
                                                                <View><CheckboxItem checked={item.isDefault == '1' ? true : false} /></View>
                                                            </Flex.Item>
                                                        </Flex>
                                                    </Flex.Item>
                                                    :
                                                    <Flex.Item style={{flex:0.5}}></Flex.Item>
                                                }
                                                {Platform.OS === 'android' ?
                                                    <Flex.Item style={{flex:0.5}}>
                                                        <Flex style={{flexDirection:'row'}}>
                                                            <Flex.Item onPress={() => {
                                                                this.editAddress(item)
                                                            }} style={{alignItems: 'center', flex: 0.6}}><Text
                                                                style={{lineHeight: 35}}><Image
                                                                style={{width: 54, height: 54}}
                                                                source={require('../../images/cion_edit.png')}/> 编辑</Text></Flex.Item>
                                                            <Flex.Item onPress={() => {
                                                                this.deleteAddress(item)
                                                            }} style={{alignItems: 'center', flex: 0.6}}><Text
                                                                style={{lineHeight: 35}}><Image
                                                                style={{width: 54, height: 54}}
                                                                source={require('../../images/cion_delete.png')}/> 删除</Text></Flex.Item>
                                                        </Flex>
                                                    </Flex.Item>
                                                    :
                                                    <Flex.Item style={{flex:0.5}}>
                                                        <Flex style={{flexDirection:'row'}}>
                                                            <Flex.Item onPress={() => {
                                                                this.editAddress(item)
                                                            }} style={{alignItems: 'center', flex: 0.6}}><Text
                                                                style={{lineHeight: 35}}><Image
                                                                style={{width: 20, height: 18}}
                                                                source={require('../../images/cion_edit.png')}/> 编辑</Text></Flex.Item>
                                                            <Flex.Item onPress={() => {
                                                                this.deleteAddress(item)
                                                            }} style={{alignItems: 'center', flex: 0.6}}><Text
                                                                style={{lineHeight: 35}}><Image
                                                                style={{width: 20, height: 18}}
                                                                source={require('../../images/cion_delete.png')}/> 删除</Text></Flex.Item>
                                                        </Flex>
                                                    </Flex.Item>
                                                }
                                            </Flex>
                                        </Item>
                                    </View>
                                )
                            }
                        {/*</List>*/}
                    </View>
                    <View style={{marginTop: 40}}>
                        <Button type="primary" style={styles.class_but} onClick={this.addAddress}>添加新地址</Button>
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
        backgroundColor: '#4184ff',
        marginBottom: 30,
        marginLeft: 20,
        marginRight:20,
        borderRadius:50
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


export default connect(({app, user, home, prize}) => ({...app, user, home, prize}))(addressList)