import { Toast } from 'antd-mobile'
import {Platform} from 'react-native'
import config from '../../config'
import { Storage, NavigationActions } from '../utils'
const BASE_URL = config.API

const platform = {'android': 'Android', 'ios':'iOS'}

function generateUrl(url) {
    // if (url.indexOf('{') !== -1) {
    //   let param = url.slice(url.indexOf('{'));
    //   let api = url.substring(0, url.indexOf('{'));
    //   param = JSON.parse(param);
    //   url = api + JSON.stringify(tickOutEmpty(param));
    // }

    if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
        return url
    }
    return joinUrl(BASE_URL, url)
}

function joinUrl(host, spec) {
    return host + spec
}

function queryUrl(url, items) {
    let str = [];
    for (let key in items) {
        if (items.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(items[key]));
        }
    }
    const query = str.join('&');
    if (query.length > 0) {
        if(url.indexOf('?') >= 0){
            return url + '&' + query;
        }
        return url + '?' + query;
    }
    return url;
}

function parseJSON(response) {
    return response.json();
}

getAccessToken = async () => {
    var userInfo = await Storage.get('userInfo')
    return userInfo && userInfo.accessToken + '@' + userInfo.accountCommonDTO.role + '@' + config.APPKEY
}
/**
 * @param {string} url 接口地址
 * @param {string} method 请求方法：GET、POST，只能大写
 * @param {JSON} [params=''] body的请求参数，默认为空
 * @return 返回Promise
 */
request = async (method, requestHandler, isShowLoading = true) => {
    let target = generateUrl(requestHandler.url)
    let params = requestHandler.params

    isShowLoading && Toast.loading('加载中...')

    let form

    let headers = { Accept: 'application/json', 'Content-Type': 'application/json', platform: platform[Platform.OS]}

    const options = {
        dataType: "json",
        headers: headers,
        method: method
    };

    if (requestHandler.isToken === undefined || requestHandler.isToken) {
        headers.Authorization = await getAccessToken() ? await getAccessToken() : config.APPKEY
    } else {
        headers.Authorization = config.APPKEY
    }

    if (method === 'POST' || method === 'PUT') {
        if (params instanceof FormData) {
            options.body = params
            delete options.headers['Content-Type']
        } else {
            form = new FormData()
            form.append('bodyContent', JSON.stringify(params))
            options.body = JSON.stringify(params)
        }
    }else{
        target = queryUrl(target, params)
    }
    // console.log('request url:', target, options)  //打印请求参数

    return new Promise(function (resolve, reject) {
        fetch(target, options).then((response) => response.json())
            .then((responseData) => {
                Toast.hide()
                // console.log('res:', target, responseData) //网络请求成功返回的数据
                successResponse(responseData,resolve)
            })
            .catch((err) => {
                Toast.hide()
                Toast.offline('网络连接失败 !!!')
                // console.log('err:', target, err)     //网络请求失败返回的数据
            })
    })
}

function successResponse(data, resolve) {
    if ((typeof data) !== 'object') {
        data = JSON.parse(data)
    }
    if (data.code === '500') {
        resolve(data)
    } else if(data.serverCode === '99999999') {
        data.msg = '网络繁忙，请稍后再试'
        resolve(data)
    }else if(data.serverCode === '306'){
        data.msg = '亲,您操作太频繁,请降低手速!'
        resolve(data)
    }else if(data.serverCode === '307'){
        data.msg  = '亲,您操作太频繁,已经拉到小黑屋,请休息一下再试!'
        resolve(data)
    }else if(data.serverCode === '302'){
        // Storage.remove('userInfo')
        data.msg  = '登录失效!'
        this.wab_dispatch({
            type: 'app/cleLogin'
        })
        //this.wab_dispatch(NavigationActions.navigate({routeName: 'Login'}))
        resolve(data)
    }else{
        resolve(data)
    }
}

module.exports.request = request