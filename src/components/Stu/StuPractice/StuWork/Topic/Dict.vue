<template lang="pug">
  div.StuWorkDict
    div.layout
      i.play(@click='playEvent' :class="{playing: playStatus === 1}")
      input(v-if='status' v-model='answer' :class="{right: status === 'right', error: status === 'error'}" disabled)
      input(v-else v-model='answer' maxlength="32" autofocus v-focus)
      p.f18.grey9 {{tipText}}
      p(v-if="status === 'error'")
        span 正确答案：
        span.f24 {{rightAnswer}}
</template>

<script>
import Vue from 'vue'
Vue.directive('focus', { // 添加input自动获取焦点指令
  inserted: (el, bind) => {
    el.focus()
  }
})
const pass = `/static/sound/px_pass.ogg`
const fail = `/static/sound/px_fail.mp3`
export default {
  name: 'StuWorkDict',
  props: [
    'data',
    'player',
    'doPlay',
    'subIndex',
    'dataPersist',
    'setScore',
    'next'
  ],
  data() {
    return {
      answer: '',
      rightAnswer: '',
      status: '',
      playStatus: 0, // 0停止 | 1播放
      enterTouchNum: 0,
      tipText: '输入你听到的单词，点击回车键提交'
    }
  },
  methods: {
    removeSpace(str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    resetStatus() {
      this.answer = ''
      this.rightAnswer = ''
      this.status = ''
      this.enterTouchNum = 0
      this.playStatus = 0
      this.tipText = '输入你听到的单词，点击回车键提交'
    },
    playEvent() {
      if (this.playStatus === 0) {
        this.playStatus = 1
        this.doPlay(this.data.audio, () => {
          this.playStatus = 0
        })
      } else if (this.playStatus === 1) {
        this.playStatus = 0
        this.player.stop()
      }
    },
    judgeAnswer() {
      if (this.enterTouchNum === 0) {
        this.answer = this.removeSpace(this.answer)
        let param = {
          content: this.data.content,
          yourAnswer: this.answer,
          stdAudioUrl: this.data.audio,
          index: this.subIndex,
          score: 100,
          show: true
        }
        if (this.answer === this.data.content) {
          this.status = 'right'
          this.doPlay(pass, () => {
            this.playStatus = 0
          })
        } else {
          this.status = 'error'
          this.rightAnswer = this.data.content
          param.score = 0
          this.doPlay(fail, () => {
            this.playStatus = 0
          })
        }
        this.setScore(param)
        this.tipText = '点击回车进入下一题'
      }
    },
    handleData() {
      this.resetStatus()
      this.start()
    },
    start() {
      this.playStatus = 1
      this.doPlay(this.data.audio, () => {
        this.playStatus = 0
      })
    },
    keydownEvent(event) {
      if (event.keyCode === 13) {
        if (this.enterTouchNum === 0) {
          this.player.stop()
          this.judgeAnswer()
          this.enterTouchNum++
        } else if (this.enterTouchNum === 1) {
          this.next()
        }
      }
    }
  },
  watch: {
    subIndex: function (val) {
      this.player.stop()
      this.answer = ''
      this.handleData()
    }
  },
  mounted() {
    this.start()
    window.addEventListener('keydown', (event) => {
      this.keydownEvent(event)
    }, false)
  }
}
</script>

<style lang='less'>
.StuWorkDict {
  text-align: center;
  height: inherit;
  position: relative;
  .layout {
    position: absolute;
    top: 50%;
    left: 0;
    height: 230px;
    width: 100%;
    margin-top: -115px;
    & > i.play {
      display: block;
      width: 60px;
      height: 60px;
      margin: 0 auto;
      background: url('/static/images/practice/work/audios_playing.png') no-repeat center;
      background-position: -120px 0;
      cursor: pointer;
      &.playing {
        animation: playing 1s steps(1) infinite 0s;
        -moz-animation: playing 1s steps(1) infinite 0s;
        -webkit-animation: playing 1s steps(1) infinite 0s;
        -o-animation: playing 1s steps(1) infinite 0s;
      }
    } 
    & > input {
      margin: 25px auto 0;
      width: 350px;
      height: 60px;
      line-height: 60px;
      border-radius: 15px;
      padding: 0 15px;
      text-align: center;
      font-size: 36px;
      color: #666;
      border: none;
      background: #f8f8f8;

      &:focus {
        border-color: #ccc;
      }
      &.right {
        color: #fff;
        background: #24cc7c;
      }
      &.error {
        color: #fff;
        background: #ff6666;
      }
    }
    & > p {
      &:nth-child(2) {
        line-height: 24px;
        text-align: center;
        box-sizing: border-box;
        margin-top: 15px;
      }
      &:nth-child(3) {
        line-height: 28px;
        margin-top: 15px;
        & > span:first-child {
          font-size: 22px;
          color: #24cc7c;
        }
        & > span:last-child {
          color: #24cc7c;
        }
      }
    }
  }
}
@keyframes playing {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: -60px 0;
  }
  75% {
    background-position: -120px 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>