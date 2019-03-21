<template lang="pug">
  div.StuWorkConv
    div.layout(v-if="currentProcess === 1")
      ul.conv_topic.gd.smart-scroll(ref='elmnt')
        li(v-for='(topic, idx) in randerContent' :class="{done: !topic.done}")
          dl
            span(:class="'bg-color'+topic.indexes") {{topic.role}}
            i.playGif(v-if="currentId === topic.id && currentType === 'gd'")
          dl.f24.grey9(v-if='topic.htmlContent' v-html='topic.htmlContent')
          dl.f24.grey9(v-else v-html='topic.content')
          dl.f18.grey9(v-if="topic.done") {{topic.translation}}
    div.layout(v-else-if="currentProcess === 2")
      p.currentrole.f18.grey9 {{currentText}}
      ul.conv_topic.gd.smart-scroll(ref='elmnt')
        li(v-for='topic in randerContent' :class="{done: !topic.done, selected: topic.selected}")
          dl(v-if='topic.selected')
            img(:src="$store.state.avatar" alt='')
            span
          dl(v-else)
            span(:class="'bg-color'+topic.indexes") {{topic.role}}
          dl.f24.grey9(v-if='topic.htmlContent' v-html='topic.htmlContent')
          dl.f24.grey9(v-else v-html='topic.content')
          dl.f18.grey9(v-if="topic.done") {{topic.translation}}
    div.role.role_there(v-else-if="currentProcess === 3 && role.length <= 3")
      p {{currentText}}
      dl(v-if="currentRole")
        span 即将开始&nbsp;
        span {{countDownTime}}
      ul
        li(v-for="(per,idx) in role" @click="selectRole(per)" :class="'bg-color'+idx")
          div
          dl
            span {{per}}
          img(v-if="currentRole === per" :src="$store.state.avatar" alt='')
    div.role.role_six(v-else-if="currentProcess === 3")
      p {{currentText}}
      dl(v-if="currentRole")
        span 即将开始&nbsp;
        span {{countDownTime}}
      vue-scroll
        ul
          li(v-for="(per,idx) in role" @click="selectRole(per)" :class="'bg-color'+idx")
            div
            dl
              span {{per}}
            img(v-if="currentRole === per" :src="$store.state.avatar" alt='')
</template>

