<template lang="pug">
  div.type(:class='{ disabled: type.disabled, active: type.selected }' @click='handleClick')
    img(src="/static/images/ico_new_stu.png" v-if="isNew")
    div.icon(:class='type.iconType')
    span {{ type.name }}
    i.iconfont(@click.stop="dispatch('StuSync','showHelp')"  v-if="isNew") &#xe63b;
</template>

<script>
import emitter from '@/ui/src/mixins/emitter'
export default {
  name: 'StuSyncType',
  props: ['idx', 'type', 'onClick', 'isNew'],
  mixins: [emitter],
  methods: {
    handleClick () {
      const type = this.type
      if (!type.disabled) {
        this.onClick(this.idx, !type.selected)
      }
    }
  }
}
</script>

<style lang="less" scoped>
#stu-sync .homework .stage .type {
  width: 170px;
  height: 80px;
  display: flex;
  padding-left: 10px;
  margin-right: 50px;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  background-image: url('/static/images/stu/sync/bg_workstyle.png');
  cursor: pointer;
  img {
    position: absolute;
    top: 0;
    right: 0;
  }
  .icon {
    background-image: url('/static/images/icon50x60workstyle.png');
    width: 50px;
    height: 60px;
    margin-right: 10px;

    &.word {
      background-position-y: 120px;
    }
    &.sent {
      background-position: -50px 120px;
    }
    &.para {
      background-position: -100px 120px;
    }
    &.dialog {
      background-position: -150px 120px;
    }
    &.word_2 {
      background-position: -250px 120px;
    }
    &.word_3 {
      background-position: -200px 120px;
    }
    &.sent_2 {
      background-position: -300px 120px;
    }
    &.para_2 {
      background-position: -350px 120px;
    }
    &.dialog_2 {
      background-position: -400px 120px;
    }
    &.recite {
      background-position: -450px 120px;
    }
  }

  span,
  .iconfont {
    font-size: 16px;
    color: #21bd73;
    cursor: pointer;
  }

  &.active {
    background-position-x: -170px;

    .icon {
     background-position-y: 0;
    }
    span,
    .iconfont {
      color: #fff;
    }
  }

  &.disabled {
    background-image: none;
    background-color: #f8f8f8;
    cursor: not-allowed;

    .icon {
      background-position-y: 60px;
    }

    span,
    .iconfont {
      color: #ccc;
    }
  }
}
#stu-sync .iconfont {
  margin-top: 2px;
  margin-left: 2px;
}
#stu-sync .homework .stage .type:last-child {
  margin-right: 0;
}
</style>
