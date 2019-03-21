<template lang="pug">
  div.detection
    //- 1. 准备检测
    div.dt-step.dt-step1(v-if='step === 1 && !err')
      div.dt-title.f24 {{$t('detection.step1.title')}}
      div.dt-picBox
        //- img(src='/static/images/stu/detection/3_100.png')
        //- img(src='/static/images/stu/detection/4_100.png')
        img(src='/static/images/stu/detection/1_person.png')
      div.dt-text-box
        p.dt-text.f16 {{$t('detection.step1.text1')}}
        p.dt-text.f16 {{$t('detection.step1.text2')}}
      //- button.btn.btn-l.btn-green(@click='startCheck') {{$t('detection.step1.btn')}}
      p.dt-info {{ step1Info }}
    //- 2. 耳机检测
    div.dt-step.dt-step2(v-if='step === 2 && !err')
      div.dt-icon-l(:class='isPlaying ? "dt-playingIcon" : "dt-playIcon"')
      p.dt-text.f18.grey6 {{$t('detection.step2.text')}}
      label.skip(v-if='!needSkip' @click='doGoBack') {{$t('detection.step2.skip')}}
    //- 3. check 耳机
    div.dt-step.dt-step3(v-if='step === 3 && !err')
      div.dt-icon-l(:class='isPlaying ? "dt-playingIcon" : "dt-playIcon"')
      p.dt-text.f18.grey6 {{$t('detection.step3.text')}}
      div.dt-btnBox
        button.btn.btn-l.btn-white(@click='playCheck(false)') {{$t('detection.step3.btnL')}}
        button.btn.btn-l.btn-green(@click='playCheck(true)') {{$t('detection.step3.btnR')}}
    //- 4. 麦克风检测
    div.dt-step.dt-step4(v-if='step === 4 && !err')
      div.dt-icon-l.dt-recordIcon(v-if='!isRecording')
      div.dt-icon-l.dt-recordingIcon(v-else)
      p.dt-text.f18.grey6
        | {{$t('detection.step4.text')}}
        span.green.f18 {{$t('detection.step4.content')}}
      label.skip(v-if='!needSkip' @click='doGoBack') {{$t('detection.step2.skip')}}
    //- 5. 通过检测
    div.dt-step.dt-step5(v-if='step === 5 && !err')
      div.dt-icon.dt-successIcon
      div.dt-title.f24 {{$t('detection.step5.title')}}
      button.btn.btn-l.btn-green(@click='doGoBack' v-if='needSkip') {{$t('detection.step5.btn')}}
      p.f18.grey9.dt-info(v-else) {{ step5Info }}
    //- error 浏览器错误
    div.dt-step.dt-browserErr(v-if='err === "browserErr"')
      div.dt-icon.dt-red.dt-warnIcon
      div.dt-title2.f24 {{$t('detection.browserErr.title')}}
      div.dt-text-box2
        p.dt-text.f16 {{$t('detection.browserErr.text1')}}
        p.dt-text.f16 {{$t('detection.browserErr.text2')}}
      div.dt-btnBox
        a.btn.btn-l.btn-green {{$t('detection.browserErr.btnL')}}
        a.btn.btn-l.btn-green {{$t('detection.browserErr.btnR')}}
    //- error 没有检测到麦克风
    div.dt-step.dt-micErr(v-if='err === "micErr"')
      div.dt-title.f24 {{$t('detection.micErr.title')}}
      img(src='/static/images/stu/detection/7.png')
      div.dt-text-box
        p.dt-text.f16.grey6 {{$t('detection.micErr.text1')}}
        p.dt-text.f16.grey6
          | {{$t('detection.micErr.text2')}}
          span.red.f16 {{$t('detection.micErr.redText')}}
    //- error 没有检测到耳机
    div.dt-step.dt-playErr(v-if='err === "playErr"')
      div
        p.f24.red {{$t('detection.playErr.title1')}}
        p.f16.grey6 {{$t('detection.playErr.text1')}}
      div
        p.f24.red {{$t('detection.playErr.title2')}}
        p.f16.grey6 {{$t('detection.playErr.text2')}}
      button.btn.btn-l.btn-red(@click='retry') {{$t('detection.playErr.btn')}}
    //- error 麦克风检测失败
    div.dt-step.dt-recordErr(v-if='err === "recordErr"')
      div.dt-icon.dt-red.dt-warnIcon
      div.dt-title2.f24 {{$t('detection.recordErr.title')}}
      div.dt-text-box2
        p.dt-text.f16.red {{$t('detection.recordErr.text1')}}
        p.dt-text.f16.grey6 {{$t('detection.recordErr.text2')}}
        p.dt-text.f16.grey6 {{$t('detection.recordErr.text3')}}
      button.btn.btn-l.btn-red(@click='retry') {{$t('detection.recordErr.btn')}}
    //- error 音量过小
    div.dt-step.dt-volumeErr(v-if='err === "volumeErr"')
      div.dt-title.f24 {{$t('detection.volumeErr.title')}}
      div.dt-text-box2
        p.dt-text.f16.red {{$t('detection.volumeErr.text1')}}
        p.dt-text.f16 {{$t('detection.volumeErr.text2')}}
        p.dt-text.f16 {{$t('detection.volumeErr.text3')}}
      button.btn.btn-l.btn-red(@click='retry') {{$t('detection.volumeErr.btn')}}
    //- error 网络异常
    div.dt-step.dt-netErr(v-if='err === "netErr"')
      div.dt-title.f24 {{$t('detection.netErr.title')}}
      div.dt-text-box2
        p.dt-text.f16.red {{$t('detection.netErr.text1')}}
        p.dt-text.f16 {{$t('detection.netErr.text2')}}
        p.dt-text.f16 {{$t('detection.netErr.text3')}}
      button.btn.btn-l.btn-red(@click='retry') {{$t('detection.netErr.btn')}}
