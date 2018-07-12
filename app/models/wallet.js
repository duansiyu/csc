import {createAction, NavigationActions} from "../utils";
import {request} from '../utils/request'
import {Toast} from 'antd-mobile'

export default {
    namespace: 'wallet',
    state: {
        wallet:[],
        Adddisabled: false,
        selectwallet:{},
        defaultwallet:{},
        accountType:[],
        btnDisabled: false
    },
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        },
    },

    effects: {
        * AddWallet({payload,callback}, {call, put}) {
            yield put({
                type:'updateState',
                payload: {btnDisabled: true}
            })
            const data = yield call(request, 'POST', {
                url: '/api/finance.bank.card.add', params: {...payload}
            })
            if (data.success) {
                Toast.info('新增成功', 1.5, null, false)
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
            yield put({
                type:'updateState',
                payload: {btnDisabled: false}
            })
        },
        *getType({payload, callback}, {call, put}){
            const data = yield call(request, 'GET',{url:`/api/dictionary.queryDictionaryTreeByType?param=${JSON.stringify(payload)}`, params:{}})
            if(data.success){
                console.log(data)
                yield put({
                    type: 'updateState',
                    payload:{
                        accountType:data.data,
                    }
                })
                let resposne = []
                data.data.map((item,index) =>{
                    let obj = {}
                    obj.value = item.others
                    obj.label = item.name
                    resposne.push(obj)
                })
                if(callback){
                    callback(resposne)
                }
            }else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *findByAccountIdAndType({payload, callback},{call, put}){
            const data = yield call(request, 'GET', {
                url: `/api/finance.acccount.findByAccountIdAndType?param=${JSON.stringify(payload)}`, params: {}
            })
            if(data.success){
                callback(data.data)
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        }
    }
}