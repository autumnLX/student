<template lang="pug">
  div.question-type-ktsdc
    img(:src='imgUrl' width='300' height='300')
</template>

<script>
export default {
  name: 'QuestionTypeStssp',

  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      reftxt: '',
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
      this.currentDetail = {}
    },
    recordFn() {
      this.reftxt = this.topic.standardAnswer.replace(/#/g, '|').replace(/<\/?[^>]*>/g, '')
      this.initPRBtn('', 2)
      this.handleRecord('hitalk', this.reftxt, { keyword: this.topic.topicKeyword })
    },
    scoreFn(score, audioUrl, recordId, result, err) {
      this.initPRBtn('', 1, 3)

      this.currentDetail = {
        isAudio: true,
        audioAnswerList: [{
          recordError: err,
          score: score,
          audioUrl: audioUrl,
          standardAudio: this.$config.resUrl + this.topic.topicAttachment[0].attachmentUrl,
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
      let attributes = anl.attributes
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        analysis: this.topic.analysis,
        standardAnswer: this.topic.standardAnswer.replace(/#/g, ' / '),
      }

      if (attributes) {
        if (attributes.recscore.status_code === 20000) {
          let _detail = this.handleRenderDetail(anl)
          _param = Object.assign(_param, {
            myAnswer: _detail.text
          })
        } else {
          _param = Object.assign(_param, {
            myAnswer: '<span class="red">此题回答不正确</span>'
          })
        }
      } else {
        _param = Object.assign(_param, {
          myAnswer: '<span class="red">此题未作答</span>'
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
.question-type-ktsdc {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>

