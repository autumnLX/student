<template lang="pug">
  div.km-button.noselect(:class="{[size]: true, isBorder: isBorder === true, isBack: isBack === true}" @click="clickHandle")
    img.roate(v-if="type==='loading'" src="../../image/loading.png")
    slot
</template>

<script>
export default {
  name: 'km-button',
  props: {
    size: { default: 'normal' },
    isBorder: {
      default: -1
    },
    isBack: {
      default: -1
    },
    // loading
    type: '',
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clickHandle () {
      if (this.disabled || this.type === 'loading') {
        return
      }
      this.$emit('click')
    }
  }
}
</script>

<style lang="less" scoped>
.km-button {
  cursor: pointer;
  color: #fff;
  text-align: center;
  .iconfont {
    color: #fff;
  }
  &.isBorder {
    border: 1px solid #ccc;
    color: #666;
  }
  &.isBorder:hover {
    border: 1px solid #24cc7c;
    color: #24cc7c;
  }
  &.isBack {
    background: #24cc7c;
    color: white;
  }
  &.isBack:hover {
    background: #21bd7c;
  }
  &.normal {
    width: 100px;
    height: 34px;
    line-height: 34px;
    border-radius: 17px;
    font-size: 16px;
  }
  &.max {
    width: 330px;
    height: 50px;
    border-radius: 4px;
    font-size: 18px;
    line-height: 50px;
    background: linear-gradient(to right, #21bd73, #46bf97);
  }
}
.roate {
  vertical-align: sub;
  margin-right: 10px;
  animation: roate 3000ms linear infinite;
  width: 20px;
  height: 20px;
}
@keyframes roate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
