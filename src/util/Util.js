// import Config from '../../static/Config'

function browserCheck() {
  var Sys = {};
  var ua = navigator.userAgent.toLowerCase();
  var s;

  if (ua.match(/rv:([\d.]+)/)) {
    s = ua.match(/rv:([\d.]+)/)
    Sys.ie = s[1]
  } else if (ua.match(/msie ([\d.]+)/)) {
    s = ua.match(/msie ([\d.]+)/)
    Sys.ie = s[1]
  } else if (ua.match(/trident\/([\d.]+)/)) {
    s = ua.match(/trident\/([\d.]+)/)
    Sys.ie = s[1]
  } else if (ua.match(/firefox\/([\d.]+)/)) {
    s = ua.match(/firefox\/([\d.]+)/)
    Sys.firefox = s[1]
  } else if (ua.match(/chrome\/([\d.]+)/)) {
    s = ua.match(/chrome\/([\d.]+)/)
    Sys.chrome = s[1]
  } else if (ua.match(/opera.([\d.]+)/)) {
    s = ua.match(/opera.([\d.]+)/)
    Sys.opera = s[1]
  } else if (ua.match(/version\/([\d.]+).*safari/)) {
    s = ua.match(/version\/([\d.]+).*safari/)
    Sys.safari = s[1]
  }

  // 以下进行测试

  if (Sys.ie) {
    Sys.name = 'IE';
    Sys.version = Sys.ie;
  }
  if (Sys.firefox) {
    Sys.name = 'Firefox';
    Sys.version = Sys.firefox;
  }
  if (Sys.chrome) {
    Sys.name = 'Chrome';
    Sys.version = Sys.chrome;
  }
  if (Sys.opera) {
    Sys.name = 'Opera';
    Sys.version = Sys.opera;
  }
  if (Sys.safari) {
    Sys.name = 'Safari';
    Sys.version = Sys.safari;
  }
  return Sys;
}

function isBrowserOK() {
  const browser = browserCheck()
  if ((browser.name === 'IE' || browser.name === 'Chrome') && browser.version.split('.')[0] >= 9) {
    return '1'
  } else {
    return '0'
  }
}

function clearAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?==)/g);
  if (keys) {
    for (var i = keys.length; i--;) {
      if (['auto', 'username', 'password', 'identity'].indexOf(keys[i]) < 0) {
        setCookie(keys[i], '', -1);
      }
    }
  }
}

function getCookieValue(name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    return decodeURIComponent(arr[2])
  } else {
    return null
  }
}

function setCookie(name, value, days) {
  let jdcpIP = window.ConfigNew ? window.ConfigNew.jdcpIP : ''
  let zy = window.location.host.split('.').reverse()
  let cp = jdcpIP.replace(/(http|https):\/\/([^/]*)\//g, '$2').split('.').reverse()
  let lgt = Math.min(zy.length, cp.length)
  let _domain = ''

  for (var i = 0; i < lgt; i++) {
    if (zy[i] === cp[i]) {
      _domain = '.' + zy[i] + _domain;
    } else {
      break;
    }
  }

  let expires
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toGMTString()
  } else {
    expires = ''
  }

  document.cookie = name + '=' + value + expires + '; path=/;domain=' + _domain
}

