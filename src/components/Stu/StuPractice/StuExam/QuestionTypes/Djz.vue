<template lang="pug">
  div.question-type-djz
    div.question-content(v-html='contentHtml')
</template>

<script>
/**
 * 读单词
 */
export default {
  name: 'QuestionTypeDjz',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      reftxt: '',
      contentHtml: this.topic.topicContent,
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
      return this.$config.resUrl + this.topic.topicAttachment[0].attachmentUrl
    }
  },
  methods: {
    initRender() {
      this.contentHtml = this.topic.topicContent
      this.currentDetail = {}
    },
    recordFn() {
      this.reftxt = this.topic.topicLabel
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

      if (result && this.showTimeFlag) {
        let _detail = this.handleRenderDetail(this.currentDetail.audioAnswerList[this.optionIdx])
        this.contentHtml = _detail.text
      }
    },
    detailFn(ds) {
      if (ds) this.currentDetail = Object.assign({}, ds)
      let anl = this.currentDetail.audioAnswerList[this.optionIdx]
      let attributes = anl.attributes
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        analysis: this.topic.analysis,
        standardAnswer: this.handleReplaceMark(this.topic.topicLabel),
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
  }
}
</script>

<style lang="less">
.question-type-djz {
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
