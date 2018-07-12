import React, { Component } from 'react'
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native'
import { Table, Row, Rows } from 'react-native-table-component';

class instructions extends Component {
    static navigationOptions = {
        title: '持币生息规则说明',
    }
    state = {
        tableHead: ['转入时间', '确认份额', '收益发放'],
        tableData: [
            ['周一15:00(含15:00)~周二15:00', '周三', '周四'],
            ['周二15:00(含15:00)~周三15:00', '周四', '周五'],
            ['周三15:00(含15:00)~周四15:00', '周五', '周六'],
            ['周四15:00(含15:00)~周五15:00', '下周一', '下周二'],
            ['周五15:00(含15:00)~下周一15:00', '下周二', '下周三']
        ]
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{padding: 10}}>
                    <View style={{marginBottom: 10}}><Text style={{fontSize: 16}}>持币生息的收益如何计算</Text></View>
                    <View style={{marginBottom: 10}}><Text style={{fontSize: 16}}>1.持币生息，每日收益会计收入已确认金额，用来计算次日收益。</Text></View>
                    <View style={{marginBottom: 10}}><Text style={{fontSize: 16}}>2.已确认金额在周末和节假日同样能享受收益。</Text></View>
                    <View style={{marginBottom: 10}}><Text style={{fontSize: 16}}>3.转入后收益发放时间如下：</Text></View>
                </View>
                <View style={{padding: 10}}>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff',padding: 5}}>
                    <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
                    <Rows data={this.state.tableData} textStyle={styles.text}/>
                </Table>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6,textAlign: 'center'},
    close: {
        position: 'absolute',
        right: 20,
        top: 40,
    },
})

export default instructions