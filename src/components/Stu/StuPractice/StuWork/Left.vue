<template lang="pug">
  div.panel-left
    div.topic-title
      span {{topicName}}
      p.percent
        span {{currentSubIndex + 1}}&nbsp;
        span / {{work.list.length}}
    div.item
      ul.item-list.smart-scroll(v-if="topicType === 'conv'" ref='elmnt')
        li(v-for='(topic, idx) in topicList' :class="{selected: currentSubIndex === idx}" @click='positionTopic(idx)')
          span.item-text.f16.grey6 Dialog {{idx + 1}}
          span.item-status(v-if='topic.showScore && topic.score >= 55' :class='{good: topic.score >= 70, normal: topic.score <= 69}') {{topic.score}}
          span.item-status.bad(v-else-if='topic.showScore && topic.score < 55')
      ul.item-list.smart-scroll.dict(v-else-if="topicType === 'dict'" ref='elmnt')
        li(v-for='(topic, idx) in topicList' :class="{selected: currentSubIndex === idx}" v-if="topic.show == true" @click='positionTopic(idx)')
          span.item-text.f16.grey6 {{topic.content}}
          span.item-status.good(v-if='topic.score === 100') {{topic.score}}
          span.item-status.bad(v-else-if='topic.score < 55')
      ul.item-list.smart-scroll(v-else-if="topicType === 'recite'" ref='elmnt')
        li(v-for='(topic, idx) in topicList' :class="{selected: currentSubIndex === idx}" @click='positionTopic(idx)')
          span.item-text.f16.grey6 {{topic.content}}
          span.item-status(v-if='topic.complete && topic.score >= 55' :class='{good: topic.score >= 70, normal: topic.score <= 69}') {{topic.score}}
          span.item-status.bad(v-else-if='topic.complete && topic.score < 55')
      ul.item-list.smart-scroll(v-else-if="topicType === 'para'" ref='elmnt')
        li(v-for='(topic, idx) in topicList' :class="{selected: currentSubIndex === idx}" @click='positionTopic(idx)')
          span.item-text.f16.grey6 {{topic.content}}
          span.item-status(v-if='topic.showScore && topic.score >= 55' :class='{good: topic.score >= 70, normal: topic.score <= 69}') {{topic.score}}
          span.item-status.bad(v-else-if='topic.showScore && topic.score < 55')
      ul.item-list.smart-scroll(v-else ref='elmnt')
        li(v-for='(topic, idx) in topicList' :class="{selected: currentSubIndex === idx}" @click='positionTopic(idx)')
          span.item-text.f16.grey6 {{topic.content}}
          span.item-status(v-if='topic.score >= 55' :class='{good: topic.score >= 70, normal: topic.score <= 69}') {{topic.score}}
          span.item-status.bad(v-else-if='topic.score < 55')
</template>

