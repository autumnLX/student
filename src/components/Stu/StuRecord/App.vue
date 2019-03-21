<template lang="pug">
  div.studyRecord(v-if='show && $store.state.isVIP')
    div.studyRecordTop.section
      div.recordHeader
        Tab(:list='tab' :onChangeTab='handleClickTab')
        div.right
          span.timeLeft 统计时间：
          div.timeRight(:class='{active: showBorderFlag}' @mouseover='showLine' @mouseout='disappear' @click='showTimeBox')
            input#startDate(v-model='startDate')
            span ~
            input#endDate(v-model='endDate')
            i.icon-common2(:class='{active: showBorderFlag}')
      div.imgContain
        div.average
          div.content
            p 平均成绩
            p {{ status_ === 'loading' ? '' : avgScore }}
        div.completeNum
          div.content
            p 完成次数
            p {{ status_ === 'loading' ? '' : finishedNum }}
        div.uncompleteNum
          div.content
            p 未完成次数
            p {{ status_ === 'loading' ? '' : unfinishedNum }}
        div.averageTime
          div.content
            p 平均用时
            p.time
              span.timeNum {{ status_ === 'loading' ? '' : avgTime }}
              span.timeMinute 分钟
    div.section.flex-center-center(v-if='status_ === "loading"' :style='{ height: loadingHeight }')
      Loading
    template(v-else)
      div.section.bottom(v-if='rows.length > 0')
        //- 图表
        div.graphs
          div.title 成绩曲线
          div.empty(v-show='chartData.length <= 0')
            div.f16.greyc 暂无数据
          div.graphContain(v-show='chartData.length > 0')
            div#chartBox(ref='chartBox')
        //- 列表
        Sync.tab-container(v-if='activeTabIndex === 0' :rows='rows' :page='page' :pageTurningCallback='fetchWorkList')
        Work.tab-container.cpzy(v-else-if='activeTabIndex === 1' :rows='rows' :page='page' :pageTurningCallback='fetchRecordList')
        Formal.tab-container.tsks(v-else-if='activeTabIndex === 2' :rows='rows' :page='page' :pageTurningCallback='fetchRecordList')
        Customization.tab-container.dzcp(v-else :rows='rows' :page='page' :pageTurningCallback='fetchRecordList')
      div.section.bottom.empty(v-else)
        div.f16.greyc 暂无学习记录
  Vip(v-else-if='show')
</template>

<script>
import Vip from '@/UIO/Vip'
import Echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import Sync from './Sync'
import Work from './Work'
import Formal from './Formal'
import Customization from './Customization'

const chartOps = {
  grid: {
    top: 10,
    right: 10,
    bottom: 20,
    left: 48,
  },
  legend: {
    show: false,
  },
  tooltip: {
    trigger: 'item',
    formatter: '日期：{b0}<br>得分率：{c0}%',
  },
  xAxis: {
    name: '日期',
    type: 'category',
    data: []
  },
  yAxis: {
    name: '得分率',
    type: 'value',
    min: 0,
    max: 100,
    axisLabel: {
      formatter: '{value} %',
    }
  },
  series: [{
    data: [],
    type: 'line',
    smooth: true,
    lineStyle: {
      color: '#21bd73'
    },
  }]
}

