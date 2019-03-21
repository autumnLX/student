import config from './config/dev_login.json'
const { identity, username, password } = config

function setCookie(name, value) {
  var Days = 3;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
}

function dev_login(http) {
  return http.post('/api/menus/unifyLogin', {
    identity,
    username,
    password
  }).then(res => {
    const { protocol, origin, hostname } = location
    const { relate_client } = res.data
    let _origin = origin
    let _host = 'kami' // 客户名称，例如：kami、jimei

    setCookie('identity', identity)
    setCookie('username', username)
    setCookie('password', password)

    if (relate_client && window.ConfigNew.doubleBrandWhiteList.indexOf(relate_client) > -1) {
      _host = relate_client
      if (hostname.indexOf(relate_client) < 0) { // url中不包含客户
        const splitList = hostname.split('.')
        if (splitList.length < 3) { // 防止类似 http(s)://kamienglish.com 的域名
          splitList.unshift(relate_client)
        } else {
          splitList[0] = relate_client
        }
        _origin = protocol + '//' + splitList.join('.')
      }
    }

    setCookie('origin', _origin) // 用于测评系统返回二级域名（如果有）的作业系统
    setCookie('host', _host) // 用于测评系统获取二级logo（如果有）
  })
}
export default dev_login
