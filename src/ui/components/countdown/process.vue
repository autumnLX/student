<template lang="pug">
  div.line
    //- 使用ms更精确
    div.countdown_peocess(:style='{width:width + "%"}') 
</template>

<script>
export default {
  props: ['time', 'currentTime'],
  data () {
    return {
      width: 0,
      _width: 0
    }
  },
  methods: {
    countdown () {
      this._width = this.currentTime / this.time * 100
      this.width = this._width >= 100 ? 100 : this._width
    }
  },
  watch: {
    currentTime: {
      immediate: true,
      handler: function () { this.countdown() }
    }
  }
}
</script>

<style lang="less" scoped>
.line {
  position: relative;
  width: 100%;
  height: 14px;
  background: #53cc92;
  border-radius: 7px;
  div {
    position: absolute;
    top: 0;
    left: 0px;
    width: 0;
    height: 14px;
    background: #fff;
    border-radius: 7px;
  }
}
.countdown_peocess {
  transition: width 0;
}
</style>
