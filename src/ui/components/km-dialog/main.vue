<template lang="pug">
  div.layer(@click.stop.self="close" v-if="visible" :class="{hiddenLayer:hiddenLayer}")
    div.content(:class="{center:isCenter}")
      i.iconfont.close(@click.stop="close" v-if="showClose") &#xe60a;
      div.title
        slot(name='title')
          span.title {{title}}
      div.body
        slot(name='body')
      div.footer
        slot(name='footer')
         
</template>

<script>
import Kmbutton from '../button/main'
export default {
  name: 'km-dialog',
  components: { Kmbutton },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    isCenter: {
      type: Boolean,
      default: false
    },
    hiddenLayer: {
      type: Boolean,
      default: false
    },
    title: ''
  },
  methods: {
    close () {
      this.$emit('close', false)
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.layer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 98;
  .close {
    position: absolute;
    font-size: 20px;
    top: 6px;
    right: 6px;
    cursor: pointer;
  }
  background: rgba(0, 0, 0, 0.6);
  .content {
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-height: 270px;
    min-width: 400px;
    padding: 30px 40px;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }
  .body {
    flex: 1;
    overflow: auto;
  }
  .content.center {
    text-align: center;
  }
  .content .footer {
    display: inline-block;
  }
  .button {
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }
  .content > i:hover {
    color: #24cc7c;
  }
  i.error {
    color: #ff6666;
  }
  i.warn {
    color: wheat;
  }
  i.toast {
    font-size: 60px;
  }
  .title {
    font-size: 18px;
    color: #333;
  }
  .desc {
    margin-top: 20px;
    font-size: 14px;
    color: #666;
  }
}
.hiddenLayer {
  visibility: hidden;
  .content {
    visibility: visible;
  }
}
</style>


