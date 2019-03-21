import Vue from 'vue'
import Sidebar from './Sidebar'
import Dialog from './DiaLog/App'
import Nav from './Nav'
import Tab from './Tab'
import Star from './Star'
import Loading from './Loading'
import Pagination from './pagination'
import Charge from './Charge'
import Modal from './Modal'
import Radio from './Radio'

Vue.component('Sidebar', Sidebar)
Vue.component('Dialog', Dialog)
Vue.component('Nav', Nav)
Vue.component('Tab', Tab)
Vue.component('Star', Star)
Vue.component('Loading', Loading)
Vue.component('Charge', Charge)
Vue.component('Pagination', Pagination)

export {
  Modal,
  Radio
}
