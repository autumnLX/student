<template lang="pug">
  div#dialog-payment
    p.title
      img(src='/static/images/dialog/icon_confirm.png')
      | {{$t('dialog.payment.title')}}
    div.row
      span {{$t('dialog.payment.content')}}:
      p {{dialogConfig.cName}}
    div.row
      span {{$t('dialog.payment.cost')}}:
      p
        span.orange {{dialogConfig.cCost}}
        | {{$t('dialog.payment.costR')}}
    div.row
      span {{$t('dialog.payment.type')}}:
      div.typeBox
        label.ali(:class='{active: payType === "ali"}' @click='changePayType' data-type='ali')
        label.wx(:class='{active: payType === "wx"}' @click='changePayType' data-type='wx')
    div.operation
      button.btn.btn-l.btn-white(@click='dialogConfig.cancleBtnCallBack') {{$t('dialog.payment.cancel')}}
      button.btn.btn-l.btn-orange(@click='dialogConfig.confirmBtnCallBack(payType)') {{$t('dialog.payment.submit')}}
</template>

<script>
export default {
  name: 'Payment',
  props: ['dialogConfig'],
  data() {
    return {
      payType: 'ali',
    }
  },
  methods: {
    changePayType(event) {
      this.payType = event.target.dataset.type
    }
  },
  mounted() {
  }
}
</script>

<style lang='less' scoped>
#dialog-payment {
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
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    overflow: hidden;
    display: inline-block;
    margin: 0 auto 15px;

    img {
      margin-right: 10px;
      float: left;
    }
  }

  .row {
    width: 100%;
    height: 40px;
    display: block;
    overflow: hidden;

    & > span {
      float: left;
      margin-right: 10px;
      line-height: 40px;
    }

    p {
      text-align: left;
      line-height: 40px;
    }

    .typeBox {
      height: 100%;
      display: flex;
      align-items: center;

      label {
        width: 100px;
        height: 34px;
        display: block;
        float: left;
        margin-right: 10px;
        cursor: pointer;

        &.ali {
          background-image: url(/static/images/dialog/alipay.png);

          &.active {
            background-image: url(/static/images/dialog/alipay_select.png);
          }
        }
        
        &.wx {
          background-image: url(/static/images/dialog/wechatpay.png);

          &.active {
            background-image: url(/static/images/dialog/wechatpay_select.png);
          }
        }
      }
    }
  }

  .operation {
    margin-top: 30px;

    button {
      margin: 0 15px;
    }
  }
}

</style>