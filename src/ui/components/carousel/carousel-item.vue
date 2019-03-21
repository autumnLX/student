<template lang="pug">
  div.carousel-item(v-if="show" :style="{webkitTransform:translate,transform:translate,zIndex:zIndex}" 
  :class="[{isAnmaitioning:isAnmaitioning}, carousel.type, {active:index === 0}]"
  @click="carousel.anmiate(index)()") {{index}}
    slot
</template>

<script>
export default {
  name: 'carousel-item',
  data () {
    return {
      scale: 1,
      oldIndex: -2,
      inStage: false,
      u_index: -1,
      index: -1
    }
  },
  inject: ['carousel'],
  computed: {
    uitl () {
      return this.carousel.type === 'card' ? 2 : 1
    },
    translate () {
      if (this.carousel.type === 'card') {
        if (this.index === 0) {
          return `translateX(${this.carousel.width / 4}px) scale(1)`
        } else if (this.index < 0) {
          return `translateX(${(this.index + 0.9) * this.carousel.width / 2}px) scale(0.8)`
        } else if (this.index > 0) {
          return `translateX(${(this.index + 0.1) * this.carousel.width / 2}px) scale(0.8)`
        }
      }
      const y = this.index * this.carousel.width / this.uitl
      return `translateX(${y}px) scale(1)`
    },
    show () {
      return this.carousel.width > 0
    },
    isAnmaitioning () {
      return this.index > -3 && this.index < 3
    },
    zIndex () {
      return 100 - Math.abs(this.index)
    }
  },
  watch: {
    index (v, oldv) {
      this.oldIndex = oldv
    }
  }
}
</script>

<style lang="less">
.carousel-item {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: none;
}
.isAnmaitioning {
  display: block;
  transition: transform 0.4s ease-in-out;
}
.carousel-item.card {
  width: 50%;
  z-index: 0;
  // transition: transform 0.4s ease-in-out;
}
</style>
