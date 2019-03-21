import button from './main.vue'
button.install = function (vue) {
  vue.component(button.name, button)
}
export default button
