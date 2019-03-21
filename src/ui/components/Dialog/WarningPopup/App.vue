<template lang="pug">
  div.warning-popup
    div
      img(:src='dialogConfig.icon')
      i.close(@click='dialogConfig.onHide' v-if='dialogConfig.cancel')
      p.text1 {{ dialogConfig.text1 }}
      p.text2 {{ dialogConfig.text2 }}
      div
        button.grey(@click='dialogConfig.callback2' v-if='dialogConfig.btn2') {{ dialogConfig.btn2 }}
        button.orange(@click='dialogConfig.callback1') {{ dialogConfig.btn1 }}
</template>

<script>
export default {
  name: 'WarningPopup',
  props: ['dialogConfig'],
}
</script>

<style lang="less">
.warning-popup {
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

      &.text2 {
        height: 24px;
        color: #999;
        line-height: 24px;
      }
    }

    div {
      margin-top: 36px;
      text-align: center;

      button {
        width: 140px;
        height: 50px;
        margin: 0 20px;
        border: 0;
        border-radius: 25px;
        color: #fff;
        font-size: 18px;
        text-align: center;
        line-height: 50px;
        cursor: pointer;

        &.grey {
          background-color: #7c94a8;
        }

        &.orange {
          background-color: #ff881b;
        }
      }
    }
  }
}
</style>
