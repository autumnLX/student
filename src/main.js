import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App'
import router from './router'
import axios from './api'

import Api from '@/assets/Api'
import store from '@/store/index'
import lang from '@/assets/script/i18n/index'
import Ajax from '@/util/Ajax'
import Util from '@/util/Util'
import '@/UIO/index' // 自定义组件套件
import showToast from '@/UIO/Toast/index'
import vuescroll from 'vuescroll' // 自定义滚动条
import { messagebox } from './ui'

Vue.config.productionTip = false

Vue.use(VueI18n)
Vue.use(vuescroll)
Vue.use(axios)
Vue.use(messagebox)

const i18n = new VueI18n({
  locale: 'zh',
  messages: lang
})

Vue.prototype.$api = Api
Vue.prototype.$util = Util
Vue.prototype.$config = window.ConfigNew
Vue.prototype.$ajax = Ajax // 改完可删
Vue.prototype.$jsonp = Ajax.jsonp // 改完可删
Vue.prototype.$toast = showToast
Vue.prototype.$vuescrollConfig = {
  rail: {
    vRail: {
      width: '4px',
    },
    hRail: {
      height: '4px',
    }
  },
  bar: {
    vBar: {
      background: '#75d6a8'
    },
    hBar: {
      background: '#75d6a8'
    }
  }
}

Vue.mixin({
  methods: {
    getNavHeight() {
      return document.getElementById('nav').getBoundingClientRect().height + 'px'
    },
    writeLog(params) {
      this.$api.writeLog(params)
    }
  }
})

async function init() {
  if (process.env.NODE_ENV === 'development') {
    var a = await import('./develop_login.js')
    await a.default(Vue.prototype.$http)
    render()
  } else {
    render()
  }
}

function render() {
  let $Vue = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    components: {
      App
    },
    template: '<App/>'
  })

  Api.init($Vue)
  Ajax.init($Vue)
}

init()
