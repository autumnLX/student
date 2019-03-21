<template lang="pug">
  #exam-detail
    .section(ref='nav')
      Nav(:list='nav')
      .overview
        img(:src='$config.resUrl + cover')
        div
          div.text1 {{ competitionName }}
          div.text2
            div.text2-1.text-with-icon
              i
              | {{ joinNum }}{{ $t('Stu.StuExamDetail.join') }}
            div.text2-2.text-with-icon
              i
              | {{ stageName }}
          div.text3.text-with-icon
              i
              | {{ countdown.replace(/(\d+)/, ' $1 ') }}
          div.btns
            button.btn(:class='"btn-" + examBtnType' @click='handleClickExamBtn') {{ examBtnText }}
            button.btn.btn-outline-green(v-if='showReportBtn' @click='gotoReport') {{ $t('Stu.StuExamDetail.rBtnFree') }}
            span(v-if='cStatus == 3 && subTime <= 10 && subTime > 0')
              |  {{ $t('Stu.StuExamDetail.subTimeL') }}
              span {{ subTime }}
              |  {{ $t('Stu.StuExamDetail.subTimeR') }}
            span(v-if='cStatus == 3 && subTime <= 10 && subTime == 0') {{ $t('Stu.StuExamDetail.noSubTime') }}
    .section(:style='{ "margin-top": "10px", "min-height": loadingHeight} ')
      Tab(:list='tab' :onChangeTab='handleChangeTab')
      Detail(v-if='tabIdx === 0' :info='detail')
      Rank(v-else :info='rankInfo' :onPageTurning='handlePageTurning')
    Dialog(:dialogConfig='PDCfg' :isShowDialog='paymentDialogType === "payment"')
    Dialog(:dialogConfig='PTipCfg' :isShowDialog='paymentDialogType === "tip"')
    Dialog(:dialogConfig='PFCfg' :isShowDialog='paymentDialogType === "fail"')
    Dialog(:dialogConfig='PSCfg' :isShowDialog='paymentDialogType === "success"')
    Dialog(:dialogConfig='saveLastestCfg' :isShowDialog='isShowLastedPD' ref='dialogParam')
</template>

<script>
/**
 * 测评详情
 */
import Detail from './Detail'
import Rank from './Rank'

const getTabCfg = (idx = 0) => {
  const tabCfg = [
    {
      title: '详情',
      value: 'exam'
    }, {
      title: '排名',
      value: 'rank'
    }
  ]
  tabCfg[idx].selected = true
  return tabCfg
}

const PDCfg = {
  getCurrentPage: 'payment',
}

const PTipCfg = {
  getCurrentPage: 'paymentTip',
}

const PFCfg = {
  getCurrentPage: 'paymentFail',
}

const PSCfg = {
  getCurrentPage: 'common',
  titleIcon: 'success',
  showConfirmleBtn: false,
  cancleBtnStyle: 'btn-green',
  showBigTileFlag: false,
  assistTitleStyle: 'big'
}

const saveLastestCfg = {
  getCurrentPage: 'common',
  needCancleIcon: false,
  confirmBtnText: '继续测评',
  cancleBtnText: '暂不测评',
  cancleBtnStyle: 'btn-white no-course',
  showBigTileText: '温馨提示',
  confirmBtnStyle: 'btn-green no-course',
  titleIcon: '',
  assistTitleStyle: 'big',
  bigTileStyle: 'green',
  isNONTipAgain: true // 是否需要不在提醒功能
}

const _payInfo = {
  competition_name: '',
  report_template: '',
  subject: '考试费用',
  body: '商品描述',
  price: '1.00',
  group_id: '',
  stage_id: '',
  student_id: '',
}

