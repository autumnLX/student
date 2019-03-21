<template lang="pug">
  div.right(ref='right')
    div.desc(v-if='currentQuestionIdx === -1')
      div(style='width: 100%;')
        div.name
          div.line
          span {{ list[currentPartIndx].topicTypeName }}
          div.line
        div.remark
          p(v-html='remarkContent')
      button.btn.btn-green(@click='onNext') 开始
    template(v-else)
      div.collect(:class='{ collected }' @click='handleCollect')
      div.work-zone
        div.f18.grey6(style='line-height: 40px;')
          | {{ transformNum(currentPartIndx) + list[currentPartIndx].topicTypeName }}
          span.f18.grey6(v-if='!singleTopicType') （{{ list[currentPartIndx].topicSumScore }}分）
        div.question-zone
          vue-scroll
            component(
              :is='topicComponent'
              :topic='list[currentPartIndx].topicList[currentQuestionIdx]'
              :detailScore='detailScore[currentPartIndx][currentQuestionIdx]'
              :partIdx='currentPartIndx'
              :topicIdx='currentQuestionIdx'
              :optionIdx='currentOptionIdx'
              :totalIdx='currentTotalIdx'
              :initPRBtn='initPRBtn'
              :handleRecord='handleRecord'
              :handlePlay='handlePlay'
              :onSetAnswer='onSetAnswer'
              :handleRenderDetail='handleRenderDetail'
              :handleReplaceMark='handleReplaceMark'
              :showTimeFlag='showTimeFlag'
              @showNextBtn='showNextBtnHandle'
              ref='topicChild'
            )
      div.bottom-zone
        div.btn-zone(:class='btnZoneClass')
          div.listen(:class='{listening: listenStatus === 2, disabled: listenStatus === 0}' @click='handleClickListen' :style='{visibility: isShowPlay && isShowRecord ? "visible" : "hidden"}')
          div.listen-l(:class='{listening: listenStatus === 2, disabled: listenStatus === 0}' @click='handleClickListen' :style='{visibility: isShowPlay ? "visible" : "hidden"}' v-if='isShowPlay && !isShowRecord')
          div.record(:class='{recording: recordStatus === 2, disabled: recordStatus === 0 || recordBtnDisable}' @click='handleClickRecord' :style='{visibility: isShowRecord ? "visible" : "hidden"}' v-else)
            div.scoringTip(v-if='scoringTip') 正在评分，请稍等...
          div.avatar-and-score(@click='handleClickReplay' v-if='showTimeFlag')
            img.avatar(:src='avatar')
            div.disabled(v-if='replayStatus === 0')
            div.waiting(v-else-if='replayStatus === 1')
            div.playing(v-else-if='replayStatus === 2')
            div.submit(v-else-if='replayStatus === 4' @click.stop='handleReplaySubmit')
            div.score.good(v-else-if='score >= $config.ScoreLevel.good') {{ score }}
            div.score(v-else-if='score >= $config.ScoreLevel.bad') {{ score }}
            div.score.bad(v-else)
            audio(:src='audioUrl' ref='replayBox' @ended='handleReplayEnded')
          div.detail(@click='handleShowDetail' v-if='(showTimeFlag || singleTopicType) && examResult')
            i
            span 详细解析
        div(:class='!singleTopicType && isLastQuestion ? "last" : "next"' v-if="showNextBtn" @click='handleNext')
    transition(mode='out-in' name='fade')
      div.examToast(:class='toast.type === "noIcon" ? "et-noIcon" : ""' v-if='toast.isShow')
        img(:src='"/static/images/practice/exam/toast_" + toast.img + ".png"' v-if='toast.type !== "noIcon"')
        div.et-cnt
          p.et-text1 {{ toast.text1 }}
          p.et-text2 {{ toast.text2 }}
    Dialog(:dialogConfig='wpDCfg' :isShowDialog='isShowWarning')
</template>

