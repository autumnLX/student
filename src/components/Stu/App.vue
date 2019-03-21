<template lang="pug">
  div#app(:class='{"hide-scroll-y": $store.state.isShowCharge}')
    Header(ref='header')
    div#main.W
      div#nav.section(:class='{smallNav: wHeight < 670, navFix: navFix}')
        div.uinfo
          div(style="position: relative;height: 80px;")
            img(:src='$store.state.student.avatar' width='80' height='80')
            div.vip(v-if='$store.state.isVIP')
          p.f16.text-ct {{ $store.state.student.name }}
          p.f12.greyc.text-ct {{ $store.state.student.grade + $store.state.student.clazz }}
        hr
        ul
          li.index
            router-link.f16.grey9(:to='{path: "/stu/home"}' data-name='stuMain')
              i.fl
              | {{$t('Stu.nav.index')}}
          li.sync(v-if='$store.state.isVIP || !model')
            router-link.f16.grey9(:to='{name: "stuSync", params: {vip: $store.state.isVIP}}' data-name='stuSync')
              i.fl
              | {{$t('Stu.nav.sync')}}
          li.record(v-if='$store.state.isVIP || !model')
            router-link.f16.grey9(:to='{name: "stuRecord", params: {vip: $store.state.isVIP}}' data-name='stuRecord')
              i.fl
              | {{$t('Stu.nav.record')}}
          li.bible(v-if='$store.state.isVIP || !model')
            router-link.f16.grey9(:to='{name: "stuBible", params: {vip: $store.state.isVIP}}' data-name='stuBible')
              i.fl
              | {{$t('Stu.nav.bible')}}
          li.msgCenter
            router-link.f16.grey9(:to='{name: "stuMsgCenter"}' data-name='stuMsgCenter')
              i.fl
              | {{$t('Stu.nav.msg')}}
              label.bg-red(v-show='hasNewMsg')
          li.ownInfo
            router-link.f16.grey9(:to='{name: "stuOwnInfo"}' data-name='stuOwnInfo')
              i.fl
              | {{$t('Stu.nav.info')}}
        a.logout.text-ct.f16.grey9.hover-green(@click='handleLogout')
          hr
          i
          | {{$t('Stu.nav.logout')}}
      div.containerBox
        transition(mode='out-in' enter-active-class='fadeIn' leave-active-class='fadeOut')
          router-view(:checkNewNotices='checkNewNotices')
    Footer(ref='footer')
    //- 右侧浮动栏
    Sidebar(ref='sidebar')
    //- VIP付费提示
    Charge(:name='$store.state.student.name' :avatar='$store.state.avatar' v-if='$store.state.isShowCharge')
    //- 单点登录被踢
    Dialog(:dialogConfig='$store.state.ssoCfg' :isShowDialog='$store.state.isShowSsoD')
    //- 有新的作业/测评
    Dialog(:dialogConfig='$store.state.newTaskCfg' :isShowDialog='$store.state.isShowNewTaskD')
    //- 全局级别的错误
    Dialog(:dialogConfig='$store.state.dCfg' :isShowDialog='$store.state.isShowErrD')
</template>

<script>
import Header from '@/components/Stu/header'
import Footer from '@/components/Stu/footer'

