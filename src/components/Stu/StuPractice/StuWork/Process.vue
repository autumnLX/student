<template lang="pug">
  #Process
    div.guide(v-if="currentProcess === 'guide'")
        img(src='../../../../../static/images/practice/guide.png' alt='')
        button.work-btn(@click='noviceGuide()') 知道了
    div.processCountDown(v-else-if="currentProcess === 'countdown'")
      div.processContent
        dl
          dt 
            span.f18.green {{topicName}}
        div.book
          img(src='../../../../../static/images/practice/book.gif' alt='')
        dl.precent
          dd
            span.f18.grey6 任务&nbsp; 
            span.f18.green {{doneNum}}
            span.f18.grey6 /{{todoNum}}
        button.work-btn(@click='startWork()') 开始
    div.loading(v-else-if="currentProcess === 'loading'")
      div
        p.title.f24.green.fb 勤学苦练方成大器，为你的坚持点赞！
        div.progressBox
          div.progressBarBG
            div.progressBar(:style='{width: progressPer + "%"}')
              img.progressIcon(src='/static/images/practice/ic_loading.png')
          span.progressText.f16.grey9 {{ progressPer }}%
        p.contentDetail.f16.grey9 今天的作业包含{{ topicTypcCount }}个任务
    div.loadFail(v-else-if="currentProcess === 'loadfail'")
      div
        p.title.f24.green.fb 哎呀，网络不稳定，未加载成功
        img(src='/static/images/practice/ic_loading_fail.png')
        button.btn.btn-green(@click='handleRetryPreload') 重新加载
</template>

<script>
export default {
  name: 'StuWorkProcess',
  props: ['process', 'currentIndex', 'topicList', 'getProcess', 'getTopic'],
  data() {
    return {
      currentProcess: this.process,
      topicName: '',
      todoNum: 0,
      doneNum: 0,
      progressPer: 0,
      loadingCount: 0,
      loadingTotal: 0,
      topicTypcCount: 0,
    }
  },
  methods: {
    noviceGuide() { // 新手引导
      this.setTipNon()
    },
    startWork() {
      this.currentProcess = ''
      this.getProcess('start')
    },
    setTipNon() {
      this.$ajax.post('/checkAlerts/setReciteKeyBoardFlag', {}, (res) => {
        if (res.status === 1) {
          this.currentProcess = 'countdown'
        }
      })
    },
    checkAlert() {
      this.$ajax.post('/checkAlerts/getReciteKeyBoardFlag', {}, (res) => {
        if (res.status === 1) {
          if (Number(res.data.is_remember) === 0) { // 需要引导
            this.currentProcess = 'guide'
          } else if (Number(res.data.is_remember) === 1) { // 不需要引导
            this.currentProcess = 'countdown'
          }
        }
      })
    },
    handleRetryPreload() {
      this.getProcess('start')
      this.getTopic()
    },
    handleTopicName () {
      let practiceType = this.topicList[this.currentIndex].practiceType
      let contentType = this.topicList[this.currentIndex].contentType
      if (practiceType === 'tx') { // 听写
        if (Number(contentType) === 5) {
          this.topicName = '单词纠音'
        } else {
          this.topicName = '单词听写'
        }
      } else if (practiceType === 'bs') { // 背诵
        this.topicName = '段落背诵'
      } else {
        if (practiceType === 'gd') {
          switch (Number(contentType)) {
            case 1:
              this.topicName = '单词跟读'
              break
            case 2:
              this.topicName = '句子跟读'
              break
            case 3:
              this.topicName = '段落跟读'
              break
            case 4:
              this.topicName = '对话跟读'
              break
          }
        } else if (practiceType === 'ld') {
          switch (Number(contentType)) {
            case 1:
              this.topicName = '单词朗读'
              break
            case 2:
              this.topicName = '句子朗读'
              break
            case 3:
              this.topicName = '段落朗读'
              break
            case 4:
              this.topicName = '对话朗读'
              break
          }
        }
      }
    },
    handelData() {
      this.handleTopicName()
      this.todoNum = this.topicList[0].taskNum
      this.doneNum = this.topicList[0].taskNum - this.topicList.length + (this.currentIndex + 1)
      this.loadingTotal = this.topicList.length
      this.topicTypcCount = this.topicList.length
      if (this.currentIndex === 0) { // task初始加载进度
        this.total()
      } else {
        this.currentProcess = 'countdown'
      }
    },
    total() {
      setTimeout(() => {
        if (this.loadingCount < this.topicList.length) {
          this.loadingCount++
          this.progressPer = this.loadingTotal ? Math.round(this.loadingCount / this.loadingTotal * 100) : 0
          this.total()
        } else {
          this.checkAlert()
        }
      }, 1000);
    }
  },
  watch: {
    process: function (val) {
      if (val === 'loading' || val === 'countdown' || val === 'guide') {
        this.currentProcess = val
        this.handelData()
      }
    }
  },
  mounted() {
    if (this.process === 'loading') {
      this.currentProcess = 'loading'
      this.handelData()
    }
  }
}
</script>

