<template lang="pug">
  div.question-type-js_tdwtb
    img(:src='$config.resUrl + topic.topicAttachment[1].attachmentUrl')
    div.question-content(v-for='(option, index) in topic.topicOption' :key='index + new Date().getTime()')
      div.question-stem
        span {{ totalIdx + index }}.
        p(v-html='option.topicStem')
        label.noAnswer(v-if='isShowAnswer && !myAnswer[index]') 此题未做答
      div.question-option(v-for='(item, idx) in option.options' :key='item.option + new Date().getTime()')
        div.question-checkBox(:class='handleCheckBoxClass(item, index)' @click='handleSelect(item.option, index)')
        span.question-optionItem(:class='handleOptionClass(item, index)') {{ item.option }}.
        p.question-optionDesc(:class='handleOptionClass(item, index)' v-html='item.optionDesc')
</template>

<script>
export default {
  name: 'QuestionTypeJs_tdwtb',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      trueAnswer: [],
      myAnswer: [],
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
    handleCheckBoxClass(item, index) {
      return {
        active: this.myAnswer[index] === item.option,
        err: this.isShowAnswer && item.option === this.myAnswer[index] && item.option !== this.trueAnswer[index]
      }
    },
    handleOptionClass(item, index) {
      return {
        rightSelect: this.isShowAnswer && item.option === this.trueAnswer[index],
        wrongSelect: this.isShowAnswer && item.option === this.myAnswer[index] && item.option !== this.trueAnswer[index],
      }
    },
    initAnswer() {
      this.initPRBtn('', '', 4)
      this.$nextTick(() => {
        this.isShowAnswer = false
      })
      this.trueAnswer = []
      this.myAnswer = []
      let _answer = this.detailScore.myAnswer.split(',')

      let _url = this.topic.topicAttachment[0].attachmentUrl
      this.audioUrl = this.$config.resUrl + (_url.match(/\.mp3/gi) ? _url : _url + '.mp3')

      this.topic.topicOption.forEach((tOption, i) => {
        this.myAnswer.push(_answer[i]) // answer回填
        for (let j = 0; j < tOption.options.length; j++) { // 获取正确答案
          let option = tOption.options[j]
          if (option.isTrue) {
            this.trueAnswer.push(option.option)
            break
          }
        }
      })
    },
    playFn() {
      this.initPRBtn(2, '', this.isShowAnswer ? 3 : 4)
      this.handlePlay(this.audioUrl, () => {
        this.initPRBtn(1, '', this.isShowAnswer ? 3 : 4)
      })
    },
    handleSelect(option, index) {
      this.$set(this.myAnswer, index, option)
      this.initPRBtn('', '', 4)
      this.isShowAnswer = false

      let _score = 0
      this.trueAnswer.forEach((ta, i) => {
        if (ta === this.myAnswer[i]) _score++
      })
      _score = Math.round(_score / this.trueAnswer.length * 100)

      this.onSetAnswer({
        isAudio: false,
        myAnswer: this.myAnswer.join(',')
      }, _score, '', true)
    },
    detailFn() {
      let _param = {
        originalAudio: this.audioUrl,
        originalText: '听力',
        originalContent: this.topic.audioOriginalText,
        analysis: this.topic.analysis,
        standardAnswer: JSON.stringify(this.topic.topicOption).match(/.(?=","isTrue":true)/g).map((i, index) => index + 1 + '. ' + i).join('<br/>')
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
.question-type-js_tdwtb {
  display: flex;
  flex-direction: column;
  flex: 1;

  img {
    width: auto;
    height: 250px;
    display: block;
    margin: 10px auto 25px 0;
  }

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
      margin-left: 30px;

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