export default {
  name: 'stu',
  components: Object.assign({}, { Header, Footer }),
  data() {
    return {
      model: 1, // 2B
      wHeight: window.innerHeight,
      navFix: false,
      hasNewMsg: false,
      readDeviceInfo: {},
    }
  },
  methods: {
    checkNewNotices() { // 未读消息数量
      this.$api.unreadNotice({}, (res) => {
        this.hasNewMsg = res.number !== 0
      })
    },
    handleLogout() {
      clearTimeout(this.$store.state.ssoTimeout)
      clearTimeout(this.$store.state.newTaskTimeout)
      this.$api.logout(() => {
        // this.$router.push({ name: 'login' })
        window.location.href = '/login'
      })
    },
    checkChangeDevice() {
      const browserInfo = this.$util.browserCheck()
      const _browser = browserInfo.name + ' ' + browserInfo.version
      if (this.$store.state.hasMic === parseInt(this.readDeviceInfo.has_microphone) && _browser === this.readDeviceInfo.browser) {
        this.$store.state.isSidebarDetectionPass = (this.$store.state.canPlay === 1 && this.$store.state.canRecord === 1)
        this.$util.setCookie('isDetectionShowed', 1)
      } else {
        this.$store.state.isSidebarDetectionPass = false
        this.$api.writeDevice({
          browser: _browser,
          hasMicrophone: this.$store.state.hasMic ? 1 : 0,
          canEarpod: this.$store.state.canPlay,
          canMicrophone: this.$store.state.canRecord,
        })
      }
    }
  },
  watch: {
    '$route': function (val) {
      this.writeLog({
        action: val.name
      })
    },
    '$store.state.hasMic': function (val, oldVal) {
      this.checkChangeDevice()
    }
  },
  created() {
    this.$ajax.get('/students/info', {}, (res) => {
      const vipInfo = res.data.vip
      this.$store.commit('setVipInfo', vipInfo)
    })
    this.model = Number(this.$util.getCookieValue('model'))
  },
  mounted() {
    window.onresize = () => {
      this.wHeight = window.innerHeight
    }
    window.addEventListener('scroll', (e) => {
      this.navFix = window.scrollY > 90 && this.wHeight >= 620
    })

    this.writeLog({ // 埋点
      action: this.$route.name
    })
    this.checkNewNotices() // 查询未读消息数量

    // 设备检测 - 自动检测浏览器
    this.$api.readDevice((res) => {
      this.readDeviceInfo = res
      this.$store.state.canPlay = parseInt(res.can_earpod)
      this.$store.state.canRecord = parseInt(res.can_microphone)
      if (!this.$store.state.$recorder) {
        this.$store.commit('initAiPanel', () => {
          this.checkChangeDevice()
        })
      } else {
        this.checkChangeDevice()
      }
    })

    this.$store.dispatch('ssoLoop') // sso轮询
    this.$store.dispatch('newTaskLoop') // 新作业新测评轮询
  }
}
</script>

<style lang='less' scoped>
#app {
  display: flex;
  flex-direction: column;

  &.hide-scroll-y {
    height: 100vh;
    overflow-y: hidden;
  }

  #main {
    margin: 20px auto;
    position: relative;
    flex: 1;

    #nav {
      width: 220px;
      float: left;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 34px 0 20px;
      z-index: 1;

      &.navFix {
        position: fixed;
        top: 0;
      }

      hr {
        width: 120px;
        margin: 10px 0;
      }

      .uinfo {
        display: flex;
        flex-direction: column;
        align-items: center;

        .vip {
          position: absolute;
          top: 52px;
          right: 0;
          width: 28px;
          height: 28px;
          background-image: url("/static/images/stu/index/ic_v.png");
          background-size: cover;
        }

        img {
          border-radius: 40px;
          overflow: hidden;
          border: 1px solid #ddd;
        }

        p {
          line-height: 32px;
        }

        p + p {
          line-height: 24px;
        }
      }

      ul {
        width: 100%;
        height: 384px;

        li {
          margin-bottom: 10px;

          a {
            height: 54px;
            display: flex;
            align-items: center;

            &.vip {
              position: relative;

              &::after {
                content: "";
                position: absolute;
                top: 15px;
                left: 160px;
                display: block;
                width: 42px;
                height: 22px;
                background-image: url("/static/images/stu/index/ic_vip.png");
              }
            }

            i {
              width: 30px;
              height: 30px;
              margin-left: 50px;
              margin-right: 10px;
              display: block;
              float: left;
              background-image: url("../../assets/image/common/icon_menu.png");
              background-repeat: no-repeat;
            }

            label {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              margin-left: 2px;
              margin-top: 14px;
              align-self: flex-start;
            }

            &.router-link-active {
              background: #24cc7c;
              color: #fff;
            }
          }

          &.index i {
            background-position: 0 0;
          }
          &.sync i {
            background-position: -30px 0;
          }
          &.record i {
            background-position: -60px 0;
          }
          &.bible i {
            background-position: -90px 0;
          }
          &.msgCenter i {
            background-position: -120px 0;
          }
          &.ownInfo i {
            background-position: -150px 0;
          }

          &.index a.router-link-active i {
            background-position: 0 -30px;
          }
          &.sync a.router-link-active i {
            background-position: -30px -30px;
          }
          &.record a.router-link-active i {
            background-position: -60px -30px;
          }
          &.bible a.router-link-active i {
            background-position: -90px -30px;
          }
          &.msgCenter a.router-link-active i {
            background-position: -120px -30px;
          }
          &.ownInfo a.router-link-active i {
            background-position: -150px -30px;
          }
        }
      }

      .logout {
        width: 100%;
        height: 54px;
        line-height: 54px;
        margin-top: 20px;

        hr {
          margin: 0 auto;
        }
      }

      &.smallNav li {
        margin: 0;
      }
    }

    .containerBox {
      width: 100%;
      height: auto;
      padding-left: 230px;
      animation-duration: 400ms !important;
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 400ms;
    }

    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }
}
</style>
