<template lang="pug">
  div.question-type-yc_tdhtk
    img(:src='imgUrl' v-if='imgUrl')
    div.question-content
      div.question-blank(v-for='i in parseInt(topic.topicOption[0].placeholder || 0)')
        span {{ i }}.
        input(type='text' v-model='myAnswer[i - 1]' :class='handleInputClass(i - 1)' :title='myAnswer[i - 1]')
        label.orange.noAnswer(v-if='isShowAnswer && !myAnswer[i - 1]' @click='handleClickTip') 此题未做答
</template>

<script>
export default {
  name: 'QuestionTypeYcTdhtk',
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
    partIdx() {
      this.isInitRendered = true
      this.initAnswer()
    },
    topicIdx() {
      if (!this.isInitRendered) this.initAnswer()
      else this.$nextTick(() => { this.isInitRendered = false })
    },
    myAnswer() {
      this.$nextTick(() => {
        this.isShowAnswer = false
      })
      this.handleFill()
    }
  },
  computed: {
    imgUrl: function() {
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
    initAnswer() {
      let _url = this.topic.topicAttachment[0].attachmentUrl
      this.initPRBtn('', '', 4)
      this.isShowAnswer = false
      this.trueAnswer = this.topic.topicOption[0].fillAnswer ? this.topic.topicOption[0].fillAnswer.split('#') : []
      this.myAnswer = this.detailScore.myAnswer
      this.res = _url.match(/\.mp3/gi) ? _url : _url + '.mp3'
    },
    handleClickTip(event) {
      event.target.previousElementSibling.focus()
    },
    playFn() {
      this.initPRBtn(2, '', this.isShowAnswer ? 3 : 4)
      this.handlePlay(this.$config.resUrl + this.res, () => {
        this.initPRBtn(1, '', this.isShowAnswer ? 3 : 4)
      })
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
        isAudio: false,
        myAnswer: this.myAnswer
      }, _score, '', true)
    },
    detailFn() {
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
    },
  },
  mounted() {
    this.initAnswer()
  }
}
</script>

<style lang="less">
.question-type-yc_tdhtk {
  display: flex;
  flex-direction: column;
  flex: 1;

  img {
    width: 354px;
    height: 236px;
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
        content: '';
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
  }
}
</style>
