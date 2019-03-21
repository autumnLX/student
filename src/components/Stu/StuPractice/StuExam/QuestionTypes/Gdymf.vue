<template lang="pug">
  div.question-type-gdymf
    div.question-content.f24
      div(
        v-for='(option, i) in topic.topicOption'
        :class='{activeBg: currentIdx === i}'
        v-html='contentHtml[i]'
      )
</template>

<script>
/**
 * 读单词
 */
export default {
  name: 'QuestionTypeGdymf',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'ChangePRStatus', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      reftxt: '',
      res: '',
      currentDetail: {
        isAudio: true,
        audioAnswerList: []
      },
      contentHtml: [],
      currentIdx: -1, // 当前第几句
      replayIdx: 0, // 回放
      againTimes: 1, // 重复次数
      detailObj: {
        topicType: 'gdymf',
        analysis: this.topic.analysis,
        detailArr: [],
      },
      isInitRendered: false,
    }
  },
  watch: {
    partIdx() {
      this.isInitRendered = true
      this.initRender()
    },
    topicIdx() {
      if (!this.isInitRendered) this.initRender()
      else this.$nextTick(() => { this.isInitRendered = false })
    }
  },
  methods: {
    initRender() {
      this.currentIdx = -1
      this.againTimes = 1
      this.replayIdx = 0
      this.currentDetail = Object.assign({}, {
        isAudio: true,
        audioAnswerList: []
      }, this.detailScore)
      this.detailObj = {
        analysis: this.topic.analysis,
        detailArr: [],
      }
      this.initContentHtml()
      this.handleAutoPlay()
    },
    initContentHtml() {
      this.topic.topicOption.forEach((option, i) => {
        this.$set(this.contentHtml, i, option.topicStem)
      })
    },
    handleAutoPlay() {
      if (!this.topic.done[this.optionIdx]) {
        this.playFunction(() => {
          this.currentIdx++
          this.playFunction(() => {
            this.recordFunction()
          })
        })
      }
    },
    playFn() {
      this.currentIdx = -1
      this.playFunction(() => {
      })
    },
    playFunction(callback) {
      this.initPRBtn(2, '', 0)
      if (this.currentIdx === -1) {
        this.res = this.topic.topicAttachment[0].attachmentUrl
      } else {
        this.res = this.topic.topicOption[this.currentIdx].audio.attachmentUrl
      }
      this.res = this.res.match(/\.mp3/gi) ? this.res : this.res + '.mp3'
      this.handlePlay(this.$config.resUrl + this.res, () => {
        this.initPRBtn(1, 1)
        typeof callback === 'function' && callback()
      })
    },
    recordFn() {
      this.currentIdx = 0
      this.playFunction(() => {
        this.recordFunction()
      })
    },
    recordFunction() {
      this.reftxt = this.topic.topicOption[this.currentIdx].label.replace(/<\/?[^>]*>/g, '')
      this.initPRBtn('', 2, 0)
      this.handleRecord('sent', this.reftxt)
    },
    initReplayFn() {
      this.replayIdx = 0
    },
    replayFn() {
      this.initPRBtn('', '', 2)
      this.handlePlay(this.currentDetail.audioAnswerList[this.replayIdx].audioUrl.replace(/(^(https?:\/\/)?)([^:/]*)((:[0-9]*)?)(\/[^.]*)(.mp3)?$/, 'https://$3$6.mp3'), () => {
        this.replayIdx++
        if (this.replayIdx < this.currentDetail.audioAnswerList.length) {
          this.replayFn()
        } else {
          this.initPRBtn(1, 1, 3)
        }
      })
    },
    scoreFn(score, audioUrl, recordId, result, err) {
      let replayStatus = this.currentIdx === this.topic.topicOption.length - 1 ? 3 : 0
      this.initPRBtn('', 1, replayStatus)

      let tmp = {
        recordError: err,
        score: score,
        audioUrl: audioUrl,
        standardAudio: this.res,
        recordId: recordId,
        attributes: result,
        refText: this.reftxt,
      }
      let _score = 0

      for (let key in tmp) {
        this.$set(this.currentDetail.audioAnswerList[this.currentIdx], key, tmp[key])
      }

      // this.$set(this.currentDetail.audioAnswerList, this.currentIdx, tmp)

      this.topic.topicOption.forEach((option, i) => {
        _score += this.currentDetail.audioAnswerList[i] ? (this.currentDetail.audioAnswerList[i].score || 0) : 0
      })
      _score = Math.round(_score / this.topic.topicOption.length)

      this.onSetAnswer(this.currentDetail, _score, err)

      if (result && this.showTimeFlag) {
        let _detail = this.handleRenderDetail(this.currentDetail.audioAnswerList[this.currentIdx], true)
        this.$set(this.contentHtml, this.currentIdx, _detail.text ? _detail.text.replace(/\s*[↑↓]\s*/g, '') : this.topic.topicOption[this.currentIdx].topicStem)
      }

      if (recordId || this.againTimes >= 3) { // 如果有得分或者重试3次
        this.againTimes = 1

        if (this.currentIdx >= this.topic.topicOption.length - 1) {
          this.currentIdx = -1
          this.againTimes = 1
          this.replayIdx = 0
        } else {
          // if (this.currentIdx < this.topic.topicOption.length - 1) {
          this.currentIdx += 1
          this.playFunction(() => {
            this.recordFunction()
          })
          // }
        }
      } else {
        this.againTimes++
        clearTimeout(this.setTimeout)
        this.setTimeout = setTimeout(() => {
          this.playFunction(() => {
            this.recordFunction()
          })
        }, 500)
      }
    },
    detailFn(ds) {
      const _idx = this.currentIdx === -1 ? this.topic.topicOption.length - 1 : this.currentIdx - 1
      if (ds) this.currentDetail = Object.assign({}, ds)
      let anl = this.currentDetail.audioAnswerList[_idx]

      let _detail = this.handleRenderDetail(anl, true)
      let attributes = anl.attributes
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        standardAnswer: this.handleReplaceMark(this.topic.topicOption[_idx].label),
        standardAudio: anl.standardAudio,
        myAnswer: _detail.text,
        myAudio: anl.audioUrl,
      }

      // 底部详细解析
      if (typeof attributes.fluency === 'undefined') {
      } else if (typeof attributes.fluency === 'object') { // 句子内核
        _param = Object.assign(_param, {
          integrity: attributes.integrity,
          fluency: attributes.fluency.overall,
          accuracy: attributes.accuracy,
        })
      } else { // 段落内核
        _param = Object.assign(_param, {
          integrity: attributes.integrity,
          fluency: attributes.fluency,
        })
      }

      this.$set(this.detailObj.detailArr, _idx, _param)

      // if (this.currentIdx < this.topic.topicOption.length - 1) this.currentIdx++

      return this.detailObj
    },
  },
  mounted() {
    this.initRender()
    this.handleAutoPlay()
  }
}
</script>

<style lang="less">
.question-type-gdymf {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;

  .question-content {
    width: 820px;
    
    & > div {
      font-size: 24px;
      color: #999;
      line-height: 44px;
      margin: 2px 0;
      display: inline;

      span {
        font-size: 24px;
        color: #999;
        line-height: 44px;
      }

      &.activeBg {
        color: #666;
        background-color: #e4faed;

        span {
          color: #666;
          background-color: #e4faed;
        }
      }

      sup {
        color: #999;
        font-size: 12px;
      }
    }
  }
}
</style>
