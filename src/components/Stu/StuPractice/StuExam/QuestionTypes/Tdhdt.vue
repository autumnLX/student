<template lang="pug">
  div.question-type-tdhdt
    div.question-content.f24(v-html='topic.topicContent')
    div.question-subcontent.f24(v-html='topic.subContent')
</template>

<script>
/**
 * 读单词
 */
export default {
  name: 'QuestionTypeTdhdt',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'ChangePRStatus', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark'],
  data() {
    return {
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
      this.reftxt = this.topic.topicLabel.replace(/<\/?[^>]*>/g, '')
      this.initPRBtn('', 2)
      this.handleRecord('sent', this.reftxt)
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
    },
    detailFn(ds) {
      if (ds) this.currentDetail = Object.assign({}, ds)
      let anl = this.currentDetail.audioAnswerList[this.optionIdx]
      let _detail = this.handleRenderDetail(anl)
      let attributes = anl.attributes
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        analysis: this.topic.analysis,
        standardAnswer: this.handleReplaceMark(this.topic.topicLabel.replace(/<\/?[^>]*>/g, '')),
        myAnswer: _detail.text,
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
    this.res = this.topic.topicAttachment[0].attachmentUrl
    this.res = this.res.match(/\.mp3/gi) ? this.res : this.res + '.mp3'
    this.handleAutoPlay()
  }
}
</script>

<style lang="less">
.question-type-tdhdt {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;

  .question-content {
    width: 820px;
    line-height: 36px;
    font-size: 24px;
    color: #999;
    margin: 25px 0 10px;

    * {
      line-height: 36px;
      font-size: 24px;
      color: #999;
    }
  }

  .question-subcontent {
    width: 820px;
    line-height: 36px;
    font-size: 24px;

    * {
      line-height: 36px;
      font-size: 24px;
    }

    li {
      list-style: disc inside;
    }
  }
}
</style>
