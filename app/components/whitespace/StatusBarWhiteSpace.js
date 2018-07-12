/**
 * Created by Tloy on 2018/5/13.
 */

'use strict';

import React, {Component} from 'react';
import {
    View,
} from 'react-native';
import {statusBarHeight, width} from "../../utils/AdapterUtil";
import PropTypes from 'prop-types'

/**
 * 状态栏占位组件,
 */
export default class StatusBarWhiteSpace extends Component {
    static propTypes = {
        color: PropTypes.string
    }

    render() {
        return (
            <View style={{width: width, height: statusBarHeight, backgroundColor: this.props.color || 'transparent'}}/>
        )
    }
}