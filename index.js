//import "./app/index"
// import { AppRegistry } from 'react-native';
// import App from './App';
//
// AppRegistry.registerComponent('tenant_cscs', () => App);
import React from 'react'
import { AppRegistry } from 'react-native'

import dva from './app/utils/dva'
import Router, { routerMiddleware } from './app/router'

import model from './app/models/_map'

const app = dva({
    initialState: {},
    models: model,
    onAction: [routerMiddleware],
    onError(e) {
        console.log('onError', e)
    },
})

const App = app.start(<Router />)

AppRegistry.registerComponent('tanant_cscs', () => App);