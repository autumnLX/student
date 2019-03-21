<template lang="pug">
  div.left(ref="leftDom" :style='{padding: singleTopicType ? "30px 0" : 0}')
    div.top(v-if='!singleTopicType && competitionType === "1"')
      i
      span.text1 倒计时
      span.text2 {{ time }}
    vue-scroll.middle(:ops='scrollCfg')
      div.block(v-for='(block, idx) in list')
        div.title
          span {{ transformNum(idx) + block.topicTypeName}}
          i(@mouseenter='mEnter(block.topicTypeRemark, idx)' @mouseleave='mLeave')
        div.list
          div.number(
            v-for='(topic, idx2) in _data[idx].topicList' 
            :class='numberClass(block, idx, topic, idx2)' 
            @click='handleSelectQuestion(idx, topic.qIdx, topic.oIdx, $event)'
          ) {{ topic.tIdx }}
    div.bottom(v-if='!singleTopicType')
      div
        div
          div.square
          span.f12.grey9 未做
        div
          div.square.done
          span.f12.grey9 已做
      button(:class='{finish: isLastQuestion}' @click='handleSubmit(false)') 交卷
    div.tips2.tip1(v-if='showTips2tip1')
      p 上次练习到这啦~
      button(@click='handleDoRestart') 重新开始
    div.tips2.tip2(v-if='showTips2tip2')
      p 交卷后，系统保留最新成绩
      div(@click='handleNeverHint')
        i(:class='{selected: tip2Selected}')
        span 不再提示
</template>

