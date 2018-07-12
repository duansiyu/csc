import React, { Component } from 'react'
import {StyleSheet, View, ActivityIndicator,Text} from 'react-native'
import { connect } from 'react-redux'
import {NavigationActions} from "../utils"


class Load extends Component {
    static navigationOptions = {
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'app/loadStorages',
            callback: () => {
                this.props.dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Home' })],
                }))
            }
        })
    }
    render() {
        return (
            <View style={styles.container}>
                 <ActivityIndicator />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default connect(({app}) => ({...app}))(Load)