export default {
  name: 'ExamInfo',
  components: { Detail, Rank },
  data () {
    return {
      nav: [{
        title: this.$t('Stu.nav.index'),
        href: 'stuIndex'
      }],
      tab: getTabCfg(),
      tabIdx: 0,
      loadingHeight: 'auto',
      cInfo: {}, // competitionInfo
      cover: '', // 大赛海报
      cStatus: '', // competitionInfo.status
      competitionName: '',
      showReportBtn: false, // 是否显示报告按钮
      stageName: '',
      isShowLastedPD: false,
      signupCost: '', // 费用
      reportStageId: '',
      showDateFlag: '',
      isReportFree: '',
      hasReportPay: '',
      competitionType: '', // 测评类型
      answerProcess: '', // 模式： 1 模考模式
      groupId: '', // 分组id
      stageId: '', // 阶段id
      competitionId: '', // 大赛id
      competitionModeId: '', // 用于正式考试的判断
      joinNum: '', // 参与人数
      countdown: '', // 倒计时
      subTime: '-', // 剩余提交次数
      examBtnStatus: '', // 测评按钮状态 disabled noGroup needPay needSignUp toExam
      examBtnText: '', // 测评按钮文字
      examBtnType: 'green', // 测评按钮class text green disabled
      detail: {
        introduce: ''
      },
      rankInfo: {
        myself: {},
        list: []
      },
      paymentDialogType: '', // payment tip fail success
      PDCfg: Object.assign({}, PDCfg),
      PTipCfg: Object.assign({}, PTipCfg),
      PFCfg: Object.assign({}, PFCfg),
      PSCfg: Object.assign({}, PSCfg),
      saveLastestCfg: Object.assign({}, saveLastestCfg),
      paymentW: '',
      payType: '',
      payInfo: {},
      tradeNo: '',
    }
  },
  methods: {
    fetchRankingInfo (page) {
      const { groupId, stageId } = this
      const getRankingPath = '/englishCompetitions/ranking?groupId=' + groupId + '&stageId=' + stageId + '&rows=10&page=' + page
      this.$ajax.get(getRankingPath, {}, (res) => {
        const rankInfo = res.data

        this.rankInfo = {
          myself: Object.assign({}, rankInfo.my_competition, { total_people: this.joinNum }),
          list: rankInfo.ranking_list || [],
          page: rankInfo.pageInfo || {}
        }
      })
    },
    handleChangeTab (idx) {
      this.tabIdx = idx
      this.tab = getTabCfg(idx)
      if (!this.isShowRank) this.tab.pop()
    },
    handlePageTurning (page) {
      this.fetchRankingInfo(page)
    },
    handleCompetitionInfo (data) {
      this.examBtnStatus = 'disabled'
      this.examBtnType = 'green'
      this.signupCost = data.signupCost
      if (parseInt(data.status) === 1) { // 我要报名 菊：付费大赛的报名
        if (!data.groupId) this.examBtnStatus = 'noGroup'
        else this.examBtnStatus = 'needPay'
      } else if (parseInt(data.status) === 2) { // 即将开始
        this.examBtnType = 'text'
      } else if (parseInt(data.status) === 3) { // 我要测评 菊：免费大赛的报名
        if (data.needSignUp) {
          if (!data.groupId) this.examBtnStatus = 'noGroup'
          else this.examBtnStatus = 'needSignUp'
        } else {
          if (this.subTime === 0) this.examBtnStatus = 'disabled'
          else this.examBtnStatus = 'toExam'
        }
      } else if (parseInt(data.status) === 4) { // 等待成绩公布
        this.examBtnType = 'disabled'
      } else if (parseInt(data.status) === 5) { // 已结束
        this.examBtnType = 'text'
      } else if (parseInt(data.status) === 6) { // 已完成
        this.examBtnType = 'text'
      }
    },
    handleClickExamBtn () {
      if (this.examBtnStatus === 'disabled') {
        // this.examBtnType = 'disabled'
      } else if (this.examBtnStatus === 'noGroup') {
        this.alertDialog()
      } else if (this.examBtnStatus === 'needPay') {
        this.paymentDialog()
      } else if (this.examBtnStatus === 'needSignUp') {
        this.$ajax.postNew('/postAssessment/post', { postAssessmentUrl: this.$config.jdcpIP + 'WebCompetition/setJoinTime', stage_id: this.stageId }, (res) => {
          if (res.status === 2) { // 登录超时
            window.location.href = this.$config.login
          } else if (res.status === 2001) { // 权限错误
            window.location.href = this.$config.login
          } else if (res.status === 1 || res.status === 4301) {
            this.GoToExam()
          } else {
            this.$store.commit('showErrDialog', {
              errText: res.info,
              btnText: this.$t('dialog.iknow'),
              cancleBtnCallBack: () => {
                location.reload()
              }
            })
          }
        }, {
          notNeedStatus: true
        })
      } else if (this.examBtnStatus === 'toExam') {
        // 剩余
        // 测评按钮
        // 报告按钮
        if (this.subTime === 0) {
          this.examBtnType = 'disabled'
        } else {
          this.GoToExam()
        }
      }
    },
    gotoReport () {
      if (this.showDateFlag) {
        if (this.isReportFree) {
          // 免费报告
          this.goToBuyReport('', this.competitionId, this.groupId, this.reportStageId, 1)
        } else {
          // 付费报告
          if (this.hasReportPay) {
            this.goToBuyReport('', this.competitionId, this.groupId, this.reportStageId, 0)
          } else {
            this.goToBuyReport('', this.competitionId, this.groupId, this.reportStageId, 1)
          }
        }
        // 定时报告
      } else {
        // 实时报告
        let nwindow = window.open()
        nwindow.location.href = window.ReportMapping.getReportUrl('rt', this.reportStageId, this.groupId, '', this.$store.state.student.name)
      }
      // window.open('/web/models/Report/default/self.php?gId=' + this.groupId + '&sId=' + this.reportStageId + '&studentId=' + this.$store.state.student.name)
    },
    goToBuyReport (name, cId, gId, sId, free, city) {
      let nwin = window.open()
      let studentId = this.$store.state.student.name
      if (typeof (window.ReportMapping.getReportMapping(sId)) === 'object') {
        this.$jsonp(window.ReportMapping.getController(sId, gId, studentId), {}, (errs, res) => {
          if (errs) {
            this.$store.commit('showErrDialog', {
              errText: '获取报告数据失败，请刷新重试。\n如果刷新后还出现此错误，请联系客服。',
              btnText: this.$t('dialog.iknow')
            })
            // return alert('获取报告数据失败，请刷新重试。\n如果刷新后还出现此错误，请联系客服。')
          }
          let _area = window.ReportMapping.getArea(sId)
          if (res.status !== 1) {
            nwin.close()
            this.$store.commit('showErrDialog', {
              errText: '报告还未生成或者不存在',
              btnText: this.$t('dialog.iknow')
            })
          }
          let data = res.data
          // 如果分数未达标
          if ((_area === 'CHANG_CHUN' && data.score_report.base_info.my_score < 15) || (_area === 'SHEN_YANG' && data.score_report.base_info.my_score < 6)) {
            nwin.location.href = '/web/models/Report/failure.html'
          } else {
            // 获取购买状态
            this.$jsonp('MEnglishCompetition/getCompetitionReport?studentId=' + studentId + '&groupId=' + gId + '&stageId=' + sId, {}, (errs, res) => {
              let status = res.data.status
              if (free || status === 1) {
                // 免费报告或者分数报告
                nwin.location.href = window.ReportMapping.getReportUrl('free', sId, gId)
              } else {
                // if (status === 1) {
                //   nwin.location.href = window.ReportMapping.getReportUrl('free', sId, gId)
                // } else {
                //   nwin.location.href = window.ReportMapping.getReportUrl('paid', sId, gId)
                // }
                // 付费报告
                nwin.location.href = window.ReportMapping.getReportUrl('paid', sId, gId)
              }
            })
          }
        })
      } else {
        nwin.location.href = '/web/models/Report/default/self.php?gId=' + gId + '&sId=' + sId + '&studentId=' + this.$store.state.student.name
      }
    },
    paymentDialog () {
      let that = this
      this.PDCfg = Object.assign({}, PDCfg, {
        getCurrentPage: 'payment',
        cName: this.payInfo.competition_name,
        cCost: this.payInfo.price,
        cancleBtnCallBack: function () {
          that.paymentDialogType = ''
        },
        confirmBtnCallBack: function (payType) {
          that.payType = payType
          that.$set(that.payInfo, 'student_id', this.$store.state.student.id)
          that.$api.payInfo(that.payInfo, (res) => {
            if (res.status === 1) {
              that.paymentTipDialog()
              let params = ''
              if (that.payType === 'ali') {
                let pInfo = res.ali_pay.payInfo
                for (var key in pInfo) {
                  params += '&' + key + '=' + pInfo[key];
                }
                params += '&name=' + that.cInfo.competitionName + '&time=' + that.cInfo.startDate;
                that.tradeNo = pInfo.out_trade_no
                that.paymentW.location.href = '/web/models/ExamPayment/self.php?' + params.substring(1);
              } else {
                let pInfo = res.wx_pay.payInfo
                that.tradeNo = res.wx_pay.out_trade_no
                params += '&total_fee=' + res.ali_pay.payInfo.total_fee + '&out_trade_no=' + that.tradeNo + '&qr=' + pInfo.code_url;
                that.paymentW.location.href = '/web/models/ExamWechatPay/self.php?' + params.substring(1);
              }
            }
          })
          that.paymentW = window.open()
        }
      })
      this.paymentDialogType = 'payment'
    },
    paymentTipDialog () {
      let that = this
      this.PTipCfg = Object.assign({}, PTipCfg, {
        title: this.$t('dialog.payment.tipTitle'),
        text1: this.$t('dialog.payment.tipText1'),
        text2: this.$t('dialog.payment.tipText2'),
        text3: this.$t('dialog.payment.tipText3'),
        cancleBtnText: this.$t('dialog.payment.tipBtn'),
        cancleBtnCallBack: function () {
          that.$api.checkPay({
            order_no: that.tradeNo,
            jdcpIP: that.$config.jdcpIP
          }, (res) => {
            if (res.payment_status) {
              that.getCompetitionDetail()
              that.paymentSuccessDialog()
            } else {
              that.paymentFailDialog()
            }
          });
        }
      })
      this.paymentDialogType = 'tip'
    },
    paymentFailDialog () {
      let that = this
      this.PFCfg = Object.assign({}, PFCfg, {
        text: this.$t('dialog.payment.failText'),
        cancleBtnText: this.$t('dialog.payment.failBtn'),
        cancleBtnCallBack: function () {
          that.paymentDialogType = ''
        }
      })
      this.paymentDialogType = 'fail'
    },
    paymentSuccessDialog () {
      this.PSCfg = Object.assign({}, PSCfg, {
        showAssistTitleText: this.$t('dialog.payment.successText'),
        cancleBtnText: this.$t('dialog.payment.successBtn'),
        cancleBtnCallBack: function () {
          this.paymentDialogType = ''
        }
      })
      this.paymentDialogType = 'success'
    },
    alertDialog () {
      this.$store.commit('showErrDialog', {
        errTexts: '您所在的年级不符合测评条件，请换个测评试试。',
        btnText: '我知道了'
      })
    },
    GoToExam () {
      const stu = this.$store.state.student
      const query = 'competitionId=' + this.competitionId +
        '&groupId=' + this.groupId +
        '&stageId=' + this.stageId +
        '&user=' + stu.phone +
        '&name=' + encodeURIComponent(stu.name) +
        '&gender=' + stu.gender +
        '&stuSchool=' + encodeURIComponent(stu.school) +
        '&fromUrl=' + encodeURIComponent(this.$route.fullPath.replace(/\?/g, '{{q}}').replace(/&/g, '{{a}}'))

      if ([1, 4].indexOf(this.competitionType) > -1 && this.answerProcess === 1) {
        window.location.href = `/web/models/ExamFormal/index.php?${query}&modelId=${this.competitionModeId}`
      } else {
        window.location.href = `/practice/exam?${query}&checkdevice=1`
      }
    },
    getCompetitionDetail () {
      this.$ajax.get('/englishCompetitions/getCompetitionDetail', {
        competitionId: this.$route.query.competitionId
      }, (res) => {
        const competitionInfo = res.data
        this.cInfo = competitionInfo
        this.groupId = competitionInfo.groupId
        this.stageId = competitionInfo.stageId
        this.competitionId = competitionInfo.competitionId
        this.competitionModeId = competitionInfo.competitionModeId
        this.showReportBtn = competitionInfo.showReportBtn
        this.cStatus = competitionInfo.status
        this.cover = competitionInfo.imgUrl
        this.competitionName = competitionInfo.competitionName
        this.stageName = competitionInfo.stageName
        this.joinNum = competitionInfo.joinNum
        this.countdown = competitionInfo.message
        this.subTime = competitionInfo.subTime
        this.showDateFlag = competitionInfo.showDateFlag
        this.isReportFree = competitionInfo.isReportFree
        this.hasReportPay = competitionInfo.hasReportPay
        this.examBtnText = competitionInfo.status_message
        this.reportStageId = competitionInfo.reportStageId
        this.competitionType = parseInt(competitionInfo.competitionType)
        this.answerProcess = parseInt(competitionInfo.answerProcess)
        this.nav.push({
          title: this.competitionName
        })
        this.detail = {
          startDate: competitionInfo.startDate,
          endDate: competitionInfo.endDate,
          showTimeFlag: competitionInfo.showTimeFlag,
          showTime: competitionInfo.showTime,
          introduce: competitionInfo.introduce
        }

        this.payInfo = Object.assign({}, this.payInfo, _payInfo, {
          competition_name: competitionInfo.competitionName,
          report_template: competitionInfo.reportTemplate,
          price: competitionInfo.signupCost,
          stage_id: competitionInfo.stageId,
          group_id: competitionInfo.groupId,
          jdcpIP: this.$config.jdcpIP
        })

        this.handleCompetitionInfo(competitionInfo)

        this.isShowRank = competitionInfo.isShowRank
        if (this.isShowRank) {
          this.tab = getTabCfg(0)
          this.fetchRankingInfo(1)
        } else this.tab.pop()
      })
    }
  },
  created () {
    this.getCompetitionDetail()
  },
  mounted () {
    this.$set(this.payInfo, 'competition_id', this.$route.query.competitionId)
    this.loadingHeight = (parseInt(this.getNavHeight().replace('px', '')) - this.$refs.nav.clientHeight - 10) + 'px'
  }
}
</script>

