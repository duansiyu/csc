import {createAction, NavigationActions} from '../utils'
import {request} from "../utils/request"
import {parse} from "qs"
import {Toast} from 'antd-mobile'
import { timeString } from '../utils/help'

export default {
    namespace: 'treasure',
    state: {
        currencyType: [],
        currencyList: [],
        currencyDetailList: {},
        isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
        currentPage: 1,   // 设置加载的第几次，默认是第一次
        pageSize: 15,      //返回数据的个数
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏
        searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
        currencyInfo: {
            sourceDayPrice: 0,
            sourceBalance: 0,
            targetDayPrice: 0,
        },
        thirdAccount: [],
        widthdrawAccountList: [],
        availableNum: 0,
        extract_currentPage: 1,
        extractDetailList: {},
        extract_searchLoading: false, //"上拉加载"的变量，默认false，隐藏
        extract_searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    },
    reducers: {
        saveAwrardList(state, {payload}) {
            let {awrardList} = state
            let {data} = payload.awrardList
            if (awrardList.data) {
                payload.awrardList.data = awrardList.data.concat(data)
            }
            return {...state, ...payload}
        },
        saveCurrencyList(state, {payload}) {
            let {currencyList} = payload
            currencyList.map(item => {
                state.currencyType.map(type => {
                    if (item.accountType == type.others) {
                        item.imgUrl = type.imgUrl[0].value
                        item.name = type.name
                        item.others = type.others
                    }
                })
            })
            return {...state, ...payload}
        },
        saveCurrencyDeta(state, {payload}) {
            let {currencyDetailList} = state
            let {data} = payload.currencyDetailList
            data.map(item => {
                item.timeStr = timeString(item.payTime, 'MM-dd hh:mm')
            })
            if (currencyDetailList.data) {
                payload.currencyDetailList.data = currencyDetailList.data.concat(data)
            }
            return {...state, ...payload}
        },
        saveExtractDeta(state, {payload}) {
            let {extractDetailList} = state
            let {data} = payload.extractDetailList
            data.map(item => {
                item.timeStr = timeString(item.createdAt, 'yyyy-MM-dd hh:mm')
            })
            if (extractDetailList.data) {
                payload.extractDetailList.data = extractDetailList.data.concat(data)
            }
            return {...state, ...payload}
        },
        updateState(state, {payload}) {
            return {...state, ...payload}
        },
        setDataPrizeResult(state, {payload}) {
            return {...state, ...payload}
        }
    },
    effects: {
        * getCurrencyList({payload}, {call, put, select}) {
            const data = yield call(request, 'GET', {
                url: `/api/facade.csc.query.currency?param=${JSON.stringify(payload)}`, params: {}
            })
            if (data.success) {
                yield put({
                    type: 'saveCurrencyList',
                    payload: {
                        currencyList: data.data
                    }
                })
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * getCurrencyDetailList({payload,callback}, {call, put, select}) {
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
                if(callback){
                    callback({ currentPage: data.data.currentPage,searchLoadingComplete: data.data.pageCount == data.data.currentPage || data.data.currentPage > data.data.pageCount ? true : false,searchLoading: data.data.pageCount > data.data.currentPage ? true : false})
                }
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getWidthdrawAccount({ payload, callback}, { call, put }) {
            const data = yield call(request, 'GET', { url: `/api/finance.withdraw.account.page?param=${JSON.stringify(payload)}`, params: {}})
            if (data.success) {
                console.log(data)
                yield put({
                    type: 'saveExtractDeta',
                    payload: {
                        extractDetailList: data.data,
                        extract_currentPage: data.data.currentPage,
                        extract_searchLoading: data.data.pageCount == data.data.currentPage || data.data.currentPage > data.data.pageCount ? true : false,
                        extract_searchLoadingComplete: data.data.pageCount > data.data.currentPage ? true : false
                    }
                })
                if(callback){
                    callback({ extract_currentPage: data.data.currentPage,extract_searchLoadingComplete: data.data.pageCount == data.data.currentPage || data.data.currentPage > data.data.pageCount ? true : false,extract_searchLoading: data.data.pageCount > data.data.currentPage ? true : false})
                }
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * getCurrencyTypes({payload},{call, put}) {
            const data = yield call(request, 'GET', {
                url: `/api/dictionary.queryDictionaryListByTypeAndLevel?param=${JSON.stringify({type: 'coin', level: 2, activeState: 1})}`,
                params: {}
            })
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        currencyType: data.data
                    }
                })
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        * getCurrencyQuery({payload}, {call, put}) {
            console.log(payload)
            const data = yield call(request, 'GET', {
                url: `/api/facade.csc.finance.currency.query?param=${JSON.stringify({
                    ...payload
                })}`, params: {}
            })
            console.log('data', data)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        currencyInfo: data.data
                    }
                })
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *currencyTransform({payload, callback}, {call, put}) {
            const data = yield call(request, 'POST', {
                url: '/api/facade.csc.finance.currency.transform', params: {...payload}
            })
            if (data.success) {
                callback()
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *widthDraw({payload, callback},{call}){
            const data = yield call(request, 'POST', { url: '/api/facade.csc.withdraw.submit', params: { ...payload } })
            if (data.success) {
                callback()
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *bizConfig({payload, callback},{call, put}){
            const data = yield call(request, 'GET',{url:`/api/bizConfig.query.findByTypeOrKey?param=${JSON.stringify({
                    ...payload
                })}`,params:{}})
            if(data.success){
                callback(data.data[0])
            }else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *bizConfigQueryFacade({payload, callback},{call, put}){
            const data = yield call(request, 'GET',{url:`/api/bizConfig.query.findByTypeOrKey?param=${JSON.stringify({
                    ...payload
                })}`,params:{}})
            if(data.success){
                callback(data.data[0])
            }else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *cscTransition({payload, callback}, {call, put}){
            const data = yield call(request, 'POST', { url: '/api/facade.csc.currency.transition', params: {...payload}})
            if (data.success) {
                callback()
            }else{
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