<template lang="pug">
  div#common
    img(v-if='dialogConfig.needCancleIcon' src='../image/icon_popup_close.png' alt='' @click='close()')
    div#header
      p.bigtitle(v-if='dialogConfig.showBigTileFlag' :class='dialogConfig.bigTileStyle') {{dialogConfig.showBigTileText}}
      div.tip_icon(v-if='dialogConfig.titleIcon' :class='dialogConfig.titleIcon')
      div.assistTitle(:class='dialogConfig.assistTitleStyle' v-if='dialogConfig.showAssistTitleFlag') {{dialogConfig.showAssistTitleText}}
    div.operation
      button.btn(:class='dialogConfig.cancleBtnStyle' v-if='dialogConfig.showCancleBtn' @click='close()') {{dialogConfig.cancleBtnText}}
      button.btn(:class='dialogConfig.confirmBtnStyle' v-if='dialogConfig.showConfirmleBtn' @click='confirm()') {{dialogConfig.confirmBtnText}}
    div.select(v-if='dialogConfig.isNONTipAgain')
      i.icon-select(:class='{active: selectActiveFlag}' @click='select')
      span 下次不再提示
</template>

<script>
export default {
  name: 'Common',
  props: ['closeDialog', 'dialogConfig', 'nonTipAgain'],
  data() {
    return {
      selectActiveFlag: false
    }
  },
  methods: {
    close() {
      this.closeDialog(false)
      this.dialogConfig.cancleBtnCallBack()
    },
    confirm() {
      this.closeDialog(false)
      this.dialogConfig.confirmBtnCallBack()
    },
    select() {
      this.selectActiveFlag = !this.selectActiveFlag
      this.nonTipAgain(this.selectActiveFlag)
    }
  },
  mounted() {
  }
}
</script>

<style lang='less' scoped>
  @image-base-url: "../image";
  #common {
    width: 400px;
    border-radius: 5px;
    overflow: hidden;
    background: #fff;
    text-align: center;
    z-index: 10;
    padding: 30px;

    & > img {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
    }

    .bigtitle {
      margin-bottom: 20px;
      width: 100%;
      height: 30px;
      color: #333333;
      font-size: 20px;
      line-height: 30px;
      text-align: center;
      overflow: hidden;

      &.green {
        color: #21bd73;
      }
    }

    .tip_icon {
      width: 50px;
      height: 50px;
      margin: 0 auto 10px;
      background: url("@{image-base-url}/icon_popup_icongroups.png") no-repeat;
    }
    .success {
      background-position: 0 0;
    }
    .warning {
      background-position: -50px 0;
    }
    .attention {
      background-position: -100px 0;
    }
    .hide {
      display: none;
    }

    .assistTitle {
      width: 100%;
      margin: 10px auto;
      overflow: hidden;
    }

    .big {
      font-size: 16px;
      color: #666;
    }
    .middle {
      font-size: 14px;
      color: #666;
    }
    .small {
      font-size: 14px;
      color: #999;
    }

    .select {
      width: 100%;
      margin-top: 30px;

      i.icon-select {
        display: inline-block;
        width: 16px;
        height: 16px;
        position: relative;
        top: 3px;
        background: url('@{image-base-url}/icon_common.png') no-repeat center;
        background-position: 0 0;
        cursor: pointer;

        &.active{
          background-position: -16px 0;
        }
      }

      & > span {
        margin-left: 10px;
      }
    }

    .operation {
      margin-top: 30px;

      button:first-child {
        margin-right: 15px;
      }
      button:last-child {
        margin-left: 15px;
      }

      & > .btn {
        &.no-course {
          height: 40px;
          line-height: 40px;
          border-radius: 0!important;
        }
      }
    }
  }
</style>