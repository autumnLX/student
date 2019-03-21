<template lang="pug">
  div.tab
    ul
      li(v-for='(o, idx) of list' :class='{active: o.selected}' @click='handleChangeTab(idx, o)') {{ o.title }}
</template>

<script>
export default {
  name: 'Nav',
  props: ['list', 'onChangeTab'],
  methods: {
    handleChangeTab(value) {
      this.onChangeTab(value)
    }
  }
}
</script>

<style lang="less">
.tab {
  padding: 10px 30px 0;
  border-bottom: 1px solid #efefef;

  ul {
    display: flex;
    align-items: center;

    li {
      height: 60px;
      margin-left: 40px;
      border-bottom: 2px solid transparent;
      color: #999;
      font-size: 16px;
      line-height: 60px;
      cursor: pointer;

      &:first-child {
        margin-left: 0;
      }

      &.active {
        color: #21bd73;
        border-color: #21bd73;
      }
    }
  }
}
</style>
