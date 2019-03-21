<template lang="pug">
  div.kami-ui-loading
    div(:class='"idx" + idx')
    span.text1(v-if='text') {{ text }}
</template>

<script>
export default {
  name: 'KamiUiLoading',
  props: {
    text: {
      type: String,
      default: '正在加载...'
    }
  },
  data() {
    return {
      idx: 0
    }
  },
  mounted() {
    setInterval(() => {
      if (this.idx === 3) {
        this.idx = 0
      } else {
        this.idx += 1
      }
    }, 400)
  }
}
</script>

<style lang="less">
.kami-ui-loading {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // width: 500px;
  // height: 250px;
  // padding-top: 60px;
  // border-radius: 20px;
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  // background-color: rgba(255, 255, 255, 0.8);

  .text1 {
    color: #21bd73;
    font-size: 24px;
    font-weight: bold;
  }

  div {
    width: 100px;
    height: 100px;
    margin-bottom: 16px;
    background-image: url("/static/images/practice/exam/uploading.png");

    &.idx0 {
      background-position-x: 0;
    }

    &.idx1 {
      background-position-x: -100px;
    }

    &.idx2 {
      background-position-x: -200px;
    }

    &.idx3 {
      background-position-x: -300px;
    }
  }
}
</style>
