import React, {Component} from 'react';
import {StyleSheet,View, Text, Modal,Image,TouchableOpacity} from 'react-native';
import {Button} from 'antd-mobile';
import {unitWidth} from "../utils/AdapterUtil";

export default class ModalImg extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <Modal
                visible={this.props.visible}
                style={styles.modal}
                transparent={true}
                onRequestClose={this.props.onCancel}
            >
                <View style={styles.Conatiner}>
                    <View style={styles.conatiner}>
                        <View style={styles.bgConatiner}>
                            <Image style={{width: '70%', height: unitWidth * 200,backgroundColor:'#ecebeb'}}
                                   resizeMode="contain"
                                   source={require('../images/pity.png')}/>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.cell_1}>很遗憾没有中奖</Text>
                            <Text style={styles.cell_2}>请下次再来</Text>
                            <View style={styles.btnConatiner}>
                                <Button style={styles.btn} onClick={this.props.onCancel} type="primary"><Text style={styles.cell_4}>确定</Text></Button>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this.props.onCancel}>
                        <Image style={styles.cancel} source={require('../images/cancel.png')}/>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    modal:{
        width:'100%',
        height:'100%',
    },
    Conatiner: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    conatiner:{
        width: unitWidth * 475,
        height: unitWidth * 525
    },
    bgConatiner:{
        height: unitWidth * 290,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#ecebeb',
        borderTopLeftRadius:15,
        borderTopRightRadius:15
    },
    content:{
        justifyContent:'center',
        alignItems:'center',
        textAlign:'center',
        backgroundColor:'#fff',
        marginTop: -10,
        height: unitWidth * 235,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15
    },
    cell_1:{
        paddingTop: unitWidth * 15,
        color:'#333',
        fontSize:unitWidth * 34,
        fontWeight:'700',
        paddingBottom: unitWidth * 15
    },
    cell_2:{
        color:'#666',
        fontSize:unitWidth * 26,
        fontWeight:'normal',
        paddingBottom: unitWidth* 25
    },
    cell_3:{
        color:'#d1090e',
        fontSize:unitWidth * 110,
        paddingTop:unitWidth* 35,
        fontWeight:'900'
    },
    bg: {
        width:'80%',
        height: 210,

    },
    cancel:{
        width:33,
        height:33,
        marginTop:unitWidth * 50
    },
    btnConatiner:{
        width: unitWidth * 340,
        alignItems:'center',
        justifyContent:'center',
        paddingBottom: unitWidth * 25
    },
    btn:{
        backgroundColor: '#ef394b',
        marginRight: 10,
        marginLeft: 10,
        height: unitWidth* 65,
        width: unitWidth * 340,
        borderColor:'transparent',
        borderRadius: 40,
    },
    cell_4:{
        color:'#fff',
        fontSize: unitWidth * 34,
        fontWeight:'700'
    }
})