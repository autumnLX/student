<template lang="pug">
div
  div.own-info-banner(v-if='!isHideVipInfo')
    div.flex-start-center
      img(:src='"/static/images/stu/ownInfo/" + (this.$store.state.isVIP ? "ic_vip" : "ic_putong") + ".png"')
      span.white(style='margin-left: 12px;') 您的身份级别：
      span.f24.white {{ $store.state.isVIP ? 'VIP会员' : '普通用户' }}
      div.f16.white.vip(@click='handleSeeVip') 点击查看VIP权益
    div
      span.white {{ vipTime }}
      button(@click='handleShowVipModal') {{ $store.state.vipTime ? '续费VIP' : '开通VIP' }}
  div.ownInfoContain
    //- 左侧头像
    div.avatorPreview
      img(:src='$store.state.student.avatar')
      span.greyc 支持jpg和png格式
      span.greyc 自己设置的头像总比默认头像好看8.6倍
      div.mainBox
        label.btn.btn-green(for='upload') 修改头像
        input#upload(type='file' name='file' style='display: none;' @change='changeImg')
    //- 基本信息
    div.basicMessage
      div.row.idNumber
        div.left 账&nbsp;&nbsp;号：
        div.right
          div.own-info-text {{ phone }}
          div(
            :class='certified ? "rzd" : "rz"'
            @click='rzDialogShow' 
            ref='rz') {{ certified ? "已认证" : "认证手机号码" }}
      div.row
        div.left 姓&nbsp;&nbsp;名：
        div.own-info-text(v-show='!editStatus') {{ stuName }}
        input.own-info-input.readonly(type='text' v-model='stuName' readonly v-show='editStatus')
        //- span.errTips.red(v-if="errText.stuNameErrMsg.length > 0" v-text="errText.stuNameErrMsg")
      div.row
        div.left 性&nbsp;&nbsp;别：
        div.own-info-text(v-show='!editStatus') {{ gender === 1 ? "男" : "女" }}
        div.radio(v-show='editStatus')
          Radio(:flag="genderTemp === 1" :property="1" @toParent="handleChangeGender")
          label(name="1" :class='{"green": genderTemp === 1}') 男
          Radio(:flag="genderTemp === 0" :property="0" @toParent="handleChangeGender")
          label(name="0" :class='{"green": genderTemp === 0}') 女
      div.row
        div.left 地&nbsp;&nbsp;区：
        div.areaSelect(v-if='editStatus' style='display: flex;')
          div.readonly.readonly-short {{ province }}
          div.readonly.readonly-short {{ city }}
          div.readonly.readonly-short {{ district }}
        div.areaInfo.f16.grey6(v-else) {{ province + city + district }}
      div.row
        div.left 学&nbsp;&nbsp;校：
        div.f16.grey6(:class='{readonly: editStatus}') {{ school }}
      div.row
        div.left 年&nbsp;&nbsp;级：
        div.f16.grey6(:class='{readonly: editStatus}') {{ grade }}
      div.row
        div.left 班&nbsp;&nbsp;级：
        div.f16.grey6(:class='{readonly: editStatus}') {{ clazz }}
      //- 保存错误反馈
      p.errMsg.red(v-if='errMsg.length > 0' v-text='errMsg')
      //- 操作区域
      div.row.operate
        div.main(v-if='editStatus')
          div.save.btn.btn-green(@click='save') 保存
          div.cancel.btn.btn-white(@click='handleToggleEditStatus') 取消
        div.edit.btn.btn-green(@click='handleToggleEditStatus' v-else) 编辑
      div.own-info-tip.greyc 如信息有误，请联系老师
  //- Modals
  //- 认证成功
  KmModal(
    v-model='showNoButton'
    no-footer
  )
    i.modal-icon.modal-icon-success(slot='header')
    p.modal-title-big(slot='header') 认证成功
  //- 认证成功 & 重新登录
  KmModal(
    v-model='showWithButton'
    no-close
  )
    i.modal-icon.modal-icon-success(slot='header')
    p.modal-title-big(slot='header') 认证成功
    p.modal-text.modal-text-grey.text_center 请使用认证的手机号重新登录
    button.modal-button-green(slot='footer' @click='goToLogin') 重新登录
  //- 手机认证
  KmModal(
    v-model='isShowDialog'
    ok-text='认证'
    @on-ok='identifyAccount'
  )
    p.modal-title-big(slot='header') 手机号认证
    form#authentication-form
      div
        label 手机号：
        div
          input(maxlength='11' placeholder='请输入手机号码' v-model='account')
      div
        label 验证码：
        div
          input(maxlength='4' placeholder='请输入验证码' v-model='identifyingCode')
          span.green(@click='getIdentifyingCode') {{ waitMsg }}
      div
        label
        span.red {{ errorMsg }}
