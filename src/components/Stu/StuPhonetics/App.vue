<template lang="pug">
  div#app.phoWrap
    div.phoBox
      router-link.backToIndex.f24(:to='{name: "stuIndex"}')
        img.fl(src='@/assets/image/stu/StuPhonetics/icon-index.png')
        |{{$t('Stu.StuPhonetics.backToIndex')}}
      div.pho(v-for='(item, index) in list' :key='index' :class='"pho" + (index + 1)')
        div.singlePho(
          v-for='(itm, idx) in item'
          :key='itm.id'
          :data-score='itm.score'
          :data-pho='index + "_" + idx'
          :class='{active: activePho === index + "_" + idx}'
          @mouseenter='mEnter'
          @mouseleave='mLeave'
          @click='showPD'
        )
          label.fb(:class='handleColor(itm.score)') {{itm.content}}
    div.cover-g(v-if='isShowPD')
      div.phoDialog.bg-white
        vue-scroll
          div.pd-header.f20.fb.text-ct
            span.f24 {{currentPho.content}}
            | {{$t('Stu.StuPhonetics.pdHeader')}}
            i.pd-close(@click='hidePD')
          div.pd-content
            div.pd-title.pd-title1.green.f18 {{$t('Stu.StuPhonetics.pdTitle1')}}
            div.pd-videoBox
              div.pd-video(v-for='(video, idx) in currentPho.video' :key='video')
                video(:src='video' :ref='"video" + idx' @click='pauseVideo(idx)' @ended='pauseVideo(idx)')
                div.pd-v-cover(@click='playVideo(idx)' v-if='videoStatus[idx] !== "playing"')
                  img(src='@/assets/image/stu/StuPhonetics/pic_stsplay.png')
            div.pd-title.pd-title2.green.f18 {{$t('Stu.StuPhonetics.pdTitle2')}}
            div.pd-topicBox
              audio(:src='audioUrl' ref='audioBox' @ended='pauseAudio')
              div.pd-topic(v-for='(topic, key, index) in currentPho.words' :key='key')
                span.green {{key}}
                p(v-for='(word, idx) in topic' :key='word.word')
                  span {{word.content}}
                  span.grey9 [{{word.symbol}}]
                  label(
                    :data-audio='word.audio'
                    @click='playAudio'
                    :data-audioidx='index + "_" + idx'
                    :class='playActive === index + "_" + idx ? "icon-playing" : "icon-play"'
                  )
            p.pd-ScoreBox.grey9.text-ct(:style='{visibility: currentPho.score === "" || isNaN(currentPho.score) ? "hidden" : "visible"}')
              | {{$t('Stu.StuPhonetics.pdScoreL')}}
              span(:class='handleColor(currentPho.score)') {{currentPho.score}}
              | {{$t('Stu.StuPhonetics.pdScoreR')}}
            div.pd-btnBox
              label.f18.green(:style='{visibility: hasPrev ? "visible" : "hidden"}' @click='goToPrev') {{$t('Stu.StuPhonetics.pdPrev')}} {{prevPho.content}}
              button.f18.btn.btn-l.btn-green(style='width:140px;height:48px;border-radius:24px;' @click='goToPractice()') {{$t('Stu.StuPhonetics.pdBtn')}}
              label.f18.green(:style='{visibility: hasNext ? "visible" : "hidden"}' @click='goToNext') {{$t('Stu.StuPhonetics.pdNext')}} {{nextPho.content}}
          img(src='@/assets/image/stu/StuPhonetics/bottom.png')
    Dialog(:dialogConfig='$store.state.dCfg' :isShowDialog='$store.state.isShowErrD')
    Dialog(:dialogConfig='$store.state.ssoCfg' :isShowDialog='$store.state.isShowSsoD')
</template>

