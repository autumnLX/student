<template lang="pug">
  div.tab-container.rank
    template(v-if='info.list.length > 0')
      div.myself
        img(:src='info.myself.head_pic')
        .info
          div.text.f18.grey6 {{ info.myself.student_name }}
          div.text.f12.grey9 {{ info.myself.school + ' ' + info.myself.category +  info.myself.class }}
        .result
          div
            span.text.f12.grey9 我的成绩：
            span.text.number(:class='{green: isNum(info.myself.my_score), grey9: !isNum(info.myself.my_score), f18: isNum(info.myself.my_score)}') {{ isNum(info.myself.my_score) ? info.myself.my_score : '-' }}
            span.text.f12.grey9 （满分：{{ info.myself.paper_total_score }}分）
          div
            span.text.f12.grey9 我的排名：
            span.text.number(:class='{green: isNum(info.myself.my_rank), grey9: !isNum(info.myself.my_rank), f18: isNum(info.myself.my_rank)}') {{ isNum(info.myself.my_rank) ? info.myself.my_rank : '-' }}
            span.text.f12.grey9 （总数：{{ info.myself.total_people }}人）
        .right
          button.btn.btn-green.btn-icon(@click='handleFindMe' v-if='isNum(info.myself.my_score) && isNum(info.myself.my_rank)') 找到我
      table.table
        tbody
          tr(v-for='(row, n) of info.list' :key='"row" + n' :class='{ even: (n + 1) % 2 === 0, me: row.student_id === info.myself.student_id }')
            td.place &nbsp;
            td.sn 
              i.rank-icon(v-if='n + 1 < 4' :class='"rank" + (n + 1)')
              span(v-else) {{ n + 1 }}
            td.avatar
              img(:src='row.head_pic')
            td.name {{ row.student_name }}
            td.score {{ row.student_score }}分
            td.time {{ row.student_id === info.myself.student_id ? '测评时间：' + info.myself.submit_date : ''}}
      Pagination(:currentPage='info.page.page' :maxNumPage='info.page.total' :getSkipPage='getSkipPage')
    div.empty(v-else)
      img(src='/static/images/stu/exam_detail/empty_ranking.png')
      div.f16.greyc 目前暂无排名哦~
</template>

<script>
export default {
  name: 'ExamInfoRank',
  props: ['info', 'onPageTurning'],
  methods: {
    isNum(num) {
      return typeof num === 'number'
    },
    getSkipPage(page) {
      this.onPageTurning(page)
    },
    handleFindMe() {
      const myRank = this.info.myself.my_rank
      const page = Math.ceil(myRank / 10)
      if (page !== this.info.page.currentPage) {
        this.getSkipPage(page)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.rank {
  padding-bottom: 40px;

  .myself {
    display: flex;
    padding: 20px 30px;
    margin-top: 20px;
    border-radius: 4px;
    background-color: #f8f8f8;

    .text {
      line-height: 30px;
    }

    img {
      width: 60px;
      height: 60px;
      border: 1px solid #eee;
      border-radius: 30px;
    }

    .info {
      width: 196px;
      margin-left: 10px;
      border-right: 1px solid #eee;
    }

    .result {
      width: 266px;
      margin-left: 30px;
      border-right: 1px solid #eee;

      & > div {
        display: flex;

        .number {
          width: 50px;
          margin-left: 15px;
        }
      }
    }

    .right {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .btn {
        padding-left: 40px;
        background-image: url("/static/images/stu/exam_detail/icon_btn_search.png");
        background-repeat: no-repeat;
        background-position: 17px center;
      }
    }
  }

  .table {
    width: 100%;

    tr.even > td {
      background-color: #f8f8f8;
    }

    tr.me > td {
      background-color: #caf6e1;
    }

    tr.me * {
      color: #21bd73 !important;
    }

    td {
      line-height: 50px;

      &.place {
        width: 30px;
      }

      &.sn {
        width: 60px;
        padding: 0 15px;

        span {
          display: block;
          width: 30px;
          text-align: center;
        }

        .rank-icon {
          display: inline-block;
          width: 30px;
          height: 30px;
          vertical-align: middle;
          background-image: url("/static/images/icon_commom3.png");

          &.rank2 {
            background-position-x: -30px;
          }

          &.rank3 {
            background-position-x: -60px;
          }
        }
      }

      &.avatar {
        width: 50px;
        text-align: center;

        img {
          width: 30px;
          height: 30px;
          border: 1px solid #eee;
          border-radius: 15px;
          vertical-align: middle;
        }
      }

      &.name {
        width: 120px;
        padding-left: 20px;
      }

      &.score {
        width: 100px;
        text-align: center;
      }

      &.time {
        padding-right: 50px;
        text-align: right;
      }
    }
  }

  .empty {
    padding: 50px 0;
    text-align: center;

    img {
      height: 230px;
    }
  }
}
</style>