</template>

<script>
import { mapState } from 'vuex'
import { Radio } from '@/UIO'
import { KmModal } from '@/ui/src/index'

export default {
  name: 'ownInfo',
  components: { Radio, KmModal },
  data() {
    const toggleInConf = window.ConfigNew.toggle
    return {
      stuInfoData: {},
      isHideVipInfo: toggleInConf ? toggleInConf.hideVipInStudentInfo : false,
      isShowDialog: false,
      showNoButton: false,
      showWithButton: false,
      editStatus: false,
      wait60: false,
      waitMsg: '获取验证码',
      gender: '',
      genderTemp: '',
      account: '', // 手机认证，其实就是设置个新账号
      identifyingCode: '',
      errorMsg: '', // 认证错误信息
      errMsg: '', // 保存时错误信息
      errText: {
        // 校验错误信息
        stuNameErrMsg: ''
      }
    }
  },
  computed: {
    vipTime() {
      if (this.$store.state.isVIP) {
        return '有效截止时间：' + this.$store.state.vipTime
      } else {
        if (this.$store.state.vipTime) {
          return `VIP会员已于${this.$store.state.vipTime}过期`
        } else {
          return '你还没有开通VIP会员'
        }
      }
    },
    stuName: {
      get() {
        this.gender = this.$store.state.student.gender
        return this.$store.state.student.name
      },
      set(newValue) {
        this.$store.commit('student/set', {
          key: 'name',
          value: newValue
        })
      }
    },
    ...mapState('student', [
      'phone',
      'certified',
      'province',
      'city',
      'district',
      'school',
      'grade',
      'clazz'
    ])
  },
  methods: {
    handleSeeVip() {
      this.$parent.handleChangeTab(4)
    },
    changeImg(e) {
      // 修改头像
      const file = e.target.files[0]
      this.$ajax.upload(
        '/uploads/addStuHeadPic',
        file,
        res => {
          this.$store.commit('student/set', {
            key: 'avatar',
            value: res.data.picUrl
          })
        },
        'headPic'
      )
    },
    handleToggleEditStatus() {
      this.editStatus = !this.editStatus
      if (this.editStatus) {
        this.genderTemp = this.gender
      }
    },
    save() {
      // 保存【编辑】
      const studentName = this.stuName

      if (studentName) {
        const studentGender = (this.gender = this.genderTemp)
        this.$ajax.post(
          '/postAssessment/post',
          {
            stuName: studentName,
            gender: studentGender,
            postAssessmentUrl: this.$config.jdcpIP + 'WebCompetition/saveStuInfo'
          },
          res => {
            if (res.status === 1) {
              this.editStatus = false
              this.$store.commit('student/set', {
                key: 'name',
                value: studentName
              })
              this.$store.commit('student/set', {
                key: 'gender',
                value: studentGender
              })
            } else {
              this.errMsg = res.info
            }
          }
        )
      } else {
        this.errText.stuNameErrMsg = '学生名字不能为空'
      }
    },
    handleChangeGender(prop) {
      // 设置性别
      this.genderTemp = parseInt(prop)
    },
    rzDialogShow() {
      // 显示手机认证对话框
      if (!this.$store.state.student.certified) {
        this.isShowDialog = true
        this.errorMsg = ''
      }
    },
    handleShowVipModal() {
      // 显示VIP续费对话框
      this.$store.commit('toggleChargeModel')
    },
    getIdentifyingCode() {
      // 获取手机认证验证码
      if (!this.wait60) {
        const { account } = this
        if (/1\d{10}/.test(account)) {
          let countdown = 60
          let interval = setInterval(() => {
            countdown -= 1
            this.waitMsg = countdown > 0 ? '已发送' + countdown + '秒' : '重新获取'
            if (countdown < 1) {
              clearInterval(interval)
              this.wait60 = false
            }
          }, 1000)
          this.waitMsg = '已发送' + countdown + '秒'
          this.wait60 = true
          this.errMsg = ''

          this.$ajax.post(
            '/FrontendStudents/sendMessageOfPassword',
            {
              phone: account
            },
            res => {
              if (res.status !== 1) {
                clearInterval(interval)
                this.waitMsg = '获取验证码'
                this.wait60 = false
                this.errorMsg = res.info
              }
            },
            '',
            true
          )
        } else {
          this.errorMsg = '手机号码格式不正确'
        }
      }
    },
    identifyAccount() {
      const { account, identifyingCode } = this
      if (!/1\d{10}/.test(account)) {
        this.errorMsg = '手机号码格式不正确'
      } else if (!/\d{4}/.test(identifyingCode)) {
        this.errorMsg = '验证码格式不正确'
      } else {
        this.$ajax.post(
          '/FrontendStudents/phoneCertified',
          {
            phone: account,
            verifyNum: identifyingCode
          },
          res => {
            if (res.status === 1) {
              this.isShowDialog = false
              if (this.phone === account) {
                // 如果认证的手机号和现有登录的手机号相同
                this.$store.commit('student/set', {
                  key: 'certified',
                  value: true
                })
                this.showNoButton = true
                this.$refs.rz.innerText = '已认证'
                window.setTimeout(() => {
                  this.showNoButton = false
                  this.$emit('showPassword', 2) // 显示出修改密码页面
                }, 3000)
              } else {
                // 需要用新手机号重新登录
                this.showWithButton = true
              }
            } else {
              this.errorMsg = res.info
            }
          },
          '',
          true
        )
      }
    },
    goToLogin() {
      window.location.href = '/login'
    }
  }
}
</script>