<script>
export default {
  name: 'StuExamLeft',
  props: ['countdown', 'transformNum', 'singleTopicType', 'hasProgress', 'list', 'handleRestart',
    'topicNeedSplit', 'topicNeedCombine', 'currentPartIndx', 'currentQuestionIdx', 'currentOptionIdx',
    'isLastQuestion', 'onSelectQuestion', 'onSubmit', 'onSetData', 'PRStatusCheck', 'canRepeat',
    'competitionType', 'initTotalIdx', 'handleTips'],
  data () {
    return {
      time: '00:00:00',
      scrollCfg: {
        scrollPanel: {
          scrollingX: false
        }
      },
      showTip: '',
      tipTop: 0,
      tipLeft: 0,
      _data: [],
      showTips2tip1: false,
      showTips2tip2: false,
      tip2Selected: false
    }
  },
  methods: {
    transformTime (v) { // 将数字转成 00:00:00 格式
      if (v) {
        let h = Math.floor(v / 3600)
        let s = this.cd - h * 3600
        h = h < 10 ? '0' + h : h
        let m = Math.floor(s / 60)
        s -= m * 60
        m = m < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s
        return `${h}:${m}:${s}`
      } else {
        return '00:00:00'
      }
    },
    numberClass (block, idx, topic, idx2) {
      let tmp = {}
      if (['54', '73'].indexOf(block.topicTypeId) > -1) {
        tmp.done = block.topicList[topic.qIdx].done && block.topicList[topic.qIdx].done[topic.oIdx][topic.olIdx]
      } else {
        tmp.done = block.topicList[topic.qIdx].done && block.topicList[topic.qIdx].done[topic.oIdx]
      }

      if (this.topicNeedCombine.indexOf(block.topicTypeId) >= 0) {
        if (['54', '73'].indexOf(block.topicTypeId) > -1) {
          tmp.current = this.currentPartIndx === idx && this.currentQuestionIdx === topic.qIdx && this.currentOptionIdx === topic.oIdx
        } else {
          tmp.current = this.currentPartIndx === idx && this.currentQuestionIdx === topic.qIdx
        }
      } else {
        tmp.current = this.currentPartIndx === idx && this.currentQuestionIdx === topic.qIdx && this.currentOptionIdx === topic.oIdx
      }

      tmp.cursorDefault = !this.canRepeat

      return tmp
    },
    handleNeverHint () { // 不再出现保存试卷会覆盖分数的提示
      this.tip2Selected = !this.tip2Selected
    },
    handleSubmit (timeout) {
      if (this.$store.state.PRStatus === 'waiting') {
        return false
      } else if (this.$store.state.PRStatus === 'playing') {
        this.PRStatusCheck('', () => {
          this.$store.state.PRStatus = 'idle'
          this.onSubmit(timeout, this.interval)
        })
      } else if (this.$store.state.PRStatus === 'recording') {
        // this.$store.state.PRStatus = 'idle'
        this.PRStatusCheck('stop')
      } else if (this.$store.state.PRStatus === 'scoring') {
        this.PRStatusCheck('tip')
      } else {
        this.onSubmit(timeout, this.interval)
      }
    },
    handleDoRestart () { // 重新开始
      this.handleRestart()
      this.showTips2tip1 = false
    },
    mEnter (text, idx) {
      let ele = event.target.getBoundingClientRect()
      let tNum = document.querySelectorAll('.block > .list')[idx].childNodes.length
      this.showTip = text.replace(/{{num}}/g, tNum)
      this.handleTips(this.showTip, ele)
    },
    mLeave () {
      this.showTip = ''
      this.handleTips()
    },
    getCurrentIndex () {
      let tmpIdx = 0
      for (let i = 0; i < this._data[this.currentPartIndx].topicList.length; i++) {
        let topicList = this._data[this.currentPartIndx].topicList[i]
        if (topicList.pIdx === this.currentPartIndx && topicList.qIdx === this.currentQuestionIdx) {
          tmpIdx = topicList.tIdx
          break
        }
      }

      if (this.topicNeedCombine.indexOf(this.list[this.currentPartIndx].topicTypeId) >= 0) {
        if (['54', '73'].indexOf(this.list[this.currentPartIndx].topicTypeId) > -1) {
          for (let i = 0; i < this.currentOptionIdx; i++) {
            tmpIdx += this.list[this.currentPartIndx].topicList[this.currentQuestionIdx].topicOption[i].optionList.length
          }
        }
        return tmpIdx
      } else {
        return tmpIdx + this.currentOptionIdx
      }
    },
    handleSelectQuestion (idx, qIdx, oIdx, $e) {
      if (!$e.target.className.match(/(^|\s)current(\s|$)/g)) {
        if (this.canRepeat) {
          if (this.$store.state.PRStatus === 'waiting') {
            return false
          } else if (this.$store.state.PRStatus === 'playing') {
            this.PRStatusCheck('', () => {
              this.$store.state.PRStatus = 'idle'
              this.onSelectQuestion(idx, qIdx, oIdx, true)
            })
          } else if (this.$store.state.PRStatus === 'recording') {
            // this.$store.state.PRStatus = 'idle'
            this.PRStatusCheck('stop')
          } else if (this.$store.state.PRStatus === 'scoring') {
            this.PRStatusCheck('tip')
          } else {
            this.onSelectQuestion(idx, qIdx, oIdx, true)
          }
        }
      }
    },
    handleStartCountDown () {
      this.interval = setInterval(() => {
        if (this.cd === 0) {
          this.handleSubmit(true)
        } else {
          this.cd -= 1
          this.time = this.transformTime(this.cd)
          this.onSetData('remainTime', this.cd)
        }
      }, 1000)
      this.onSetData('countdownInterval', this.interval)
    },
  },
  watch: {
    countdown: function (v) {
      this.cd = v
      this.time = this.transformTime(this.cd)
    },
    hasProgress: function () {
      if (this.hasProgress) this.showTips2tip1 = false
    },
    showTips2tip2: function () {
      if (!this.showTips2tip2 && this.tip2Selected) {
        this.$api.setUserBehavior({
          client: 'WEB',
          behaviorType: 9
        })
      }
    },
  },
  beforeMount () {
    this.list.forEach((topicList, i) => {
      let tIdx = 1
      this._data[i] = Object.assign({}, topicList)
      if (this.topicNeedSplit.indexOf(topicList.topicTypeId) >= 0) {
        let tmp = []
        if (['54', '71', '73'].indexOf(topicList.topicTypeId) > -1) {
          this._data[i].topicList.forEach((topic, j) => {
            topic.topicOption.forEach((option, k) => {
              option.optionList.forEach((olist, l) => {
                tmp.push(Object.assign({}, topic, {
                  pIdx: i,
                  qIdx: j,
                  oIdx: k,
                  olIdx: l,
                  tIdx: tIdx,
                }))
                tIdx++
              })
            })
          })
        } else {
          this._data[i].topicList.forEach((topic, j) => {
            topic.topicOption.forEach((option, k) => {
              tmp.push(Object.assign({}, topic, {
                pIdx: i,
                qIdx: j,
                oIdx: k,
                tIdx: tIdx,
              }))
              tIdx++
            })
          })
        }
        this._data[i].topicList = [].concat(tmp)
      } else {
        this._data[i].topicList.forEach((topic, j) => {
          topic = Object.assign(topic, {
            pIdx: i,
            qIdx: j,
            oIdx: 0,
            tIdx: tIdx
          })
          tIdx++
        })
      }
    })
  },
  mounted () {
    this.initTotalIdx(this.getCurrentIndex())
    if (!this.singleTopicType) {
      if (this.hasProgress) this.showTips2tip1 = false
      this.$api.checkUserBehavior({
        client: 'WEB',
        behaviorType: 9
      }, (res) => {
        if (parseInt(res.status) === 1) this.showTips2tip2 = true
      })

      this.cd = this.countdown
      this.time = this.transformTime(this.cd)

      this.handleStartCountDown()

      setTimeout(() => {
        this.showTips2tip1 = false
        this.showTips2tip2 = false
      }, 5000)
    } else {
      this.showTips2tip1 = false
      this.showTips2tip2 = false
    }
  }
}
</script>

