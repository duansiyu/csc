import {createAction, NavigationActions} from '../utils'
import {request} from "../utils/request"
import {parse} from "qs"
import {Toast} from 'antd-mobile'

export default {
    namespace: 'income',
    state: {
        dataType: '',
        currencyEarnings: {
            totalAmount: 0,
            yesterdayEarnings: 0,
            totalEarnings: 0,
        },
        energyNum: 0,
        currencyDetailList: {},
        isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
        currentPage: 1,   // 设置加载的第几次，默认是第一次
        pageSize: 15,      //返回数据的个数
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏
        searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    },
    reducers: {
        updateState(state, {payload,callback}) {
            if(callback){
                callback()
            }
            return {...state, ...payload}
        },
        saveCurrencyDeta(state, {payload}) {
            let {currencyDetailList} = state
            let {data} = payload.currencyDetailList
            if (currencyDetailList.data) {
                payload.currencyDetailList.data = currencyDetailList.data.concat(data)
            }
            return {...state, ...payload}
        },
    },
    effects: {
        * getCurrencyEarnings({payload}, {call, put}) {
            const data = yield call(request, 'GET', {
                url: `/api/facade.csc.finance.currency.earnings?param=${JSON.stringify(payload)}`, params: {}
            })
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {currencyEarnings: data.data}
                })
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * getQueryByTypeAndEffectiveDate({payload, callback}, {call, put}) {
            const data = yield call(request, 'GET', {
                url: `/api/finance.assert.interest.config.queryByTypeAndDays?param=${JSON.stringify(payload)}`, params: {}
            })
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {EffectiveDate: data.data}
                })
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getBalance({ payload }, { call, put }) {
            const data = yield call(request, 'GET', {
                url: `/api/finance.acccount.findTotalBalanceByTypes?param=${JSON.stringify(payload)}`, params: { }
            })
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: { energyNum: data.data}
                })
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *interestChangeIn({ payload, callback}, { call }) {
            const data = yield call(request, 'GET', {
                url: `/api/finance.assert.interest.changeIn?param=${JSON.stringify(payload)}`, params: {}
            })
            if (data.success) {
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *interestChangeInOut({ payload, callback}, { call }) {
            const data = yield call(request, 'GET', {
                url: `/api/finance.assert.interest.changeOut?param=${JSON.stringify(payload)}`, params: {}
            })
            if (data.success) {
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * getCurrencyDetailList({payload, callback}, {call, put}) {
            const data = yield call(request, 'GET', {
                url: `/api/finance.trade.page?param=${JSON.stringify(payload)}`, params: {}
            })
            if (data.success) {
                yield put({
                    type: 'saveCurrencyDeta',
                    payload: {
                        currencyDetailList: data.data,
                        currentPage: data.data.currentPage,
                        searchLoadingComplete: data.data.pageCount == data.data.currentPage || data.data.currentPage > data.data.pageCount ? true : false,
                        searchLoading: data.data.pageCount > data.data.currentPage ? true : false
                    }
                })
                callback({ currentPage: data.data.currentPage,searchLoadingComplete: data.data.pageCount == data.data.currentPage || data.data.currentPage > data.data.pageCount ? true : false,searchLoading: data.data.pageCount > data.data.currentPage ? true : false})
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *updataAction({payload,callback},{put}){
            yield put({
                type:'updateState',
                payload: payload
            })
            if(callback){
                callback()
            }
        },
    }
}