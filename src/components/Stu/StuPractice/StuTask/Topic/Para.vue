<template lang="pug">
  div.StuTaskPara
    vue-scroll
      div.layout
        div(v-if="work.practiceType === 'ld'")
          p.grey6(v-if='randerContent' v-html='randerContent')
          p.grey6(v-else v-html='data.content')
        div(v-else)
          p.grey6(v-if='randerContent.length')
            span(v-for='(para, idx) in randerContent' :class="{bg_color: index === idx}")
              span(v-if='para.htmlText' v-html='para.htmlText')
              span(v-else) {{para.text}}
          p.grey6(v-else)
            span(v-for='(para, idx) in data.details' :class="{bg_color: index === idx}") {{para.text}}
        div
          p.f18.grey9(v-html='data.translation')
</template>

<script>
export default {
  name: 'StuTaskPara',
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
      this.index = 0
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
          } else {
            this.transTitleCase()
          }
        }
        this.videoStatus.playStatus = 0
        this.videoStatus.recordStatus = 0
        this.videoStatus.replayStatus = 4
      }
      this.getVideoStatus(this.videoStatus)
    },
    transTitleCase() {
      let detail = this.data.details
      if (detail.length > 0) {
        for (let i = 0; i < detail.length; i++) {
          let result = new RegExp(detail[i].text, 'i').exec(this.data.content)
          if (result) {
            this.$set(detail[i], 'text', result[0])
            this.$set(detail[i], 'label', result[0])
          }
        }
      }
      this.randerContent = this.data.details
    },
    handleData() {
      this.resetStatus()
      this.start()
    },
    doAgain () {
      this.data.score = ''
      this.handleData()
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
      this.resultDetail[this.index] = {
        start: content.start,
        end: content.end,
        text: content.text,
        score: param.score,
        recordAudioUrl: param.audioUrl ? `http://${param.audioUrl.replace(/:8002/, '')}.mp3` : '',
        fluency: param.fluency,
        integrity: param.integrity,
        stdAudioUrl: this.data.audio,
        label: '',
        details: content.details
      }
      this.levelAudio(param.score)
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
      } else {
        window.clearTimeout(this.clearRecordTimeOut)
        this.clearRecordTimeOut = window.setTimeout(() => {
          this.index++
          this.videoStatus.playStatus = 0
          this.videoStatus.replayStatus = 4
          this.videoStatus.recordStatus = 0
          this.getVideoStatus(this.videoStatus)
          this.next_gd()
        }, 1000)
      }
    },
    getScore_ld(param) {
      this.randerContent = this.data.content
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
.StuTaskPara {
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