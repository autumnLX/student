import Countdown from './main.vue'
Countdown.install = function (vue) {
  vue.component(Countdown.name, Countdown)
}
export default Countdown
