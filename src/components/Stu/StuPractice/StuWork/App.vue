<template lang="pug">
  div#MainBoard
    div#stu-practice-work(v-if="currentBoard === 1")
      div.header
        p.head-text {{caption}}
        p.logout(@click="handleLogout()") 退出
      div.stuwork-topic(v-if="process === 'start'")
        Left(v-if='showFullScreen' 
          :work='work'
          :currentSubIndex='currentSubIndex' 
          :data='getResultData'
          :getCurrentIndex='getCurrentSubIndex'
          :type='type'
        )
        div.panel-right(:class='{fullscreen: !showFullScreen}')
          div.main
            component(
              :is='currentView'
              :work='work'
              :data='currentData'
              :player='player'
              :doPlay='doPlay'
              :recorder='recorder'
              :doRecord='doRecord'
              :subIndex='currentSubIndex'
              :getVideoStatus='getVideoStatus'
              :repeatFlag='ldAutoRepeatFlag'
              :autoFlag='autoStartFlag'
              :reciteScoreFlag='reciteScoreFlag'
              :dataPersist='getDataPersistence'
              :setScore='setScore'
              :levelAudio='recordScoreLevelAudio'
              :next='switchTopic'
              :lastTopicFlag='lastTopicFlag'
              ref='topic'
            )
          //显示收起左边面板
          i.icon_collapse(:class='{expand: !showFullScreen}' @click='collapse()')
          Collection(:data='currentData' :work='work' :type='type')
          FeedBack(
            v-if="type !== 'dict'"
            :data='getResultData'
            :type='type'
            :kernel='kernel'
          )
          ScoreAnimation(:resultStatus='resultStatus')
          div.videoPlug(v-if="!(type === 'dict')")
            div.play(v-if='playStatus !== 4' :class="{playing: playStatus === 1, disabled: playStatus === 2, readagain: playStatus === 3}" @click='play()')
            div.record(v-if='recordStatus !== 6' :class="{recording: recordStatus === 1, disabled: recordStatus === 2, recite: recordStatus === 3, re_recite: recordStatus === 4, read_again: recordStatus === 5}" @click='record()')
              RecordingAnimation(:recordStatus='recordStatus' :recordAnimationTime='recordAnimationTime')
            div.replay(v-if='replayStatus !== 4' :class="{playing: replayStatus === 1, disabled: replayStatus === 2}" @click='replay()')
        div.nextTopic(:class="{lastTopic: lastTopicButtonFlag}" @click='switchTopic()')
      Process(
        :process='process'
        :currentIndex='currentIndex'
        :topicList='topicList'
        :getProcess='getProcess'
        :getTopic='getTopic'
      )
      transition(mode='out-in' name='fade')
      div.examToast(v-if='toast.isShow' :class="{etNoIcon: toast.type === 'noIcon', expand: !showFullScreen}")
        img(:src='"/static/images/practice/exam/toast_" + toast.img + ".png"' v-if='toast.type !== "noIcon"')
        div.et-cnt
          p.et-text1 {{ toast.text1 }}
          p.et-text2 {{ toast.text2 }}
      guide(:result="jy_result")
      Dialog(:dialogConfig='wpDCfg' :isShowDialog='isShowWarning')
    Result(
      v-if="currentBoard === 2"
      :score='score'
      :totalTime='resultTotalTime'
      :fantasticNum='fantasticNum'
      :perfectNum='perfectNum'
    )
</template>

<script>
import Topics from './Topic/index' // 题型
import Left from './Left' // 左侧面板
import Process from './Process' // 当前进度
import Collection from './Collection' // 收藏
import FeedBack from './FeedBack' // 录音结果反馈维度
import RecordingAnimation from './RecordingAnimation' // 录音动画效果
import ScoreAnimation from './ScoreAnimation' // 得分反馈动画效果
import Result from './Result' // 结果反馈
import guide from './guide'
import mock from './mock.js'

const audioMissing = `/static/sound/missing.mp3`
const audioMissing2 = `/static/sound/missing2.mp3`
const reciteBadAudio = `/static/sound/reciteBad.mp3` // 背诵不通过
const reciteGoodAudio = `/static/sound/reciteGood.mp3` // 背诵通过
const tryAgainAudio = `/static/sound/feedback_try_again.mp3` // try again
const againAudio = `/static/sound/feedback_level4.mp3` // 0≤N＜55
const goodAudio = `/static/sound/feedback_level3_ding.mp3` // 75≤N＜85
const greatAudio = `/static/sound/feedback_level2_ding.mp3` // 85≤N≤100
const perfectAudio = `/static/sound/feedback_level1_ding.mp3` // 总分100分
const strikeAudio = `/static/sound/feedback_level2_ding.mp3` // 连击
const youSaidAudio = `/static/sound/you_said.mp3`

