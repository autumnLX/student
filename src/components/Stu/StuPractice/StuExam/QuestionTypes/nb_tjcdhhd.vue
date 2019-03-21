<template lang="pug">
  div.question-type-nb_tjcdhhd
    div.question-content(v-for='(option, index) in topic.topicOption[optionIdx].optionList' :key='index + new Date().getTime()')
      div.question-stem
        span {{ totalIdx + index }}.
        p(v-html='option.topicStem')
        label.noAnswer(v-if='isShowAnswer && !myAnswer[answerIndex + index]') 此题未做答
      div.question-option(v-for='(item, idx) in option.options' :key='item.option + new Date().getTime()')
        div.question-checkBox(:class='handleCheckBoxClass(item, index)' @click='handleSelect(item.option, index)')
        span.question-optionItem(:class='handleOptionClass(item, index)') {{ item.option }}.
        p.question-optionDesc(:class='handleOptionClass(item, index)' v-html='item.optionDesc')
</template>

<script>
export default {
  name: 'QuestionTypeNb_tjcdhhd',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      answerIndex: 0,
      trueAnswer: [],
      myAnswer: [],
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
    optionIdx() {
      if (!this.isInitRendered) this.initAnswer()
      else this.$nextTick(() => { this.isInitRendered = false })
    }
  },
  methods: {
    handleCheckBoxClass(item, index) {
      let idx = this.answerIndex + index
      return {
        active: this.myAnswer[idx] === item.option,
        err: this.isShowAnswer && item.option === this.myAnswer[idx] && item.option !== this.trueAnswer[idx]
      }
    },
    handleOptionClass(item, index) {
      let idx = this.answerIndex + index
      return {
        rightSelect: this.isShowAnswer && item.option === this.trueAnswer[idx],
        wrongSelect: this.isShowAnswer && item.option === this.myAnswer[idx] && item.option !== this.trueAnswer[idx],
      }
    },
    initAnswer() {
      this.initPRBtn('', '', 4)
      this.$nextTick(() => {
        this.isShowAnswer = false
      })
      this.answerIndex = 0
      this.trueAnswer = []
      this.myAnswer = this.detailScore.myAnswer.split(',')
      let _i = 0

      this.topic.topicOption.forEach((tOption, i) => {
        tOption.optionList.forEach((ol, j) => {
          if (i === this.optionIdx && j === 0) this.answerIndex = _i
          _i++
          for (let k = 0; k < ol.options.length; k++) { // 获取正确答案
            let option = ol.options[k]
            if (option.isTrue) {
              this.trueAnswer.push(option.option)
              break
            }
          }
        })
      })
    },
    playFn() {
      this.initPRBtn(2, '', this.isShowAnswer ? 3 : 4)
      let _url = this.topic.topicOption[this.optionIdx].audio.attachmentUrl
      _url = _url.match(/\.mp3/gi) ? _url : _url + '.mp3'
      this.handlePlay(this.$config.resUrl + _url, () => {
        this.initPRBtn(1, '', this.isShowAnswer ? 3 : 4)
      })
    },
    handleScore() {
      let optionPrev = 0
      let optionLength = this.topic.topicOption[this.optionIdx].optionList.length
      for (let i = 0; i < this.optionIdx; i++) {
        optionPrev += this.topic.topicOption[i].optionList.length
      }
      let optionEnd = optionPrev + optionLength

      let _score = 0
      this.trueAnswer.forEach((ta, i) => {
        if (i >= optionPrev && i < optionEnd && ta === this.myAnswer[i]) _score++
      })
      _score = Math.round(_score / optionLength * 100)

      this.onSetAnswer({
        isAudio: false,
        myAnswer: this.myAnswer.join(',')
      }, _score, '', true)
    },
    handleSelect(option, index) {
      this.$set(this.myAnswer, this.answerIndex + index, option)
      this.initPRBtn('', '', 4)
      this.isShowAnswer = false

      this.handleScore()
    },
    detailFn() {
      let _param = {
        analysis: this.topic.analysis
      }

      this.handleScore()
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
.question-type-nb_tjcdhhd {
  display: flex;
  flex-direction: column;
  flex: 1;

  .question-content {
    margin-bottom: 45px;

    .question-stem {
      span, p {
        font-size: 24px;
        line-height: 40px;
      }

      span {
        float: left;
        margin-right: 10px;
      }

      p {
        display: inline;
      }

      label.noAnswer {
        font-size: 12px;
        line-height: 16px;
        border: 1px solid #ff9900;
        padding: 2px 8px;
        border-radius: 10px;
        color: #ff9900;
        margin-left: 10px;
        vertical-align: super;
        white-space: nowrap;
      }
    }

    .question-option {
      display: flex;
      align-items: flex-start;
      margin-left: 18px;

      .question-checkBox {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        cursor: pointer;
        background: url(/static/images/practice/exam/radio_normal.png) no-repeat center center;

        &.active {
          background-image: url(/static/images/practice/exam/radio_select.png);
        }

        &.err {
          background-image: url(/static/images/practice/exam/radio_wrong.png);
        }
      }

      .question-optionItem {
        float: left;
        margin-right: 10px;
      }

      .question-optionDesc {
        flex: 1;
      }

      .question-optionItem, .question-optionDesc, .question-optionDesc * {
        font-size: 24px;
        line-height: 40px;
      }

      .question-optionItem.rightSelect, .question-optionDesc.rightSelect {
        color: #21bd73;
        * {
          color: #21bd73;          
        }
      }
      .question-optionItem.wrongSelect, .question-optionDesc.wrongSelect {
        color: #ff6666;
        * {
          color: #ff6666;          
        }
      }
    }
  }
}
</style>