<script>
export default {
  name: 'phonetics',
  data () {
    return {
      activePho: '',
      list: [],
      index: '',
      idx: '',
      prevIndex: '',
      prevPho: {},
      nextIndex: '',
      nextPho: {},
      currentPho: {},
      worksetId: '', // 自学id
      phoneticsId: '',
      isShowPD: false,
      hasPrev: false,
      hasNext: false,
      videoStatus: [],
      playActive: '',
      audioUrl: ''
    }
  },
  methods: {
    handleColor(score) {
      if (score === '' || score === '--' || isNaN(score)) {
        return 'blue'
      } else {
        const lv = window.ConfigNew.ScoreLevel
        score = parseInt(score)
        return score < lv.bad ? 'red' : (score < lv.good ? 'orange' : 'green')
      }
    },
    mEnter(event) {
      this.activePho = event.target.dataset.pho
    },
    mLeave(event) {
      this.activePho = ''
    },
    handlePV() {
      if (this.idx === 0) {
        if (this.index === 0) {
          this.hasPrev = false
          this.prevIndex = this.index + '_' + this.idx
          this.prevPho = {}
        } else {
          this.hasPrev = true
          this.prevIndex = (this.index - 1) + '_' + (this.list[this.index - 1].length - 1)
          this.prevPho = this.list[this.index - 1][this.list[this.index - 1].length - 1]
        }
      } else {
        this.hasPrev = true
        this.prevIndex = this.index + '_' + (this.idx - 1)
        this.prevPho = this.list[this.index][this.idx - 1]
      }

      if (this.idx === this.list[this.index].length - 1) {
        if (this.index === this.list.length - 1) {
          this.hasNext = false
          this.nextIndex = this.index + '_' + this.idx
          this.nextPho = {}
        } else {
          this.hasNext = true
          this.nextIndex = (this.index + 1) + '_' + 0
          this.nextPho = this.list[this.index + 1][0]
        }
      } else {
        this.hasNext = true
        this.nextIndex = this.index + '_' + (this.idx + 1)
        this.nextPho = this.list[this.index][this.idx + 1]
      }
    },
    showPD(event) {
      let cPho = event.currentTarget.dataset.pho.split('_')
      this.index = parseInt(cPho[0])
      this.idx = parseInt(cPho[1])
      this.handlePV()
      this.currentPho = this.list[this.index][this.idx]
      this.phoneticsId = this.currentPho.id
      this.worksetId = this.currentPho.selflearn_id
      this.isShowPD = true
    },
    hidePD() {
      this.isShowPD = false
      this.videoStatus = []
    },
    playVideo(idx) {
      this.$set(this.videoStatus, idx, 'playing')
      this.$refs['video' + idx][0].play()
    },
    pauseVideo(idx) {
      this.$set(this.videoStatus, idx, 'paused')
      this.$refs['video' + idx][0].currentTime = 0
      this.$refs['video' + idx][0].pause()
    },
    playAudio(event) {
      let audioidx = event.target.dataset.audioidx
      if (audioidx === this.playActive) {
        this.playActive = ''
        this.$refs.audioBox.pause()
        this.$refs.audioBox.currentTime = 0
      } else {
        this.playActive = audioidx
        this.$refs.audioBox.pause()
        this.audioUrl = event.target.dataset.audio
        this.$nextTick(() => {
          this.$refs.audioBox.play()
        })
      }
    },
    pauseAudio() {
      this.playActive = ''
    },
    goToPrev() {
      let prev = this.prevIndex.split('_')
      let cpho = Object.assign({}, this.prevPho)
      this.index = parseInt(prev[0])
      this.idx = parseInt(prev[1])
      this.worksetId = this.list[this.index][this.idx].selflearn_id
      this.phoneticsId = cpho.id
      this.handlePV()
      this.currentPho = cpho
    },
    goToPractice() {
      window.location.href = `/practice/work?isTask=0&worksetId=${this.worksetId}&phoneticsId=${this.phoneticsId}&pathname=Phonetics`
    },
    goToNext() {
      let next = this.nextIndex.split('_')
      let cpho = Object.assign({}, this.nextPho)
      this.index = parseInt(next[0])
      this.idx = parseInt(next[1])
      this.worksetId = this.list[this.index][this.idx].selflearn_id
      this.phoneticsId = cpho.id
      this.handlePV()
      this.currentPho = cpho
    },
    getList() {
      this.$ajax.post('/SymbolStudy/getList', {}, (res) => {
        if (res.status === 1) {
          let tmpArray = []
          for (let i = 0; i < res.data.length; i++) {
            const dt = res.data[i];
            if (!tmpArray[parseInt(dt.group) - 1]) tmpArray[parseInt(dt.group) - 1] = []
            tmpArray[parseInt(dt.group) - 1].push(dt)
          }
          this.list = tmpArray
        } else if (res.status === 4301) {
        } else {
          this.$store.commit('showErrDialog', {
            errText: res.info,
            btnText: this.$t('dialog.iknow')
          })
        }
      })
    },
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang='less'>
.phoWrap {
  width: 100%;
  min-width: 1200px;
  height: 2094px;
  background: url('../../../assets/image/stu/StuPhonetics/background.png') no-repeat center top;

  .backToIndex {
    display: flex;
    height: 42px;
    line-height: 42px;
    color: #63ac39;
    position: absolute;
    top: 40px;
    right: 40px;

    img {
      margin-right: 14px;
    }
  }

  .phoBox {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    position: relative;

    div.pho {
      position: absolute;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      align-content: space-between;
      justify-content: space-between;

      .singlePho {
        width: 80px;
        height: 80px;
        display: flex;
        border-radius: 50%;
        position: relative;
        font-family: Arial;
        font-size: 30px;
        background: transparent;
        cursor: pointer;

        &:before {
          content: '';
          width: 60px;
          height: 60px;
          border-radius: 50%;
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 2;
          background: rgba(255, 255, 255, 0.5);
        }

        label {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 30px;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 15px;
          left: 15px;
          z-index: 3;
          background: rgba(255, 255, 255, 1);
          cursor: pointer;
        }

        &.active {
          background: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 5px #fff;

          &:before {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 0 5px #fff;
          }
        }
      }

      &.pho1 {
        top: 48px;
        left: 372px;
        width: 160px;
        height: 240px;
      }
      &.pho2 {
        top: 48px;
        left: 722px;
        width: 160px;
        height: 240px;

        & > div:first-child {
          margin-right: 80px;
        }
      }
      &.pho3 {
        top: 304px;
        left: 968px;
        width: 160px;
        height: 240px;

        & > div:last-child {
          margin-left: auto;
        }
      }
      &.pho4 {
        top: 561px;
        left: 722px;
        width: 240px;
        height: 240px;

        & > div:nth-child(2) {
          margin-right: 80px;
        }
      }
      &.pho5 {
        top: 561px;
        left: 372px;
        width: 160px;
        height: 240px;

        & > div:first-child {
          margin-right: 80px;
        }
      }
      &.pho6 {
        top: 858px;
        left: 24px;
        width: 260px;
        height: 240px;


        & > div:nth-child(2), & > div:nth-child(4), & > div:nth-child(6) {
          margin-left: 100px;
        }
      }
      &.pho7 {
        top: 1160px;
        left: 370px;
        width: 240px;
        height: 240px;

        & > div:last-child {
          margin-right: auto;
        }
      }
      &.pho8 {
        top: 1160px;
        left: 720px;
        width: 240px;
        height: 240px;

        & > div:last-child {
          margin-right: auto;
        }
      }
      &.pho9 {
        top: 1418px;
        left: 972px;
        width: 160px;
        height: 240px;
      }
      &.pho10 {
        top: 1835px;
        left: 724px;
        width: 240px;
        height: 80px;
      }
      &.pho11 {
        top: 1675px;
        left: 474px;
        width: 80px;
        height: 80px;
      }
      &.pho12 {
        top: 1835px;
        left: 165px;
        width: 80px;
        height: 160px;

      }
    }
  }

  .phoDialog {
    width: 1000px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-content: space-between;

    .vuescroll-content {
      display: flex;
      flex-direction: column;

      .pd-header {
        height: 70px;
        line-height: 70px;
        border-bottom: 1px solid #ededed;
        position: relative;

        .pd-close {
          width: 30px;
          height: 30px;
          display: block;
          position: absolute;
          top: 50%;
          right: 30px;
          margin-top: -15px;
          background: url('../../../assets/image/stu/StuPhonetics/view_btn_close.png') no-repeat center center;
          cursor: pointer;
        }
      }

      .pd-content {
        width: 1000px;
        padding: 0 60px;
        flex: 1;

        .pd-title {
          line-height: 26px;

          &.pd-title1 {
            height: 56px;
            line-height: 56px;
          }

          &.pd-title2 {
            margin: 40px 0 22px;
          }
        }

        .pd-videoBox {
          display: flex;
          justify-content: flex-start;
          
          .pd-video {
            width: auto;
            height: 210px;
            margin-right: 70px;
            display: flex;
            position: relative;

            video, .pd-v-cover {
              width: auto;
              height: 210px;
            }

            .pd-v-cover {
              width: 100%;
              position: absolute;
              top: 0;
              left: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }

        .pd-topicBox {
          margin: 0 auto 8px;
          display: flex;
          flex-flow: row wrap;
          align-items: flex-start;
          justify-content: space-between;

          .pd-topic {
            width: 434px;
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            padding-left: 64px;
            position: relative;

            & > span {
              line-height: 30px;
              font-size: 22px;
              position: absolute;
              top: 0;
              left: 0;
            }

            p {
              display: flex;
              align-items: center;
              line-height: 30px;
              margin-right: 35px;
              margin-bottom: 24px;

              &:last-child {
                margin-right: 0;
              }

              * {
                display: block;
                float: left;
              }

              span {
                font-size: 15px;
                line-height: 30px;
                margin-right: 8px;
              }

              label {
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                cursor: pointer;

                &.icon-playing {
                  background-image: url(/static/images/stu/phonetics/audios_playing.gif);
                }

                &.icon-play {
                  background-image: url(/static/images/stu/phonetics/audios_normal.png);
                }
              }
            }
          }
        }

        p.pd-ScoreBox {
          width: 100%;
          display: block;
          margin: 10px auto 8px;
        }

        .pd-btnBox {
          width: 630px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;

          label {
            width: 150px;
            cursor: pointer;

            &:last-child {
              text-align: right;
            }
          }
        }
      }
    }
  }
}
</style>
