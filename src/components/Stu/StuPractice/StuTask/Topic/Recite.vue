<template lang="pug">
  div.StuTaskRecite
    div.layout
      vue-scroll(v-if="currentReciteStatus === 1")
        div.reading
          p.f18.grey6 背前试读
          p.f14.grey9 背诵前先读一遍试试，VIP用户需读过80分才可以背诵哦~
          p.f24.grey6(v-if="randerContent" v-html='randerContent')
          p.f24.grey6(v-else v-html='data.content')
      div.reciteing(v-if="currentReciteStatus === 2")
        p
          span.breathLight
          span.f18.grey6 背诵中
      vue-scroll(v-if="currentReciteStatus === 3")
        div.translation
          span.breathLight
          span.f18.grey6 背诵中
          p.f18.grey9(v-html='data.translation')
      div.startRecite(v-if="currentReciteStatus === 4")
        span {{countDownTime}}
      vue-scroll(v-if="currentReciteStatus === 5")
        div.result
          p.f24.grey6(v-if="randerContent" v-html='randerContent')
          p.f24.grey6(v-else v-html='data.content')
    i.f18.showTrans(v-if="currentReciteStatus === 2 || currentReciteStatus === 3" @click="showTrans()") 译
</template>

<script>

export default {
  name: 'StuTaskRecite',
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
      currentReciteStatus: 1, // 1 试读 | 2背诵 | 3 翻译 | 4 背诵倒计时 | 5 背诵结果
      shortContent: '',
      setScoreParam: {},
      countDownTime: 3,
      retiteFlag: false,
      countDownTimeOut: '',
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
      this.retiteFlag = false
      this.currentReciteStatus = 1
      this.countDownTime = 3
      if (this.autoFlag) {
        this.randerContent = ''
        this.videoStatus.playStatus = 2
        this.videoStatus.recordStatus = 2
        this.videoStatus.replayStatus = 2
      } else {
        if (this.data.randerContent) {
          this.randerContent = this.data.randerContent
          this.videoStatus.replayStatus = 0
          this.videoStatus.recordStatus = 0
          this.videoStatus.playStatus = 0
          // if (this.data.reciteStatus === 1) { // 试读完成
          //   if (this.data.retiteFlag) {
          //     this.retiteFlag = true
          //     this.videoStatus.replayStatus = 0
          //     this.videoStatus.recordStatus = 3
          //     this.videoStatus.playStatus = 3
          //   } else {
          //     this.retiteFlag = false
          //     this.videoStatus.replayStatus = 0
          //     this.videoStatus.recordStatus = 0
          //     this.videoStatus.playStatus = 0
          //   }
          // } else if (this.data.reciteStatus === 2) { // 背诵完成
          //   this.currentReciteStatus = 5
          //   this.videoStatus.playStatus = 0
          //   this.videoStatus.replayStatus = 0
          //   this.videoStatus.recordStatus = 4 // 重新背诵
          // }
          this.getVideoStatus(this.videoStatus)
        } else {
          this.randerContent = ''
        }
        this.videoStatus.playStatus = 0
        this.videoStatus.recordStatus = 0
        this.videoStatus.replayStatus = 0
      }
      this.getVideoStatus(this.videoStatus)
    },
    handleData() {
      this.resetStatus()
      let words = this.data.content.split(' ')
      this.shortContent = `${[words[0], words[1], words[2]].join(' ')}...`
      this.start()
    },
    removeSpace(data) {
      return data.replace(/\s*$/, '')
    },
    showTrans() {
      if (this.currentReciteStatus === 2) {
        this.currentReciteStatus = 3
      } else if (this.currentReciteStatus === 3) {
        this.currentReciteStatus = 2
      }
    },
    startRecite() {
      this.currentReciteStatus = 4
      this.setScore(this.setScoreParam)
      this.countDownTimeOut = setTimeout(() => {
        if (this.countDownTime <= 1) {
          this.currentReciteStatus = 2
          this.videoStatus.playStatus = 2
          this.videoStatus.replayStatus = 2
          this.videoStatus.recordStatus = 1
          this.getVideoStatus(this.videoStatus)
          this.doRecord(this.data.content, this.getScore)
        } else {
          this.countDownTime--
          this.startRecite()
        }
      }, 1000)
    },
    reRecite() {
      this.countDownTime = 3
      this.startRecite()
    },
    start() {
      if (this.autoFlag) {
        this.initPlayStatus(() => {
          this.doPlay(this.data.audio, () => {
            this.initRecordStatus(() => {
              this.doRecord(this.data.content, this.getScore)
            })
          })
        })
      }
    },
    scoreLeve(param) {
      this.randerContent = this.data.content
      this.setScoreParam = {
        stdAudioUrl: this.data.audio,
        recordAudioUrl: param.audioUrl ? `http://${param.audioUrl.replace(/:8002/, '')}.mp3` : '',
        score: param.score,
        label: this.randerContent,
        fluency: param.fluency,
        integrity: param.integrity,
        accuracy: param.accuracy,
        showScore: true
      }
      if (this.retiteFlag) { // 背诵
        this.currentReciteStatus = 5
        this.$set(this.setScoreParam, 'complete', true)
        this.setScore(this.setScoreParam)
        this.videoStatus.playStatus = 0
        this.videoStatus.replayStatus = 0
        this.videoStatus.recordStatus = 4 // 重新背诵
        this.getVideoStatus(this.videoStatus)
        this.randerContent = this.data.content
        this.dataPersist({
          randerContent: this.randerContent,
          reciteStatus: 2
        })
      } else {
        this.retiteFlag = true
        this.videoStatus.replayStatus = 0
        this.videoStatus.recordStatus = 3
        this.videoStatus.playStatus = 3
        this.$set(this.setScoreParam, 'complete', false)
        this.setScore(this.setScoreParam)
        this.getVideoStatus(this.videoStatus)
        this.levelAudio(param.score)
        this.dataPersist({
          randerContent: this.randerContent,
          reciteStatus: 1,
          retiteFlag: this.retiteFlag
        })
      }
    },
    getScore(param) {
      this.scoreLeve(param)
    },
    switchTopic() {
      window.clearTimeout(this.countDownTimeOut)
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
.StuTaskRecite {
  text-align: center;
  height: inherit;
  position: relative;
  .layout {
    position: absolute;
    top: 15px;
    left: 0;
    width: 100%;
    height: -webkit-fill-available;
    .reading {
      & > p {
        &:nth-child(1) {
          line-height: 24px;
          text-align: center;
        }
        &:nth-child(2) {
          line-height: 24px;
          margin-top: 10px;
          text-align: center;
        }
        &:nth-child(3) {
          line-height: 48px;
          text-align: left;
          margin-top: 10px;
          & > span {
            font-size: 24px;
            line-height: 18px;
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
      }
    }
    .reciteing {
      & > p {
        &:nth-child(1) {
          text-align: center;
          & > span.breathLight {
            display: inline-block;
            width: 10px;
            height: 10px;
            margin-right: 10px;
            opacity: 0.1;
            overflow: hidden;
            background: #ff9900;
            border-radius: 5px;
            animation: breath 1.2s ease-in-out infinite;
            -webkit-animation: breath 1.2s ease-in-out infinite;
          }
          & > span:last-child {
            line-height: 24px;
          }
        }
        &:nth-child(2) {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          margin-top: -60px;
          line-height: 48px;
          width: auto;
          display: inline-block;
        }
        &:nth-child(3) {
          line-height: 48px;
          & > span {
            font-size: 24px;
            line-height: 48px;
          }
        }
      }
    }
    .result {
      & > p {
        &:nth-child(1) {
          line-height: 48px;
          text-align: left;
          & > span {
            font-size: 24px;
            line-height: 48px;
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
      }
    }
    .translation {
      & > span {
        &.breathLight {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: 10px;
          opacity: 0.1;
          overflow: hidden;
          background: #ff9900;
          border-radius: 5px;
          animation: breath 1.2s ease-in-out infinite;
          -webkit-animation: breath 1.2s ease-in-out infinite;
        }
      }
      & > p {
        line-height: 48px;
        text-align: left;
        padding-top: 30px;
      }
    }
    .startRecite {
      span {
        display: block;
        width: 100px;
        height: 100px;
        line-height: 100px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -50px 0 0 -50px;
        border-radius: 50%;
        background: #24cc7c;
        font-size: 48px;
        color: #fff;
        font-weight: bold;
        text-align: center;
      }
    }
  }
  & > i.showTrans {
    display: block;
    position: absolute;
    top: 0;
    right: 40px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;
    text-align: center;
    background: #24cc7c;
    color: #fff;
    font-style: normal;
    cursor: pointer;
  }
  @keyframes breath {
    from {
      opacity: 0.2;
    } 
    50% {
      opacity: 1;
    }
    to {
      opacity: 0.2;
    }
  }
  @-webkit-keyframes breath {
    from {
      opacity: 0.2;
    } 
    50% {
      opacity: 1;
    }
    to {
      opacity: 0.2;
    }
  }
}
</style>