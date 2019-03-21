import carouselItem from '../carousel/carousel-item.vue'
carouselItem.install = function (vue) {
  vue.component(carouselItem.name, carouselItem)
}
export default carouselItem
