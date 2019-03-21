<template lang="pug">
  div.Correction
    div.layout-img(v-if='data.img')
      img(:src='data.img' alt='')
      div.text-right
        p.grey6(v-if='randerContent' v-html='randerContent')
        p.grey6(v-else v-html='data.content')
        div.symbolFeedBack
          div
            span.f16.grey9(v-show="data.symbol") 英：
            span.f18.grey9.left(v-show="data.symbol" v-html='data.symbol')
            span.f16.grey9.right(v-show="data.symbol_am") 美：
            span.f18.grey9(v-show="data.symbol_am" v-html='data.symbol_am')
    div.layout(v-else)
      p.grey6(v-if='randerContent' v-html='randerContent')
      p.grey6(v-else v-html='data.content')
      div.symbolFeedBack
        div
          span.f16.grey9 英：
          span.f18.grey9.left(v-html='data.symbol')
          span.f16.grey9.right 美：
          span.f18.grey9(v-html='data.symbol_am')
</template>

<script>
export default {
  name: 'StuWorkCorr',
  props: [
    'data',
    'player',
    'recorder',
    'doPlay',
    'subIndex',
    'getVideoStatus',
    'dataPersist',
    'setScore',
    'levelAudio',
    'lastTopicFlag'
  ],
  data() {
    return {
      videoStatus: {
        playStatus: 0,
        recordStatus: 0,
        replayStatus: 0
      },
      randerContent: '',
      randerSymbol: ''
    }
  },
  methods: {
    resetStatus() { // 切换小题还原状态
      this.randerContent = this.data.randerContent ? this.data.randerContent : ''
      this.randerSymbol = this.data.randerSymbol ? this.data.randerSymbol : ''
      this.videoStatus.playStatus = 0
      this.videoStatus.recordStatus = 0
      this.videoStatus.replayStatus = 0
      this.getVideoStatus(this.videoStatus)
    },
    handleData() {
      this.resetStatus()
      if (this.data.symbol && !/\[*\]/.test(this.data.symbol)) {
        this.data.symbol = `[${this.data.symbol}]`
      }
      if (this.data.symbol_am && !/\[*\]/.test(this.data.symbol_am)) {
        this.data.symbol_am = `[${this.data.symbol_am}]`
      }
    },
    scoreLeve(score, audioUrl) {
      this.setScore({
        stdAudioUrl: this.data.audio,
        recordAudioUrl: audioUrl ? `http://${audioUrl.replace(/:8002/, '')}.mp3` : '',
        score: score
      })
      this.randerContent = ''
      this.videoStatus.replayStatus = 0
      this.videoStatus.recordStatus = 0
      this.videoStatus.playStatus = 0
      this.getVideoStatus(this.videoStatus)
      this.levelAudio(score)
    },
    getScore(param) { // 父级调用录音回调
      this.scoreLeve(param.overall, param.audioUrl)
    },
    switchTopic() {
      if (this.videoStatus.playStatus === 1) {
        this.player.stop()
        this.recorder.stop()
        this.videoStatus.playStatus = 0
        this.getVideoStatus(this.videoStatus)
      } else if (this.videoStatus.replayStatus === 1) {
        this.player.stop()
        this.videoStatus.replayStatus = 0
        this.getVideoStatus(this.videoStatus)
      }
    }
  },
  watch: {
    subIndex: function (val) { // 切题
      this.switchTopic()
      this.handleData()
    },
    lastTopicFlag: function (val) {
      if (val) {
        this.switchTopic()
      }
    }
  },
  mounted() {
    this.handleData()
  }
}
</script>

<style lang='less'>
.Correction {
  text-align: center;
  height: inherit;
  position: relative;
  & > .layout-img {
    width: 700px;
    height: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -200px 0 0 -350px;
    & > img {
      display: block;
      float: left;
      margin-top: 50px;
      width: 300px;
      height: 300px;
    }
    & > .text-right {
      float: left;
      width: 400px;
      height: 400px;
      line-height: 400px;
      box-sizing: border-box;
      padding-top: 120px;

      & > p {
        font-size: 36px;
        line-height: 40px;
        span {
          font-size: 36px;
          line-height: 40px;
        }
      }
    }
  }
  & > .layout {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 120px;
    margin-top: -110px;
    & > p {
      font-size: 36px;
      line-height: 40px;
      span {
        font-size: 36px;
        line-height: 40px;
      }
    }
  }

  .symbolFeedBack {
    margin-top: 15px;
    text-align: center;
    
    & > div {
      position: relative;
      display: inline-block;

      & > span {
        line-height: 30px;
      }

      & > .left{
        margin-right: 10px;
      }
      & > .right {
        margin-left: 10px;
      }
      & > p {
        margin-top: 5px;
        text-align: left;
        .randerSymbol {
          & > span {
            font-size: 18px;
          }
        }
      }
    }
  }
  
}
</style>