<template lang="pug">
  div.report(v-show='iframeHeight > 0' :style='{"padding": iframeHeight > 1 ? "60px 0 30px" : "0"}')
    div.divide(v-show='iframeHeight > 1')
      div.line
      div.text 测评报告
    div.stu-practice-exam-report-content
      iframe(
        :src='iframeUrl'
        width='100%'
        :height='iframeHeight + "px"'
        frameborder='0'
        scrolling='no'
        allowtransparency='true'
        @load='iframeLoad'
      )
</template>

<script>
export default {
  name: 'StuExamReport',
  props: ['competitionId', 'groupId', 'stageId'],
  data() {
    return {
      iframeHeight: 1,
    }
  },
  computed: {
    iframeUrl() {
      return this.$util.urlSet.examReport + '?isForExam=1&cId=' + this.competitionId + '&gId=' + this.groupId + '&sId=' + this.stageId + '&studentId=' + this.$store.state.student.name + '&width=1000'
    },
  },
  methods: {
    iframeLoad(event) {
      let _body = event.target.contentWindow.document.body
      this.iframeHeight = _body.offsetHeight
    }
  },
}
</script>

<style lang="less">
#stu-practice-exam-root .report {
  width: 1200px;
  margin-bottom: 30px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;

  .divide {
    position: relative;
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 20px;

    .line {
      width: 100%;
      border-top: 1px dashed #24cc7c;
    }

    .text {
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 2;
      padding: 0 10px 0 40px;
      color: #21bd73;
      font-size: 18px;
      line-height: 60px;
      background: #fff url("/static/images/practice/exam/icon_report.png")
        no-repeat 10px center;
      transform: translateX(-50%);
    }
  }

  .stu-practice-exam-report-content {
    display: flex;
    justify-content: center;
  }
}
</style>

