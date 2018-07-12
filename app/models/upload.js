import {createAction, NavigationActions, Storage} from '../utils'
import {request} from "../utils/request"
import {Toast} from 'antd-mobile'

export default {
    namespace: 'upload',
    state: {
    },
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        },
    },
    effects: {
        *uploadImage({ payload, option, callback }, { call, put }) {
            const data = yield call(request, 'GET', { url: `/api/file.webToken?param=${JSON.stringify(payload)}`, params: { } })
            if (data.success === false) {
                Toast.info(data.code + ':' + data.msg, 1.5, null, false)
            } else {
                const result = data.data
                const formData = new FormData()
                const params = result.params
                formData.append('name', params['x:title'])
                formData.append('key', result.objectKey)
                formData.append('policy', result.policy)
                formData.append('OSSAccessKeyId', result.accessId)
                formData.append('success_action_status', 200)
                formData.append('callBack', result.callBack)
                formData.append('signature', result.signature)
                formData.append('x:filetype', params['x:filetype'])
                formData.append('x:directoryid', params['x:directoryid'])
                formData.append('x:traceid', params['x:traceid'])
                formData.append('x:appid', params['x:appid'])
                formData.append('x:title', params['x:title'])
                formData.append('file', option.file)
                const cdnData = yield call(request, 'POST', {url: result.host, params: formData,isToken: false})
                if (cdnData.success === false) {
                    Toast.info('上传头像回调失败', 1.5, null, false)
                }else{
                    callback(cdnData.data.url,option.file.uid)
                }
            }
        }
    }
}