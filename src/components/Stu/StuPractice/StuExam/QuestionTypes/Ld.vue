<template lang="pug">
  div.question-type-ld
    div.question-content(v-html='contentHtml')
</template>

<script>
export default {
  name: 'QuestionTypeLd',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'ChangePRStatus', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      reftxt: '',
      contentHtml: '',
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
      this.contentHtml = this.topic.topicContent.replace(/<img([^(src])*src="/g, '$&' + this.$config.resUrl)
      this.currentDetail = {}
    },
    recordFn() {
      this.reftxt = this.topic.topicContent.replace(/<\/?[^>]*>/g, '').replace(/"/g, '\\"')
      this.initPRBtn('', 2)
      this.handleRecord('auto', this.reftxt)
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

      if (result && this.showTimeFlag) {
        let _detail = this.handleRenderDetail(this.currentDetail.audioAnswerList[this.optionIdx], true)
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
        analysis: this.topic.analysis
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
    this.contentHtml = this.topic.topicContent.replace(/<img([^(src])*src="/g, '$&' + this.$config.resUrl)
    this.currentDetail = {}
  }
}
</script>

<style lang="less">
.question-type-ld {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  .question-content {
    max-width: 820px;
    line-height: 40px;
    font-size: 24px;
    margin-top: 15px;

    * {
      line-height: 40px;
      font-size: 24px;
    }

    sup {
      color: #999;
      font-size: 12px;
    }
  }
}
</style>

