<template lang="pug">
  .stage
    div.top
      i.icon.checkbox(:class='{ active: stage.checkAll }' @click='handleToggleCheckAll')
      span.f16.gray6 {{ stage.name }}
      i.icon.eye(@click='onClickEye(idx)')
    div.bottom.kqyx
      Type(v-for='(t, idx) of stage.type' :key='"type" + idx' :idx='idx' :type='t' :iconType="t.iconType" :isNew="t.type === 'phrase'" :onClick='handleClick')
</template>

<script>
import Type from './Type'

export default {
  name: 'StuSyncStage',
  components: { Type },
  props: ['idx', 'stage', 'onClick', 'onClickEye'],
  methods: {
    handleClick (typeIdx, selected) {
      this.onClick(this.idx, typeIdx, selected)
    },
    handleToggleCheckAll () {
      this.onClick(this.idx, null, !this.stage.checkAll)
    }
  },
  mounted () {
    console.log(this.stage.type)
  }
}
</script>

<style lang="less">
#stu-sync .homework .stage {
  margin-top: 20px;

  .top {
    display: flex;
    align-items: center;
    height: 50px;

    .icon {
      width: 16px;
      height: 16px;

      &.checkbox {
        margin-right: 10px;
        background-image: url('/static/images/icon_common.png');
        cursor: pointer;

        &.active {
          background-position-x: -16px;
        }
      }

      &.eye {
        margin-left: 10px;
        background-image: url('/static/images/icon_common.png');
        background-position-x: -64px;
        cursor: pointer;

        &.active,
        &:hover {
          background-position-x: -80px;
        }
      }
    }
  }

  .bottom {
    display: flex;
    // justify-content: space-between;
    padding: 0 34px 0 26px;
  }
}
</style>
