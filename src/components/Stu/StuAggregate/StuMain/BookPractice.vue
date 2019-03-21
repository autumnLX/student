<template lang="pug">
  div#BookPractice
    ul.renderLoading(v-if='bookPracticeNonEmpty')
      li
        i.loading
        span 正在加载..
    div.bookPractice(v-else-if="bookPracticeList.length")
      p.count.grey9.f14 {{$t('Stu.lowScore.count')}}
        span.green  {{bookPracticeCount}}
        |{{$t('Stu.lowScore.topic')}}
      div.topic-practice(v-for='(o, idx) of bookPracticeList' :class='{expand: currentBookPraceticeId == o.id}')
        div.info-bar(@click='handleBookPracticeToggle(o.id, idx)' :class="{word: o.content_type == '1' && o.error_list.img, sent: o.content_type == '2' && o.error_list.img, para: o.content_type == '3' && o.error_list.img, dialog: o.content_type == '4' && o.error_list.img}")
          div.title-number.f18.grey6 {{idx + 1 + (currentPage -1) * 10}}.
          div.book-content(v-if="o.content_type == '4'")
            ul.text-content(v-if='o.error_list.randerConter.length')
              li(v-for='detail in o.error_list.randerConter')
                span.f18.grey6 {{detail.role}}:&nbsp;&nbsp;
                span.f18.grey6(v-html='detail.content')
            ul.text-content(v-else)
              li(v-for='detail in o.error_list.content')
                span.f18.grey6 {{detail.role}}:&nbsp;&nbsp;
                span.f18.grey6(v-html='detail.content')
          div.book-content(v-else)
            img(v-if='o.error_list.img' :src='o.error_list.img')
            p.text-content.f18.grey6(v-if="o.error_list.randerHtmlContent" v-html='o.error_list.randerHtmlContent')
            p.text-content.f18.grey6(v-else v-html='o.error_list.content')
        div.operation
          i.icon-common2.icon-collect(:class='{collection: o.isCollection == 1, white: o.isCollection != 1 && currentBookPraceticeId == o.id}' @click='collectionZY(o, idx)')
          i.icon-common2.icon-trash(:class='{white: currentBookPraceticeId == o.id}' @click='deletComfirmZy(o.res_id)')
        div.pracetice-player(:class='{enter: currentBookPraceticeId == o.id, leave: !currentBookPraceticeId == o.id}')
          div.translateText(v-if="o.content_type == '4'")
            ul
              li(v-for='detail in o.error_list.content')
                span.grey9.f14(v-if='detail.translation') {{detail.role}}:&nbsp;&nbsp;
                span.grey9.f14(v-if='detail.translation') {{detail.translation}}
          div.translateText(v-else)
            span.grey9.f14(v-if='o.error_list.randerLowScoreSymbol' v-html='o.error_list.randerLowScoreSymbol')
            span.grey9.f14(v-else-if='o.error_list.symbol') {{o.error_list.symbol}}
            span.grey9.f14 {{o.error_list.translation}}
          section.video-operation
            div.play-icon(v-if="o.content_type == '4'" :class='{disabled: !o.error_list.content[0].audio, play: playerIconFlag === 0 && o.error_list.content[0].audio, playing: playerIconFlag === 1 && o.error_list.content[0].audio}' @click='playEvent(o)')
            div.play-icon(v-else :class='{disabled: !o.error_list.audio, play: playerIconFlag === 0 && o.error_list.audio, playing: playerIconFlag === 1 && o.error_list.audio}' @click='playEvent(o)')
            div.record-icon(:class='{record: recordIconFlag === 0, recording: recordIconFlag === 1}' @click='recordEvent(o, idx)')
              i.recording-bg(v-if='recordIconFlag === 1')
            div.replay-icon(v-if="o.content_type == '4'" :class='{replay: replayIconFlag === 0, replaying: replayIconFlag === 1}' @click='replayEvent(o, idx)')
              span.recordScore(v-if='recordScoreFlag && recordConvFlag && o.getAverageScore >= 55') {{o.getAverageScore}}
              span.recordingScoreLow(v-else-if='recordScoreFlag && recordConvFlag && o.getAverageScore < 55')
            div.replay-icon(v-else :class='{replay: replayIconFlag === 0, replaying: replayIconFlag === 1}' @click='replayEvent(o, idx)')
              span.recordScore(v-if='recordScoreFlag && o.audioUrl && o.result.overall >= 55') {{o.result.overall}}
              span.recordingScoreLow(v-else-if='recordScoreFlag && o.audioUrl && o.result.overall < 55')
      Pagination(v-if="!bookPracticeNonEmpty" :currentPage='currentPage' :maxNumPage='maxNumPage' :getSkipPage='getSkipPage')
      div.examToast(v-if='toast.isShow' :class="{etNoIcon: toast.type === 'noIcon'}")
        img(:src='"/static/images/practice/exam/toast_" + toast.img + ".png"' v-if='toast.type !== "noIcon"')
        div.et-cnt
          p.et-text1 {{ toast.text1 }}
          p.et-text2 {{ toast.text2 }}
    div.empty(v-else)
      i.emptyIcon
      span.f16.greyc {{$t('Stu.lowScore.empty')}}
    DiaLog(:dialogConfig='dialogConfig' :isShowDialog='false' ref='dialogParam')
