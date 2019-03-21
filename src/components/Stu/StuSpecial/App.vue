<template lang="pug">
  div.section.flex-center-center(v-if='status_ === "loading"' :style='{ height: loadingHeight }')
    Loading
  #stu-special(v-else :style='{ "min-height": loadingHeight }')
    div.section(ref='nav')
      Nav(:list='nav')
      div.type 
        span {{$t('Stu.StuTSKS.type')}}
        ul
          li(
            v-for='(o, idx) in topicTypeList'
            :key='o.id'
            :class='{active: o.selectFlag}'
            @click='toggleType(idx)'
          ) {{o.topicName}}
    div.section.down(v-if='list.length <= 0' :style='{ "min-height": downHeight }')
      div.emptyBox
        img(src='/static/images/stu/special/pic_empty-05.png')
        p.f16.greyc.text-ct {{$t('Stu.StuSpecial.empty')}}
    div.section.down(v-else :style='{ "min-height": downHeight }')
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
          div.left(:class='handleColor(o.submitInfo.score)')
          div.center
            p.a.grey6.f16 {{o.title}}
            div
              div.avatar(v-for='n in o.submitClassInfo')
                img(:src='n.headPic ? ($config.resUrl + n.headPic) : "/static/images/pic_boy01.png"')
              span.grey9(:class='{empty: parseInt(o.submitClassCount) === 0}') {{parseInt(o.submitClassCount) === 0 ? $t('Stu.StuTSKS.avatar.nobody') : ((parseInt(o.submitClassCount) > 5 ? $t('Stu.StuTSKS.avatar.other') : '') + o.submitClassInfo.length + $t('Stu.StuTSKS.avatar.text'))}}
          div.right
            button.btn.btn-green(@click='handleGoPractice(o)') {{$t('Stu.StuTSKS.btn.practice')}}
            button.btn(:class='handleColor(o.submitInfo.score) === "b" ? "btn-disabled" : "btn-outline-green"' @click='goToReport(o)') {{$t('Stu.StuTSKS.btn.report')}}
      Pagination(:currentPage='currentPage' :maxNumPage='maxPage' :getSkipPage='getSkipPage' ref='randerPage')
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      status_: 'loading',
      loadingHeight: 'auto',
      downHeight: 'auto',
      nav: [{
        title: this.$t('Stu.nav.index'),
        href: 'stuIndex'
      }, {
        title: this.$t('Stu.nine.Special')
      }],
      activeType: '',
      topicTypeList: [],
      list: [],
      rows: 10,
      currentPage: 1,
      maxPage: 1
    }
  },
  watch: {
    'status_': function() {
      if (this.status_ !== 'loading') {
        this.$nextTick(() => {
          this.downHeight = (parseInt(this.loadingHeight.replace('px', '')) - this.$refs.nav.clientHeight - 10) + 'px'
        })
      }
    }
  },
  methods: {
    isAllFetched() {
      this.fetchCount -= 1
      if (this.fetchCount <= 0) {
        this.status_ = 'done'
      }
    },
    handleGoPractice(o) {
      const { cmpId, groupId, stageId } = o
      this.$router.push({
        name: 'exam',
        query: {
          competitionId: cmpId,
          groupId,
          stageId,
          fromUrl: encodeURIComponent(this.$route.fullPath.replace(/\?/g, '{{q}}').replace(/&/g, '{{a}}')),
        }
      })
    },
    handleColor(score) {
      if (score === '' || score === '--' || isNaN(score)) {
        return 'b'
      } else {
        const lv = window.ConfigNew.ScoreLevel
        score = parseInt(score)
        return score < lv.bad ? 'r' : (score < lv.good ? 'y' : 'g')
      }
    },
    toggleType(n) {
      for (let i = 0; i < this.topicTypeList.length; i++) {
        this.topicTypeList[i].selectFlag = false
      }
      let o = this.topicTypeList[n]
      o.selectFlag = !o.selectFlag
      this.activeType = o.topicId
      this.getList()
    },
    getType(page) {
      this.$jsonp('/api/lst_zxxl/dictCatgList', {}, (errs, res) => {
        if (res.status === 1) {
          this.topicTypeList = []
          for (let i = 0; i < res.data.length; i++) {
            this.topicTypeList.push({
              topicName: res.data[i].name,
              topicId: res.data[i].id,
              selectFlag: i === 1
            })
          }

          this.toggleType(0)
          this.isAllFetched()
        } else {
          this.$store.commit('showErrDialog', {
            errText: res.info,
            btnText: this.$t('dialog.iknow')
          })
        }
      })
    },
    getList(page) {
      this.$jsonp('/api/lst_zxxl/index?dzcId=' + this.activeType + '&page=' + (page || 1) + '&rows=' + this.rows, {}, (errs, res) => {
        if (res.status === 1) {
          let pageinfo = res.data.pageInfo
          this.list = res.data.list
          this.currentPage = parseInt(pageinfo.page)
          this.maxPage = Math.ceil(parseInt(pageinfo.total) / parseInt(pageinfo.rows)) || 1
          this.isAllFetched()
        } else {
          this.$store.commit('showErrDialog', {
            errText: res.info,
            btnText: this.$t('dialog.iknow')
          })
        }
      })
    },
    getSkipPage(page) {
      this.getList(page)
    },
    goToReport(oneRecord) {
      const submitInfo = oneRecord.submitInfo
      if (this.handleColor(submitInfo.score) !== 'b') {
        const gId = oneRecord.groupId
        const sId = oneRecord.stageId
        window.open('/web/models/Report/default/self.php?gId=' + gId + '&sId=' + sId + '&studentId=' + submitInfo.stuId)
      }
    },
  },
  mounted() {
    this.getType()
    this.fetchCount = 2
    this.loadingHeight = this.getNavHeight()
  }
}
</script>

<style lang="less">
#stu-special {
  .type {
    padding: 30px;
    height: 84px;
    display: flex;
    align-items: center;
    span {
      color: #ccc;
      font-size: 14px;
      margin-right: 20px;
    }
    ul {
      display: flex;
      align-items: center;
      li {
        width: auto;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        color: #666;
        padding: 0 15px;
        border-radius: 4px;
        cursor: pointer;
        &.active {
          background-color: #24cc7c;
          color: #fff;
        }
      }
    }
  }

  .emptyBox {
    width: 300px;
    height: 300px;
    margin: 50px auto 0;
    display: block;
    position: relative;

    p {
      width: 100%;
      position: absolute;
      top: 230px;
      left: 0;
    }
  }

  .down {
    margin-top: 10px;
    padding: 1px 30px 40px;

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

      .a {
        max-width: 600px;
        line-height: 30px;
        margin: 30px 0 20px;
      }

      div {
        display: flex;
        align-items: flex-end;
        height: 30px;

        .avatar {
          border-radius: 15px;
          margin-right: 8px;
          overflow: hidden;

          img {
            width: 30px;
            height: 30px;
          }
        }

        span {
          margin-left: 15px;

          &.empty {
            margin-left: 0;
          }
        }
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .btn:first-child {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
