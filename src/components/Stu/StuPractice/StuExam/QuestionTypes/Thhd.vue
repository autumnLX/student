<template lang="pug">
  div.question-type-thhd
    div.question-content.f24(v-html='topic.topicContent.replace(/<img([^(src])*src="/g, "$&" + $config.resUrl)')
</template>

<script>
export default {
  name: 'QuestionTypeThhd',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      isVideoPlaying: false,
      videoDuration: 0,
      reftxt: '',
      res: '',
      isAutoPlayed: false,
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
      this.reftxt = this.topic.answer.replace(/#/g, '|').replace(/<\/?[^>]*>/g, '')
      this.initPRBtn('', 2)
      this.handleRecord('hitalk', this.reftxt, {
        keyword: this.topic.topicKeyword || ''
      })
    },
    scoreFn(score, audioUrl, recordId, result, err) {
      this.initPRBtn(1, 1, 3)

      let _score = 0
      if (result && result.recscore) {
        if (result.recscore.status_code === 20000) _score = 100
        else if (result.recscore.status_code === 20002) _score = 50
        else if (result.recscore.status_code === 20003) _score = 0
      } else _score = 0

      this.currentDetail = {
        isAudio: true,
        audioAnswerList: [{
          recordError: err,
          score: _score,
          audioUrl: audioUrl,
          standardAudio: this.res,
          recordId: recordId,
          attributes: result,
          refText: this.reftxt,
        }]
      }

      this.onSetAnswer(this.currentDetail, _score, err)
    },
    detailFn(ds) {
      if (ds) this.currentDetail = Object.assign({}, ds)
      let anl = this.currentDetail.audioAnswerList[this.optionIdx]
      let attributes = anl.attributes
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        analysis: this.topic.analysis,
        originalText: '问题',
        originalAudio: this.$config.resUrl + this.res,
        originalContent: this.topic.audioOriginalText.replace(/\\n/g, '<br>'),
        standardAnswer: this.topic.answer.replace(/#/g, ' / '),
      }

      if (attributes) {
        if (attributes.recscore.status_code === 20000) {
          _param = Object.assign(_param, {
            myAnswer: '<span class="green">回答正确</span>'
          })
        } else if (attributes.recscore.status_code === 20002) {
          _param = Object.assign(_param, {
            myAnswer: '<span class="green">部分回答正确</span>'
          })
        } else if (attributes.recscore.status_code === 20003) {
          _param = Object.assign(_param, {
            myAnswer: '<span class="red">回答不正确</span>'
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
    this.res = this.topic.topicAttachment[this.optionIdx].attachmentUrl
    this.res = this.res.match(/\.mp3/gi) ? this.res : this.res + '.mp3'
    this.handleAutoPlay()
  }
}
</script>

<style lang="less">
.question-type-thhd {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;

  .question-content {
    display: flex;
    max-width: 820px;
    line-height: 40px;
  }
}
</style>