export default {
  name: 'StuWork',
  props: ['handleErrTwice'],
  components: Object.assign({}, { Left, Process, Collection, FeedBack, RecordingAnimation, ScoreAnimation, Result, guide }, { ...Topics }),
  data () {
    return {
      jy_result: mock,
      worksetId: this.$route.query.worksetId ? this.$route.query.worksetId : '',
      isTask: this.$route.query.isTask ? this.$route.query.isTask : 0,
      layerType: this.$route.query.layerType ? this.$route.query.layerType : '',
      layerId: this.$route.query.layerId ? this.$route.query.layerId : '',
      categoryId: this.$route.query.categoryId ? this.$route.query.categoryId : '',
      teacherId: this.$route.query.teacherId ? this.$route.query.teacherId : '',
      process: '', // start | guide | countdown | loadresourse | loadfail
      currentBoard: 1, // 1 main 2 result
      showFullScreen: true, // 是否显示左侧面板
      recordAnimationTime: 0, // 录音所用时长
      currentView: '', // 加载模块
      currentIndex: 0, // 大题索引
      currentSubIndex: 0, // 小题索引
      topicList: [],
      type: '', // task类型 | 单词 | 句子 | 段落 | 对话 | 听写 | 背诵
      work: '', // 大题
      contents: [], // 大题中小题列表
      caption: '', // 标题文案
      currentData: '', // 当前小题
      getResultData: {}, // 获取录音返回结果
      submitData: {},
      beginDate: '',
      detailScore: [], // 答题结果列表
      addLowScoreList: [], // 加入低分集列表
      totalTime: 0, // 每个task耗时
      resultTotalTime: 0,
      player: this.$store.state.$player,
      recorder: this.$store.state.$recorder,
      recordErrCount: 0,
      playStatus: 0, // 0默认 | 1播放 | 2禁止 | 3重放
      recordStatus: 0, // 0默认 | 1录音 | 2禁止 | 3背诵 | 4重新背诵 | 5再练一次
      replayStatus: 0, // 0默认 | 1回放 | 2禁止
      isOverTime: false, // 超时
      waitTimeout: '',
      toast: {
        isShow: false,
        type: '', // noIcon
        img: '',
        text1: '',
        text2: ''
      },
      kernel: '', // 当前内核
      subTopicIndex: 0, // 对话等小题音频播放
      lastRecordId: '',
      resultStatus: '', // 得分反馈动画效果
      fantasticNum: 0, // 连击个数
      perfectNum: 0, // 100分个数
      ldAutoRepeatFlag: true, // 跟读自动流程控制
      autoStartFlag: true, // 跟读是否自动开始
      reciteScoreFlag: false,
      needCorrectFlag: false,
      lastTopicFlag: false,
      lastTopicButtonFlag: false,
      warningStatus: 0,
      examTipTimeOut: '',
      nextTopicBtnFlag: true,
      allowCallBackFnFlag: true, // 允许播放录音回调
      submitFlag: true,
      submitTaskFlag: false,
      wpDCfg: {
        getCurrentPage: 'WarningPopup',
      },
      isShowWarning: false,
      serverParams: {
        rank: 100,
        precision: 1,
        userId: this.$store.state.student.name,
        attachAudioUrl: 1
      },
      score: 0, // 此次得分
      logParams: { // 埋点
        logType: 0,
        pushParam: {}
      }
    }
  },
  methods: {
    handleLogout () {
      this.warningStatus = 5
    },
    handleHideWarningPopup () {
      if (this.warningStatus === 4) {
        this.countDownTip()
      }
      this.warningStatus = 0
      this.isShowWarning = false
    },
    handleQuitExam () { // 退出测评二次确认
      this.warningStatus = 5
    },
    handleConfirmQuitExam () {
      this.isShowWarning = false
      const pathname = this.$route.query.pathname ? this.$route.query.pathname : 'stuSync'
      if (this.warningStatus === 4 || this.warningStatus === 5) { // 4、十分钟等待 | 5、退出
        this.$router.push({ name: pathname })
      }
    },
    collapse () { // 左边栏收起展开
      this.showFullScreen = !this.showFullScreen
    },
    getProcess (process) {
      this.detailScore[this.currentSubIndex] = Object.assign({}, {})
      this.getOneFromWorkset(process)
    },
    getCurrentSubIndex (index) {
      this.switchTopic(index)
    },
    getVideoStatus (param) {
      this.playStatus = param.playStatus
      this.recordStatus = param.recordStatus
      this.replayStatus = param.replayStatus
    },
    getReciteScoreStatus (flag) {
      this.reciteScoreFlag = flag
    },
    getDataPersistence (param) { // 小题样式数据的持久化
      this.contents[this.currentSubIndex] = Object.assign(this.contents[this.currentSubIndex], param)
    },
    countDownTip (time) { // 十分钟等待
      let currentTime = 0
      if (arguments.length === 0) {
        window.clearTimeout(this.examTipTimeOut)
        currentTime = 600
      } else {
        currentTime = time
      }
      if (currentTime === 0) {
        window.clearTimeout(this.examTipTimeOut)
        this.warningStatus = 4
      } else {
        currentTime--
        this.totalTime++
        this.examTipTimeOut = setTimeout(() => {
          this.countDownTip(currentTime)
        }, 1000)
      }
    },
    sayMissing (callback = () => { }) { // 音频缺失
      this.doPlay(this.type === 'dict' ? audioMissing2 : audioMissing, () => {
        callback()
      })
    },
    reciteBadAudio (callback = () => { }) {
      this.doPlay(reciteBadAudio, () => {
        callback()
      })
    },
    reciteGoodAudio (callback = () => { }) {
      this.doPlay(reciteGoodAudio, () => {
        callback()
      })
    },
    againAudio (callback = () => { }) { // good
      this.resultStatus = 'bad'
      this.doPlay(againAudio, () => {
        callback()
      })
    },
    normalAudio (callback = () => { }) {
      this.resultStatus = 'normal'
      this.doPlay(goodAudio, () => {
        callback()
      })
    },
    goodAudio (callback = () => { }) {
      this.resultStatus = 'good'
      this.doPlay(goodAudio, () => {
        callback()
      })
    },
    greatAudio (callback = () => { }) {
      this.resultStatus = 'great'
      this.doPlay(greatAudio, () => {
        callback()
      })
    },
    perfectAudio (callback = () => { }) {
      if (this.currentSubIndex > 1 && this.detailScore[this.currentSubIndex - 1].score === 100) {
        this.resultStatus = 'fantastic'
        this.fantasticNum++
        this.doPlay(perfectAudio, () => {
          callback()
        })
      } else {
        this.resultStatus = 'prefect'
        this.perfectNum++
        this.doPlay(strikeAudio, () => {
          callback()
        })
      }
    },
    recordScoreLevelAudio (score, callback = () => { }, repeat, subIndex, recordAudioUrl) {
      if (this.type === 'recite') {
        if (score >= 80) {
          this.greatAudio(() => {
            this.reciteGoodAudio(callback)
          })
        } else {
          this.againAudio(() => {
            this.reciteBadAudio(callback)
          })
        }
      } else {
        if (score === this.$config.ScoreLevel.prefect) {
          this.perfectAudio(callback)
        } else if (score >= this.$config.ScoreLevel.great) {
          this.greatAudio(callback)
        } else if (score >= this.$config.ScoreLevel.good) {
          this.goodAudio(callback)
        } else if (score >= this.$config.ScoreLevel.bad) {
          this.normalAudio(callback)
        } else {
          this.needCorrectFlag = true
          if (this.work.practiceType === 'gd') {
            this.againAudio(() => {
              this.correction(callback, repeat, subIndex, recordAudioUrl)
            })
          } else {
            this.againAudio(callback)
          }
        }
      }
    },
    correction (callback = () => { }, repeat, subIndex, recordAudioUrl) { // 纠音
      let stdAudioUrl = ''
      let recordAudio = ''
      if (this.type === 'conv' || (this.type === 'para' && this.work.practiceType === 'gd')) {
        if (this.contents[this.currentSubIndex].content && this.contents[this.currentSubIndex].content.length) {
          stdAudioUrl = this.contents[this.currentSubIndex].content[subIndex].audio
        } else {
          stdAudioUrl = this.contents[this.currentSubIndex].randerContent[subIndex].audio
        }
        recordAudio = recordAudioUrl
      } else {
        stdAudioUrl = this.contents[this.currentSubIndex].audio
        recordAudio = this.detailScore[this.currentSubIndex].recordAudioUrl
      }
      if (repeat <= 2) {
        if (stdAudioUrl) {
          this.doPlay(stdAudioUrl, () => {
            this.doPlay(youSaidAudio, () => {
              this.doPlay(recordAudio, () => {
                this.doPlay(tryAgainAudio, () => {
                  this.needCorrectFlag = false
                  callback()
                })
              })
            })
          })
        } else {
          this.doPlay(youSaidAudio, () => {
            this.doPlay(recordAudio, () => {
              this.doPlay(tryAgainAudio, () => {
                this.needCorrectFlag = false
                callback()
              })
            })
          })
        }
      } else {
        callback()
      }
    },
    setScore (obj) {
      if (this.type === 'dict') {
        this.getResultData = this.detailScore[obj.index] = Object.assign({}, this.detailScore[obj.index], obj)
      } else {
        this.getResultData = this.detailScore[this.currentSubIndex] = Object.assign({}, this.detailScore[this.currentSubIndex], obj)
      }
      if (obj.score < this.$config.ScoreLevel.bad) {
        this.addLowScoreList[this.currentSubIndex] = this.contents[this.currentSubIndex]
        let _logParams = Object.assign(this.logParams, {
          action: '/errors/lowScore55',
          logType: 0,
          pushParam: {
            msg: `作业：${this.logParams.pushParam.practiceName}中 id为${this.detailScore[this.currentSubIndex].id}的作业得分超低`
          }
        })
        this.writeLog(_logParams)
      } else {
        this.addLowScoreList.splice(this.currentSubIndex, 1)
      }
    },
    doPlay (url, callback = () => { }, position, duration) {
      let _url = ''
      if (url instanceof Array) {
        _url = url.shift()
      } else if (!url) {
        console.info('加载音频失败，请检查音频地址是否正确，网络连接是否正常。')
        this.sayMissing(callback)
        let _logParams = Object.assign(this.logParams, {
          action: '/errors/resource',
          logType: 0,
          pushParam: {
            msg: `下载练习《${this.logParams.practiceName}》时，获取音频异常，音频地址：${_url}`
          }
        })
        this.writeLog(_logParams)
        return false;
      } else {
        _url = url
      }
      if (_url instanceof Object) {
        position = _url.position || 0
        duration = _url.duration || 0
        _url = _url.url
        if (!_url) {
          this.sayMissing(callback)
          return false
        }
      }
      if (_url.indexOf('https') < 0) {
        _url = _url.replace(/http/, 'https')
      }
      if (this.submitTaskFlag) return
      this.player.load({
        url: _url,
        success: () => {
          let _tmp = {}
          if (!(position === 0 && duration === 0)) {
            if (position >= 0) _tmp.position = position
            if (duration >= 0) _tmp.duration = duration
          }
          this.player.play(Object.assign({}, _tmp, {
            onStop: () => {
              this.resultStatus = 0
              if (this.allowCallBackFnFlag) {
                callback()
              }
            }
          }))
        }
      })
    },
    doRecord (refText, callback = () => { }, isSpecialWord) {
      let maxtxt = refText.split(' ').length
      let duration = maxtxt * 900 + 2000
      this.recordAnimationTime = `${duration}ms`
      this.serverParams.refText = refText.replace(/<[^>]+\/?>/g, '').trim()
      let _serverParams = Object.assign({}, this.serverParams)
      if (this.type === 'corr') { // 纠音
        _serverParams.coreType = 'en.word.pron'
        this.kernel = 'word'
      } else {
        if (maxtxt === 1) {
          let reg = /[^A-Za-z0-9'-.\s]/g
          _serverParams.coreType = 'en.word.child'
          if (isSpecialWord) {
            _serverParams.textmode = 3
            _serverParams.refText = {
              text: (reg.test(isSpecialWord) ? 'kami' : isSpecialWord) + '(p:1)',
              prons: [[refText.split(',')]]
            }
          }
          this.kernel = 'word'
        } else if (maxtxt >= 2 && maxtxt <= 15) {
          _serverParams.coreType = 'en.sent.child'
          this.kernel = 'sent'
        } else if (maxtxt > 15) {
          _serverParams.coreType = 'en.pred.exam'
          this.kernel = 'pred'
          _serverParams.refText = {
            qid: this.$store.state.student.id,
            lm: refText.replace(/<[^<>]+>/g, ' ').trim()
          }
          _serverParams.client_params = {
            'ext_subitem_rank4': 0,
            'ext_word_details': 1,
            'ext_phn_details': 1
          }
        }
      }
      this.recorder.record({
        duration: duration,
        serverParams: _serverParams,
        onRecordIdGenerated: (code, message) => {
          this.lastRecordId = message.recordId
        },
        onStart: () => {
        },
        onStop: () => {
          this.handleRecordResult(callback)
          if (this.submitTaskFlag) {
            this.submit()
          }
        }
      })
    },
    handleRecordResult (callback) {
      this.recordAnimationTime = ''
      this.recordStatus = 0
      this.isOverTime = false
      clearTimeout(this.waitTimeout)
      this.waitTimeout = setTimeout(() => {
        this.isOverTime = true
        this.handleToast({
          isShow: true,
          img: 'net',
          text1: '网络不稳定，请检查后再试',
          text2: '错误码：TIME_OUT'
        })
      }, 20 * 1000)
      this.recorder.getScores({
        recordId: this.lastRecordId, // 指定的录音ID
        success: (data) => {
          try {
            // 添加超时功能
            if (this.isOverTime) return
            else clearTimeout(this.waitTimeout)
            let _data = data[this.lastRecordId]
            if (_data) {
              if (_data.errId || _data.result.errID) {
                let errId = _data.errId || _data.result.errID
                this.handleRecordErr(errId)
              } else {
                let param = {
                  score: _data.result.overall,
                  audioUrl: _data.audioUrl,
                  details: _data.result.details,
                  fluency: typeof _data.result.fluency === 'number' ? _data.result.fluency : (_data.result.fluency ? _data.result.fluency.overall : 0),
                  integrity: typeof _data.result.integrity === 'number' ? _data.result.integrity : 0,
                  speed: typeof _data.result.fluency === 'number' ? _data.result.fluency : 0,
                  accuracy: typeof _data.result.accuracy === 'number' ? _data.result.accuracy : 0
                }
                if (this.type !== 'recite') {
                  param.practiceType = this.work.practiceType
                }
                if (this.allowCallBackFnFlag) {
                  callback(param)
                }
              }
            } else {
              console.info('录音出错')
            }
          } catch (e) {
            console.info(e)
            this.resultStatus = ''
            this.wpDCfg = {
              cancel: 'false',
              icon: '/static/images/practice/exam/ic_frame02.png',
              text1: '评分机器人繁忙，请稍后再试',
              text2: '无法解析',
              btn1: '我知道了',
              callback1: () => {
                this.isShowWarning = false
              },
              onHide: () => {
                this.isShowWarning = false
              }
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
          topicId: this.contents[this.currentSubIndex].id,
          msg: `练习id为${this.contents[this.currentSubIndex].id}的作业，系统反馈：`
        })
      }
      if (errId === 2) {
        _logParams.pushParam.msg += `没有检测到语音（${errId}）`
        this.handleToast({
          isShow: true,
          img: 'mic',
          text1: '哎~没听到你的声音呀~',
          text2: '错误码：' + errId
        })
      } else if (errId === 10000 || errId === 10004) {
        this.recordErrCount++
        if (this.recordErrCount >= 2) {
          this.player.stop()
          this.recorder.stop()
          this.handleErrTwice()
        }
      } else if (errId === 10006) {
        _logParams.pushParam.msg += `音频质量偏差（${errId}）`
        this.handleToast({
          isShow: true,
          img: 'headset',
          text1: 'hi，没听清哦，请再试一遍吧~~',
          text2: '错误码：' + errId
        })
      } else if (errId === 41030) {
        _logParams.pushParam.msg += `并发满了（${errId}）`
        this.handleToast({
          isShow: true,
          img: 'net',
          text1: '网络不稳定，请检查后再试~',
          text2: '错误码：' + errId
        })
      } else if (errId === 60010 || errId === 61016) {
        _logParams.pushParam.msg += `评分超时（${errId}）`
        this.handleToast({
          isShow: true,
          img: 'net',
          text1: '网络不稳定，请检查后再试~',
          text2: '错误码：' + errId
        })
      } else if (errId === 40092) {
        _logParams.pushParam.msg += `传输的音频时长超限（${errId}）`
        this.handleToast({
          isShow: true,
          img: 'net',
          text1: '呀！录音时间太长啦~，请再试一遍吧',
          text2: '错误码：' + errId
        })
      } else if (errId === 51001) {
        _logParams.pushParam.msg += `音频问题（${errId}）`
        this.handleToast({
          isShow: true,
          img: 'net',
          text1: '网嗯，刚才的音频有点问题，请再试一遍吧~',
          text2: '错误码：' + errId
        })
      } else if (errId === 51000 || errId === 5) {
        _logParams.pushParam.msg += `评分文本不正确（${errId}）`
        this.wpDCfg = {
          cancel: 'false',
          icon: '/static/images/practice/exam/ic_frame01.png',
          text1: '呀，这个内容有问题，先做下一题吧',
          text2: '错误码：' + errId,
          btn1: '我知道了',
          callback1: () => {
            this.isShowWarning = false
          },
          onHide: () => {
            this.isShowWarning = false
          }
        }
        this.isShowWarning = true
      } else {
        _logParams.pushParam.msg += `（${errId}）`
        this.wpDCfg = {
          cancel: 'false',
          icon: '/static/images/practice/exam/ic_frame02.png',
          text1: '评分失败，请联系客服',
          text2: '错误码：' + errId,
          btn1: '我知道了',
          callback1: () => {
            this.isShowWarning = false
          },
          onHide: () => {
            this.isShowWarning = false
          }
        }
        this.isShowWarning = true
      }
      this.writeLog(_logParams)
    },
    handleToast (params) {
      this.toast = Object.assign({}, params, { isShow: true })
      setTimeout(() => {
        this.$set(this.toast, 'isShow', false)
      }, 3000)
    },
    initPlayStatus (callback = () => { }) {
      this.player.stop()
      this.recorder.stop()
      if (this.playStatus === 2) {
        return false
      }
      if (this.recordStatus === 1) {
        this.recordStatus = 0
      }
      if (this.replayStatus === 1) {
        this.replayStatus = 0
      }
      if (this.playStatus === 1) {
        this.playStatus = 0
        this.player.stop()
      } else if (this.playStatus === 0) {
        if (this.allowCallBackFnFlag) {
          this.allowCallBackFnFlag = false
          setTimeout(() => {
            this.playStatus = 1
            this.allowCallBackFnFlag = true
            callback()
          }, 700);
        } else {
          this.playStatus = 1
          this.allowCallBackFnFlag = true
          callback()
        }
      }
    },
    initRecordStatus (callback = () => { }) {
      this.player.stop()
      if (this.recordStatus === 2) {
        return false
      }
      if (this.playStatus === 1) {
        this.playStatus = 0
        setTimeout(() => {
          this.recordStatus = 1
          this.allowCallBackFnFlag = true
          callback()
        }, 700)
      } else if (this.replayStatus === 1) {
        this.replayStatus = 0
        setTimeout(() => {
          this.recordStatus = 1
          this.allowCallBackFnFlag = true
          callback()
        }, 700)
      } else {
        if (this.recordStatus === 1) {
          this.recordStatus = 0
          this.recorder.stop()
        } else if (this.recordStatus === 0) {
          if (this.allowCallBackFnFlag) {
            this.allowCallBackFnFlag = false
            setTimeout(() => {
              this.recordStatus = 1
              this.allowCallBackFnFlag = true
              callback()
            }, 700);
          } else {
            this.recordStatus = 1
            this.allowCallBackFnFlag = true
            callback()
          }
        }
      }
    },
    initReplayStatus (callback = () => { }) {
      this.player.stop()
      this.recorder.stop()
      if (this.replayStatus === 2) {
        return false
      }
      if (this.recordStatus === 1) {
        this.recordStatus = 0
      }
      if (this.playStatus === 1) {
        this.playStatus = 0
      }
      if (this.replayStatus === 1) {
        this.replayStatus = 0
        this.player.stop()
      } else if (this.replayStatus === 0) {
        if (this.allowCallBackFnFlag) {
          this.allowCallBackFnFlag = false
          setTimeout(() => {
            this.replayStatus = 1
            this.allowCallBackFnFlag = true
            callback()
          }, 700);
        } else {
          this.replayStatus = 1
          this.allowCallBackFnFlag = true
          callback()
        }
      }
    },
    play () {
      this.ldAutoRepeatFlag = false
      this.subTopicIndex = 0
      if (this.playStatus === 2) {
        return false
      } else if (this.playStatus === 3) { // readagain
        this.player.stop()
        this.recorder.stop()
        this.allowCallBackFnFlag = true
        this.playStatus = 1
        if (this.replayStatus === 1) {
          this.replayStatus = 0
        }
        setTimeout(() => {
          this.doPlay(this.contents[this.currentSubIndex].audio, () => {
            this.playStatus = 3
          })
        }, 500)
      } else {
        this.initPlayStatus(() => {
          if (this.type === 'conv') {
            if (this.recordStatus === 5) {
              this.subTopicIndex = 0
              let playAudio = ''
              if (this.contents[this.currentSubIndex].content && this.contents[this.currentSubIndex].content.length) {
                playAudio = this.contents[this.currentSubIndex].content[this.subTopicIndex].audio
              } else {
                playAudio = this.contents[this.currentSubIndex].randerContent[this.subTopicIndex].audio
              }
              this.doPlay(playAudio, this.playEvent)
            }
          } else {
            this.doPlay(this.contents[this.currentSubIndex].audio, () => {
              // this.record()
              this.playStatus = 0
            })
          }
        })
      }
    },
    playEvent () {
      if (this.playStatus === 1) {
        this.subTopicIndex++
        let playAudio = ''
        let currentLength = ''
        if (this.contents[this.currentSubIndex].content && this.contents[this.currentSubIndex].content.length) {
          playAudio = this.contents[this.currentSubIndex].content[this.subTopicIndex].audio
          currentLength = this.contents[this.currentSubIndex].content.length
        } else {
          playAudio = this.contents[this.currentSubIndex].randerContent[this.subTopicIndex].audio
          currentLength = this.contents[this.currentSubIndex].randerContent.length
        }
        if (this.subTopicIndex === currentLength - 1) {
          this.doPlay(playAudio, () => {
            this.playStatus = 0
          })
        } else {
          this.doPlay(playAudio, this.playEvent)
        }
      }
    },
    record () {
      if (this.recordStatus === 2) { // disabled
        return false
      }
      this.ldAutoRepeatFlag = true
      this.subTopicIndex = 0
      this.player.stop()
      if (this.type === 'recite') {
        if (this.recordStatus === 3) { // 开始背诵
          this.$refs.topic.startRecite()
        } else if (this.recordStatus === 4) { // 重新背诵
          this.$refs.topic.reRecite()
        } else {
          this.initRecordStatus(() => {
            this.doRecord(this.contents[this.currentSubIndex].content, this.$refs.topic.getScore)
          })
        }
      } else if (this.type === 'conv') {
        if (this.recordStatus === 5) { // 重做一次
          this.ldAutoRepeatFlag = true
          this.$refs.topic.doAgain()
        } else {
          this.initRecordStatus(() => {
            let text = this.$refs.topic.recordText()
            this.doRecord(text, this.$refs.topic.getScore)
          })
        }
      } else {
        if (this.type === 'para') {
          if (this.recordStatus === 5) { // 重做一次
            this.ldAutoRepeatFlag = true
            this.$refs.topic.doAgain()
          } else {
            let text = this.$refs.topic.recordText()
            this.initRecordStatus(() => {
              this.doRecord(text, this.$refs.topic.getScore)
            })
          }
        } else {
          this.initRecordStatus(() => {
            this.doRecord(this.contents[this.currentSubIndex].content, this.$refs.topic.getScore)
          })
        }
      }
    },
    replay () {
      this.ldAutoRepeatFlag = false
      this.subTopicIndex = 0
      let replayAudio = ''
      if (this.replayStatus === 2) {
        return false
      } else {
        this.initReplayStatus(() => {
          if (this.type === 'conv' || (this.type === 'para' && this.work.practiceType === 'gd')) {
            replayAudio = this.detailScore[this.currentSubIndex].resultDetail[this.subTopicIndex].recordAudioUrl
            if (this.detailScore[this.currentSubIndex].resultDetail.length > 1) {
              this.doPlay(replayAudio, this.replayEvent)
            } else {
              this.doPlay(replayAudio, () => {
                this.replayStatus = 0
              })
            }
          } else {
            replayAudio = this.detailScore[this.currentSubIndex].recordAudioUrl
            this.doPlay(replayAudio, () => {
              this.replayStatus = 0
            })
          }
        })
      }
    },
    replayEvent () {
      if (this.replayStatus === 1) {
        this.subTopicIndex++
        let replayAudio = this.detailScore[this.currentSubIndex].resultDetail[this.subTopicIndex].recordAudioUrl
        if (this.subTopicIndex === this.detailScore[this.currentSubIndex].resultDetail.length - 1) {
          this.doPlay(replayAudio, () => {
            this.replayStatus = 0
          })
        } else {
          this.doPlay(replayAudio, this.replayEvent)
        }
      }
    },
    handleSwitchTopic (callback = () => { }, index) { // 切题处理
      let text = ''
      let showToast = false
      if (this.recordStatus === 1) {
        showToast = true
        text = '正在评分，请稍后'
        setTimeout(() => {
          this.ldAutoRepeatFlag = false
          this.recorder.stop()
        }, 1000)
      } else {
        this.allowCallBackFnFlag = false
        this.player.stop()
        if (this.currentSubIndex === this.contents.length - 1) {
          showToast = true
          this.lastTopicFlag = true
          if (index >= 0) {
            text = '正在切题，请稍后'
          } else {
            text = '正在提交，请稍后'
          }
        } else {
          this.lastTopicFlag = false
          text = '正在切题，请稍后'
        }
        if (this.work.practiceType === 'gd') {
          if (this.playStatus === 1) {
            showToast = true
            this.playStatus = 0
          }
          if (this.replayStatus === 1) {
            showToast = true
            this.replayStatus = 0
          }
          if (this.needCorrectFlag) {
            showToast = true
            this.needCorrectFlag = false
          }
          if (this.nextTopicBtnFlag) {
            this.nextTopicBtnFlag = false
            setTimeout(() => {
              callback()
              this.nextTopicBtnFlag = true
            }, 1000)
          }
        } else if (this.work.practiceType === 'ld') {
          let flag = true
          if (this.playStatus === 1) {
            showToast = true
            flag = false
            this.playStatus = 0
          }
          if (this.replayStatus === 1) {
            showToast = true
            flag = false
            this.replayStatus = 0
          }
          if (this.currentSubIndex === this.contents.length - 1) flag = false
          if (this.nextTopicBtnFlag) {
            this.nextTopicBtnFlag = false
            setTimeout(() => {
              callback()
              this.nextTopicBtnFlag = true
            }, flag ? 100 : 1000)
          }
        } else {
          if (this.type === 'dict') showToast = false
          if (this.nextTopicBtnFlag) {
            this.nextTopicBtnFlag = false
            setTimeout(() => {
              callback()
              this.nextTopicBtnFlag = true
            }, 1000)
          }
        }
      }
      if (showToast) {
        this.$toast({
          text: text,
          showWrap: false,
          duration: 1000,
          showLayer: true,
          styleObj: {
            'width': '200px',
            'height': '50px',
            'border-radius': '25px',
            'margin-left': `${this.showFullScreen ? '100px' : '0px'}`,
            'background-color': 'rgba(255,136,27,0.8)'
          }
        })
      }
    },
    switchTopic (index) {
      if (!this.submitFlag) {
        return false
      }
      if (index >= 0 && index === this.currentSubIndex) {
        return false
      }
      if (!this.nextTopicBtnFlag) {
        return false
      } else {
        this.handleSwitchTopic(() => {
          this.countDownTip()
          if (index !== undefined && index >= 0) {
            this.currentSubIndex = index
            if (index === this.contents.length - 1) {
              this.lastTopicButtonFlag = true
            } else {
              this.lastTopicButtonFlag = false
            }
          } else {
            if (this.currentSubIndex === this.contents.length - 1) { // 最后一题，提交
              this.lastTopicButtonFlag = true
              this.nextTopicBtnFlag = false
              this.allowCallBackFnFlag = false
              this.submitFlag = false
              this.player.stop()
              this.recorder.stop()
              if (this.recordStatus === 1) {
                this.ldAutoRepeatFlag = false
                this.submitTaskFlag = true
                this.recorder.stop()
              } else {
                if (this.type === 'dict') {
                  this.$nextTick(() => {
                    this.$refs.topic.judgeAnswer()
                  })
                }
                this.submit()
              }
            } else {
              if (this.type === 'dict') {
                this.$nextTick(() => {
                  this.$refs.topic.judgeAnswer()
                })
              }
              this.currentSubIndex++
              if (this.currentSubIndex === this.contents.length - 1) {
                this.lastTopicButtonFlag = true
              } else {
                this.lastTopicButtonFlag = false
              }
            }
          }
          this.handleStatus()
        }, index)
      }
    },
    handleStatus () {
      this.currentData = this.contents[this.currentSubIndex]
      if (this.type !== 'dict') {
        this.getResultData = this.detailScore[this.currentSubIndex]
      }
      if (this.detailScore[this.currentSubIndex].score >= 0) {
        this.ldAutoRepeatFlag = false
        this.autoStartFlag = false
      } else {
        this.ldAutoRepeatFlag = true
        this.autoStartFlag = true
      }
    },
    submit () {
      let sumScore = 0
      let average = 0
      if (this.detailScore.length > 0) {
        this.detailScore.forEach((value, idx) => {
          if (this.type === 'recite') {
            if (value.complete) {
              if (Number(value.score) >= 0) {
                sumScore += Number(value.score)
              }
            } else {
              this.detailScore[idx] = {
                content: this.contents[idx].content,
                stdAudioUrl: this.contents[idx].audio,
                recordAudioUrl: '',
                id: value.id
              }
            }
          } else {
            if (Number(value.score) >= 0) {
              sumScore += Number(value.score)
            }
          }
        })
        average = Math.round(sumScore / this.detailScore.length)
      }
      this.submitData = {
        workId: this.work.workId,
        taskId: this.work.taskId,
        score: average,
        detailScore: JSON.stringify(this.detailScore),
        fantasticNum: this.fantasticNum,
        beginDate: this.beginDate,
        perfectNum: this.perfectNum,
        isTask: this.isTask, // 是否是自学
        layerType: this.layerType,
        layerId: this.layerId,
        categoryId: this.categoryId,
        teacherId: this.teacherId,
        bookId: this.work.bookId || '',
        unitId: this.work.unitId || '',
        unitName: this.work.unitName || '',
        sectionId: this.work.sectionId || '',
        sectionName: this.work.sectionName || '',
        sectionIndex: this.work.sectionIndex,
        contentType: this.work.contentType,
        practiceType: this.work.practiceType,
        doneSec: this.totalTime
      }
      window.clearTimeout(this.examTipTimeOut)
      this.resultTotalTime += this.totalTime
      this.handleLowScore()
      if (Number(this.submitData.isTask) === 0) { // 自主学习
        this.submitData.selfLearnId = this.worksetId
        this.submitData.isLast = this.work.isLast
        this.submitData.bookCover = this.work.bookCover
        this.submitData.estimateMin = this.work.estimateMin
      } else {
        this.submitData.worksetId = this.worksetId
      }
      this.$ajax.post('/records/addOneTaskRecord', this.submitData, (res) => {
        this.totalTime = 0
        if (res.status === 1) {
          this.submitFlag = true
          this.submitTaskFlag = false
          if (this.currentIndex < this.topicList.length - 1) {
            this.currentSubIndex = 0
            this.currentIndex++
            this.getOneFromWorkset('countdown')
          } else {
            this.score = average
            this.currentBoard = 2
          }
        } else {
          let _logParams = Object.assign({}, this.logParams, {
            action: '/errors/assessmentSubmit',
            pushParam: {
              msg: `提交作业（${this.logParams.pushParam.practiceName}）失败`
            }
          })
          this.writeLog(_logParams)
          alert('提交作业失败')
        }
        this.handleStatus()
      })
    },
    handleLowScore () {
      let contentType = ''
      switch (this.type) {
        case 'word':
          contentType = 1;
          break;
        case 'sent':
          contentType = 2;
          break;
        case 'para':
          contentType = 3;
          break;
        case 'conv':
          contentType = 4;
          break;
        case 'dict':
          contentType = 1;
          break;
        case 'recite':
          contentType = 3;
          break;
      }
      this.contents.forEach((val, index) => {
        if (this.detailScore[index].score === '' || this.detailScore[index].score === undefined || this.detailScore[index].score === null) {
          this.addLowScoreList[index] = val
        } else if (this.detailScore[index].score >= 0 && this.detailScore[index].score < 55) {
          this.addLowScoreList[index] = val
        }
      })
      if (this.addLowScoreList.length) {
        for (let i = 0; i < this.addLowScoreList.length; i++) {
          if (!this.addLowScoreList[i] || this.addLowScoreList[i] === null || this.addLowScoreList[i] === '' || this.addLowScoreList[i] === undefined) {
            this.addLowScoreList.splice(i, 1)
            i = i - 1
          }
        }
        this.$ajax.post('/wrongs/addLowScore', {
          contentType: contentType,
          bookId: this.work.bookId || '',
          unitId: this.work.unitId || '',
          sectionId: this.work.sectionId || '',
          practiceType: this.work.practiceType,
          worksetId: this.worksetId,
          wrongList: JSON.stringify(this.addLowScoreList)
        }, (res) => {
          if (res.status === 1) {
            this.addLowScoreList = []
          }
        })
      }
    },
    getTopic () { // 获取topic
      let reqParam = {
        wsId: this.worksetId,
        isTask: this.isTask,
      }
      if (Number(this.$route.query.isPracticeOver) === 1) {
        reqParam.isPractice = true
      }
      this.$ajax.post('/tasks/getTaskListByWSId', reqParam, (res) => {
        if (res.status === 1) {
          if (res.data.length > 0) {
            this.topicList = res.data
            this.currentBoard = 1
            this.process = 'loading'
          }
        } else {
          this.process = 'loadfail'
        }
      })
    },
    setList () {
      this.detailScore = []
      if (this.type === 'conv') {
        this.contents.forEach((value, index) => {
          let resultDetail = []
          value.content.forEach((val, i) => {
            resultDetail[i] = {
              role: val.role,
              content: val.content,
              stdAudioUrl: val.audio
            }
          })
          this.detailScore[index] = {
            content: `dialog${index + 1}`,
            stdAudioUrl: '',
            recordAudioUrl: '',
            id: value.id,
            resultDetail: resultDetail
          }
        })
      } else if (this.type === 'para' && this.work.practiceType === 'gd') {
        this.contents.forEach((value, index) => {
          let resultDetail = []
          value.details.forEach((val, i) => {
            val.label = val.text
            resultDetail[i] = val
          })
          this.detailScore[index] = {
            id: value.id,
            content: value.content,
            stdAudioUrl: value.audio,
            recordAudioUrl: '',
            resultDetail: resultDetail
          }
        })
      } else {
        this.contents.forEach((value, index) => {
          let param = {
            content: value.content,
            stdAudioUrl: value.audio,
            img: value.img ? value.img : '',
            recordAudioUrl: '',
            id: value.id
          }
          if (this.type === 'dict') {
            param.yourAnswer = ''
          }
          if (this.type === 'corr') {
            param.symbol = ''
            param.randerSymbol = ''
          }
          this.detailScore[index] = param
        })
      }
    },
    getOneFromWorkset (process) { // 设置每个task开始状态
      this.$ajax.post('/students/getServerDate', {}, (res) => {
        if (res.status === 1) {
          this.beginDate = res.data
        }
      })
      this.work = this.topicList[this.currentIndex] // 设置当前task的索引
      this.contents = this.work.list // 获取当前所有的小题
      this.currentSubIndex = 0 // 小题索引重置为0
      this.nextTopicBtnFlag = true
      if (this.contents.length === 1) {
        this.lastTopicButtonFlag = true
      } else {
        this.lastTopicButtonFlag = false
      }
      // 初始化task并判断类型 | word | sent | para | conv | recite | dict
      if (this.work.practiceType === 'tx') {
        if (Number(this.work.contentType) === 5) { // 纠音
          this.type = 'corr'
        } else { // 听写
          this.type = 'dict'
        }
      } else if (this.work.practiceType === 'bs') { // 背诵
        this.type = 'recite'
      } else {
        let tpls = ['word', 'sent', 'para', 'conv']
        this.type = tpls[Number(this.work.contentType) - 1]
      }
      this.currentView = Topics[this.type] // 加载题型
      this.setList() // 提交默认参数
      this.getResultData = this.detailScore[this.currentSubIndex] // 初始化答题反馈
      this.caption = this.work.practiceName // 标题名称
      this.currentData = this.contents[this.currentSubIndex] // 初始化当前小题
      if (process) this.process = process
      this.countDownTip()
      this.logParams.pushParam = { // 埋点
        gradeName: this.$store.state.student.grade,
        className: this.$store.state.student.clazz,
        practiceName: this.work.practiceName
      }
    },
    keydownEvent (event) {
      if (this.process === 'start') {
        if (event.keyCode === 13 || event.keyCode === 39 || event.keyCode === 40) { // enter | right | down
          if (this.type !== 'dict') {
            this.switchTopic()
          }
        } else if (event.keyCode === 37 || event.keyCode === 38) { // left | up
          if (this.currentSubIndex >= 1) {
            this.switchTopic(this.currentSubIndex - 1)
          }
        }
      }
    }
  },
  watch: {
    warningStatus: function (val) {
      if (val === 4) {
        this.wpDCfg = {
          getCurrentPage: 'WarningPopup',
          icon: '/static/images/practice/exam/ic_frame03.png',
          text1: '我等你好久啦~还要继续答题吗？',
          btn1: '继续答题',
          btn2: '不答了',
          callback1: this.handleHideWarningPopup,
          callback2: this.handleConfirmQuitExam,
          onHide: this.handleHideWarningPopup,
        }
        this.isShowWarning = true
      } else if (val === 5) {
        this.allowCallBackFnFlag = false
        this.player.stop()
        this.recorder.stop()
        this.wpDCfg = {
          getCurrentPage: 'WarningPopup',
          icon: '/static/images/practice/exam/ic_frame04.png',
          text1: '你确定退出吗？',
          text2: '',
          btn1: '暂不退出',
          btn2: '退出',
          cancel: true,
          callback1: this.handleHideWarningPopup,
          callback2: this.handleConfirmQuitExam,
          onHide: this.handleHideWarningPopup,
        }
        this.isShowWarning = true
      }
    },
    currentSubIndex: function (val) {
      this.allowCallBackFnFlag = true
      this.ldAutoRepeatFlag = true
      this.needCorrectFlag = false
    },
    currentIndex: function (val) {
      this.allowCallBackFnFlag = true
      this.ldAutoRepeatFlag = true
      this.needCorrectFlag = false
    }
  },
  mounted () {
    this.getTopic()
    window.addEventListener('keydown', (event) => {
      this.keydownEvent(event)
    }, false)
  },
  created () {
    this.$on('jy', (param) => {
      console.log(param)
      this.jy_result = Object.assign({}, param)
    })
  }
}
</script>

<style lang='less'>
#MainBoard {
  margin: 0 auto;
}
#stu-practice-work {
  position: fixed !important;
  top: 50%;
  left: 50%;
  margin-left: -600px;
  width: 1200px;
  border-radius: 30px;
  background: linear-gradient(right, #25d17f, #2cd166);
  background: -webkit-gradient(linear, right top, left top, from(#25d17f), to(#2cd166));
  padding: 0 3px;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: -45px;
    right: 0;
    bottom: -1px;
    width: 1290px;
    height: 140px;
    background: url('/static/images/practice/pic_work_decoration.png') no-repeat;
    z-index: 1;
  }

  & > .header {
    height: 80px;
    line-height: 80px;
    border-radius: 30px 30px 0 0;
    width: 1200px;
    padding-left: 27px;
    & > .head-text {
      font-size: 20px;
      color: #fff;
      line-height: 30px;
      font-weight: bold;
      max-width: 1000px;
      padding-top: 25px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    & > .logout {
      position: absolute;
      top: 30px;
      right: 30px;
      height: 20px;
      line-height: 20px;
      font-size: 18px;
      color: #fff;
      font-weight: bold;
      cursor: pointer;
    }
  }

  & > .stuwork-topic {
    width: 1194px;
    margin: 0 auto;
    background: #fff;
    & > .panel-right {
      float: left;
      padding: 50px 72px 0 50px;
      width: 948px;
      height: inherit;
      background: #fff;
      position: relative;
      & > .main {
        position: relative;
      }
      &.fullscreen {
        width: 100%;
      }
      & > .icon_collapse {
        position: absolute;
        top: 50%;
        left: 0;
        width: 30px;
        height: 30px;
        margin-top: -15px;
        background: url('/static/images/practice/btn_collapse.png') no-repeat center;
        background-position: 0 0;
        cursor: pointer;
        &.expand {
          background-position: 0 -30px;
        }
      }
    }
  }
}
/*下一题*/
.nextTopic {
  position: absolute;
  bottom: 25px;
  right: 25px;
  width: 115px;
  height: 82px;
  background: url('/static/images/practice/pic_work_next.png') no-repeat center;
  z-index: 10;
  cursor: pointer;
  &.lastTopic {
    background: url('/static/images/practice/pic_work_submit.png') no-repeat center;
  }
}
/*音频播放录音组件*/
.fullscreen {
  .videoPlug {
    margin-left: -150px;
  }
}
.videoPlug {
  position: absolute;
  bottom: -30px;
  left: 50%;
  width: 300px;
  margin-left: -161px;
  z-index: 10;

  & > .play {
    display: block;
    float: left;
    width: 75px;
    height: 75px;
    margin-top: 17px;
    background: url('/static/images/practice/work/work_audio_normal.png') no-repeat center;
    cursor: pointer;

    &:hover {
      background: url('/static/images/practice/work/work_audio_hover.png') no-repeat
        center;
    }
    &.playing {
      background: url('/static/images/practice/work/work_voice_palying.png') no-repeat
        center;
      animation: workplaying 1s steps(1) infinite 0s;
    }
    &.readagain {
      background: url('/static/images/practice/work/work_repeat_normal.png') no-repeat
        center;
      &:hover {
        background: url('/static/images/practice/work/work_repeat_hover.png') no-repeat
          center;
      }
    }
    &.disabled {
      background: url('/static/images/practice/work/work_audio_disable.png') no-repeat
        center;
      cursor: not-allowed;
    }
  }
  & > .record {
    display: block;
    margin-left: 20px;
    float: left;
    width: 110px;
    height: 110px;
    background: url('/static/images/practice/work/work_record_normal.png') no-repeat
      center;
    cursor: pointer;
    position: relative;

    &:hover {
      background: url('/static/images/practice/work/work_record_hover.png') no-repeat
        center;
    }
    &.recording {
      border-radius: 50%;
      background: #fff url('/static/images/practice/work/work_record_icon.png') no-repeat
        center;
      position: relative;
    }
    &.recite {
      background: url('/static/images/practice/work/work_recite_normal.png') no-repeat
        center;
      &:hover {
        background: url('/static/images/practice/work/work_recite_hover.png') no-repeat
          center;
      }
    }
    &.re_recite {
      background: url('/static/images/practice/work/recite_again_normal.png') no-repeat
        center;
      &:hover {
        background: url('/static/images/practice/work/recite_again_hover.png') no-repeat
          center;
      }
    }
    &.read_again {
      background: url('/static/images/practice/work/read_again_normal.png') no-repeat
        center;
      &:hover {
        background: url('/static/images/practice/work/read_again_hover.png') no-repeat
          center;
      }
    }
    &.disabled {
      background: url('/static/images/practice/work/work_record_disable.png') no-repeat
        center;
      cursor: not-allowed;
    }
  }
  & > .replay {
    display: block;
    margin-left: 20px;
    float: left;
    width: 75px;
    height: 75px;
    margin-top: 17px;
    background: url('/static/images/practice/work/work_voice_normal.png') no-repeat center;
    cursor: pointer;

    &:hover {
      background: url('/static/images/practice/work/work_voice_hover.png') no-repeat
        center;
    }
    &.playing {
      background: url('/static/images/practice/work/work_voice_palying.png') no-repeat
        center;
      animation: workplaying 1s steps(1) infinite 0s;
    }
    &.disabled {
      background: url('/static/images/practice/work/work_voice_disable.png') no-repeat
        center;
      cursor: not-allowed;
    }
    & > audio {
      width: 0;
      height: 0;
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
  left: 50%;
  margin: -43px 0 0 -72px;
  border-radius: 43px;
  background: rgba(255, 136, 27, 0.8);
  z-index: 100;
  &.expand {
    margin: -43px 0 0 -172px;
  }
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

  &.etNoIcon {
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
/*通用样式*/
.work-btn {
  width: 110px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  background: #24cc7c;
  font-size: 18px;
  color: #fff;
  text-align: center;
  border: none;
  outline: none;
  cursor: pointer;
  &:hover {
    background: #21bd73;
  }
}
.sentText {
  font-size: 24px;
  line-height: 48px;
  width: auto;
  text-align: left;
}
@keyframes workplaying {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: -75px 0;
  }
  50% {
    background-position: -150px 0;
  }
  75% {
    background-position: -225px 0;
  }
  100% {
    background-position: 0 0;
  }
}
@-webkit-keyframes workplaying {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: -75px 0;
  }
  50% {
    background-position: -150px 0;
  }
  75% {
    background-position: -225px 0;
  }
  100% {
    background-position: 0 0;
  }
}
@media screen and (min-height: 801px) {
  #stu-practice-work {
    height: 690px;
    margin-top: -350px;
    & > .stuwork-topic {
      height: 560px;
      & .main {
        height: 420px;
      }
    }
  }
}
@media screen and (max-height: 800px) {
  #stu-practice-work {
    height: 600px;
    margin-top: -300px;
    & > .stuwork-topic {
      height: 470px;
      & .main {
        height: 330px;
      }
    }
  }
}
</style>

