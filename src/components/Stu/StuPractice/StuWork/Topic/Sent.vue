<template lang="pug">
  div.StuWorkSent
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
    'repeatFlag',
    'autoFlag',
    'dataPersist',
    'setScore',
    'levelAudio',
    'lastTopicFlag'
  ],
  data() {
    return {
      repeat: 0, // 自动流程循环次数
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
      this.repeat = 0
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
          this.repeat++
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
      if (this.work.practiceType === 'ld') {
        this.levelAudio(param.score)
      } else {
        this.levelAudio(param.score, () => {
          if (this.repeatFlag && param.score < this.$config.ScoreLevel.bad && this.repeat <= this.$config.ScoreLevel.repeat) {
            this.start(this.work.practiceType)
          }
        }, this.repeat)
      }
    },
    render(details) {
      this.randerContent = this.label(details)
      this.dataPersist({
        randerContent: this.randerContent,
      })
    },
    label(details) {
      let text = this.data.content
      if (details[0].words) {
        details.forEach((value, index) => {
          value.words.forEach((val, idx) => {
            let word = val.text
            let score = val.score
            let reg = new RegExp(`(^|\\s|['"]|<[^>]+/?>)(${word})(\\s|[.?!,;:'"])`, 'i')
            let endtag = `|eee`
            let startTag = score < this.$config.ScoreLevel.bad ? `bbb|` : (score < this.$config.ScoreLevel.great ? `nnn|` : `ggg|`)
            text = text.replace(reg, (str, $1, $2, $3) => {
              let replace = ''
              if ($1 !== ' ') {
                replace += startTag + $1 + endtag
              } else {
                replace += $1
              }
              replace += startTag + $2 + endtag
              if ($3 !== ' ') {
                replace += startTag + $3 + endtag
              } else {
                replace += $3
              }
              return replace
            })
          })
        })
        text = text.replace(/bbb\|/g, `<span class='sentText' style='color:#ff5f21'>`)
          .replace(/nnn\|/g, `<span class='sentText' style='color:#8f8b93'>`)
          .replace(/ggg\|/g, `<span class='sentText' style='color:#21bd73'>`)
          .replace(/\|eee/g, `</span>`)
        return text
      } else if (details[0].char || details[0].text) {
        details.forEach((val, index) => {
          let word = val.char ? val.char : val.text
          let score = val.score
          let reg = new RegExp(`(^|\\s|['"]|<[^>]+/?>)(${word})(\\s|[.?!,;:'"])`, 'i')
          let endtag = `|eee`
          let startTag = score < this.$config.ScoreLevel.bad ? `bbb|` : (score < this.$config.ScoreLevel.great ? `nnn|` : `ggg|`)
          text = text.replace(reg, (str, $1, $2, $3) => {
            let replace = ''
            if ($1 !== ' ') {
              replace += startTag + $1 + endtag
            } else {
              replace += $1
            }
            replace += startTag + $2 + endtag
            if ($3 !== ' ') {
              replace += startTag + $3 + endtag
            } else {
              replace += $3
            }
            return replace
          })
        })
        text = text.replace(/bbb\|/g, `<span class='sentText' style='color: #ff5f21'>`)
          .replace(/nnn\|/g, `<span class='sentText' style='color: #8f8b93'>`)
          .replace(/ggg\|/g, `<span class='sentText' style='color: #21bd73'>`)
          .replace(/\|eee/g, `</span>`)
        return text
      }
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

<style lang='less'>
.StuWorkSent {
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