<template lang="pug">
  div.question-type-ktzw_new
    img(:src='imgUrl' v-if='imgUrl')
    div.question-content(v-html='contentHtml')
</template>

<script>
export default {
  name: 'QuestionTypeKtzwNew',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      isVideoPlaying: false,
      videoDuration: 0,
      reftxt: '',
      contentHtml: this.topic.topicContent.replace(/<img([^(src])*src="/g, '$&' + this.$config.resUrl),
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
  computed: {
    imgUrl() {
      if (this.topic.topicAttachment.length) return this.$config.resUrl + this.topic.topicAttachment[this.optionIdx].attachmentUrl
      else return ''
    }
  },
  methods: {
    initRender() {
      this.contentHtml = this.topic.topicContent.replace(/<img([^(src])*src="/g, '$&' + this.$config.resUrl)
      this.currentDetail = {}
    },
    recordFn() {
      this.reftxt = (this.topic.standardAnswer ? this.topic.standardAnswer : '') + (this.topic.teacherAnswer ? this.topic.teacherAnswer : '');
      this.initPRBtn('', 2)
      this.handleRecord('oesy', this.reftxt, {
        standardAnswer: this.topic.standardAnswer,
        teacherAnswer: this.topic.teacherAnswer
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
          refText: this.topic.topicContent.replace(/<img([^(src])*src="/g, '$&' + this.$config.resUrl).replace(/<\/?[^>]*>/g, ''),
        }]
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
        standardAnswer: standardAnswerArr || teacherAnswerArr,
      }

      return _param
    },
  }
}
</script>

<style lang="less">
.question-type-ktzw_new {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  img {
    width: 300px;
    height: 200px;
    margin-bottom: 45px;
  }

  .question-content, .question-content > * {
    font-size: 18px;
    line-height: 36px;
  }
}
</style>

