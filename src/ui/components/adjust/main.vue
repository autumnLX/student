<template lang="pug">
  div.adjust(draggable="false")
    slot
    div.left(ref="left" :style="{width:width+'px'}")
      div(@click.stop="click")
        p.line
        p.has(:style="{width:left+'px'}")
      i.spot(@mousedown.stop="mousedown" :style="{left:left-iconWidth+'px'}" ref="spot")
</template>
<script>
export default {
  name: 'adjust',
  props: {
    width: {
      type: Number,
      default: 100,
    },
    start_position: {
      type: Number,
      default: 0
    },
    iconWidth: {
      type: Number,
      default: 9
    }
  },
  data () {
    return {
      left: 0,
      start_clientX: null
    }
  },
  methods: {
    mousemove (e) {
      this.start_clientX = this.$refs['left'].getBoundingClientRect().left
      let a = e.clientX - this.start_clientX
      if (a <= 0) a = 0
      if (a >= this.width) a = this.width
      this.left = a
      return false
    },
    mouseup () {
      window.removeEventListener('mousemove', this.mousemove)
      window.removeEventListener('mouseup', this.mouseup)
      this.$emit('set', this.left)
      return false
    },
    start () {
      this.start_clientX = this.$refs['left'].getBoundingClientRect().left
    },
    click (e) {
      this.mousemove(e)
    },
    mousedown () {
      window.addEventListener('mousemove', this.mousemove)
      window.addEventListener('mouseup', this.mouseup)
    }
  },
  watch: {
    start_position () {
      this.left = this.start_position
    }
  },
  mounted () {
    this.left = this.start_position
  },
  destroyed () {
    this.mouseup()
  }
}
</script>
<style lang="less" scoped>
@image-base-url: "../../image";
p {
  margin: 0;
  padding: 0;
}
.adjust {
  display: flex;
  align-items: baseline;
  .left {
    position: relative;
    width: 100%;
    cursor: pointer;
    > div {
      height: 20px;
    }
  }
  .line {
    width: 100%;
    height: 4px;
    background: #53cc92;
    position: absolute;
    top: 8px;
  }
  .has {
    height: 4px;
    background: #fff;
    position: absolute;
    top: 8px;
  }
  .spot {
    position: absolute;
    top: 1px;
    width: 18px;
    height: 18px;
    display: block;
    border-radius: 50%;
    background-image: url("@{image-base-url}/pic_holdcircle.png");
  }
  -webkit-touch-callout: none; /* iOS Safari */

  -webkit-user-select: none; /* Chrome/Safari/Opera */

  -khtml-user-select: none; /* Konqueror */

  -moz-user-select: none; /* Firefox */

  -ms-user-select: none; /* Internet Explorer/Edge */

  user-select: none; /* Non-prefixed version, currently
not supported by any browser */
}
</style>

