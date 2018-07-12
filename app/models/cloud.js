import {createAction, NavigationActions} from '../utils'
import {request} from "../utils/request"
import {parse} from "qs"
import {Toast} from 'antd-mobile'
import { timeString } from '../utils/help'

export default {
    namespace: 'cloud',
    state: {
        currentCount:0,
        totalCount:0,
        accoutNum:0,
        energyList:[],
        bannerList: [],
        bannerDetail:{},
        bannerLists: [],
        bannerListC: [],
        awardResult:[],
        type: 1
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
        *getAwardCount({payload},{call, put}){
            const data = yield call(request, 'GET',{url: `/api/service.promotion.lottery.award.statistics.count?param=${JSON.stringify(payload)}`, params: {}})
            if(data.success){
                if(payload.request.endGetTime){
                    yield put(createAction('updateState')({ currentCount: data.data}))
                }else{
                    yield put(createAction('updateState')({  totalCount: data.data}))
                }
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getEnergyList({payload}, {call, put, select}){
            const data = yield call(request, 'GET', {url: `/api/finance.acccount.findTopBalanceByTypes?param=${JSON.stringify(payload)}`, params:{}})
            let array = []
            if(data.success){
                data.data && data.data.map(item =>{
                    if(item.accountId != '1805071809265762939'){
                        array.push(item)
                    }
                })
                yield put(createAction('updateState')({  energyList: array }))
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getBanner({payload,callback}, {call, put, select}){
            const data = yield call(request, 'GET', {url: `/api/cms.article.pageArticleByParentIdAndPostStatus?param=${JSON.stringify(payload)}`,params: {}},false)
            if(data.success){
                data.data.data.map(item =>{
                    item.timeStr = timeString(item.createdAt, 'yyyy-MM-dd hh:mm')
                })
                yield put(createAction('updateState')({  bannerList: data.data.data.length>0?data.data.data:[] }))
                if(callback){
                    callback()
                }
            }else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getBanners({payload,callback}, {call, put, select}){
            const data = yield call(request, 'GET', {url: `/api/cms.article.pageArticleByParentIdAndPostStatus?param=${JSON.stringify(payload)}`,params: {}})
            if(data.success){
                data.data.data.map(item =>{
                    item.timeStr = timeString(item.createdAt, 'yyyy-MM-dd hh:mm')
                })
                yield put(createAction('updateState')({  bannerListC: data.data.data.length>0?data.data.data:[] }))
                if(callback){
                    callback()
                }
            }else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getBannerList({payload,callback}, {call, put, select}){
            const data = yield call(request, 'GET', {url: `/api/cms.article.pageArticleByParentIdAndPostStatus?param=${JSON.stringify(payload)}`,params: {}})
            if(data.success){
                data.data.data.map(item =>{
                    item.timeStr = timeString(item.createdAt, 'yyyy-MM-dd hh:mm')
                })
                yield put(createAction('updateState')({  bannerLists: data.data ? data.data.data : []}))
                if(callback){
                    callback()
                }
            }else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getBannerDeatil({payload},{call, put, select}){
            const data = yield call(request, 'GET', {url: `/api/cms.article.parentId.tree.list?param=${JSON.stringify(payload)}`,params:{}})
            if(data.success){
                yield put(createAction('updateState')({  bannerDetail:data.data }))
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getUserNum({payload}, {call, put, select}){
            const data = yield call(request, 'GET', {url: `/api/user.account.common.totalNum`, params: {}})
            if(data.success){
                yield put(createAction('updateState')({  accoutNum: data.data }))
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *awardResultRoll({payload}, {call, put}){
            const data = yield call(request, 'GET', {url: `/api/service.promotion.lottery.awardResult.roll?param=${JSON.stringify(payload)}`, params:{}}, false)
            if(data.success){
                console.log(data)
                yield put(createAction('updateState')({  awardResult: data.data }))
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        }
    }
}