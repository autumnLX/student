<template lang="pug">
  div.question-type-zb_qjwd
    div.question-content(v-html='topicContent')
    div.question-option
      span {{ totalIdx }}.
      div(v-html='topicStem')
</template>

<script>
export default {
  name: 'QuestionTypeZb_qjwd',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      isVideoPlaying: false,
      videoDuration: 0,
      reftxt: '',
      res: '',
      currentDetail: {},
      isAutoPlayed: false,
    }
  },
  watch: {
    partIdx() {
      this.isAutoPlayed = true
      this.handleAutoPlay()
      this.currentDetail = {}
    },
    topicIdx() {
      if (!this.isAutoPlayed) {
        this.handleAutoPlay()
        this.currentDetail = {}
      } else this.$nextTick(() => { this.isAutoPlayed = false })
    },
    optionIdx() {
      if (!this.isAutoPlayed) {
        this.handleAutoPlay()
        this.currentDetail = {}
      } else this.$nextTick(() => { this.isAutoPlayed = false })
    }
  },
  computed: {
    topicContent: function() {
      return this.topic.topicContent.replace(/\n/g, '<br>')
    },
    topicStem: function() {
      return this.topic.topicOption[this.optionIdx].topicStem.replace(/<\/?[a-zA-Z]+[^><]*>/g, '').replace(/\n/g, '<br>')
    }
  },
  methods: {
    handleAutoPlay() {
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
      this.reftxt = this.topic.topicOption[this.optionIdx].answer.replace(/#/g, '|').replace(/<\/?[^>]*>/g, '')
      this.initPRBtn('', 2)
      this.handleRecord('scne', this.reftxt)
    },
    scoreFn(score, audioUrl, recordId, result, err) {
      this.initPRBtn(1, 1, 3)

      let tmpObj = {
        isAudio: true,
        audioAnswerList: []
      }

      tmpObj.audioAnswerList[this.optionIdx] = {
        recordError: err,
        score: score,
        audioUrl: audioUrl,
        standardAudio: this.res,
        recordId: recordId,
        attributes: result,
        refText: this.reftxt,
      }

      this.currentDetail = Object.assign({}, tmpObj)

      this.onSetAnswer(tmpObj, score, err)
    },
    detailFn(ds) {
      if (ds) this.currentDetail = Object.assign({}, ds)
      let anl = this.currentDetail.audioAnswerList[this.optionIdx]
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        analysis: this.topic.analysis,
        originalText: '听力',
        originalAudio: this.$config.resUrl + (anl.standardAudio.match(/\.mp3/gi) ? anl.standardAudio : anl.standardAudio + '.mp3'),
        originalContent: this.topic.audioOriginalText,
        standardAnswer: this.topic.topicOption[this.optionIdx].answer.replace(/#/g, ' / '),
        myAudio: anl.audioUrl
      }

      return _param
    },
  },
  mounted() {
    this.res = this.topic.topicAttachment[0].attachmentUrl
    this.res = this.res.match(/\.mp3/gi) ? this.res : this.res + '.mp3'
    this.handleAutoPlay()
    this.currentDetail = {}
  }
}
</script>

<style lang="less">
.question-type-zb_qjwd {
  display: flex;
  flex-direction: column;
  flex: 1;

  .question-content, .question-content *, .question-option, .question-option * {
    font-size: 18px;
    line-height: 36px;
    max-width: 820px;
  }

  .question-option > span {
    float: left;
  }

  .question-option > div {
    display: inline-block;
  }
}
</style>

