import {createAction, NavigationActions, Storage} from '../utils'
import {request} from "../utils/request"
import {parse} from "qs"
import { Toast } from 'antd-mobile'
import config from '../../config'

export default {
    namespace: 'app',
    state: {
        login: false,
        loading: true,
        fetching: false,
        isLogin: false,
        userInfo: {},
        tab: null,
        updataVersionInfo: {},
        updataVersion: false
    },
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        },
    },
    effects: {
        * loadStorage(action, {call, put}) {
            // await Storage.get('userInfo')
            const userInfo = yield call(Storage.get, 'userInfo', true)
            if(userInfo.accessToken){
                yield put(createAction('updateState')({ userInfo: userInfo, isLogin: true}))
            }
        },
        * loadStorages({ callback }, {call, put}) {
            const userInfo = yield call(Storage.get, 'userInfo', true)
            if(userInfo.accessToken){
                yield put(createAction('updateState')({ userInfo: userInfo, isLogin: true}))
                if(callback){
                    callback()
                }
            }else{
                yield call(Storage.set, 'userInfo', false)
                yield put(createAction('updateState')({isLogin: false, userInfo: {}}))
                if(callback){
                    callback()
                }
            }
        },
        * login({payload, url, callback}, {call, put}) {
            const data = yield call(request, 'POST', {url, params: parse(payload.data), isToken: false})
            if (data.success !== false) {
                Toast.info('登录成功', 1.5, null, false)
                data.data.deviceUid = payload.data.login.deviceUid
                Storage.set('userInfo', data.data)
                yield put(createAction('updateState')({ userInfo: data.data, isLogin: true}))
                yield put(
                    NavigationActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Home' })],
                    })
                )
                if(callback){
                    callback()
                }
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }

        },
        * sendVerCode({payload, callback}, {call, put}) {
            const data = yield call(request, 'POST', {url: '/api/facade.csc.sms.sendVerCode', params: parse(payload), isToken: false})
            if (data.success !== false) {
                Toast.info('验证码发送成功', 1.5, null, false)
                if(callback){
                    callback(data.success)
                }
            }else{
                Toast.info(data.msg, 1.5, null, false)
                if(callback){
                    callback()
                }
            }
        },
        * smsLogin({payload, callback}, {call, put}) {
            const data = yield call(request, 'POST', {url: '/api/service.ucenter.sms.login', params: parse(payload.data), isToken: false})
            if (data.success !== false) {
                data.data.deviceUid = payload.data.login.deviceUid
                Storage.set('userInfo', data.data)
                yield put(createAction('updateState')({ userInfo: data.data, isLogin: true}))
                yield put(
                    NavigationActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Home' })],
                    })
                )
                if(callback){
                    callback()
                }
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * register({payload}, {call, put}) {
            const data = yield call(request, 'POST', {url: '/api/service.ucenter.register', params: parse(payload.data), isToken: false})
            if (data.success !== false) {
                Toast.info('注册成功', 1.5, null, false)
                yield put(
                    NavigationActions.back()
                )
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * resetPassword({payload, callback}, {call, put}) {
            const data = yield call(request, 'POST', {url: '/api/service.ucenter.password.find', params: parse(payload.data), isToken: false})
            if (data.success !== false) {
                Toast.info('密码重置成功', 1.5, null, false)
                if(callback){
                    callback()
                }
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * logout(action, {call, put}) {
            const userInfo = yield call(Storage.get, 'userInfo', false)
            if(userInfo.accessToken){
                const data = yield call(request, 'POST', {url: '/api/service.ucenter.logout.base', params: parse({logout: {deviceUid: userInfo.deviceUid, accessToken:userInfo.accessToken}})})
                if (data.success !== false) {
                    Toast.info('退出成功', 1.5, null, false)
                    yield call(Storage.set, 'userInfo', false)
                    yield put(createAction('updateState')({isLogin: false, userInfo: {}}))
                    yield put(
                        NavigationActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Login' })],
                        })
                    )
                }else{
                    Toast.info(data.msg, 1.5, null, false)
                }
            }
        },
        * logoutPwd(action, {call, put}) {
            const userInfo = yield call(Storage.get, 'userInfo', false)
            if(userInfo.accessToken){
                const data = yield call(request, 'POST', {url: '/api/service.ucenter.logout.base', params: parse({logout: {deviceUid: userInfo.deviceUid, accessToken:userInfo.accessToken}})})
                if (data.success !== false) {
                    Toast.info('请重新登录', 1.5, null, false)
                    yield call(Storage.set, 'userInfo', false)
                    yield put(createAction('updateState')({isLogin: false, userInfo: {}}))
                    yield put(
                        NavigationActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Login' })],
                        })
                    )
                }else{
                    Toast.info(data.msg, 1.5, null, false)
                }
            }
        },
        * cleLogin(action, {call, put}) {
            yield call(Storage.set, 'userInfo', false)
            yield put(createAction('updateState')({isLogin: false, userInfo: {}}))
            yield put(
                NavigationActions.navigate({routeName: 'Login'})
            )
        },
        *getVersionUpdata({}, {call, put, select}){
            alert(1);
            console.log(config.version)
            const data = yield call(request, 'GET', {url: `/api/dictionary.querySystemTreeByTypeAndAccountId?param=${JSON.stringify({type: 'Version',activeState: 1})}`,params:{}})
            if(data.success){
                if(data.data[0].name){
                    var others = JSON.parse(data.data[0].others)
                    if(others.versionCode == config.versionCode){
                        console.log('最新版本')
                    }else{
                        console.log('不是最新版本')
                        yield put(createAction('updateState')({updataVersion: true, updataVersionInfo: data.data[0]}))
                    }
                }
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
    },
    subscriptions: {
        setup({dispatch}) {
            //dispatch({type: 'getVersionUpdata'})
            dispatch({type: 'loadStorages'})
            this.wab_dispatch = dispatch
        },
    },
}
