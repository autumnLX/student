<template lang="pug">
  div.word
    div.layout-img(v-if='data.img')
      img(:src='data.img' alt='')
      div.text-right
        p.grey6(v-if='randerContent' v-html='randerContent')
        p.grey6(v-else v-html='data.content')
        p.f24.grey9(v-if='randerSymbol' v-html='randerSymbol')
        p.f24.grey9(v-else v-html='data.symbol')
        p.f18.grey9(v-html='data.translation')
    div.layout(v-else)
      p.grey6(v-if='randerContent' v-html='randerContent')
      p.grey6(v-else v-html='data.content')
      p.f24.grey9(v-if='randerSymbol' v-html='randerSymbol')
      p.f24.grey9(v-else v-html='data.symbol')
      p.f18.grey9(v-html='data.translation')
</template>

<script>
export default {
  name: 'StuWorkWord',
  props: [
    'data',
    'work',
    'player',
    'recorder',
    'doPlay',
    'doRecord',
    'subIndex',
    'getVideoStatus',
    'autoFlag',
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
      randerSymbol: '',
      clearTimeOut: ''
    }
  },
  methods: {
    initPlayStatus(callback = function () {}) {
      this.videoStatus.replayStatus = 2
      this.videoStatus.playStatus = 1
      this.videoStatus.recordStatus = 0
      this.getVideoStatus(this.videoStatus)
      callback()
    },
    initRecordStatus(callback = function () {}) {
      this.videoStatus.replayStatus = 2
      this.videoStatus.playStatus = 2
      this.videoStatus.recordStatus = 1
      this.getVideoStatus(this.videoStatus)
      callback()
    },
    resetStatus() { // 切换小题还原状态
      if (this.autoFlag) {
        this.randerContent = ''
        this.randerSymbol = ''
        this.videoStatus.playStatus = 2
        this.videoStatus.recordStatus = 2
        this.videoStatus.replayStatus = 2
      } else {
        this.randerContent = this.data.randerContent ? this.data.randerContent : ''
        this.randerSymbol = this.data.randerSymbol ? this.data.randerSymbol : ''
        this.videoStatus.playStatus = 0
        this.videoStatus.recordStatus = 0
        this.videoStatus.replayStatus = 0
      }
      this.getVideoStatus(this.videoStatus)
    },
    handleData() {
      this.resetStatus()
      if (this.data.symbol && !/\[*\]/.test(this.data.symbol)) {
        this.data.symbol = `[${this.data.symbol}]`
      }
      this.start()
    },
    removeSpace(data) {
      return data.replace(/\s*$/, '')
    },
    start() {
      if (this.autoFlag) {
        if (this.work.practiceType === 'ld') {
          this.clearTimeOut = window.setTimeout(() => {
            this.initRecordStatus(() => {
              this.doRecord(this.data.content, this.getScore_ld)
            })
          }, 2000)
        } else if (this.work.practiceType === 'gd') {
          this.initPlayStatus(() => {
            this.doPlay(this.data.audio, () => {
              this.initRecordStatus(() => {
                this.doRecord(this.data.content, this.getScore_gd)
              })
            })
          })
        }
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
    render(details) {
      this.dataPersist({
        randerContent: this.data.content,
        randerSymbol: this.data.symbol
      })
    },
    getScore_gd(param) {
      this.scoreLeve(param.score, param.audioUrl)
      this.render(param.details)
    },
    getScore_ld(param) {
      this.scoreLeve(param.score, param.audioUrl)
      this.render(param.details)
    },
    getScore(param) { // 父级调用录音回调
      if (param.practiceType === 'ld') {
        this.getScore_ld(param)
      } else if (param.practiceType === 'gd') {
        this.getScore_gd(param)
      }
    },
    switchTopic() {
      if (this.work.practiceType === 'ld') {
        window.clearTimeout(this.clearTimeOut)
      } else if (this.work.practiceType === 'gd') {
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
.word {
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
        &:nth-child(1) {
          font-size: 36px;
          line-height: 40px;
          span {
            font-size: 36px;
            line-height: 40px;
          }
        }
        &:nth-child(2) {
          line-height: 28px;
          margin-top: 5px;
          span {
            font-size: 24px;
            line-height: 28px;
          }
        }
        &:nth-child(3) {
          line-height: 24px;
          margin-top: 15px;
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
      &:nth-child(1) {
        font-size: 36px;
        line-height: 40px;
        span {
          font-size: 36px;
          line-height: 40px;
        }
      }
      &:nth-child(2) {
        line-height: 28px;
        margin-top: 5px;
        span {
          font-size: 24px;
          line-height: 28px;
        }
      }
      &:nth-child(3) {
        line-height: 24px;
        margin-top: 15px;
      }
    }
  }
  
}
</style>