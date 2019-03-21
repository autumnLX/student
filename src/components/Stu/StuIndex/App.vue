<template lang="pug">
  div.container
    div.centerBox.sectionBox
      div.section(style='width: 680px;')
        BackLogWork
      Nine(v-if='$store.state.isVIP || !model')
    div.sideBox.sectionBox
      KYZX
      BJSY
      BJDT
    div.cover-b(v-if='!$store.state.isShowSsoD && (isShowPromotion() || promoteGrade)')
      div.promotion(:class='{promoteGrade: !isShowPromotion()}')
        i.icon-common4.icon-close(@click='closePromotion')
        p.promotion-texttop.f20.white(:style='{visibility: isShowPromotion() ? "hidden" : "visible"}') {{pTop}}
        p.promotion-name.f20 {{pName}}
        p.promotion-text.f20 {{pText}}
        div.promotion-btnBox(v-if='isShowPromotion()')
          router-link.promotion-btn.btn.btn-l.btn-red(:to='{name: "stuMsgCenter"}') {{$t('Stu.StuIndex.promoteBtn')}}
        div.promotion-btnBox(v-else-if='promoteGrade')
          router-link.promotion-btn.btn.btn-l.btn-outline-green(:to='{name: "stuOwnInfo"}') {{$t('Stu.StuIndex.promoteGradeBtn1')}}
          button.promotion-btn.btn.btn-l.btn-green(@click='confirmPromotion') {{$t('Stu.StuIndex.promoteGradeBtn2')}}
        p.promotion-cname.f12.grey9 {{pTips}}
</template>

<script>
import Header from '@/components/Stu/header'
import BackLogWork from '@/components/Stu/StuIndex/backLogWork'
import Nine from '@/components/Stu/StuIndex/nine'
import KYZX from '@/components/Stu/StuIndex/kyzx'
import BJSY from '@/components/Stu/StuIndex/bjsy'
import BJDT from '@/components/Stu/StuIndex/bjdt'
export default {
  name: 'stu',
  props: ['checkNewNotices'],
  components: Object.assign({}, { Header, BackLogWork, Nine, KYZX, BJSY, BJDT }),
  data () {
    return {
      model: 1,
      promoteDShow: false,
      promotionList: [],
      curPromotion: {},
      curPIndex: 0,
      promoteGrade: 0,
    }
  },
  methods: {
    promoteDStatus() {
      this.promoteDShow = this.isShowPromotion() || this.promoteGrade
      this.$store.commit('setPromoteD', this.promoteDShow)
    },
    isShowPromotion() {
      return this.curPIndex < this.promotionList.length
    },
    readPromotion() {
      this.curPromotion = this.promotionList[this.curPIndex]
      this.$api.readPromotion({
        stageId: this.curPromotion.stageId,
        groupId: this.curPromotion.groupId
      }, () => {
        if (!this.isShowPromotion()) this.checkNewNotices()
      })
    },
    closePromotion() {
      this.curPIndex++
      this.promoteDStatus()
      if (this.isShowPromotion()) this.readPromotion()
      else this.confirmPromotion()
    },
    confirmPromotion() {
      this.$api.setPromoteNoticeReaded(() => {
        this.promoteGrade = 0
        this.$util.setCookie('promote_notice_login', 0)
        this.$util.setCookie('promote_notice_join', 0)
      })
    },
  },
  computed: {
    pTop() {
      if (this.isShowPromotion()) return ''
      else return this.$t('Stu.StuIndex.promoteGradeCongL') + this.$store.state.student.name + this.$t('Stu.StuIndex.promoteGradeCongR')
    },
    pName() {
      if (this.isShowPromotion()) return this.curPromotion.stuName
      else return this.$store.state.student.grade + this.$store.state.student.clazz
    },
    pText() {
      if (this.isShowPromotion()) return this.$t('Stu.StuIndex.promoteCong') + this.curPromotion.stageName + '！'
      else return this.$store.state.student.school
    },
    pTips() {
      if (this.isShowPromotion()) return this.curPromotion.competitionName
      else return this.$t('Stu.StuIndex.promoteGradeTip')
    },
  },
  created() {
    this.model = Number(this.$util.getCookieValue('model'))
  },
  mounted() {
    this.$api.getPromotion((res) => {
      this.promotionList = res
      if (this.promotionList.length > 0) this.readPromotion()
      this.promoteGrade = parseInt(this.$util.getCookieValue('promote_notice_login'))
      this.promoteDStatus()
    })
  }
}
</script>

<style lang='less' scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;

  .sectionBox {
    & > div {
      margin-bottom: 10px;

      &:last-child {
        margin: 0;
      }
    }
  }

  .promotion {
    width: 350px;
    height: 400px;
    background-image: url(/static/images/stu/index/bg_promotion.png);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    &.promoteGrade {
      background-image: url(/static/images/stu/index/bg_newterm.png);
    }

    i {
      position: absolute;
      top: 5px;
      right: 5px;
    }

    p {
      line-height: 24px;
    }

    a, button {
      width: 120px;
    }

    button {
      margin-left: 30px;
    }

    .promotion-texttop {
      margin-top: 104px;
    }

    .promotion-name {
      margin-top: 64px;
      margin-bottom: 10px;
    }

    .promotion-btn {
      margin-top: 50px;
      margin-bottom: 20px;
    }
  }
}
</style>
