<template lang="pug">
  div.feedback(v-if="data && (typeof(data.score) === 'number') && data.score >= 0")
    dl.getScore(v-if='data.score >= 55' :class="{good: data.score >= 70, normal: data.score <= 69}")
      dt 总得分
      dd {{data.score}}
    dl.getScore.bad(v-else)
      dt 总得分
      dd
    dl(v-if="!(type === 'word' || kernel === 'word')")
      dt(v-if='data.score >= 55') {{data.integrity > 0 ? data.integrity : '--'}}
      dt(v-else) --
      dd 完整度
    dl(v-if="!(type === 'word' || kernel === 'word')")
      dt(v-if='data.score >= 55') {{data.accuracy > 0 ? data.accuracy : '--'}}
      dt(v-else) --
      dd 准确度
    dl(v-if="!(type === 'word' || kernel === 'word')")
      dt(v-if='data.score >= 55') {{data.fluency > 0 ? data.fluency : '--'}}
      dt(v-else) --
      dd 流利度
</template>

<script>
export default {
  name: 'StuWorkFeedBack',
  props: ['data', 'type', 'kernel'],
  data() {
    return {
      accuracy: ''
    }
  },
  methods: {
    // handleData() {
    //   if (this.data.accuracy > 120) {
    //     this.accuracy = `偏快`
    //   } else if (this.data.accuracy > 80) {
    //     this.accuracy = `正常`
    //   } else {
    //     this.accuracy = `偏慢`
    //   }
    // }
  },
  watch: {
    data: function(val) {
      // this.handleData()
    }
  },
  mounted() {
    // this.handleData()
  }
}
</script>

<style lang='less' scoped>
.feedback {
  position: absolute;
  top: 110px;
  right: 0;
  width: 60px;
  border-radius: 10px 0 0 10px;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.05);

  & > dl {
    height: 70px;
    box-sizing: border-box;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      width: 40px;
      height: 1px;
      margin-left: -20px;
      background: #eee;
    }

    &.getScore {
      padding-top: 10px;
      border-top-left-radius: 10px;
      & > dt {
        font-size: 12px;
        color: #fff;
        height: 20px;
        line-height: 20px;
        text-align: center;
      }
      & > dd {
        font-size: 22px;
        color: #fff;
        font-weight: bold;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
      &.good {
        background: #24cc7c!important;
      }
      &.normal {
        background: #ff9900!important;
      }
      &.bad {
        background: #ff6666!important;
        & > dd {
          background: url('/static/images/practice/icon_bad.png') no-repeat center;
        }
      }
    }
    &:nth-child(2),&:nth-child(3),&:nth-child(4) {
      background: #fff;
      padding-top: 10px; 
      & > dt {
        font-size: 18px;
        color: #666;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
      & > dd {
        font-size: 12px;
        color: #999;
        height: 20px;
        line-height: 20px;
        text-align: center;
      }
    }
    &:nth-child(1) {
      &::after {
        content: none;
      }
    }
    &:last-child {
      border-bottom-left-radius: 10px;
    }
  }
}
</style>