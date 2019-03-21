import { on } from '../utils/dom'
let num = 0
const nodeList = []
let startel
const ctx = '@kmctxcontent'
on(document, 'mousedown', el => (startel = el))
on(document, 'mouseup', el => {
  nodeList.forEach(node => {
    node[ctx].documentHandler && node[ctx].documentHandler(startel, el)
  })
})

function createDocumentHandler(el, binding, vnode) {
  return function(mousedown = {}, mouseup = {}) {
    if (
      !mousedown.target ||
      !mouseup.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target
    ) {
      return
    }
    if (binding.expression && vnode.context[binding.expression]) {
      vnode.context[binding.expression]()
    } else {
      el[ctx].fn && el[ctx].fn()
    }
  }
}
export default {
  bind(el, binding, vnode) {
    let id = num++
    el[ctx] = {
      id: id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      fn: binding.value
    }
    nodeList.push(el)
  },
  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
    el[ctx].fn = binding.value
  },
  unbind(el) {
    let len = nodeList.length

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    delete el[ctx]
  }
}
