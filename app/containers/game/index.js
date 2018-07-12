import React, {Component} from 'react'
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, Vibration} from 'react-native'
import {connect} from 'react-redux'

import {Wave, Thumb, Touchable} from '../../components'
import {createAction, NavigationActions} from '../../utils'

import {List, WhiteSpace, Button, Flex} from 'antd-mobile'
import px2dp from "../../utils/px2dp"


const Item = List.Item

var play_interval = null

class Game extends Component {
    static navigationOptions = {
        title: '开启挖宝小游戏'
    }
    state = {
        play: false,
        current_robot: '3',
        current_u: '3',
        gameRes: null
    }

    componentDidMount() {

    }
    playGmae = () => {
       if(this.state.play === false){
           this.setState({current_robot: 't', current_u: 's'})
           this.setState({play: true})
           play_interval = setInterval(()=>{
               if (this.state.current_robot === 't') {
                   this.setState({current_robot: 'e', current_u: 't'})
               } else if (this.state.current_robot === 'e') {
                   this.setState({current_robot: 's', current_u: 'e'})
               } else if (this.state.current_robot === 's') {
                   this.setState({current_robot: 't', current_u: 's'})
               }
           }, 600)
           this.props.dispatch({
               type: 'home/playGame',
               payload: { accountId: this.props.userInfo.accountCommonDTO.id },
               callback: (res) => {
                   setTimeout(()=>{
                       clearInterval(play_interval)
                       this.setState({ current_robot: res.data.robot })
                       this.setState({ current_u: res.data.player })
                       if (res.data.robot > res.data.player){
                           this.setState({gameRes: false})
                       }else{
                           this.setState({ gameRes: true })
                       }
                   }, 3000)
               }
           })
       }
    }
    logout = () => {
        this.props.dispatch(createAction('app/logout')())
    }
    render() {
        const {userInfo} = this.props
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={{padding: 10, backgroundColor: '#f7fafd'}}>
                        <View style={{marginBottom: 5}}>
                            <Flex>
                                <Flex.Item style={{flex: 0.3}}>
                                    <Image source={require('../../images/pic_kf_tx.png')} style={{width: 60, height: 60, borderRadius: 30, borderColor: '#fff', borderWidth: 2}}></Image>
                                </Flex.Item>
                                <Flex.Item>
                                    <View style={styles.text}>
                                        <Text style={{lineHeight: 20}}>
                                            1.活动期间每一天有一次游戏机会。
                                        </Text>
                                        <Text style={{lineHeight: 20}}>
                                            2.您在游戏中获胜，即获得当天自动挖宝的资格。
                                        </Text>
                                        <Text style={{lineHeight: 20}}>
                                            3.本平台拥有对于活动的所有解释权。
                                        </Text>

                                    </View>
                                </Flex.Item>
                            </Flex>
                        </View>
                        <View style={{ marginBottom: 5}}>
                            <Flex>
                                <Flex.Item style={{flex: 0.3}}>
                                    <Image source={require('../../images/pic_kf_tx.png')} style={{width: 60, height: 60, borderRadius: 30, borderColor: '#fff', borderWidth: 2}}></Image>
                                </Flex.Item>
                                <Flex.Item>
                                    <View style={styles.text}>
                                        <Text style={{lineHeight: 20}}>
                                            和我一起玩游戏吧，点数大即赢。
                                        </Text>
                                    </View>
                                </Flex.Item>
                            </Flex>
                        </View>
                        <View style={{ marginBottom: 10}}>
                            <Flex>
                                <Flex.Item style={{flex: 0.3}}>
                                    <Image source={require('../../images/pic_kf_tx.png')} style={{width: 60, height: 60, borderRadius: 30, borderColor: '#fff', borderWidth: 2}}></Image>
                                </Flex.Item>
                                <Flex.Item>
                                    <View style={styles.text}>
                                        <View style={{ width: 90, height: 90, overflow: 'hidden'}}>
                                            <ImageBackground style={styles[`dice_${this.state.current_robot}`]} source={require('../../images/dice2.png')}></ImageBackground>
                                        </View>
                                    </View>
                                </Flex.Item>
                            </Flex>
                        </View>
                        <View style={{ marginBottom: 5}}>
                            <Flex>
                                <Flex.Item style={{flex: 0.3}}>

                                </Flex.Item>
                                <Flex.Item style={{flex: 0.5}}>
                                    <View style={[styles.text,{alignItems: 'center'}]}>
                                        <View style={{ width: 90, height: 90, overflow: 'hidden'}}>
                                            <ImageBackground style={styles[`dice_${this.state.current_u}`]} source={require('../../images/dice2.png')}></ImageBackground>
                                        </View>
                                    </View>
                                </Flex.Item>
                                <Flex.Item style={{flex: 0.3}}>
                                    {
                                        userInfo.accountCommonDTO ?
                                            userInfo.accountCommonDTO.avatar ?
                                                <Image
                                                    source={{uri: userInfo.accountCommonDTO.avatar}}
                                                    style={styles.avatar}/> :
                                                <Image source={require('../../images/touxiang1.png')} style={{width: 60, height: 60, borderRadius: 30, borderColor: '#fff', borderWidth: 2}}></Image>
                                            :
                                            <Image source={require('../../images/touxiang1.png')} style={{width: 60, height: 60, borderRadius: 30, borderColor: '#fff', borderWidth: 2}}></Image>
                                    }
                                </Flex.Item>
                            </Flex>
                        </View>
                        {this.state.gameRes != null &&
                            <View style={{marginBottom: 5}}>
                                <Flex>
                                    <Flex.Item style={{flex: 0.3}}>

                                    </Flex.Item>
                                    <Flex.Item style={{flex: 0.5}}>
                                        <View style={[styles.text, {alignItems: 'center'}]}>
                                            <Text>{this.state.gameRes === true ? '我赢了 ！！！ ' : '哎呀，运气不佳，差一点就赢了 ！！!'}</Text>
                                        </View>
                                    </Flex.Item>
                                    <Flex.Item style={{flex: 0.3}}>
                                        {
                                            userInfo.accountCommonDTO ?
                                                userInfo.accountCommonDTO.avatar ?
                                                    <Image
                                                        source={{uri: userInfo.accountCommonDTO.avatar}}
                                                        style={styles.avatar}/> :
                                                    <Image source={require('../../images/touxiang1.png')} style={{
                                                        width: 60,
                                                        height: 60,
                                                        borderRadius: 30,
                                                        borderColor: '#fff',
                                                        borderWidth: 2
                                                    }}></Image>
                                                :
                                                <Image source={require('../../images/touxiang1.png')} style={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 30,
                                                    borderColor: '#fff',
                                                    borderWidth: 2
                                                }}></Image>
                                        }
                                    </Flex.Item>
                                </Flex>
                            </View>
                        }
                        <WhiteSpace />
                        <View style={{
                            alignItems: 'center',
                            margin: 15
                        }}>
                            {this.state.play === false &&
                                <Button onClick={this.playGmae} style={{backgroundColor: '#2591ff'}}><Text
                                    style={{color: '#fff'}}>点击开始游戏</Text></Button>
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 40
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


export default connect(({app, user, home}) => ({...app, user, home}))(Game)