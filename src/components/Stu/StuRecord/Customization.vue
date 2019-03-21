<template lang="pug">
div.customizationMain
  div.title 
    span 测评记录
    i.icon(@mouseenter='enter' @mouseleave='leave' :class='{active: showFlag}')
    div.tips(v-if='showFlag') 记录按照开始时间排序
  div.tableContent
    div.contain
      div.tableContentTitle
        div.xh 序号
        div.zymc 考试名称
        div.tjsj 提交时间
        div.cj 成绩
        div.wcsc 完成时长
      div.main(v-for='(item, index) in rows' :key='"item"+ index')
        div.top
          div.index {{(page.current - 1) * 10 + index + 1 }}
          div.stageName(@click='link(item)') {{item.competitionName}}
        div.bottom
            div(v-for='(o, idx) in item.stageInfo' :key='"o"+ idx')
              div.left
              div.right
                div.stage
                  div.stageLeft {{o.stageName}}
                  div.flag(:class='{grey: o.competitionStatus === 2 || o.competitionStatus === 3 || o.competitionStatus === 0}') {{o.competitionStatus === 2 ? "已结束": (o.competitionStatus === 3 ? "已归档" : (o.competitionStatus === 0 ? "未开始" : "进行中"))}}
                div.commitTime
                  span {{o.submitTimestamp ? o.submitTimestamp : '-'}}
                div.score
                  span(:class='scoreColor(o)') {{o.lastScore}}
                div.completeTime
                  span {{o.costTime === 0 ? '-分钟' : o.costTime + '分钟'}}
                div.operate
                  div.operateArea
                    div(
                      :class='o.canDo === 1 ? "green" : "grey"' 
                      @click='handleGotoPractice(item.competitionId, o.groupId, o.stageId, o.canDo, o.needSignUp, o.answerProcess, o.PaperModeId)') 练习
                    div(:class='{grey: o.isReport === 0, "green-line": o.isReport === 1}' @click='gotoReport(o.groupId, o.stageId, item.competitionId, o.reportType, o.paperId)') 报告
  Pagination(:currentPage='page.current' :maxNumPage='page.max' :getSkipPage='pageTurningCallback')
