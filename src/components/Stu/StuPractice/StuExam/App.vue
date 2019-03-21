<template lang="pug">
  div#stu-practice-exam-root
    div#stu-practice-exam
      transition(mode='out-in' name='fade')
        Result(v-if='submitStatus === 2' 
          :published='published' 
          :singleTopicType='singleTopicType'
          :score='score'
          :scoreRate='scoreRate' 
          :best='best'
          :rank='rank'
          :minute='minute' 
          :onAgain='handleAgain'
          :onGoToRank='handleGoToRank'
          :onExamComplete='handleExamComplete'
          :showRanking='showRanking'
          :showTime='showTime'
          :competitionType='competitionType'
          :canRestart='canRestart'
        )
        div.exam(v-else)
          div.header
            span.title {{ examName }}
            div
              a.change(href='#' @click='handleChangeModels' v-if='handleShowChangeMode') 切换为模考模式
              div.divide
              a.quit(href='#' @click='handleQuitExam') 退出
          //- 做题界面
          div.main(v-if='loadingStatus === "loaded"')
            Left(
              ref='leftCpt'
              :countdown='cd'
              :transformNum='transformNum'
              :singleTopicType='singleTopicType'
              :hasProgress='hasProgress'
              :list='list'
              :handleRestart='handleRestart'
              :topicNeedSplit='topicNeedSplit'
              :topicNeedCombine='topicNeedCombine'
              :currentPartIndx='currentPartIndx'
              :currentQuestionIdx='currentQuestionIdx'
              :currentOptionIdx='currentOptionIdx'
              :isLastQuestion='isLastQuestion'
              :onSelectQuestion='handleNext'
              :onSubmit='handleSubmit'
              :onSetData='handleSetData'
              :PRStatusCheck='handlePRStatusCheck'
              :canRepeat='canRepeat'
              :competitionType='competitionType'
              :initTotalIdx='initTotalIdx'
              :handleTips='handleTips'
            )
            Right(
              ref='rightCpt'
              :transformNum='transformNum'
              :singleTopicType='singleTopicType'
              :list='list'
              :detailScore='detailScore'
              :currentPartIndx='currentPartIndx'
              :currentQuestionIdx='currentQuestionIdx'
              :currentOptionIdx='currentOptionIdx'
              :currentTotalIdx='currentTotalIdx'
              :isLastQuestion='isLastQuestion'
              :onSetAnswer='handleSetAnswer'
              :onNext='handleNext'
              :onOpenExplain='handleOpenExplain'
              :PRStatusCheck='handlePRStatusCheck'
              :handleErrTwice='handleErrTwice'
              :handleSetDetail='handleSetDetail'
              :showTimeFlag='showTimeFlag'
              :stopExplainPlay='handleStopExplainPlay'
            )
          //- 预加载界面
          PreLoad(:cntList="loadingCnt" @loadFail="loadFail"  @loadSuccess="loadEnd" :loadingStatus.sync="loadingStatus" v-if='loadingStatus !=="loaded"')
            p.contentDetail.f16.grey9 该练习包含{{ topicTypcCount }}大题{{ topicCount }}小题
          //- div.loading(v-else)
          //-   div(v-if='loadingStatus === "loading"')
          //-     p.title.f24.green.fb 正在加载资源
          //-     div.progressBox
          //-       div.progressBarBG
          //-         div.progressBar(:style='{width: progressPer + "%"}')
          //-           img.progressIcon(src='/static/images/practice/ic_loading.png')
          //-       span.progressText.f16.grey9 {{ progressPer }}%
          //-     p.contentDetail.f16.grey9 该练习包含{{ topicTypcCount }}大题{{ topicCount }}小题
          //-   div(v-if='loadingStatus === "fail"')
          //-     p.title.f24.green.fb 哎呀，网络不稳定，未加载成功
          //-     img(src='/static/images/practice/ic_loading_fail.png')
          //-     button.btn.btn-green(@click='handleRetryPreload') 重新加载
      Submit(v-if='submitStatus === 1')
    transition(mode='out-in' name='fade')
      Report(v-if='!singleTopicType && isReport && submitStatus === 2'
        :competitionId='competitionId'
        :groupId='groupId'
        :stageId='stageId'
      )
    Explain(
      v-if='explain'
      ref='explainCpt'
      :onClosed='handleCloseExplain'
      :explainParam='explainParam'
      :PRStatusCheck='handlePRStatusCheck'
    )
    transition(mode='out-in' name='fade')
      //- 交卷二次确认
      div.warning-popup(v-if='warningStatus === 1')
        div
          img(src='/static/images/practice/exam/ic_frame06.png')
          i.close(@click='handleHideWarningPopup')
          p.text1 你确定交卷了吗？
          p.text2(v-if='undoCount > 0') 你还有 
            span(style='color:#ff6666;text-decoration:underline;cursor:pointer;' @click='handleDoUndo') {{ undoCount }}
            |  题未做
          div
            button.grey(@click='handleHideWarningPopup') 继续答题
            button.orange(@click='handleConfirmSubmit') 交卷
      //- 未做完题目指引
      div.popup3(v-if='warningStatus === 6')
        p.text1 小提示
        div 请在左侧点击标记
          div
          | 的试题，并完成答题。
        button(@click='handleHideWarningPopup') 我知道了
    div.tips(v-if='tipsInfo.text' :style='{top: tipsInfo.top, left: tipsInfo.left}' v-html='tipsInfo.text')
    Dialog(:dialogConfig='wpDCfg' :isShowDialog='handleShowWarning')
    Dialog(:dialogConfig='dialogCfg' :isShowDialog='warningStatus === 7')
    Dialog(:dialogConfig='nextDCfg' :isShowDialog='isShowNextD')
</template>

<script>
/**
 * 学生测评
 */
import Left from './Left'
import Right from './Right'
import Result from './Result'
import Report from './Report'
import Explain from './Explain'
import Submit from './Submit'
import PreLoad from './preLoad'