</template>

<script>
export default {
  name: 'detectionMain',
  props: ['goBack', 'needSkip'], // needSkip：false 练习中检测 | true 独立检测
  data() {
    return {
      step1Info: '即将开始',
      step5Info: '3秒后自动进入练习',
      player: '',
      recorder: '',
      step: 1,
      err: '',
      lastRecordId: '',
      isPlaying: false,
      isRecording: false,
      vol: 0,
      volMax: 0,
      volInternal: '',
    }
  },
  methods: {
    nextStep() {
      this.step++
    },
    retry() {
      this.err = ''
      if (this.step === 3) this.step = 2
      if (this.step === -4) this.step = 4
    },
    doGoBack() {
      this.player.stop()
      typeof this.goBack === 'function' && this.goBack()
    },
    startCheck() {
      this.err = this.browserCheck() || this.micCheck()
      if (!this.err) this.nextStep()
    },
    browserCheck() {
      return this.$util.isBrowserOK() === '1' ? '' : 'browserErr'
    },
    micCheck() {
      if (this.err === 'micErr') {
        return 'micErr'
      }
    },
    playCheck(isOK) {
      this.player.stop()
      if (isOK) {
        this.nextStep()
      } else {
        this.err = 'playErr'
      }
    },
  },
  computed: {
    volumeBar: function () {
      return (this.vol * 50 + 70) + 'px'
    }
  },
  watch: {
    step(val, oldVal) {
      if (val === 1) {

      } else if (val === 2) {
        this.player.load({
          url: this.$config.resUrl + 'guide/guide_1.mp3',
          success: () => {
            this.player.play({
              onStart: () => {
                this.isPlaying = true
              },
              onStop: () => {
                this.isPlaying = false
                this.nextStep()
              }
            })
          },
          error: () => {
            console.log('加载音频失败，请检查音频地址是否正确，网络连接是否正常。')
            this.$store.commit('showErrDialog', {
              errText: this.$t('detection.audioMis')
            })
          }
        })
      } else if (val === 3) {
        this.player.load({
          url: this.$config.resUrl + 'guide/guide_2.mp3',
          success: () => {
            this.player.play({
              onStart: () => {
                this.isPlaying = true
              },
              onStop: () => {
                this.isPlaying = false
              }
            })
          },
          error: () => {
            console.log('加载音频失败，请检查音频地址是否正确，网络连接是否正常。')
            this.$store.commit('showErrDialog', {
              errText: this.$t('detection.audioMis')
            })
          }
        })
      } else if (val === 4) {
        this.player.load({
          url: this.$config.resUrl + 'guide/guide_3.mp3',
          success: () => {
            this.player.play({
              onStop: () => {
                this.recorder.record({
                  duration: 4000,
                  serverParams: {
                    coreType: 'en.sent.child',
                    refText: 'one two three',
                    rank: 100,
                    userId: this.$store.state.student.name
                  },
                  onRecordIdGenerated: (code, message) => {
                    this.lastRecordId = message.recordId
                  },
                  onStart: () => {
                    this.isRecording = true
                  },
                  onStop: () => {
                    this.isRecording = false
                    clearInterval(this.volInterval)
                    setTimeout(() => {
                      let scored = false
                      let timeout = false
                      this.recorder.getScores({
                        recordId: this.lastRecordId,
                        success: (data) => {
                          if (!timeout) {
                            scored = true
                            let _data = data[this.lastRecordId]

                            setTimeout(() => {
                              if (_data.errId || _data.result.errID || _data.result.overall < 5) { // 内核报错或评分过低
                                this.err = 'recordErr'
                                this.step = -4
                              } else { // 检测成功
                                const browserInfo = this.$util.browserCheck()
                                this.$api.writeDevice({
                                  browser: browserInfo.name + ' ' + browserInfo.version,
                                  hasMicrophone: 1,
                                  canEarpod: 1,
                                  canMicrophone: 1,
                                })
                                this.$store.state.isSidebarDetectionPass = true
                                this.nextStep()
                              }
                            }, 1000)
                          }
                        }
                      })

                      setTimeout(() => { // 评分超时
                        if (!scored) {
                          timeout = true
                          this.err = 'netErr'
                          this.step = -4
                        }
                      }, 10000)
                    }, 1000)
                  }
                })
              }
            })
          },
          error: () => {
            console.log('加载音频失败，请检查音频地址是否正确，网络连接是否正常。')
            this.$store.commit('showErrDialog', {
              errText: this.$t('detection.audioMis')
            })
          }
        })
      } else if (val === 5) {
        this.$util.setCookie('isDetectionShowed', 1)
        if (!this.needSkip) {
          let stepIntervalCount = 3
          const stepInterval = setInterval(() => {
            if (stepIntervalCount === 1) {
              clearInterval(stepInterval)
              this.doGoBack()
            } else {
              stepIntervalCount -= 1
              this.step5Info = stepIntervalCount + '秒后自动进入练习'
            }
          }, 1000)
        }
      }
    }
  },
  mounted() {
    this.player = this.$store.state.$player
    this.recorder = this.$store.state.$recorder

    let stepIntervalCount = 0
    const stepInterval = setInterval(() => {
      if (stepIntervalCount === 3) {
        clearInterval(stepInterval)
        this.startCheck()
      } else {
        stepIntervalCount += 1
        this.step1Info += '.'
      }
    }, 1000)
  }
}
</script>

