<template lang="pug">
  transition(mode='out-in' name='fade')
    div#DiaLog(v-if='showDialogFlag')
      component(:is='currentView' :dialogConfig='defaultConfig' :closeDialog='closeDialog' :errMsg='errorMsg' :nonTipAgain='nonTipAgain')
</template>

<script>

import Element from './index.js'

export default {
  name: 'DiaLog',
  components: Object.assign({}, {Element}),
  props: ['dialogConfig', 'isShowDialog', 'errorMsg'],
  data() {
    return {
      currentView: '',
      showDialogFlag: this.isShowDialog === undefined ? true : this.isShowDialog,
      selectActiveFlag: false,
      defaultCfg: {
        needCancleIcon: false,
        showCancleBtn: true,
        showConfirmleBtn: true,
        confirmBtnText: '确认',
        cancleBtnText: '取消',
        confirmBtnStyle: 'green',
        cancleBtnStyle: 'white',
        showBigTileFlag: true,
        showBigTileText: '大号标题',
        titleIcon: 'attention', // success||warning||attention
        showAssistTitleFlag: true,
        showAssistTitleText: '小号标题',
        assistTitleStyle: 'small', // big||middle||small
        isNONTipAgain: false // 不再提示
      },
      // defaultCfg: {
      //   needCancleIcon: false,
      //   showCancleBtn: true,
      //   showConfirmleBtn: true,
      //   confirmBtnText: '确认',
      //   cancleBtnText: '取消',
      //   confirmBtnStyle: 'green',
      //   cancleBtnStyle: 'white'
      // },
      defaultConfig: {}
    }
  },
  methods: {
    closeDialog(bool) {
      this.showDialogFlag = bool
    },
    verification() {
      this.defaultConfig = Object.assign({}, this.defaultCfg, this.dialogConfig)
    },
    nonTipAgain(flag) {
      this.selectActiveFlag = flag
    }
  },
  watch: {
    isShowDialog: function (val) {
      this.showDialogFlag = this.isShowDialog === undefined ? true : this.isShowDialog
    },
    dialogConfig: function (val) {
      this.verification()
    }
  },
  mounted() {
    this.verification()
    if (this.dialogConfig.getCurrentPage !== '') {
      for (let key in Element) {
        if (key === this.dialogConfig.getCurrentPage) {
          this.currentView = Element[this.dialogConfig.getCurrentPage]
          break
        } else {
          this.currentView = Element['common']
        }
      }
    } else {
      this.currentView = Element['common']
    }
  }
}
</script>

<style lang='less' scoped>
@image-base-url: "./image";
#DiaLog {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: rgba(0, 0, 0, .5);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    width: 40px;
    height: 40px;
    position: absolute;
    top: 0;
    right: 0; 
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 400ms;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>