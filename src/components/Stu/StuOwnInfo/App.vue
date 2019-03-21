<template lang="pug">
  div.ownInfo.section(v-if='activeTabIndex < 3')
    Tab(:list='tab' :onChangeTab='handleChangeTab')
    div.tab-container(v-if='activeTabIndex === 0')
      OwnInfo(@showPassword='fromChildEvent')
    div.tab-container.zs(v-if='activeTabIndex === 1')
      Certificate
    div.tab-container.findPassword(v-if='activeTabIndex === 2')
      ChangePassword
  Vip(v-else :back='true' :onBack='handleBack')
</template>

<script>
import OwnInfo from './OwnInfo'
import Certificate from './Certificate'
import ChangePassword from './ChangePassword'
import Vip from '@/UIO/Vip'

export default {
  name: 'ownInfo',
  components: { OwnInfo, Certificate, ChangePassword, Vip },
  data() {
    return {
      tab: [{
        title: '个人信息',
        value: 'personalInfo',
        selected: true
      }, {
        title: '我的证书',
        value: 'certificate'
      }, {
        title: '修改密码',
        value: 'changeWord'
      }],
      activeTabIndex: 0,
      modalIndex: 0
    }
  },
  methods: {
    handleBack() {
      this.handleChangeTab(0)
    },
    handleChangeTab(idx) { // 切换【个人信息】、【我的证书】、【修改密码】
      if (idx < 3) {
        const { tab, activeTabIndex } = this
        if (activeTabIndex > -1 && activeTabIndex < 3) {
          tab[activeTabIndex].selected = false
          this.$set(this.tab, activeTabIndex, tab[activeTabIndex])
        }
        tab[idx].selected = true
        this.$set(this.tab, idx, tab[idx])
      }

      this.activeTabIndex = idx
    },
    fromChildEvent(msg) {
      if (parseInt(msg) === 2) {
        this.handleChangeTab(2)
      }
    },
    switchModal(index) {
      this.modalIndex = index
    }
  },
  mounted() {
  }
}
</script>

<style lang="less">
</style>
