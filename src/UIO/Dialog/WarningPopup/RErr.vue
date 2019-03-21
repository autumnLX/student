<template lang="pug">
  div.warning-popup2
    div
      img(:src='dialogConfig.icon')
      i.close(@click='dialogConfig.onHide' v-if='dialogConfig.cancel')
      p.text1 {{ dialogConfig.text1 }}
      p.text2.f18 {{ dialogConfig.text2 }}
      p.text3.f18 {{ dialogConfig.text3 }}
        label.f18(@click='dialogConfig.callback1') {{ dialogConfig.btn1 }}
</template>

<script>
export default {
  name: 'WarningPopup',
  props: ['dialogConfig'],
}
</script>

<style lang="less">
.warning-popup2 {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);

  & > div {
    position: relative;
    width: 400px;
    height: 250px;
    padding-top: 80px;
    border-radius: 20px;
    background-color: #fff;
    text-align: center;

    img {
      position: absolute;
      top: -86px;
      left: 85px;
      width: 230px;
      height: 150px;
    }

    .close {
      position: absolute;
      top: -16px;
      right: -22px;
      width: 50px;
      height: 50px;
      background-image: url("/static/images/practice/exam/btn_frameclose.png");
      cursor: pointer;
    }

    p {
      margin: 0;
      text-align: center;

      &.text1 {
        margin: 0;
        height: 30px;
        color: #333;
        font-size: 20px;
        line-height: 30px;
      }

      &.text2, &.text3 {
        height: 24px;
        color: #999;
        line-height: 24px;

        label {
          color: #ff881b;
          cursor: pointer;
        }
      }

      &.text2 {
        margin-top: 38px;
        margin-bottom: 4px;
        position: relative;
        padding: 0 34px;
        display: inline-block;

        &:before, &:after {
          content: '';
          width: 26px;
          height: 0;
          border-bottom: 1px solid #999;
          position: absolute;
          top: 50%;
        }

        &:before {
          left: 0;
        }

        &:after {
          right: 0;
        }
      }
    }
  }
}
</style>
