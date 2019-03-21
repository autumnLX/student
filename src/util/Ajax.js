import Jsonp from 'jsonp'
// import config from '@/config/config.js'
const config = {
  proxy: '/api',
}

var $V;

if (!XMLHttpRequest.prototype.sendAsBinary) {
  XMLHttpRequest.prototype.sendAsBinary = function (sData) {
    let nBytes = sData.length
    let ui8Data = new Uint8Array(nBytes)
    for (let nIdx = 0; nIdx < nBytes; nIdx++) {
      ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
    }
    /* send as ArrayBufferView...: */
    this.send(ui8Data);
    /* ...or as ArrayBuffer (legacy)...: this.send(ui8Data.buffer); */
  };
}

/**
 * 初始化
 */
function importVue(Vue) {
  $V = Vue
}

/**
 * 扁平化数组，数组里面可以无限嵌套数组，但不可嵌套对象
 * @param {String} key
 * @param {Array} array
 */
const flattenArray = (key, array) => {
  let str = ''

  array.forEach((o, i) => {
    let k = `${key}[${i}]`
    if (typeof o === 'string' || typeof o === 'number') {
      str += `&${k}=${o}`
    } else if (o instanceof Array) {
      str += '&' + flattenArray(k, o)
    } else {
      // 对象和方法都自动忽略
    }
  })

  return str.substring(1)
}

/**
 * 序列化对象，对象可嵌套数组，不可嵌套对象
 * @param {Object} data
 */
const normalize = (data) => {
  let queryString = ''

  if (typeof data === 'object') {
    for (let key in data) {
      if (typeof data[key] === 'string' || typeof data[key] === 'number') {
        queryString += `&${key}=${data[key]}`
      } else if (data[key] instanceof Array) {
        queryString += '&' + flattenArray(key, data[key])
      } else {
        // 对象和方法自动忽略
      }
    }
  }

  return queryString.substring(1)
}

/**
 * 新 - 序列化参数（jq 的 $.param() 源码） - 方法忽略
 * @param {Object} data
 */
var r20 = /%20/g
var rbracket = /\[\]$/
const buildParams = function (prefix, obj, add) {
  var name;
  if (Array.isArray(obj)) {
    obj.forEach(function (v, i) {
      if (rbracket.test(prefix)) {
        add(prefix, v);
      } else {
        buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, add)
      }
    });
  } else if (typeof obj === 'object') {
    for (name in obj) {
      buildParams(prefix + '[' + name + ']', obj[name], add)
    }
  } else {
    add(prefix, obj)
  }
}

const handleParam = function (param) {
  var prefix
  var result = []
  var add = function (key, value) {
    value = (value == null ? '' : value)
    result[result.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value)
  }
  if (Array.isArray(param)) {
    param.forEach(function (p) {
      add(p.name, p.value)
    })
  } else {
    for (prefix in param) {
      buildParams(prefix, param[prefix], add)
    }
  }
  return result.join('&').replace(r20, '+')
}

/**
 * 处理请求成功的返回值
 */

// 兼容老ajax
function handleResData(res, callback, isJsonP) {
  const status = res.status

  if (status === 2) { // 登录超时
    location.href = window.ConfigNew.login
  } else if (status === 2001) { // 权限错误
    location.href = window.ConfigNew.login
  } else if (status === 1 || status === 4301) {
    if (typeof callback === 'function') {
      isJsonP ? callback('', res) : callback(res)
    }
  } else if (status === 2101 || status === 2102) { // 非VIP用户查看VIP内容
    $V.$router.push('/stu')
  } else {
    $V.$store.commit('showErrDialog', {
      errText: res.info,
      btnText: $V.$t('dialog.iknow')
    })
  }
}

const createRequest = (callback, notNeedStatus, isJsonP) => {
  let request = new XMLHttpRequest()

  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        let response = JSON.parse(request.responseText)
        if (notNeedStatus) typeof callback === 'function' && callback(response)
        else handleResData(response, callback, isJsonP)
      } else {
        console.info(request.status)
      }
    }
  }

  return request
}

const $get = (url, data, callback, serverUrl, notNeedStatus) => {
  let isJsonP = false
  if (serverUrl === '/jsonp') isJsonP = true
  let request = createRequest(callback, notNeedStatus, isJsonP)
  let _url = (serverUrl || config.proxy) + url

  if (data) {
    let _param = normalize(data)
    if (_url.match(/\?/)) {
      _url += _param ? '&' + _param : ''
    } else {
      _url += _param ? '?' + _param : ''
    }
  }

  request.open('GET', _url)
  request.setRequestHeader('Accept', 'application/json')
  request.send()
}

