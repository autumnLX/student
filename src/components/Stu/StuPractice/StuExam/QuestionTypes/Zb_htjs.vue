<template lang="pug">
  div.question-type-zb_htjs
    div.question-content.f24(v-html='contentHtml')
</template>

<script>
export default {
  name: 'QuestionTypeZb_htjs',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      reftxt: '',
      res: '',
      contentHtml: this.topic.topicContent.replace(/\n/g, '<br>'),
      currentDetail: {},
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
      this.contentHtml = this.topic.topicContent.replace(/\n/g, '<br>')
      this.currentDetail = {}
    },
    handleAutoPlay() {
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
      this.reftxt = (this.topic.standardAnswer ? this.topic.standardAnswer : '') + (this.topic.teacherAnswer ? this.topic.teacherAnswer : '');
      this.initPRBtn('0', 2)
      this.handleRecord('oesy', this.reftxt, {
        standardAnswer: this.topic.standardAnswer,
        teacherAnswer: this.topic.teacherAnswer
      })
    },
    scoreFn(score, audioUrl, recordId, result, err) {
      this.initPRBtn(1, 1, 3)

      this.currentDetail = {
        isAudio: true,
        audioAnswerList: []
      }

      this.currentDetail.audioAnswerList[this.optionIdx] = {
        recordError: err,
        score: score,
        audioUrl: audioUrl,
        standardAudio: this.res,
        recordId: recordId,
        attributes: result,
        refText: this.reftxt,
      }

      this.onSetAnswer(this.currentDetail, score, err)
    },
    detailFn(ds) {
      if (ds) this.currentDetail = Object.assign({}, ds)
      let anl = this.currentDetail.audioAnswerList[this.optionIdx]
      let standardAnswerArr = this.topic.standardAnswer && this.topic.standardAnswer.replace(/^#+/, '').split('#')[0]
      let teacherAnswerArr = this.topic.teacherAnswer && this.topic.teacherAnswer.replace(/^#+/, '').split('#')[0]
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        analysis: this.topic.analysis,
        originalText: '听力',
        originalAudio: this.$config.resUrl + (anl.standardAudio.match(/\.mp3/gi) ? anl.standardAudio : anl.standardAudio + '.mp3'),
        originalContent: this.topic.audioOriginalText,
        standardAnswer: standardAnswerArr || teacherAnswerArr,
      }

      return _param
    },
  },
  mounted() {
    this.res = this.topic.topicAttachment[0].attachmentUrl
    this.res = this.res.match(/\.mp3/gi) ? this.res : this.res + '.mp3'
    this.handleAutoPlay()
  }
}
</script>

<style lang="less">
.question-type-zb_htjs {
  display: flex;
  flex-direction: column;
  flex: 1;

  .question-content, .question-content * {
    max-width: 820px;
    font-size: 18px;
    line-height: 36px;
  }
}
</style>