<script>
import Topics from './QuestionTypes/index'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StuExamRight',
  components: Topics,
  props: ['transformNum', 'list', 'singleTopicType', 'detailScore', 'currentPartIndx',
    'currentQuestionIdx', 'currentOptionIdx', 'currentTotalIdx', 'isLastQuestion', 'onSetAnswer',
    'onNext', 'onOpenExplain', 'PRStatusCheck', 'handleErrTwice', 'handleSetDetail', 'showTimeFlag',
    'stopExplainPlay'],
  data () {
    return {
      pname: window.ConfigNew.header.name,
      pushParam: {
        gradeName: this.$store.state.student.grade,
        className: this.$store.state.student.clazz
      },
      wpDCfg: {
        getCurrentPage: 'WarningPopup',
      },
      isShowWarning: false,
      isIdxWatched: false,
      avatar: '',
      collected: false,
      isShowPlay: true,
      isShowRecord: true,
      doPRStop: true, // 是否允许player和recorder的onStop回调
      recordErrCount: 0,
      listenStatus: 1, // 0 disabled 1 pause 2 playing
      recordStatus: 1, // 0 disabled 1 pause 2 playing
      replayStatus: 0, // 0 disabled 1 waiting 2 playing 3 result 4 提交成绩
      score: 0,
      currentAudio: '',
      currentTopicType: this.list[this.currentPartIndx].topicTypeId,
      player: this.$store.state.$player,
      recorder: this.$store.state.$recorder,
      lastRecordId: '',
      isRecordOver: true, // 录音结果是否返回
      playErrorNum: 0, // 播放失败次数
      scoringTip: false, // 正在评分中提示
      toast: {
        isShow: false,
        type: '', // noIcon
        img: '',
        text1: '',
        text2: ''
      },
      remarkContent: '', // 题型说明
      showNextBtn: true,
      examResult: false, // 是否完成作答 - 单题
    }
  },
  watch: {
    currentPartIndx: function () {
      this.isIdxWatched = true
      this.initRender()
    },
    currentQuestionIdx: function () {
      if (!this.isIdxWatched) this.initRender()
      else this.$nextTick(() => { this.isIdxWatched = false })
    },
    currentOptionIdx: function () {
      if (!this.isIdxWatched) this.initRender()
      else this.$nextTick(() => { this.isIdxWatched = false })
    },
    list: function () {
      if (this.currentPartIndx >= 0 && this.currentQuestionIdx >= 0 && this.currentOptionIdx >= 0) {
        this.score = this.list[this.currentPartIndx].topicList[this.currentQuestionIdx].score[this.currentOptionIdx]
      }
    }
  },
  computed: {
    ...mapState('exam', ['recordBtnDisable',
      'nextBtnFlag']),
    audioUrl: function () {
      let url = this.currentAudio
      if (url) {
        if (!/^http/.test(url)) {
          url = 'http://' + url
        }

        if (!/mp3$/.test(url)) {
          url += '.mp3'
        }

        return url
      } else {
        return ''
      }
    },
    btnZoneClass () {
      return 'btn-zone-' + this.currentTopicType
    },
    topicComponent () {
      return 't' + this.currentTopicType
    },
  },
  methods: {
    ...mapMutations('exam', ['next']),
    handleExamResult (val) {
      this.examResult = val
    },
    showNextBtnHandle (flag) {
      console.log(flag)
      this.showNextBtn = flag
    },
    handleRemark () {
      let tNum = document.querySelectorAll('.block > .list')[this.currentPartIndx].childNodes.length
      this.remarkContent = this.list[this.currentPartIndx].topicTypeRemark.replace(/{{num}}/g, tNum)
    },
    initRender () {
      const { currentPartIndx, currentQuestionIdx, currentOptionIdx } = this
      this.player.stop()
      this.recordErrCount = 0
      if (currentQuestionIdx > -1) {
        const question = this.list[currentPartIndx].topicList[currentQuestionIdx]
        this.handleCheckCollect()
        this.currentTopicType = this.list[currentPartIndx].topicTypeId
        if (['71'].indexOf(this.currentTopicType) > -1) {
          this.currentAudio = this.detailScore[currentPartIndx].standardAudio
        } else if (this.detailScore[this.currentPartIndx][this.currentQuestionIdx].isAudio) {
          if (this.currentTopicType === '49') {
            if (this.currentOptionIdx === 1) {
              this.currentAudio = this.detailScore[currentPartIndx][currentQuestionIdx].audioAnswerList[0].audioUrl
            } else {
              this.currentAudio = ''
            }
          } else {
            this.currentAudio = this.detailScore[currentPartIndx][currentQuestionIdx].audioAnswerList[currentOptionIdx].audioUrl
          }
        } else {
          this.currentAudio = ''
        }

        this.listenStatus = 1
        this.recordStatus = 1

        this.$nextTick(() => {
          const _ds = this.detailScore[this.currentPartIndx][this.currentQuestionIdx]
          if (question.done && question.done[currentOptionIdx] && typeof question.score[currentOptionIdx] === 'number') {
            if (_ds.isAudio) {
              if (this.currentTopicType === '49' && currentOptionIdx === 0) {
                this.replayStatus = 4
              } else {
                this.replayStatus = 3
              }
            } else {
              this.replayStatus = 4
            }

            if (this.showTimeFlag) {
              let _param = typeof this.$refs.topicChild.detailFn === 'function' ? this.$refs.topicChild.detailFn(_ds) : {}
              if (['22'].indexOf(this.currentTopicType) >= 0) {
                let tmp = 0
                question.score.forEach((num) => {
                  tmp += num
                })
                this.score = Math.round(tmp / question.score.length)
              } else this.score = question.score[currentOptionIdx]

              this.examResult = true
              this.$store.state.examResultShowScoreDetail = true
              this.handleSetDetail(_param)
            }
          } else {
            if (_ds.isAudio) {
              if (this.currentTopicType === '49' && currentOptionIdx === 0) {
                this.replayStatus = 4
              } else this.replayStatus = 0
            } else this.replayStatus = 4

            if (this.showTimeFlag) {
              this.score = 0
              this.examResult = false
              this.$store.state.examResultShowScoreDetail = false
              this.handleSetDetail({})
            }
          }
        })
      }

      this.$nextTick(() => {
        if (currentQuestionIdx >= 0) {
          this.doPRStop = true
          this.isShowPlay = typeof this.$refs.topicChild.playFn === 'function'
          this.isShowRecord = typeof this.$refs.topicChild.recordFn === 'function'
          if (this.currentTopicType === '49') {
            this.isShowRecord = this.currentOptionIdx === 1
          }
          this.isIdxWatched = false
        } else {
          this.handleRemark()
        }
      })
    },
    initPRBtn (play, record, replay) {
      let oReplayStatus = this.replayStatus
      if (typeof play === 'number') this.listenStatus = play
      if (typeof record === 'number') this.recordStatus = record
      if (typeof replay === 'number') this.replayStatus = replay
      else this.replayStatus = oReplayStatus
    },
    handleNext () {
      if (this.$store.state.PRStatus === 'waiting') {
        return false
      } else if (this.$store.state.PRStatus === 'playing') {
        // if (this.nextBtnFlag === 'currentNext') { return }
        this.PRStatusCheck('', () => {
          this.$store.state.PRStatus = 'idle'
          if (this.nextBtnFlag === 'currentNext') {
            this.onNext(this.currentPartIndx, this.currentQuestionIdx, this.currentOptionIdx + 1)
          } else {
            this.onNext()
          }
        })
      } else if (this.$store.state.PRStatus === 'recording') {
        // this.$store.state.PRStatus = 'idle'
        this.PRStatusCheck('stop')
      } else if (this.$store.state.PRStatus === 'scoring') {
        this.PRStatusCheck('tip')
      } else {
        console.log(this.currentNext)
        if (this.nextBtnFlag === 'currentNext') {
          this.onNext(this.currentPartIndx, this.currentQuestionIdx, this.currentOptionIdx + 1)
        } else {
          this.onNext()
        }
      }
    },
    handleCheckCollect () {
      const question = this.list[this.currentPartIndx].topicList[this.currentQuestionIdx]
      if (['51', '52', '53', '54', '73'].indexOf(this.currentTopicType) >= 0) {
        this.collected = question.isCollection.data.indexOf(this.currentOptionIdx + 1) >= 0
      } else {
        this.collected = question.isCollection.data.indexOf(0) >= 0
      }
    },
    handleCollect () {
      const question = this.list[this.currentPartIndx].topicList[this.currentQuestionIdx]
      const _isSplit = ['51', '52', '53', '54', '73'].indexOf(this.currentTopicType) >= 0
      if (this.collected) {
        this.$api.deleCollections({
          topicId: question.topicID,
          subTopic: _isSplit ? this.currentOptionIdx + 1 : 0,
        }, () => {
          let _index = question.isCollection.data.indexOf(_isSplit ? this.currentOptionIdx + 1 : 0)
          this.collected = false
          question.isCollection.data.splice(_index, 1)
          this.$toast({
            text: '已取消收藏',
            showWrap: false,
            iconFlag: false,
            duration: 1000,
            styleObj: {
              'width': '140px',
              'height': '50px',
              'border-radius': '4px',
              'background-color': 'rgba(0, 0, 0, 0.6)'
            }
          })
        })
      } else {
        this.$api.addCollections({
          topicId: question.topicID,
          subTopic: _isSplit ? this.currentOptionIdx + 1 : 0,
          topicType: question.topicTypeId,
        }, () => {
          this.collected = true
          question.isCollection.data.push(_isSplit ? this.currentOptionIdx + 1 : 0)
          question.isCollection.data.sort()
          this.$toast({
            text: '收藏成功',
            showWrap: false,
            duration: 1000,
            styleObj: {
              'width': '160px',
              'height': '50px',
              'border-radius': '4px',
              'background-color': '#21bd73'
            }
          })
        })
      }
    },
    handleTransCoretype (coreType, refText) {
      let _refArr = refText.replace(/\s*[|#]\s*/g, '#').split('#')
      let maxtxt = 0

      for (let i = 0; i < _refArr.length; i++) {
        maxtxt = _refArr[i].split(' ').length > maxtxt ? _refArr[i].split(' ').length : maxtxt
      }

      let duration = maxtxt * 900 + 2000

      if (coreType === 'auto') {
        if (maxtxt === 1) return { ctype: 'word', duration: duration }
        else if (maxtxt <= 15) return { ctype: 'sent', duration: duration }
        else return { ctype: 'pred', duration: duration }
      } else return { ctype: coreType, duration: duration }
    },
    handleRefText (text, ctype) {
      let reg
      if (ctype === 'hitalk') reg = /([^0-9A-Za-z-,.;:?!'"()[\]{}<>@\s|]|\n)/g
      else reg = /([^0-9A-Za-z-,.;:?!'"()[\]{}<>@\s]|\n)/g // 2019.3.15 add | for hitalk
      return text.replace(/\u2014/g, '-').replace(reg, '') // 2019.3.14 mrs.wang add '
    },
    handleServerParam (coreType, refText, params) {
      // coreType -> word单词 sent句子 pred段落 hitalk comm模仿朗读 oesy口头作文 scne情景对话
      const _commonParams = {
        userId: this.$store.state.student.name,
        rank: 100,
        attachAudioUrl: 1,
        precision: 1,
      }
      let serverParams = {}
      let recordMaxTime = 0

      if (coreType === 'word') {
        recordMaxTime = 10000
        serverParams = Object.assign({}, _commonParams, {
          coreType: 'en.word.child',
          refText: this.handleRefText(refText),
        })
      } else if (coreType === 'sent') {
        recordMaxTime = 30000

        serverParams = Object.assign({}, _commonParams, {
          coreType: 'en.sent.child',
          refText: this.handleRefText(refText),
        })
      } else if (coreType === 'pred') {
        recordMaxTime = 120000
        serverParams = Object.assign({}, _commonParams, {
          coreType: 'en.pred.exam',
          client_params: {
            ext_subitem_rank4: 0,
            ext_word_details: 1,
            ext_phn_details: 1,
            ext_cur_snt: 1
          },
          refText: {
            qid: this.$config.qid,
            lm: this.handleRefText(refText)
          }
        })
      } else if (coreType === 'hitalk') {
        recordMaxTime = 30000
        serverParams = Object.assign({}, _commonParams, {
          coreType: 'en.sent.recscore',
          refText: this.handleRefText(refText, 'hitalk'),
          keyWords: params.keyword,
          result: {
            use_details: 1
          }
        })
      } else if (coreType === 'comm') {
        recordMaxTime = 30000
        serverParams = Object.assign({}, _commonParams, {
          coreType: 'en.comm.cont',
          standard: {
            type: 'mp3',
            url: params.standard
          },
          refText: this.handleRefText(refText),
          result: {
            use_wrd_list: 1,
            use_dim_score: 1
          },
          playDing: true
        })
      } else if (coreType === 'oesy') {
        let saArr = params.standardAnswer.split('#')
        let taArr = params.teacherAnswer.split('#')
        let _lm = []

        saArr.forEach((item, i) => {
          if (item) {
            _lm.push({
              'answer': 2,
              'text': this.handleRefText(item)
            })
          }
        })
        taArr.forEach((item, i) => {
          if (item) {
            _lm.push({
              'answer': 1,
              'text': this.handleRefText(item)
            })
          }
        })

        recordMaxTime = 100000
        serverParams = Object.assign({}, _commonParams, {
          coreType: 'en.oesy.exam',
          refText: {
            qid: this.$store.state.student.id,
            lm: [].concat(_lm)
          }
        })
      } else if (coreType === 'scne') {
        let textArr = refText.split('|');
        let _lm = []
        textArr.forEach((item, i) => {
          _lm.push({
            text: this.handleRefText(item),
            active: '1',
            role: 'b',
            answer: 1
          })
        })

        recordMaxTime = 100000
        serverParams = Object.assign({}, _commonParams, {
          coreType: 'en.scne.exam',
          refText: {
            qid: this.$store.state.student.id,
            role: 'b',
            lm: [].concat(_lm)
          }
        })
      }

      return {
        recordMaxTime: recordMaxTime,
        serverParams: serverParams
      }
    },
    handleRecordCore (coreType, refText, params) {
      params = params || {}
      let _refText = refText.trim().replace(/\s+/g, ' ').replace(/<[^<>]+>/g, ' ')
      let _duration

      let { ctype, duration } = this.handleTransCoretype(coreType, _refText)
      let { serverParams, recordMaxTime } = this.handleServerParam(ctype, _refText, params)

      this.ctype = ctype
      if (params.videoTime) _duration = duration >= params.videoTime ? duration : params.videoTime
      else _duration = duration <= recordMaxTime ? duration : recordMaxTime

      return {
        serverParams: serverParams,
        duration: _duration
      }
    },
    handleClickRecord () {
      this.doPRStop = true
      if (this.$store.state.PRStatus === 'waiting' || this.recordBtnDisable) {
        return false
      } else if (this.$store.state.PRStatus === 'playing') {
        this.PRStatusCheck('self', () => {
          typeof this.$refs.topicChild.recordFn === 'function' && this.$refs.topicChild.recordFn()
          this.$store.state.PRStatus = 'waiting'
        })
      } else if (this.$store.state.PRStatus === 'recording') {
        this.recorder.stop()
      } else if (this.$store.state.PRStatus === 'scoring') {
        this.PRStatusCheck('tip')
      } else {
        typeof this.$refs.topicChild.recordFn === 'function' && this.$refs.topicChild.recordFn()
      }
    },
    handleToggleScoringTip (val) {
      this.scoringTip = val || false
    },
    handlePRStopStatus (val) {
      this.doPRStop = val || false
    },
    handleRecord (coreType, refText, params) {
      if (this.$store.state.PRStatus === 'waiting') return false
      this.$store.state.PRStatus = 'waiting'
      this.listenStatus = 1
      this.recordStatus = 2

      let serverParams = this.handleRecordCore(coreType, refText, params)
      let _sp = serverParams.serverParams
      if (this.currentTopicType === '49') {
        this.$set(this.detailScore[this.currentPartIndx][this.currentQuestionIdx].audioAnswerList[0], 'coreType', _sp.coreType)
      } else if (this.currentTopicType === '22') {
        this.detailScore[this.currentPartIndx][this.currentQuestionIdx].audioAnswerList.forEach((aal, i) => {
          this.$set(aal, 'coreType', _sp.coreType)
        })
      } else {
        console.log(this.detailScore)
        this.$set(this.detailScore[this.currentPartIndx][this.currentQuestionIdx].audioAnswerList[this.currentOptionIdx], 'coreType', _sp.coreType)
      }

      this.recorder.record(Object.assign({}, serverParams, {
        onRecordIdGenerated: (code, message) => {
          this.lastRecordId = message.recordId
        },
        onStart: () => {
          this.$store.state.PRStatus = 'recording'
          this.listenStatus = 1
          this.recordStatus = 2
          this.isRecordOver = false
        },
        onStop: () => {
          this.initPRBtn(1, 1, 1)
          if (this.doPRStop) {
            this.$store.state.PRStatus = 'scoring'
            this.handleGetScore(this.$refs.topicChild.scoreFn)
          } else {
            this.$store.state.PRStatus = 'idle'
            this.doPRStop = true
          }
        }
      }))
    },
    handleClickListen () {
      this.doPRStop = true
      if (this.$store.state.PRStatus === 'waiting') {
        return false
      } else if (this.$store.state.PRStatus === 'playing') {
        if (this.listenStatus !== 2) {
          this.PRStatusCheck('', () => {
            this.$store.state.PRStatus = 'playing'
            typeof this.$refs.topicChild.playFn === 'function' && this.$refs.topicChild.playFn()
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
        typeof this.$refs.topicChild.playFn === 'function' && this.$refs.topicChild.playFn()
      }
    },
    handlePause () {
      this.$store.state.PRStatus = 'waiting'
      this.listenStatus = 1
      this.player.stop()
      this.$refs.topicChild && typeof this.$refs.topicChild.pauseFn === 'function' && this.$refs.topicChild.pauseFn()
    },
    handlePlay (url, stopcallback) {
      let _url
      let position = ''
      let duration = ''

      this.$store.state.PRStatus = 'waiting'

      if (url instanceof Array) _url = url.shift()
      else if (!url) {
        console.log('加载音频失败，请检查音频地址是否正确，网络连接是否正常。')
        return false
      } else _url = url

      if (_url instanceof Object) {
        console.log(_url)
        position = _url.position || 0
        duration = _url.duration || 0
        _url = _url.url
      }

      this.player.load({
        url: _url.replace(/([^:])\/\//g, '$1/'),
        success: () => {
          if (this.currentTopicType !== '22') this.listenStatus = 2
          this.recordStatus = 1

          let _tmp = {}
          if (typeof position === 'number' && position >= 0) _tmp.position = position
          if (typeof duration === 'number' && duration >= 0) _tmp.duration = duration

          this.player.play(Object.assign({}, _tmp, {
            onStart: () => {
              this.$store.state.PRStatus = 'playing'
              if (this.currentTopicType !== '22') this.listenStatus = 2
              this.recordStatus = 1
            },
            onStop: () => {
              if (this.doPRStop && this.$store.state.PRStatus === 'playing') {
                this.$store.state.PRStatus = 'idle'
                this.initPRBtn(1)
                typeof stopcallback === 'function' && stopcallback()
              }
              this.doPRStop = true
            }
          }))
        },
        error: () => {
          this.$store.state.PRStatus = 'idle'
          this.playErrorNum++
          if (this.playErrorNum < 2) {
            this.handleToast({
              isShow: true,
              type: 'noIcon',
              text1: 'ヾ(•ω•`。) ',
              text2: '没有找到标准音，请直接开始练习'
            }) // 加载音频失败
            this.handlePlay(url, stopcallback)
          } else { // 继续做
            this.playErrorNum = 0
            stopcallback()
          }
          this.listenStatus = 1
          console.log('加载音频失败，请检查音频地址是否正确，网络连接是否正常。')
        }
      })
    },
    handleClickReplay () {
      if (this.replayStatus !== 0) {
        if (this.$store.state.PRStatus === 'waiting') {
          return false
        } else if (this.$store.state.PRStatus === 'playing') {
          if (this.replayStatus !== 2) {
            this.PRStatusCheck('', () => {
              this.handleReplayPlay()
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
          if (this.replayStatus === 3) {
            this.handleReplayPlay()
          }
        }
      }
    },
    handleReplayPlay () {
      this.$store.state.PRStatus = 'idle'
      if (typeof this.$refs.topicChild.replayFn === 'function') {
        this.$store.state.PRStatus = 'playing'
        this.listenStatus = 1
        this.recordStatus = 1
        this.replayStatus = 2
        typeof this.$refs.topicChild.initReplayFn === 'function' && this.$refs.topicChild.initReplayFn()
        this.$refs.topicChild.replayFn()
      } else if (this.currentAudio) {
        this.$store.state.PRStatus = 'playing'
        this.listenStatus = 1
        this.recordStatus = 1
        this.replayStatus = 2
        this.$refs.replayBox.currentTime = 0
        this.$refs.replayBox.play()
      }
    },
    handleReplayPause () {
      const question = this.list[this.currentPartIndx].topicList[this.currentQuestionIdx]
      this.$store.state.PRStatus = 'idle'
      if (question.done && question.done[this.currentOptionIdx] && typeof question.score[this.currentOptionIdx] === 'number') {
        this.handleReplayEnded()
      }
      this.$refs.replayBox && this.$refs.replayBox.pause()
    },
    handleReplayEnded () {
      this.$store.state.PRStatus = 'idle'
      this.listenStatus = 1
      this.recordStatus = 1
      if (this.replayStatus !== 4) this.replayStatus = 3
    },
    handleReplaySubmit () {
      let _param = typeof this.$refs.topicChild.detailFn === 'function' ? this.$refs.topicChild.detailFn() : {}
      this.handleSetDetail(_param)
      this.examResult = true
      this.handlePause()
      this.$store.state.PRStatus = 'idle'
      this.replayStatus = 3
    },
    handleAbandonScore () {
      this.isOverTime = false
      clearTimeout(this.waitTimeout)
    },
    handleGetScore (cb) {
      this.$store.state.PRStatus = 'scoring'

      this.isOverTime = false
      this.waitTimeout = setTimeout(() => {
        this.$store.state.PRStatus = 'idle'
        this.scoringTip = false
        this.isOverTime = true
        typeof cb === 'function' && cb('', '', this.lastRecordId, '', 'timeout')
        this.handleToast({
          isShow: true,
          img: 'net',
          text1: '网络不稳定，请检查后再试',
          text2: '错误码：TIME_OUT'
        })
      }, 20 * 1000)

      this.recorder.getScores({
        recordId: this.lastRecordId,
        success: (data) => {
          try {
            if (this.isOverTime) return
            else clearTimeout(this.waitTimeout)

            this.$store.state.PRStatus = 'idle'
            this.scoringTip = false

            let _data = data[this.lastRecordId]
            if (_data) {
              if (_data.errId || _data.result.errID) {
                let errId = _data.errId || _data.result.errID
                this.handleRecordErr(errId)
                typeof cb === 'function' && cb('', '', this.lastRecordId, '', errId)
              } else {
                let recordId = _data.uuid
                let result = _data.result
                this.currentAudio = _data.audioUrl ? _data.audioUrl.replace(/(^(https?:\/\/)?)([^:/]*)((:[0-9]*)?)(\/[^.]*)(.mp3)?$/, 'https://$3$6.mp3') : ''

                this.recordErrCount = 0

                if (['28', '42', '45', '48'].indexOf(this.currentTopicType) >= 0) {
                  if ([20000, 20002].indexOf(_data.result.recscore.status_code) >= 0) {
                    this.score = Math.round(_data.result.conf)
                  } else {
                    this.score = 0
                  }
                } else {
                  this.score = Math.round(_data.result.overall)
                }

                if (this.score < 0) {
                  this.handleToast({ // 负分提示
                    isShow: true,
                    type: 'noIcon',
                    text1: 'ヾ(•ω•`。) ',
                    text2: '评分异常，请重试或联系客服'
                  })
                } else if (['27', '39', '22', '28', '45'].indexOf(this.currentTopicType) < 0 && this.score === 0) {
                  this.handleToast({ // 0分提示
                    isShow: true,
                    type: 'noIcon',
                    text1: '〒▽〒',
                    text2: '本次录音不理想，请重新录音'
                  })
                }

                typeof cb === 'function' && cb(this.score, this.currentAudio, recordId, result, '')

                if (this.showTimeFlag) {
                  this.examResult = true
                  this.$store.state.examResultShowScoreDetail = true
                  let _param = typeof this.$refs.topicChild.detailFn === 'function' ? this.$refs.topicChild.detailFn() : {}
                  this.handleSetDetail(_param)
                }
              }
            } else {
              console.info('no _data')
              console.info(data)
              console.info(this.lastRecordId)
            }
          } catch (e) {
            console.info(e)
            this.wpDCfg = {
              cancel: 'false',
              icon: '/static/images/practice/exam/ic_frame02.png',
              text1: this.pname + '评分机器人繁忙，请稍后再试',
              text2: '无法解析',
              btn1: '我知道了',
              callback1: () => {
                this.isShowWarning = false
              },
            }
            this.isShowWarning = true
          }
        }
      })
    },
    handleRecordErr (errId) {
      let _logParams = {
        action: '/errors/assessmentCrash',
        logType: 0,
        pushParam: Object.assign({}, this.pushParam, {
          errorId: errId,
          topicId: this.list[this.currentPartIndx].topicList[this.currentQuestionIdx].topicID,
          msg: '练习id为' + this.list[this.currentPartIndx].topicList[this.currentQuestionIdx].topicID + '的测评，系统反馈：'
        })
      }

      if (errId === 2) {
        _logParams.pushParam.msg += '没有检测到语音（' + errId + '）'
        this.handleToast({
          isShow: true,
          img: 'mic',
          text1: '哎~没听到你的声音呀~',
          text2: '错误码：' + errId
        })
      } else if (errId === 10000 || errId === 10004) {
        this.recordErrCount++
        if (this.recordErrCount >= 2) {
          this.handleErrTwice()
        } else {
          _logParams.pushParam.msg += '音频数据为0（' + errId + '）'
          this.handleToast({
            isShow: true,
            img: 'mic',
            text1: 'hi，请检查麦克风后重试~',
            text2: '错误码：' + errId
          })
        }
      } else if (errId === 10006) {
        _logParams.pushParam.msg += '音频质量偏差（' + errId + '）'
        this.handleToast({
          isShow: true,
          img: 'headset',
          text1: 'hi，没听清哦，请再试一遍吧~~',
          text2: '错误码：' + errId
        })
      } else if (errId === 41030) {
        _logParams.pushParam.msg += '并发满了（' + errId + '）'
        this.handleToast({
          isShow: true,
          img: 'net',
          text1: '网络不稳定，请检查后再试~',
          text2: '错误码：' + errId
        })
      } else if (errId === 60010 || errId === 61016) {
        _logParams.pushParam.msg += '评分超时（' + errId + '）'
        this.handleToast({
          isShow: true,
          img: 'net',
          text1: '网络不稳定，请检查后再试~',
          text2: '错误码：' + errId
        })
      } else if (errId === 40092) {
        _logParams.pushParam.msg += '传输的音频时长超限（' + errId + '）'
        this.handleToast({
          isShow: true,
          img: 'net',
          text1: '呀！录音时间太长啦~，请再试一遍吧',
          text2: '错误码：' + errId
        })
      } else if (errId === 51001) {
        _logParams.pushParam.msg += '音频问题（' + errId + '）'
        this.handleToast({
          isShow: true,
          img: 'net',
          text1: '网嗯，刚才的音频有点问题，请再试一遍吧~',
          text2: '错误码：' + errId
        })
      } else if (errId === 51000 || errId === 5) {
        _logParams.pushParam.msg += '评分文本不正确（' + errId + '）'
        this.wpDCfg = {
          cancel: 'false',
          icon: '/static/images/practice/exam/ic_frame01.png',
          text1: '呀，这个内容有问题，先做下一题吧',
          text2: '错误码：' + errId,
          btn1: '我知道了',
          callback1: () => {
            this.isShowWarning = false
          },
        }
        this.isShowWarning = true
      } else {
        _logParams.pushParam.msg += '（' + errId + '）'
        let errTxt = '评分失败，请联系客服'
        if ([5501, 51002, 52000, 53000, 55200, 55201, 55202].indexOf(errId) > -1) {
          errTxt = this.pname + '评分机器人繁忙，请稍后再试'
        }

        this.wpDCfg = {
          cancel: 'false',
          icon: '/static/images/practice/exam/ic_frame02.png',
          text1: errTxt,
          text2: '错误码：' + errId,
          btn1: '我知道了',
          callback1: () => {
            this.isShowWarning = false
          },
        }
        this.isShowWarning = true
      }

      this.writeLog(_logParams)
    },
    handleShowDetail () {
      this.onOpenExplain()
    },
    handleColorText (score, stresss) {
      let classTmp = ''
      if (score >= this.$config.ScoreLevel.good) {
        classTmp += ' {{colorGood}}'
      } else if (score < this.$config.ScoreLevel.bad) {
        classTmp += ' {{colorBad}}'
      } else {
        classTmp += ' {{colorNormal}}'
      }

      if (stresss === 1) classTmp += ' {{fontBold}}'

      return classTmp.substring(1)
    },
    handleReplaceText (text) {
      var result
      if (text) {
        result = text.replace(
          /\{\{spanWordF\}\}/g, 'span'
        ).replace(
          /\{\{classTpl\}\}/g, 'class'
        ).replace(
          /\{\{spanWord\}\}/g, '</span>'
        ).replace(
          /\{\{colorGood\}\}/g, 'green'
        ).replace(
          /\{\{colorBad\}\}/g, 'red'
        ).replace(
          /\{\{colorNormal\}\}/g, 'grey6'
        ).replace(
          /\{\{fontBold\}\}/g, 'fb'
        ).replace(
          /\{\{supF\}\}/g, '<sup>'
        ).replace(
          /\{\{supB\}\}/g, '</sup>'
        )
        return result
      } else {
        return text
      }
    },
    handleMakeRegExp (char) {
      return new RegExp('(^|[^0-9a-zA-Z>{/])(' + char + ')($|[^0-9a-zA-Z<{]*)', 'i')
    },
    handleReplaceMark (label) {
      label = label.replace(/\(g:1\)/g, '')
      label = label.replace(/,?\s*g:1,?\s*/g, '')
      label = label.replace(/\(t:1\)/g, '  ↑')
      label = label.replace(/(\w+)\s*\([^(]*s:1(,?\s*t:1)?[^)]*\)/g, function (str, $1, $2, $3, $4) {
        return '<span><b> ' + $1 + ' </b>' + ($2 ? '  ↑' : '') + '</span>'
      })
      if (label.indexOf(' ↑') < 0) {
        if (/[.!?]/.test(label.substr(-1))) {
          label = label.substring(0, label.length - 1) + ' ↓' + label.substr(-1)
        } else {
          label = label + ' ↓'
        }
      }

      return label
    },
    handleRenderDetail (datas, sup) {
      let details = datas.attributes ? datas.attributes.details : []
      let match = datas.refText && datas.refText.replace(/\((g:1|s:1|t:1|g:1,s:1|g:1,t:1|s:1,t:1|g:1,s:1,t:1)\)/g, '').replace(/\n/g, ' ')
      let renderText = ''
      let phn = ''

      if (this.ctype === 'word') {
        renderText = '<span class="' + this.handleColorText(details[0].score) + '">' + match + '</span>'

        if (details[0].phone && details[0].phone.length > 0) {
          let stress = details[0].stress ? JSON.parse(JSON.stringify(details[0].stress)) : ''
          let stressIndex = []
          if (stress && stress.length > 0) {
            let stressTmp = 0
            stress.forEach((strs, i) => {
              stressIndex.push(stressTmp)
              stressTmp += strs.char.match(/_/g) ? strs.char.match(/_/g).length + 1 : 1
            })
          }
          phn = '<span style="margin-left:5px;">[</span>'
          for (let i = 0; i < details[0].phone.length; i++) {
            if (stressIndex.indexOf(i) >= 0) {
              let sIdx = stressIndex.indexOf(i)
              let stss = stress[sIdx]
              if (stss.ref === 1) {
                phn += '<span class="' + (stss.score === stss.ref ? 'green' : 'red') + '">\'</span>'
              }
            }
            phn += '<span class="' + this.handleColorText(details[0].phone[i].score) + '">' + window.chivox.EnScoreMap[details[0].phone[i].char] + '</span>'
          }
          phn += '<span>]</span>'
        }
        renderText = this.handleReplaceText(renderText)
        if (sup) renderText += '<sup>' + details[0].score + '</sup>'
        phn = this.handleReplaceText(phn)
      } else if (this.ctype === 'sent') {
        if (details.length > 0) {
          for (let i = 0; i < details.length; i++) {
            if (details[i].type === 1) continue
            let detail = details[i]
            let reg = this.handleMakeRegExp(detail.char)

            match = match.replace(reg, (str, $1, $2, $3) => {
              return $1 + '<{{spanWordF}} {{classTpl}}="' + this.handleColorText(detail.score, detail.stressscore) + '">' + $2 + $3 + '{{spanWord}}'
            })
          }
          match = this.handleReplaceText(match)

          let tag = ''
          if (this.currentTopicType !== '24') { // 单词朗读不需要标注升降调
            let tonescore = details[details.length - 1].tonescore
            if (tonescore === 1) {
              tag = '<span class="' + (/t:1/g.test(datas.refText) ? 'green' : 'red') + '"> ↑ </span>'
            } else {
              tag = '<span class="' + (!/t:1/g.test(datas.refText) ? 'green' : 'red') + '"> ↓ </span>'
            }
          }

          if (/[.!?]/.test(match.substr(-8))) {
            match = match.substring(0, match.length - 8) + tag.replace(/<\/span>/g, ' </span>') + match.substring(match.length - 8, match.length)
          } else {
            match = match + tag
          }
        } else {
          match = '<span>' + match + '</span>'
        }
        renderText = match + (sup ? '<sup>' + datas.score + '</sup>' : '')
      } else if (this.ctype === 'pred') {
        if (details.length > 0) {
          let matchtmp = match
          for (let i = 0; i < details.length; i++) {
            try {
              // let reg = new RegExp(details[i].text.replace(/-/g, ' ').replace(/(\?|,|\.|!|'|"|:)/g, '\\s*\\$&\\s*'), 'ig')
              let _content = ''

              for (let j = 0; j < details[i].words.length; j++) {
                let word = details[i].words[j]
                let reg = this.handleMakeRegExp(word.text)

                matchtmp = matchtmp.replace(reg, (str, $1, $2, $3) => {
                  if (/,|'|"|\.|\?|!|-/.test($3)) {
                    _content += $1 + '<{{spanWordF}} {{classTpl}}="' + this.handleColorText(word.score) + '">' + $2 + $3 + '{{spanWord}}'
                  } else {
                    _content += $1 + '<{{spanWordF}} {{classTpl}}="' + this.handleColorText(word.score) + '">' + $2 + '{{spanWord}}' + $3
                  }
                  return ''
                })
              }
              console.info(matchtmp)
              _content = this.handleReplaceText(_content)
              console.info(_content)
              renderText += _content + (sup ? '<sup>' + details[i].score + '</sup>' : '') + ' '
              console.info(renderText)
            } catch (e) {
              console.log(e)
            }
          }
        } else {
          renderText = '<span class="red">' + match + '</span>'
        }
      } else if (this.ctype === 'hitalk') {
        if (datas.attributes) {
          if (datas.attributes.recscore.status_code === 20000) {
            match = datas.attributes.rec
            if (details.length > 0) {
              for (var i = 0; i < details.length; i++) {
                var detail = details[i]
                var reg = this.handleMakeRegExp(detail.char)

                match = match.replace(reg, (str, $1, $2, $3) => {
                  return $1 + '<{{spanWordF}} {{classTpl}}="' + this.handleColorText(detail.score) + '">' + $2 + $3 + '{{spanWord}}'
                })
              }
              match = this.handleReplaceText(match)
            } else {
              match = '<span>' + match + '</span>'
            }
            renderText = match
          } else {
            renderText = '此题回答不正确'
          }
        } else {
          renderText = '此题未作答'
        }
      } else if (this.ctype === 'comm') {
      } else if (this.ctype === 'oesy') {
      } else if (this.ctype === 'scne') {
      }

      return {
        text: renderText,
        phn: phn
      }
    },
    handleToast (params) {
      this.toast = Object.assign({}, params, { isShow: true })
      setTimeout(() => {
        this.$set(this.toast, 'isShow', false)
      }, 3000)
    },
  },
  mounted () {
    this.avatar = this.$store.state.student.avatar

    this.initRender()

    this.$refs.right.addEventListener('error', (event) => { // 图片加载错误
      if (event.target.tagName.toLowerCase() === 'img') {
        let _logParams = {
          action: '/errors/resource',
          logType: 0,
          pushParam: Object.assign({}, this.pushParam, {
            msg: '下载试卷《' + this.list[this.currentPartIndx].paperName + '》时，获取图片异常，图片地址：' + event.target.src
          })
        }
        this.writeLog(_logParams)
      }
    }, true)

    let videoErrs = ['stalled', 'error']
    videoErrs.forEach((item, i) => { // 视频加载错误
      this.$refs.right.addEventListener(item, (event) => {
        if (event.target.tagName.toLowerCase() === 'video') {
          let _logParams = {
            action: '/errors/resource',
            logType: 0,
            pushParam: Object.assign({}, this.pushParam, {
              msg: '下载试卷《' + this.list[this.currentPartIndx].paperName + '》时，获取视频异常，视频地址：' + event.target.src
            })
          }
          this.writeLog(_logParams)
        }
      }, true)
    })
  }
}
</script>

<style lang="less">
@keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

#stu-practice-exam .right {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .desc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 636px;
    height: 280px;
    // margin: 185px auto 0;

    .name {
      display: flex;
      justify-content: center;
      align-items: center;

      .line {
        width: 20px;
        border-top: 2px solid #21bd73;
      }

      span {
        margin: 0 4px;
        color: #21bd73;
        font-size: 18px;
        font-weight: bold;
        line-height: 30px;
      }
    }

    .remark {
      margin-top: 30px;
      text-align: center;

      p {
        display: inline-block;
        color: #666;
        font-size: 16px;
        text-align: justify;
        line-height: 24px;
      }
    }
  }

  .collect {
    position: absolute;
    top: 0;
    right: 30px;
    z-index: 2;
    width: 30px;
    height: 46px;
    background-image: url("/static/images/practice/icon_collection30x46.png");
    cursor: pointer;

    &:hover {
      background-position-x: -30px;
    }

    &.collected {
      background-position-x: -60px;
    }
  }

  .work-zone {
    width: 100%;
    flex: 1;
    padding: 20px 5px 0 40px;
    display: flex;
    flex-direction: column;

    .question-zone {
      flex: 1;
      padding-top: 10px;
      padding-left: 20px;
      overflow-y: auto;

      .vue-scroll,
      .vuescroll-panel,
      .vuescroll-content {
        display: flex;
        flex: 1;
      }

      .vuescroll-content {
        padding-right: 55px;

        sup {
          color: #999 !important;
          font-size: 12px !important;
        }
      }
    }
  }

  .bottom-zone {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    height: 120px;
    padding-top: 10px;

    .btn-zone {
      position: relative;
      display: flex;
      align-items: center;
      height: 80px;

      .record {
        width: 80px;
        height: 80px;
        margin: 0 45px;
        border-radius: 40px;
        background-image: url("/static/images/practice/exam/record_normal.png");
        cursor: pointer;

        &.recording {
          position: relative;
          &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            width: 80px;
            height: 80px;
            background-image: url("/static/images/practice/exam/record_rotate.png");
            animation: rotate 1s linear infinite;
          }
        }

        &.disabled {
          background-image: url("/static/images/practice/exam/record_disable.png");
        }

        .scoringTip {
          width: 126px;
          padding: 10px;
          position: absolute;
          top: -48px;
          left: 50%;
          margin-left: -63px;
          border-radius: 4px;
          background: rgba(36, 204, 124, 0.8);
          color: #fff;
          font-style: normal;
          font-size: 12px;
          line-height: 18px;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }

      .listen,
      .avatar-and-score {
        width: 60px;
        height: 60px;
        border-radius: 30px;

        audio {
          width: 0px;
          height: 0px;
        }
      }

      .listen {
        background-image: url("/static/images/practice/exam/audio_normal.png");

        &:hover {
          background-image: url("/static/images/practice/exam/audio_hover.png");
          cursor: pointer;
        }

        &.listening {
          background-image: url("/static/images/practice/exam/voice_playing.gif");
        }

        &.disabled {
          background-image: url("/static/images/practice/exam/audio_disable.png");
        }
      }

      .listen-l {
        width: 80px;
        height: 80px;
        margin: 0 45px;
        border-radius: 40px;
        background-image: url("/static/images/practice/exam/audio_normal_80.png");

        &:hover {
          background-image: url("/static/images/practice/exam/audio_hover_80.png");
          cursor: pointer;
        }

        &.listening {
          background-image: url("/static/images/practice/exam/voice_playing_80.gif");
        }

        &.disabled {
          background-image: url("/static/images/practice/exam/audio_disable_80.png");
        }
      }

      &.btn-zone-stssp {
        .listen {
          background-image: url("/static/images/practice/exam/video_normal.png");

          &:hover {
            background-image: url("/static/images/practice/exam/video_hover.png");
            cursor: pointer;
          }

          &.listening {
            background-image: url("/static/images/practice/exam/video_playing.png");
            animation: circle 2s infinite linear;
          }

          &.disabled {
            background-image: url("/static/images/practice/exam/audio_disable.png");
          }
        }
      }

      .avatar-and-score {
        position: relative;
        overflow: hidden;

        .avatar {
          width: 58px;
          height: 58px;
          border-radius: 29px;
          margin: 1px 0 0 1px;
        }

        & > div {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          width: 100%;
          height: 100%;

          &.disabled {
            background-image: url("/static/images/practice/exam/voice_disable.png");
          }

          &.waiting {
            background-image: url("/static/images/practice/exam/score_ing.png");
            animation: rotate 1s linear infinite;
          }

          &.playing {
            background-image: url("/static/images/practice/exam/voice_playing.gif");
            cursor: pointer;
          }

          &.submit {
            background-image: url("/static/images/practice/exam/submit_normal.png");
            cursor: pointer;
          }

          &.score {
            color: #fff;
            font-size: 18px;
            text-align: center;
            line-height: 60px;
            background-color: rgba(255, 153, 00, 0.8);
            border-radius: 50%;
            cursor: pointer;

            &.good {
              background-color: rgba(36, 204, 124, 0.8);
            }

            &.bad {
              background: rgba(255, 102, 102, 0.8)
                url("/static/images/practice/exam/score_bad.png") no-repeat
                center;
            }
          }
        }
      }

      .detail {
        position: absolute;
        right: -100px;
        display: flex;
        align-items: center;

        &:hover {
          cursor: pointer;
          i {
            background-position-x: -20px;
          }
          span {
            color: #21bd73;
          }
        }

        i {
          display: block;
          width: 20px;
          height: 20px;
          background-image: url("/static/images/practice/exam/icon_analyze20x20.png");
        }

        span {
          margin-left: 5px;
          color: #ccc;
          font-size: 14px;
        }
      }
    }

    .next,
    .last {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background-image: url("/static/images/practice/exam/btn_next60x60.png");
      transition: right 300ms linear;
      cursor: pointer;

      &.next:hover {
        right: 15px;
      }

      &.last {
        background-image: url("/static/images/practice/exam/btn_submit60x60.png");
      }
    }

    @keyframes rotate {
      from {
        transform: rotateZ(0);
      }
      to {
        transform: rotateZ(360deg);
      }
    }
  }

  .examToast {
    width: 346px;
    height: 86px;
    display: flex;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    margin: -43px auto 0;
    border-radius: 43px;
    background: rgba(255, 136, 27, 0.8);
    z-index: 100;

    img {
      width: 50px;
      height: 50px;
      margin-right: 16px;
      margin-left: 24px;
    }

    .et-cnt {
      .et-text1 {
        font-size: 16px;
        color: #fff;
        line-height: 26px;
      }

      .et-text2 {
        color: rgba(255, 255, 255, 0.6);
        line-height: 24px;
      }
    }

    &.et-noIcon {
      justify-content: center;
      text-align: center;

      .et-text1 {
        font-size: 20px;
        color: #fff;
        line-height: 30px;
      }

      .et-text2 {
        font-size: 16px;
        color: #fff;
        line-height: 20px;
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 400ms;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>

