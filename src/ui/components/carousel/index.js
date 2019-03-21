import carousel from './main.vue'
carousel.install = function (vue) {
  vue.component(carousel.name, carousel)
}
export default carousel