export default {
  name: 'record',
  components: { Sync, Work, Formal, Customization, Vip },
  data() {
    return {
      show: false,
      status_: 'loading',
      loadingHeight: 'auto',
      tab: [
        {
          title: '同步作业',
          value: 'sync',
          selected: true
        }, {
          title: '测评作业',
          value: 'work'
        }, {
          title: '听说考试',
          value: 'formal'
        }, {
          title: '定制测评',
          value: 'customization'
        }
      ],
      activeTabIndex: 0,
      startDate: '',
      endDate: '',
      competitionType: 0,
      paperCatgId: 0,
      showBorderFlag: false,
      avgScore: '',
      finishedNum: '',
      unfinishedNum: '',
      avgTime: '',
      chartCategories: [],
      chartData: [],
      rows: [], // 列表数据
      page: {}, // 分页信息
    }
  },
  watch: {
    rows: function() {
      if (this.rows.length > 0) {
        this.initChartBox()
      }
    },
    chartData: function() {
      if (this.chartBox) {
        this.fillChartData()
      }
    },
  },
  methods: {
    initChartBox() {
      if (this.chartData.length > 0) {
        if (this.$refs.chartBox) {
          this.chartBox = Echarts.init(document.getElementById('chartBox'))
          this.chartBox.setOption(chartOps)
          this.fillChartData()
        } else {
          console.info('wait chartBox render...')
          setTimeout(this.initChartBox, 100)
        }
      }
    },
    fillChartData() {
      this.chartBox.setOption({
        xAxis: {
          data: this.chartCategories
        },
        series: [{
          data: this.chartData
        }]
      })
    },
    isAllFetched() {
      this.fetchCount -= 1
      if (this.fetchCount <= 0) {
        this.status_ = 'done'
      }
    },
    fetchWorkSummary() { // 获取作业统计信息
      this.$ajax.post('/worksets/getOneStuReportBasic', {
        startDate: this.startDate,
        endDate: this.endDate
      }, (res) => {
        const { avgScore, submitNum, unSubmitNum, submitAvgMin } = res.data
        this.avgScore = avgScore
        this.finishedNum = submitNum
        this.unfinishedNum = unSubmitNum
        this.avgTime = submitAvgMin
        this.isAllFetched()
      })
    },
    fetchWorkChart() { // 获取作业统计图表
      this.$ajax.post('/records/getOneStuReportCurve', {
        startDate: this.startDate,
        endDate: this.endDate
      }, (res) => {
        this.chartCategories.splice(0, this.chartCategories.length)
        this.chartData.splice(0, this.chartData.length)
        if (res.data.length > 0) {
          res.data.forEach((row) => {
            this.chartCategories.push(row.date)
            this.chartData.push(row.score)
          })
        }
        this.isAllFetched()
      })
    },
    fetchWorkList(page = 1) { // 获取作业列表
      this.$ajax.post('/records/getStudentWorksetList', {
        startDate: this.startDate,
        endDate: this.endDate,
        page,
        row: 10
      }, (res) => {
        // const { list, pageInfo } = res.data || []
        const list = res.data.list || []
        const pageInfo = res.data.pageInfo
        this.rows = list.map((row) => {
          return {
            unit: row.unit_name,
            partice: row.practice_type,
            time: row.submitTime,
            score: row.avg_score,
            completeTime: row.doneMin,
            status: row.status,
            // id: row.id,
            worksetId: row.id,
            school_class_id: row.school_class_id,
            // is_task: row.is_task,
            isTask: row.is_task,
            section: row.section_name,
            layerType: row.layer_type,
            layerId: row.layer_id,
            categoryId: row.category_id,
            teacherId: row.teacher_id
          }
        })

        this.page = {
          current: pageInfo.page,
          max: Math.ceil(pageInfo.total / pageInfo.rows)
        }
        this.isAllFetched()
      })
    },
    fetchRecordSummary() { // 获取测评统计信息
      this.$ajax.get('/learningRecordCp/summary', {
        startDate: this.startDate,
        endDate: this.endDate,
        competitionType: this.competitionType,
        paperCatgId: this.paperCatgId,
      }, (res) => {
        const { avgScore, finishedNum, unfinishedNum, avgTime } = res.data
        this.avgScore = avgScore
        this.finishedNum = finishedNum
        this.unfinishedNum = unfinishedNum
        this.avgTime = avgTime
        this.isAllFetched()
      })
    },
    fetchRecordChart() { // 获取测评统计图表
      this.$ajax.get('/learningRecordCp/chart', {
        startDate: this.startDate,
        endDate: this.endDate,
        competitionType: this.competitionType,
        paperCatgId: this.paperCatgId,
      }, (res) => {
        this.chartCategories.splice(0, this.chartCategories.length)
        this.chartData.splice(0, this.chartData.length)
        if (res.data.length > 0) {
          res.data.forEach((row) => {
            const date = new Date(row.date * 1000)
            this.chartCategories.push(`${date.getMonth() + 1}-${date.getDate()}`)
            this.chartData.push(row.scoreRate)
          })
        }
        this.isAllFetched()
      })
    },
    fetchRecordList(page = 1) {
      this.$ajax.get('/LearningRecordCp/history', {
        startDate: this.startDate,
        endDate: this.endDate,
        competitionType: this.competitionType,
        paperCatgId: this.paperCatgId,
        page,
        row: 10
      }, (res) => {
        // const { list, pageInfo } = res.data || []
        const list = res.data.list || []
        const pageInfo = res.data.pageInfo
        this.rows = list.map((row) => {
          return {
            answerProcess: row.answerProcess,
            competitionType: row.competitionType,
            stageInfo: row.stageInfo,
            competitionName: row.competitionName,
            competitionId: row.competitionId,
            modelId: row.modeId
          }
        })
        this.page = {
          current: pageInfo.page,
          max: Math.ceil(pageInfo.total / pageInfo.rows)
        }
        this.isAllFetched()
      })
    },
    fetchDefaultTime(callback) {
      this.$ajax.get('/LearningRecordCp/defaultDate', {}, (res) => {
        this.startDate = res.data.startDate.split(' ')[0]
        this.endDate = res.data.endDate.split(' ')[0]
        typeof callback === 'function' && callback()
      })
    },
    fetchWork() { // 聚合获取作业统计
      this.fetchWorkSummary()
      this.fetchWorkChart()
      this.fetchWorkList()
    },
    fetchExam() { // 聚合获取测评统计
      this.fetchRecordSummary()
      this.fetchRecordChart()
      this.fetchRecordList()
    },
    fetchExamOrWork() { // 自动判断抓取测评或者作业信息
      this.competitionType > 0 ? this.fetchExam() : this.fetchWork()
    },
    handleChangeTab(idx) { // 切换【同步练习】、【测评作业】、【听说考试】、【定制测评】
      const { tab, activeTabIndex } = this
      if (activeTabIndex > -1) {
        tab[activeTabIndex].selected = false
        this.$set(this.tab, activeTabIndex, tab[activeTabIndex])
      }
      tab[idx].selected = true
      this.$set(this.tab, idx, tab[idx])
      this.activeTabIndex = idx

      if (idx > 0) { // 测评
        this.competitionType = idx === 1 ? 3 : (idx === 2 ? 4 : 1)
        this.paperCatgId = idx === 1 ? 1 : (idx === 2 ? 2 : 0)
      } else { // 作业
        this.competitionType = 0
      }
      this.rows = [] // 清空数据，防止接口返回过慢，拿到的rows错误问题
      this.chartCategories.splice(0, this.chartCategories.length) // 切换tab的时候先清空图表数据，防止接口返回过慢，拿到的还是原来的数据
      this.chartData.splice(0, this.chartData.length) // 切换tab的时候先清空图表数据，防止接口返回过慢，拿到的还是原来的数据
      this.fetchCount = 3
      this.status_ = 'loading'
      this.fetchExamOrWork()
    },
    showTimeBox() {
      this.wdate({
        el: 'startDate',
        minDate: '2000-1-1',
        maxDate: '#F{$dp.$D(\'endDate\',{d:0})}'
      }, (val) => {
        this.startDate = val.el.value
        this.wdate({
          el: 'endDate',
          minDate: '#F{$dp.$D(\'startDate\',{d:0})}',
          maxDate: '%y-%M-%d'
        }, (val) => {
          this.endDate = val.el.value
          if ((new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / 86400000 >= 180) {
            if (confirm('时间跨度较大，是否继续')) {
              this.fetchExamOrWork() // 修改日期范围，刷新数据
            }
          } else {
            this.fetchExamOrWork() // 修改日期范围，刷新数据
          }
        })
      })
    },
    wdate(param, callback) {
      window.WdatePicker({
        el: param.el,
        readOnly: true,
        minDate: param.minDate,
        maxDate: param.maxDate,
        dateFmt: 'yyyy-MM-dd',
        autoPickDate: true,
        isShowClear: false,
        onpicked: (val) => {
          callback(val)
        }
      })
    },
    showLine() {
      this.showBorderFlag = true
    },
    disappear() {
      this.showBorderFlag = false
    },
    handleClickTab(idx) {
      this.$router.push({
        query: {
          rIdx: idx,
        }
      })
      this.handleChangeTab(idx)
    },
  },
  created() {
    this.$ajax.get('/students/info', {}, (res) => {
      const vipInfo = res.data.vip
      this.$store.commit('setVipInfo', vipInfo)
      this.show = true
    })
  },
  mounted() {
    if (this.$route.query.rIdx) {
      this.fetchDefaultTime(() => {
        this.handleChangeTab(parseInt(this.$route.query.rIdx))
      })
    } else this.fetchDefaultTime(this.fetchWork)
    this.fetchCount = 3
    this.loadingHeight = parseInt(getComputedStyle(document.getElementById('nav')).height) - 251 + 'px'
  },
  beforeDestroy() {
    this.chartBox && this.chartBox.dispose()
  },
}
</script>

<style lang="less">
.studyRecordTop {
  margin-bottom: 10px;
}

.recordHeader {
  padding-right: 30px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #efefef;
  .right {
    display: flex;
    align-items: center;
    // padding-top: 20px;
    .timeLeft {
      font-size: 14px;
      color: #666;
      margin-right: 8px;
    }
    .timeRight {
      display: flex;
      align-items: center;
      padding-left: 10px;
      padding-right: 10px;
      border: 1px solid #ededed;
      cursor: pointer;
      &.active {
        border-color: #21bd73;
      }
      input {
        border: none;
        outline: none;
        width: 95px;
        font-size: 14px;
        color: #666;
        text-align: center;
        padding: 0;
      }
      i {
        background-position-x: -200px;
        &.active {
          background-position-x: -220px;
        }
      }
      span {
        color: #666;
      }
    }
  }
  .tab {
    border: none;
  }
}

.imgContain {
  padding: 30px;
  display: flex;
  justify-content: space-between;
  & > div {
    width: 200px;
    height: 110px;
    border-radius: 6px;
    position: relative;
    padding-top: 20px;
    &.average {
      background-image: url("/static/images/icon_01.png");
    }
    &.completeNum {
      background-image: url("/static/images/icon_02.png");
    }
    &.uncompleteNum {
      background-image: url("/static/images/icon_03.png");
    }
    &.averageTime {
      background-image: url("/static/images/icon_04.png");
    }
  }
  .content {
    position: absolute;
    left: 100px;
    p:first-child {
      font-size: 14px;
      color: #fff;
      line-height: 26px;
    }
    p:last-child {
      font-size: 36px;
      color: #fff;
      line-height: 40px;
      font-weight: bold;
    }
  }
  .timeNum {
    font-size: 36px;
    font-weight: bold;
    color: #fff;
  }
  .timeMinute {
    font-size: 14px;
    color: #fff;
  }
}

.section.bottom {
  padding-top: 30px;
  padding-bottom: 40px;

  &.empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 412px;

    div {
      width: 300px;
      height: 300px;
      padding-top: 230px;
      text-align: center;
      background: #fff url("/static/images/pic_empty-05.png") no-repeat center;
    }
  }

  .graphs {
    .title {
      margin-left: 30px;
      font-size: 16px;
      color: #666;
      line-height: 30px;
      margin-bottom: 20px;
    }
    .graphContain {
      padding-left: 50px;
      padding-right: 50px;
      display: flex;
      justify-content: center;
      // margin-bottom: 50px;

      #chartBox {
        width: 850px;
        height: 355px;
      }
    }
    .empty {
      padding-left: 50px;
      padding-right: 50px;
      display: flex;
      justify-content: center;
      height: 355px;
      div {
        width: 300px;
        height: 300px;
        padding-top: 230px;
        text-align: center;
        background: #fff url("/static/images/pic_empty-05.png") no-repeat center;
      }
    }
  }

  .tab-container {
    margin-top: 50px;

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

    table {
      th {
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
  }
}
</style>
