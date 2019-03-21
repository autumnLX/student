<template lang="pug">
  div#dialog-sso
    div
      p.title {{$t('dialog.sso.title')}}
      div.assistTitle.f16 {{$t('dialog.sso.textL') + dialogConfig.showAssistTitleText + $t('dialog.sso.textR')}}
      p.grey9 {{$t('dialog.sso.tip')}}
    div.operation
      button.btn.btn-white(@click='dialogConfig.cancleBtnCallBack') {{$t('dialog.sso.btnL')}}
      button.btn.btn-green(@click='dialogConfig.confirmBtnCallBack(writeLog)') {{$t('dialog.sso.btnR')}}
</template>

<script>
export default {
  name: 'Sso',
  props: ['dialogConfig'],
  data() {
    return {
    }
  }
}
</script>

<style lang='less'>
#dialog-sso {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 400px;
  margin: -200px 0 0 -200px;
  border-radius: 5px;
  overflow: hidden;
  background: #fff;
  text-align: center;
  z-index: 10;
  padding: 30px;

  .title {
    width: 100%;
    height: 30px;
    color: #333333;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    overflow: hidden;
  }

  .assistTitle {
    display: inline-block;
    text-align: left;
    margin: 30px auto 20px;
    overflow: hidden;
  }

  .operation {
    margin-top: 30px;

    button {
      margin: 0 15px;
    }
  }
}
</style>