<style lang="less">
.own-info-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 888px;
  height: 72px;
  padding: 0 30px;
  margin: 15px auto 35px;
  background-image: url('/static/images/stu/ownInfo/ic_vip_bg.png');

  .vip {
    padding-right: 16px;
    margin-left: 26px;
    background: url('/static/images/stu/ownInfo/btn02.png') no-repeat right center;
    cursor: pointer;
  }

  button {
    width: 100px;
    height: 40px;
    margin-left: 20px;
    border: 0;
    border-radius: 20px;
    color: #fe9121;
    font-size: 16px;
    background-color: #fbe381;
    cursor: pointer;
  }
}

.ownInfoContain {
  display: flex;
  padding-bottom: 62px;
  margin-top: 35px;

  .avatorPreview {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    border-right: 1px dashed #eee;

    img {
      width: 150px;
      height: 150px;
      border: 1px solid #eeeff6;
    }

    .greyc {
      margin-top: 20px;
    }

    .mainBox {
      display: flex;
      align-items: center;
      margin-top: 30px;
    }
  }

  .basicMessage {
    margin-top: -15px;
    margin-left: 70px;

    .readonly {
      width: 210px;
      height: 30px;
      padding: 0 10px;
      margin-right: 10px;
      border: 1px solid #ddd;
      font-size: 14px;
      line-height: 30px;
      color: #999;
      background-color: #f2f2f2;
    }

    .readonly-short {
      width: 100px;
    }

    .own-info-text {
      width: 110px;
      color: #666;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .own-info-input {
      width: 210px;
      padding-left: 10px;
      border: 1px solid #ccc;
      border-radius: 2px;
      box-sizing: border-box;
      color: #666;
      line-height: 30px;
    }

    .row {
      display: flex;
      align-items: center;
      height: 50px;

      &:last-child {
        margin-bottom: 20px;
      }

      .errTips {
        color: #fa4b4b;
        font-size: 14px;
        display: flex;
        align-items: center;
        margin-left: 10px;
      }

      .left {
        margin-right: 3px;
        color: #999;
        font-size: 16px;
      }

      .radio label {
        margin-right: 20px;
        color: #666;
        font-size: 16px;
      }

      &.idNumber {
        .right {
          display: flex;
          align-items: center;
          .rz {
            font-size: 14px;
            color: #21bd73;
            margin-left: 20px;
            cursor: pointer;
          }
          .rzd {
            width: 60px;
            height: 20px;
            margin-left: 10px;
            border-radius: 10px;
            color: #fff;
            font-size: 12px;
            text-align: center;
            line-height: 20px;
            background-color: #ffcc00;
          }
        }
      }

      &.operate {
        .main {
          display: flex;

          .save {
            margin-right: 20px;
          }
        }
      }
    }

    p.errMsg {
      color: #fa4b4b;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .own-info-tip {
      padding-left: 24px;
      margin-top: 10px;
      background: url('/static/images/stu/ownInfo/icon_info.png') no-repeat left center;
    }
  }
}

#authentication-form {
  margin: 20px 0 10px;
  position: relative;
  width: 100%;

  & > div {
    display: flex;
    align-items: center;
    padding: 0 30px;
    position: relative;

    &:nth-child(2) {
      margin-top: 20px;
    }

    &:last-child {
      position: absolute;
      bottom: -30px;
    }

    input {
      flex: 1;
      width: 0;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #666;
      padding: 0 10px;
    }

    span.green {
      width: auto;
      margin-left: 10px;
      text-align: right;
      cursor: pointer;
    }

    & > label {
      width: 60px;
    }

    & > div {
      display: flex;
      align-items: center;
      flex: 1;
    }
  }
}
</style>
<style>
.text_center {
  text-align: center;
}
</style>
