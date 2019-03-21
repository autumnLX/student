<template lang="pug">
  div#Result
    div.title
      div.left.rulestgreat(v-if="score >= 85")
        div.result-zone
          div.publish
            div
              p.text1 我的成绩
              p.text2 {{ score }}
              p.text3.time 答题时间：{{ minute }}分钟
        div.bg
      div.left.resultgood(v-else-if="score >= 70")
        div.result-zone
          div.publish
            div
              p.text1 我的成绩
              p.text2 {{ score }}
              p.text3.time 答题时间：{{ minute }}分钟
        div.bg
      div.left.resultnormal(v-else-if="score >= 55")
        div.result-zone
          div.publish
            div
              p.text1 我的成绩
              p.text2 {{ score }}
              p.text3.time 答题时间：{{ minute }}分钟
        div.bg
      div.left.resultbad(v-else)
        div.result-zone
          div.publish
            div
              p.text1 我的成绩
              p.text2 {{ score }}
              p.text3.time 答题时间：{{ minute }}分钟
        div.bg
      //- 右半部分
      div.right
        p {{ resultText }}
        div.count
          div.multi {{fantasticNum}}
          div.perfect {{perfectNum}}
        div
          div.btn.again(@click='onAgain') 再练一次
          div.btn.complete(@click='complete()') 完成
    div.content
    div(style='padding-bottom: 10px;' v-if='!isHideVipInfo')
      div.divide
        div
          div.dashed
          div.text 作业报告
      iframe#report.detail(v-if='showReport' :src='src' scrolling='no' :style='{height: reportHeight}')
      div#vip(v-else)
        button(@click='handleShowVipModal')
        router-link(:to="{path: '/stu/sync'}" target="_blank") 作业报告仅对VIP开放~了解更多 &gt;&gt;
    Charge(:name='$store.state.student.name' :avatar='$store.state.avatar' v-if='$store.state.isShowCharge')
</template>

<script>
// import Charge from '@ui/Charge'
export default {
  name: 'StuWorkResult',
  // components: { Charge },
  props: ['fantasticNum', 'perfectNum'],
  data() {
    return {
      isHideVipInfo: window.ConfigNew.toggle.hideVipInStudentInfo,
      src: '', // 报告地址
      reportHeight: 0, // 报告高度
      minute: 0,
      score: 0,
      resultText: '',
      showReport: false,
      isVIP: this.$store.state.isVIP
    }
  },
  methods: {
    onAgain() {
      window.location.reload()
    },
    complete() {
      const pathname = this.$route.query.pathname ? this.$route.query.pathname : 'stuSync'
      this.$router.push({ name: pathname })
    },
    handleShowVipModal() { // 显示VIP续费对话框
      this.$store.commit('toggleChargeModel')
    },
    phonetics(id) {
      this.$ajax.post('/SymbolStudy/updateSymbolScore', {
        score: this.score,
        symbolStudiesId: id
      }, (res) => {
        if (res.status === 1) {
          console.info('ok')
        } else {
          console.info(res)
        }
      })
    },
    showVip() {
      this.showReport = true
      window.gimmeHeight = (height) => {
        this.reportHeight = height + 'px'
      }
    },
    commented() {
      const { categoryId, worksetId, isTask, layerType, layerId, teacherId, worksetType, phoneticsId, pathname } = this.$route.query
      const isPracticeOver = Number(this.$route.query.isPracticeOver)
      const scId = this.$store.state.student.classId
      const idx = Math.floor(Math.random() * 3)
      let reqParam = {
        wsId: worksetId,
        isTask: isTask,
        scId: scId,
        layerType: layerType,
        layerId: layerId,
        categoryId: categoryId,
        teacherId: teacherId,
        worksetType: worksetType,
        getExpiredReport: isPracticeOver === 1 ? 1 : 0
      }
      this.src = `/web/models/WorkDetail2/self.php?wid=${worksetId}&task=${isTask}&scId=${scId}&layerType=${layerType || 0}&layerId=${layerId || 0}&categoryId=${categoryId || 0}&teacherId=${teacherId || 0}&worksetType=${worksetType || 'self'}&getExpiredReport=${reqParam.getExpiredReport}`
      this.$ajax.post('/records/getDetailReportByStuIdWSId', reqParam, (res) => {
        if (res.status === 1) {
          this.minute = Math.ceil(res.data.worksetReport.sumDoneSec / 60)
          this.score = res.data.worksetReport.avgScore
          if (pathname === 'Phonetics') { // 音标学习
            this.phonetics(phoneticsId)
          }
          if (this.score >= 85) {
            this.resultText = ['简直太完美了~', '哇！你的英语水平溜得像歪果仁！', '厉害了！宇宙第一非你莫属！'][idx]
          } else if (this.score >= 70) {
            this.resultText = ['哎哟！不错哟！继续加油！', '哎哟！不错哟！继续加油！', '哎哟！不错哟！继续加油！'][idx]
          } else if (this.score >= 55) {
            this.resultText = ['哎哟！不错哟！继续加油！', '不错哦！相信你还可以更好~', '多听多练，你会更棒~'][idx]
          } else {
            this.resultText = ['加油！再接再厉！', '不要气馁！多加练习进步更快哦！', '不要气馁！多加练习进步更快哦！'][idx]
          }
        }
      })
      if (this.isVIP) {
        this.showVip()
      } else {
        this.showReport = false
        this.reportHeight = 0
      }
    }
  },
  watch: {
    totalTime: function (val) {
      this.minute = Math.ceil(this.totalTime / 60)
    },
    isVIP: function (val) {
      this.showVip()
    }
  },
  mounted() {
    this.commented()
  }
}
</script>