<script>
export default {
  name: 'StuWorkConv',
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
      repeat: 0, // 自动流程循环次数
      videoStatus: {
        playStatus: 0,
        recordStatus: 0,
        replayStatus: 0
      },
      randerContent: [],
      currentId: '',
      currentIndex: 0,
      currentRole: '',
      resultDetailList: [],
      getReqParam: {},
      currentProcess: 0, // 1预读 | 2角色跟读 | 3角色选择
      role: [],
      countDownTime: 3,
      currentText: '请选择一个角色',
      replayIndex: 0,
      currentType: '',
      dist: 0,
      clearTimeOut: ''
    }
  },
  methods: {
    initPlayStatus(callback = function () {}) {
      this.videoStatus.replayStatus = 4
      this.videoStatus.playStatus = 4
      this.videoStatus.recordStatus = 2
      this.getVideoStatus(this.videoStatus)
      callback()
    },
    initRecordStatus(callback = function () {}) {
      this.videoStatus.replayStatus = 4
      this.videoStatus.playStatus = 4
      this.videoStatus.recordStatus = 1
      this.getVideoStatus(this.videoStatus)
      callback()
    },
    resetStatus() { // 切换小题还原状态
      this.repeat = 0
      this.dist = 0
      let $elmnt = this.$refs.elmnt
      if ($elmnt) $elmnt.scrollTop = this.dist
      this.currentProcess = 1
      this.currentIndex = 0
      this.currentRole = ''
      this.currentText = ''
      this.resultDetailList = []
      this.getReqParam = {}
      if (this.autoFlag) {
        this.randerContent = []
        this.videoStatus.playStatus = 4
        this.videoStatus.recordStatus = 2
        this.videoStatus.replayStatus = 4
      } else { // 已做
        this.randerContent = this.data.randerContent ? this.data.randerContent : []
        this.videoStatus.playStatus = 0
        this.videoStatus.recordStatus = 0
        this.videoStatus.replayStatus = 0
      }
      this.getVideoStatus(this.videoStatus)
      this.data.content.forEach((val, index) => {
        this.resultDetailList[index] = {
          role: '',
          stdAudioUrl: '',
          score: '',
          label: '',
          recordAudioUrl: ''
        }
      })
      this.setScore(this.getReqParam)
    },
    handleData() {
      this.resetStatus()
      this.role = this.data.role
      if (this.randerContent.length === 0) {
        this.randerContent = this.data.content
      }
      this.randerContent.forEach((val, index) => {
        let indexes = this.role.indexOf(val.role)
        this.$set(this.randerContent[index], 'indexes', indexes)
        this.$set(this.randerContent[index], 'selected', false)
        if (this.autoFlag) {
          this.$set(this.randerContent[index], 'done', false)
        }
      })
      this.currentType = this.work.practiceType
      this.start()
    },
    removeSpace(data) {
      if (data) {
        return data.replace(/\s*$/, '')
      } else {
        return ''
      }
    },
    removeTag(tag) {
      if (tag && tag.indexOf('<') >= 0 && tag.indexOf('<') >= 0) {
        return tag.replace(/<[^>]+>/g, '')
      } else {
        return tag
      }
    },
    selectRole(role) {
      this.dist = 0
      this.currentRole = role
      this.currentText = `你扮演的是${role}`
      this.countDown()
    },
    countDown() {
      setTimeout(() => {
        if (this.countDownTime <= 1) {
          this.currentProcess = 2
          this.videoStatus.playStatus = 4
          this.videoStatus.replayStatus = 4
          this.videoStatus.recordStatus = 6
          this.getVideoStatus(this.videoStatus)
          this.roleGD()
        } else {
          this.countDownTime--
          this.countDown()
        }
      }, 1000)
    },
    roleGD() {
      this.currentIndex = 0
      this.randerContent.forEach((val, index) => {
        this.randerContent[index].done = false
        if (val.role === this.currentRole) {
          this.randerContent[index].selected = true
          this.randerContent[index].htmlContent = ''
        }
      })
      this.rolePlay()
    },
    doAgain() {
      this.dist = 0
      let $elmnt = this.$refs.elmnt
      $elmnt.scrollTop = this.dist
      this.randerContent = []
      this.data.randerContent = []
      this.currentIndex = 0
      this.data.content.forEach((val, idx) => {
        this.data.content[idx].htmlContent = ''
        this.data.content[idx].done = false
      })
      this.handleData()
    },
    start() {
      this.currentProcess = 1
      this.$set(this.randerContent[this.currentIndex], 'done', true)
      this.currentId = this.randerContent[this.currentIndex].id
      if (this.autoFlag) {
        if (this.work.practiceType === 'ld') {
          this.clearTimeOut = window.setTimeout(() => {
            this.initRecordStatus(() => {
              this.currentId = ''
              this.doRecord(this.removeTag(this.randerContent[this.currentIndex].content), this.getScore_ld)
            })
          }, 1000)
        } else if (this.work.practiceType === 'gd') {
          this.repeat++
          this.initPlayStatus(() => {
            this.doPlay(this.randerContent[this.currentIndex].audio, () => {
              this.currentId = ''
              this.initRecordStatus(() => {
                this.doRecord(this.removeTag(this.randerContent[this.currentIndex].content), this.getScore_gd)
              })
            })
          })
        }
      }
    },
    recordText() {
      return this.data.content[this.currentIndex].content
    },
    rolePlay() {
      this.$set(this.randerContent[this.currentIndex], 'done', true)
      if (this.currentIndex === this.randerContent.length - 1) { // 最后一句
        if (this.randerContent[this.currentIndex].selected) { // 录音
          this.initRecordStatus(() => {
            this.doRecord(this.removeTag(this.randerContent[this.currentIndex].content), this.getScore_gd)
          })
        } else {
          this.initPlayStatus(() => {
            this.doPlay(this.randerContent[this.currentIndex].audio, () => {
              this.videoStatus.replayStatus = 0
              this.videoStatus.recordStatus = 5 // 再练一下
              this.videoStatus.playStatus = 0
              this.getVideoStatus(this.videoStatus)
              this.calculationScore()
            })
          })
        }
      } else {
        if (this.randerContent[this.currentIndex].selected) {
          this.initRecordStatus(() => {
            this.doRecord(this.removeTag(this.randerContent[this.currentIndex].content), this.getScore_gd)
          })
        } else {
          this.initPlayStatus(() => {
            this.doPlay(this.randerContent[this.currentIndex].audio, () => {
              this.currentIndex++
              this.scrollTOP()
              this.rolePlay()
            })
          })
        }
      }
    },
    calculationScore () {
      let totalScore = 0
      let totalAccuracy = 0
      let totalFluency = 0
      let totalIntegrity = 0
      let totalSpeed = 0
      let scorelength = 0
      let accuracylength = 0
      let fluencylength = 0
      let integritylength = 0
      let speedlength = 0
      this.resultDetailList.forEach((val, index) => {
        if (val.score >= 0) {
          totalScore += val.score
          scorelength++
        }
        if (val.accuracy >= 0) {
          totalAccuracy += val.accuracy
          accuracylength++
        }
        if (val.fluency >= 0) {
          totalFluency += val.fluency
          fluencylength++
        }
        if (val.integrity) {
          totalIntegrity += val.integrity
          integritylength++
        }
        if (val.speed >= 0) {
          totalSpeed += val.speed
          speedlength++
        }
      })
      this.$set(this.getReqParam, 'showScore', true)
      this.$set(this.getReqParam, 'score', scorelength > 0 ? Math.ceil(totalScore / scorelength) : 0)
      this.$set(this.getReqParam, 'accuracy', accuracylength > 0 ? Math.ceil(totalAccuracy / accuracylength) : 0)
      this.$set(this.getReqParam, 'fluency', fluencylength > 0 ? Math.ceil(totalFluency / fluencylength) : 0)
      this.$set(this.getReqParam, 'integrity', integritylength > 0 ? Math.ceil(totalIntegrity / integritylength) : 0)
      this.$set(this.getReqParam, 'speed', speedlength > 0 ? Math.ceil(totalSpeed / speedlength) : 0)
      this.$set(this.getReqParam, 'resultDetail', this.resultDetailList)
      this.setScore(this.getReqParam)
    },
    scoreLeve(param) {
      this.$set(this.resultDetailList[this.currentIndex], 'score', param.score)
      this.$set(this.resultDetailList[this.currentIndex], 'content', this.data.content[this.currentIndex].content)
      this.$set(this.resultDetailList[this.currentIndex], 'role', this.randerContent[this.currentIndex].role)
      this.$set(this.resultDetailList[this.currentIndex], 'stdAudioUrl', this.randerContent[this.currentIndex].audio)
      this.$set(this.resultDetailList[this.currentIndex], 'recordAudioUrl', `http://${param.audioUrl ? param.audioUrl.replace(/:8002/, '') : ''}.mp3`)
      this.$set(this.resultDetailList[this.currentIndex], 'accuracy', param.accuracy)
      this.$set(this.resultDetailList[this.currentIndex], 'fluency', param.fluency)
      this.$set(this.resultDetailList[this.currentIndex], 'integrity', param.integrity)
      this.$set(this.resultDetailList[this.currentIndex], 'speed', param.speed)
      if (this.currentProcess === 2) { // 角色跟读
        if (this.currentIndex === this.randerContent.length - 1) { // 结束
          this.calculationScore()
          this.videoStatus.replayStatus = 0
          this.videoStatus.recordStatus = 5 // 再练一下
          this.videoStatus.playStatus = 0
          this.getVideoStatus(this.videoStatus)
        } else {
          this.videoStatus.replayStatus = 4
          this.videoStatus.recordStatus = 2
          this.videoStatus.playStatus = 4
          this.getVideoStatus(this.videoStatus)
          this.currentIndex++
          this.scrollTOP()
          this.rolePlay()
        }
      } else {
        this.videoStatus.replayStatus = 4
        this.videoStatus.recordStatus = 2
        this.videoStatus.playStatus = 4
        this.getVideoStatus(this.videoStatus)
        if (this.work.practiceType === 'ld') {
          this.levelAudio(param.score, () => {
            if (this.currentIndex === this.randerContent.length - 1) {
              this.videoStatus.recordStatus = 6
              this.getVideoStatus(this.videoStatus)
              this.currentText = '请选择一个角色'
              this.currentProcess = 3
            } else {
              this.currentIndex++
              this.scrollTOP()
              this.start()
            }
          })
        } else if (this.work.practiceType === 'gd') {
          this.levelAudio(param.score, () => {
            if (this.repeat <= this.$config.ScoreLevel.repeat && param.score < this.$config.ScoreLevel.bad) {
              this.start()
            } else {
              this.repeat = 0
              if (this.currentIndex === this.randerContent.length - 1) {
                this.videoStatus.recordStatus = 6
                this.getVideoStatus(this.videoStatus)
                this.currentText = '请选择一个角色'
                this.currentProcess = 3
              } else {
                this.currentIndex++
                this.scrollTOP()
                this.start()
              }
            }
          }, this.repeat, this.currentIndex, this.resultDetailList[this.currentIndex].recordAudioUrl)
        }
      }
    },
    scrollTOP() {
      if (this.currentIndex < this.randerContent.length) {
        let $elmnt = this.$refs.elmnt
        this.dist += $elmnt.children[this.currentIndex - 1].clientHeight + 80
        $elmnt.scrollTop = this.dist
      }
    },
    render(details) {
      this.$set(this.randerContent[this.currentIndex], 'htmlContent', this.label(details))
      this.$set(this.resultDetailList[this.currentIndex], 'label', this.label(details))
      this.dataPersist({
        randerContent: this.randerContent,
      })
    },
    label(details) {
      let text = this.data.content[this.currentIndex].content
      let _new = ''
      if (details[0].words) {
        details.forEach((value, index) => {
          value.words.forEach((val, idx) => {
            let word = val.text
            let score = val.score
            let reg = new RegExp(`(^|\\s|['"])(${word})(\\s|[.?!,;:'"])`, 'i')
            let endtag = `|eee`
            let startTag = score < this.$config.ScoreLevel.bad ? `bbb|` : (score < this.$config.ScoreLevel.good ? `nnn|` : `ggg|`)
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
        details.forEach((val, index) => {
          let key = val.char ? val.char : val.text
          let score = val.score
          let pattern = new RegExp(`(?:^['"()]?${key}|\\s['"]?${key})[,.?!'"()]*`, 'i')
          let result = pattern.exec(text)
          let result0 = result[0]
          let _r = ''
          text = text.substring(result0.length)
          if (score < this.$config.ScoreLevel.bad) {
            _r = result0.replace(result0, `<span style='color: #ff5f21'>${result0}</span>`)
          } else if (score < this.$config.ScoreLevel.good) {
            _r = result0.replace(result0, `<span style='color: #8f8b93'>${result0}</span>`)
          } else {
            _r = result0.replace(result0, `<span style='color: #21bd73'>${result0}</span>`)
          }
          _new += _r;
        })
        return _new
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
      setTimeout(() => {
        this.handleData()
      }, 200)
    },
    lastTopicFlag: function (val) {
      if (val) {
        this.switchTopic()
      }
    }
  },
  mounted() {
    this.handleData()
    this.$store.commit('avatar', this.$store.state.student.avatar)
  }
}
</script>

<style lang='less'>
.StuWorkConv {
  text-align: center;
  height: inherit;
  position: relative;
  .layout {
    width: 100%;
    height: inherit;
    overflow: hidden;
    position: relative;
    p.currentrole {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      margin-bottom: 25px;
      line-height: 24px;
      text-align: center;
      width: 100%;
    }
    .conv_topic {
      width: inherit;
      border: none;
      background: #fff;
      height: 397px;
      overflow: scroll;
      &.gd {
        text-align: left;
      }
      & > li {
        margin-top: 80px;
        &:first-child {
          margin-top: 0;
        }
        & > dl {
          &:nth-child(1) {
            & > span {
              &:first-child {
                height: 40px;
                line-height: 40px;
                border-radius: 20px;
                color: #fff;
                font-size: 22px;
                padding: 0 20px;
              }
            }
            & > .playGif {
              display: inline-block;
              width: 30px;
              height: 30px;
              margin-left: 5px;
              position: relative;
              top: 6px;
              background: url('/static/images/practice/work/V_playing.png') no-repeat center;
              animation: playgif 1s steps(1) infinite 0s;
              -moz-animation: playgif 1s steps(1) infinite 0s;
              -webkit-animation: playgif 1s steps(1) infinite 0s;
              -o-animation: playgif 1s steps(1) infinite 0s;
            }
          }
          &:nth-child(2) {
           margin-top: 15px;
           line-height: 36px;
           span {
             font-size: 24px;
           }
          }
          &:nth-child(3) {
           margin-top: 15px;
           line-height: 24px;
          }
        }
        &.done {
          & > dl {
            &:nth-child(1) {
              & > span {
                &:first-child {
                  position: relative;
                  &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 20px;
                  }
                }
              }
            }
            &:nth-child(2) {
              color: #ccc;
            }
          }
        }
        &.selected {
          text-align: right;
          padding-right: 10px;
          dl {
            &:nth-child(1) {
              padding-right: 10px;
            }
            img {
              display: inline-block;
              border-radius: 50%;
              width: 60px;
              height: 60px;
            }
          }
        }
      }
    }
  }

  .role {
    p {
      font-size: 36px;
      color: #666;
      line-height: 36px;
    }
    dl {
      position: relative;
      top: 30px;
      span {
        color: #24cc7c;
        font-size: 16px;
      }
    }
    &.role_there {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      margin-top: -100px;
      & > ul {
        margin-top: 120px;
        text-align: center;
        & > li {
          display: inline-block;
          max-width: 200px;   
          height: 40px;
          line-height: 40px;
          border-radius: 20px;
          color: #fff;
          padding: 0 20px;
          margin: 0 20px;
          position: relative;
          z-index: 10;
          cursor: pointer;
          & > div {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
            background: inherit;
            border-radius: 50%;
          }
          & > dl {
            height: 40px;
            line-height: 40px;
            font-size: 22px;
            color: #fff;
            cursor: pointer;
            top: 0;
            z-index: 10;
            & > span {
              font-size: 22px;
              color: #fff;
              cursor: pointer;
            }
          }
          & > img {
            position: absolute;
            top: -50px;
            left: 50%;
            width: 60px;
            height: 60px;
            margin-left: -30px;
            z-index: 1;
            border: 1px solid #efefef;
            border-radius: 50px;
          } 
        }
      }
    }
    &.role_six {
      ul {
        margin-top: 40px;
        text-align: center;
        & > li {
          float: left;
          width: 28%;
          display: block;
          height: 40px;
          line-height: 40px;
          border-radius: 20px;
          color: #fff;
          padding: 0 20px;
          margin: 70px 20px 0;
          position: relative;
          cursor: pointer;
          & > div {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
            background: inherit;
            border-radius: 50%; 
          }
          & > dl {
            height: 40px;
            line-height: 40px;
            font-size: 22px;
            color: #fff;
            cursor: pointer;
            top: 0;
            z-index: 10;
            top: 0;
            z-index: 10;
            & > span {
              font-size: 22px;
              color: #fff;
              cursor: pointer;
            }
          }
          & > img {
            position: absolute;
            top: -50px;
            left: 50%;
            width: 60px;
            height: 60px;
            margin-left: -30px;
            z-index: 1;
            border: 1px solid #efefef;
            border-radius: 50px;
          }
        }
      }
    }
  }
}
.bg-color0 {
  background: #24cc7c!important;
}
.bg-color1 {
  background: #ff9900!important;
}
.bg-color2 {
  background: #5dccff!important;
}
.bg-color3 {
  background: #ff8888!important;
}
.bg-color4 {
  background: #e58cb2!important;
}
.bg-color5 {
  background: #fbc587!important;
}
.bg-color6 {
  background: #adabca!important;
}
.bg-color7 {
  background: #92cba2!important;
}
.bg-color8 {
  background: #fb878a!important;
}
.bg-color9 {
  background: #d6b1a1!important;
}
@keyframes playgif {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: -30px 0;
  }
  50% {
    background-position: -60px 0;
  }
  75% {
    background-position: -90px 0;
  }
  100% {
    background-position: 0 0;
  }
}
@-webkit-keyframes playgif {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: -30px 0;
  }
  50% {
    background-position: -60px 0;
  }
  75% {
    background-position: -90px 0;
  }
  100% {
    background-position: 0 0;
  }
}
.smart-scroll::-webkit-scrollbar{width:4px;height:12px;}
.smart-scroll::-webkit-scrollbar-button:vertical{display:none;}
.smart-scroll::-webkit-scrollbar-track:vertical{background-color:black;}
.smart-scroll::-webkit-scrollbar-track-piece{background:#FFF;}
.smart-scroll::-webkit-scrollbar-thumb:vertical{background-color:#75d6a8;border-radius:3px;}
.smart-scroll::-webkit-scrollbar-thumb:vertical:hover{background-color:#75d6a8;}
.smart-scroll::-webkit-scrollbar-corner:vertical{background-color:#75d6a8;}
.smart-scroll::-webkit-scrollbar-resizer:vertical{background-color:#FF6E00;}
</style>