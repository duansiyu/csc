const validateType = {
    'mobile': /^(13|15|18)\d{9}$/i,                         //手机号码
    'idCard': /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,   //验证身份证
    'unNormal': /.+/i,                                      //验证是否包含空格和非法字符
    'zip': /^[1-9]\d{5}$/i,                                 //验证邮政编码
    'chs': /^[\u0391-\uFFE5]+$/,                            //验证中文（真实姓名）
    'english': /^[A-Za-z]+$/i,                              //验证英文
    'chiEng':/[\u4e00-\u9fa5_a-zA-Z]/,                      //中文和英文（海外姓名）
    'chiEngNum':/[\u4e00-\u9fa5_a-zA-Z0-9]/,                //中文、英文、数字（海外证件）
    'number': /^[0-9]+.?[0-9]*$/,                           //验证数字
    'mon': /^(([1-9]\d*)|\d)(\.\d{1,2})?$/,                 //验证整数或小数
    'integer': /^[+]?[1-9]\d*$/,                            //验证最小为1的整数
    'int': /^[+]?[0-9]\d*$/,                                //验证整数
    'face':/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, //表情包
}

const validateTypeMsg = {
    'pwdA': {
        type: /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/,
        msg: '密码必须为6~16位的数字、字母及符号任意两种的组合4343'
    },        //数字、字母及任意字符的两种组合(登录密码)
    'pwdB': {
        type: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*]+$)[0-9A-Za-z~!@#$%^&*]{6,16}$/,
        msg: '密码必须为数字加字符'
    },           //数字加任意字符组合(登录密码)
    'payPwd':{
        type: /^[0-9]{6}$/,
        msg: '密码必须为6位纯数字'
    },       //6位纯数字（支付密码）
}

function validator(type, value) {
    return validateType[type].test(value)
}

function validateMsg(type, value) {
    var res = {
        result: validateTypeMsg[type].type.test(value),
        msg: validateTypeMsg[type].msg
    }
    return res
}

module.exports = {
    validator: validator,
    validateMsg: validateMsg
}