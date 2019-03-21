<template lang="pug">
  div.question-type-dccmld
    div.question-content
      div.word.ellipsis(v-html='contentHtml')
      div.phn(v-if='contentPhn' v-html='contentPhn')
</template>

<script>
/**
 * 读单词
 */
export default {
  name: 'QuestionTypeDccmld',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'ChangePRStatus', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      reftxt: '',
      contentHtml: this.topic.topicContent,
      contentPhn: '',
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
      this.contentPhn = ''
      this.currentDetail = {}
    },
    recordFn() {
      this.reftxt = this.topic.topicTransLabel ? this.topic.topicTransLabel : this.topic.topicContent
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
        this.contentPhn = _detail.phn
      }
    },
    detailFn(ds) {
      if (ds) this.currentDetail = Object.assign({}, ds)
      let anl = this.currentDetail.audioAnswerList[this.optionIdx]
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        analysis: this.topic.analysis
      }

      return _param
    },
  },
  mounted() {
  }
}
</script>

<style lang="less">
.question-type-dccmld {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  .word {
    max-width: 376px;
    height: 50px;
    line-height: 50px;
    color: #666;
    font-size: 36px;

    * {
      font-size: 36px;
      line-height: 50px;
    }
  }

  .phn {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: 45px;
    font-size: 24px;
    font-family: Arial;
    transform: translate(-50%, -50%);

    * {
      font-size: 24px;
    }
  }
}
</style>
