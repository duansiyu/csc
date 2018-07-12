import React, { Component } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import px2dp from "../../utils/px2dp"

import { NavigationActions } from '../../utils'
import { Button } from 'antd-mobile'

class treasureSuccess extends Component {
    static navigationOptions = {
        title: '转换结果',
    }

    gotoDetail = () => {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'Detail' }))
    }

    goBack = () => {
        this.props.dispatch(NavigationActions.back({ routeName: 'Account' }))
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={{width:px2dp(50),height:px2dp(50),marginRight: 10}} source={require('../../images/icon_CG.png')}/>
                <View style={{marginTop: 20}}>
                    <Text style={{ fontSize: 16}}>转换成功</Text>
                </View>
                <Button type="primary" style={styles.class_but} onClick={() => {
                    this.props.dispatch(NavigationActions.back())
                }}>完成</Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 40
    },
    class_but: {
        width: '50%',
        marginTop: 40,
        backgroundColor: '#4184ff'
    },
})

export default connect(({app}) => ({...app}))(treasureSuccess)