<template lang="pug">
  div#dialog-newP
    div
      p.title {{$t('dialog.newPractice.titleL') + dialogConfig.title + $t('dialog.newPractice.titleR')}}
      img(src='/static/images/stu/pic_newwork.png')
      div.assistTitle.f16.green.ellipsis {{dialogConfig.textGreen}}
      p.grey9 {{dialogConfig.text1}}
      p.grey9 {{text2}}
    div.operation
      button.btn.btn-white(@click='dialogConfig.cancleBtnCallBack') {{$t('dialog.newPractice.btnL')}}
      button.btn.btn-green(@click='dialogConfig.confirmBtnCallBack(writeLog)') {{$t('dialog.newPractice.btnR')}}
</template>

<script>
export default {
  name: 'newP',
  props: ['dialogConfig'],
  data() {
    return {
    }
  },
  computed: {
    text2() {
      if (this.dialogConfig.type === 'competition') {
        if (parseInt(this.dialogConfig.text2) > 10) return this.$t('dialog.newPractice.noLimit')
        else return this.$t('dialog.newPractice.textL') + this.dialogConfig.text2 + this.$t('dialog.newPractice.textR')
      } else {
        return this.dialogConfig.text2
      }
    }
  }
}
</script>

<style lang='less'>
#dialog-newP {
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

  img {
    display: block;
    margin: 20px auto;
  }

  .assistTitle {
    display: inline-block;
    text-align: left;
    margin: 0 auto 10px;
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