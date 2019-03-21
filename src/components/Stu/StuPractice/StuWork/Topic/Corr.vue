<template lang="pug">
  div.Correct
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
            p(v-if="correctStatus !== -1")
              span.f16.grey9 你的：
              span.f18.randerSymbol(v-if='correctStatus === 0 || correctStatus === 1' v-html='randerSymbol')
              span.jiuyin(v-if='correctStatus === 1' @click='correction') 去纠音
    div.layout(v-else)
      p.grey6(v-if='randerContent' v-html='randerContent')
      p.grey6(v-else v-html='data.content')
      div.symbolFeedBack
        div
          span.f16.grey9(v-show="data.symbol") 英：
          span.f18.grey9.left(v-show="data.symbol" v-html='data.symbol')
          span.f16.grey9.right(v-show="data.symbol_am") 美：
          span.f18.grey9(v-show="data.symbol_am" v-html='data.symbol_am')
          p(v-if="correctStatus !== -1")
            span.f16.grey9 你的：
            span.f18.randerSymbol(v-if='correctStatus === 0 || correctStatus === 1' v-html='randerSymbol')
            span.jiuyin(v-if='correctStatus === 1' @click='correction') 去纠音
    div.examToast(v-if='toast.isShow' :class="{etNoIcon: toast.type === 'noIcon'}")
        img(:src='"/static/images/practice/exam/toast_" + toast.img + ".png"' v-if='toast.type !== "noIcon"')
        div.et-cnt
          p.et-text1 {{ toast.text1 }}
          p.et-text2 {{ toast.text2 }}
</template>

