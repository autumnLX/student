<template lang="pug">
  div.kami-charge
    div.kami-charge-dialog
      div.kami-charge-header
        div.kami-charge-person-info(:class='{vip}')
          img.kami-charge-avatar(:src='avatar')
          div(style='margin-left: 8px;')
            div.kami-charge-name.f14.white {{ name }}
            div.kami-charge-level.f12.white {{ vip ? 'VIP' : '普通' }}用户
        div.f18.white 升级VIP，畅享所有功能特权
        div.kami-charge-header-side
          img.kami-charge-close(src='/static/images/view_btn_close_white.png' @click='handleClose')
      div.kami-charge-body(v-if='paymentStatus')
        div.kami-charge-success
          div
            img(src='/static/images/stu/ownInfo/ic_vip.png')
            div.f20.grey9 付款成功
            div.f20.grey9 你已成功购买
              span {{ costList[selectedCostIdx].total }}元/{{ costList[selectedCostIdx].time }}
              | 的VIP套餐
          div.f18.grey9 {{ backCountdown }}s后返回
      div.kami-charge-body(v-else)
        div.kami-charge-top
          div.kami-charge-cost-list
            div.kami-charge-cost(
              v-for='(cost, idx) in costList' 
              :key='"cost" + idx' 
              :class='{active: idx === selectedCostIdx}'
              @click='handleSelectCost(idx)')
              div
                span.f16.text-fe8828(style='margin-right: 4px;') ￥
                span.f26.text-fe8828(style='font-family: condensed;') {{ cost.total }}
                span.f18.grey6(style='margin-left: 6px;') / {{ cost.time }}
              div.kami-charge-day-cost.white {{ cost.day }}
              div.kami-charge-cost-brand.white {{ cost.brand }}
          div.kami-charge-cost-message.grey9 {{ vip ? '于' + this.$store.state.vipTime + '到期，购买后有效期将顺延' : '购买后立即开通' }}
        div.kami-charge-bottom
          div.kami-charge-payment-type.kami-charge-payment-weixin
          div(style='margin: 20px 0 26px;')
            div.flex-start-center
              div.qrcode
                img(:src='QRCode' :style='{visibility: QRCode ? "visible" : "hidden"}')
                div.qrcode-cover.overtime(v-if='overtime' @click='fetchQRCode')
                div.qrcode-cover.loading(v-if='loading')
                  img(src='/static/images/ui/charge/loading.png')
              div
                div
                  span.f24.text-fe8828 ￥
                  span.f36.text-fe8828(style='font-family: condensed;') {{ costList[selectedCostIdx].total }}
                div.f12.grey9(style='padding-left: 3px;margin-top: 10px;') 使用微信扫码支付
          div.flex-start-center
              //- i.icon-confirm(:class='{active: confirm}' @click='handleToggleConfirm')
              span.f12.grey9 开通即同意
              a.f12.green(href='/payment' target='_blank') 《{{ pname }}用户付费协议》
        //- div.kami-charge-bottom
          div.flex-start-center
            i.kami-charge-scan
            span.grey6 支付方式
            div.kami-charge-payment-type.kami-charge-payment-zhifubao(
              :class='{active: paymentType === "alipay_bank"}'
              @click='handleSelectPaymentType("alipay_bank")'
            )
            div.kami-charge-payment-type.kami-charge-payment-weixin(
              :class='{active: paymentType === "wx_pub_qr"}'
              @click='handleSelectPaymentType("wx_pub_qr")'
            )
          div(style='padding-left: 92px;margin: 20px 0 26px;')
            div.flex-start-center
              div.qrcode
                img(:src='QRCode')
              div
                div
                  span.green ￥
                  span.f36.green.font-weight-bold {{ costList[selectedCostIdx].total }}
                div.f12.grey9(style='margin-top: 8px;') 使用支付宝或微信扫码
            div.flex-start-center(style='margin-top: 35px;')
              i.icon-confirm(:class='{active: confirm}' @click='handleToggleConfirm')
              span.f12.grey9 我已阅读并同意
              a.f12.green 《{{ pname }}用户付费协议》
</template>

<script>
/**
 * VIP付费组件
 */
