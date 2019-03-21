<template lang="pug">
  div
    div.progress(v-if="showProcess" :style="{width:width+'px'}")
      span <span>{{show_currentTime}}</span> / {{time}}
      process(:time="time*1000" :currentTime="currentTime*1000")
    span.noProcess(v-else) {{show_currentTime}}
</template>
<script>
import process from './process'
export default {
  name: 'countdown',
  components: { process },
  props: {
    time: 0,
    showProcess: {
      default: false
    },
    width: {
      default: 456
    },
  },
  data () {
    return {
      startTime: +new Date(),
      currentTime: this.startTime,
      flag: ''
    }
  },
  methods: {
    countdown (v) {
      clearTimeout(this.flag)
      this.currentTime = (+new Date() - this.startTime) / 1000
      if (this.show_currentTime <= 0) {
        this.$emit('end')
      } else {
        this.flag = setTimeout(() => {
          this.countdown()
        }, 30)
      }
    }
  },
  computed: {
    show_currentTime () {
      return this.time - parseInt(this.currentTime)
    }
  },
  destroyed () {
    clearTimeout(this.flag)
  },
  watch: {
    'time': {
      immediate: true,
      handler: function () { this.countdown() }
    }
  }
}
</script>
<style lang="less" scoped>
.hidden {
  display: none !important;
}
.noProcess {
  color: #fff;
  font-size: 30px;
  font-weight: bold;
}
.progress {
  position: relative;
  width: 100%;
  height: 14px;
  background: #53cc92;
  border-radius: 7px;

  & > span {
    position: absolute;
    top: -24px;
    left: 50%;
    color: #fff;
    font-size: 16px;
    transform: translateX(-50%);

    span {
      color: #fbc564;
      font-size: 16px;
    }
  }

  // @keyframes countdown {
  //   to {
  //     width: 100%;
  //   }
  // }
}
</style>