export default {
  name: 'StuExam',
  props: ['handleErrTwice'],
  components: { Left, Right, Result, Report, Explain, Submit, PreLoad },
  data () {
    return {
      topicNeedSplit: ['16', '28', '45', '49', '54', '57', '47', '51', '52', '53',
        '55', '20', '21', '67', '68', '69', '73', '74', '75', '76', '77'], // 小题单题号（左侧列表）的题型
      topicNeedCombine: ['47', '54', '55', '20', '21', '67', '68', '69', '71', '73', '74', '75', '76'], // 小题单题号 同一页的题型 基本都是选择题
      loadingStatus: '', // 是否加载完资源 loading fail loaded
      loadingTimeout: 150000,
      loadingTimer: '',
      loadingCount: 0,
      loadingTotal: 0,
      loadingCnt: [],
      loadingErr: [],
      loadingStartTime: '',
      loadingFirst: true,
      logParams: {
        pushParam: {
          gradeName: this.$store.state.student.grade,
          className: this.$store.state.student.clazz,
        }
      },
      singleTopicType: 0, // 做单题类型
      showTimeFlag: true, // 是否为实时出成绩
      canRepeat: true, // 是否能选跳题
      isReport: false, // 是否显示报告
      showRanking: false, // 是否显示排名
      competitionType: '', // 测评类型 1定制测评
      answerPrecess: '', // 模式 1 考试模式 2 练习模式 3 学生自选模式
      explainParam: {}, // 实时出成绩参数
      isSingleTopic: false, // 是否为做单题
      examName: '',
      list: [],
      detailScore: [],
      cd: 0, // 倒计时
      hasProgress: false, // 是否有进度
      competitionTime: 0, // 测评总时长
      modelId: '',
      paperInfo: {}, // 试卷内容原始数据
      currentPartIndx: 0, // 当前第几大题
      currentQuestionIdx: -1, // 当前第几题，-1代表是题型说明页
      currentOptionIdx: 0, // 当前第几小题
      currentTotalIdx: 0, // 题号 与左侧列表一致
      isLastQuestion: false,
      allCount: 0, // 题目总数
      undoCount: 0, // 未做题目数量
      explain: false, // 是否展开解析区域
      submitStatus: 0, // 0：未交卷；1：交卷中；2：完成交卷
      published: false, // 是否实时显示分数
      score: 0, // 测评得分
      best: 0, // 最好分数
      rank: 0, // 当前排名
      minute: 0, // 耗时（分钟）
      PRStatus: 'idle', // idle：空闲 playing：播放中 recording：录音中 scoring：评分中 waiting: 等待中（player和recorder start和stop成功之前的等待状态）
      warningStatus: 0, // 1：交卷提示；2：内容出错；3：评分失败；4:10分钟没有动作；5：退出测评；6：未做完提示；7：切换模考模式提醒；
      dialogCfg: {
        getCurrentPage: 'common',
        needCancleIcon: false,
        titleIcon: 'hide',
        confirmBtnText: '确认',
        confirmBtnStyle: 'btn-green',
        cancleBtnText: '取消',
        cancleBtnStyle: 'btn-white',
        showBigTileFlag: true,
        showBigTileText: '切换为模考模式？',
        assistTitleStyle: 'small',
        showAssistTitleText: '注：切换后，系统自动保留练习进度',
        confirmBtnCallBack: () => {
          this.handlePRStatusCheck('abandon', this.handleGoToFormalExam)
        },
        cancleBtnCallBack: this.handleHideWarningPopup,
      },
      wpDCfg: {
        getCurrentPage: 'WarningPopup',
      },
      isShowNextD: false,
      nextTmp: {}, // 记录如果是 左侧跳题的3个index  pIdx qIdx oIdx
      nextDCfg: {
        getCurrentPage: 'common',
        needCancleIcon: false,
        titleIcon: 'attention',
        confirmBtnText: '确认',
        confirmBtnStyle: 'btn-green',
        cancleBtnText: '取消',
        cancleBtnStyle: 'btn-white',
        showBigTileFlag: false,
        showAssistTitleFlag: true,
        showAssistTitleText: '该题还未完成，确定进入下一题？',
        assistTitleStyle: 'big',
        confirmBtnCallBack: () => {
          this.isShowNextD = false
          if (typeof this.nextTmp.pIdx === 'number') {
            this.handleSelectQuestion(this.nextTmp.pIdx, this.nextTmp.qIdx, this.nextTmp.oIdx)
          } else {
            this.handleDoNext()
          }
        },
        cancleBtnCallBack: () => {
          this.nextTmp = {}
          this.isShowNextD = false
        },
      },
      tipsInfo: {
        text: '',
        top: 0,
        left: 0,
      }
    }
  },
  methods: {
    handleTips (text, ele) {
      this.tipsInfo = Object.assign({}, {
        top: ele ? (ele.top - 8 + 'px') : 0,
        left: ele ? (ele.right + 15 + 'px') : 0,
        text: text,
      })
    },
    idleCountDown () { // 10分钟无操作倒计时
      clearTimeout(this.idleTimeout)
      this.idleTimeout = setTimeout(() => {
        this.warningStatus = 4
        clearInterval(this.countdownInterval)
      }, 10 * 60 * 1000)
    },
    transformNum (n) {
      let num = '零一二三四五六七八九'
      let i = parseInt(n) + 1
      let g = num[i % 10]
      let s = Math.floor((i % 100) / 10) ? num[Math.floor((i % 100) / 10)] + '十' : ''
      let b = Math.floor(i / 100) ? num[Math.floor(i / 100)] + '百' : ''
      if (b && !s && g) s = num[0]
      return b + (s ? s.replace(/一/g, '') : '') + (g ? g.replace(/零/g, '') : '') + '、'
    },
    transformDetailScore () {
      const detail_score = this.detailScore
      const ds_tmp = []

      detail_score.forEach(ods => {
        ods.forEach(ds => {
          ds_tmp.push(ds)
        })
      })

      return JSON.stringify(ds_tmp)
    },
    handleSetDetail (obj) {
      this.explainParam = Object.assign({}, obj)
    },
    handleSetData (key, value) { // 通用设置参数
      this[key] = value
    },
    handleHideWarningPopup () { // 隐藏popup框
      const ws = this.warningStatus
      if (ws === 1 || ws === 4) {
        this.idleCountDown()
      }
      this.warningStatus = 0
    },
    handleQuitExam (evt) { // 退出测评二次确认
      evt.preventDefault()
      if (this.singleTopicType) this.handlePRStatusCheck('abandon', this.handleConfirmQuitExam)
      else this.warningStatus = 5
    },
    handleConfirmQuitExam () { // 确认退出
      const that = this
      const { competitionId, groupId, stageId, paperId, currentPartIndx,
        currentQuestionIdx, currentOptionIdx, remainTime } = that
      if (that.warningStatus === 5 || that.warningStatus === 4) { // 保存测评进度
        var indexObj = {
          paperId,
          remainTime,
          _index: currentPartIndx,
          _ix: currentQuestionIdx,
          _i: currentOptionIdx,
          dataFrom: 'web',
        }

        that.$api.savePaperAnswer({
          competitionId,
          stageId,
          groupId,
          paperId,
          ansNums: JSON.stringify([indexObj]),
          ansContents: this.transformDetailScore()
        }, (data) => {
          that.handleExamComplete()
          // alert('保存进度成功')
        })
      } else {
        that.handleExamComplete()
      }
    },
    handleGoToFormalExam () { // 切换模考模式
      // this.handleHideWarningPopup()
      // alert('去模考模式')
      const { competitionId, groupId, stageId, modelId } = this
      const stu = this.$store.state.student
      const query = 'competitionId=' + competitionId +
        '&groupId=' + groupId +
        '&stageId=' + stageId +
        '&modelId=' + modelId +
        '&user=' + stu.phone +
        '&name=' + encodeURIComponent(stu.name) +
        '&gender=' + stu.gender +
        '&stuSchool=' + encodeURIComponent(stu.school) +
        '&fromUrl=' + this.$route.query.fromUrl

      window.location.href = `/web/models/ExamFormal/index.php?${query}`
    },
    handleChangeModels (evt) { // 切换模考模式二次确认
      evt.preventDefault()
      this.warningStatus = 7
    },
    // handleLoadAudio () { // 预加载资源
    //   if (this.loadingCnt.length && new Date().getTime() - this.loadingStartTime < this.loadingTimeout) {
    //     let _url = this.loadingCnt.pop()

    //     this.$store.state.$player.load({
    //       url: _url.replace(/([^:])\/\//g, '$1/'),
    //       success: () => {
    //         this.loadingCount++
    //         setTimeout(() => {
    //           this.handleLoadAudio(this.loadingStartTime)
    //         });
    //       },
    //       error: () => {
    //         if (this.loadingFirst) {
    //           let _logParams = Object.assign({}, this.logParams, {
    //             action: '/errors/resource',
    //             logType: 0,
    //           })

    //           _logParams.pushParam = Object.assign({}, _logParams.pushParam, {
    //             msg: '下载试卷《' + this.logParams.pushParam.paperName + '》时，获取音频异常，音频地址：' + _url
    //           })

    //           this.writeLog(_logParams)
    //         }

    //         this.loadingErr.push(_url);
    //         setTimeout(() => {
    //           this.handleLoadAudio(this.loadingStartTime)
    //         })
    //       }
    //     });
    //   } else {
    //     this.handleLoadAudioEnd()
    //   }
    // },
    // 资源加载失败回调
    loadFail (failUrls) {
      let _logParams = Object.assign({}, this.logParams, {
        action: '/errors/resource',
        logType: 0,
      })
      _logParams.pushParam = `下载试卷《 ${this.logParams.pushParam.paperName} 》时，获取音频异常，音频地址：${failUrls.join('; ')}`
      this.writeLog(_logParams)
      this.loadFinllay()
    },
    loadEnd () {
      this.idleCountDown()
      this.$api.startCompetition({
        stageId: this.stageId,
        groupId: this.groupId,
        spendTime: this.competitionTime - this.remainTime
      })
      this.loadFinllay()
    },
    loadFinllay () {
      if (!this.singleTopicType) {
        this.$api.preload({
          paperId: this.list[0].paperId,
          totalNum: this.loadingTotal,
          loadedNum: this.loadingTotal - this.loadingCnt.length,
          secondTimes: Math.round((new Date().getTime() - this.loadingStartTime) / 1000)
        })
      }
    },
    // handleLoadAudioEnd () { // 预加载完成
    //   clearTimeout(this.loadingTimer)
    //   if (this.loadingCnt.length === 0) this.loadingFirst = false // 第一次加载完全部 - 用于log上传

    //   if (this.loadingCnt.length === 0 && this.loadingErr.length === 0) {
    //     this.loadingStatus = 'loaded'
    //     this.idleCountDown()
    //     this.$api.startCompetition({
    //       stageId: this.stageId,
    //       groupId: this.groupId,
    //       spendTime: this.competitionTime - this.remainTime
    //     })
    //   } else {
    //     if (this.loadingCnt.length === 0 && this.loadingErr.length !== 0) {
    //       this.loadingCount = this.loadingTotal - this.loadingErr.length
    //       this.loadingCnt = [].concat(this.loadingErr)
    //       this.loadingErr = []
    //     }
    //     this.loadingStatus = 'fail'
    //   }

    //   if (!this.singleTopicType) {
    //     this.$api.preload({
    //       paperId: this.list[0].paperId,
    //       totalNum: this.loadingTotal,
    //       loadedNum: this.loadingTotal - this.loadingCnt.length,
    //       secondTimes: Math.round((new Date().getTime() - this.loadingStartTime) / 1000)
    //     })
    //   }
    // },
    handlePreload () {
      // if (process.env.NODE_ENV === 'development' || this.skipLoad) {
      //   this.loadingStatus = 'loaded'
      //   this.loadEnd()
      // } else {
      this.loadingCnt = []
      this.loadingStartTime = new Date().getTime()
      this.initDoneScore()
      this.loadingTotal = this.loadingCnt.length
      // }
    },
    initDoneScore () {
      this.list.forEach((topicList, i) => {
        !!topicList.topicAudioRemark && this.loadingCnt.push(this.$config.resUrl + encodeURI(topicList.topicAudioRemark))

        const tid = topicList.topicTypeId
        if (topicList.topicList.length) {
          topicList.topicList.forEach((topic, j) => {
            topic.topicAttachment = !Array.isArray(topic.topicAttachment) && topic.topicAttachment ? JSON.parse(topic.topicAttachment) : topic.topicAttachment
            topic.topicOption = !Array.isArray(topic.topicOption) && topic.topicOption ? JSON.parse(topic.topicOption) : topic.topicOption
            if (Array.isArray(topic.topicAttachment) && topic.topicAttachment.length) {
              topic.topicAttachment.forEach((attachment, k) => {
                if (attachment.attachmentUrl && attachment.attachmentUrl.indexOf('.mp3') > -1) {
                  this.loadingCnt.push(this.$config.resUrl + encodeURI(attachment.attachmentUrl))
                }
              })
            }
            if (Array.isArray(topic.topicOption) && topic.topicOption.length) {
              topic.topicOption.forEach((option, k) => {
                if (option.audio && option.audio.attachmentUrl && option.audio.attachmentUrl.indexOf('.mp3') > -1) {
                  this.loadingCnt.push(this.$config.resUrl + encodeURI(option.audio.attachmentUrl))
                }
              })
            }

            // 初始化done和score
            topic.done = []
            topic.score = []
            if (['54', '73'].indexOf(tid) > -1) {
              topic.topicOption.forEach((option, k) => {
                topic.done[k] = []
                topic.score[k] = []
              })
            }
          })
        }
      })
    },
    // handleRetryPreload () { // 重新加载资源
    //   this.loadingStatus = 'loading'
    //   this.idleCountDown()
    //   this.loadingTimer = setTimeout(this.handleLoadAudioEnd, this.loadingTimeout)
    //   this.handleLoadAudio()
    // },
    initSubmitData () { // 预处理提交用数据
      this.list.forEach((topicList, i) => {
        this.detailScore[i] = []
        topicList.topicList.forEach((topic, j) => {
          let tmpStandardAudio = ''
          let tmpAnswer = []

          if (topic.topicAttachment && typeof topic.topicAttachment === 'string') topic.topicAttachment = JSON.parse(topic.topicAttachment)
          if (topic.topicOption && typeof topic.topicOption === 'string') topic.topicOption = JSON.parse(topic.topicOption)

          if (['47', '51', '52', '53', '54', '55', '19', '20', '21', '65', '66', '67', '68', '69', '72', '73', '74', '75', '76'].indexOf(topicList.topicTypeId) >= 0) {
            if (['51', '52', '53', '54', '73'].indexOf(topicList.topicTypeId) < 0) {
              tmpStandardAudio = topic.topicAttachment && topic.topicAttachment[0].attachmentUrl ? this.$config.resUrl + topic.topicAttachment[0].attachmentUrl : ''
            }

            if (['47', '71', '51', '52', '53', '20', '21', '67', '68', '69', '74', '75', '76'].indexOf(topicList.topicTypeId) >= 0) { // 有小题
              topic.topicOption.forEach((option, k) => {
                tmpAnswer.push('')
              })
              tmpAnswer = tmpAnswer.join(',')
            } else if (['54', '73'].indexOf(topicList.topicTypeId) >= 0) { // topicOption下还有optionList
              topic.topicOption.forEach((option, k) => {
                option.optionList.forEach((optionList, l) => {
                  tmpAnswer.push('')
                })
              })
              tmpAnswer = tmpAnswer.join(',')
            } else if (['55'].indexOf(topicList.topicTypeId) >= 0) { // 听对话后填空
              let tmpCount = parseInt(topic.topicOption[0].placeholder)
              for (let k = 0; k < tmpCount; k++) {
                tmpAnswer.push('')
              }
            } else if ([].indexOf(topicList.topicTypeId) >= 0) { // 填空题，答案#分隔
              topicList.alternativeAnswers.collection.forEach((collection, k) => {
                tmpAnswer.push('')
              })
            } else if ([].indexOf(topicList.topicTypeId) >= 0) { // 填空题，答案#分隔，多个答案
              tmpAnswer = {}
              topicList.alternativeAnswers.data.forEach((adt, k) => {
                tmpAnswer[adt.key] = []
                for (let l = 0; l < parseInt(adt.blanks); l++) {
                  tmpAnswer[adt.key].push('')
                }
              })
            } else {
              tmpAnswer = ''
            }

            this.detailScore[i][j] = {
              topicId: topic.topicID,
              topicTypeId: topic.topicType,
              standardAudio: tmpStandardAudio,
              myAnswer: tmpAnswer,
              isAudio: false,
              paperTopicScore: topic.topicScore,
              audioAnswerList: ''
            }
          } else {
            this.detailScore[i][j] = {
              topicId: topic.topicID,
              topicTypeId: topic.topicType,
              standardAnswer: '',
              standardAudio: topic.topicAttachment.length > 0 ? this.$config.resUrl + topic.topicAttachment[0].attachmentUrl : '',
              isAudio: true,
              paperTopicScore: topic.topicScore,
              myAnswer: '',
              audioAnswerList: []
            }

            if (['49'].indexOf(topicList.topicTypeId) >= 0) {
              let tmpCount = parseInt(topic.topicOption[0].placeholder)
              for (let k = 0; k < tmpCount; k++) {
                tmpAnswer.push('')
              }
              this.detailScore[i][j].myAnswer = tmpAnswer
            }

            if (['28', '16', '45', '47', '57', '22', '27', '71', '77'].indexOf(topicList.topicTypeId) >= 0) {
              console.log(i, j)
              topic.topicOption.forEach((topicOption, k) => {
                this.detailScore[i][j].audioAnswerList.push({
                  coreType: '',
                  score: '',
                  audioUrl: '',
                  standardAudio: '',
                  recordId: '',
                  attributes: ''
                })
              })
            } else {
              this.detailScore[i][j].audioAnswerList.push({
                coreType: '',
                score: '',
                audioUrl: '',
                standardAudio: '',
                recordId: '',
                attributes: ''
              });
            }
          }
        })
      })
    },
    handleRestart () { // 重新测评
      this.list = JSON.parse(JSON.stringify(this.paperInfo))
      this.cd = this.competitionTime
      this.initDoneScore()
      this.initSubmitData()
      this.currentPartIndx = this.currentOptionIdx = 0
      this.currentQuestionIdx = -1
      this.isLastQuestion = false

      this.$api.startCompetition({
        stageId: this.stageId,
        groupId: this.groupId,
        spendTime: this.competitionTime - this.cd
      })

      if (this.autoSaveId) {
        this.$api.delePaperAnswer({ autoSaveId: this.autoSaveId }, () => {
          this.autoSaveId = ''
        })
      }
    },
    handleSelectQuestion (partIdx, questionIdx, optionIdx) { // 在左侧栏选择题目
      this.idleCountDown()

      this.explain = false
      this.$refs.rightCpt.handleExamResult(false)

      const tid = this.list[partIdx].topicTypeId
      this.currentPartIndx = partIdx
      this.currentQuestionIdx = questionIdx
      this.currentOptionIdx = optionIdx

      this.$nextTick(() => {
        if (this.$refs.leftCpt.getCurrentIndex) this.currentTotalIdx = this.$refs.leftCpt.getCurrentIndex()
      })

      this.isLastQuestion = false
      if (partIdx === this.list.length - 1) {
        if (questionIdx === this.list[partIdx].topicList.length - 1) {
          if (['54', '71', '73'].indexOf(tid) > -1) {
            this.isLastQuestion = this.currentOptionIdx === this.list[this.currentPartIndx].topicList[this.currentQuestionIdx].topicOption.length - 1
          } else {
            this.isLastQuestion = this.handleCheckSplit(tid) && this.topicNeedCombine.indexOf(tid) < 0 ? this.currentOptionIdx === this.list[this.currentPartIndx].topicList[this.currentQuestionIdx].topicOption.length - 1 : true
          }
        }
      }
    },
    handlePRStatusCheck (action, callback) { // 播放、录音、评分中各按钮点击前置事件
      if (this.$store.state.PRStatus === 'waiting') {
        return false
      } else if (this.$store.state.PRStatus === 'idle') {
        typeof callback === 'function' && callback()
      } else if (this.$store.state.PRStatus === 'playing') {
        this.$refs.rightCpt.handlePRStopStatus(action === 'self')
        this.$nextTick(() => {
          this.$refs.rightCpt && this.$refs.rightCpt.handlePause && this.$refs.rightCpt.handlePause()
          this.$refs.rightCpt && this.$refs.rightCpt.handleReplayPause && this.$refs.rightCpt.handleReplayPause()
          this.$refs.explainCpt && this.$refs.explainCpt.handlePlayEnded && this.$refs.explainCpt.handlePlayEnded()
          this.$store.state.PRStatus = 'idle'
          typeof callback === 'function' && callback()
        })
      } else if (this.$store.state.PRStatus === 'recording') {
        if (action === 'abandon') { // 终止流程，放弃结果
          this.$refs.rightCpt.handlePRStopStatus()
          this.$store.state.$recorder.stop && this.$store.state.$recorder.stop()
          this.$store.state.PRStatus = 'idle'
          typeof callback === 'function' && callback()
        } else if (action === 'stop') { // 终止流程，保留结果,停留该题
          this.$store.state.$recorder.stop && this.$store.state.$recorder.stop()
        }
      } else if (this.$store.state.PRStatus === 'scoring') {
        if (action === 'abandon') { // 终止流程，放弃结果
          this.$refs.rightCpt.handleAbandonScore()
        } else if (action === 'tip') { // 提示正在评分
          this.$refs.rightCpt.handleToggleScoringTip(true)
        }
      }
    },
    handleCheckSplit (tid) {
      return this.topicNeedSplit.indexOf(tid) >= 0
    },
    handleNext (pIdx, qIdx, oIdx, isClick) { // 有参数为左侧点击跳题，无则为点击下一题
      if (typeof pIdx !== 'number' && this.isLastQuestion && !this.singleTopicType) {
        this.handleSubmit(false)
      } else {
        const partIdx = this.currentPartIndx
        const questionIdx = this.currentQuestionIdx
        const optionIdx = this.currentOptionIdx
        const tid = this.list[partIdx].topicTypeId

        this.$refs.rightCpt.handlePRStopStatus()
        this.$refs.rightCpt.handlePause()
        this.$store.state.$recorder.stop && this.$store.state.$recorder.stop()
        this.$store.state.PRStatus = 'idle'

        this.explain = false

        if (questionIdx >= 0) {
          if (this.topicNeedCombine.indexOf(tid) >= 0) {
            let allOK = true
            if (['54', '73'].indexOf(tid) > -1) {
              for (let i = 0; i < this.list[partIdx].topicList[questionIdx].topicOption[optionIdx].optionList.length; i++) {
                if (!this.list[partIdx].topicList[questionIdx].done[optionIdx][i]) {
                  allOK = false
                  break
                }
              }
            } else {
              for (let i = 0; i < this.list[partIdx].topicList[questionIdx].topicOption.length; i++) {
                if (!this.list[partIdx].topicList[questionIdx].done[i]) {
                  allOK = false
                  break
                }
              }
            }
            if (['71'].indexOf(tid) > -1 && !isClick) {
              if (this.list[partIdx].topicList[questionIdx].done[optionIdx]) {
                allOK = true
              }
            }
            if (allOK) {
              if (typeof pIdx === 'number') this.handleSelectQuestion(pIdx, qIdx, oIdx)
              else this.handleDoNext()
            } else {
              this.nextTmp = {
                pIdx: pIdx,
                qIdx: qIdx,
                oIdx: oIdx,
              }
              this.isShowNextD = true
            }
          } else {
            if (this.list[partIdx].topicList[questionIdx].done && this.list[partIdx].topicList[questionIdx].done[optionIdx]) {
              if (typeof pIdx === 'number') this.handleSelectQuestion(pIdx, qIdx, oIdx)
              else this.handleDoNext()
            } else {
              this.nextTmp = {
                pIdx: pIdx,
                qIdx: qIdx,
                oIdx: oIdx,
              }
              this.isShowNextD = true
            }
          }
        } else {
          if (typeof pIdx === 'number') {
            if (typeof this.savedQIdx === 'number') {
              this.savedQIdx = ''
              this.savedOIdx = ''
            }
            this.handleSelectQuestion(pIdx, qIdx, oIdx)
          } else {
            if (typeof this.savedQIdx === 'number') {
              this.currentQuestionIdx = this.savedQIdx > -1 ? this.savedQIdx : (this.savedQIdx + 1)
              this.currentOptionIdx = this.savedOIdx
              this.savedQIdx = ''
              this.savedOIdx = ''

              this.$nextTick(() => {
                if (this.$refs.leftCpt.getCurrentIndex) this.currentTotalIdx = this.$refs.leftCpt.getCurrentIndex()
              })

              this.isLastQuestion = false
              if (this.currentPartIndx === this.list.length - 1) {
                if (this.currentQuestionIdx === this.list[this.currentPartIndx].topicList.length - 1) {
                  // stc 添加54, 73 解决bug#20607
                  if (['54', '71', '73'].indexOf(tid) > -1) {
                    this.isLastQuestion = this.currentOptionIdx === this.list[this.currentPartIndx].topicList[this.currentQuestionIdx].topicOption.length - 1
                  } else {
                    this.isLastQuestion = this.handleCheckSplit(tid) && this.topicNeedCombine.indexOf(tid) < 0 ? this.currentOptionIdx === this.list[this.currentPartIndx].topicList[this.currentQuestionIdx].topicOption.length - 1 : true
                  }
                }
              }
            } else {
              this.handleDoNext()
            }
          }
        }
      }
    },
    handleDoNext () { // 下一题
      this.idleCountDown()

      this.nextTmp = {}

      if (this.isLastQuestion && this.singleTopicType) {
        this.isLastQuestion = false
        this.handleNextPage()
      } else {
        const partIdx = this.currentPartIndx
        const questionIdx = this.currentQuestionIdx
        const optionIdx = this.currentOptionIdx
        const tid = this.list[partIdx].topicTypeId

        if (this.handleCheckSplit(tid) && questionIdx >= 0 && (this.topicNeedCombine.indexOf(tid) < 0 || tid === '54' || tid === '73')) {
          if (optionIdx === this.list[partIdx].topicList[questionIdx].topicOption.length - 1) {
            if (questionIdx === this.list[partIdx].topicList.length - 1) {
              this.currentPartIndx += 1
              this.currentQuestionIdx = -1
            } else {
              this.currentQuestionIdx += 1
            }
            this.currentOptionIdx = 0
          } else {
            this.currentOptionIdx += 1
          }
        } else {
          this.currentOptionIdx = 0
          if (questionIdx === this.list[partIdx].topicList.length - 1) {
            this.currentPartIndx += 1
            this.currentQuestionIdx = -1
          } else {
            this.currentQuestionIdx += 1
          }
        }

        this.$nextTick(() => {
          if (this.$refs.leftCpt.getCurrentIndex) this.currentTotalIdx = this.$refs.leftCpt.getCurrentIndex()
        })

        this.isLastQuestion = false
        if (this.currentPartIndx === this.list.length - 1) {
          if (this.currentQuestionIdx === this.list[this.currentPartIndx].topicList.length - 1) {
            // stc 添加54, 73 解决bug#20607
            if (['54', '71', '73'].indexOf(tid) > -1) {
              this.isLastQuestion = this.currentOptionIdx === this.list[this.currentPartIndx].topicList[this.currentQuestionIdx].topicOption.length - 1
            } else {
              this.isLastQuestion = this.handleCheckSplit(tid) && this.topicNeedCombine.indexOf(tid) < 0 ? this.currentOptionIdx === this.list[this.currentPartIndx].topicList[this.currentQuestionIdx].topicOption.length - 1 : true
            }
          }
        }
      }
    },
    handleNextPage () {
      if (this.singleTopicPage === this.totalPage) {
        this.submitStatus = 2
        this.explain = false
      } else {
        this.loadingTotal = 0
        this.loadingCount = 0
        this.$router.push({
          name: 'exam',
          query: {
            idx: 0,
            page: this.singleTopicPage + 1,
            from: this.singleTopicType,
            fromUrl: this.$route.query.fromUrl,
          }
        })
      }
    },
    handleDoUndo () { // 继续做未完成的题目
      let allNum = document.querySelectorAll('.left .list .number')
      let doneNum = document.querySelectorAll('.left .list .number.done')

      this.warningStatus = 6

      for (let i = 0; i < allNum.length; i++) {
        for (let j = 0; j < doneNum.length; i++) {
          if (doneNum[j] !== allNum[i]) {
            allNum[i].click()
            return
          }
        }
      }
    },
    handleSubmit (timeout) { // 交卷
      clearTimeout(this.idleTimeout)

      this.$refs.rightCpt.handlePRStopStatus()
      this.$store.state.$player.stop && this.$store.state.$player.stop()
      this.$store.state.$recorder.stop && this.$store.state.$recorder.stop()
      this.$store.state.PRStatus = 'idle'

      this.allCount = 0
      this.undoCount = 0

      if (timeout) {
        if (this.submitStatus === 0) {
          this.handleConfirmSubmit()
        }
      } else {
        let allNum = document.querySelectorAll('.left .list .number')
        let doneNum = document.querySelectorAll('.left .list .number.done')

        this.undoCount = allNum.length - doneNum.length

        if (this.undoCount > 0) {
          this.warningStatus = 1
        } else this.handleConfirmSubmit()
      }
    },
    handleConfirmSubmit () { // 确认交卷
      let timeout = false
      this.warningStatus = 0
      this.submitStatus = 1
      this.$store.state.PRStatus = 'waiting'

      const submitTimeout = setTimeout(() => {
        timeout = true
        this.submitStatus = 0
        this.$store.state.PRStatus = 'idle'
        this.$refs.rightCpt.handleToast({
          isShow: true,
          type: 'noIcon',
          text1: '〒▽〒',
          text2: '哎呀！交卷失败 ，请重试下~'
        })
      }, 60 * 1000)

      const { groupId, stageId, paperId,
        allCount, undoCount, remainTime } = this
      const competition_time = this.competitionTime - (remainTime < 0 ? 0 : remainTime)
      const addons = {
        failCallback () {
          this.submitStatus = 0
          this.$store.state.PRStatus = 'idle'
        }
      }
      this.$api.submitPaperAnswer({
        groupId,
        stageId,
        paperId,
        totalQuestions: allCount,
        missAnswer: undoCount,
        completeQuestions: allCount - undoCount,
        answerJSON: this.transformDetailScore(),
        mail: this.$store.state.student.email,
        phone: this.$store.state.student.phone,
        competition_time
      }, (data) => {
        if (!timeout) {
          clearInterval(this.countdownInterval)
          clearTimeout(submitTimeout)

          let fullScore = parseInt(data.full_score)
          this.score = data.total_score
          this.scoreRate = parseInt(this.score / fullScore * 10000) / 100
          this.best = data.highest_score
          this.rank = data.current_ranking
          this.minute = Math.ceil(competition_time / 60)
          this.submitStatus = 2
          this.explain = false
          this.canRestart = parseInt(data.remain_times) > 0

          this.$store.state.PRStatus = 'idle'

          if (this.autoSaveId) {
            this.$api.delePaperAnswer({ autoSaveId: this.autoSaveId }, () => {
              this.autoSaveId = ''
            })
          }
        }
      }, addons)
    },
    handleAgain () { // 再练一次
      this.submitStatus = 0
      this.hasProgress = false
      this.handleRestart()
    },
    handleGoToRank () {
      window.open(this.$util.urlSet.rank + '?gId=' + this.groupId + '&sId=' + this.stageId)
    },
    handleExamComplete () {
      let fromUrl = this.$route.query.fromUrl
      if (fromUrl) {
        window.location.href = decodeURIComponent(fromUrl).replace(/{{q}}/g, '?').replace(/{{a}}/g, '&')
      } else {
        this.$router.push({ name: 'stuIndex' })
      }
    },
    handleOpenExplain () { // 展开解析
      this.explain = true
    },
    handleCloseExplain () { // 关闭解析
      this.explain = false
    },
    handleStopExplainPlay () {
      this.$refs.explainCpt.handlePlayEnded()
    },
    handleDoneScore (question, tid, scoreInfo, score, err, oidx) {
      if (!question.done) question.done = []
      if (!question.score) question.score = []

      let oIdx = typeof oidx === 'number' ? oidx : this.currentOptionIdx

      if (!scoreInfo.isAudio) {
        if (['54', '71', '73'].indexOf(tid) > -1) {
          let myAnswer = scoreInfo.myAnswer.split(',')
          let _i = 0
          question.topicOption.forEach((item, i) => {
            this.$set(question.done, i, [])
            item.optionList.forEach((ol, j) => {
              if (myAnswer[_i] !== '') {
                this.$set(question.done[i], j, true)
              }
              _i++
            })
            this.$set(question.score, i, score)
          })
        } else if (typeof scoreInfo.myAnswer === 'string') {
          let myAnswer = scoreInfo.myAnswer.split(',')
          myAnswer.forEach((a, i) => {
            if (a !== '') this.$set(question.done, i, true)
          })
          question.topicOption.forEach((item, i) => {
            this.$set(question.score, i, score)
          })
        } else {
          let myAnswer = scoreInfo.myAnswer
          let isDone = false
          myAnswer.forEach((item, i) => {
            if (item !== '') isDone = true
          })
          this.$set(question.done, oIdx, isDone)
          this.$set(question.score, oIdx, score)
        }
      } else {
        if (tid === '49' && oIdx === 0) {
          let myAnswer = scoreInfo.myAnswer
          let isDone = false
          myAnswer.forEach((item, i) => {
            if (item !== '') isDone = true
          })
          this.$set(question.done, oIdx, isDone)
          this.$set(question.score, oIdx, score)
        } else {
          if (!err) this.$set(question.done, oIdx, true)
          this.$set(question.score, oIdx, score)
        }
      }
    },
    handleSetAnswer (scoreInfo, score, err, notRecord) { // 设置回答
      const partIdx = this.currentPartIndx
      const questionIdx = this.currentQuestionIdx
      const optionIdx = this.currentOptionIdx
      const tid = this.list[partIdx].topicTypeId

      const part = this.list[partIdx]
      const question = part.topicList[questionIdx]

      this.handleDoneScore(question, tid, scoreInfo, score, err)

      this.list.splice(partIdx, 1, part)

      if (!this.detailScore[partIdx][questionIdx].isAudio) {
        for (let key in scoreInfo) {
          if (key === 'audioAnswerList') {
            for (let keyy in scoreInfo[key][0]) {
              this.$set(this.detailScore[partIdx][questionIdx][key][0], keyy, scoreInfo[key][0][keyy])
            }
          } else {
            this.$set(this.detailScore[partIdx][questionIdx], key, scoreInfo[key])
          }
        }
      } else if (tid === '49') {
        for (let key in scoreInfo) {
          if (key === 'audioAnswerList') {
            for (let keyy in scoreInfo[key][0]) {
              this.$set(this.detailScore[partIdx][questionIdx][key][0], keyy, scoreInfo[key][0][keyy])
            }
          } else {
            this.$set(this.detailScore[partIdx][questionIdx], key, scoreInfo[key])
          }
        }
      } else { // 提取音频题目最高分
        if (this.detailScore[partIdx][questionIdx].audioAnswerList[optionIdx].score === '' || parseInt(this.detailScore[partIdx][questionIdx].audioAnswerList[optionIdx].score) <= parseInt(scoreInfo.audioAnswerList[optionIdx].score)) {
          for (let key in scoreInfo) {
            if (key === 'audioAnswerList') {
              scoreInfo[key].forEach((aal, k) => {
                for (let keyy in aal) {
                  this.$set(this.detailScore[partIdx][questionIdx][key][k], keyy, aal[keyy])
                }
              })
            } else {
              this.$set(this.detailScore[partIdx][questionIdx], key, scoreInfo[key])
            }
          }
        }
      }

      console.info(this.detailScore)
    },
    handleInitSingleList () {
      this.isSingleTopic = true
      this.currentPartIndx = this.singleTopicIdx || 0
      this.currentQuestionIdx = -1
      this.currentOptionIdx = 0

      if (this.singleTopicType === '1') {
        this.examName = this.logParams.pushParam.paperName = '低分集'
        this.$api.lowScorePractice({
          currentPage: this.singleTopicPage || 1
        }, (res) => {
          this.handleSingleTopicList(res)
        })
      } else if (this.singleTopicType === '2') {
        this.examName = this.logParams.pushParam.paperName = '收藏本'
        this.$api.collectionsPractice({
          currentPage: this.singleTopicPage || 1
        }, (res) => {
          this.handleSingleTopicList(res)
        })
      } else if (this.singleTopicType === '3') {
        this.examName = this.logParams.pushParam.paperName = '话题项目'
        this.$api.htxmList({
          page: this.singleTopicPage || 1
        }, (res) => {
          this.handleSingleTopicList(res)
        })
      } else if (this.singleTopicType === '4') {
        this.examName = this.logParams.pushParam.paperName = '视听说'
        this.$api.stsList({
          page: this.singleTopicPage || 1,
          rows: 10
        }, (res) => {
          this.handleSingleTopicList(res)
        })
      } else if (this.singleTopicType === '5') {
        this.examName = this.logParams.pushParam.paperName = '口头作文'
        this.$api.cjzwList({
          page: this.singleTopicPage || 1,
          rows: 10
        }, (res) => {
          this.handleSingleTopicList(res)
        })
      }
    },
    handleSingleTopicList (res) {
      let tmparr = []

      this.list = Object.assign({}, res).list
      if (this.list.length > 0) {
        this.cd = ''
        this.handlePreload()
        this.initSubmitData()
        this.totalPage = Math.ceil(parseInt(typeof res.pageInfo.count !== 'undefined' ? res.pageInfo.count : res.pageInfo.total) / parseInt(res.pageInfo.rows))

        this.list.forEach((topicList, i) => {
          tmparr.push({
            topicId: topicList.topicList[0].topicID,
            // subTopic: topicList.topicList[0].subTopic || 0
          })
        })

        this.$api.checkIsCollection({ // 判断是否收藏
          topicData: JSON.stringify(tmparr)
        }, (res) => {
          this.list.forEach((topicList, i) => {
            this.$set(topicList.topicList[0], 'isCollection', res[i].isCollection)
          })
        })
      } else {
        this.submitStatus = 2
        this.explain = false
      }
    },
    initTotalIdx (idx) {
      this.currentTotalIdx = idx
    },
    initPage () {
      let { competitionId, groupId, stageId, modelId, idx, page, from, skipLoad, isTSKS } = this.$route.query
      this.competitionId = competitionId
      this.groupId = groupId
      this.stageId = stageId
      this.modelId = modelId
      this.skipLoad = skipLoad
      this.isTSKS = isTSKS

      this.singleTopicIdx = parseInt(idx)
      this.singleTopicPage = parseInt(page) || 1
      this.singleTopicType = from // 1 低分集 2 收藏本 3 话题项目 4 视听说 5 口头作文

      if (this.singleTopicType) {
        this.handleInitSingleList()
      } else {
        this.$api.getCompetitionInfo({
          competitionId: this.competitionId,
          studentId: this.$store.state.student.name,
        }, (res) => {
          this.examName = res.competitionName

          this.published = res.show_time_flag !== '1' // 1为定时发布 2 完成小题（有实时出成绩） 3 完成整卷（无实时出成绩）
          this.showTimeFlag = res.show_time_flag === '2'
          this.canRepeat = res.is_repeat === '1'
          this.isReport = res.isShowReport
          this.showRanking = res.show_ranking
          this.competitionType = res.competition_type
          this.answerPrecess = res.answer_process
          this.showTime = res.show_time ? (res.show_time.substring(0, 10).replace(/([0-9]*)-0?([0-9]*)-0?([0-9]*)/g, '$1年$2月$3日') + res.show_time.substring(10, 16)) : ''

          this.$api.getPaperAnswer({ // 获取进度
            competitionId: this.competitionId,
            stageId: this.stageId,
            groupId: this.groupId,
          }, (data) => {
            if (data && data.ansNums) { // 如果有进度
              const { _index, _ix, _i, remainTime } = data.ansNums[0]
              this.currentPartIndx = _index
              this.savedQIdx = _ix
              this.savedOIdx = _i || 0
              this.currentQuestionIdx = -1
              this.currentOptionIdx = 0
              this.cd = remainTime
              this.paperId = data.paperId || ''
              this.autoSaveId = data.autoSaveId
              this.hasProgress = true

              this.$api.getPaperInfo({
                competitionId: this.competitionId,
                stageId: this.stageId,
                groupId: this.groupId,
                paperId: this.paperId || '',
              }, (res) => {
                if (res.length > 0) {
                  this.paperId = res[0].paperId
                  this.list = JSON.parse(JSON.stringify(res))
                  this.paperInfo = JSON.parse(JSON.stringify(res))
                  this.logParams.pushParam.paperName = res[0].paperName
                  this.competitionTime = Number(res[0].competitionTime) * 60
                  this.modelId = res[0].modeId
                  this.handlePreload()
                  this.initSubmitData()

                  // 回填detailScore
                  let idx = -1
                  this.detailScore.forEach((outer, i) => {
                    outer.forEach((inner, k) => {
                      idx += 1
                      this.detailScore[i][k] = data.ansContents[idx]
                    })
                  })
                  console.log(this.detailScore)

                  // 回填done和score
                  this.detailScore.forEach((detailScore, i) => {
                    detailScore.forEach((ds, j) => {
                      const question = this.list[i].topicList[j]
                      const tid = this.list[i].topicTypeId

                      if (ds.isAudio) {
                        if (tid === '49') {
                          question.topicOption.forEach((to, k) => {
                            if (k === 0) {
                              this.handleDoneScore(question, tid, ds, '', '', k)
                            } else {
                              if (ds.audioAnswerList[0].recordId) this.handleDoneScore(question, tid, ds, ds.audioAnswerList[0].score, '', k)
                            }
                          })
                        } else {
                          ds.audioAnswerList.forEach((aal, k) => {
                            if (aal.recordId) this.handleDoneScore(question, tid, ds, aal.score, '', k)
                          })
                        }
                      } else {
                        if (['54', '71', '73'].indexOf(tid) > -1) {
                          question.topicOption.forEach((to, k) => {
                            this.handleDoneScore(question, tid, ds, '', '', k)
                          })
                        } else {
                          if (typeof ds.myAnswer === 'string') {
                            let _myAnswer = ds.myAnswer.split(',')
                            _myAnswer.forEach((ma, k) => {
                              if (ma) this.handleDoneScore(question, tid, ds, '', '', k)
                            })
                          } else {
                            ds.myAnswer.forEach((ma, k) => {
                              if (ma) this.handleDoneScore(question, tid, ds, '', '', k)
                            })
                          }
                        }
                      }
                    })
                  })
                } else {
                  this.$store.commit('showErrDialog', {
                    errText: '试卷内容为空',
                    btnText: this.$t('dialog.iknow')
                  })
                }
              })
            } else {
              this.autoSaveId = ''
              this.$api.getPaperInfo({
                competitionId: this.competitionId,
                stageId: this.stageId,
                groupId: this.groupId,
                paperId: this.paperId || '',
              }, (res) => {
                this.paperId = res[0].paperId
                this.list = JSON.parse(JSON.stringify(res))
                this.paperInfo = JSON.parse(JSON.stringify(res))
                this.logParams.pushParam.paperName = res[0].paperName
                this.cd = this.competitionTime = Number(res[0].competitionTime) * 60
                this.modelId = res[0].modeId
                this.handlePreload()
                this.initSubmitData()
              })
            }
          })
        })
      }
    },
  },
  computed: {
    handleShowChangeMode () {
      return !this.singleTopicType && this.modelId && this.modelId !== '1' && (this.isTSKS || this.competitionType === '2' || (this.competitionType === '4' && this.answerPrecess === '3'))
    },
    handleShowWarning: function () {
      return this.warningStatus !== 0 && [1, 6, 7].indexOf(this.warningStatus) < 0
    },
    topicTypcCount () {
      return this.list.length
    },
    topicCount () {
      let count = 0
      for (let i = 0; i < this.list.length; i++) {
        count += this.list[i].topicList.length
      }

      return count
    },
    progressPer () {
      return this.loadingTotal ? Math.round(this.loadingCount / this.loadingTotal * 100) : 0
    }
  },
  watch: {
    warningStatus (val) {
      if (val === 2) {
        this.wpDCfg = {
          cancel: 'false',
          icon: '/static/images/practice/exam/ic_frame01.png',
          text1: '呀，这个内容有问题，先做下一题吧',
          text2: '错误码：41030',
          btn1: '我知道了',
          callback1: this.handleHideWarningPopup,
        }
      } else if (val === 3) {
        this.wpDCfg = {
          getCurrentPage: 'WarningPopup',
          cancel: 'false',
          icon: '/static/images/practice/exam/ic_frame02.png',
          text1: '评分失败，请联系客服',
          text2: '错误码：41030',
          btn1: '我知道了',
          callback1: this.handleHideWarningPopup,
        }
      } else if (val === 4) {
        this.wpDCfg = {
          getCurrentPage: 'WarningPopup',
          icon: '/static/images/practice/exam/ic_frame03.png',
          text1: '我等你好久啦~还要继续答题吗？',
          btn1: '继续答题',
          btn2: '不答了',
          callback1: () => {
            this.$refs.leftCpt.handleStartCountDown()
            this.handleHideWarningPopup()
          },
          callback2: () => {
            this.handlePRStatusCheck('abandon', this.handleConfirmQuitExam)
          },
          onHide: this.handleHideWarningPopup,
        }
      } else if (val === 5) {
        this.wpDCfg = {
          getCurrentPage: 'WarningPopup',
          icon: '/static/images/practice/exam/ic_frame04.png',
          text1: '你确定退出吗？',
          text2: '保留练习进度和成绩',
          btn1: '暂不退出',
          btn2: '退出',
          callback1: this.handleHideWarningPopup,
          callback2: () => {
            this.handlePRStatusCheck('abandon', this.handleConfirmQuitExam)
          },
          onHide: this.handleHideWarningPopup,
        }
      }
    },
    '$route.query': function () {
      this.loadingStatus = 'loading'
      this.initPage()
    },
  },
  beforeMount () {
    this.loadingStatus = 'loading'
    this.$store.state.PRStatus = 'idle'
  },
  mounted () {
    this.initPage()
  }
}
</script>

