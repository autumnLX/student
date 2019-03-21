<template lang="pug">
  div#dialog-paymentTip
    p.title {{dialogConfig.title}}
    div.row
      span.f16 {{dialogConfig.text1}}
      span.f16.orange {{dialogConfig.text2}}
      span.f16 {{dialogConfig.text3}}
    div.operation
      button.btn.btn-l.btn-green(@click='dialogConfig.cancleBtnCallBack') {{dialogConfig.cancleBtnText}}
</template>

<script>
export default {
  name: 'PaymentTip',
  props: ['dialogConfig'],
  data() {
    return {
    }
  }
}
</script>

<style lang='less' scoped>
#dialog-paymentTip {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 400px;
  margin: -150px 0 0 -200px;
  border-radius: 5px;
  overflow: hidden;
  background: #fff;
  text-align: center;
  z-index: 10;
  padding: 30px 50px;

  .title {
    height: 30px;
    color: #333333;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    overflow: hidden;
    display: inline-block;
    margin: 0 auto 20px;
  }

  .row {
    width: 100%;
    display: block;
    overflow: hidden;
    text-align: left;

    span {
      line-height: 24px;
    }
  }

  .operation {
    margin-top: 40px;

    button {
      margin: 0 15px;
    }
  }
}

</style>