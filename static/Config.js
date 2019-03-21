function getUserHost() {
  var urlCustomer = window.location.hostname.split('.')[0].replace(/-cp/g, '')
  var doubleBrandWhiteList = ['jimei']

  if (doubleBrandWhiteList.indexOf(urlCustomer) > -1) {
    return urlCustomer + '/'
  } else return ''
}

window.ConfigNew = {
  customer: 'learning',
  login: '/login',
  jdcpIP: 'https://cp.kami.com/',
  resUrl: 'https://17ks.chivoxapp.com/',
  opPath: 'http://op.kami.com',
  doubleBrandWhiteList: ['jimei'],
  ssoTime: 10,
  newTaskTime: 60,
  sdk: {
    appKey: '1531806588000014',
    secretKey: '7cc9d17165053e2fe4c87075638bc931',
    language: 'zh-CN',
    coreTimeout: 200000,
    sigurl: '/api/jssdksign',
    mode: window.chivox ? window.chivox.MODE.HTML5 : ''
  },
  ScoreLevel: {
    repeat: 2,
    bad: 55,
    good: 70,
    great: 85,
    prefect: 100,
    fireworks: 90,
    badText: '还需努力哦，再来一遍吧！',
    normalText: '读的一般哦！继续努力！',
    goodText: '读的不错哦！继续保持！'
  },
  copyright: 'Copyright 2000',
  logoUrl: function (logo) {
    return 'https://17ks.chivoxapp.com/web-logo/' + (getUserHost() || 'tszx/') + logo
  },
}
