<template lang="pug">
div.work
  div.title 
    span 测评记录
    i.icon(@mouseenter='enter' @mouseleave='leave' :class='{active: showFlag}')
    div.tips(v-if='showFlag') 记录按照开始时间排序
  div.tableContent
    table
      thead
        tr
          th.xh 序号
          th.zymc 考试名称
          th.tjsj 提交时间
          th.cj 成绩
          th.wcsc 完成时长
          th &nbsp;
      tbody
        tr(v-for='(item, index) in rows' :key='"item"+ index')
          td.xh
            span {{ (page.current - 1) * 10 + index + 1 }}
          td.unitContent
            div
              div.left
                p.prac {{item.competitionName}}
              div.flag(:class='{grey: item.stageInfo[0].competitionStatus === 2 || item.stageInfo[0].competitionStatus === 3}') {{item.stageInfo[0].competitionStatus === 2 ? "已结束": (item.stageInfo[0].competitionStatus === 3 ? "已归档" : "进行中")}}
          td.commitTime
            span {{item.stageInfo[0].submitTimestamp ? item.stageInfo[0].submitTimestamp : '-'}}
          td.score
            span(:class='scoreColor(item.stageInfo[0])') {{item.stageInfo[0].lastScore}}
          td.completeTime
            span {{item.stageInfo[0].costTime === 0 ? '-分钟' : item.stageInfo[0].costTime + '分钟'}}
          td.operate
            div.operateArea
              div(
                :class='{green: item.stageInfo[0].canDo === 1, grey: item.stageInfo[0].canDo === 0}' 
                @click='handleGotoPractice(item.competitionId, item.stageInfo[0].groupId, item.stageInfo[0].stageId, item.stageInfo[0].canDo, item.stageInfo[0].needSignUp)') 练习
              div(:class='{grey: item.stageInfo[0].isReport === 0, "green-line": item.stageInfo[0].isReport === 1}' @click='gotoReport(item.stageInfo[0].groupId, item.stageInfo[0].stageId, item.competitionId, item.stageInfo[0].reportType)') 报告
  Pagination(:currentPage='page.current' :maxNumPage='page.max' :getSkipPage='pageTurningCallback')
</template>
<script>
/**
 * 测评作业
 */
export default {
  name: 'work',
  props: ['rows', 'page', 'pageTurningCallback'],
  data() {
    return {
      showFlag: false,
    }
  },
  methods: {
    scoreColor: function(o) {
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
    handleGotoPractice(cId, gId, sId, canDo, needSignUp) {
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
        this.gotoPractice(cId, gId, sId, canDo)
      }
    },
    gotoPractice(cId, gId, sId, canDo) {
      if (canDo !== 0) {
        const _path = (this.$route.path + '?rIdx=1').replace(/\?/g, '{{q}}').replace(/&/g, '{{a}}')
        window.location.href = '/practice/exam?competitionId=' + cId + '&groupId=' + gId + '&stageId=' + sId + '&checkdevice=1' + '&fromUrl=' + encodeURIComponent(_path)
      }
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
          if ((_area === 'CHANG_CHUN' && data.score_report.base_info.my_score < 15) || (_area === 'SHEN_YANG' && data.score_report.base_info.my_score < 6)) {
            nwin.location.href = '/web/models/Report/failure.html'
          } else {
            // 获取购买状态
            this.$jsonp('MEnglishCompetition/getCompetitionReport?studentId=' + studentId + '&groupId=' + gId + '&stageId=' + sId, {}, (errs, res) => {
              let status = res.data.status
              if (free || status === 1) {
                // 免费报告或者分数报告
                nwin.location.href = window.ReportMapping.getReportUrl('free', sId, gId, pId, studentId)
              } else {
                // 付费报告
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
  .work {
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
        background-image: url('/static/images/icon_tips20x20.png');
        display: block;
        margin-right: 10px;
        cursor: pointer;
        &.active {
          background-position-x: -20px;
        }
      }
      .tips {
        background: rgba(36, 204, 124, .8);
        border-radius: 4px;
        padding: 10px;
        font-size: 12px;
        line-height: 18px;
        color: #fff;
        position: absolute;
        left: 373px;
        &:after {
          content: '';
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
      table {
        width: 890px;
        border-collapse:collapse;
        thead {
          background-color: #f8f8f8;
          height: 50px;
          tr {
            height: 50px;
            display: flex;
            border-bottom: solid 1px #eeeff6;
            th {
              font-size: 14px;
              color: #999;
              display: flex;
              align-items: center;
              justify-content: center;
              &.xh, &.cj {
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
        }
        tbody {
          tr {
            height: 100px;
            display: flex;
            border-bottom: solid 1px #eeeff6;
            .xh {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: #666;
              width: 60px;
            }
            .unitContent {
              display: flex;
              align-items: center;
              width: 360px;
              & > div {
                display: flex;
                align-items: center;
                .left {
                  max-width: 300px;
                  margin-right: 8px;
                  .unit {
                    font-size: 14px;
                    color: #666;
                    line-height: 24px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                  .prac {
                    font-size: 14px;
                    color: #999;
                    line-height: 24px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
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
                    color: #fff!important;
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
</style>