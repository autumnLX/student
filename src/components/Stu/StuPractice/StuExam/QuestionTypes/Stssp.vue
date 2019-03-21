<template lang="pug">
  div.question-type-stssp
    video(
      width='390'
      height='260'
      :src='videoUrl'
      autoplay='true'
      controls='true'
      ref='videoBox'
      v-if='isVideoPlaying'
      @ended='handleVideoEnd'
    )
      p
        a(:href='videoUrl' target='_blank') 您的浏览器不支持 video 标签,请下载视频。
    img(:src='imgUrl' width='390' height='260' v-else)
    div.question-content(v-html='contentHtml')
</template>

<script>
export default {
  name: 'QuestionTypeStssp',
  props: ['topic', 'detailScore', 'partIdx', 'topicIdx', 'optionIdx', 'totalIdx', 'initPRBtn',
    'handleRecord', 'handlePlay', 'onSetAnswer', 'handleRenderDetail',
    'handleReplaceMark', 'showTimeFlag'],
  data() {
    return {
      isVideoPlaying: false,
      videoDuration: 0,
      reftxt: '',
      contentHtml: '',
      currentDetail: {},
      isAutoPlayed: false,
    }
  },
  watch: {
    partIdx() {
      this.isAutoPlayed = true
      this.handleAutoPlay()
      this.contentHtml = this.topic.topicOption[this.optionIdx].topicStem
      this.currentDetail = {}
    },
    topicIdx() {
      if (!this.isAutoPlayed) {
        this.handleAutoPlay()
        this.contentHtml = this.topic.topicOption[this.optionIdx].topicStem
        this.currentDetail = {}
      } else this.$nextTick(() => { this.isAutoPlayed = false })
    },
    optionIdx() {
      if (!this.isAutoPlayed) {
        this.handleAutoPlay()
        this.contentHtml = this.topic.topicOption[this.optionIdx].topicStem
        this.currentDetail = {}
      } else this.$nextTick(() => { this.isAutoPlayed = false })
    }
  },
  computed: {
    videoUrl() {
      return this.$config.resUrl + this.topic.topicAttachment[0].attachmentUrl
    },
    imgUrl() {
      let pic = this.topic.topicOption[this.optionIdx].picture
      if (pic.match(/<img/g)) {
        pic = pic.replace(/.*<img src=['"]([^'"]*)['"][^>]*>.*/, '$1')
      }
      return this.$config.resUrl + pic
    }
  },
  methods: {
    handleAutoPlay() {
      if (!this.topic.done[this.optionIdx]) {
        this.initPRBtn(1, 1)
        if (this.optionIdx === 0) {
          this.$store.state.PRStatus = 'playing'
          this.playFn()
        }
      }
    },
    handleVideoEnd() {
      this.initPRBtn(1, 1)
      this.isVideoPlaying = false
    },
    playFn() {
      this.initPRBtn(2)
      this.isVideoPlaying = true
      this.$nextTick(() => {
        this.videoDuration = this.$refs.videoBox.duration
      })
    },
    pauseFn() {
      this.handleVideoEnd()
    },
    recordFn() {
      this.reftxt = this.topic.topicOption[this.optionIdx].topicStem.replace(/<\/?[^>]*>/g, '')
      this.initPRBtn('', 2)
      this.handleRecord('auto', this.reftxt, {
        videoTime: this.videoDuration
      })
    },
    scoreFn(score, audioUrl, recordId, result, err) {
      this.initPRBtn(1, 1, 3)

      let tmpObj = {
        isAudio: true,
        audioAnswerList: []
      }

      tmpObj.audioAnswerList[this.optionIdx] = {
        recordError: err,
        score: score,
        audioUrl: audioUrl,
        standardAudio: this.$config.resUrl + this.topic.topicAttachment[0].attachmentUrl,
        recordId: recordId,
        attributes: result,
        refText: this.reftxt,
      }

      this.currentDetail = Object.assign({}, tmpObj)

      if (result && this.showTimeFlag) {
        let _detail = this.handleRenderDetail(tmpObj.audioAnswerList[this.optionIdx])
        this.contentHtml = _detail.text
      }

      this.onSetAnswer(tmpObj, score, err)
    },
    detailFn(ds) {
      if (ds) this.currentDetail = Object.assign({}, ds)
      let anl = this.currentDetail.audioAnswerList[this.optionIdx]
      let attributes = anl.attributes
      let _param = {
        score: anl.score,
        coreType: anl.coreType,
        analysis: this.topic.analysis
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
    this.contentHtml = this.topic.topicOption[this.optionIdx].topicStem
    this.handleAutoPlay()
  }
}
</script>

<style lang="less">
.question-type-stssp {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  .question-content {
    max-width: 820px;
    margin-top: 35px;
    font-size: 24px;
    line-height: 28px;

    * {
      font-size: 24px;
      line-height: 28px;
    }
  }
}
</style>

