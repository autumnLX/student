<template lang="pug">
  div.StuTaskSent
    div.layout-img(v-if='data.img')
      img(:src='data.img' alt='')
      div.text-right
        div.randerHtmlContent(v-if='randerContent')
          p.grey6(v-html='randerContent')
        div.randerContent(v-else)
          p.grey6(v-html='data.content')
        div.translation
          p.f18.grey9(v-html='data.translation')
    div.layout(v-else)
      div.randerHtmlContent(v-if='randerContent')
        p.grey6( v-html='randerContent')
      div.randerContent(v-else)
        p.grey6(v-html='data.content')
      div.translation
        p.f18.grey9(v-html='data.translation')
</template>

<script>
export default {
  name: 'StuWorkSent',
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
        this.videoStatus.playStatus = 2
        this.videoStatus.recordStatus = 2
        this.videoStatus.replayStatus = 2
      } else {
        this.randerContent = this.data.randerContent ? this.data.randerContent : ''
        this.videoStatus.playStatus = 0
        this.videoStatus.recordStatus = 0
        this.videoStatus.replayStatus = 0
      }
      this.getVideoStatus(this.videoStatus)
    },
    handleData() {
      this.resetStatus()
      this.start(this.work.practiceType)
    },
    start(practiceType) {
      if (this.autoFlag) {
        if (practiceType === 'ld') {
          this.clearTimeOut = window.setTimeout(() => {
            this.initRecordStatus(() => {
              this.doRecord(this.data.content, this.getScore_ld)
            })
          }, 2000)
        } else if (practiceType === 'gd') {
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
    scoreLeve(param) {
      this.setScore({
        stdAudioUrl: this.data.audio,
        recordAudioUrl: param.audioUrl ? `http://${param.audioUrl.replace(/:8002/, '')}.mp3` : '',
        score: param.score,
        label: this.randerContent,
        fluency: param.fluency,
        integrity: param.integrity,
        accuracy: param.accuracy
      })
      this.videoStatus.replayStatus = 0
      this.videoStatus.recordStatus = 0
      this.videoStatus.playStatus = 0
      this.getVideoStatus(this.videoStatus)
      this.levelAudio(param.score)
    },
    render(details) {
      this.randerContent = this.data.content
      this.dataPersist({
        randerContent: this.randerContent,
      })
    },
    getScore_gd(param) {
      this.render(param.details)
      this.scoreLeve(param)
    },
    getScore_ld(param) {
      this.render(param.details)
      this.scoreLeve(param)
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
    subIndex: function (val) {
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

<style lang='less' scoped>
.StuTaskSent {
  text-align: center;
  height: inherit;
  position: relative;
  width: 800px;
  margin: 0 auto;
  & > .layout-img {
    width: 800px;
    height: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -200px 0 0 -400px;
    & > img {
      display: block;
      float: left;
      margin-top: 50px;
      width: 300px;
      height: 300px;
    }
    & > .text-right {
      float: left;
      width: 500px;
      height: 400px;
      padding-top: 120px;

      & > div {
        width: 460px;
        margin: 0 auto;
        &.randerHtmlContent,
        &.randerContent {
          & > p {
            font-size: 24px;
            line-height: 48px;
            width: auto;
            display: inline-block;
            text-align: left;
          }
        }
        &.translation {
          font-size: 18px;
          color: #999;
          & > p {
            font-size: 18px;
            line-height: 48px;
            width: auto;
            display: inline-block;
            text-align: left;
          }
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

    & > div {
      width: inherit;
      margin: 0 auto;
      &.randerHtmlContent,
      &.randerContent {
        & > p {
          font-size: 24px;
          line-height: 48px;
          width: auto;
          display: inline-block;
          text-align: left;
        }
      }
      &.translation {
        font-size: 18px;
        color: #999;
        & > p {
          font-size: 18px;
          line-height: 48px;
          width: auto;
          display: inline-block;
          text-align: left;
        }
      }
    }
  }
}
</style>