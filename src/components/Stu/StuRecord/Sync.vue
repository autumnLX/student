<template lang="pug">
div.sync
  div.title 
    span 作业记录
    i.icon(@mouseenter='enter' @mouseleave='leave' :class='{active: showFlag}')
    div.tips(v-if='showFlag') 记录按照开始时间排序，已过期的作业完成后不会提交给老师哦~
  table
    thead
      tr
        th.xh 序号
        th.zymc 作业名称
        th.tjsj 提交时间
        th.cj 成绩
        th.wcsc 完成时长
    tbody
      tr(v-for='(item, index) in rows' :key='"item"+ index')
        td.xh
          span {{ (page.current - 1) * 10 + index + 1 }}
        td.unitContent
          div
            div.left
              p.unit(:title='item.unit + " " + item.section') {{item.unit}} {{item.section}}
            div.flag(:class='{grey: item.status === "finished"}') {{item.status === "finished" ? "已结束": "进行中"}}
        td.commitTime
          span {{item.score === "-1" ? "-" : item.time}}
        td.score
          span(v-if='item.score === "-1"') 未做
          span.green(v-else-if='item.score >= 70') {{item.score}}
          span.normal(v-else-if='item.score >= 55') {{item.score}}
          span.bad(v-else) {{item.score}}
        td.completeTime
          span {{item.score === "-1" ? "-分钟" : item.completeTime + "分钟"}}
        td.operate
          div.operateArea
            div.green(@click='gotoPractice(item)') 练习
            div.green-line(:class='{grey: item.score === "-1"}' @click='routeTo(item)') 报告
  Pagination(:currentPage='page.current' :maxNumPage='page.max' :getSkipPage='pageTurningCallback')
</template>
<script>
/**
 * 同步作业
 */
export default {
  name: 'sync',
  props: ['rows', 'page', 'pageTurningCallback'],
  data() {
    return {
      showFlag: false,
    }
  },
  methods: {
    enter() {
      this.showFlag = true
    },
    leave() {
      this.showFlag = false
    },
    routeTo(item) {
      if (item.score === '-1') {
      } else {
        if (Number(item.layerType) === 0) {
          window.open(`/web/models/WorkDetail/self.php?wid=${item.worksetId}&scId=${item.school_class_id}&task=${item.isTask}&sid=${this.$store.state.student.name}isStu=true`)
        } else {
          window.open(`/web/models/WorkDetail/self.php?wid=${item.worksetId}&scId=${item.school_class_id}&task=${item.isTask}&sid=${this.$store.state.student.name}isStu=true&layerType=${item.layerType}&layerId=${item.layerId}&categoryId=${item.categoryId}`)
        }
      }
    },
    gotoPractice(param) {
      // window.location.href = '/practice/work?isTask=' + param.isTask + '&worksetId=' + param.worksetId + '&layerType=' + param.layerType + '&layerId=' + param.layerId + '&categoryId=' + param.categoryId + '&teacherId=' + param.teacherId + '&isPracticeOver=' + (param.status === 'finished' ? 1 : 0)
      window.location.href = `/practice/work?isTask=${param.isTask}&worksetId=${param.worksetId}&layerType=${param.layerType}&layerId=${param.layerId}&categoryId=${param.categoryId}&teacherId=${param.teacherId}&isPracticeOver=${param.status === 'finished' ? 1 : 0}&pathname=stuRecord`
    }
  }
}
</script>
<style lang="less">
.sync {
  table {
    width: 890px;
    margin: 0 auto;
    border-collapse: collapse;

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
            &.bad {
              color: #ff6666;
            }
            &.normal {
              color: #666;
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
</style>