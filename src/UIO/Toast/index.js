import Vue from 'vue'
import toastComponent from './App.vue'
const ToastContructor = Vue.extend(toastComponent) // 返回一个实例构造器
const showToast = (options) => {
  const toastDom = new ToastContructor({
    el: document.createElement('div'),
    data() {
      return {
        text: options.text,
        showWrap: options.showWrap,
        duration: options.duration,
        styleObj: options.styleObj,
        iconFlag: options.iconFlag,
        showLayer: options.showLayer ? options.showLayer : false
      }
    }
  })
  document.body.appendChild(toastDom.$el)
  setTimeout(() => {
    toastDom.$data.showWrap = true
  }, toastDom.$data.duration - 1750)
  setTimeout(() => {
    toastDom.$data.showWrap = false
    toastDom.$data.showLayer = false
  }, toastDom.$data.duration)
}
export default showToast
