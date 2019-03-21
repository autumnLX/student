<template lang="pug">
  div.explain(:class='{open}' @transitionend='handleTransitionEnd')
    span.retract(@click='handleClose') 收起 ↑
    div.explainDetail(v-if='exp.topicType === "gdymf"')
      div.explainDetailRow(v-for='(detail, i) in exp.detailArr' style='pading-top: 25px;')
        div.analysis
          div.analysis-row.analysis-myAnswer(v-if='detail.myAnswer || detail.myAudio')
            label 我的答案：
            button(
              v-if='exp.myAudio'
              :class='{explainPlaying: AudioBtn === "my"}'
              @click='handleClickPlay("my", exp.myAudio)'
            )
            div(v-html='exp.myAnswer')
          div.analysis-row.analysis-standardAnswer(v-if='detail.standardAnswer || detail.standardAudio')
            label 参考答案：
            button(
              v-if='exp.standardAudio'
              :class='{explainPlaying: AudioBtn === "standard", myAnswerAudio: true}'
              @click='handleClickPlay("standard", exp.standardAudio)'
            )
            div(v-if='exp.standardAnswer' v-html='exp.standardAnswer')
        div.score(style='height: 60px;')
          span 总分：
            span.green(v-html='handleScoreData(detail.score)')
          span.dimension(v-for='(item, idx) in dimension' v-if='getDimension(exp.coreType) >= item.lv') {{ item.txt + '：' + (exp[item.name] || '--') }}
          //- div(v-if='typeof detail.speed === "number"')
          //- span(v-if='typeof detail.speed === "number"') 语速：{{transSpeed}}
        hr(style='border-top: 1px solid #ccc;margin: 0 30px 0 315px;')
      div.analysis(v-if='exp.analysis' style='padding: 0 30px 30px 315px;')
        div.analysis-row.analysis-analysis
          label 解析：
          div(v-html='exp.analysis')
    div.explainDetail(v-else)
      div.score(v-if='$store.state.examResultShowScoreDetail')
        span 总分：
          span.green(v-html='handleScoreData(exp.score)')
        span.dimension(v-for='(item, idx) in dimension' v-if='getDimension(exp.coreType) >= item.lv') {{ item.txt + '：' + (exp[item.name] || '--') }}
        //- div(v-if='typeof exp.speed === "number"')
        //- span(v-if='typeof exp.speed === "number"') 语速：{{transSpeed}}
      div.analysis
        div.analysis-row.analysis-originalText(v-if='exp.originalText')
          label {{exp.originalText}}原文：
          button(
            :class='{explainPlaying: AudioBtn === "origin"}'
            @click='handleClickPlay("origin", exp.originalAudio)'
          )
          div(v-html='handleNewHandle(exp.originalContent)')
        div.analysis-divide(v-if='exp.originalText')
        div.analysis-row.analysis-myAnswer(v-if='exp.myAnswer || exp.myAudio')
          label 我的答案：
          button(
            v-if='exp.myAudio'
            :class='{explainPlaying: AudioBtn === "my", myAnswerAudio: true}'
            @click='handleClickPlay("my", exp.myAudio)'
          )
          div(v-html='exp.myAnswer')
        div.analysis-row.analysis-standardAnswer(v-if='exp.standardAnswer')
          label 参考答案：
          button(
            v-if='exp.standardAudio'
            :class='{explainPlaying: AudioBtn === "standard"}'
            @click='handleClickPlay("standard", exp.standardAudio)'
          )
          div(v-if='exp.standardAnswer' v-html='exp.standardAnswer')
        div.analysis-row.analysis-standardAudio(v-if='exp.standardAudio && !exp.standardAnswer')
          label 参考音频：
          button(
            :class='{explainPlaying: AudioBtn === "standard"}'
            @click='handleClickPlay("standard", exp.standardAudio)'
          )
        div.analysis-row.analysis-analysis
          label 解析：
          div(v-html='exp.analysis || "无"')
      audio(:src='currentAudio' ref='explainPlay' @ended='handlePlayEnded')
</template>

<script>
/*
 * topicType 题目类型
 * score 分数
 * integrity 完整度
 * fluency 流利度
 * speed 语速
 * originalText 问题 听力
 * originalAudio 原音频
 * originalContent 原文
 * myAnswer 我的答案
 * myAudio 我的音频
 * standardAnswer 参考答案
 * standardAudio 参考音频
 * analysis 解析
 * detailArr 跟读与模仿专用 多行数据 结构与上面类似
 */
