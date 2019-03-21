<template lang="pug">
  div.question-type-dh
    div.question-content.f24(v-html='topic.topicContent.replace(/<img([^(src])*src="/g, "$&" + $config.resUrl)')
</template>

<script>
export default {
  name: 'QuestionTypeDh',
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
      this.reftxt = this.topic.topicOption[this.optionIdx].optionDesc.replace(/#/g, '|').replace(/<\/?[^>]*>/g, '')
      this.initPRBtn('', 2)
      this.handleRecord('hitalk', this.reftxt, {
        keyword: this.topic.topicOption[this.optionIdx].keyword
      })
    },
    scoreFn(score, audioUrl, recordId, result, err) {
      this.initPRBtn(1, 1, 3)

      let tmpObj = {
        isAudio: true,
        audioAnswerList: []
      }

      let tmpRes = this.topic.topicOption[this.optionIdx].audio.attachmentUrl
      tmpRes += tmpRes.match(/\.mp3/gi) ? '' : '.mp3'

      tmpObj.audioAnswerList[this.optionIdx] = {
        recordError: err,
        score: score,
        audioUrl: audioUrl,
        standardAudio: this.$config.resUrl + tmpRes,
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
      let attributes = anl.attributes
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        analysis: this.topic.analysis,
        originalText: '问题',
        originalAudio: anl.standardAudio,
        originalContent: this.topic.analysis,
        standardAnswer: this.topic.topicOption[this.optionIdx].optionDesc.replace(/#/g, ' / '),
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
    this.res = this.topic.topicOption[this.optionIdx].audio.attachmentUrl
    this.res = this.res.match(/\.mp3/gi) ? this.res : this.res + '.mp3'
    this.handleAutoPlay()
  }
}
</script>

<style lang="less">
.question-type-dh {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  .question-content {
    display: flex;
    justify-content: center;

    img {
      width: 300px;
      height: 300px;
    }
  }
}
</style>

