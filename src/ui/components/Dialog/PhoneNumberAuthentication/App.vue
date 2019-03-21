<template lang="pug">
  div#PhoneDialog
    img(v-if='dialogConfig.needCancleIcon' src='../image/icon_popup_close.png' alt='' @click='close()')
    div.verificationCode
      p 手机号认证
      div.yanzheng.first
        span 手机号:
        input(placeholder='请输入手机号' v-model='phone' ref='phone')
      div.yanzheng.second
        span 验证码:
        input(placeholder='请输入验证码' v-model='verifyNum')
        span.code(ref='code' @click='getCode') 获取验证码
      div.errInfo.red(style='visibility: errMsg !== "成功" ? "visible" : "hidden"') {{errMsg}}
      div.operation
        button.btn(:class='dialogConfig.cancleBtnStyle' @click='close()') {{dialogConfig.cancleBtnText}}
        button.btn(:class='dialogConfig.confirmBtnStyle' @click='confirm()') {{dialogConfig.confirmBtnText}}
</template>

<script>
export default {
  name: 'PhoneDialog',
  props: ['closeDialog', 'dialogConfig', 'errMsg'],
  data() {
    return {
      wait60: false,
      // errInfo: '',
      phone: '',
      verifyNum: ''
    }
  },
  methods: {
    close() {
      // this.closeDialog(false)
      this.dialogConfig.cancleBtnCallBack()
    },
    confirm() {
      // this.closeDialog(false)
      this.dialogConfig.confirmBtnCallBack(this.phone, this.verifyNum)
    },
    getCode() {
      if (this.wait60) return false

      this.wait60 = true
      let cd = 60
      let obj = this.$refs.code
      obj.innerHTML = '已发送' + cd

      let timeId = setInterval(() => {
        if (cd === 0) {
          clearInterval(timeId)
          obj.innerHTML = '重新获取'
          this.wait60 = false
        } else {
          cd--
          obj.innerHTML = '已发送' + cd
        }
      }, 1000)

      this.$ajax.post('/FrontendStudents/sendMessageOfPassword', {
        phone: this.phone
      }, (res) => {
        if (res.status !== 1) {
          clearInterval(timeId)
          this.$refs.code.innerHTML = '重新获取'
          this.wait60 = false
          this.errMsg = res.info
        }
      }, '', true)
    }
  },
  watch: {
    errMsg(val, oldVal) {
      console.info(val)
      console.info(oldVal)
    }
  },
  mounted() {
    this.phone = this.$util.getCookieValue('userName')
  }
}
</script>

<style lang='less' scoped>
  @image-base-url: "../image";

  #PhoneDialog {
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
    
    & > img {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
    }

    & > .verificationCode {
      margin: 40px 0 30px 0;
    }
    & > .verificationCode p {
      padding-bottom: 30px;
      font-size: 20px;
      color: #333;
    }

    div.yanzheng {
      width: 100%;
      line-height: 30px;
      padding: 0 70px;
      position: relative;

      span {
        float: left;
        display: block;
        width: 70px;
        text-align: left;
        margin-top: 5px;
        font-size: 14px;
        color: #666;
      }

      .code {
        position: absolute;
        top: 0;
        right: 50px;
        font-size: 14px;
        color: #21bd73;
        cursor: pointer;
      }

      input {
        margin-left: 75px;
      }
    }
    .second {
      margin-top: 20px;

      input {
        width: 120px;
      }
    }
    .errInfo {
      margin-top: 10px;
      line-height: 18px;
      height: 18px;
      margin-left: 145px;
      text-align: left;
    }
    .operation {
      margin-top: 12px;

      & > button:first-child {
        margin-right: 15px;
      }

      & > button:last-child {
        margin-left: 15px;
      }
    }
  }
</style>