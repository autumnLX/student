import jsonp from 'jsonp'
import axios from 'axios'
import requestInterceptors from './request_interceptors'
import responseInterceptors from './response_interceptors'
import { checkType } from './util'

// 全局配置
// axios.defaults.baseURL = 'https://api.example.com';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

class $axios {
  constructor(config) {
    this.instance = axios.create({
      ...config
    })
    this.instance.jsonp = jsonp
  }

  setInterceptors(type, config) {
    const configType = checkType(config)
    const Interceptors = []
    switch (configType) {
      case 'function':
        Interceptors.push(config)
        break
      case 'array':
        Interceptors.concat(config)
        break
      case 'object':
        for (let i in config) {
          Interceptors.push(config[i])
        }
        break
      default:
        console.error('传参错误')
    }
    Interceptors.forEach(item => {
      if (checkType(item) === 'function') {
        this.instance.interceptors[type].use(item)
      }
    })
  }

  setRequestInterceptors(config) {
    this.setInterceptors('request', config)
  }

  setResponseInterceptors(config) {
    this.setInterceptors('response', config)
  }

  static requestInterceptors = requestInterceptors

  static responseInterceptors = responseInterceptors

  static install(vue) {
    vue.prototype.$http = this.instance
  }
}
export default $axios
