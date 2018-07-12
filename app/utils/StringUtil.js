/**
 * 获取字符串的字节长度
 * @param string
 * @returns {number}
 */
export function getStringCharLength(string) {
    var len = 0;
    for (var i = 0; i < string.length; i++) {
        if (string.charCodeAt(i) > 127 || string.charCodeAt(i) == 94) {
            len += 2;
        } else {
            len++;
        }
    }
    return len;
}

/**
 * 按字节长度截取字符串
 * @param string      要截取的字符串
 * @param charLength  字节长度
 * @returns {*}       截取后的字符串
 */
export function getNumberLengthChar(string, charLength) {
    if (getStringCharLength(string) > charLength) {
        let result = ""
        let resultLength = 0
        for (var i = 0; i < string.length; i++) {
            // if (string.charCodeAt(i) > 127 || string.charCodeAt(i) == 94) {
            //中文字符两个字节
            if (string.charCodeAt(i) > 127) {
                if (resultLength + 2 > charLength) {
                    return result
                }
                resultLength += 2;
                result += string.charAt(i)
            } else {   //非中文字符一个字节
                if (resultLength + 1 > charLength) {
                    return result
                }
                resultLength++;
                result += string.charAt(i)
            }
        }
    }
    return string
}

/**
 *字符截取转换
 */
export function strip(num, precision=12) {
    console.log(num)
    return parseFloat(num.toPrecision(precision))
}