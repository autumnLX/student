<template lang='pug'>
  transition(name='fade')
    div  
      div.toastLayer(v-if='showLayer')
      div.wrap(v-if='showWrap' :style='styleObj')
        i.toast_icon(v-if='iconFlag')
        span {{text}}
</template>
<script>
export default {
  name: 'toast',
  data() {
    return {
    }
  }
}
</script>
<style lang='less'>
  .toastLayer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
  .wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 999;
    transform: translate(-50%, -50%);
    .toast_icon {
      width: 30px;
      height: 30px;
      background-image: url('/static/images/ic_tip_success.png');
      margin-right: 10px;
    }
    span {
      color: #fff;
      font-size: 16px;
      line-height: 30px;
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>


