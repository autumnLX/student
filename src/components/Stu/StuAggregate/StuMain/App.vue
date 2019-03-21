<template lang="pug">
  #stu-AggreGate
    div.gate-title
      Nav(:list='nav')
      div.type
        span {{$t('Stu.lowScore.type')}}
        ul
          li(v-for="(o, idx) in topicTypeList" :class="{active: o.selectFlag}" @click="toggleType(idx)") {{o.topicName}}
    component(
      :is='currentView'
      :handleErrTwice='handleErrTwice'
    )
</template>

<script>

import DiaLog from '@/UIO/DiaLog/App'
import PaperPractice from '@/components/Stu/StuAggregate/StuMain/PaperPractice'
import BookPractice from '@/components/Stu/StuAggregate/StuMain/BookPractice'
export default {
  name: 'StuAggregate',
  props: ['handleErrTwice'],
  components: Object.assign({}, {DiaLog, PaperPractice, BookPractice}),
  data () {
    return {
      nav: [{
        title: '首页',
        href: 'stuIndex'
      }, {
        title: '低分集',
        hoverText: '收录了作业及测评中低于55分的题',
        hover: true
      }],
      topicTypeList: [{
        topicName: '教材练习',
        selectFlag: true,
        name: 'bookPractice'
      }, {
        topicName: '试卷练习',
        selectFlag: false,
        name: 'paperPractice'
      }],
      currentView: 'BookPractice'
    }
  },
  methods: {
    toggleType(n) {
      for (let i = 0; i < this.topicTypeList.length; i++) {
        this.topicTypeList[i].selectFlag = false
      }
      this.topicTypeList[n].selectFlag = !this.topicTypeList[n].selectFlag
      if (this.topicTypeList[n].name === 'bookPractice') {
        this.currentView = 'BookPractice'
      } else if (this.topicTypeList[n].name === 'paperPractice') {
        this.currentView = 'PaperPractice'
      }
    }
  },
  mounted() {
    if (this.$route.query.isPaper) {
      for (let i = 0; i < this.topicTypeList.length; i++) {
        if (this.topicTypeList[i].name === 'paperPractice') {
          this.topicTypeList[i].selectFlag = true
        } else {
          this.topicTypeList[i].selectFlag = false
        }
      }
      this.currentView = 'PaperPractice'
    }
  }
}
</script>

<style lang='less' scoped>
@image-base-url: "../../../../assets/image";
#stu-AggreGate {
  width: inherit;
}
.gate-title {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  
  .type {
    padding: 30px;
    height: 84px;
    display: flex;
    align-items: center;

    span {
      color: #999;
      font-size: 14px;
      margin-right: 30px;
    }

    ul {
      display: flex;
      align-items: center;
      li {
        width: auto;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        color: #666;
        padding: 0 18px;
        border-radius: 4px;
        cursor: pointer;
        &.active {
          background-color: #24cc7c;
          color: #fff;
        }
      }
    }
  }
}
</style>