const $post = (url, data, callback, serverUrl, notNeedStatus) => {
  let request = createRequest(callback, notNeedStatus)
  let _url = (serverUrl || config.proxy) + url

  request.open('POST', _url)
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded charset=utf-8')
  request.send(normalize(data))

  return request
}

const $jsonp = (url, params, callback) => {
  /* global process:true */
  if (process.env.NODE_ENV === 'development') {
    $get(url, params, callback, '/jsonp')
  } else {
    let p = Object.assign({
      name: 'jsonpCallback' + new Date().getTime() + '_' + (Math.random() * Math.pow(10, 17)).toString().split('.')[0]
    }, params)

    Jsonp(window.ConfigNew.jdcpIP + url, p, (errs, res) => {
      if (res.status === 1) {
        typeof callback === 'function' && callback(errs, res)
      } else {
        $V.$store.commit('showErrDialog', {
          errText: res.info,
          btnText: $V.$t('dialog.iknow')
        })
      }
    })
  }
}

const $upload = (url, file, callback, name = 'file') => {
  let boundary = '----' + Date.now().toString(16)
  let reader = new FileReader()
  let request = createRequest(callback)

  reader.onloadend = function () {
    let data = '--' + boundary + '\r\n' +
      `Content-Disposition: form-data; name="${name}"; filename="${file.name}"\r\n` +
      `Content-Type: ${file.type}\r\n` +
      '\r\n' +
      reader.result +
      '\r\n' +
      '--' + boundary + '--\r\n'

    request.sendAsBinary(data)
  }

  request.open('POST', config.proxy + url)
  request.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary)
  reader.readAsBinaryString(file)
}

// 新方法 统一api
function handleResDataNew(res, callback, addons) {
  if (res.status === 2) { // 登录超时
    location.href = window.ConfigNew.login
  } else if (res.status === 2001) { // 权限错误
    location.href = window.ConfigNew.login
  } else if (res.status === 1 || res.status === 4301) {
    typeof callback === 'function' && callback(res.data, res.status)
  } else {
    $V.$store.commit('showErrDialog', {
      errText: res.info,
      btnText: $V.$t('dialog.iknow')
    })
    typeof addons.failCallback === 'function' && addons.failCallback(res.status, res.info, $V.$t('dialog.iknow'))
  }
}

const createRequestNew = (callback, addons) => {
  let request = new XMLHttpRequest()

  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        if (addons.notNeedJson) typeof callback === 'function' && callback(request.responseText)
        else {
          let response = JSON.parse(request.responseText)
          if (addons.notNeedStatus) typeof callback === 'function' && callback(response)
          else handleResDataNew(response, callback, addons)
        }
      } else {
        console.info(request.status)
      }
    }
  }

  return request
}

const $getNew = (url, data, callback, addons) => {
  let request = createRequestNew(callback, addons)
  let _url = (addons.serverUrl || config.proxy) + url

  if (data) {
    let _param = handleParam(data)
    if (_url.match(/\?/)) {
      _url += _param ? '&' + _param : ''
    } else {
      _url += _param ? '?' + _param : ''
    }
  }

  request.open('GET', _url)
  request.setRequestHeader('Accept', 'application/json')
  request.send()
}

const $postNew = (url, data, callback, addons) => {
  let request = createRequestNew(callback, addons)
  let _url = (addons.serverUrl || config.proxy) + url

  request.open('POST', _url)
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
  request.send(handleParam(data))
}

const $jsonpNew = (url, data, callback, addons) => {
  if (process.env.NODE_ENV === 'development') {
    $getNew(url, data, callback, {
      serverUrl: '/jsonp'
    })
  } else {
    let _url = (addons.serverUrl || window.ConfigNew.jdcpIP + config.proxy) + url

    if (data) {
      _url += '?' + handleParam(data)
    }

    Jsonp(_url, {
      name: 'jsonpCallback' + new Date().getTime() + '_' + (Math.random() * Math.pow(10, 17)).toString().split('.')[0]
    }, (errs, res) => {
      if (addons.notNeedStatus) typeof callback === 'function' && callback(res)
      else handleResDataNew(res, callback, addons)
    })
  }
}

export default {
  init: importVue,
  get: $get,
  post: $post,
  jsonp: $jsonp,
  upload: $upload,
  getNew: $getNew,
  postNew: $postNew,
  jsonpNew: $jsonpNew,
}