<style lang="less">
#exam-detail {
  .overview {
    display: flex;
    padding: 20px 30px 30px;

    img {
      width: 380px;
      height: 190px;
      border-radius: 4px;
    }

    & > div {
      padding-top: 10px;
      margin-left: 20px;

      i {
        display: block;
        width: 20px;
        height: 20px;
        margin-right: 4px;
        background-image: url("/static/images/icon_common2.png");
        background-repeat: no-repeat;
      }

      .text-with-icon {
        display: flex;
        align-items: center;
      }

      .text1 {
        color: #666;
        font-size: 18px;
        line-height: 40px;
      }

      .text2 {
        display: flex;
        align-items: center;
        height: 20px;
        margin-top: 5px;

        .text-with-icon {
          color: #999;
          font-size: 12px;

          &.text2-1 {
            i {
              background-position-x: -20px;
            }
          }

          &.text2-2 {
            margin-left: 20px;

            i {
              background-position-x: -60px;
            }
          }
        }
      }

      .text3 {
        margin-top: 20px;
        color: #666;
        font-size: 14px;
      }

      .btns {
        margin-top: 30px;
        .btn-outline-green {
          margin-left: 10px;
        }

        .btn-text {
          background: #fff;
          border-color: #fff;
          color: #999;
          cursor: default;
        }

        & > span {
          margin-left: 15px;
          color: #999;
          font-size: 12px;

          span {
            color: #21bd73;
            font-size: 12px;
            font-weight: bold;
          }
        }
      }
    }
  }

  .tab-container {
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>
