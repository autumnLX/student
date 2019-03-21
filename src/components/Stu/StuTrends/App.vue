<template lang="pug">
  #stu-trends
    div.section
      Nav(:list='nav')
      div.list
        div.listOp(v-for="(o, idx) in list")
          div.avator
            img(:src='o.headPic')
          div.right
            div.basicMsg
              span.name {{o.stuName}}
              span.content.f14.grey9 {{$t('Stu.StuIndex.trends')}}{{o.prcName}}
            div.time {{o.submitDate}}
      Pagination(:currentPage="currentPage" :maxNumPage="maxNumPage" :getSkipPage="getSkipPage")
</template>

<script>
export default {
  name: 'StuTrend',
  data() {
    return {
      nav: [{
        title: '首页',
        href: 'stuIndex'
      }, {
        title: '班级动态'
      }],
      list: [],
      currentPage: 1,
      maxNumPage: 1
    }
  },
  methods: {
    fetchList(page) {
      this.$api.getSubmitLog({ page, rows: 10, showName: 1 }, (res) => {
        const { pageInfo, list } = res
        this.currentPage = page
        this.maxNumPage = Math.ceil((pageInfo.total - 1) / 10)
        this.list = list
      })
    },
    getSkipPage(page) {
      this.fetchList(page)
    }
  },
  created() {
    this.fetchList(1)
  }
}
</script>

<style lang="less">
#stu-trends {
  .section {
    padding-bottom: 40px;
  }

  .list {
    padding: 20px 30px 0;
    .listOp {
      padding-bottom: 15px;
      padding-top: 15px;
      border-bottom: #eeeff6 1px solid;
      &:first-child {
        padding-top: 0;
      }
      display: flex;
      align-items: center;
      .avator {
        border-radius: 50%;
        margin-left: 10px;
        margin-right: 10px;
        overflow: hidden;
        border: #eee 1px solid;
        width: 40px;
        height: 40px;
        line-height: 40px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }
      .right {
        height: 50px;
        .basicMsg {
          height: 30px;
          line-height: 30px;
          .name {
            font-size: 14px;
            color: #666;
            margin-right: 2px;
          }
        }
        .time {
          color: #ccc;
          font-size: 12px;
          height: 20px;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
