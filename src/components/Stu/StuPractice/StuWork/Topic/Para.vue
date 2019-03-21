<template lang="pug">
  div.StuWorkPara
    vue-scroll
      div.layout
        div(v-if="work.practiceType === 'ld'")
          p.grey6(v-if='randerContent' v-html='randerContent')
          p.grey6(v-else v-html='data.content')
        div(v-else)
          p.grey6(v-if='randerContent.length')
            span(v-for='(para, idx) in randerContent' :class="{bg_color: index === idx}")
              span(v-if='para.label' v-html='para.label')
              span(v-else) {{para.text}}
          p.grey6(v-else)
            span(v-for='(para, idx) in data.details' :class="{bg_color: index === idx}") {{para.text}}
        div
          p.f18.grey9(v-html='data.translation')
</template>

<script>
export default {
  name: 'StuWorkPara',
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
      index: 0, // 当前是第几句
      resultDetail: [],
      randerContent: '',
      clearRecordTimeOut: '',
      clearTimeOut: ''
    }
  },
  methods: {
    initPlayStatus(callback = function () {}) {
      this.videoStatus.replayStatus = 4
      this.videoStatus.playStatus = 1
      this.videoStatus.recordStatus = 0
      this.getVideoStatus(this.videoStatus)
      callback()
    },
    initRecordStatus(callback = function () {}) {
      this.videoStatus.replayStatus = 4
      this.videoStatus.playStatus = 2
      this.videoStatus.recordStatus = 1
      this.getVideoStatus(this.videoStatus)
      callback()
    },
    resetStatus() { // 切换小题还原状态
      this.repeat = 0
      this.index = 0
      this.resultDetail = []
      if (this.autoFlag) {
        this.randerContent = ''
        this.videoStatus.playStatus = 2
        this.videoStatus.recordStatus = 2
        this.videoStatus.replayStatus = 4
        for (let i = 0; i < this.data.details.length; i++) {
          let filterText = this.data.details[i].text.replace(/<[^>]+\/?>/g, '')
          this.$set(this.data.details[i], 'text', filterText)
        }
        if (this.work.practiceType === 'gd') {
          this.randerContent = []
          this.transTitleCase()
        }
      } else {
        if (this.work.practiceType === 'ld') {
          this.randerContent = this.data.randerContent ? this.data.randerContent : ''
        } else {
          this.randerContent = []
          if (this.data.randerContent.length) {
            this.randerContent = this.data.randerContent
            this.index = -1
            this.videoStatus.replayStatus = 0
            this.videoStatus.recordStatus = 5
            this.videoStatus.playStatus = 3
          } else {
            this.transTitleCase()
            this.videoStatus.playStatus = 0
            this.videoStatus.recordStatus = 0
            this.videoStatus.replayStatus = 4
          }
        }
      }
      this.getVideoStatus(this.videoStatus)
    },
    transTitleCase() {
      let detail = this.data.details
      if (detail.length > 0) {
        for (let i = 0; i < detail.length; i++) {
          let result = new RegExp(`${detail[i].text.replace(/\?/, '\\?')}\\s?`, 'i').exec(this.data.content)
          if (result) {
            this.$set(detail[i], 'text', result[0])
            this.$set(detail[i], 'label', result[0])
          }
        }
      }
      this.randerContent = this.data.details
    },
    dataReduction () {
      this.index = 0
      this.setScore({
        showScore: false,
        score: '',
        fluency: 0,
        integrity: 0,
        accuracy: 0,
        resultDetail: []
      })
      this.data.details.forEach((val, idx) => {
        this.$set(this.data.details[idx], 'label', '')
      })
      this.videoStatus.playStatus = 2
      this.videoStatus.recordStatus = 2
      this.videoStatus.replayStatus = 4
      this.getVideoStatus(this.videoStatus)
    },
    handleData() {
      this.resetStatus()
      this.start()
    },
    doAgain () {
      this.dataReduction()
      this.next_gd()
    },
    start() {
      if (this.autoFlag) {
        if (this.work.practiceType === 'ld') {
          this.next_ld()
        } else if (this.work.practiceType === 'gd') {
          this.next_gd()
        }
      }
    },
    recordText() { // 逐句跟读功能保留，内核支持分段朗读之后放开功能
      if (this.work.practiceType === 'ld') {
        return this.data.content
      } else {
        return this.data.details[this.index].text
      }
    },
    next_gd() { // 逐句跟读
      let content = this.data.details[this.index]
      this.repeat++
      this.initPlayStatus(() => {
        this.doPlay(this.data.audio, () => {
          this.initRecordStatus(() => {
            this.doRecord(content.text, this.getScore_gd)
          })
        }, content.start, content.end - content.start)
      })
    },
    next_ld() {
      this.clearTimeOut = window.setTimeout(() => {
        this.initRecordStatus(() => {
          this.doRecord(this.data.content, this.getScore_ld)
        })
      }, 2000)
    },
    getScore_gd(param) {
      let content = this.data.details[this.index]
      const label_gd = this.label_gd(param.details)
      this.resultDetail[this.index] = {
        start: content.start,
        end: content.end,
        text: content.text,
        score: param.score,
        recordAudioUrl: param.audioUrl ? `http://${param.audioUrl.replace(/:8002/, '')}.mp3` : '',
        accuracy: param.accuracy,
        fluency: param.fluency,
        integrity: param.integrity,
        stdAudioUrl: this.data.audio,
        label: label_gd,
        details: content.details
      }
      this.levelAudio(param.score, () => {
        if (this.repeat <= this.$config.ScoreLevel.repeat && param.score < this.$config.ScoreLevel.bad) {
          this.next_gd()
        } else {
          this.repeat = 0
          this.$set(this.randerContent[this.index], 'label', label_gd)
          if (this.index === this.data.details.length - 1) { // 完成
            let avageScore = 0
            let fluency = 0
            let integrity = 0
            let accuracy = 0
            this.resultDetail.forEach((val, index) => {
              avageScore += val.score
              fluency += val.fluency
              integrity += val.integrity
              accuracy += val.accuracy
            })
            this.setScore({
              showScore: true,
              score: this.resultDetail.length > 0 ? Math.ceil(avageScore / this.resultDetail.length) : 0,
              fluency: this.resultDetail.length > 0 ? Math.ceil(fluency / this.resultDetail.length) : 0,
              integrity: this.resultDetail.length > 0 ? Math.ceil(integrity / this.resultDetail.length) : 0,
              accuracy: this.resultDetail.length > 0 ? Math.ceil(accuracy / this.resultDetail.length) : 0,
              resultDetail: this.resultDetail
            })
            this.index = ''
            this.videoStatus.replayStatus = 0
            this.videoStatus.recordStatus = 5
            this.videoStatus.playStatus = 3
            this.getVideoStatus(this.videoStatus)
            this.dataPersist({
              randerContent: this.randerContent,
            })
          } else {
            window.clearTimeout(this.clearRecordTimeOut)
            this.clearRecordTimeOut = window.setTimeout(() => {
              this.index++
              this.videoStatus.replayStatus = 4
              this.videoStatus.recordStatus = 0
              this.videoStatus.playStatus = 0
              this.getVideoStatus(this.videoStatus)
              this.next_gd()
            }, 1000)
          }
        }
      }, this.repeat, this.index, this.resultDetail[this.index].recordAudioUrl)
    },
    getScore_ld(param) {
      this.randerContent = this.label_ld(param.details)
      this.setScore({
        showScore: true,
        stdAudioUrl: this.data.audio,
        recordAudioUrl: param.audioUrl ? `http://${param.audioUrl.replace(/:8002/, '')}.mp3` : '',
        label: this.randerContent,
        score: param.score,
        fluency: param.fluency,
        integrity: param.integrity,
        accuracy: param.accuracy
      })
      this.videoStatus.replayStatus = 0
      this.videoStatus.recordStatus = 0
      this.videoStatus.playStatus = 0
      this.getVideoStatus(this.videoStatus)
      this.levelAudio(param.score)
      this.dataPersist({
        randerContent: this.randerContent,
      })
    },
    label_gd(details) {
      let text = this.data.details[this.index].label ? this.data.details[this.index].label : this.data.details[this.index].text
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
              if (idx === value.words.length - 1) {
                if ($3 !== ' ') {
                  replace += `${startTag}${$3}${endtag}<i>${value.score}</i>`
                } else {
                  replace += `${$3}<i>${value.score}</i>`
                }
              } else {
                if ($3 !== ' ') {
                  replace += startTag + $3 + endtag
                } else {
                  replace += $3
                }
              }
              return replace
            })
          })
        })
        text = text.replace(/bbb\|/g, `<span style='color: #ff5f21'>`)
          .replace(/nnn\|/g, `<span style='color: #8f8b93'>`)
          .replace(/ggg\|/g, `<span style='color: #21bd73'>`)
          .replace(/\|eee/g, `</span>`)
        return text
      } else if (details[0].char || details[0].text) {
        let totalScore = 0
        details.forEach((val, index) => {
          let word = val.char ? val.char : val.text
          let score = val.score
          let reg = new RegExp(`(^|\\s|['"]|<[^>]+/?>)(${word})(\\s|[.?!,;:'"])`, 'i')
          let endtag = `|eee`
          let startTag = score < this.$config.ScoreLevel.bad ? `bbb|` : (score < this.$config.ScoreLevel.great ? `nnn|` : `ggg|`)
          totalScore += val.score
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
          if (index === details.length - 1) {
            totalScore = totalScore === 0 ? 0 : Math.ceil(totalScore / details.length)
            text = `${text}<i>${totalScore}</i>`
          }
        })
        text = text.replace(/bbb\|/g, `<span style='color: #ff5f21'>`)
          .replace(/nnn\|/g, `<span style='color: #8f8b93'>`)
          .replace(/ggg\|/g, `<span style='color: #21bd73'>`)
          .replace(/\|eee/g, `</span>`)
        return text
      }
    },
    label_ld(details) {
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
              if (idx === value.words.length - 1) {
                if ($3 !== ' ') {
                  replace += `${startTag}${$3}${endtag}<i>${value.score}</i>`
                } else {
                  replace += `${$3}<i>${value.score}</i>`
                }
              } else {
                if ($3 !== ' ') {
                  replace += startTag + $3 + endtag
                } else {
                  replace += $3
                }
              }
              return replace
            })
          })
        })
        text = text.replace(/bbb\|/g, `<span style='color: #ff5f21'>`)
          .replace(/nnn\|/g, `<span style='color: #8f8b93'>`)
          .replace(/ggg\|/g, `<span style='color: #21bd73'>`)
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
        text = text.replace(/bbb\|/g, `<span style='color: #ff5f21'>`)
          .replace(/nnn\|/g, `<span style='color: #8f8b93'>`)
          .replace(/ggg\|/g, `<span style='color: #21bd73'>`)
          .replace(/\|eee/g, `</span>`)
        return text
      }
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
.StuWorkPara {
  text-align: center;
  height: inherit;
  position: relative;
  & .layout {
    position: absolute;
    width: 100%;
    height: 120px;
    top: 15px;
    left: 0;

    & > div {
      width: 820px;
      margin: 0 auto;
      &:nth-child(1) {
        & > p {
          &:nth-child(1) {
            font-size: 24px;
            line-height: 48px;
            text-align: left;
            & > span {
              font-size: 24px;
              line-height: 48px;
              text-align: left;
              & > span {
                font-size: 24px;
                line-height: 48px;
                text-align: left;
                & > span {
                  font-size: 24px;
                  line-height: 48px;
                  text-align: left;
                }
                 & > span + i {
                  position: relative;
                  right: 3px;
                  top: -20px;
                  font-size: 12px;
                  font-style: normal;
                  color: #999;
                  padding-right: 5px;
                }
              }
              & > span + i {
                position: relative;
                right: 3px;
                top: -20px;
                font-size: 12px;
                font-style: normal;
                color: #999;
                padding-right: 5px;
              }
            }
            & > span + i {
              position: relative;
              right: 3px;
              top: -20px;
              font-size: 12px;
              font-style: normal;
              color: #999;
            }
          }
          &:nth-child(2) {
            line-height: 36px;
            margin-top: 10px;
            text-align: left;
          }
        }
      }
      &:nth-child(2) {
        & > p {
          line-height: 36px;
          text-align: left;
        }
      }
    }
  }
}
.bg_color {
  background: #e4faed;
}
</style>