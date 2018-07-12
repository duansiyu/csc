import {createAction, NavigationActions} from '../utils'
import {request} from "../utils/request"
import {parse} from "qs"
import {Toast} from 'antd-mobile'
import config from "../../config";

export default {
    namespace: 'home',
    state: {
        signExit: false,
        energyNum: 0,
        energy: [],
        myenergy: [],
        checked: false,
        updataVersionInfo: {},
        updataVersion: false,
        signModal: false
    },
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        },
    },
    effects: {
        * getAwardResultList({ payload, callback }, { call, put}) {
            const data = yield call(request, 'GET', {
                url: `/api/service.promotion.lottery.awardResult.list?param=${JSON.stringify(payload)}`, params: {}
            })
            if (data.success) {
                yield put(createAction('updateState')({ energy: data.data}))
                callback(data.data)
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *signExit({ payload, callback }, { call, put}) {
            const data = yield call(request, 'GET', {
                url: `/api/facade.csc.sign.exit?param=${JSON.stringify(payload)}`, params: { }
            })
            if (data.success) {
                if(callback){
                    callback(data.data)
                }
                yield put(createAction('updateState')({ signExit: data.data}))
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getBalance({ payload }, { call, put }) {
            const data = yield call(request, 'GET', {
                url: `/api/finance.acccount.findTotalBalanceByTypes?param=${JSON.stringify(payload)}`, params: { }
            }, false)
            if (data.success) {
                yield put(createAction('updateState')({ energyNum: data.data }))
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *joinGame({ payload, callback }, { call, put}) {
            const data = yield call(request, 'GET', {
                url: `/api/facade.csc.join.game?param=${JSON.stringify(payload)}`, params: { }
            },false)
            if (data.success) {
                if(callback){
                    callback()
                }
                yield put(createAction('updateState')({ checked: data.data }))
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *homeSign({ payload, callback }, { call, put}) {
            const data = yield call(request, 'POST', {
                url: '/api/facade.csc.sign', params: { ...payload }
            },false)
            if (data.success) {
                callback()
                yield put(createAction('updateState')({ signExit: true }))
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *joinGameExit({ payload, callback }, { call ,put}) {
            const data = yield call(request, 'GET', {
                url: `/api/facade.csc.play.game.exit?param=${JSON.stringify(payload)}`, params: { }
            }, false)
            if (data.success) {
                callback(data.data)
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getAwardResultLists({ payload }, { call, put}) {
            const data = yield call(request, 'GET', {
                url: `/api/service.promotion.lottery.awardResult.list?param=${JSON.stringify(payload)}`, params: { }
            }, false)
            if (data.success) {
                yield put(createAction('updateState')({  myenergy: data.data }))
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *receiveAward({ payload, callback }, { call}) {
            const data = yield call(request, 'POST', {
                url: '/api/facade.csc.activity.get.award', params: { ...payload }
            }, true)
            if (data.success) {
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *playGame({ payload, callback }, { call, put}) {
            const data = yield call(request, 'POST', {
                url: '/api/facade.csc.play.game', params: { ...payload }
            })
            if (data.success) {
                yield put({
                    type: 'app/updateState',
                    payload: {tab: 'Home'}
                })
                callback(data)
            } else {
                yield put({
                    type: 'app/updateState',
                    payload: {tab: 'Home'}
                })
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * getRealInfo({payload}, {call, put}) {
            const data = yield call(request, 'GET', {
                url: `/api/facade.csc.user.info.id?param=${JSON.stringify(payload)}`,
                params: {}
            })
            if (data.success) {
                yield put(createAction('updateState')({realInfo: data.data}))
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getVersionUpdata({payload}, {call, put, select}){
            console.log(config.version)
            const data = yield call(request, 'GET', {url: `/api/dictionary.querySystemTreeByTypeAndAccountId?param=${JSON.stringify({type: 'Version',activeState: 1})}`,params:{}},false)
            if(data.success){
                if(data.data[0].name){
                    var others = JSON.parse(data.data[0].others)
                    if(Number(others.versionCode) > config.versionCode){
                        yield put(createAction('updateState')({updataVersion: true, updataVersionInfo: data.data[0]}))
                    }
                    // if(others.versionCode == config.versionCode){
                    //     console.log('最新版本')
                    // }else{
                    //     console.log('不是最新版本')
                    //
                    // }
                }
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
    }
}