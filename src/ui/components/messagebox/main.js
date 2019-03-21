import MessageBoxVue from './main.vue'
let defaults = {
  confirmTxt: '确定',
  cancelTxt: '取消',
  showClose: true,
  type: 'message',
  showButton: true,
  iscenter: true,
  title: '',
  desc: '',
  useHtml: false,
  showCancelButton: true,
  class_rel: 'layer'
}
export default function (Vue) {
  const MessageBoxConstructor = Vue.extend(MessageBoxVue)

  function create(resolve, reject) {
    const messabebox = new MessageBoxConstructor({
      el: document.createElement('div'),
    })
    messabebox.callback = resolve
    messabebox.cancelCall = reject
    return messabebox
  }

  function MessageBox(options) {
    return new Promise((resolve, reject) => {
      const messabebox = create(resolve, reject)
      setdefaults(messabebox, options)
      document.body.append(messabebox.$el)
    })
  }

  function setdefaults(messabebox, options) {
    const op = Object.assign({}, defaults, options)
    for (let key in op) {
      messabebox[key] = op[key]
    }
  }

  function confirm(title, desc, options) {
    return MessageBox(Object.assign({
      cancelTxt: '取消',
      title: title,
      desc: desc,
      type: 'confirm',
      showCancelButton: true
    }, options))
  }

  function alert(title, desc, options = {}) {
    return MessageBox(Object.assign({
      cancelTxt: '',
      title: title,
      desc: desc,
      type: 'error',
      showCancelButton: false
    }, options))
  }
  Vue.prototype.$message = MessageBox
  Vue.prototype.$confirm = confirm
  Vue.prototype.$alert = alert
}
