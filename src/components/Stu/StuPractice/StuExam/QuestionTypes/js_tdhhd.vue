<template lang="pug">
  div.question-type-js_tdhhd
    div.question-content
      div.question-stem
        span {{ totalIdx }}.
        p(v-html='topic.topicContent.replace(/<img([^(src])*src="/g, "$&" + $config.resUrl)')
        label.noAnswer(v-if='isShowAnswer && !myAnswer') 此题未做答
      div.question-option(v-for='(item, idx) in topic.topicOption' :key='item.option + new Date().getTime()')
        div.question-checkBox(:class='handleCheckBoxClass(item)' @click='handleSelect(item.option)')
        span.question-optionItem(:class='handleOptionClass(item)') {{ item.option }}.
        p.question-optionDesc(:class='handleOptionClass(item)' v-html='item.optionDesc')
</template>

<script>
export default {
  name: 'QuestionTypeJs_tdhhd',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'ChangePRStatus', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark'],
  data() {
    return {
      trueAnswer: '',
      myAnswer: '',
      isShowAnswer: false,
      isInitRendered: false,
      audioUrl: '',
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
      this.myAnswer = this.detailScore.myAnswer

      let _url = this.topic.topicAttachment[0].attachmentUrl
      this.audioUrl = this.$config.resUrl + (_url.match(/\.mp3/gi) ? _url : _url + '.mp3')

      this.topic.topicOption.forEach((options, i) => {
        if (options.isTrue) this.trueAnswer = options.option
      })
    },
    playFn() {
      this.initPRBtn(2, '', this.isShowAnswer ? 3 : 4)
      this.handlePlay(this.audioUrl, () => {
        this.initPRBtn(1, '', this.isShowAnswer ? 3 : 4)
      })
    },
    handleSelect(option) {
      this.myAnswer = option
      this.initPRBtn('', '', 4)
      this.isShowAnswer = false

      let _score = this.myAnswer && this.myAnswer === this.trueAnswer ? 100 : 0

      this.onSetAnswer({
        isAudio: false,
        myAnswer: this.myAnswer
      }, _score, '', true)
    },
    detailFn() {
      let _param = {
        originalAudio: this.audioUrl,
        originalText: '听力',
        originalContent: this.topic.audioOriginalText,
        analysis: this.topic.analysis,
        standardAnswer: this.topic.topicOption.filter(i => i.isTrue)[0].option
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
.question-type-js_tdhhd {
  display: flex;
  flex-direction: column;
  flex: 1;

  .question-content {
    max-width: 820px;
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

        &.active.err {
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
