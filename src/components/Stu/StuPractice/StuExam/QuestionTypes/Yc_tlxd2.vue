<template lang="pug">
  div.question-type-yc_tlxd2
    div.question-content
      div.question-stem
        span {{ totalIdx }}.
      div.question-optionBox
        div.question-option(v-for='(item, idx) in topic.topicOption[optionIdx].options' :key='item.option + new Date().getTime()')
          div.question-checkBox(:class='handleCheckBoxClass(item)' @click='handleSelect(item.option)')
          span.question-optionItem(:class='handleOptionClass(item)') {{ item.option }}.
          p.question-optionDesc(:class='handleOptionClass(item)' v-html='item.optionDesc')
          label.noAnswer(v-if='isShowAnswer && !myAnswer && idx === 0') 此题未做答
</template>

<script>
export default {
  name: 'QuestionTypeYcTlxd2',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      trueAnswer: '',
      myAnswer: '',
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
    handleCheckBoxClass(item) {
      return {
        active: this.myAnswer === item.option,
        err: this.isShowAnswer && item.option === this.myAnswer && item.option !== this.trueAnswer
      }
    },
    handleOptionClass(item) {
      return {
        rightSelect: this.isShowAnswer && item.option === this.trueAnswer,
        wrongSelect: this.isShowAnswer && item.option === this.myAnswer && item.option !== this.trueAnswer,
      }
    },
    initAnswer() {
      this.initPRBtn('', '', 4)
      this.$nextTick(() => {
        this.isShowAnswer = false
      })
      this.trueAnswer = ''
      this.myAnswer = this.detailScore.myAnswer.split(',')[this.optionIdx]

      for (let j = 0; j < this.topic.topicOption[this.optionIdx].options.length; j++) { // 获取正确答案
        let option = this.topic.topicOption[this.optionIdx].options[j]
        if (option.isTrue) {
          this.trueAnswer = option.option
          break
        }
      }
    },
    playFn() {
      this.initPRBtn(2, '', this.isShowAnswer ? 3 : 4)
      let _url = this.topic.topicOption[this.optionIdx].audio.attachmentUrl
      _url = _url.match(/\.mp3/gi) ? _url : _url + '.mp3'
      this.handlePlay(this.$config.resUrl + _url, () => {
        this.initPRBtn(1, '', this.isShowAnswer ? 3 : 4)
      })
    },
    handleScore(option) {
      let _answer = this.detailScore.myAnswer.split(',')
      if (option) _answer[this.optionIdx] = this.myAnswer = option
      else this.myAnswer = _answer[this.optionIdx]

      let _score = this.myAnswer === this.trueAnswer ? 100 : 0

      this.onSetAnswer({
        isAudio: false,
        myAnswer: _answer.join(',')
      }, _score, '', true)
    },
    handleSelect(option) {
      this.initPRBtn('', '', 4)
      this.isShowAnswer = false

      this.handleScore(option)
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
.question-type-yc_tlxd2 {
  display: flex;
  flex-direction: column;
  flex: 1;

  .question-content {
    display: flex;
    margin-bottom: 45px;

    .question-stem {
      span {
        float: left;
        margin-right: 10px;
        font-size: 24px;
        line-height: 40px;
      }
    }

    .question-optionBox {
      flex: 1;

      .question-option {
        display: flex;
        align-items: flex-start;

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

        .question-optionItem {
          float: left;
          margin-right: 10px;
        }

        .question-optionDesc {
          flex: 1;
        }
      }
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
      margin-top: 9px;
      white-space: nowrap;
    }
  }
}
</style>
