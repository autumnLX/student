<template lang="pug">
  div.recordingAnimation(v-if="recordStatus === 1")
    div.record_scale.scale1
    div.record_scale.scale2
    div.circleProgress_wrapper
      div.wrapper.right
        div.circleProgress.rightcircle(:style="{AnimationDuration: recordAnimationTime, webkitAnimationDuration: recordAnimationTime}")
      div.wrapper.left
        div.circleProgress.leftcircle(:style="{AnimationDuration: recordAnimationTime, webkitAnimationDuration: recordAnimationTime}")
</template>

<script>
export default {
  name: 'RecordingAnimation',
  props: ['recordStatus', 'recordAnimationTime'],
  data() {
    return {
    }
  },
  methods: {
  },
  watch: {
    recordStatus: function (val) {
    },
    recordAnimationTime: function (val) {
    }
  },
  mounted() {
  }
}
</script>

<style lang='less' scoped>
/*录音动画效果*/
.record_scale {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 80px;
  height: 80px;
  background: rgba(248, 201, 71, 0.2);
  border-radius: 50%;
  &.scale1 {
    animation: reocrdgif 1s linear infinite;
    -webkit-animation: reocrdgif 1s linear infinite;
  }
  &.scale2 {
    animation: reocrdgif 1s linear 0.5s infinite;
    -webkit-animation: reocrdgif 1s linear 0.5s infinite;
  }
}
//进度条
.circleProgress_wrapper {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 5px;
  left: 5px;
  & > .wrapper {
    width: 50px;
    height: 100px;
    position: absolute;
    top:0;
    overflow: hidden;
    &.right {
      right: 0;
    }
    &.left {
      left: 0;
    }
    & > .circleProgress {
      width: 100px;
      height: 100px;
      border: 5px solid #feefc3;
      border-radius: 50%;
      position: absolute;
      top: 0;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      &.rightcircle {
        border-top: 5px solid #f8c947;
        border-right: 5px solid #f8c947;
        right: 0;
        animation-name: circleProgressLoad_right;
        animation-timing-function: linear;
        animation-iteration-count: 1;
        -webkit-animation-name: circleProgressLoad_right;
        -webkit-animation-timing-function: linear;
        -webkit-animation-iteration-count: 1;
      }
      &.leftcircle {
        border-bottom: 5px solid #f8c947;
        border-left: 5px solid #f8c947;
        left: 0;
        animation-name: circleProgressLoad_left;
        animation-timing-function: linear;
        animation-iteration-count: 1;
        -webkit-animation-name: circleProgressLoad_left;
        -webkit-animation-timing-function: linear;
        -webkit-animation-iteration-count: 1;
      }
    }
  }
}
@keyframes circleProgressLoad_right {
  0% {
    -webkit-transform: rotate(-135deg);
  }
  50%,100% {
    -webkit-transform: rotate(45deg);
  }
}
@-webkit-keyframes circleProgressLoad_right {
  0% {
    -webkit-transform: rotate(-135deg);
  }
  50%,100% {
    -webkit-transform: rotate(45deg);
  }
}
@keyframes circleProgressLoad_left {
  0%,50% {
    -webkit-transform: rotate(-135deg);
  }
  100%{
    -webkit-transform: rotate(45deg);
  }
}
@-webkit-keyframes circleProgressLoad_left {
  0%,50% {
    -webkit-transform: rotate(-135deg);
  }
  100%{
    -webkit-transform: rotate(45deg);
  }
}
@keyframes reocrdgif {
  0% {
    -webkit-transform: scale(0.5);
  }
  100% {
    -webkit-transform: scale(1);
  }
}
@-webkit-keyframes reocrdgif {
  0% {
    -webkit-transform: scale(0.5);
  }
  100% {
    -webkit-transform: scale(1);
  }
}
</style>