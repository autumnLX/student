<template lang="pug">
  div.scoreAnimation(v-if="resultStatus")
    i.fantastic(v-if="resultStatus === 'fantastic'")
    i.perfect(v-else-if="resultStatus === 'prefect'")
    i.great(v-else-if="resultStatus === 'great'")
    i.good(v-else-if="resultStatus === 'good'")
    i.normal(v-else-if="resultStatus === 'normal'")
    i.bad(v-else-if="resultStatus === 'bad'")
    i.nonVip(v-else-if="resultStatus === 'nonVip'")
</template>

<script>
export default {
  name: 'ScoreAnimation',
  props: ['resultStatus'],
  data() {
    return {
    }
  },
  methods: {
  },
  watch: {
    resultStatus: function (val) {
    }
  },
  mounted() {
  }
}
</script>

<style lang='less' scoped>
/*得分反馈动画效果*/
.scoreAnimation {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 420px;
  height: 298px;
  margin: -200px 0 0 -210px;
  z-index: 100;

  & > i {
    display: block;
    width: 420px;
    height: 298px;
    &.fantastic {
      background: url('/static/images/practice/work/ic_fantastic.png') no-repeat center;
    }
    &.perfect {
      background: url('/static/images/practice/work/ic_perfect.png') no-repeat center;
    }
    &.great {
      background: url('/static/images/practice/work/ic_great.png') no-repeat center;
    }
    &.good {
      background: url('/static/images/practice/work/ic_good.png') no-repeat center;
    }
    &.normal {
      background: url('/static/images/practice/work/ic_normal.png') no-repeat center;
    }
    &.bad {
      background: url('/static/images/practice/work/ic_bad.png') no-repeat center;
    }
    &.nonVip {
      width: 160px;
      height: 80px;
      margin: 100px auto 0;
      background: url('/static/images/practice/work/ic_ok.png') no-repeat center;
    }
  }
}
</style>