export default {
  name: 'KamiCharge',
  props: ['name', 'avatar'],
  data() {
    return {
      pname: window.ConfigNew.header.name,
      vip: false,
      overtime: false, // 二维码过期
      loading: true, // 读取二维码
      payInfo: {
        jdcpIP: window.ConfigNew.jdcpIP,
        student_id: sessionStorage.getItem('id'),
        student_name: decodeURIComponent(this.$util.getCookieValue('fullName')),
        price: '1.00',
        from: 'web',
        subject: window.ConfigNew.header.name + 'VIP套餐费用',
        body: '续费VIP',
        product_type: '4',
        channel: 'wx_pub_qr'
      },
      costList: [{
        total: '0.00',
        day: '0.00',
        time: '三年',
        brand: '特惠',
        price: 0
      }, {
        total: '0.00',
        day: '0.00',
        time: '两年',
        brand: '推荐',
        price: 0
      }, {
        total: '0.00',
        day: '0.00',
        time: '一年',
        brand: '推荐',
        price: 0
      }],
      selectedCostIdx: 0, // 当前选中的套餐
      QRCode: '', // 二维码地址
      QRCodeCache: [],
      paymentType: 'wx_pub_qr', // 支付方式
      paymentStatus: false, // 是否已支付
      backCountdown: 3, // 返回倒计时
      // confirm: false,
    }
  },
  methods: {
    setPaymentInfo(payInfo, refresh) {
      const { code_url, out_trade_no } = payInfo
      this.QRCode = code_url
      this.orderNo = out_trade_no

      if (refresh) {
        clearTimeout(this.timeout)
        this.overtime = false
        this.timeout = setTimeout(() => { // 二维码过期时间20分钟
          this.overtime = true
          this.QRCodeCache = [] // 清空二维码缓存
        }, 20 * 60 * 1000)
        this.checkPaymentStatus()
      }
    },
    fetchQRCode() {
      const { costList, selectedCostIdx, QRCodeCache } = this
      const cost = costList[selectedCostIdx]
      const payInfo = this.payInfo
      payInfo.product_id = cost.id
      payInfo.price = cost.total
      payInfo.channel = this.paymentType

      if (QRCodeCache[selectedCostIdx] && !this.overtime) { // 有缓存 && 二维码没失效
        this.setPaymentInfo(QRCodeCache[selectedCostIdx])
      } else {
        this.loading = true
        // clearTimeout(this.timeout) // 重置二维码过期时间
        this.$ajax.post('/jdcp/payInfo', payInfo, (res) => {
          const payInfo = res.data.payInfo
          this.QRCodeCache[this.selectedCostIdx] = payInfo
          this.setPaymentInfo(payInfo, true)
          this.$nextTick(() => {
            this.loading = false
          })
          // const { code_url, out_trade_no } = res.data.payInfo
          // this.QRCode = code_url
          // this.orderNo = out_trade_no
          // this.overtime = false
          // this.timeout = setTimeout(() => {
          //   this.overtime = true
          // }, 20 * 60 * 1000) // 二维码过期时间20分钟
          // clearTimeout(this.checkPaymentTimeout)
          // this.checkPaymentStatus()
        })
      }
    },
    checkPaymentStatus() {
      if (this.orderNo) {
        this.checkPaymentStatusXHR && this.checkPaymentStatusXHR.abort()
        this.checkPaymentStatusXHR = this.$ajax.post('/jdcp/checkPaymentStatus', {
          jdcpIP: window.ConfigNew.jdcpIP,
          order_no: this.orderNo
        }, (res) => {
          // console.log(res.data.payment_status)
          const payment_status = res.data.payment_status
          if (payment_status) {
            this.$ajax.get('/students/info', {}, (res) => { // 获取最新的VIP状态
              const vipInfo = res.data.vip
              this.paymentStatus = true
              this.backInterval = setInterval(() => {
                if (this.backCountdown === 1) {
                  clearInterval(this.backInterval)
                  this.$store.commit('setVipInfo', vipInfo)
                  this.handleClose()
                  // const from = this.$route.query.from
                  // if (from) {
                  //   this.$router.push({
                  //     name: from,
                  //     params: {
                  //       vip: true
                  //     }
                  //   })
                  // } else {
                  //   this.$router.push({
                  //     name: 'stuIndex',
                  //   })
                  // }
                } else {
                  this.backCountdown -= 1
                }
              }, 1000)
            })
          } else {
            if (!this.overtime) { // 1秒检查1次支付状态，不过现在接口平均要2.5秒返回，也就是3.5秒左右检查一次支付状态
              clearTimeout(this.checkPaymentTimeout)
              this.checkPaymentTimeout = setTimeout(this.checkPaymentStatus, 1000)
            }
          }
        })
      }
    },
    handleSelectCost(idx) {
      this.selectedCostIdx = idx
      this.fetchQRCode()
    },
    handleSelectPaymentType(paymentType) {
      this.paymentType = paymentType
      this.fetchQRCode()
    },
    handleToggleConfirm() {
      this.confirm = !this.confirm
    },
    handleClose() {
      // clearTimeout(this.timeout)
      // this.overtime = true
      this.$store.commit('toggleChargeModel')
    }
  },
  created() {
    // console.info(sessionStorage)
    this.vip = this.$store.state.isVIP
    this.$ajax.post('/jdcp/getProductList', {
      productType: '4',
      countryId: sessionStorage.getItem('countryId'),
    }, (res) => {
      const productList = []

      res.data.forEach(product => {
        const { productName } = product
        if (productName === '3年') {
          productList[0] = product
        } else if (productName === '2年') {
          productList[1] = product
        } else {
          productList[2] = product
        }
      })

      this.costList = this.costList.map((cost, idx) => {
        const product = productList[idx]
        cost.id = product.productId
        cost.total = product.productPrice
        cost.day = product.aliasName
        cost.price = Number(product.productPrice)
        return cost
      })

      this.fetchQRCode()
    })
  },
  beforeDestroy() {
    // console.log('close charge')
    clearTimeout(this.timeout)
    this.overtime = true
    this.checkPaymentStatusXHR && this.checkPaymentStatusXHR.abort()
  }
}
</script>