<style lang='less'>
@imageUrl: "../../../../../static/images";

#Result {
  width: 1200px;
  margin: 50px auto;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;

  .title {
    position: relative;
    z-index: 10;
    display: flex;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

    .left {
      position: relative;
      width: 580px;
      height: 460px;
      padding-top: 100px;

      &.rulestgreat {
        background-image: linear-gradient(to right, #24cc7c, #24cc7c);
        & > .result-zone {
          background-image: url("@{imageUrl}/practice/exam/pic_bg_great.png");
        }
      }
      &.resultgood {
        background-image: linear-gradient(to right, #6bd17e, #45d178);
        & > .result-zone {
          background-image: url("@{imageUrl}/practice/exam/pic_bg_good.png");
        }
      }
      &.resultnormal {
        background-image: linear-gradient(to right, #ffb675, #ffab44);
        & > .result-zone {
          background-image: url("@{imageUrl}/practice/exam/pic_bg_notbad.png");
        }
      }
      &.resultbad {
        background-image: linear-gradient(to right, #ff817a, #ff6249);
        & > .result-zone {
          background-image: url("@{imageUrl}/practice/exam/pic_bg_bad.png");
        }
      }

      .result-zone {
        position: relative;
        z-index: 3;
        width: 300px;
        height: 420px;
        padding-top: 48px;
        margin: 0 auto;

        .publish {
          height: 100%;
          padding: 0 50px;

          & > div {
            width: 100%;

            p {
              margin: 0;
              color: #fff;

              &.text1 {
                font-size: 16px;
                text-align: center;
                line-height: 20px;
              }

              &.text2 {
                margin-top: 10px;
                margin-bottom: 62px;
                font-size: 56px;
                text-align: center;
                line-height: 60px;
              }

              &.text3 {
                padding-left: 40px;
                margin-top: 10px;
                font-size: 18px;
                line-height: 30px;
                background-image: url("/static/images/practice/exam/icon_resultpage.png");
                background-repeat: no-repeat;
                background-position-x: 0;

                &.time {
                  background-position-y: -60px;
                }
              }
            }
          }

          .btn {
            width: 110px;
            height: 34px;
            border: 1px solid #fff;
            border-radius: 17px;
            text-align: center;
            line-height: 32px;
          }
        }
      }

      .bg {
        position: absolute;
        bottom: 0;
        left: 50%;
        z-index: 2;
        margin-left: -250px;
        width: 500px;
        height: 60px;
        background-image: url("/static/images/practice/exam/pic_scorebg.png");
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      padding-top: 70px;

      & > p {
        color: #666;
        font-size: 24px;
        line-height: 40px;
      }

      .count {
        display: flex;
        justify-content: center;
        margin: 60px 0 70px;

        & > div {
          height: 100px;
          padding-left: 165px;
          margin: 0 20px;
          color: #999;
          font-size: 24px;
          line-height: 100px;
          background-repeat: no-repeat;

          &.multi {
            background-image: url("/static/images/practice/work/pic_count_multigreat.png");
          }

          &.perfect {
            background-image: url("/static/images/practice/work/pic_count_perfect.png");
          }
        }
      }

      .btn {
        width: 110px;
        height: 34px;
        margin: 0 50px;
        border-radius: 17px;
        border-width: 1px;
        border-style: solid;
        text-align: center;
        line-height: 32px;

        &.again {
          border-color: #24cc7c;
          color: #21bd73;
        }

        &.complete {
          border-color: #24cc7c;
          color: #fff;
          background-color: #24cc7c;

          &:hover {
            border-color: #21bd73;
            background-color: #21bd73;
          }
        }
      }
    }
  }

  .divide {
    padding: 30px 10px 0;
    background-color: #fff;

    & > div {
      position: relative;
      height: 60px;

      .dashed {
        position: absolute;
        top: 29px;
        left: 0;
        z-index: 10;
        width: 100%;
        border-top: 1px dashed #24cc7c;
      }

      .text {
        position: absolute;
        top: 0;
        left: 50%;
        z-index: 20;
        padding: 0 10px 0 40px;
        color: #21bd73;
        font-size: 18px;
        line-height: 60px;
        transform: translateX(-50%);
        background: #fff url("/static/images/practice/work/icon_report.png")
          no-repeat 10px center;
      }
    }
  }

  .detail {
    width: 100%;
    border: 0;
  }

  #vip {
    height: 276px;
    & > button {
      display: block;
      width: 500px;
      height: 122px;
      margin: 10px auto 0;
      border: 0;
      background-color: transparent;
      background-image: url("/static/images/stu/vip/btn_normal.png");
      &:hover {
        background-image: url("/static/images/stu/vip/btn_hover.png");
        cursor: pointer;
      }
    }
    & > a {
      display: block;
      margin-top: 30px;
      line-height: 20px;
      text-align: center;
      font-size: 20px;
      color: #ff8726;
      cursor: pointer;
    }
  }
}
</style>