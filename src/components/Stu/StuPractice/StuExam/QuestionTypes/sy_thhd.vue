<template lang="pug">
  div.question-type-sy_thhd
    div.question-content(v-html='topic.topicContent.replace(/<img([^(src])*src="/g, "$&" + $config.resUrl)')
    div.question-option(v-for='(item,index) in topic.topicOption')
      div(class='optin' :class="{hight:showHight && index===optionIdx}") 
        span.title 问题{{index+1}}:
        span {{item.questionText}}
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'QuestionTypeSyThhd',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data () {
    return {
      isVideoPlaying: false,
      videoDuration: 0,
      reftxt: '',
      res: '',
      currentDetail: {},
      isAutoPlayed: false,
      showHight: false,
      hasAutoRecord: false
    }
  },
  watch: {
    partIdx () {
      this.isAutoPlayed = true
      this.currentDetail = {}
    },
    topicIdx () {
      this.init()
      this.currentDetail = {}
      if (!this.isAutoPlayed) {
        this.currentDetail = {}
      } else this.$nextTick(() => { this.isAutoPlayed = false })
    },
    optionIdx () {
      if (this.optionIdx === 0) {
        this.$emit('showNextBtn', false)
        this.hasAutoRecord = false
        this.handleAutoPlay()
      } else {
        // this.recordFn()
      }
      if (this.optionIdx === 3) {
        this.setNextBtnFlag('next')
      } else {
        this.setNextBtnFlag('currentNext')
      }
      if (!this.isAutoPlayed) {
        this.currentDetail = {}
      } else this.$nextTick(() => { this.isAutoPlayed = false })
    }
  },
  computed: {
    ...mapState('exam', ['nextIndex']),
    questionText: function () {
      return this.topic.topicOption[this.optionIdx].questionText.replace(/<\/?[a-zA-Z]+[^><]*>/g, '')
    }
  },
  methods: {
    ...mapMutations('exam', ['setRecordBtnDisable', 'setNextBtnFlag']),
    init () {
      this.res = this.topic.topicAttachment[0].attachmentUrl
      this.res = this.res.match(/\.mp3/gi) ? this.res : this.res + '.mp3'
      this.showHight = false
      this.setNextBtnFlag('currentNext')
      this.setRecordBtnDisable(true)
      this.handleAutoPlay()
      this.currentDetail = {}
    },
    handleAutoPlay () {
      this.initPRBtn(1)
      this.playFn()
    },
    playFn (callback) {
      this.initPRBtn(2)
      this.handlePlay(this.$config.resUrl + this.res, () => {
        this.showHight = true
        this.setRecordBtnDisable(false)
        this.initPRBtn(1, 1)
        this.$emit('showNextBtn', true)
        typeof callback === 'function' && callback()
        if (!this.hasAutoRecord) {
          // this.recordFn()
          this.hasAutoRecord = true
        }
      })
    },
    recordFn () {
      this.reftxt = this.topic.topicOption[this.optionIdx].optionDesc.replace(/#/g, '|').replace(/<\/?[^>]*>/g, '')
      this.initPRBtn('', 2)
      this.handleRecord('scne', this.reftxt)
    },
    scoreFn (score, audioUrl, recordId, result, err) {
      this.initPRBtn(1, 1, 3)

      let tmpObj = {
        isAudio: true,
        audioAnswerList: []
      }

      tmpObj.audioAnswerList[this.optionIdx] = {
        recordError: err,
        score: score,
        audioUrl: audioUrl,
        standardAudio: this.res,
        recordId: recordId,
        attributes: result,
        refText: this.reftxt,
      }

      this.currentDetail = Object.assign({}, tmpObj)
      this.onSetAnswer(tmpObj, score, err)
    },
    detailFn (ds) {
      // if (this.currentIndex === -1) return
      if (ds) this.currentDetail = Object.assign({}, ds)
      let anl = this.currentDetail.audioAnswerList[this.optionIdx] || {}
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        analysis: this.topic.analysis,
        originalText: '问题',
        originalAudio: this.$config.resUrl + (anl.standardAudio.match(/\.mp3/gi) ? anl.standardAudio : anl.standardAudio + '.mp3'),
        originalContent: this.topic.topicOption[this.optionIdx].questionText.replace(/<\/?[a-zA-Z]+[^><]*>/g, ''),
        standardAnswer: this.topic.topicOption[this.optionIdx].optionDesc.replace(/#/g, ' / ')
      }

      return _param
    },
  },
  mounted () {
    this.$emit('showNextBtn', false)
    this.init()
  },
  destroyed () {
    this.setNextBtnFlag('Next')
    this.$emit('showNextBtn', true)
    this.setRecordBtnDisable(false)
  }
}
</script>

<style lang="less" scoped>
.optin {
  line-height: 30px;
  height: 30px;
  color: #666;
  .title {
    margin-right: 8px;
  }
  span {
    font-size: 18px;
  }
}
.hight {
  span {
    color: #24cc7c;
  }
}
.question-type-yc_qjwd {
  display: flex;
  flex-direction: column;
  flex: 1;

  .question-content,
  .question-content *,
  .question-option,
  .question-option * {
    font-size: 18px;
    line-height: 36px;
    max-width: 820px;
  }

  .question-option > span {
    float: left;
  }

  .question-option > div {
    display: inline-block;
  }
}
</style>

