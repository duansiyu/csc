import React , {Component} from 'react'
import {StyleSheet, ScrollView, Image, Text, View,TouchableHighlight, ImageBackground} from 'react-native'
import {connect} from 'react-redux'
import {NavigationActions} from '../../utils'
import TitleBar from '../../components/TitleBar'
import wallet from "./wallet";
import {Flex, List} from 'antd-mobile'
import {unitWidth} from '../../utils/AdapterUtil'
import {Modal} from "antd-mobile/lib/index";
import yh_1 from '../../images/yh-bg-1.png'
import yh_2 from '../../images/yh-bg-2.png'
import yh_3 from '../../images/yh-bg-3.png'

const imgSrc = {0: yh_1, 1:yh_2, 2: yh_3}

class walletList extends Component{
    static navigationOptions = {
        title: '银行卡管理',
        header: null
        // headerRight:(
        //     <TouchableHighlight onPress={() =>{
        //         console.log(this)
        //     }}>
        //         <Image style={{width:20, height:20,marginRight:20}} source={require('../../images/tj.png')}/>
        //     </TouchableHighlight>
        // )
    }
    state = {
        walletLists:[]
    }
    componentDidMount() {
        this.getBankList()
    }
    getBankList = ()=> {
        this.props.dispatch({
            type: 'bank/getBankListAll',
            payload:{
                command:{
                    rawRequest:{
                        condition:{
                            accountId: this.props.userInfo.accountCommonDTO.id,
                            // type: 1
                        },
                        pageSize:20,
                        currentPage:1
                    }

                }
            },
            callback:() =>{
                this.getType()
            }
        })
    }
    getType = () =>{
        this.props.dispatch({
            type: 'wallet/getType',
            payload:{
                type: 'BankType',
                activeState:1
            },
            callback: (res) =>{
                this.setState({
                    accountType: res
                },() =>{
                    this.handleData()
                })
            }
        })
    }
    handleData = () =>{
        let walletList = []
        this.props.bank.bankList.map(item =>{
            this.props.wallet.accountType.map(menuItem =>{
                if(menuItem.others == item.accountType){
                    if(menuItem.imgUrl){
                        item.imgUrl = menuItem.imgUrl[0].value
                        item.name = menuItem.name
                    }
                }
            })
            walletList.push(item)
        })
        this.setState({walletLists: walletList})
    }
    bindSelectBank = (item) =>{
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
    handleSelect = (item) =>{
        if(this.props.navigation.state.params && this.props.navigation.state.params.name == 'extraWallet'){
            this.props.dispatch({
                type:'bank/updateState',
                payload:{
                    selectBank: item
                }
            })
            this.props.dispatch(NavigationActions.back())
        }
    }
    renderCell = () =>{
        let Jxs = []
        var num = 0
        this.props.bank.bankList.map((item, index) =>{
            Jxs.push(
                <TouchableHighlight underlayColor="#363d46" key={item.id} onPress ={() =>{
                    this.handleSelect(item)
                }} onLongPress={() => Modal.alert(
                    '删除不可复原',
                    null,
                    [
                        {text: '取消'},
                        {text: '确定', onPress: () => this.bindSelectBank(item)},
                    ]
                )}
                                    key={item.id} multipleLine >
                    <View  style={styles.cell}>
                        <ImageBackground  resizeMode='stretch' source={imgSrc[num]} style={styles.imgContainer}>
                            <Flex>
                                <Flex.Item style={{flex:0.3}}>
                                    <Image style={{width:40,height:40}} source={{uri:item.imgUrl}}/>
                                </Flex.Item>
                                <Flex.Item>
                                    <Text style={styles.cell_p}>{item.name}</Text>
                                </Flex.Item>
                            </Flex>
                            <Flex>
                                <Flex.Item style={{flex:0.3}}></Flex.Item>
                                <Flex.Item>
                                    <Text style={styles.cell_p}>{item.account}</Text>
                                </Flex.Item>
                            </Flex>
                        </ImageBackground>
                    </View>
                </TouchableHighlight>
            )
            if(num == 2){
                num = 0
            }else {
                num = num+1;
            }
        })
        return Jxs
    }
    render(){
        const {userInfo, navigation} = this.props
        return (
            <ScrollView style={{backgroundColor:'#363d46'}}>
                <TitleBar title={"银行卡管理"}  navigation={navigation}
                          backgroundColor={'#363d46'}
                          rightImage={require('../../images/tj.png')}
                          pressRight={()=>{ navigation.navigate('wallet')}}
                          right={true}
                />
                <View style={styles.conatiner}>
                    {this.props.bank.bankList.length>0?
                        <View>
                            {this.renderCell()}
                        </View>
                        :
                        <Text style={{textAlign:'center', marginTop: unitWidth* 285, color:'#999', fontSize: unitWidth* 28}}>暂时还没有银行卡，点击右上角添加</Text>
                    }
                </View>

            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    conatiner:{
        padding:20,
        backgroundColor:'#363d46'
    },
    cell:{
        height:120,
        backgroundColor:'#363d46',
        marginBottom:20,
    },
    imgContainer:{
        height:120,
        padding:25,
        borderRadius:10,
        overflow: 'hidden'
    },
    cell_p:{
        fontSize:18,
        color:'#fff'
    },
    content:{
        flexDirection:'row'
    }
})

export default connect(({app, user, bank, wallet}) =>({...app, user, bank, wallet}))(walletList)