function loginCookie(submitData, res, hasData) {
  const info = hasData ? res : res.data
  const identity = submitData.identity
  let _shenfen = 'default'

  if (identity === 'student') {
    _shenfen = 'default'
  } else if (identity === 'teacher') {
    _shenfen = 'teacher'
  } else if (identity === 'parent') {
    _shenfen = 'default_pa'
  } else {
    _shenfen = 'default_hm'
  }

  setCookie('badScoreLevel', info.badScoreLevel)
  setCookie('normalScoreLevel', info.normalScoreLevel)
  setCookie('id', info.id)
  setCookie('RoleTypeName', identity) // 登录以后区别身份用，勿改
  setCookie('shenfen', _shenfen) // 3.X系统模板调用相关

  // 以下为埋点所需
  setCookie('accessToken', info.accessToken)
  setCookie('customerInfoId', info.customerInfoId)
  setCookie('userRoleType', info.user_role_type)
  setCookie('clientVersion', info.clientVersion)
  setCookie('serverVersion', info.serverVersion)
  setCookie('identity', identity)
  setCookie('username', submitData.username)
  setCookie('password', submitData.password)
  setCookie('loginFrom', 1)

  if (identity === 'parent') {
    setCookie('number_id', info.number_id)
    setCookie('stuId', info.student_id)
    setCookie('schoolId', info.school_id)
    setCookie('categoryId', info.category_id)
    setCookie('classId', info.school_class_id)
  } else if (identity === 'teacher') {
    setCookie('grade', info.grade)
    setCookie('number_id', info.number_id)
    setCookie('teacher_name', info.teacher_name)
    setCookie('fullName', encodeURIComponent(info.teacher_name))
    setCookie('tip_flag', info.tip_flag)
    setCookie('schoolId', info.school_id)
  } else {
    var userInfo = 'name=' + info.name + '&grade=' + info.category_name + info.class_name + '&stuSchool=' + info.country_name + info.school_name + '&gender=' + (info.gender === '0' ? '女' : '男');
    setCookie('userInfo', userInfo)
    setCookie('stuNumberId', info.number_id)
    setCookie('stuId', info.id)
    setCookie('areaId', info.area_id)
    setCookie('headPic', info.headPic)
    setCookie('nameInfo', encodeURIComponent(info.name))
    setCookie('fullName', encodeURIComponent(info.name))

    if (identity === 'student') {
      setCookie('promote_notice_login', info.has_promote_notice)
      setCookie('promote_notice_join', info.has_confirm_notice)
      setCookie('schoolId', info.school_id)
      setCookie('schoolName', encodeURIComponent(info.school_name))
      setCookie('categoryId', info.category_id)
      setCookie('categoryName', encodeURIComponent(info.category_name))
      setCookie('classId', info.school_class_id)
      setCookie('className', encodeURIComponent(info.class_name))
    }
  }
}

function writeLogParams(param) {
  let _param = ''
  if (getCookieValue('id')) {
    const browser = browserCheck()
    _param = Object.assign({}, {
      accessToken: getCookieValue('accessToken'),
      customerInfoId: getCookieValue('customerInfoId'),
      userId: getCookieValue('id'),
      userRoleType: getCookieValue('userRoleType'),
      actionOrigin: 1, // 动作来源 1.作业系统 2.测评系统 3内容系统 4.前端 等
      action: '', // 动作（操作）名称 标签 不超过
      pushParam: '', // 执行该动作（操作）的附加信息或者参数 如书本名称 建议json格式不超过255长度
      clientType: 1, // 客户端类型 0.未传或未知 1.Web 2.IOS 3.Android
      clientVersion: getCookieValue('clientVersion'),
      serverVersion: getCookieValue('serverVersion'),
      clientInfo: browser.name + ' ' + browser.version,
      userName: getCookieValue('username'),
      fullName: getCookieValue('fullName') || '',
      loginFrom: getCookieValue('loginFrom'),
      timestamp: Date.now(),
      logType: 1, // 日期类型 1正常日志 0异常日志
      schoolId: getCookieValue('schoolId') || '',
      categoryId: getCookieValue('categoryId') || '',
      scId: getCookieValue('classId') || '',
      resId: ''
    }, param)
    _param.pushParam = JSON.stringify(_param.pushParam)
  } else if (localStorage.getItem('kami_track')) {
    const track = JSON.parse(localStorage.getItem('kami_track'))
    _param = Object.assign({}, track, param)
    _param.timestamp = Date.now()
    _param.pushParam = JSON.stringify(_param.pushParam)
  } else {
    // TODO
  }

  return _param
}

let urlSet = {
  examReport: '/web/models/Report/default/self.php',
  rank: '/web/models/RankMessage/self.php',
}

export default {
  browserCheck,
  isBrowserOK,
  clearAllCookie,
  getCookieValue,
  setCookie,
  loginCookie,
  writeLogParams,
  urlSet,
}