<style lang='less' scoped>
.detection {
  flex: 1;

  .dt-step {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .skip {
      position: absolute;
      right: 20px;
      bottom: 20px;
      z-index: 10;
      color: #999;
      cursor: pointer;
    }

    .dt-text-box {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      height: 90px;
    }

    .dt-text-box2 {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 80px;
    }

    .dt-text {
      line-height: 28px;
    }

    button.btn {
      min-width: 120px;
    }

    .dt-icon-l {
      width: 150px;
      height: 150px;
      margin-top: 90px;
      margin-bottom: 50px;

      &.dt-playIcon {
        background-image: url(/static/images/stu/detection/6_150.png);
      }

      &.dt-playingIcon {
        background-image: url(/static/images/stu/detection/playing.gif);
      }

      &.dt-recordIcon {
        background-image: url(/static/images/stu/detection/5_150.png);
      }

      &.dt-recordingIcon {
        background-image: url(/static/images/stu/detection/recording.gif);
      }
    }

    .dt-icon {
      width: 100px;
      height: 100px;
      margin-top: 90px;
      margin-bottom: 35px;

      &.dt-red {
        margin-top: 70px;
      }

      &.dt-successIcon {
        background-image: url(/static/images/stu/detection/2_100.png);
      }

      &.dt-warnIcon {
        background-image: url(/static/images/stu/detection/1_100.png);
      }
    }

    .dt-title {
      margin: 65px 0 20px;
      color: #333;
      font-size: 24px;
      line-height: 26px;
    }

    .dt-title2 {
      margin-bottom: 20px;
      color: #333;
      line-height: 26px;
    }

    &.dt-step1 {
      .dt-picBox {
        margin-bottom: 20px;

        img {
          display: block;
          margin: 0 auto;
        }
      }

      .dt-info {
        margin-top: 30px;
        color: #21bd73;
        font-size: 18px;
        line-height: 26px;
      }
    }

    &.dt-step3 {
      p {
        margin-bottom: 45px;
      }

      button {
        margin: 0 30px;
      }
    }

    &.dt-step5 {
      .dt-title {
        margin-top: 0;
        margin-bottom: 40px;
      }
    }

    &.dt-browserErr {
      .dt-btnBox {
        margin-top: 30px;

        a {
          width: 200px;
          margin: 0 15px;
        }
      }
    }

    &.dt-micErr {
      img {
        margin-bottom: 20px;
      }
    }

    &.dt-playErr {
      padding-top: 85px;

      & > div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 74px;
        margin: 20px 0;
      }

      .btn {
        margin-top: 50px;
      }
    }

    &.dt-recordErr,
    &.dt-volumeErr,
    &.dt-netErr {
      button {
        margin-top: 30px;
      }
    }
  }
}
</style>
