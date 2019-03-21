<template lang="pug">
  div.bjdtBox.section
    div.title.f16.grey6.text-ct {{$t('Stu.StuIndex.bjdt.title')}}
    div.emptyBox(v-if="studyList.length === 0")
      div.empty
      p.emptyMsg {{$t('Stu.StuIndex.bjdt.emptyMsg1')}}
      p.emptyMsg {{$t('Stu.StuIndex.bjdt.emptyMsg2')}}
    div.pulltemp(v-else)
      div.detail(v-for="(item, index) in studyList")
        div.avator(:class='{vip: item.vip.isVip && !item.vip.isExpired}')
          img(:src='item.headPic')
        div.content
          p.stuMsg
            span.stuName.f14.grey6(v-text="item.stuName" :title='item.stuName')
            span.msg.f14.grey9 {{$t('Stu.StuIndex.trends')}}{{item.prcName}}
          p.completeTime {{item.submitDate}}
    p.checkMore(v-if="totalNum > 8" @click="showMore") {{$t('Stu.StuIndex.bjdt.more')}}
</template>

<script>
/**
 * 班级动态
 */
export default {
  name: 'bjdt',
  data() {
    return {
      showFlag: true,
      studyList: [],
      totalNum: ''
    }
  },
  methods: {
    showMore() {
      this.$router.push({ name: 'stuTrends' })
    },
    getData() {
      this.$api.getSubmitLog({ page: 1, rows: 8, showName: 0 }, (res) => {
        this.studyList = res.list
        this.totalNum = res.pageInfo.total
      })
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
<style lang="less">
@img-url: "../../../assets/image/stu/index";
.bjdtBox {
  padding-top: 10px;
  padding-bottom: 20px;
  text-align: center;
  width: 260px;
  min-height: 250px;
  position: relative;
  .emptyBox {
    width: 100%;
    height: 210px;
    .empty {
      width: 180px;
      height: 135px;
      background: url("@{img-url}/pic_bjdt.png") no-repeat center center;
      margin: 0 auto;
      margin-bottom: 15px;
    }
    .emptyMsg {
      font-size: 14px;
      color: #ccc;
      line-height: 24px;
    }
  }
  .title {
    line-height: 50px;
    height: 50px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  .pulltemp {
    & > div {
      padding-left: 20px;
      padding-right: 20px;
      width: 100%;
      height: 40px;
      margin-bottom: 20px;
      display: flex;

      .avator {
        position: relative;
        // border-radius: 20px;
        margin-right: 8px;
        // overflow: hidden;

        &.vip::after {
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          display: block;
          width: 14px;
          height: 14px;
          background-image: url("/static/images/stu/index/ic_v.png");
          background-size: cover;
        }

        img {
          width: 40px;
          height: 40px;
          border: #eee 1px solid;
          border-radius: 20px;
        }
      }

      .content {
        display: inline-block;
        p.stuMsg {
          line-height: 20px;
          max-width: 170px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          text-align: left;
          span.stuName {
            margin-right: 5px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        p.completeTime {
          color: #ccc;
          font-size: 12px;
          text-align: left;
        }
      }
    }
  }
  .checkMore {
    font-size: 14px;
    color: #ccc;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: #21bd73;
    }
  }
}
</style>