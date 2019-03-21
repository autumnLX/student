<template lang="pug">
  div.StuWorkWord
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
import Translations from './Translation'
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
    'repeatFlag',
    'autoFlag',
    'dataPersist',
    'setScore',
    'levelAudio',
    'lastTopicFlag'
  ],
  components: Object.assign({}, {Translations}),
  data() {
    return {
      repeat: 0, // 自动流程循环次数
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
      this.repeat = 0
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
      if (this.work.practiceType === 'ld') {
        this.levelAudio(score)
      } else {
        this.levelAudio(score, () => {
          if (this.repeatFlag && score < this.$config.ScoreLevel.bad && this.repeat <= this.$config.ScoreLevel.repeat) {
            this.start()
          }
        }, this.repeat)
      }
    },
    render(details) {
      if (details) {
        this.randerSymbol = ''
        for (let i = 0; i < details.length; i++) {
          if (details[i].phone && details[i].phone.length > 0) {
            let stress = details[0].stress ? JSON.parse(JSON.stringify(details[0].stress)) : ''
            let stressIndex = []
            if (stress && stress.length > 0) {
              let stressTmp = 0
              stress.forEach((strs, i) => {
                stressIndex.push(stressTmp)
                stressTmp += strs.char.match(/_/g) ? strs.char.match(/_/g).length + 1 : 1
              })
            }
            for (let j = 0; j < details[i].phone.length; j++) {
              if (stressIndex.indexOf(j) >= 0) {
                let sIdx = stressIndex.indexOf(j)
                let stss = stress[sIdx]
                if (stss.ref === 1) {
                  this.randerSymbol += '<span style="' + (stss.score === stss.ref ? 'color: #21bd73' : 'color: #ff5f21') + '">\'</span>'
                }
              }
              let _phone = details[i].phone[j]
              if (_phone.score < this.$config.ScoreLevel.bad) {
                this.randerSymbol += `<span style='color: #ff5f21'>${this.translation(_phone.char)}</span>`
              } else if (_phone.score < this.$config.ScoreLevel.great) {
                this.randerSymbol += `<span style='color: #8f8b93'>${this.translation(_phone.char)}</span>`
              } else {
                this.randerSymbol += `<span style='color: #21bd73'>${this.translation(_phone.char)}</span>`
              }
            }
            if (this.randerSymbol.indexOf('[') < 0 && this.randerSymbol.indexOf(']') < 0) {
              this.randerSymbol = `[${this.randerSymbol}]`
            }
          }
        }
        this.randerContent = this.label(details)
        this.dataPersist({
          randerContent: this.randerContent,
          randerSymbol: this.randerSymbol
        })
      } else {
        this.data.content = this.data.symbol
      }
    },
    translation(char) {
      if (Translations.translation.get(char)) {
        return Translations.translation.get(char)
      } else {
        return char
      }
    },
    label(details) {
      let text = this.data.content
      let _new = ''
      if (details[0].words) {
        details.forEach((value, index) => {
          value.words.forEach((val, idx) => {
            let word = val.text
            let score = val.score
            let reg = new RegExp(`(^|\\s|['"])(${word})(\\s|[.?!,;:'"])`, 'i')
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
        text = text.replace(/bbb\|/g, `<span style='color: #ff5f21'>`)
          .replace(/nnn\|/g, `<span style='color: #8f8b93'>`)
          .replace(/ggg\|/g, `<span style='color: #21bd73'>`)
          .replace(/\|eee/g, `</span>`)
        return text
      } else if (details[0].char || details[0].text) {
        let totalScore = 0
        details.forEach((val, index) => {
          let key = val.char ? val.char : val.text
          let score = val.score
          totalScore += score
          let pattern = new RegExp(`(?:^['"()]?${key}|\\s['"]?${key})[,.?!'"()]*`, 'i')
          let result = pattern.exec(text)
          let result0 = result[0]
          let _r = ''
          text = text.substring(result0.length)
          if (score < this.$config.ScoreLevel.bad) {
            _r = result0.replace(result0, `<span style='color: #ff5f21'>${result0}</span>`)
          } else if (score < this.$config.ScoreLevel.great) {
            _r = result0.replace(result0, `<span style='color: #8f8b93'>${result0}</span>`)
          } else {
            _r = result0.replace(result0, `<span style='color: #21bd73'>${result0}</span>`)
          }
          _new += _r;
        })
        totalScore = Math.ceil(details.length ? totalScore / details.length : 0)
        if (!details[0].phone) {
          if (totalScore < this.$config.ScoreLevel.bad) {
            this.randerSymbol = `<span style='color: #ff5f21'>${this.data.symbol}</span>`
          } else if (totalScore < this.$config.ScoreLevel.great) {
            this.randerSymbol = `<span style='color: #8f8b93'>${this.data.symbol}</span>`
          } else {
            this.randerSymbol = `<span style='color: #21bd73'>${this.data.symbol}</span>`
          }
        }
        return _new
      }
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
.StuWorkWord {
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