<style lang='less'>
#stu-practice {
  background-color: #bceaf8;
}

#stu-practice-exam {
  height: 600px;
}

@media screen and (min-height: 800px) {
  #stu-practice-exam {
    height: 690px;
  }
}

#stu-practice-exam-root {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .popup3 {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 10;
    width: 350px;
    height: 180px;
    padding: 0 25px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #fff;
    transform: translate(-50%, -50%);

    .text1 {
      margin: 15px 0 25px;
    }

    & > div {
      display: flex;
      color: #666;
      line-height: 25px;

      div {
        width: 25px;
        height: 25px;
        margin: 0 4px;
        border: 1px solid #ccc;
        border-radius: 2px;
      }
    }

    button {
      display: block;
      width: 100px;
      height: 34px;
      margin: 25px auto 0;
      border: 0;
      border-radius: 17px;
      color: #fff;
      text-align: center;
      line-height: 34px;
      background-color: #ff9900;
      cursor: pointer;
    }
  }

  #stu-practice-exam {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    width: 1200px;
    border-radius: 20px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    // overflow: hidden;

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;

      & > div {
        width: 636px;
        height: 326px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        .title {
          line-height: 30px;
          margin: 18px auto 74px;
        }

        .progressBox {
          margin-top: 80px;
          display: flex;
          justify-content: center;
          align-items: center;

          .progressBarBG {
            width: 500px;
            height: 20px;
            border-radius: 10px;
            background-color: rgba(232, 248, 241, 0.9);
            margin-right: 18px;
            float: left;

            .progressBar {
              height: 20px;
              border-radius: 10px;
              position: relative;
              background: url(/static/images/practice/ic_loadingline.png) repeat-x top
                right;

              .progressIcon {
                width: 70px;
                height: 70px;
                position: absolute;
                top: -80px;
                right: 0;
              }
            }
          }

          .progressText {
            line-height: 20px;
            display: inline-block;
          }
        }
        .contentDetail,
        button {
          margin-top: 42px;
        }
      }
    }

    .result {
      position: relative;
      z-index: 2;
      height: 100%;
    }

    .exam {
      height: 100%;
      display: flex;
      flex-direction: column;
      border-radius: 20px;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 70px;
        padding: 0 30px;
        background-color: #24cc7c;
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;

        .title {
          width: 800px;
          color: #fff;
          font-size: 18px;
        }

        & > div {
          display: flex;

          a {
            padding-left: 32px;
            color: #fff;
            font-size: 16px;
            line-height: 30px;
            background-image: url('/static/images/practice/exam/icon_head30x30.png');
            background-repeat: no-repeat;

            &.quit {
              background-position-y: 0;
              &:hover {
                background-position-y: -30px;
              }
            }

            &.change {
              background-position-y: -60px;
              &:hover {
                background-position-y: -90px;
              }
            }
          }

          .divide {
            height: 30px;
            margin: 0 15px;
            border-left: 1px solid rgba(255, 255, 255, 0.2);
          }
        }
      }

      .main {
        display: flex;
        flex: 1;
        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;

        .left {
          width: 250px;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
          border-bottom-left-radius: 20px;
        }

        .right {
          flex: 1;
          border-bottom-right-radius: 20px;
        }
      }
    }
  }

  .report {
    position: relative;
    top: -30px;
    left: 0;
    z-index: 1;
    width: 100%;
    background-color: #fff;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 400ms;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  /* 由于UI里面组件样式是懒加载，所以暂时先冗余一份，后期优化 */
  .warning-popup {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);

    & > div {
      position: relative;
      width: 400px;
      height: 250px;
      padding-top: 80px;
      border-radius: 20px;
      background-color: #fff;

      img {
        position: absolute;
        top: -86px;
        left: 85px;
        width: 230px;
        height: 150px;
      }

      .close {
        position: absolute;
        top: -16px;
        right: -22px;
        width: 50px;
        height: 50px;
        background-image: url('/static/images/practice/exam/btn_frameclose.png');
        cursor: pointer;
      }

      p {
        margin: 0;
        text-align: center;

        &.text1 {
          margin: 0;
          height: 30px;
          color: #333;
          font-size: 20px;
          line-height: 30px;
        }

        &.text2 {
          height: 24px;
          color: #999;
          line-height: 24px;
        }
      }

      div {
        margin-top: 36px;
        text-align: center;

        button {
          width: 140px;
          height: 50px;
          margin: 0 20px;
          border: 0;
          border-radius: 25px;
          color: #fff;
          font-size: 18px;
          text-align: center;
          line-height: 50px;
          cursor: pointer;

          &.grey {
            background-color: #7c94a8;
          }

          &.orange {
            background-color: #ff881b;
          }
        }
      }
    }
  }

  .tips {
    position: absolute;
    top: -10px;
    left: 35px;
    width: 200px;
    padding: 10px;
    border-radius: 4px;
    color: #fff;
    font-style: normal;
    font-size: 12px;
    line-height: 18px;
    background: rgba(36, 204, 124, 0.8);
    z-index: 4;

    p {
      font-size: 12px;
      color: #fff;
    }

    &:after {
      content: '';
      position: absolute;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-right: 10px solid rgb(36, 204, 124);
      opacity: 0.8;
      top: 9px;
      left: -10px;
    }
  }
}
</style>