<script>
export default {
  name: 'StuWorkLeft',
  props: ['work', 'type', 'currentSubIndex', 'data', 'getCurrentIndex'],
  data() {
    return {
      topicName: '',
      topicType: '',
      topicList: []
    }
  },
  methods: {
    handleTopic() {
      this.topicList = this.work.list
      if (this.work.practiceType === 'tx') { // 听写
        if (Number(this.work.contentType) === 5) {
          this.topicName = '单词纠音'
          this.topicType = 'corr'
        } else {
          this.topicName = '单词听写'
          this.topicType = 'dict'
        }
      } else if (this.work.practiceType === 'bs') { // 背诵
        this.topicName = '段落背诵'
        this.topicType = 'recite'
      } else {
        let tpls = ['word', 'sent', 'para', 'conv']
        this.topicType = tpls[Number(this.work.contentType) - 1]
        if (this.work.practiceType === 'gd') {
          switch (Number(this.work.contentType)) {
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
        } else if (this.work.practiceType === 'ld') {
          switch (Number(this.work.contentType)) {
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
        if (this.topicType === 'dict') {
          this.work.list.forEach((value, idx) => {
            this.work.list[idx].show = false
          })
        }
      }
    },
    handleData() {
      this.topicList = []
      if (this.type === 'dict') {
        if (this.data.show !== null || this.data.show !== undefined) {
          let index = this.data.index
          this.work.list[index].show = this.data.show
          this.work.list[index].score = this.data.score
          this.work.list[index].showScore = this.data.showScore
        }
      } else {
        if (this.data.show !== null || this.data.show !== undefined) {
          this.work.list[this.currentSubIndex].show = this.data.show
        }
        this.work.list[this.currentSubIndex].score = this.data.score
        this.work.list[this.currentSubIndex].showScore = this.data.showScore
        this.work.list[this.currentSubIndex].complete = this.data.complete
      }
      this.topicList = this.work.list
    },
    scrollTOP() {
      if (this.currentSubIndex > 4) {
        let $elmnt = this.$refs.elmnt
        $elmnt.scrollTop = (this.currentSubIndex - 4) * 50
      }
    },
    positionTopic(idx) {
      this.getCurrentIndex(idx)
    }
  },
  watch: {
    data: function(val) {
      this.handleData()
    },
    work: function(val) {
      this.handleTopic()
    },
    currentSubIndex: function(val) {
      this.scrollTOP()
    }
  },
  mounted() {
    this.handleTopic()
    this.scrollTOP()
  }
}
</script>

<style lang='less' scoped>
.panel-left {
  float: left;
  width: 246px;
  padding: 20px 0 0 0; 
  background: #fff;
  height: inherit;
  position: relative;

  & > .topic-title {
    padding-left: 27px;
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    position: relative;

    & > span {
      font-size: 20px;
      color: #21bd73;
    }
    & > .percent {
      position: absolute;
      top: 50%;
      right: 20px;
      height: 20px;
      margin-top: -24px;

      & > span {
        font-size: 16px;
        &:first-child {
          color: #21bd73;
        }
        &:last-child {
          color: #ccc;
        }
      }
    }
  }
  & .item {
    .item-list {
        overflow-y: scroll;
        &.dict {
          & > li.selected {
            background: rgba(33,189,115, 0.06)
          }
        }
        & > li {
        padding-left: 27px;
        height: 50px;
        line-height: 50px;
        position: relative;
        cursor: pointer;

        & > span {
          line-height: 20px;
          &.item-text {
            display: inline-block;
            width: 150px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          &.item-status {
            position: absolute;
            right: 20px;
            top: 50%;
            height: 20px;
            margin-top: -12px;
          }
          &.good {
            font-size: 14px;
            color: #24cc7c;
          }
          &.normal {
            font-size: 14px;
            color: #ff9900;
          }
          &.bad {
            width: 20px;
            background: url('/static/images/practice/icon_score_bad.png') no-repeat center;
          }
        }
        &.selected {
          & > .item-text {
            font-weight: bold;
            color: #21bd73;
          }
        }
      }
    }
  }
  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(33, 189, 115, 0.5)
  }
}
@media screen and (min-height: 801px) {
  .item-list {
    height: 390px;
  }
}
@media screen and (max-height: 800px) {
  .item-list {
    height: 310px;
  }
}
.smart-scroll::-webkit-scrollbar{width:4px;height:12px;}
.smart-scroll::-webkit-scrollbar-button:vertical{display:none;}
.smart-scroll::-webkit-scrollbar-track:vertical{background-color:black;}
.smart-scroll::-webkit-scrollbar-track-piece{background:#FFF;}
.smart-scroll::-webkit-scrollbar-thumb:vertical{background-color:#75d6a8;border-radius:3px;}
.smart-scroll::-webkit-scrollbar-thumb:vertical:hover{background-color:#75d6a8;}
.smart-scroll::-webkit-scrollbar-corner:vertical{background-color:#75d6a8;}
.smart-scroll::-webkit-scrollbar-resizer:vertical{background-color:#FF6E00;}
</style>