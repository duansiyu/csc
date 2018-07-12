import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Dimensions,
    ScrollView,
    Text
} from 'react-native'

export default class EmText extends Component {

    //默认属性
    static defaultProps = {
        str: '<em></em>',
    };
    //构造函数
    constructor(props) {
        super(props);
        let normalText = [];
        let specialText = [];


        if (props.str && props.str !== '' && props.str.length > 0) {
            try {
                let tempText = props.str;
                tempText = tempText.replace(/<[^>]*>/g, 'tmd')
                tempText.trim().split('tmd').forEach((obj, index) => {
                    if ((index + 1) % 2 === 0) {
                        normalText.push(obj)
                    } else {
                        specialText.push(obj)
                    }
                })
            } catch (e) { }
        }
        this.state = { //状态机变量声明
            normalText,
            specialText,
        }
    }



    //渲染
    render() {
        const { normalText,
            specialText, } = this.state
        if (normalText && normalText.length > 0) {
            return (
                <Text >
                    {normalText.map((obj, i) => {
                        return (<Text>{obj}
                            <Text style={{ color: 'red' }}>{specialText[i]}</Text>
                        </Text>)
                    })}
                </Text>
            )
        }
        return (
            <Text >{this.props.str}</Text>
        )

    }
}