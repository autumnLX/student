<template lang="pug">
  div#vip
    img(src='/static/images/stu/vip/vip1.png')
    img(src='/static/images/stu/vip/vip2.png')
    button(@click='handleShowVipModal')
    img(src='/static/images/stu/vip/vip3.png')
    img(src='/static/images/stu/vip/vip4.png')
</template>

<script>
export default {
  name: 'NoPain',
  methods: {
    handleShowVipModal() {
      this.$store.commit('toggleChargeModel')
    }
  }
}
</script>

<style lang="less">
#vip {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;

  button {
    width: 500px;
    height: 122px;
    border: 0;
    background-color: transparent;
    background-image: url("/static/images/stu/vip/btn_normal.png");

    &:hover {
      background-image: url("/static/images/stu/vip/btn_hover.png");
      cursor: pointer;
    }
  }
}
</style>
