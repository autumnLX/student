<template lang="pug">
  #stu-msgCenter.section
    Nav(:list='nav')
    div.msg-detail
      div.msg-title.f18 {{msgDetail.title}}
      div.msg-time.f12.greyc {{msgDetail.create_time}}
      div.msg-cnt(v-html='msgDetail.content')
      div.msg-btnBox
        p.prev(v-if='msgDetail.prev' @click='checkOtherNotice("prev")')
          label.green {{$t('Stu.StuMsgCenter.prev')}}
          span.ellipsis {{msgDetail.prev.title}}
        p.next(v-if='msgDetail.next' @click='checkOtherNotice("next")')
          label.green {{$t('Stu.StuMsgCenter.next')}}
          span.ellipsis {{msgDetail.next.title}}
</template>


<script>
export default {
  name: 'StuMsgCenter',
  props: ['checkNewNotices'],
  data() {
    return {
      nav: [{
        title: this.$t('Stu.StuMsgCenter.allNotices'),
        href: 'stuMsgCenter'
      }, {
        title: ''
      }],
      msgParam: {},
      msgDetail: {},
    }
  },
  methods: {
    getOneNotice() {
      this.$jsonp('/api/competitionsNotices/getOneNotice?id=' + this.msgParam.id +
        '&type=' + this.msgParam.type +
        '&groupId=' + this.msgParam.groupId +
        '&stageId=' + this.msgParam.stageId, {}, (errs, res) => {
        if (res.status === 1) {
          this.msgDetail = res.data
          this.checkNewNotices()
        } else {
          this.$store.commit('showErrDialog', {
            errText: res.info,
            btnText: this.$t('dialog.iknow')
          })
        }
      })
    },
    checkOtherNotice(type) {
      const item = this.msgDetail[type]
      sessionStorage.setItem('title', item.title)
      sessionStorage.setItem('id', item.id)
      sessionStorage.setItem('type', item.type)
      sessionStorage.setItem('groupId', item.group_id ? item.group_id : 0)
      sessionStorage.setItem('stageId', item.stage_id ? item.stage_id : 0)

      this.msgParam = {
        title: item.title,
        id: item.id,
        type: item.type,
        groupId: item.group_id ? item.group_id : 0,
        stageId: item.stage_id ? item.stage_id : 0,
      }
    }
  },
  watch: {
    msgParam(val, oldVal) {
      this.getOneNotice()
    }
  },
  mounted() {
    this.msgParam = {
      title: sessionStorage.getItem('title'),
      id: sessionStorage.getItem('id'),
      type: sessionStorage.getItem('type'),
      groupId: sessionStorage.getItem('groupId'),
      stageId: sessionStorage.getItem('stageId'),
    }

    this.$set(this.nav, 1, { title: this.msgParam.title })
  }
}
</script>

<style lang="less" scope>
#stu-msgCenter {
  .msg-detail {
    padding: 20px 80px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .msg-title {
      line-height: 40px;
    }

    .msg-time {
      line-height: 24px;
      margin-bottom: 20px;
    }

    .msg-cnt {
      width: 100%;
      overflow: hidden;
      align-self: flex-start;

      * {
        line-height: 24px;
        word-break: normal;
      }

      img {
        max-width: 790px;
        margin: 20px 0;
      }
    }

    .msg-btnBox {
      width: 440px;
      display: flex;
      margin-top: 60px;

      p {
        width: 180px;
        height: 30px;
        display: flex;
        align-items: center;
        cursor: pointer;

        label {
          margin-right: 10px;
        }

        span {
          flex: 1;
        }

        &.prev {
          margin-left: 0;
          margin-right: auto;
        }

        &.next {
          margin-right: 0;
          margin-left: auto;
        }
      }
    }
  }
}
</style>
