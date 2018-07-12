import {createAction, NavigationActions, Storage} from '../utils'
import {request} from "../utils/request"
import {parse} from "qs"
import {Toast} from 'antd-mobile'

export default {
    namespace: 'user',
    state: {
        realInfo: {},
        isPayPassword: false
    },
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        },
    },
    effects: {
        * login({payload, url, callback}, {call, put}) {
            const data = yield call(request, 'POST', {url, params: parse(payload.data), isToken: false})
            if (data.success !== false) {
                Toast.info('登录成功', 1.5, null, false)
                data.data.deviceUid = payload.data.login.deviceUid
                Storage.set('userInfo', data.data)
                yield put(createAction('updateState')({userInfo: data.data, isLogin: true}))
                yield put(
                    NavigationActions.back()
                )
                if (callback) {
                    callback()
                }
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * getRealInfo({payload,callback}, {call, put}) {
            const data = yield call(request, 'GET', {
                url: `/api/facade.csc.user.info.id?param=${JSON.stringify(payload)}`,
                params: {}
            }, false)
            if (data.success) {
                yield put(createAction('updateState')({realInfo: data.data}))
                setTimeout(() =>{
                    if(callback){
                        callback()
                    }
                },500)

            } else {
                Toast.info(data.msg, 1.5, null, false)
            }

        },
        *updateCommonAvatar({ payload, callback}, { call, put, select }) {
            const data = yield call(request, 'PUT', {
                url: '/api/domain.account.common.updateByCondition', params: { ...payload } })
            console.log('jdksjdks',data)
            if (data.success) {
                var userInfo = yield select(state => state.app.userInfo)
                userInfo.accountCommonDTO.avatar = payload.updateCondition.avatar
                yield put({
                    type: 'app/updateState',
                    payload: {userInfo: userInfo,tab: 'Account'}
                })
                Storage.set('userInfo', userInfo)
                Toast.info('修改头像成功', 1.5, null, false)
                callback(payload.updateCondition.avatar)
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *financePasswordExist({ payload, callback }, { call }) {
            const data = yield call(request, 'GET', { url: `/api/domain.account.common.isSetPassword?param=${JSON.stringify(payload)}`, params: {} })
            if (data.success) {
                callback(data.data)
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *userCommonPasswordUpdate({ payload, callback }, { call}) {
            const data = yield call(request, 'POST', {
                url: '/api/user.account.resetPassword', params: { ...payload }
            })
            if (data.success) {
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * userCommonPasswordSet({payload, callback}, {call, put, select}) {
            const data = yield call(request, 'POST', {
                url: '/api/service.ucenter.password.reset', params: {...payload}
            })
            if (data.success) {
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *financePayPasswordExist({ payload, callback }, { call,put }) {
            const data = yield call(request, 'GET', {
                url: `/api/finance.account.pay.password.exist?param=${JSON.stringify(payload)}`, params: { }
            })
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {isPayPassword: data.data}
                })
                callback(data.data)
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *userCommonAcccountPwdSet({ payload, callback }, { call }) {
            const data = yield call(request, 'PUT', {
                url: '/api/finance.acccount.pwd.update', params: { ...payload }
            })
            if (data.success) {
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
            if(callback){
                callback(data.data)
            }
        },
        *userCommonAcccountPwdUpdata({ payload, callback }, { call, put}) {
            const data = yield call(request, 'POST', {
                url: '/api/finance.acccount.pwd.set', params: { ...payload }
            })
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {isPayPassword: true}
                })
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *findPsd({ payload ,callback }, { call}) {
            const data = yield call(request, 'POST', { url: '/api/service.ucenter.password.find', params: { ...payload }})
            if (data.success) {
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * resetPayPsd({payload, callback},{call}){
            const data = yield call(request, 'POST', {url:'/api/finance.acccount.pwd.reset.WithLoginPwdAndSmsCode',params:{...payload}})
            if(data.success){
                if(callback){
                    callback()
                }
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *userCommonRealNameUpdate({ payload, callback }, { call }) {
            const data = yield call(request, 'PUT', { url: '/api/facade.csc.user.update', params: { ...payload }})
            if (data.success) {
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *updateNickName({payload,callback},{call, put, select}){
            const data = yield call(request, 'POST', {url:'/api/user.account.updateNickName',params:{...payload}})
            if(data.success){
                var userInfo = yield select(state => state.app.userInfo)
                userInfo.accountCommonDTO.nickname = payload.nickName
                yield put({
                    type: 'app/updateState',
                    payload: {userInfo: userInfo,tab: 'Account'}
                })
                Storage.set('userInfo', userInfo)
                Toast.info('修改昵称成功', 1.5, null, false)
                callback(payload.nickName)
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * accessTokenRefresh({payload},{call, put}){
            const data = yield call(request, 'POST', {url: `/api/user.accessToken.refresh`,params:parse(payload)}, false)
            if(data.success){
            }else {
                Toast.info(data.msg, 1.5, null, false)
            }
        }
    }
}
