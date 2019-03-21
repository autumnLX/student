<template lang="pug">
  div.question-type-tydt
    div.question-content.f24(v-html='topic.topicContent.replace(/<img([^(src])*src="/g, "$&" + $config.resUrl)')
</template>

<script>
/**
 * 读单词
 */
export default {
  name: 'QuestionTypeTydt',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'ChangePRStatus', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark'],
  data() {
    return {
      reftxt: '',
      res: '',
      currentDetail: {},
    }
  },
  watch: {
    partIdx() {
      this.isAutoPlayed = true
      this.handleAutoPlay()
    },
    topicIdx() {
      if (!this.isAutoPlayed) this.handleAutoPlay()
      else this.$nextTick(() => { this.isAutoPlayed = false })
    },
    optionIdx() {
      if (!this.isAutoPlayed) this.handleAutoPlay()
      else this.$nextTick(() => { this.isAutoPlayed = false })
    }
  },
  methods: {
    handleAutoPlay() {
      this.currentDetail = {}
      if (!this.topic.done[this.optionIdx]) {
        this.playFn(() => {
          this.recordFn()
        })
      }
    },
    playFn(callback) {
      this.initPRBtn(2)
      this.handlePlay(this.$config.resUrl + this.res, () => {
        this.initPRBtn(1, 1)
        typeof callback === 'function' && callback()
      })
    },
    recordFn() {
      this.reftxt = this.topic.topicOption[this.optionIdx].label.replace(/<\/?[^>]*>/g, '')
      this.initPRBtn('', 2)
      this.handleRecord('auto', this.reftxt)
    },
    scoreFn(score, audioUrl, recordId, result, err) {
      this.initPRBtn('', 1, 3)

      this.currentDetail = {
        isAudio: true,
        audioAnswerList: [{
          recordError: err,
          score: score,
          audioUrl: audioUrl,
          standardAudio: '',
          recordId: recordId,
          attributes: result,
          refText: this.reftxt,
        }]
      }

      this.onSetAnswer(this.currentDetail, score, err)
    },
    detailFn(ds) {
      if (ds) this.currentDetail = Object.assign({}, ds)
      let anl = this.currentDetail.audioAnswerList[this.optionIdx]
      let _detail = this.handleRenderDetail(anl)
      let attributes = anl.attributes
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        analysis: this.topic.analysis,
        standardAnswer: this.handleReplaceMark(this.topic.topicOption[this.optionIdx].optionDesc),
        myAnswer: _detail.text,
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

      return _param
    },
  },
  mounted() {
    this.res = this.topic.topicOption[this.optionIdx].audio.attachmentUrl
    this.res = this.res.match(/\.mp3/gi) ? this.res : this.res + '.mp3'
    this.handleAutoPlay()
  }
}
</script>

<style lang="less">
.question-type-tydt {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;

  .question-content {
    width: 820px;
    line-height: 36px;
    font-size: 24px;
    margin-top: 25px;

    * {
      line-height: 36px;
      font-size: 24px;
    }

    li {
      list-style: disc inside;
    }
  }
}
</style>