export default {
  name: 'StuExamExplain',
  props: ['onClosed', 'explainParam', 'PRStatusCheck'],
  data() {
    return {
      dimension: [
        { name: 'integrity', lv: 2, txt: '完整度' },
        { name: 'accuracy', lv: 3, txt: '准确度' },
        { name: 'fluency', lv: 2, txt: '流利度' },
      ],
      open: false,
      exp: {},
      currentAudio: '',
      AudioBtn: '', // origin 原音 my 我的音频 standard 参考音频
    }
  },
  computed: {
    transSpeed: function() {
      let fspeed = Math.round(this.exp.speed / 2)
      if (fspeed < 80) {
        return '偏慢'
      } else if (fspeed > 120) {
        return '偏快'
      } else {
        return '正常'
      }
    },
  },
  methods: {
    handleNewHandle(text) {
      return text.replace(/\n/g, '<br>')
    },
    getDimension(coreType) {
      if (['en.sent.child', 'en.sent.score'].indexOf(coreType) >= 0) {
        return 3
      } else if (['en.pred.exam'].indexOf(coreType) >= 0) {
        return 2
      } else {
        return 0
      }
    },
    handleScoreData(score) {
      let _score = score || 0
      if (_score >= 55) {
        return _score
      } else {
        return '<img src="/static/images/practice/exam/pic_score_cry.png" />'
      }
    },
    handleClose() {
      this.open = false
    },
    handleTransitionEnd() {
      this.onClosed()
    },
    handleClickPlay(type, url) {
      if (this.$store.state.PRStatus === 'waiting') {
        return false
      } else if (this.$store.state.PRStatus === 'playing') {
        if (!this.AudioBtn || this.AudioBtn !== type) {
          this.PRStatusCheck('', () => {
            this.$store.state.PRStatus = 'playing'
            this.AudioBtn = type
            this.currentAudio = url
            this.$nextTick(() => {
              this.$refs.explainPlay.play()
            })
          })
        } else {
          this.PRStatusCheck('self', () => {
            this.$store.state.PRStatus = 'idle'
          })
        }
      } else if (this.$store.state.PRStatus === 'recording') {
        this.PRStatusCheck('stop')
      } else if (this.$store.state.PRStatus === 'scoring') {
        this.PRStatusCheck('tip')
      } else {
        this.$store.state.PRStatus = 'playing'
        this.AudioBtn = type
        this.currentAudio = url
        this.$nextTick(() => {
          this.$refs.explainPlay.play()
        })
      }
    },
    handlePlayEnded() {
      this.AudioBtn = ''
      this.currentAudio = ''
      this.$refs.explainPlay.pause()
    },
  },
  watch: {
    explainParam: function() {
      this.exp = Object.assign({}, this.explainParam)
    }
  },
  mounted() {
    this.exp = Object.assign({}, this.explainParam)
    this.$nextTick(() => {
      this.open = true
    })
  }
}
</script>

<style lang="less">
#stu-practice-exam-root .explain {
  width: 1200px;
  position: relative;
  padding-top: 20px;
  margin-top: -20px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  background-color: #fff;
  transform: translateY(-100%);
  transition: transform 600ms 100ms;

  &.open {
    transform: translateY(0);
  }

  .retract {
    position: absolute;
    top: 45px;
    right: 30px;
    color: #ccc;
    font-size: 16px;
    line-height: 30px;

    &:hover {
      color: #21bd73;
      cursor: pointer;
    }
  }

  .score {
    display: flex;
    align-items: center;
    height: 80px;
    padding-left: 250px;

    & > span {
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 210px;
      color: #999;
      font-size: 16px;

      span {
        font-size: 16px;

        &.green {
          color: #21bd73;
          font-size: 24px;

          img {
            display: block;
          }
        }
      }

      &.dimension {
        border-left: 1px solid #ccc;
      }
    }
  }

  .score ~ div {
    padding-top: 0 !important;
  }

  .analysis {
    padding: 25px 30px 20px 315px;

    .analysis-divide {
      margin: 10px 0;
      border-top: 1px solid #eee;
    }

    button {
      width: 30px;
      height: 30px;
      border: none;
      background: url(/static/images/practice/exam/audios_original_text.png);
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;

      &.explainPlaying {
       background: url(/static/images/practice/exam/audios_original_text_playing.gif)
      }

      &.myAnswerAudio {
       background: url(/static/images/practice/exam/audios_my_answer.png)
      }

      &.myAnswerAudio.explainPlaying {
       background: url(/static/images/practice/exam/voice_palying30.gif)
      }
    }

    .analysis-row {
      & > label {
        color: #666;
        font-size: 16px;
        line-height: 40px;
      }

      & > div {
        color: #999;
        line-height: 30px;

        * {
          color: #999;
          line-height: 30px;
        }
      }
    }

    sup {
      display: none;
    }
  }

  audio {
    width: 0;
    height: 0;
  }
}
</style>
