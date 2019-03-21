<template lang="pug">
  div.section.flex-center-center(v-if='status_ === "loading"' :style='{ height: height }')
    Loading
  #stu-msgCenter.section(v-else :style='{minHeight: height}')
    div.head(v-if='list.length > 0')
      span {{$t('Stu.nav.msg')}}
      label.green(@click='readAllNotice') {{$t('Stu.StuMsgCenter.readAll')}}
    div.msg-list(v-if='list.length > 0')
      ul
        li(
          v-for='(o, index) in list'
          :key='o.notice_id'
          data-nid='o.notice_id'
          :class='o.is_read ? "" : "unread"'
          @click='readOneNotice(index)'
        )
          i.icon(:class='o.type === "promotion" ? "icon-promote" : "icon-msg"')
          div.msg-cnt
            div.msgcnt-title.ellipsis(:class='o.is_read ? "greyc" : "grey6"') {{o.title}}
            div.msgcnt-cnt.ellipsis.f12(:class='o.is_read ? "greyc" : "grey9"' v-html='o.content.replace(/<img[^>]*>/g, "")')
          span.msg-time.f12.greyc {{o.create_time}}
    Pagination(v-if='list.length > 0' :currentPage='currentPage' :maxNumPage='maxPage' :getSkipPage='getSkipPage' ref='randerPage')
    div.empty(v-else)
      img(src='/static/images/stu/msgCenter/pic_empty-07.png')
      p.f16.greyc.text-ct {{$t('Stu.StuMsgCenter.empty')}}
</template>

<script>
export default {
  name: 'StuMsgCenter',
  props: ['checkNewNotices'],
  data() {
    return {
      status_: 'loading',
      height: 0,
      rows: 10,
      currentPage: 1,
      maxPage: 1,
      list: [],
    }
  },
  methods: {
    getList(page) {
      this.$jsonp('/api/competitionsNotices/noticeList?page=' + (page || 1) + '&rows=' + this.rows, {}, (errs, res) => {
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
    readAllNotice() {
      this.$jsonp('/api/competitionsNotices/setAllNoticeRead?&stuId=' + this.$store.state.student.name, {}, (errs, res) => {
        if (res.status === 1) {
          this.checkNewNotices()
          this.getList(this.currentPage)
        } else {
          this.$store.commit('showErrDialog', {
            errText: res.info,
            btnText: this.$t('dialog.iknow')
          })
        }
      })
    },
    readOneNotice(idx) {
      const item = this.list[idx]
      sessionStorage.setItem('title', item.title)
      sessionStorage.setItem('id', item.notice_id)
      sessionStorage.setItem('type', item.type)
      sessionStorage.setItem('groupId', item.group_id ? item.group_id : 0)
      sessionStorage.setItem('stageId', item.stage_id ? item.stage_id : 0)
      this.$router.push({ name: 'stuMsgDetail' })
    },
  },
  mounted() {
    this.height = this.getNavHeight()
    this.getList()
  }
}
</script>

<style lang="less" scope>
#stu-msgCenter {
  padding-top: 1px;
  padding-bottom: 40px;

  .empty {
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

  .head {
    padding: 10px 30px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-size: 18px;
      color: #666;
      line-height: 70px;
    }

    label {
      cursor: pointer;
    }
  }

  .msg-list {
    padding: 0 30px;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 0 15px;
      border-bottom: 1px solid #eeeff6;
      cursor: pointer;

      i.icon {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        background-image: url("../../../assets/image/stu/msgCenter/icon_info.png");
        background-repeat: no-repeat;
        display: block;

        &.icon-msg {
          background-position: -80px 0;
        }

        &.icon-promote {
          background-position: -40px 0;
        }
      }

      .msg-cnt {
        width: 700px;
        margin-right: 10px;
        margin-left: auto;

        & > div {
          display: block;
          width: 100%;
        }

        .msgcnt-title {
          line-height: 30px;
          height: 30px;
          overflow: hidden;
        }

        .msgcnt-cnt {
          line-height: 20px;
          height: 20px;
          overflow: hidden;

          * {
            color: #ccc;
            font-size: 12px;
          }
        }
      }

      .msg-time {
        width: 130px;
        display: block;
      }

      &.unread {
        .msgcnt-cnt * {
          color: #999;
        }
      }
    }
  }
}
</style>
