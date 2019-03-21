<template lang="pug">
  div.section.flex-center-center(v-if='status_ === "loading"' :style='{ height: height }')
    Loading
  #stu-composition.section(v-else)
    Nav(:list='nav')
    p.count.gray9 {{$t('Stu.StuComposition.countL')}}
      span.green  {{ total }} 
      | {{$t('Stu.StuComposition.countR')}}
    div
      div.composition-topic(v-for='(o, idx) of list' :class='{expand: o.expand}')
        div.info-bar
          div
            span.a.gray6.f14 {{(currentPage - 1) * rows + idx + 1}}. {{o.topicTypeName}}
            span.b.gray9.f12 {{$t('Stu.StuComposition.ability')}}：{{o.topicAbility}}
            span.b.gray9.f12 {{$t('Stu.StuComposition.knowledge')}}：{{o.knowledgeTxt}}
            span.b.gray9.f12 {{$t('Stu.StuComposition.difficulty')}}：
              Star(:level='o.difficulty')
        div.content-block
          div.content
            img(v-if='JSON.parse(o.topicAttachment)[0]' :src='$config.resUrl + JSON.parse(o.topicAttachment)[0].attachmentUrl')
            div(v-html='o.topicContent')
          div.toolbar
            span.green(@click='handleToggleContent(idx)') {{ o.expand ? $t('Stu.StuComposition.slideUp') : $t('Stu.StuComposition.slideDown') }}
              i.icon-common(:class='o.expand ? "arrow-up" : "arrow-down"')
            button.btn.btn-sm.btn-green(@click='handleGoPractice(idx)') {{$t('Stu.StuComposition.btnText')}}
      Pagination(:currentPage='currentPage' :maxNumPage='maxPage' :getSkipPage='getSkipPage' ref='randerPage')
</template>


<script>
export default {
  name: 'StuComposition',
  data() {
    return {
      status_: 'loading',
      height: 0,
      nav: [{
        title: this.$t('Stu.nav.index'),
        href: 'stuIndex'
      }, {
        title: this.$t('Stu.nine.Composition')
      }],
      list: [],
      rows: 10,
      total: 0,
      currentPage: 1,
      maxPage: 1
    }
  },
  methods: {
    handleGoPractice(idx) {
      this.$router.push({
        name: 'exam',
        query: {
          idx,
          page: this.currentPage,
          from: '5',
          fromUrl: encodeURIComponent(this.$route.fullPath.replace(/\?/g, '{{q}}').replace(/&/g, '{{a}}')),
        }
      })
    },
    handleToggleContent(n) {
      const o = this.list[n]
      o.expand = !o.expand
      this.list.splice(n, 1, o)
    },
    getList(page) {
      this.$jsonp('/api/es_cjzw/index?page=' + (page || 1) + '&rows=' + this.rows, {}, (errs, res) => {
        if (res.status === 1) {
          let pageinfo = res.data.pageInfo
          this.list = res.data.list
          this.currentPage = parseInt(pageinfo.page)
          this.total = pageinfo.total
          this.maxPage = Math.ceil(parseInt(pageinfo.total) / parseInt(pageinfo.rows)) || 1
          this.status_ = 'done'
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
    }
  },
  mounted() {
    this.getList()
    this.height = this.getNavHeight()
  }
}
</script>

<style lang="less">
#stu-composition {
  padding-bottom: 40px;

  .count {
    padding: 0 40px;
    line-height: 70px;
  }
}

.composition-topic {
  width: 890px;
  margin: 0 auto 20px;
  border: 1px solid #f8f8f8;
  border-radius: 10px;
  background-color: #f8f8f8;
  overflow: hidden;

  &.expand {
    .content-block {
      height: auto;
    }

    .toolbar {
      position: relative !important;
      bottom: 0 !important;
      left: 0 !important;
      margin: 0 auto !important;
    }

    .content > div {
      height: auto !important;
    }
  }

  &:hover {
    border-color: #24cc7c;
  }

  .info-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 25px;
    border-bottom: 1px solid #eee;

    .a {
      font-weight: bold;
    }
    .b {
      padding: 0 20px;
      border-left: 1px solid #eee;
    }
  }

  .content-block {
    position: relative;
    height: 148px;
    padding: 15px 25px;

    .content {
      display: flex;
      margin-bottom: 20px;

      & > img {
        width: 180px;
        height: 120px;
        margin-right: 30px;
      }

      & > div {
        height: 90px;
        overflow: hidden;
        flex: 1;
      }

      .text {
        color: #666;
        line-height: 24px;
      }
    }

    .toolbar {
      position: absolute;
      bottom: 13px;
      left: 25px;
      width: 840px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      background-color: #f8f8f8;

      span {
        cursor: pointer;
      }

      .icon-common {
        margin-left: 10px;
        vertical-align: middle;
      }

      .btn {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
}
</style>