<style lang='less' scoped>
#Process {
  position: relative;
}
.guide {
  height: 570px;
  background: #fff;
  padding-top: 80px; 
  & > img {
    display: block;
    width: 484px;
    height: 306px;
    margin: 0 auto;
  }
  & > button {
    position: absolute;
    left: 50%;
    display: block;
    margin: 20px 0 0 -55px;
    z-index: 9;
  }
}
.processCountDown {
  position: relative;
  height: 570px;
  background: #fff;
  & > .processContent {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 636px;
    height: 400px;
    margin-top: -200px;
    margin-left: -318px;
    & > dl {
      text-align: center;
      & > dt {
        & > span {
          font-weight: bold;
          position: relative;
          &::after,&::before {
            content: '';
            position: absolute;
            top: 50%;
            margin-top: -1px;
            width: 20px;
            height: 2px;
            background: #21bd73;
          }
          &::after {
            left: -24px;
          }
          &::before {
            right: -24px;
          }
        }
      }
    }
    & > div.book {
      margin: 35px auto 0;
      border-radius: 20px;
      height: 180px;
      box-sizing: border-box;
      & > img {
        display: block;
        width: 300px;
        height: 180px;
        margin: 0 auto;
        border-radius: 20px;
      }
    }
    & > .precent {
      margin-top: 20px;
      & > dd {
        height: 20px;
      }
    }
    & > button {
      width: 140px;
      position: absolute;
      left: 50%;
      bottom: 0px;
      margin-left: -70px;
      z-index: 9;
    }
  }
}
.loading {
  height: 580px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: #fff;

  & > div {
    width: 636px;
    height: 326px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .title {
      line-height: 30px;
      margin: 18px auto 74px;
    }

    .progressBox {
      margin-top: 80px;
      display: flex;
      justify-content: center;
      align-items: center;

      & > .progressBarBG {
        width: 500px;
        height: 20px;
        border-radius: 10px;
        background-color: rgba(232, 248, 241, 0.9);
        margin-right: 18px;
        float: left;

        .progressBar {
          height: 20px;
          border-radius: 10px;
          position: relative;
          background: url(/static/images/practice/ic_loadingline.png)
            repeat-x top right;

          .progressIcon {
            width: 70px;
            height: 70px;
            position: absolute;
            top: -80px;
            right: 0;
          }
        }
      }

      .progressText {
        line-height: 20px;
        display: inline-block;
      }
    }
    .contentDetail,
    button {
      margin-top: 42px;
    }
  }
}
.loadFail {
  height: 580px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: #fff;
  & > div {
    width: 636px;
    height: 326px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .title {
      line-height: 30px;
      margin: 18px auto 74px;
    }
    button {
      margin-top: 42px;
    }
  }
}
@media screen and (min-height: 801px) {
  .processCountDown {
    height: 570px;
  }
  .guide {
    height: 570px;
    padding-top: 80px;
  }
}
@media screen and (max-height: 800px) {
  .processCountDown {
    height: 470px;
    & > .processContent {
      height: 400px;
      margin-top: -200px;
    }
  }
  .guide {
    height: 470px;
    padding-top: 55px;
  }
}
</style>