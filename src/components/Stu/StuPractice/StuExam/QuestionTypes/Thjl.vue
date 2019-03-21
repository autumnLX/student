<template lang="pug">
  div.question-type-thjl
    img(:src='imgUrl' v-if='imgUrl')
    div.question-content(v-if='optionIdx === 0')
      div.question-blank(v-for='i in parseInt(topic.topicOption[0].placeholder || 0)')
        span {{ i }}.
        input(type='text' v-model='myAnswer[i - 1]' :class='handleInputClass(i - 1)' :title='myAnswer[i - 1]')
        label.orange.noAnswer(v-if='isShowAnswer && !myAnswer[i - 1]' @click='handleClickTip') 此题未做答
    div.question-content.question-r-content(v-else v-html='topic.topicOption[1].content || ""')
</template>

<script>
export default {
  name: 'QuestionTypeThjl',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      trueAnswer: [],
      myAnswer: [],
      res: '',
      isShowAnswer: false,
      isInitRendered: false,
    }
  },
  watch: {
    topicIdx() {
      this.isInitRendered = true
      this.initRender()
    },
    optionIdx() {
      if (!this.isInitRendered) this.initRender()
      else this.$nextTick(() => { this.isInitRendered = false })
    },
    myAnswer() {
      if (this.optionIdx === 0) {
        this.$nextTick(() => {
          this.isShowAnswer = false
          this.handleFill()
        })
      }
    }
  },
  computed: {
    imgUrl: function () {
      return this.topic.topicAttachment[1] ? this.$config.resUrl + this.topic.topicAttachment[1].attachmentUrl : ''
    },
  },
  methods: {
    handleInputClass(index) {
      const myAnswer = (this.myAnswer[index] ? this.myAnswer[index] : '').replace(/(^\s*|\s*$)/g, '').replace(/\s+/g, ' ').toLowerCase()
      const trueAnswers = this.trueAnswer[index] ? this.trueAnswer[index].split('|') : ''
      let right = false

      for (let i = 0; i < trueAnswers.length; i++) {
        const answer = trueAnswers[i].replace(/(^\s*|\s*$)/g, '').replace(/\s+/g, ' ').toLowerCase()
        if (answer === myAnswer && myAnswer) {
          right = true
          break
        }
      }

      return {
        green: this.isShowAnswer && right,
        red: this.isShowAnswer && !right,
      }
    },
    initRender() {
      let _url = this.topic.topicAttachment[0].attachmentUrl
      this.res = _url.match(/\.mp3/gi) ? _url : _url + '.mp3'
      if (this.optionIdx === 0) { // 填空
        this.$nextTick(() => {
          this.isShowAnswer = false
        })
        this.initAnswer()
      } else { // 录音
        this.handleAutoPlay()
      }
    },
    handleAutoPlay() {
      if (!this.topic.done[this.optionIdx]) {
        this.initPRBtn(1)
        this.playFn(() => {
          this.recordFn()
        })
      }
    },
    initAnswer() {
      this.initPRBtn('', '', 4)
      this.isShowAnswer = false
      this.trueAnswer = this.topic.topicOption[0].fillAnswer ? this.topic.topicOption[0].fillAnswer.split('#') : []
      this.myAnswer = this.detailScore.myAnswer
    },
    handleClickTip(event) {
      event.target.previousElementSibling.focus()
    },
    playFn(callback) {
      if (this.optionIdx === 0) this.initPRBtn(2, '', this.isShowAnswer ? 3 : 4)
      else this.initPRBtn(2)
      this.handlePlay(this.$config.resUrl + this.res, () => {
        if (this.optionIdx === 0) this.initPRBtn(1, '', this.isShowAnswer ? 3 : 4)
        else {
          this.initPRBtn(1, 1)
          typeof callback === 'function' && callback()
        }
      })
    },
    checkIsFill() {
      let isFilled = false
      for (let i = 0; i < this.myAnswer.length; i++) {
        if (this.myAnswer[i] !== '') {
          isFilled = true
          break
        }
      }
      return isFilled
    },
    handleFill() {
      this.initPRBtn('', '', 4)

      let _score = 0
      this.trueAnswer.forEach((answer, i) => {
        const myAnswer = (this.myAnswer[i] ? this.myAnswer[i] : '').replace(/(^\s*|\s*$)/g, '').replace(/\s+/g, ' ').toLowerCase()
        const answers = answer.split('|')
        for (let k = 0; k < answers.length; k++) {
          const rightAnswer = answers[k].replace(/(^\s*|\s*$)/g, '').replace(/\s+/g, ' ').toLowerCase()
          if (myAnswer === rightAnswer) {
            _score++
            break
          }
        }
      })
      _score = Math.round(_score / this.trueAnswer.length * 100)

      this.onSetAnswer({
        myAnswer: this.myAnswer
      }, _score, '', true)
    },
    recordFn() {
      this.reftxt = (this.topic.topicOption[1].answer ? this.topic.topicOption[1].answer : '') + (this.topic.topicOption[1].teacherAnswer ? this.topic.topicOption[1].teacherAnswer : '')
      this.initPRBtn('', 2)
      this.handleRecord('oesy', this.reftxt, {
        standardAnswer: this.topic.topicOption[1].answer,
        teacherAnswer: this.topic.topicOption[1].teacherAnswer
      })
    },
    scoreFn(score, audioUrl, recordId, result, err) {
      this.initPRBtn(1, 1, 3)

      let tmpObj = {
        isAudio: true,
        audioAnswerList: []
      }

      tmpObj.audioAnswerList[0] = {
        recordError: err,
        score: score,
        audioUrl: audioUrl,
        standardAudio: this.res,
        recordId: recordId,
        attributes: result,
        refText: this.reftxt,
      }

      this.onSetAnswer(tmpObj, score, err)
    },
    detailFn(ds) {
      if (this.optionIdx === 0) {
        let _param = {
          analysis: this.topic.analysis,
          originalText: '听力',
          originalAudio: this.$config.resUrl + this.res,
          originalContent: unescape(this.topic.audioOriginalText.replace(/\\u/g, '%u').replace(/\\n/g, '<br>')),
          standardAnswer: '',
        }

        this.handleFill()

        for (let i = 0; i < this.trueAnswer.length; i++) {
          _param.standardAnswer += '<span style="margin-right: 20px;">' + (i + 1) + '. ' + this.trueAnswer[i] + '</span>'
        }

        this.isShowAnswer = true

        return _param
      } else {
        if (ds) this.currentDetail = Object.assign({}, ds)
        let anl = this.currentDetail.audioAnswerList[this.optionIdx]
        let _param = {
          score: anl.score,
          coreType: anl.coreType,
          analysis: this.topic.analysis,
          standardAudio: this.topic.topicOption[1].audio.attachmentUrl ? this.$config.resUrl + this.topic.topicOption[1].audio.attachmentUrl : '',
          standardAnswer: this.topic.topicOption[1].answer.split('#')[0],
        }

        return _param
      }
    },
  },
  mounted() {
    this.initRender()
  }
}
</script>

<style lang="less">
.question-type-thjl {
  display: flex;
  flex-direction: column;
  flex: 1;

  img {
    width: 470px;
    height: 235px;
    display: block;
    margin-top: 30px;
    margin-bottom: 25px;
  }

  .question-content {
    display: flex;

    .question-blank {
      width: 160px;
      height: 50px;
      display: flex;
      position: relative;
      margin-right: 5px;

      &:after {
        content: "";
        width: 160px;
        height: 0;
        border-bottom: 1px solid #999;
        position: absolute;
        bottom: 0;
        left: 0;
      }

      span {
        line-height: 50px;
        float: left;
        margin-right: 5px;
        color: #999;
        font-size: 18px;
      }

      input {
        width: 100%;
        border: 0;
        height: 50px;
        line-height: 50px;
        font-size: 22px;
        padding: 0;
      }

      label.noAnswer {
        line-height: 50px;
        font-size: 16px;
        display: block;
        position: absolute;
        left: 20px;
        top: 0;
        white-space: nowrap;
      }
    }

    &.question-r-content {
      max-width: 820px;
      margin-top: 30px;
      font-size: 18px;
      line-height: 36px;

      * {
        font-size: 18px;
        line-height: 36px;
      }
    }
  }
}
</style>
