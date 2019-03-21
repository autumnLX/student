<template lang="pug">
  div.section.flex-center-center(v-if='status_ === "loading"' :style='{ height: height }')
    Loading
  #stu-sts.section(v-else :style='{ "min-height": height }')
    Nav(:list='nav')
    div.stsbox
      div.block(v-for='(o, idx) of list' :class='{lastMiddleBlock: idx === list.length - 1 && idx % 3 === 1}')
        div.cover
          img(:src='$config.resUrl + o.coverImg' width='270' height='180' alt='')
          img.stsplay(src='@/assets/image/stu/sts/pic_stsplay.png' width='52' height='51' alt='')
          div.hover
            button.btn.btn-green(@click='goToPractice(idx)') {{$t('Stu.StuSTS.btnText')}}
        p.title.f16.gray6.ellipsis(:title='o.titleName' v-html="o.titleName")
    hr
    Pagination.pagination(:currentPage="currentPage" :maxNumPage="maxPage" :getSkipPage="getSkipPage")
</template>

<script>
export default {
  name: 'StuSts',
  data() {
    return {
      status_: 'loading',
      height: 0,
      nav: [{
        title: this.$t('Stu.nav.index'),
        href: 'stuIndex'
      }, {
        title: this.$t('Stu.nine.STS')
      }],
      list: [],
      rows: 9,
      currentPage: 1,
      maxPage: 1,
    }
  },
  methods: {
    getList(page) {
      this.$jsonp('/api/es_sts/index?page=' + (page || 1) + '&rows=' + this.rows, {}, (errs, res) => {
        if (res.status === 1) {
          let pageinfo = res.data.pageInfo
          this.list = res.data.list
          this.currentPage = parseInt(pageinfo.page)
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
    },
    goToPractice(idx) {
      let _idx = (this.rows * (this.currentPage - 1) + idx) % 10
      let _page = Math.ceil((this.rows * (this.currentPage - 1) + idx + 1) / 10)
      this.$router.push({
        name: 'exam',
        query: {
          idx: _idx,
          page: _page,
          from: '4',
          fromUrl: encodeURIComponent(this.$route.fullPath.replace(/\?/g, '{{q}}').replace(/&/g, '{{a}}')),
        }
      })
    }
  },
  mounted() {
    this.getList()
    this.height = this.getNavHeight()
  }
}
</script>

<style lang="less">
#stu-sts {
  padding-bottom: 40px;

  & > .stsbox {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 20px 30px 10px;
  }

  .block {
    margin-bottom: 20px;

    &.lastMiddleBlock {
      margin-left: 40px;
      margin-right: auto;
    }

    .cover {
      position: relative;
      width: 270px;
      height: 180px;
      border: 1px solid #efefef;
      border-radius: 4px;
      margin-bottom: 10px;
      overflow: hidden;

      .stsplay {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -26px;
        margin-left: -25px;
        display: block;
        z-index: 9;
      }

      &:hover .hover {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .hover {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10;
      }
    }

    .title {
      width: 270px;
      margin: 0;
      line-height: 24px;
    }
  }

  hr {
    width: 890px;
    margin: 0 auto;
  }

  div.pagination {
    margin: 30px auto 0;
  }
}
</style>
