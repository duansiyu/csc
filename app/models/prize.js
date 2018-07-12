import {createAction, NavigationActions} from '../utils'
import {request} from "../utils/request"
import {parse} from "qs"
import {Toast} from 'antd-mobile'

export default {
    namespace: 'prize',
    state: {
        btnDisabled: false,
        selectAdd: {},
        prizeList:[],
        prizeResult:{},
        orderId: null,
        addresssList:[],
        Logistics:{},
        defaultAdd:{},
        orderList:[],
        orderDetail:{},
        awrardList:[],
        currentPage: 1,   // 设置加载的第几次，默认是第一次
        pageSize: 15,      //返回数据的个数
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏
        searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    },
    reducers: {
        saveAwrardList(state, {payload}) {
            let {awrardList} = state
            let {data} = payload.awrardList
            if (awrardList.data) {
                payload.awrardList.data = awrardList.data.concat(data)
            }
            payload.awrardList.data.map(item =>{
                if(!item.getTime){ //未领取
                    if(item.overdue){
                        item.status = 4
                    }else {
                        if(item.awardDTO.awardType == 80){
                            item.status = 80
                        }else{
                            item.status = 1
                        }
                    }
                }else{  //已经领取
                    if(item.awardDTO.awardType == 80){
                        item.status = 2
                    }else if(item.awardDTO.awardType == 3){
                        item.status = 5
                    } else{
                        item.status = 3
                    }
                }
            })
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
        *getPrizeList({ payload ,callback}, { call, put }) {
            const data = yield call(request, 'GET', { url: `/api/facade.csc.activity.redPacket.query?param=${JSON.stringify(payload)}`, params: { } },false)
            if (data.success) {
                yield put(createAction('updateState')({  prizeList: data.data }))
                callback(data.data)
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getRedPacket({ payload ,callback}, { call, put }) {
            const data = yield call(request, 'POST', {url: '/api/facade.csc.activity.get.redPacket',params:{...payload}})
            if(data.success){
                callback(data)
                yield put(createAction('updateState')({ prizeResult:data }))
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getBanner({payload}, {call, put}){
            const data = yield call(request, 'GET', {url: `/api/cms.article.pageArticleByParentIdAndPostStatus?param=${JSON.stringify(payload)}`, params: {}})
            if(data.success){
                yield put(createAction('updateState')({  bannerList: data.data.data }))
            }else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
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
        *getAwardResultLists({payload, callback}, {call, put}){
            const data = yield call(request, 'GET',{url: `/api/service.promotion.lottery.awardResult.page?param=${JSON.stringify(payload)}`,params:{}})
            if (data.success) {
                yield put({
                    type:'saveAwrardList',
                    payload:{
                        awrardList: data.data,
                        currentPage: data.data.currentPage,
                        searchLoadingComplete: data.data.pageCount == data.data.currentPage || data.data.currentPage > data.data.pageCount ? true : false,
                        searchLoading: data.data.pageCount > data.data.currentPage ? true : false
                    },
                })
                if(callback){
                    callback({ currentPage: data.data.currentPage,searchLoadingComplete: data.data.pageCount == data.data.currentPage || data.data.currentPage > data.data.pageCount ? true : false,searchLoading: data.data.pageCount > data.data.currentPage ? true : false})
                }
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *financeRedPacket({payload,callback}, {call, put}){
            yield put({
                type:'updateState',
                payload: {btnDisabled: true}
            })
            const data = yield call(request, 'POST', {url: '/api/facade.csc.activity.finance.redPacket',params:{...payload}})
            if(data.success){
                callback(data.data)
            }else{
                yield put({
                    type:'updateState',
                    payload: {btnDisabled: false}
                })
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *selectByUserId({payload,callback},{call, put}){
            const data = yield call(request, 'GET',{url: `/api/user.common.address.selectByUserId?param=${JSON.stringify(payload)}`,params:{}})
            if(data.success){
                let response = data.data
                let defaultAdd  ={}
                response.map((item) =>{
                    if(item.isDefault == 1){
                        defaultAdd = item
                    }
                })
                yield put({
                    type: 'updateState',
                    payload:{
                        addresssList:data.data,
                        defaultAdd: defaultAdd
                    }
                })
                if(callback){
                    callback(defaultAdd)
                }
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *getOrderDetail({payload,callback},{call}){
            const data = yield call(request, 'GET',{url: `/api/trade.order.getOrderByThirdNo?param=${JSON.stringify(payload)}`,params:{}})
            if (data.success) {
                if(callback){
                    callback(data.data.trackingNumber,data.data.addressDTO,data.data)
                }
            } else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *setDataPrizeResultAct({payload,callback},{call, put}) {
            yield put({
                type:'setDataPrizeResult',
                payload:{
                    ...payload
                }
            })
            if(callback){
                callback()
            }
        },
        *getLogisticsMessage({payload, callback},{call, put}){
            const data = yield call(request, 'GET',{url: `/api/logistics.message.queryLogisticsMessage?param=${JSON.stringify(payload)}`,params:{}})
            if(data.success){
                callback(data.data)
                yield put({
                    type: 'updateState',
                    payload:{
                        Logistics:data.data
                    }
                })
            }else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *orderRedPacket({payload, callback}, {call}){
            const data = yield call(request, 'POST', {url: '/api/facade.csc.activity.order.redPacket',params:{...payload}})
            if(data.success){
                if(callback){
                    callback(data.data)
                }
            }else{
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *updateOrderAddress({payload,callback}, {call, put}){
            yield put({
                type:'updateState',
                payload: {btnDisabled: true}
            })
            const data = yield call(request, 'POST',{url:'/api/facade.csc.updateAddress',params:{...payload}})
            if(data.success){
                Toast.info('领取成功', 2, null, false)
                callback()
            }else{
                Toast.info(data.msg, 1.5, null, false)
                yield put({
                    type:'updateState',
                    payload: {btnDisabled: false}
                })
            }
        },
        *deleteAddress({payload,callback}, {call}){
            const data = yield call(request, 'PUT',{url:'/api/domain.user.common.address.delete',params:{...payload}})
            if(data.success){
                Toast.info('删除成功', 2, null, false)
                callback()
            }else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *updateAddress({payload,callback}, {call}){
            const data = yield call(request, 'PUT',{url:'/api/domain.user.common.address.update',params:{...payload}})
            if(data.success){
                callback()
            }else {
                Toast.info(data.msg, 1.5, null, false)
            }
        },
        *addAddress({payload,callback},{call,put}){
            yield put({
                type:'updateState',
                payload: {btnDisabled: true}
            })
            const data = yield call(request, 'POST',{url: '/api/domain.user.common.address.add', params:{...payload}})
            if(data.success){
                callback()
            }else {
                Toast.info(data.msg, 1.5, null, false)
            }
            // yield put({
            //     type:'updateState',
            //     payload: {btnDisabled: false}
            // })
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