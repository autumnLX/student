<template lang="pug">
  div.changePassword
    div.emptyStatus(v-if='!certified')
      p.msg 手机还未认证哦~
      p.msrz(@click='goAuthenticate') 马上认证
    div.changeWord(v-else)
      div.changeWordMain
        div.oldPassword
          label 请输入原密码：
          input(type='text' v-model='oldPassword' :class='{err: errInput.password}')
          div.errTip(v-text='errText.passwordText' v-if='errText.passwordText.length > 0')
        div.resetPassword
          label 请设置新密码：
          input(type='text' v-model='newPassword' :class='{err: errInput.newPassword}')
          div.errTip(v-text='errText.newPasswordText' v-if='errText.newPasswordText.length > 0')
        div.onceMoreNewPassword
          label 请再次输入新密码：
          input(type='text' v-model='newPassword2' :class='{err: errInput.newPasswordOnceMore}')
          div.errTip(v-text='errText.newPasswordOnceMoreText' v-if='errText.newPasswordOnceMoreText.length > 0')
      div.operate
        div.left
        div.btn.btn-green(@click='commit') 提交
    Dialog(:dialogConfig='defaultCfg' :isShowDialog='isShowDialog' :errorMsg='errorMsg')
    Dialog(:dialogConfig='ConfigNoButton' :isShowDialog='showNoButton')
    Dialog(:dialogConfig='ConfigWithButton' :isShowDialog='showWithButton')
</template>
<script>
const param = {}
export default {
  name: 'changePassword',
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
      showNoButton: false,
      errorMsg: '',
      showWithButton: false,
      errInput: {
        password: false,
        newPassword: false,
        newPassword2: false
      },
      errText: {
        passwordText: '',
        newPasswordText: '',
        newPasswordOnceMoreText: ''
      },
      defaultCfg: {
        getCurrentPage: 'phoneDialog',
        needCancleIcon: true,
        showCancleBtn: true,
        showConfirmleBtn: true,
        confirmBtnText: '认证',
        cancleBtnText: '取消',
        confirmBtnStyle: 'btn-green',
        cancleBtnStyle: 'btn-white',
        cancleBtnCallBack: () => {
          this.isShowDialog = false
        },
        confirmBtnCallBack: (phone, verifyNum) => {
          this.$ajax.post('/FrontendStudents/phoneCertified', { phone: phone, verifyNum: verifyNum }, (res) => {
            if (res.status === 1) {
              this.isShowDialog = false
              if (this.stuInfoData.phone === phone) {
                this.stuInfoData.phone_certified = true
                this.showNoButton = true
                // this.$refs.rz.innerText = '已认证'
                window.setTimeout(() => {
                  this.showNoButton = false
                  window.location.href = '/login'
                }, 3000)
              } else {
                this.showWithButton = true
              }
            } else {
              this.errorMsg = res.info
            }
          }, '', true)
        }
      },
      ConfigNoButton: {
        getCurrentPage: 'common',
        needCancleIcon: true,
        titleIcon: 'success',
        showBigTileText: '认证成功',
        showAssistTitleText: '',
        showCancleBtn: false,
        showConfirmleBtn: false,
        confirmBtnText: '',
        cancleBtnText: '',
        confirmBtnStyle: '',
        cancleBtnStyle: ''
      },
      ConfigWithButton: {
        getCurrentPage: 'common',
        needCancleIcon: true,
        titleIcon: 'success',
        showBigTileText: '认证成功',
        showAssistTitleText: '请使用认证的手机号重新登录',
        confirmBtnText: '重新登录',
        cancleBtnText: '',
        confirmBtnStyle: 'btn-green',
        cancleBtnStyle: '',
        showCancleBtn: false,
        showConfirmleBtn: true,
        confirmBtnCallBack: () => {
          window.location.href = '/login'
        }
      },
      isShowDialog: false,
      stuInfoData: {}
    }
  },
  computed: {
    certified() {
      return this.$store.state.student.certified
    }
  },
  methods: {
    goAuthenticate() {
      this.errorMsg = ''
      this.isShowDialog = true
    },
    commit() {
      this.clear()
      this.collect()
      if (this.check()) {
        this.$ajax.post('/FrontendStudents/modifyPassword', param, (res) => {
          if (res.status === 1) {
            alert('密码修改成功，请重新登录')
            window.location.href = '/login'
          } else {
            this.$store.commit('showErrDialog', {
              errText: res.info,
              btnText: this.$t('dialog.iknow')
            })
          }
        })
      }
    },
    check() {
      if (!this.oldPassword) {
        this.errText.passwordText = '请填写原始密码'
        this.errInput.password = true
        return false
      } else if (!this.newPassword) {
        this.errText.newPasswordText = '请填写新密码'
        this.errInput.newPassword = true
        return false
      } else if (!this.newPassword2) {
        this.errText.newPasswordOnceMoreText = '请再次输入密码'
        this.errInput.newPasswordOnceMore = true
        return false
      } else {
        return true
      }
    },
    collect() {
      param.oldPassword = this.oldPassword
      param.newPassword = this.newPassword
      param.newPassword2 = this.newPassword2
    },
    clear() {
      this.errText.passwordText = ''
      this.errInput.password = false
      this.errText.newPasswordText = ''
      this.errInput.newPassword = false
      this.errText.newPasswordOnceMoreText = ''
      this.errInput.newPasswordOnceMore = false
    },
    getStuInfo(param) {
      param = param || {}
      this.$jsonp('/WebCompetition/stuInfo', param, (err, res) => {
        if (res.status === 1) {
          this.stuInfoData = res.data
        } else {
          console.log(err)
        }
      })
    }
  },
  mounted() {
    this.getStuInfo()
  }
}
</script>
<style lang="less">
.changePassword {
  padding-top: 50px;
  display: flex;
  justify-content: center;
  height: 600px;
  .emptyStatus {
    width: 300px;
    height: 300px;
    background: url("/static/images/pic_empty-04.png") no-repeat;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    .msg {
      top: 230px;
      position: absolute;
      font-size: 16px;
      color: #ccc;
      margin-bottom: 10px;
    }
    .msrz {
      font-size: 16px;
      color: #21bd73;
      position: absolute;
      top: 258px;
      cursor: pointer;
    }
  }
  .changeWord {
    width: 100%;
    .changeWordMain {
      padding-left: 180px;
      div {
        display: flex;
        align-items: center;
        margin-bottom: 35px;
        label {
          width: 160px;
          height: 30px;
          text-align: right;
          margin-right: 20px;
          font-size: 14px;
          color: #666;
          line-height: 30px;
        }
        input {
          width: 250px;
          height: 30px;
          border: 1px solid #ddd;
          &.err {
            border-color: #f06060;
          }
        }
        .errTip {
          color: #f06060;
          font-size: 14px;
          margin-bottom: 0;
          margin-left: 10px;
        }
      }
    }
    .operate {
      display: flex;
      .left {
        width: 360px;
      }
    }
  }
}
</style>