</template>
<script>
export default {
  name: 'work',
  props: ['rows', 'page', 'pageTurningCallback'],
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    scoreColor: function (o) {
      const fullScore = parseInt(o.fullScore)
      const scoreRate = Math.round(o.lastScore / fullScore * 100)
      return {
        green: scoreRate >= this.$config.ScoreLevel.good,
        red: scoreRate < this.$config.ScoreLevel.bad,
      }
    },
    enter() {
      this.showFlag = true
    },
    leave() {
      this.showFlag = false
    },
    handleGotoPractice(cId, gId, sId, canDo, needSignUp, answerProcess, modeId) {
      if (needSignUp) {
        this.$ajax.post('/postAssessment/post', { postAssessmentUrl: this.$config.jdcpIP + 'WebCompetition/setJoinTime', stage_id: sId }, (res) => {
          if (res.status === 1) {
            this.gotoPractice(cId, gId, sId, canDo)
          } else if (res.status === 2) {
            window.location.href = this.$config.login
          } else {
            this.$store.commit('showErrDialog', {
              btnText: res.info
            })
          }
        })
      } else {
        this.gotoPractice(cId, gId, sId, canDo, answerProcess, modeId)
      }
    },
    gotoPractice(cId, gId, sId, canDo, answerProcess, modeId) {
      const stu = this.$store.state.student
      let query = 'competitionId=' + cId +
        '&groupId=' + gId +
        '&stageId=' + sId +
        '&user=' + stu.phone +
        '&name=' + encodeURIComponent(stu.name) +
        '&gender=' + stu.gender +
        '&stuSchool=' + encodeURIComponent(stu.school) +
        '&fromUrl='

      if (canDo !== 0) {
        if (answerProcess === 1) {
          query += encodeURIComponent(this.$route.fullPath.replace(/\?/g, '{{q}}').replace(/&/g, '{{a}}'))
          window.location.href = `/web/models/ExamFormal/index.php?${query}&modelId=${modeId}`
        } else {
          query += encodeURIComponent((this.$route.path + '?rIdx=3').replace(/\?/g, '{{q}}').replace(/&/g, '{{a}}'))
          window.location.href = `/practice/exam?${query}`
        }
      }
    },
    link(param) {
      this.$router.push({ name: 'stuExamDetail', query: { competitionId: param.competitionId, groupId: param.stageInfo[0].groupId, stageId: param.stageInfo[0].stageId } })
    },
    gotoReport(gId, sId, cId, reportType, pId) {
      // 根据reportType字段判断报告逻辑
      if (reportType === 0) {
        // 无报告
      } else if (reportType === 1) {
        // 免费报告
        this.goToBuyReport('', cId, gId, sId, 1, '', pId)
      } else if (reportType === 2) {
        // 分数报告
        this.goToBuyReport('', cId, gId, sId, 1, '', pId)
      } else if (reportType === 3) {
        // 诊断报告
        this.goToBuyReport('', cId, gId, sId, 0, '', pId)
      }
    },
    goToBuyReport(name, cId, gId, sId, free, city, pId) {
      let studentId = this.$store.state.student.name
      let nwin = window.open()
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
          if ((_area === 'CHANG_CHUN' && data.score_report.base_info.my_score < 0) || (_area === 'SHEN_YANG' && data.score_report.base_info.my_score < 6)) {
            nwin.location.href = '/web/models/Report/failure.html'
          } else {
            // 获取购买状态
            this.$jsonp('MEnglishCompetition/getCompetitionReport?studentId=' + studentId + '&groupId=' + gId + '&stageId=' + sId, {}, (errs, res) => {
              let status = res.data.status
              if (free || status === 1) {
                // 免费报告或者分数报告
                nwin.location.href = window.ReportMapping.getReportUrl('free', sId, gId, pId, studentId)
              } else {
                nwin.location.href = window.ReportMapping.getReportUrl('paid', sId, gId, pId, studentId)
              }
            })
          }
        })
      } else {
        nwin.location.href = '/web/models/Report/default/self.php?gId=' + gId + '&sId=' + sId + '&studentId=' + studentId
      }
    }
  }
}
</script>
<style lang="less">
.customizationMain {
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    span {
      font-size: 16px;
      color: #666;
      line-height: 30px;
      margin-left: 30px;
      margin-right: 10px;
    }
    i {
      width: 20px;
      height: 20px;
      background-image: url("/static/images/icon_tips20x20.png");
      display: block;
      margin-right: 10px;
      cursor: pointer;
      &.active {
        background-position-x: -20px;
      }
    }
    .tips {
      background: rgba(36, 204, 124, 0.8);
      border-radius: 4px;
      padding: 10px;
      font-size: 12px;
      line-height: 18px;
      color: #fff;
      position: absolute;
      left: 373px;
      &:after {
        content: "";
        position: absolute;
        border: 10px solid transparent;
        border-right-color: rgb(36, 204, 124);
        opacity: 0.8;
        top: 28%;
        left: -14px;
        margin-left: -5px;
      }
    }
  }
  .tableContent {
    display: flex;
    justify-content: center;
    .contain {
      width: 890px;
      padding: 0;
      .tableContentTitle {
        background-color: #f8f8f8;
        height: 50px;
        display: flex;
        width: 890px;
        div {
          font-size: 14px;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          &.xh,
          &.cj {
            width: 60px;
          }
          &.zymc {
            width: 360px;
          }
          &.tjsj {
            width: 170px;
          }
          &.wcsc {
            width: 100px;
          }
        }
      }
      .main {
        .top {
          height: 70px;
          display: flex;
          .index {
            width: 60px;
            height: 70px;
            text-align: center;
            line-height: 70px;
          }
          .stageName {
            font-size: 16px;
            color: #21bd73;
            font-weight: bold;
            border-bottom: solid 1px #eeeff6;
            height: 70px;
            text-align: left;
            line-height: 70px;
            flex: 1;
            cursor: pointer;
          }
        }
        .bottom {
          & > div {
            height: 100px;
            display: flex;
            .left {
              width: 60px;
              height: 100px;
            }
            .right {
              flex: 1;
              border-bottom: solid 1px #eeeff6;
              height: 100px;
              display: flex;
              margin-left: 40px;
              .stage {
                display: flex;
                align-items: center;
                width: 320px;
                .stageLeft {
                  max-width: 262px;
                  margin-right: 8px;
                  font-size: 14px;
                  color: #666;
                  line-height: 100px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  width: auto;
                }
                .flag {
                  width: 50px;
                  height: 20px;
                  border-radius: 4px;
                  background-color: #24cc7c;
                  font-size: 12px;
                  color: #fff;
                  text-align: center;
                  line-height: 20px;
                  &.grey {
                    background-color: #ccc;
                  }
                }
              }
              .commitTime {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: #666;
                width: 170px;
              }
              .completeTime {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: #666;
                width: 100px;
              }
              .score {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                span {
                  font-size: 14px;
                  &.green {
                    color: #21bd73;
                  }
                  &.red {
                    color: #ff6666;
                  }
                }
              }
              .operate {
                display: flex;
                align-items: center;
                .operateArea {
                  height: 66px;
                  width: 80px;
                  margin-left: 20px;
                  div {
                    width: 80px;
                    height: 28px;
                    border-radius: 14px;
                    font-size: 14px;
                    text-align: center;
                    margin-bottom: 10px;
                    line-height: 28px;
                    cursor: pointer;
                    &.green {
                      background-color: #24cc7c;
                      color: #fff !important;
                      &:hover {
                        background-color: #21bd73;
                      }
                    }
                    &.green-line {
                      border: 1px solid #24cc7c;
                      color: #24cc7c;
                    }
                    &.grey {
                      background-color: #eee;
                      color: #ccc;
                      border: 1px solid #eee;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>