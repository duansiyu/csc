import {createAction, NavigationActions} from "../utils";
import {request} from '../utils/request'
import {Toast} from 'antd-mobile'

export default {
    namespace: 'bank',
    state: {
        bankList:[],
        Adddisabled: false,
        btnDisabled: false,
        selectBank:{},
        defaultBank:{}
    },
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        },
    },

    effects: {
        //掩码
        * getBankList({payload,callback}, {call, put}) {
            const data = yield call(request, 'GET', {url: `/api/finance.third.account.id.page?param=${JSON.stringify(payload)}`, params: {}})
            if (data.success) {
                let responses = data.data.data
                let defaultBank  ={}
                responses.map((item) =>{
                    if(item.isDefault == 1){
                        defaultBank = item
                    }
                })
                yield put({
                    type: 'updateState',
                    payload:{
                        bankList:data.data.data,
                        defaultBank: defaultBank,
                        selectBank:defaultBank
                    }
                })
                if(callback){
                    callback(defaultBank)
                }
            } else {
               Toast.info(data.msg, 1.5, null, false)
            }
        },
        * getBankListAll({payload,callback}, {call, put}) {
            const data = yield call(request, 'GET', {url: `/api/finance.third.account.page?param=${JSON.stringify(payload)}`, params: {}}, false)
            if (data.success) {
                console.log(data)
                let responses = data.data.data
                let defaultBank  ={}
                responses.map((item) =>{
                    if(item.isDefault == 1){
                        defaultBank = item
                    }
                })
                yield put({
                    type: 'updateState',
                    payload:{
                        bankList:data.data.data,
                        defaultBank: defaultBank,
                        selectBank:defaultBank
                    }
                })
                if(callback){
                    callback(defaultBank)
                }
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * AddBank({payload,callback}, {call, put}) {
            yield put({
                type:'updateState',
                payload: {btnDisabled: true}
            })
            const data = yield call(request, 'POST', {
                url: '/api/finance.third.account.add', params: {...payload}
            })
            if (data.success) {
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
            yield put({
                type:'updateState',
                payload: {btnDisabled: false}
            })
        },
        *DelateBank({payload,callback},{call, put}){
            const data = yield call(request, 'PUT', {
                url: '/api/finance.third.account.del', params: {...payload}
            })
            if (data.success) {
                Toast.info('删除成功', 2, null, false)
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *UpdateBank({payload,callback},{call, put}){
            const data = yield call(request, 'PUT', {
                url: '/api/finance.third.account.update.id', params: {...payload}
            })
            if (data.success) {
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },

    }
}