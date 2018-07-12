import {createAction, NavigationActions} from '../utils'
import {request} from "../utils/request"
import {parse} from "qs"
import {Toast} from 'antd-mobile'
import { timeString } from '../utils/help'

export default {
    namespace: 'friend',
    state: {
        friNum:0,
        totalEnergy:0,
        tempEnergy: 0,
        day: '28',
        friNuM:{},
        userInfo:{}
    },
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        },
    },
    effects: {
        *getInviteInfo({payload}, {call, put, select}){
            const data = yield call(request, 'GET', {url: `/api/facade.csc.account.invite.info?param=${JSON.stringify(payload)}`,params:{}})
            if(data.success){
                yield put({
                    type: 'updateState',
                    payload: {
                        totalEnergy: data.data.totalEnergy,
                        tempEnergy: data.data.totalTempEnergy
                    }
                })
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getFriList({payload}, {call, put}){
            const data = yield call(request, 'GET', {url: `/api/user.account.common.levelCount?param=${JSON.stringify(payload)}`, params:{}})
            if(data.success){
                yield put({
                    type: 'updateState',
                    payload:{
                        friNuM: data.data
                    }
                })
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getVerCode({payload}, {call, put, select}){
            const data = yield call(request, 'GET', {url: `/api/user.account.detail.list?param=${JSON.stringify(payload)}`, params: {}})
            if(data.success){
                yield put({
                    type: 'updateState',
                    payload: {
                        userInfo: data.data[0]
                    }
                })
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getDayTime({payload, callback},{call, put, select}){
            const data = yield call(request, 'GET', {url: `/api/bizConfig.query.findByTypeOrKey?param=${JSON.stringify(payload)}`, params: {}})
            if(data.success){
                callback(data.data[0].value1)
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        }
    }
}