<style lang="less">
#stu-practice-exam .left {
  display: flex;
  flex-direction: column;
  position: relative;

  .top {
    display: flex;
    height: 60px;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;

    i {
      width: 20px;
      height: 20px;
      background-image: url("/static/images/practice/exam/icon_timeaccount.png");
    }

    .text1 {
      margin: 0 15px 0 10px;
      color: #666;
    }

    .text2 {
      color: #21bd73;
      font-size: 16px;
    }
  }

  .middle {
    flex: 1;

    .vuescroll-content {
      padding: 15px 30px;

      .block {
        margin-top: 25px;
        &:first-child {
          margin-top: 0;
        }

        .title {
          display: flex;
          align-items: center;

          span {
            max-width: 160px;
            color: #999;
            font-size: 14px;
          }

          i {
            position: relative;
            width: 20px;
            height: 20px;
            margin-left: 10px;
            background-image: url("/static/images/practice/exam/icon_tips20x20.png");
            cursor: pointer;
          }
        }

        .list {
          display: flex;
          flex-wrap: wrap;
          margin-left: -16px;

          .number {
            width: 25px;
            height: 25px;
            margin-top: 10px;
            margin-left: 16px;
            border: 1px solid #ccc;
            border-radius: 2px;
            color: #ccc;
            font-size: 12px;
            text-align: center;
            line-height: 23px;
            background-color: #fff;
            cursor: pointer;

            &.done {
              color: #24cc7c;
              border-color: #24cc7c;
            }

            &.current {
              color: #fff;
              border-color: #24cc7c;
              background-color: #24cc7c;
              cursor: default;
            }

            &.cursorDefault {
              cursor: default;
            }
          }
        }
      }
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 120px;
    padding: 20px 0 30px;
    background-color: #f8f8f8;
    border-bottom-left-radius: 20px;

    & > div {
      display: flex;
      justify-content: center;

      & > div {
        display: flex;
        align-items: center;
        margin: 0 10px;

        .square {
          width: 15px;
          height: 15px;
          margin-right: 8px;
          border-radius: 2px;
          border: 1px solid #ccc;

          &.done {
            border-color: #24cc7c;
          }
        }
      }
    }

    button {
      width: 110px;
      height: 34px;
      border: 0;
      border-radius: 17px;
      line-height: 34px;
      color: #fff;
      font-size: 16px;
      text-align: center;
      line-height: 34px;
      background-color: #24cc7c;
      cursor: pointer;

      &.finish {
        background-color: #ff6666;
      }
    }
  }

  .tips2 {
    position: absolute;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 200px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #fff;

    &.tip1 {
      top: 50px;
      left: 200px;
      padding: 25px 0;

      p {
        margin-bottom: 20px;
        color: #666;
      }

      button {
        width: 100px;
        height: 34px;
        border: 0;
        border-radius: 17px;
        color: #fff;
        text-align: center;
        line-height: 34px;
        background-color: #ff9900;
        cursor: pointer;
      }
    }

    &.tip2 {
      left: 200px;
      bottom: 10px;
      padding: 20px 0 16px;

      p {
        margin-bottom: 12px;
        color: #666;
        font-size: 12px;
      }

      div {
        display: flex;
        align-items: center;
        cursor: pointer;

        i {
          display: block;
          width: 16px;
          height: 16px;
          background-image: url("/static/images/icon_common.png");

          &.selected {
            background-position-x: -16px;
          }
        }

        span {
          margin-left: 5px;
          color: #999;
          font-size: 12px;
        }
      }
    }

    &:after {
      content: "";
      position: absolute;
      top: 50%;
      left: -8px;
      display: block;
      box-sizing: content-box;
      width: 14px;
      height: 14px;
      border-top: 1px solid #ddd;
      border-left: 1px solid #ddd;
      background-color: #fff;
      transform: translateY(-50%) rotateZ(-45deg);
    }
  }
}
</style>

