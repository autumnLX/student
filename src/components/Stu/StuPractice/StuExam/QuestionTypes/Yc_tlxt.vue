<template lang="pug">
  div.question-type-yc_tlxt
    div.question-content
      div.question-stem
        span {{ totalIdx }}.
      div.question-option(v-for='(item, idx) in topic.topicOption[optionIdx].options' :key='item.option + new Date().getTime()')
        div.question-checkBox(:class='handleCheckBoxClass(item, optionIdx)' @click='handleSelect(item.option)')
        span.question-optionItem {{ item.option }}.
        p.question-optionDesc(v-html='item.optionDesc.replace(/<img([^(src])*src="/g, "$&" + $config.resUrl)')
      label.noAnswer(v-if='isShowAnswer && !myAnswer[optionIdx]') 此题未做答
</template>

<script>
export default {
  name: 'QuestionTypeYcTlxt',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
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
      console.info(this.isShowAnswer)
      return {
        active: this.myAnswer[index] === item.option,
        err: this.isShowAnswer && item.option === this.myAnswer[index] && item.option !== this.trueAnswer[index]
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
      let _url = this.topic.topicOption[this.optionIdx].audio.attachmentUrl
      _url = _url.match(/\.mp3/gi) ? _url : _url + '.mp3'
      this.handlePlay(this.$config.resUrl + _url, () => {
        this.initPRBtn(1, '', this.isShowAnswer ? 3 : 4)
      })
    },
    handleScore() {
      let _score = this.myAnswer[this.optionIdx] === this.trueAnswer[this.optionIdx] ? 100 : 0

      this.onSetAnswer({
        isAudio: false,
        myAnswer: this.myAnswer.join(',')
      }, _score, '', true)
    },
    handleSelect(option) {
      this.$set(this.myAnswer, this.optionIdx, option)
      this.initPRBtn('', '', 4)
      this.isShowAnswer = false

      this.handleScore()
    },
    detailFn() {
      let _param = {
        standardAnswer: this.totalIdx + '：' + this.trueAnswer[this.optionIdx],
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
.question-type-yc_tlxt {
  display: flex;
  flex-direction: column;
  flex: 1;

  .question-content {
    margin-bottom: 45px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .question-stem {
      span {
        float: left;
        margin-right: 10px;
        font-size: 24px;
        line-height: 80px;
      }
    }

    .question-option {
      width: 235px;
      display: flex;
      align-items: center;
      float: left;

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
        font-size: 24px;
        line-height: 80px;
      }

      .question-optionDesc {
        img {
          width: 120px;
          height: 80px;
          display: block;
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
      white-space: nowrap;
    }
  }
}
</style>
