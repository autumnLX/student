<template lang="pug">
  div.result
    div.left(:class='scoreLevel + "Bg"')
      div.result-zone
        div.unpublish(v-if='singleTopicType')
          img(src='/static/images/practice/exam/pic_sucessful.png')
          p 完成
        div.publish(v-else-if='published')
          div
            p.text1 我的成绩
            p.text2 {{ score }}
            p.text3.best 最好成绩：{{ best }}分
            p.text3.rank 当前排名：{{ rank }}
            p.text3.time(v-if='competitionType === "1"') 答题时间：{{ minute }}分钟
          div.btn.f16.white(@click='onGoToRank' v-if='showRanking') 查看排名
        div.unpublish(v-else)
          img(src='/static/images/practice/exam/pic_sucessful.png')
          p 已提交
      div.bg
    div.right
      div(v-if='singleTopicType')
        p 你已顺利完成了全部题目
        div
          img.sway(src='/static/images/practice/exam/pic_kami_urgood.png')
          div
            div.btn.complete(@click='onExamComplete') 完成
      div(v-else)
        p(v-if='!published && !singleTopicType') 成绩将于{{showTime}}公布
        p(v-else-if='scoreLevel === "great"') 厉害了，宇宙第一非你莫属！
        p(v-else-if='scoreLevel === "good"') 哎哟！不错哟！继续加油！
        p(v-else-if='scoreLevel === "bad"') 多听多练，你会更棒~
        p(v-else) 不要气馁！多加练习进步快哦！
        div(v-if='published')
          img.float(src='/static/images/practice/exam/pic_kami_great.png' v-if='scoreLevel === "great"')
          img.float(src='/static/images/practice/exam/pic_kami_good.png' v-else-if='scoreLevel === "good"')
          img.float(src='/static/images/practice/exam/pic_kami_notbad.png' v-else-if='scoreLevel === "bad"')
          img.float(src='/static/images/practice/exam/pic_kami_bad.png' v-else)
          div
            div.btn.again(v-if='canRestart' @click='onAgain') 再练一次
            div.btn.complete(@click='onExamComplete') 完成
        div(v-else)
          img.sway(src='/static/images/practice/exam/pic_kami_waitscore.png')
          div
            div.btn.complete(@click='onExamComplete') 完成
</template>

<script>
/**
 * 定时公布成绩结果页
 */
export default {
  name: 'StuExamResult',
  props: ['published', 'singleTopicType', 'score', 'scoreRate', 'best', 'rank', 'minute',
    'onAgain', 'onGoToRank', 'onExamComplete', 'showRanking', 'showTime', 'competitionType',
    'canRestart'],
  computed: {
    scoreLevel: function() {
      if (this.published) {
        if (this.scoreRate > this.$config.ScoreLevel.great) {
          return 'great'
        } else if (this.scoreRate > this.$config.ScoreLevel.good) {
          return 'good'
        } else if (this.scoreRate > this.$config.ScoreLevel.bad) {
          return 'notbad'
        } else {
          return 'bad'
        }
      }
    }
  }
}
</script>

<style lang="less">
#stu-practice-exam .result {
  display: flex;

  .left {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 500px;
    background-image: linear-gradient(to right, #24cc7c, #24cc7c);

    .result-zone {
      position: relative;
      z-index: 3;
      width: 300px;
      height: 420px;
      padding-top: 48px;
      background-image: url("/static/images/practice/exam/pic_bg_great.png");

      .publish {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
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

              &.rank {
                background-position-y: -30px;
              }

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

      .unpublish {
        text-align: center;

        img {
          width: 100px;
          height: 100px;
        }

        p {
          margin-top: 52px;
          color: #fff;
          font-size: 24px;
          line-height: 40px;
        }
      }
    }

    &.badBg {
      background-image: linear-gradient(to right, #ff817a, #ff6249);
      .result-zone{
        background-image: url("/static/images/practice/exam/pic_bg_bad.png");
      }
    }

    &.notbadBg {
      background-image: linear-gradient(to right, #ffb675, #ffab44);
      .result-zone {
        background-image: url("/static/images/practice/exam/pic_bg_notbad.png");
      }
    }

    &.greatBg {
      background-image: linear-gradient(to right, #6dd17e, #45d178);
      .result-zone {
        background-image: url("/static/images/practice/exam/pic_bg_good.png");
      }
    }

    .bg {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 2;
      width: 500px;
      height: 60px;
      background-image: url("/static/images/practice/exam/pic_scorebg.png");
    }
  }

  .right {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;

    & > div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 620px;
      height: 420px;
      padding-top: 40px;

      p {
        color: #666;
        font-size: 24px;
        line-height: 40px;
      }

      & > div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        margin-top: 45px;

        img {
          width: 300px;
          height: 200px;
          animation: float 2s ease-in-out infinite alternate;

          &.float {
            animation-name: float;
          }

          &.sway {
            animation-name: sway;
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

    @keyframes float {
      from {
        transform: translateY(0);
      }

      to {
        transform: translateY(20px);
      }
    }

    @keyframes sway {
      from {
        transform: translateX(0);
      }

      to {
        transform: translateX(20px);
      }
    }
  }
}
</style>
