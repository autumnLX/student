<template lang="pug">
  #ExamPaper
    div.section
      Nav(:list='nav')
      div.type
        img(:src='coverImgUrl' v-if='coverImgUrl' alt='')
        i.defaultImg(v-else)
        div.right
          p.f18.grey6 {{competitionName}}
          p
           span.f14.grey9 {{$t('Stu.examPaper.contain')}}
           span.f14.green {{paperCount}}
           span.f14.grey9 {{$t('Stu.examPaper.paper')}}
          p 
            i.icon
            span.f12.grey9 {{peoperNum}}{{$t('Stu.examPaper.participates')}}
    div.section.down
      div.overview
        div.dot.g
        span {{$t('Stu.StuTSKS.tips.good')}}
        div.dot.y
        span {{$t('Stu.StuTSKS.tips.normal')}}
        div.dot.r
        span {{$t('Stu.StuTSKS.tips.bad')}}
        div.dot.b
        span {{$t('Stu.StuTSKS.tips.undo')}}
      div.list(v-for='(o, idx) in list')
        div.block
          div.left(:class='handleColor(o.score)')
          div.center
            p.grey6.f16 {{o.paperName}}
          div.right
            button.btn.btn-green(@click='workDetail(o.paperId)') {{$t('Stu.examPaper.btn.practice')}}
            button.btn.btn-outline-green(v-if="o.score === '' || o.score === '--'"  :class='prohibit(o)') {{$t('Stu.examPaper.btn.report')}}
            button.btn.btn-outline-green(v-else :class='prohibit(o)' @click='report(o.paperId)') {{$t('Stu.examPaper.btn.report')}}
</template>

<script>
export default {
  name: 'ExamPaper',
  components: Object.assign({}),
  data() {
    return {
      nav: [{
        title: this.$t('Stu.nav.index'),
        href: 'stuIndex'
      }],
      competitionName: '',
      coverImgUrl: '',
      paperCount: 0,
      peoperNum: 0,
      activeType: '',
      topicTypeList: [],
      list: [],
      disabled: false,
      needSignUp: false
    }
  },
  methods: {
    handleColor(score) {
      if (score === '' || score === '--' || isNaN(score)) {
        return 'b'
      } else {
        const lv = window.ConfigNew.ScoreLevel
        score = parseInt(score)
        return score < lv.bad ? 'r' : (score < lv.good ? 'y' : 'g')
      }
    },
    handleImage() {
      return this.coverImgUrl
    },
    prohibit(param) {
      if (param.score === '' || param.score === '--') {
        return 'disabled'
      } else {
        return ''
      }
    },
    workDetail(paperId) {
      let param = this.$route.query
      if (this.needSignUp) {
        this.$ajax.post('/postAssessment/post', {
          postAssessmentUrl: this.$config.jdcpIP + '/api/WebCompetition/setJoinTime',
          stage_id: param.stageId
        }, (res) => {
          if (res.status === 1) {
            window.location.href = '/web/models/Exam/self.php?competitionId=' + param.competitionId + '&groupId=' + param.groupId + '&stageId=' + param.stageId + '&paperId=' + paperId
          }
        })
      } else {
        window.location.href = '/web/models/Exam/self.php?competitionId=' + param.competitionId + '&groupId=' + param.groupId + '&stageId=' + param.stageId + '&paperId=' + paperId
      }
    },
    report(paperId) {
      let param = this.$route.query
      window.open('/web/models/Report/default/self.php?gId=' + param.groupId + '&sId=' + param.stageId + '&pId=' + paperId + '&studentId=' + this.$store.state.student.name)
    }
  },
  created() {
    this.$ajax.get('/EnglishCompetitions/getSelfLearnPaper', {
      competitionId: this.$route.query.competitionId,
    }, (res) => {
      if (res.status === 1) {
        this.nav.push({
          title: res.data.competitionName
        })
        this.competitionName = res.data.competitionName
        if (res.data.imgUrl) {
          this.coverImgUrl = res.data.imgUrl
        }
        this.needSignUp = res.data.needSignUp
        this.paperCount = res.data.paperNum
        this.peoperNum = res.data.joinNum
        this.list = res.data.submitList
      }
    })
  },
  mounted() {
    // console.info(this.$t)
  }
}
</script>

<style lang="less">
@image-base-url: "../../../../static/images";
#ExamPaper {
  .type {
    padding: 20px 0 30px 30px;
    // display: flex;
    align-items: center;
    img {
      width: 380px;
      height: 190px;
    }
    .defaultImg {
      float: left;
      display: block;
      width: 380px;
      height: 190px;
      background: url("@{image-base-url}/banner.png") no-repeat center;
    }
    div.right {
      width: 100%;
      height: 190px;
      padding: 10px 0 0 400px;

      p:nth-child(1) {
        height: 40px;
        line-height: 40px;
      }
      p:nth-child(2),
      p:nth-child(3) {
        height: 20px;
        line-height: 20px;
      }
      p:nth-child(2) {
        margin-top: 5px;
      }
      p:nth-child(3) {
        margin-top: 20px;
        position: relative;

        & > i {
          position: absolute;
          left: 0;
          top: 50%;
          width: 20px;
          height: 20px;
          margin-top: -10px;
          background: url("@{image-base-url}/icon_common2.png") no-repeat center;
          background-position: -20px 0;
        }

        & > span {
          padding-left: 30px;
        }
      }
    }
  }
  .down {
    margin-top: 10px;
    padding: 0 30px 40px;

    .overview {
      display: flex;
      align-items: center;
      height: 70px;
      .dot {
        width: 10px;
        height: 10px;
        margin-right: 8px;
        border-radius: 5px;
        &.g {
          background-color: #24cc74;
        }
        &.y {
          background-color: #ffc367;
        }
        &.r {
          background-color: #ff8888;
        }
        &.b {
          background-color: #5dccff;
        }
      }
      span {
        margin-right: 25px;
      }
    }
    .list {
      .block {
        display: flex;
        margin-bottom: 20px;
        border-radius: 4px;
        background-color: #f8f8f8;
        overflow: hidden;
        .left {
          width: 105px;
          height: 140px;
          background-image: url("../../../assets/image/stu/tsks/pic_kslever.png");

          &.g {
            background-position-x: -105px;
          }
          &.y {
            background-position-x: -210px;
          }
          &.r {
            background-position-x: -315px;
          }
          &.b {
            background-position-x: 0;
          }
        }
        &:last-child {
          margin-bottom: 30px;
        }
      }
    }
    .center {
      width: 600px;
      margin: 0 30px 0 25px;

      p {
        line-height: 140px;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .btn {
        &.btn-green {
          margin-bottom: 20px;
        }
        &.disabled {
          cursor: inherit;
          border: none;
          background: #eee;
          font-size: 16px;
          color: #ccc;
        }
      }
    }
  }
}
</style>
