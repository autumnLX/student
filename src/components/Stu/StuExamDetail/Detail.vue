<template lang="pug">
  div.tab-container.desc
    div.row
      label 开始时间
      span {{ info.startDate }}
    div.row
      label 结束时间
      span {{ info.endDate }}
    div.row
      label 成绩公布
      span {{ info.showTimeFlag == 1 && info.showTime ? info.showTime : '实时公布' }}
    div.row(v-if='info.introduce.length')
      label 测评信息
    div.introduce(v-html='info.introduce')
</template>

<script>
export default {
  name: 'ExamDetail',
  props: ['info']
}
</script>

<style lang="less" scoped>
.desc {
  padding-bottom: 1px;

  .row {
    display: flex;
    align-items: center;
    height: 30px;
    margin: 20px 0;

    &::before {
      content: "";
      width: 8px;
      height: 8px;
      margin-right: 10px;
      border-radius: 4px;
      background-color: #24cc7c;
    }

    label {
      color: #666;
    }

    span {
      margin-left: 20px;
      color: #999;
    }
  }

  .introduce {
    margin: 20px 0;
  }
}
</style>