<script>
import Translations from './Translation'
import emitter from '@/ui/src/mixins/emitter.js'

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
  components: Object.assign({}, { Translations }),
  data() {
    return {
      videoStatus: {
        playStatus: 0,
        recordStatus: 0,
        replayStatus: 0
      },
      randerContent: '',
      randerSymbol: '',
      correctStatus: -1, // 0通过 1需反馈
      reqParam: {},
      referSymbol: '',
      toast: {
        isShow: false,
        type: '', // noIcon
        img: '',
        text1: '',
        text2: ''
      }
    }
  },
  mixins: [emitter],
  methods: {
    resetStatus() { // 切换小题还原状态
      this.videoStatus.playStatus = 0
      this.videoStatus.recordStatus = 0
      this.randerContent = this.data.randerContent ? this.data.randerContent : ''
      if (this.data.randerSymbol) {
        this.reqParam = this.data.reqParam
        this.randerSymbol = this.data.randerSymbol
        this.correctStatus = this.data.correctStatus
        this.videoStatus.replayStatus = 0
      } else {
        this.reqParam = {}
        this.randerSymbol = ''
        this.correctStatus = -1
        this.videoStatus.replayStatus = 2
      }
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
    handleToast (params) {
      this.toast = Object.assign({}, params, { isShow: true })
      setTimeout(() => {
        this.$set(this.toast, 'isShow', false)
      }, 3000)
    },
    correction() {
      this.dispatch('StuWork', 'jy', this.reqParam)
    },
    render(param) {
      const $scoreLeve = this.$config.ScoreLevel
      if (param.score > 0 && param.details) {
        this.randerSymbol = ''
        this.referSymbol = ''
        const result = param.details.word
        const phn = result[0].phn
        let num = 0
        if (phn.length > 0) {
          for (let k = 0; k < phn.length; k++) {
            this.referSymbol += /#/.test(phn[k].lab) ? this.translation(phn[k].lab.replace(/#/, '')) : this.translation(phn[k].lab)
            if (phn[k].is_err === 0) { // 通过
              this.randerSymbol += `<span style='color: #21bd73'>${this.translation(phn[k].rec)}</span>`
            } else if (phn[k].is_err === 2) { // 漏读
              num++
              this.randerSymbol += `<span style='color: #999;background: #f8f8f8;padding: 0 2px;border: 1px dotted #ccc;'>${this.translation(phn[k].lab)}</span>`
            } else {
              num++
              if (/#/.test(phn[k].rec)) {
                this.randerSymbol += `<span style='color: #ff5f21'>${this.translation(phn[k].rec.replace(/#/, ''))}</span>`
              } else {
                this.randerSymbol += `<span style='color: #ff5f21'>${this.translation(phn[k].rec)}</span>`
              }
            }
          }
          this.referSymbol = `[${this.referSymbol}]`
        }
        if (param.score >= $scoreLeve.good) {
          this.randerContent = `<span style='color: #21bd73'>${this.data.content}</span>`
          this.randerSymbol = `<span style='color: #21bd73'>[</span>${this.randerSymbol}<span style='color: #21bd73'>]</span>`
        } else if (param.score >= $scoreLeve.bad) {
          this.randerContent = `<span style='color: #8f8b93'>${this.data.content}</span>`
          this.randerSymbol = `<span style='color: #8f8b93'>[</span>${this.randerSymbol}<span style='color: #8f8b93'>]</span>`
        } else {
          this.randerContent = `<span style='color: #ff5f21'>${this.data.content}</span>`
          this.randerSymbol = `<span style='color: #ff5f21'>[</span>${this.randerSymbol}<span style='color: #ff5f21'>]</span>`
        }
        if (param.score === 100) {
          this.correctStatus = 0
          this.levelAudio(param.score)
        } else {
          if (phn.length > 3 && Math.round((num / phn.length) * 100) >= 75) {
            this.correctStatus = -1
            this.randerSymbol = ''
            this.handleToast({
              isShow: true,
              type: 'noIcon',
              text1: '╮(╯▽╰)╭ ',
              text2: ' 嘿，同学，认真一点嘛~'
            })
          } else {
            this.correctStatus = 1
            this.levelAudio(param.score)
          }
        }
        this.reqParam = Object.assign(this.reqParam, {
          audio: this.data.audio,
          symbol: this.data.symbol,
          randerSymbol: this.randerSymbol
        })
        this.dataPersist({
          randerContent: this.randerContent,
          randerSymbol: this.randerSymbol,
          correctStatus: this.correctStatus,
          reqParam: this.reqParam
        })
      } else {
        this.correctStatus = -1
        this.randerSymbol = ''
        this.referSymbol = ''
        this.handleToast({
          isShow: true,
          img: 'headset',
          text1: '我没有听清你读的单词~'
        })
        this.randerContent = `<span style='color: #ff5f21'>${this.data.content}</span>`
      }
    },
    translation(char) {
      if (Translations.translation.get(char)) {
        return Translations.translation.get(char)
      } else {
        return char
      }
    },
    scoreLeve(score, audioUrl) {
      this.setScore({
        stdAudioUrl: this.data.audio,
        recordAudioUrl: audioUrl ? `http://${audioUrl.replace(/:8002/, '')}.mp3` : '',
        score: score,
        symbol: this.referSymbol,
        randerSymbol: this.randerSymbol
      })
      this.videoStatus.replayStatus = 0
      this.videoStatus.recordStatus = 0
      this.videoStatus.playStatus = 0
      this.getVideoStatus(this.videoStatus)
    },
    getScore(param) { // 父级调用录音回调
      this.reqParam = Object.assign({}, param)
      this.render(param)
      this.scoreLeve(param.score, param.audioUrl)
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
    subIndex: function(val) { // 切题
      this.switchTopic()
      this.handleData()
    },
    lastTopicFlag: function(val) {
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
.Correct {
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
      position: relative;
      float: left;
      width: 400px;
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
  .jiuyin {
    margin-left: 15px;
    font-size: 16px;
    color: #21bd73;
    text-decoration: underline;
    cursor: pointer;
  }
  .examToast {
    width: 346px;
    height: 86px;
    display: flex;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -24px 0 0 -173px;
    border-radius: 43px;
    background: rgba(255, 136, 27, 0.8);
    z-index: 100;
    img {
      width: 50px;
      height: 50px;
      margin-right: 16px;
      margin-left: 24px;
    }

    .et-cnt {
      .et-text1 {
        font-size: 16px;
        color: #fff;
        line-height: 26px;
      }

      .et-text2 {
        color: rgba(255, 255, 255, 0.6);
        line-height: 24px;
      }
    }

    &.etNoIcon {
      justify-content: center;
      text-align: center;

      .et-text1 {
        font-size: 20px;
        color: #fff;
        line-height: 30px;
      }

      .et-text2 {
        font-size: 16px;
        color: #fff;
        line-height: 20px;
      }
    }
  }
}
</style>