</template>

<script>
import DiaLog from '@/UIO/DiaLog/App'
import Translations from './translation'
const _tpls = ['', 'word', 'sent', 'para', 'conv', 'dict', '', 'recite']

export default {
  name: 'StuAggregate',
  props: ['handleErrTwice'],
  components: Object.assign({}, { DiaLog, Translations }),
  data() {
    return {
      dialogConfig: {
        getCurrentPage: 'common', // 获取弹框的类型
        needCancleIcon: true, // 是否需要右上角的关闭按钮
        needLogin: true, // 是否显示登录
        confirmBtnText: '确认', // 确认弹框文案
        cancleBtnText: '取消', // 取消按钮文案
        cancleBtnStyle: 'btn-white', // 取消按钮风格
        showAssistTitleText: '确定要删除该试题？',
        assistTitleStyle: 'big',
        showBigTileFlag: false,
        confirmBtnStyle: 'btn-red',
        titleIcon: 'warning',
        isNONTipAgain: true, // 是否需要不在提醒功能
        cancleBtnCallBack: () => { },
        confirmBtnCallBack: () => { // 确认按钮回调
          this.deletLowScoreZy()
        }
      },
      // 教材练习
      bookPracticeList: [],
      conversationAudioList: [],
      bookPracticeCount: 0,
      currentBookPraceticeId: 0,
      bookPracticeNonEmpty: false,
      playerIconFlag: 0, // 0 暂停 | 1 播放
      recordIconFlag: 0, // 0 停止 | 1 录音
      replayIconFlag: 0, // 0 停止 | 1 回放
      recordScoreFlag: true,
      collectionState: true, // 添加一个状态，避免接口被刷
      type: '', // 类型 word | sent | para | conv
      currentTopicIndex: 0,
      // 对话模式
      recordAudioList: [],
      recordScoreList: [],
      recordConvFlag: false,
      currentUrlIndex: 0,
      currentRecordIndex: 0, // 对话题型录音小题
      // 试卷练习
      currentDeleteId: 0,
      isNeedDeleteTip: true, // 是否需要删除弹框
      // 分页
      currentPage: 1,
      maxNumPage: 1,
      isOverTime: false, // 超时
      waitTimeout: '',
      toast: {
        isShow: false,
        type: '', // noIcon
        img: '',
        text1: '',
        text2: ''
      },
      // 录音
      player: this.$store.state.$player,
      recorder: this.$store.state.$recorder,
      recordErrCount: 0,
      _type: '',
      lastRecordId: '',
      serverParams: {
        rank: 100,
        precision: 1,
        userId: this.$store.state.student.name,
        attachAudioUrl: 1,
        client_params: {
          'ext_subitem_rank4': 0,
          'ext_word_details': 1,
          'ext_phn_details': 1
        }
      },
      allowCallBackFlag: true,
      logParams: { // 埋点
        logType: 0,
        pushParam: {}
      }
    }
  },
  methods: {
    handleBookPracticeToggle(id, index) {
      this.allowCallBackFlag = false
      this.currentRecordIndex = 0
      if (this.player) {
        this.player.stop()
        this.recorder.reset()
      }
      this.playerIconFlag = 0
      this.recordIconFlag = 0
      this.replayIconFlag = 0
      this.recordScoreFlag = true
      if (this.currentBookPraceticeId === id) {
        this.currentBookPraceticeId = ''
      } else {
        this.currentBookPraceticeId = id
      }
      if (this.bookPracticeList[index].practiceType === 'tx') {
        this._type = _tpls[5]
      } else if (this.bookPracticeList[index].practiceType === 'bs') {
        this._type = _tpls[7]
      } else {
        this._type = _tpls[Number(this.bookPracticeList[index].contentType)]
      }
    },
    doPlay(url, callback = () => { }) {
      this.player.load({
        url: url,
        success: () => {
          this.player.play({
            onStart: () => { },
            onStop: () => {
              this.player.stop()
              callback()
            }
          })
        }
      })
    },
    doRecord(text, callback) {
      let refText = text.replace(/-/g, ' ')
      let maxtxt = refText.split(' ').length
      let duration = maxtxt * 900 + 2000
      this.serverParams.refText = refText.replace(/<[^>]+\/?>/g, '').trim()
      let _serverParams = Object.assign({}, this.serverParams)
      if (maxtxt === 1) {
        _serverParams.coreType = 'en.word.child'
      } else if (maxtxt >= 2 && maxtxt <= 15) {
        _serverParams.coreType = 'en.sent.child'
      } else if (maxtxt > 15) {
        _serverParams.coreType = 'en.pred.exam'
        _serverParams.refText = {
          qid: this.$store.state.student.id,
          lm: refText.replace(/<[^<>]+>/g, ' ').trim()
        }
        if (this._type === 'recite') {
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
          this.recordIconFlag = 1
        },
        onStop: () => {
          if (this.allowCallBackFlag) {
            this.getScore(callback)
          }
        }
      })
    },
    getScore(callback) {
      this.recordIconFlag = 0
      this.isOverTime = false
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
          if (this.isOverTime) return
          else clearTimeout(this.waitTimeout)
          this.recordScoreFlag = true
          this.recordConvFlag = false
          let _data = data[this.lastRecordId]
          if (_data.errId || _data.result.errID) {
            let errId = _data.errId || _data.result.errID
            this.handleRecordErr(errId)
          } else {
            let score = _data.result.overall
            let audioUrl = _data.audioUrl
            let details = _data.result.details
            callback(score, audioUrl, details)
          }
        }
      })
    },
    handleRecordErr(errId) {
      let _logParams = {
        action: '/errors/assessmentCrash',
        logType: 0,
        pushParam: Object.assign({}, this.pushParam, {
          errorId: errId,
          topicId: this.bookPracticeList[this.currentTopicIndex].id,
          msg: `练习id为${this.bookPracticeList[this.currentTopicIndex].id}的作业，系统反馈：`
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
    handleToast(params) {
      this.toast = Object.assign({}, params, { isShow: true })
      setTimeout(() => {
        this.$set(this.toast, 'isShow', false)
      }, 3000)
    },
    handleRecordResult(score, audioUrl, details) {
      if (this.type === 'conv') {
        this.recordAudioList[this.currentRecordIndex] = audioUrl // 音频
        this.recordScoreList[this.currentRecordIndex] = score // 分数
        let list = this.bookPracticeList[this.currentTopicIndex].error_list
        const content = this.label(details)
        const role = list.content[this.currentRecordIndex].role
        this.$set(list.randerConter[this.currentRecordIndex], 'content', content)
        this.$set(list.randerConter[this.currentRecordIndex], 'role', role)
        if (this.currentRecordIndex < list.content.length) {
          this.currentRecordIndex++
          if (this.currentRecordIndex === list.content.length) {
            this.currentRecordIndex = 0
            this.replayIconFlag = 0
            let count = 0
            this.recordScoreList.forEach((value, index) => {
              count += value
            })
            let getAverageScore = Math.ceil(count / this.recordScoreList.length)
            this.$set(this.bookPracticeList[this.currentTopicIndex], 'getAverageScore', getAverageScore)
            this.recordConvFlag = true
          } else {
            this.doRecord(list.content[this.currentRecordIndex].content, this.handleRecordResult)
          }
        }
      } else {
        this.$set(this.bookPracticeList[this.currentTopicIndex].result, 'overall', score)
        this.$set(this.bookPracticeList[this.currentTopicIndex], 'audioUrl', audioUrl)
        const randerHtmlContent = this.label(details)
        this.$set(this.bookPracticeList[this.currentTopicIndex].error_list, 'randerHtmlContent', randerHtmlContent)
      }
    },
    removeTag(tag) {
      if (tag && tag.indexOf('<') >= 0 && tag.indexOf('<') >= 0) {
        return tag.replace(/<[^>]+>/g, '')
      } else {
        return tag
      }
    },
    label(details) {
      let text = ''
      let _new = ''
      let randerLowScoreSymbol = ''
      if (this.type === 'conv') {
        text = this.bookPracticeList[this.currentTopicIndex].error_list.content[this.currentRecordIndex].content.replace(/-/g, ' ')
      } else {
        text = this.bookPracticeList[this.currentTopicIndex].error_list.content.replace(/-/g, ' ')
      }
      if (details[0].words) {
        details.forEach((value, index) => {
          value.words.forEach((val, idx) => {
            let word = val.text
            let score = val.score
            let reg = new RegExp(`(^|\\s|['"])(${word})(\\s|[.?!,;:'"])`, 'i')
            let endtag = `|eee`
            let startTag = score < this.$config.ScoreLevel.bad ? `bbb|` : (score < this.$config.ScoreLevel.great ? `nnn|` : `ggg|`)
            text = text.replace(reg, (str, $1, $2, $3) => {
              let replace = ''
              if ($1 !== ' ') {
                replace += startTag + $1 + endtag
              } else {
                replace += $1
              }
              replace += startTag + $2 + endtag
              if ($3 !== ' ') {
                replace += startTag + $3 + endtag
              } else {
                replace += $3
              }
              return replace
            })
          })
        })
        text = text.replace(/bbb\|/g, `<span class='audioResultText red'>`)
          .replace(/nnn\|/g, `<span class='audioResultText grey6'>`)
          .replace(/ggg\|/g, `<span class='audioResultText green'>`)
          .replace(/\|eee/g, `</span>`)
        return text
      } else if (details[0].char || details[0].text) {
        details.forEach((val, index) => {
          let key = val.char ? val.char : val.text
          let score = val.score
          let pattern = new RegExp(`(?:^['"()]?${key}|\\s['"]?${key})[,.?!'"()]*`, 'i')
          let result = pattern.exec(text)
          let result0 = result[0]
          let _r = ''
          text = text.substring(result0.length)
          if (score < this.$config.ScoreLevel.bad) {
            _r = result0.replace(result0, `<span class='audioResultText red'>${result0}</span>`)
          } else if (score < this.$config.ScoreLevel.good) {
            _r = result0.replace(result0, `<span class='audioResultText grey6'>${result0}</span>`)
          } else {
            _r = result0.replace(result0, `<span class='audioResultText green'>${result0}</span>`)
          }
          if (this.type === 'word' && val.phone && val.phone.length > 0) {
            val.phone.forEach((phone, i) => {
              if (phone.score < this.$config.ScoreLevel.bad) {
                randerLowScoreSymbol += `<span class='red'>${this.translation(phone.char)}</span>`
              } else if (phone.score < this.$config.ScoreLevel.good) {
                randerLowScoreSymbol += `<span class='grey6'>${this.translation(phone.char)}</span>`
              } else {
                randerLowScoreSymbol += `<span class='green'>${this.translation(phone.char)}</span>`
              }
            })
            if (randerLowScoreSymbol.indexOf('[') < 0 && randerLowScoreSymbol.indexOf(']') < 0) {
              randerLowScoreSymbol = `[${randerLowScoreSymbol}]`
            }
          }
          _new += _r;
        })
        this.$set(this.bookPracticeList[this.currentTopicIndex].error_list, 'randerLowScoreSymbol', randerLowScoreSymbol)
        return _new
      }
    },
    getPhone() {
    },
    translation(char) {
      let value = ''
      for (let key of Translations.translation) {
        if (key[0] === char) {
          value = key[1]
          break
        } else {
          value = char
        }
      }
      return value
    },
    getCurrenType(content_type) {
      switch (Number(content_type)) {
        case 1:
          this.type = 'word'
          break
        case 2:
          this.type = 'sent'
          break
        case 3:
          this.type = 'para'
          break
        case 4:
          this.type = 'conv'
          break
      }
    },
    initPlayStatus(callback = () => { }) {
      this.player.stop()
      this.recorder.reset()
      if (this.replayIconFlag === 1) {
        this.replayIconFlag = 0
      }
      if (this.recordIconFlag === 1) {
        this.recordIconFlag = 0
      }
      if (this.playerIconFlag === 0) {
        this.playerIconFlag = 1
        callback()
      } else {
        this.playerIconFlag = 0
        this.player.stop()
      }
    },
    playEvent(param) {
      let url = ''
      this.getCurrenType(param.content_type)
      this.player.stop()
      this.recorder.reset()
      if (this.type === 'conv') { // 对话
        this.currentRecordIndex = 0
        this.currentUrlIndex = 0
        param.error_list.content.forEach((value, index) => {
          this.conversationAudioList[index] = {
            audioUrl: value.audio
          }
        })
        url = this.conversationAudioList[0].audioUrl
      } else {
        url = param.error_list.audio
      }
      if (!url) {
        return
      }
      this.initPlayStatus(() => {
        this.doPlay(url, () => {
          if (this.type === 'conv') {
            this.handleConvPlayEvent()
          } else {
            this.playerIconFlag = 0
          }
        })
      })
    },
    handleConvPlayEvent() {
      if (this.playerIconFlag === 1) {
        this.currentUrlIndex++
        let audioUrl = this.conversationAudioList[this.currentUrlIndex].audioUrl
        if (this.currentUrlIndex === this.conversationAudioList.length - 1) {
          this.doPlay(audioUrl, () => {
            this.playerIconFlag = 0
          })
        } else {
          this.doPlay(audioUrl, this.handleConvPlayEvent)
        }
      }
    },
    initRecordStatus(callback = () => { }) {
      this.player.stop()
      if (this.playerIconFlag === 1) {
        this.playerIconFlag = 0
      }
      if (this.replayIconFlag === 1) {
        this.replayIconFlag = 0
      }
      if (this.recordIconFlag === 1) {
        this.recordIconFlag = 0
        this.recorder.stop()
      } else {
        this.recordIconFlag = 1
        callback()
      }
    },
    recordEvent(param, index) {
      this.player.stop()
      this.currentTopicIndex = index
      this.allowCallBackFlag = true
      this.getCurrenType(param.content_type)
      this.initRecordStatus(() => {
        if (this.type === 'conv') {
          this.currentUrlIndex = 0
          this.doRecord(param.error_list.content[0].content, this.handleRecordResult)
        } else {
          this.doRecord(param.error_list.content, this.handleRecordResult)
        }
      })
    },
    initReplayStatus(callback = () => { }) {
      this.player.stop()
      this.recorder.reset()
      if (this.playerIconFlag === 1) {
        this.playerIconFlag = 0
      }
      if (this.recordIconFlag === 1) {
        this.recordIconFlag = 0
      }
      if (this.replayIconFlag === 0) {
        this.replayIconFlag = 1
        callback()
      } else {
        this.replayIconFlag = 0
        this.player.stop()
      }
    },
    replayEvent(param, index) {
      let url = ''
      this.getCurrenType(param.content_type)
      this.player.stop()
      this.recorder.reset()
      if (this.type === 'conv') { // 对话
        this.currentRecordIndex = 0
        this.currentUrlIndex = 0
        url = this.recordAudioList[0]
      } else {
        url = this.bookPracticeList[index].audioUrl
      }
      if (!url) {
        return
      } else {
        url = url.indexOf('8002') >= 0 ? url.replace(/:8002/g, '') : ''
        if (url) {
          url = `https://${url}.mp3`
        }
      }
      this.recordScoreFlag = !this.recordScoreFlag
      this.initReplayStatus(() => {
        this.doPlay(url, () => {
          this.recordScoreFlag = true
          if (this.type === 'conv') {
            this.handleConvRePlayEvent()
          } else {
            this.replayIconFlag = 0
          }
        })
      })
    },
    handleConvRePlayEvent() {
      if (this.replayIconFlag === 1) {
        this.recordConvFlag = false
        this.currentUrlIndex++
        let _url = this.recordAudioList[this.currentUrlIndex].indexOf('8002') >= 0 ? this.recordAudioList[this.currentUrlIndex].replace(/:8002/g, '') : ''
        if (_url) {
          _url = `https://${_url}.mp3`
        }
        if (this.currentUrlIndex === this.recordAudioList.length - 1) {
          this.doPlay(_url, () => {
            this.replayIconFlag = 0
            this.recordConvFlag = true
          })
        } else {
          this.doPlay(_url, this.handleConvRePlayEvent)
        }
      }
    },
    getSkipPage(page) {
      this.currentPage = page
    },
    collectionZY(param, index) {
      if (!this.collectionState) {
        return
      }
      this.collectionState = false
      if (param.isCollection === '1') {
        this.$ajax.post('/vocabs/deleteOneVocab', {
          vocabId: param.vocab_id
        }, (res) => {
          this.collectionState = true
          if (res.status === 1) {
            this.$set(this.bookPracticeList[index], 'isCollection', '0')
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
          }
        })
      } else if (param.isCollection === '0') {
        let errorList = this.bookPracticeList[index].error_list
        let reqParam = {
          bookId: param.book_id,
          unitId: param.unit_id,
          sectionId: param.section_id,
          contentType: param.content_type,
          resId: param.res_id,
        }
        if (Number(param.content_type) === 0) {
          reqParam.content = ''
          reqParam.word = errorList
        } else if (Number(param.content_type) === 4) {
          reqParam.content = ''
          errorList.content.forEach((value, index) => {
            errorList.content[index].content = this.removeTag(value.content)
          })
          reqParam.word = JSON.stringify(errorList)
        } else {
          errorList.content = this.removeTag(errorList.content)
          reqParam.word = JSON.stringify(errorList)
          reqParam.content = this.removeTag(errorList.content)
        }
        this.$ajax.post('/vocabs/insertOneVocab', reqParam, (res) => {
          this.collectionState = true
          if (res.status === 1) {
            this.bookPracticeList[index].isCollection = '1'
            this.bookPracticeList[index].vocab_id = res.data.vocabId
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
          }
        })
      }
    },
    getLowScoreZYList() {
      this.bookPracticeList = []
      this.bookPracticeNonEmpty = true
      this.$ajax.post('/wrongs/getLowScoreList', {
        currentPage: this.currentPage
      }, (res) => {
        if (res.status === 1) {
          this.bookPracticeNonEmpty = false
          this.bookPracticeList = res.data.list
          if (this.bookPracticeList.length) {
            this.bookPracticeList.forEach((value, i) => {
              let list = JSON.parse(value.error_list)
              if (list.symbol && list.symbol.indexOf('[') < 0 && list.symbol.indexOf('[') < 0) {
                this.$set(list, 'symbol', `[${list.symbol}]`)
              }
              this.$set(this.bookPracticeList[i], 'error_list', list)
              this.bookPracticeList[i].audioUrl = ''
              this.bookPracticeList[i].result = {
                details: [],
                overall: 0
              }
              if (value.content_type === '4') {
                this.bookPracticeList[i].error_list.randerConter = []
                this.bookPracticeList[i].error_list.content.forEach((value, idx) => {
                  this.bookPracticeList[i].error_list.randerConter[idx] = {
                    content: value.content,
                    role: value.role
                  }
                })
              }
            })
          }
          this.currentPage = res.data.pageInfo ? res.data.pageInfo.page : 1
          this.maxNumPage = res.data.pageInfo ? res.data.pageInfo.total : 1
          this.bookPracticeCount = res.data.pageInfo.count
        } else if (res.status === 2) {
          window.location.href = '/login'
        }
      })
    },
    checkCustomTagAlert(type, callback) {
      this.$ajax.post('/students/checkCustomTagAlert', {
        tag: type
      }, (res) => {
        if (res.status === 1) {
          if (res.data === 1) {
            this.isNeedDeleteTip = false
          } else {
            this.isNeedDeleteTip = true
          }
          this.getLowScoreZYList()
        }
      })
    },
    deletComfirmZy(id) {
      this.currentDeleteId = id
      if (this.isNeedDeleteTip) {
        this.$refs.dialogParam.showDialogFlag = true
      } else {
        this.$refs.dialogParam.showDialogFlag = false
        this.deletLowScoreZy()
      }
    },
    deletLowScoreZy() {
      if (this.currentPage > 1 && this.bookPracticeList.length === 1) { // 当前非第一页最后一条数据删除
        this.currentPage = this.currentPage - 1
      }
      this.$ajax.post('/wrongs/deleLowScore', {
        resId: this.currentDeleteId
      }, (res) => {
        if (res.status === 1) {
          if (this.$refs.dialogParam.selectActiveFlag) {
            this.$ajax.post('/students/addCustomTagAlert', {
              tag: 'zy_low_score'
            }, (res) => {
              if (res.status === 1) {
                this.checkCustomTagAlert('zy_low_score')
              }
            })
          } else {
            this.checkCustomTagAlert('zy_low_score')
          }
        }
      })
    }
  },
  watch: {
    currentPage: function (val) {
      this.checkCustomTagAlert('zy_low_score')
    }
  },
  created() {
    if (!this.$store.state.$recorder) {
      this.$store.commit('initAiPanel')
      this.player = this.$store.state.$player
      this.recorder = this.$store.state.$recorder
    }
  },
  mounted() {
    this.checkCustomTagAlert('zy_low_score')
  }
}
</script>

<style lang='less' scoped>
@image-base-url: "../../../../assets/image";
#BookPractice {
  margin-top: 10px;
  border-radius: 10px;
  min-height: 350px;
  padding: 0 30px 40px;
  background: #fff;
  overflow: hidden;

  p.count {
    height: 70px;
    line-height: 70px;
  }
  
  ul.renderLoading {
    & > li {
      background: #fff;
      height: 220px;
      padding-top: 80px; 
      & > i.loading {
        display: block;
        width: 60px;
        height: 60px;
        margin: 0 auto;
        background-image: url("@{image-base-url}/stu/icon_loading.gif");
      }
      & > span {
        display: block;
        margin: 10px auto 0;
        font-size: 14px;
        color: #999;
        text-align: center;
      }
    }
  }
  
  div.bookPractice {
    .topic-practice {
      margin-top: 20px;
      min-height: 40px;
      border-radius: 10px;
      background: #f8f8f8;
      padding: 38px 80px 38px 25px;
      position: relative;

      &:first-child {
        margin-top: 0;
      }

      &.expand {
        background: #caf6e1;
      }

      .info-bar {
        cursor: pointer;

        .title-number {
          float: left;
          box-sizing: border-box;
          line-height: 24px;
        }

        .book-content {
          padding-left: 10px;
          display: flex;
          & > img {
            width: 100px;
            height: 100px;
            margin-right: 10px;
            display: inline-flex;
            display: -webkit-inline-flex;
          }
          p.text-content {
            line-height: 24px;
            display: table;
            vertical-align: middle;
            overflow: hidden;
            & > span {
              padding-right: 5px;
            }
          }
          ul.text-content {
            width: 100%;

            & > li {
              display: flex;

              & > span {
                line-height: 24px;
                display: inline-flex;
              }
            }
          }
        }
        &.word {
          & > .title-number {
            padding: 38px 0;
          }
          & > .book-content p {
            padding: 38px 0;
            max-width: 645px;
          }
        }
        &.sent {
          & > .book-content p {
            max-width: 645px;
          }
        }
        &.para {
          & > .book-content p {
            max-width: 645px;
          }
        }
        &.dialog {
          & > .book-content p {
            max-width: 645px;
          }
        }
      }

      .operation {
        width: 80px;
        position: absolute;
        top: 10px;
        right: 0;
        text-align: right;
        padding-right: 20px;

        .icon-common2 {
          margin-left: 10px;
        }
      }

      .pracetice-player {
        padding: 0 0 0 25px;
        transition: all 0.3s linear;
        transform: translateY(-40px);
        opacity: 0;
        display: none;

        & > .translateText {
          // padding: 0 15px;
          line-height: 24px;

          & > ul {
            width: 100%;

            & > li {
              display: flex;

              & > span {
                line-height: 24px;
                display: inline-flex;
              }
            }
          }
        }

        & > .video-operation {
          margin-top: 20px;
          height: 80px;

          & > div {
            float: left;
            display: block;
            cursor: pointer;
          }

          & > .play-icon {
            display: inline-block;
            width: 60px;
            height: 60px;
            margin-top: 10px;

            &.play {
              background: url("@{image-base-url}/stu/video/exercise_play.png")
                no-repeat center;
            }

            &.play:hover {
              background: url("@{image-base-url}/stu/video/exercise_play_hover.png")
                no-repeat center;
            }

            &.playing {
              background: url("@{image-base-url}/stu/video/exercise_playing.png")
                no-repeat 0 0;
              animation: playing 1s steps(1) infinite 0s;
              -moz-animation: playing 1s steps(1) infinite 0s;
              -webkit-animation: playing 1s steps(1) infinite 0s;
              -o-animation: playing 1s steps(1) infinite 0s;
            }

            &.disabled {
              background: url("@{image-base-url}/stu/video/exercise_play_null.png")
                no-repeat 0 0;
              cursor: initial;
            }
          }

          & > .record-icon {
            width: 80px;
            height: 80px;
            margin-left: 40px;
            position: relative;

            &.record {
              background: url("@{image-base-url}/stu/video/exercise_record.png")
                no-repeat center;
            }

            &.record:hover {
              background: url("@{image-base-url}/stu/video/exercise_record_hover.png")
                no-repeat center;
            }

            &.recording {
              background: url("@{image-base-url}/stu/video/exercise_recording_bg.png")
                no-repeat center;

              & > .recording-bg {
                position: absolute;
                top: 0;
                left: 0;
                display: block;
                width: 80px;
                height: 80px;
                background: url("@{image-base-url}/stu/video/exercise_recording_circle.png")
                  no-repeat center;
                transform: rotate(360deg);
                -webkit-transform: rotate(360deg);
                animation: recordingBg 2s linear infinite;
                -moz-animation: recordingBg 2s linear infinite;
                -webkit-animation: recordingBg 2s linear infinite;
                -o-animation: recordingBg 2s linear infinite;
              }
            }
          }

          & > .replay-icon {
            width: 60px;
            height: 60px;
            margin: 10px 0 0 40px;
            position: relative;

            & .recordScore {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              width: 60px;
              height: 60px;
              line-height: 60px;
              text-align: center;
              font-size: 24px;
              font-style: normal;
              color: #fff;
            }

            & .recordingScoreLow {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              width: 60px;
              height: 60px;
              background: url("@{image-base-url}/stu/pic_cry.png") no-repeat
                center;
            }

            &.replay {
              background: url("@{image-base-url}/stu/video/exercise_replay.png")
                no-repeat center;
            }

            &.replay:hover {
              background: url("@{image-base-url}/stu/video/exercise_replay_hover.png")
                no-repeat center;
            }

            &.replaying {
              background: url("@{image-base-url}/stu/video/exercise_replaying.png")
                no-repeat center;
            }

            &.replaying:hover {
              background: url("@{image-base-url}/stu/video/exercise_replaying_hover.png")
                no-repeat center;
            }
          }
        }
      }

      .pracetice-player.enter {
        transform: translateY(0px);
        opacity: 1;
        display: block;
        margin-top: 10px;
      }
      .pracetice-player.leave {
        transform: translateY(-40px);
        opacity: 0;
        display: none;
      }
    }

    .topic.expand {
      background: #caf6e1;
    }

    .topic:nth-child(2) {
      margin: 0;
    }
  }

  .icon-collect {
    &.collection {
      background-position-x: -160px;
    }
    &.white {
      background-position-x: -180px;
    }
    &.white:hover {
      background-position-x: -240px;
    }
  }
  .icon-trash {
    &.white {
      background-position-x: -120px;
    }
    &.white:hover {
      background-position-x: -100px;
    }
  }
  .examToast {
    width: 346px;
    height: 86px;
    display: flex;
    align-items: center;
    position: fixed;
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
  .empty {
    width: 300px;
    height: 454px;
    text-align: center;
    margin: 0 auto;
    padding-top: 50px;
    position: relative;

    i {
      display: block;
      width: 300px;
      height: 300px;
      background: url("@{image-base-url}/common/pic_empty-05.png") no-repeat
        center;
    }

    span {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 150px;
    }
  }
}

@keyframes recordingBg {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes recordingBg {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes playing {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: -60px 0;
  }
  50% {
    background-position: -120px 0;
  }
  75% {
    background-position: -180px 0;
  }
  100% {
    background-position: 0 0;
  }
}
@-webkit-keyframes playing {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: -60px 0;
  }
  50% {
    background-position: -120px 0;
  }
  75% {
    background-position: -180px 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
