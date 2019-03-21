<template lang="pug">
  i(class='voice')
    i(:style='{width: width + "px"}')
</template>

<script>
import { random } from '../../src/utils/math.js'
export default {
  name: 'voice_icon',
  data () {
    return {
      width: 0,
      flag: ''
    }
  },
  props: {
    disabled: {
      default: true
    }
  },
  methods: {
    play () {
      clearInterval(this.flag)
      this.flag = setInterval(() => {
        this.width = random(40, 70)
      }, 50)
    }
  },
  mounted () {
    if (!this.disabled) {
      this.play()
    }
  },
  watch: {
    disabled (v) {
      if (!v) {
        this.play()
      } else {
        clearInterval(this.flag)
        this.width = 0
      }
    }
  },
  destroyed () {
    clearInterval(this.flag)
  }
}
</script>

<style lang="less" scoped>
@image-base-url: "../../image";
.voice {
  position: relative;
  width: 100px;
  height: 40px;
  background-image: url("@{image-base-url}/pic_voice_null.png");

  i {
    position: absolute;
    top: 0;
    left: 0;
    height: 40px;
    background-image: url("@{image-base-url}/pic_voice_full.png");
  }
}
</style>
