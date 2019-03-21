<template lang="pug">
  div.bjBox.section
    div.title.f16.grey6.text-ct {{$t('Stu.StuIndex.bjsy.title')}}
    div.tip {{$t('Stu.StuIndex.bjsy.showtipMsg')}}
    div.emptyBox(v-if="!showFlag")
      div.empty
      p.emptyMsg {{$t('Stu.StuIndex.bjsy.emptyMsg1')}}
      p.emptyMsg {{$t('Stu.StuIndex.bjsy.emptyMsg2')}}
    div.pulltemp(v-if='showFlag')
      div.contentBox
        div(v-for="(item, index) in stuList")
          div.gif
          audio(:src='handlePlayUrl(item.recordAudioUrl)' v-show="showFlag" ref="media" @ended='pauseAudio')
          div.wrapperBox
            div.toux(@click="toggleStatus(index)" :class='{active: currentIndex === index, vip: item.vip.isVip && !item.vip.isExpired}')
          img.bgbox(:src="item.headPic")
          p {{item.stuName}}
      div.change(@click="toggle" v-if="showChange") {{$t('Stu.StuIndex.bjsy.change')}}
</template>

<script>
/**
 * 班级声音
 */
export default {
  name: 'bjsy',
  data() {
    return {
      showFlag: false,
      stuList: [],
      leftArr: [],
      dataList: [],
      showChange: false,
      listEnd: false,
      currentIndex: -1
    }
  },
  methods: {
    handlePlayUrl(url) {
      return url.replace(/(^(https?:\/\/)?)([^:/]*)((:[0-9]*)?)(\/[^.]*)(.mp3)?$/, 'https://$3$6.mp3')
    },
    toggle() {
      for (let i = 0; i < this.$refs.media.length; i++) {
        this.$refs.media[i].pause()
      }
      this.currentIndex = -1

      if (this.leftArr.length > 3) {
        this.stuList = this.leftArr.splice(0, 3)
      } else {
        if (this.listEnd) {
          this.stuList = this.dataList.slice(0, 3)
          this.leftArr = this.dataList.slice(3)
          this.listEnd = false
        } else {
          this.stuList = this.leftArr
          this.listEnd = true
        }
      }
    },
    toggleStatus(index) {
      this.currentIndex = index
      if (event.target.classList.contains('active')) {
        event.target.classList.remove('active')
        this.$refs.media[index].pause()
      } else {
        event.target.classList.add('active')
        for (let i = 0; i < this.$refs.media.length; i++) {
          this.$refs.media[i].pause()
        }
        this.$refs.media[index].play()
      }
    },
    getData() {
      this.$ajax.get('/practices/getLastWeekRank', {}, (res) => {
        if (res.status === 1) {
          if (res.data.length > 0) {
            this.showFlag = true
          }
          if (res.data.length > 3) {
            this.showChange = true
            this.dataList = res.data.concat([])
            this.stuList = res.data.splice(0, 3)
            this.leftArr = res.data
          } else {
            this.stuList = res.data
          }
        }
      })
    },
    pauseAudio(event) {
      this.currentIndex = -1
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
<style lang="less">
@img-url: "../../../assets/image/stu/index";
.bjBox {
  padding-top: 10px;
  text-align: center;
  width: 260px;
  position: relative;
  padding-bottom: 20px;
  .emptyBox {
    height: 210px;
    .empty {
      width: 180px;
      height: 135px;
      background: url("@{img-url}/pic_bjhsy.png") no-repeat center center;
      margin: 0 auto;
      margin-bottom: 15px;
    }
  }

  .pulltemp {
    padding-left: 35px;
    padding-right: 35px;
    width: 100%;
    .contentBox {
      width: 100%;
      margin-bottom: 25px;	
      & > div {
        width: 50px;
        height: 70px;
        margin-right: 20px;
        display: inline-block;
        position: relative;
        .wrapperBox {
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;

          .toux {
            position: absolute;
            width: 50px;
            height: 50px;
            background: url("@{img-url}/icon_goodvocie.png") no-repeat;
            cursor: pointer;

            &.active {
              background: url("@{img-url}/icon_goodvocie.png");
              background-position-x: 50px;
              z-index: 2;
            }

            &.vip::after {
              content: "";
              position: absolute;
              right: 0;
              bottom: 0;
              z-index: 10;
              display: block;
              width: 14px;
              height: 14px;
              background-image: url("/static/images/stu/index/ic_v.png");
              background-size: cover;
            }
          }
          &:hover {
            .toux {
              z-index: 2;
            }
          }
        }
        & > .gif {
          width: 14px;
          height: 14px;
          background: url("@{img-url}/voice.gif") no-repeat;
          position: absolute;
          top: -9px;
          left: 40px;
        }
        & > .bgbox {
          width: 50px;
          height: 50px;
          border-radius: 25px;
          position: absolute;
          margin-bottom: 5px;
          z-index: 1;
          background-size: 50px 50px;
          left: 0;
          top: 5px;
          left: 5px;
        }
        & > p {
          color: #999;
          font-size: 12px;
          position: absolute;
          white-space: nowrap;
          overflow: hidden;
          width: 70px;
          top: 54px;
          left: -10px;
          text-align: center;
          margin-top: 5px;
        }
      }
      & > div:last-child {
        margin-right: 0;
      }
    }
    .change {
      box-sizing: content-box;
      width: 70px;
      height: 24px;
      font-size: 14px;
      color: #ccc;
      line-height: 24px;
      border-radius: 17px;
      border: #ededed 1px solid;
      margin: 0 auto;
      cursor: pointer;
      &:hover {
        color: #21bd73;
      }
    }
  }
  .title {
    line-height: 50px;
    height: 50px;
    cursor: pointer;
    margin-bottom: 10px;
    &:hover + .tip {
      visibility: visible;
    }
  }
  .emptyMsg {
    font-size: 14px;
    color: #ccc;
    line-height: 24px;
  }
  .tip {
    top: -30px;
    left: 65px;
    visibility: hidden;
    &:hover {
      visibility: visible;
    }
  }
}
</style>