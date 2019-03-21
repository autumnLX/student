import Axios from '@/axios'
const axios = new Axios()
const instance = axios.instance
// const root = '/api'
axios.setRequestInterceptors(Axios.requestInterceptors.stringifyParams)
axios.setResponseInterceptors(Axios.responseInterceptors.getData)

export function getStudentInfo(cb) {
  return instance.get('/api/students/stuInfo')
    .then(res => {
      typeof cb === 'function' && cb(res.data)
    })
}

export default function install(vue) {
  vue.prototype.$http = instance
}
