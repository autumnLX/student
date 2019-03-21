<template lang="pug">
  div.question-type-ldeg
    div.question-content(v-html='topic.topicContent.replace(/<img([^(src])*src="/g, "$&" + $config.resUrl)')
</template>

<script>
export default {
  name: 'QuestionTypeLdeg',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      reftxt: '',
      res: '',
      isAutoPlayed: false,
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
        this.initPRBtn(1)
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
      this.reftxt = this.topic.topicContent
      this.initPRBtn('', 2)
      this.handleRecord('comm', this.reftxt, {
        standard: this.$config.resUrl + this.res
      })
    },
    scoreFn(score, audioUrl, recordId, result, err) {
      this.initPRBtn(1, 1, 3)

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
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        analysis: this.topic.analysis,
      }

      return _param
    },
  },
  mounted() {
    this.res = this.topic.topicAttachment[this.optionIdx].attachmentUrl
    this.res = this.res.match(/\.mp3/gi) ? this.res : this.res + '.mp3'
    this.handleAutoPlay()
  }
}
</script>

<style lang="less">
.question-type-ldeg {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  .question-content {
    max-width: 820px;
    line-height: 28px;
    font-size: 24px;

    * {
      line-height: 28px;
      font-size: 24px;
    }
  }
}
</style>

