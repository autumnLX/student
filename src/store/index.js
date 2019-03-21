import Vue from 'vue'
import Vuex from 'vuex'
import student from './modules/student'
import Api from '@/assets/Api.js'
import Util from '@/util/Util'
import exam from './modules/exam'

const Config = window.ConfigNew
const errDCfg = {
  getCurrentPage: 'common',
  needCancleIcon: true,
  showConfirmleBtn: false,
  cancleBtnStyle: 'btn-white',
  showBigTileFlag: false,
  titleIcon: 'warning',
  assistTitleStyle: 'big'
}
const ssoCfg = {
  getCurrentPage: 'sso',
}
const newTaskCfg = {
  getCurrentPage: 'newTask',
}

const storeIndex = {
  state: {
    hasMic: 1, // 设备检测，是否有麦克风
    isSidebarDetectionPass: 1,
    isShowPromoteD: false, // 晋级 升年级弹窗状态
    ssoTime: Config.ssoTime,
    ssoTimeout: '',
    newTaskTime: Config.newTaskTime,
    newTaskTimeout: '',
    isShowErrD: false, // ajax报错
    dCfg: {},
    isShowSsoD: false,
    ssoCfg: Object.assign({}, ssoCfg), // 单点登陆
    isShowNewTaskD: false,
    newTaskCfg: Object.assign({}, newTaskCfg), // 新作也新测评
    isShowCharge: false, // 是否显示VIP付费窗口
    isVIP: false, // 是否是VIP
    vipTime: '',
  },
  actions: {
    sso(context) {
      Api.sso((res, status) => {
        if (status === 4301) { // 提示被提出
          clearTimeout(context.state.ssoTimeout)
          context.state.ssoCfg = Object.assign({}, ssoCfg, {
            showAssistTitleText: res.loginDateTime,
            cancleBtnCallBack: function() {
              context.state.isShowSsoD = false
              location.href = '/login'
            },
            confirmBtnCallBack: function(writeLog) {
              let identity = 'student'
              let username = Util.getCookieValue('username')
              let password = Util.getCookieValue('password')

              if (!identity || !username || !password) {
                location.href = '/login'
              } else {
                Api.login({
                  identity: identity,
                  username: username,
                  password: password,
                }, (res) => {
                  context.state.isShowSsoD = false
                  context.state.ssoTime = Config.ssoTime
                  context.dispatch('ssoLoop')

                  writeLog({
                    action: '/' + identity + '/login'
                  })

                  if (context.state.overtime) {
                    context.commit('setOvertime', 0)
                  } else {
                    sessionStorage.setItem('login', '1')
                    sessionStorage.setItem('id', res.id)
                    sessionStorage.setItem('identity', identity)
                    sessionStorage.setItem('username', username)
                    context.commit('setUser', res)
                    Util.loginCookie({
                      identity: identity,
                      username: username,
                      password: password,
                    }, res, true)
                  }
                }, {
                  failCallback: (status, info, btnText) => {
                    context.state.isShowSsoD = false
                    context.commit('showErrDialog', {
                      errText: info,
                      btnText: btnText,
                      cancleBtnCallBack: function() {
                        context.state.isShowErrD = false
                        location.href = '/login'
                      }
                    })
                  }
                })
              }
            }
          })
          context.state.isShowSsoD = true
        } else { // 正常
          context.state.ssoTime = Config.ssoTime
          context.dispatch('ssoLoop')
        }
      })
    },
    ssoLoop(context) {
      // if (context.state.ssoTime === 0) {
      //   clearTimeout(context.state.ssoTimeout)
      //   context.dispatch('sso')
      // } else {
      //   context.state.ssoTimeout = setTimeout(function() {
      //     context.dispatch('ssoLoop')
      //   }, 1000);
      //   context.state.ssoTime--
      // }
    },
    newTask(context) {
      Api.checkNewTask({
        t: new Date().getTime()
      }, (res) => {
        clearTimeout(context.state.newTaskTimeout)
        if (res.type) {
          if (res.type === 'competition') {
            context.state.newTaskCfg = Object.assign({}, newTaskCfg, {
              type: res.type,
              title: '测评',
              textGreen: res.info.competitionName || '',
              text1: res.info.endDateTimeTip || '',
              text2: res.info.submitTimes || '',
              cancleBtnCallBack: function() {
                context.state.isShowNewTaskD = false
              },
              confirmBtnCallBack: function() {
                const stu = student.state
                const query = 'competitionId=' + res.info.competitionId +
                  '&groupId=' + res.info.groupId +
                  '&stageId=' + res.info.stageId +
                  '&modelId=' + res.info.modeId +
                  '&user=' + stu.phone +
                  '&name=' + encodeURIComponent(stu.name) +
                  '&gender=' + stu.gender +
                  '&stuSchool=' + encodeURIComponent(stu.school)

                if ([1, 4].indexOf(parseInt(res.info.competitionType)) > -1 && parseInt(res.info.answerProcess) === 1) {
                  window.location.href = `/web/models/ExamFormal/index.php?${query}`
                } else {
                  window.location.href = `/practice/exam?${query}`
                }
              }
            })
          } else {
            context.state.newTaskCfg = Object.assign({}, newTaskCfg, {
              type: res.type,
              title: '作业',
              textGreen: res.info.worksetName || '',
              text1: res.info.practiceName || '',
              text2: res.info.endDateTimeTip || '',
              cancleBtnCallBack: function() {
                context.state.isShowNewTaskD = false
              },
              confirmBtnCallBack: function() {
                const query = `isTask=1&worksetId=${res.info.worksetId}&layerType=${res.info.layerType}&layerId=${res.info.layerId}&categoryId=${res.info.categoryId}&teacherId=${res.info.teacherId}`
                window.location.href = `/practice/work?${query}`
              }
            })
          }
          context.state.isShowNewTaskD = true
        }
      })
    },
    newTaskLoop(context) {
      if (context.state.newTaskTime === 0) {
        clearTimeout(context.state.newTaskTimeout)
        context.dispatch('newTask')
      } else {
        context.state.newTaskTimeout = setTimeout(function() {
          context.dispatch('newTaskLoop')
        }, 1000);
        context.state.newTaskTime--
      }
    }
  },
  mutations: {
    initAiPanel(state, callback) {
      if (!state.$AiPanel) {
        const AiPanel = new window.chivox.AiPanel(Object.assign({}, Config.sdk, {
          onRecorderError: (errorType) => {
            state.hasMic = errorType !== 'no audio device!' ? 1 : 0
          }
        }))
        state.$AiPanel = AiPanel
        state.$player = AiPanel.player
        state.$recorder = AiPanel.recorder

        console.info('初始化成功')
        typeof callback === 'function' && callback()
      }
    },
    avatar(state, url) {
      state.avatar = (url.match(/https?:\/\//) ? '' : Config.resUrl) + url
    },
    showErrDialog(state, param) {
      state.dCfg = Object.assign({}, errDCfg, {
        showAssistTitleText: param.errText,
        cancleBtnText: param.btnText,
        cancleBtnCallBack: param.cancleBtnCallBack || function() {
          state.isShowErrD = false
        }
      })
      state.isShowErrD = true
    },
    setOvertime(state, code) {
      state.overtime = code
    },
    setUser(state, user) {
      state.user = user
    },
    setPromoteD(state, status) {
      state.isShowPromoteD = status
    },
    toggleChargeModel(state) {
      state.isShowCharge = !state.isShowCharge
    },
    setVipInfo(state, vipInfo) {
      state.isVIP = !vipInfo.isExpired
      state.vipTime = vipInfo.expiredDate
    }
  },
  modules: {
    student,
    exam
  }
}

Vue.use(Vuex)
export default new Vuex.Store(storeIndex)
