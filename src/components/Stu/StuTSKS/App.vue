<template lang="pug">
  div.section.flex-center-center(v-if='status_ === "loading"' :style='{ height: loadingHeight }')
    Loading
  #stu-tsks(v-else)
    div.section
      Nav(:list='nav')
      div.cover
        div(:style='{ height: coverHeight }')
          i(v-if='coverToggler' @click='handleCover' :class='{ expand: coverHeight === "auto"}') {{ coverHeight === 'auto' ? "收起全部" : "展开全部"}}
          img(:src='cover.imgUrl')
          div
            div(ref='desc')
              p.text1.f16.grey6 {{ cover.desc.title }}
              p.text2.grey9 {{ cover.desc.intro }}
              ul
                li.grey9(v-for='(text, idx) in cover.desc.content' :key='"content" + idx') {{ text }}
    div.section.down(v-if='list.length <= 0')
      div.emptyBox
        img(src='/static/images/stu/special/pic_empty-05.png')
        p.f16.greyc.text-ct {{$t('Stu.StuSpecial.empty')}}
    div.section.down(v-else)
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
            p.a.gray6.f16 {{o.title}}
            div
              div.avatar(v-for='n in o.submitClassInfo')
                img(:src='n.headPic ? ($config.resUrl + n.headPic) : "/static/images/pic_boy01.png"')
              span.gray9(:class='{empty: parseInt(o.submitClassCount) === 0}') {{parseInt(o.submitClassCount) === 0 ? $t('Stu.StuTSKS.avatar.nobody') : ((parseInt(o.submitClassCount) > 5 ? $t('Stu.StuTSKS.avatar.other') : '') + o.submitClassInfo.length + $t('Stu.StuTSKS.avatar.text'))}}
          div.right
            button.btn.btn-green(@click='handleGoPractice(o)') {{$t('Stu.StuTSKS.btn.practice')}}
            button.btn(:class='handleColor(o.submitInfo.score) === "b" ? "btn-disabled" : "btn-outline-green"' @click='goToReport(o)') {{$t('Stu.StuTSKS.btn.report')}}
      Pagination(:currentPage='currentPage' :maxNumPage='maxPage' :getSkipPage='getSkipPage' ref='randerPage')
</template>

<script>
/**
 * 听说考试
 */
export default {
  name: 'StuTsks',
  data() {
    return {
      status_: 'loading',
      loadingHeight: 'auto',
      cover: { desc: {} },
      coverHeight: '170px',
      coverToggler: false,
      nav: [{
        title: this.$t('Stu.nav.index'),
        href: 'stuIndex'
      }, {
        title: this.$t('Stu.nine.TSKS')
      }],
      list: [],
      rows: 10,
      currentPage: 1,
      maxPage: 1
    }
  },
  methods: {
    handleCover() {
      this.coverHeight = this.coverHeight === 'auto' ? '170px' : 'auto'
    },
    handleGoPractice(o) {
      const { cmpId, groupId, stageId, modeId } = o
      this.$router.push({
        name: 'exam',
        query: {
          competitionId: cmpId,
          groupId,
          stageId,
          modelId: modeId,
          isTSKS: 1,
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
    getList(page) {
      this.$jsonp('/api/lst_tsks/index?page=' + (page || 1) + '&rows=' + this.rows, {}, (errs, res) => {
        if (res.status === 1) {
          let pageinfo = res.data.pageInfo
          this.cover = res.data.cover
          this.list = res.data.list
          this.currentPage = parseInt(pageinfo.page)
          this.maxPage = Math.ceil(parseInt(pageinfo.total) / parseInt(pageinfo.rows)) || 1
          this.status_ = 'done'
          this.$nextTick(() => {
            this.coverToggler = parseInt(getComputedStyle(this.$refs.desc).height) > 150
          })
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
    this.getList()
    this.loadingHeight = this.getNavHeight()
  }
}
</script>

<style lang="less">
#stu-tsks {
  .cover {
    padding: 20px 30px 30px;
    & > div {
      position: relative;
      display: flex;
      height: 170px;
      overflow: hidden;

      & > i {
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 2;
        padding-right: 21px;
        color: #ccc;
        line-height: 16px;
        font-style: normal;
        background: url("/static/images/icon_arrow_16.png") no-repeat right 0;
        &:hover {
          color: #21bd73;
          background-position-y: -16px;
          cursor: pointer;
        }

        &.expand {
          background-position-y: -32px;
          &:hover {
            background-position-y: -48px;
          }
        }
      }

      & > img {
        width: 240px;
        height: 170px;
      }

      & > div {
        flex: 1;
        padding: 15px 35px;

        p {
          line-height: 20px;
          &.text1 {
            margin-bottom: 5px;
          }
          &.text2 {
            margin-bottom: 15px;
          }
        }

        li {
          position: relative;
          padding-left: 21px;
          line-height: 20px;

          &::before {
            content: "";
            position: absolute;
            left: 5px;
            top: 7px;
            width: 6px;
            height: 6px;
            border-radius: 3px;
            background-color: #24cc7c;
          }
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
  }
}
</style>