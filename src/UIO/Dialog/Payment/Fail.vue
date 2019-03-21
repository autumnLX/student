<template lang="pug">
  div#dialog-paymentFail
    img(src='/static/images/dialog/payfalse.png')
    p.text-ct.f16 {{dialogConfig.text}}
    div.operation
      button.btn.btn-l.btn-green(@click='dialogConfig.cancleBtnCallBack') {{dialogConfig.cancleBtnText}}
</template>

<script>
export default {
  name: 'PaymentFail',
  props: ['dialogConfig'],
  data() {
    return {
    }
  }
}
</script>

<style lang='less' scoped>
#dialog-paymentFail {
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

  & > img {
    margin: 15px auto;
  }

  & > p {
    width: 100%;
    height: 24px;
    line-height: 24px;
    display: block;
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