<style lang="less">
@font-face {
  font-family: condensed;
  src: url("/static/fonts/HELVETICANEUE_BLACKCOND.ttf");
}

.kami-charge {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);

  .qrcode {
    position: relative;
    width: 110px;
    height: 110px;
    margin-right: 18px;
    border: 1px solid #f4f4f4;

    & > img {
      width: 108px;
      height: 108px;
    }
  }

  .qrcode-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    background-repeat: no-repeat;
    background-position: center;

    &.overtime {
      background-image: url("/static/images/ui/charge/btn_refurbish.png");
      cursor: pointer;
    }

    &.loading {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        animation: rotate 3s linear infinite;
      }
    }
  }

  .icon-confirm {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    background-image: url("/static/images/icon_common.png");
    cursor: pointer;
    &.active {
      background-position-x: -16px;
    }
  }
}
.kami-charge-dialog {
  width: 800px;
  height: 540px;
  border-radius: 6px;
  background-color: #f4f4f4;
  overflow: hidden;
}
.kami-charge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding-left: 26px;
  padding-right: 18px;
  background-image: url("/static/images/ui/charge/ic_tankuang_bg.png"),
    linear-gradient(to right, #fe812f, #ffb800);
}
.kami-charge-person-info {
  position: relative;
  display: flex;
  align-items: center;
  &.vip::after {
    content: "";
    position: absolute;
    bottom: 0px;
    left: 26px;
    display: block;
    width: 14px;
    height: 14px;
    background-image: url("/static/images/stu/index/ic_v.png");
    background-size: cover;
  }
}
.kami-charge-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}
.kami-charge-name {
  line-height: 20px;
}
.kami-charge-level {
  line-height: 16px;
  color: rgba(255, 255, 255, 0.8);
}
.kami-charge-header-side {
  width: 104px;
  text-align: right;
}
.kami-charge-close {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.kami-charge-top {
  display: flex;
  flex-direction: column;
  // height: 170px;
  padding: 26px 26px 0;
}
.kami-charge-cost-list {
  display: flex;
  justify-content: space-between;
  // align-items: center;
}
.kami-charge-cost {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 236px;
  height: 120px;
  padding: 26px 0 22px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  &.active {
    border: 2px solid #fe8828;
    background-color: #fffbef;

    .kami-charge-cost-brand {
      top: -2px;
      left: -2px;
    }
  }
}
.kami-charge-day-cost {
  width: 100px;
  height: 24px;
  border-radius: 12px;
  font-size: 16px;
  text-align: center;
  line-height: 24px;
  background-color: #fe8828;
}
.kami-charge-cost-brand {
  position: absolute;
  top: -1px;
  left: -1px;
  width: 60px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  background-image: linear-gradient(to right, #f8b60d, #ffce16);
}
.kami-charge-cost-message {
  flex: 1;
  line-height: 52px;

  &::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 4px;
    border-radius: 3px;
    vertical-align: middle;
    background-color: #999;
  }
}

.kami-charge-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 748px;
  padding: 20px 0 16px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  background-color: #fff;
}
.kami-charge-scan {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  background-image: url("/static/images/stu/ic_saoma.png");
}
.kami-charge-payment-type {
  width: 100px;
  height: 30px;
}
.kami-charge-payment-zhifubao {
  background-image: url("/static/images/stu/btn_alipay_normal.png");
  &.active {
    background-image: url("/static/images/stu/btn_alipay_active.png");
  }
}
.kami-charge-payment-weixin {
  // background-image: url("/static/images/stu/btn_wechat_normal.png");
  background-image: url("/static/images/ui/charge/ic_wechat.png");
  &.active {
    background-image: url("/static/images/stu/btn_wechat_active.png");
  }
}

.kami-charge-success {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 748px;
  height: 424px;
  padding: 92px 0 56px;
  margin: 26px auto;
  border: 1px solid #e0e0e0;
  background-color: #fff;

  img {
    display: block;
    margin: 0 auto 22px;
  }

  .grey9 {
    text-align: center;
    line-height: 36px;

    span {
      color: #fe8828;
      font-size: 20px;
      font-weight: bold;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotateZ(0);
  }

  to {
    transform: rotateZ(360deg);
  }
}
</style>
