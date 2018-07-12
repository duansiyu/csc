import React, {Component} from 'react';
import {StyleSheet,View, Text, ImageBackground, Modal,Image,TouchableOpacity} from 'react-native';
import {Button} from 'antd-mobile';
import {width, unitWidth} from "../utils/AdapterUtil";

export default class ModalImg extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const {ODialogPrize} = this.props
        return (
            <Modal
                visible={this.props.visible}
                style={styles.modal}
                transparent={true}
            >
                <View style={styles.conatiner}>
                    <ImageBackground style={styles.bg} resizeMode='contain' source={require('../images/hb.png')}>
                        <View style={styles.content}>
                            <Text style={styles.cell_1}>恭喜你中奖啦</Text>
                            <Text style={styles.cell_2}>{ODialogPrize.btnText}</Text>
                            <Text style={styles.cell_3}>{ODialogPrize.prizeText}<Text style={styles.cell_2}>{ODialogPrize.money}</Text></Text>
                        </View>
                        <View style={styles.btnConatiner}>
                            <Button activeStyle={{backgroundColor:'#fdf1de'}} activeClassName={true} style={styles.btn} type="primary" onClick={this.props.bindPrize}><Text style={styles.cell_4}>立即领奖</Text></Button>
                        </View>
                    </ImageBackground>
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
    conatiner:{
        width:'100%',
        height:'100%',
        backgroundColor:'rgba(0,0,0,0.5)',
        justifyContent:'center',
        alignItems:'center'
    },
    content:{
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        top: '26%',
        left:0,
        right:0
    },
    cell_1:{
        color:'#d1090e',
        fontSize:unitWidth * 44,
        fontWeight:'700',
        paddingBottom: unitWidth * 10
    },
    cell_2:{
        color:'#d1090e',
        fontSize:unitWidth * 28,
        fontWeight:'normal',
    },
    cell_3:{
        color:'#d1090e',
        fontSize:unitWidth * 48,
        paddingTop:unitWidth* 20,
        fontWeight:'normal'
    },
    cell_4:{
        color:'#d1090e',
        fontSize:unitWidth * 38,
        fontWeight:'700',
    },
    bg: {
        width:unitWidth * 498,
        height:unitWidth * 654
    },
    cancel:{
        marginTop:unitWidth * 50,
        width:33,
        height:33
    },
    btnConatiner:{
        position:'absolute',
        bottom: '9%',
        left:0,
        right:0,
        width:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    active:{
        backgroundColor: '#fdf1de',
    },
    btn:{
        backgroundColor: '#fdf1de',
        marginRight: 10,
        marginLeft: 10,
        width: unitWidth * 340,
        borderColor:'transparent',
        borderRadius: 40,
        height: unitWidth* 70,
    }
})